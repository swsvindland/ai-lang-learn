import { course, type GrammarPoint, type ScriptEntry, type ScriptName } from '@/lib/curriculum';
import { all, run } from '@/lib/db';
import { grammarMastery } from '@/lib/learner';
import { isLearned } from '@/lib/srs';

/**
 * The reading track: kana, then kanji, taught alongside the main course. This
 * module answers "what has the learner met / learned?" for pacing and for
 * fading reading aids.
 */

export type ScriptKnowledge = {
  /** Track item ids the learner has been introduced to. */
  introducedIds: Set<string>;
  /** Characters the learner can read (introduced), with derived forms such as small kana. */
  readable: Set<string>;
  /** Characters the learner knows solidly (in review), with derived forms. Reading aids fade for these. */
  known: Set<string>;
};

const EMPTY: ScriptKnowledge = { introducedIds: new Set(), readable: new Set(), known: new Set() };

const SMALL_TO_LARGE: Record<string, string> = {
  ぁ: 'あ', ぃ: 'い', ぅ: 'う', ぇ: 'え', ぉ: 'お', ゃ: 'や', ゅ: 'ゆ', ょ: 'よ', ゎ: 'わ', っ: 'つ',
  ァ: 'ア', ィ: 'イ', ゥ: 'ウ', ェ: 'エ', ォ: 'オ', ャ: 'ヤ', ュ: 'ユ', ョ: 'ヨ', ヮ: 'ワ', ッ: 'ツ',
};

const toHira = (c: string) => String.fromCharCode(c.charCodeAt(0) - 0x60);

/**
 * Adds forms that follow from what's learned: small kana from their full-size
 * versions, voiced katakana (ガ) once both カ and が are learned, and the long-vowel mark.
 */
function expand(chars: Set<string>) {
  const out = new Set(chars);
  for (const char of chars) for (const c of char) out.add(c);
  out.add('ー');
  for (const [small, large] of Object.entries(SMALL_TO_LARGE)) if (out.has(large)) out.add(small);
  for (let code = 0x30ab; code <= 0x30fa; code++) {
    const kata = String.fromCharCode(code);
    const [base, mark] = [...kata.normalize('NFD')];
    if (mark && out.has(base) && out.has(toHira(kata))) out.add(kata);
  }
  if (out.has('ウ') && out.has('ぶ')) out.add('ヴ');
  return out;
}

/** Introduced and solidly-known reading-track characters. One query over recognition cards. */
export function scriptKnowledge(): ScriptKnowledge {
  const { scriptById } = course();
  if (!scriptById.size) return EMPTY;
  const rows = all<{ vocab_id: string; state: 'new' | 'learning' | 'review' | 'relearning'; interval_days: number }>(
    `SELECT vocab_id, state, interval_days FROM cards WHERE direction = 'es_en'`
  );
  const introducedIds = new Set<string>();
  const readable = new Set<string>();
  const known = new Set<string>();
  for (const row of rows) {
    const entry = scriptById.get(row.vocab_id);
    if (!entry) continue;
    introducedIds.add(row.vocab_id);
    readable.add(entry.vocab.text);
    if (isLearned(row)) known.add(entry.vocab.text);
  }
  return { introducedIds, readable: expand(readable), known: expand(known) };
}

/**
 * The next track items to introduce. Kanji wait until the main course is
 * within a couple of units of the first word that uses them, so new kanji show
 * up in words the learner is about to say anyway.
 */
export function nextScriptItems(limit: number, currentUnitOrder: number, introducedIds: Set<string>): ScriptEntry[] {
  const out: ScriptEntry[] = [];
  for (const entry of course().scriptTrack) {
    if (out.length >= limit) break;
    if (introducedIds.has(entry.vocab.id)) continue;
    const ahead = entry.firstUnitOrder !== Infinity && entry.firstUnitOrder > currentUnitOrder + 2;
    if (entry.group.script === 'kanji' && ahead) continue;
    out.push(entry);
  }
  return out;
}

/**
 * A group lesson to show before introducing `entry`: one at the start of the
 * group, then one every few characters. `queued` holds lessons already lined up
 * this session (not yet marked as seen).
 */
export function lessonBefore(entry: ScriptEntry, introducedIds: Set<string>, queued: Set<string>): GrammarPoint | null {
  const { group } = entry;
  const done = group.items.filter((v) => introducedIds.has(v.id)).length;
  for (let i = 0; i < group.lessons.length; i++) {
    const lesson = group.lessons[i];
    if (done >= i * 5 && !queued.has(lesson.id) && !grammarMastery(lesson.id)?.introduced_at) return lesson;
  }
  return null;
}

/** Lessons already shown, so their drills can be practiced. */
export function seenLessons(): GrammarPoint[] {
  const lessons = course().scriptTrack.flatMap((e) => e.group.lessons);
  const unique = [...new Map(lessons.map((l) => [l.id, l])).values()];
  return unique.filter((l) => !!grammarMastery(l.id)?.introduced_at);
}

export type ScriptProgress = { script: ScriptName; label: string; introduced: number; known: number; total: number }[];

/** Per-script counts for the Journey screen. Kanji are split by JLPT level. */
export function scriptProgress(): ScriptProgress {
  const { scriptTrack } = course();
  if (!scriptTrack.length) return [];
  const k = scriptKnowledge();
  const rows: ScriptProgress = [];
  const add = (script: ScriptName, label: string, entries: ScriptEntry[]) => {
    if (!entries.length) return;
    rows.push({
      script,
      label,
      total: entries.length,
      introduced: entries.filter((e) => k.introducedIds.has(e.vocab.id)).length,
      known: entries.filter((e) => k.known.has(e.vocab.text)).length,
    });
  };
  add('hiragana', 'Hiragana', scriptTrack.filter((e) => e.group.script === 'hiragana'));
  add('katakana', 'Katakana', scriptTrack.filter((e) => e.group.script === 'katakana'));
  for (const level of [5, 4, 3, 2, 1]) {
    add('kanji', `Kanji N${level}`, scriptTrack.filter((e) => e.vocab.kanji?.jlpt === level));
  }
  return rows;
}

/**
 * For learners who can already read some script (set during onboarding):
 * queue those characters for the quick "do you still know it?" refresh rather
 * than teaching them from scratch.
 */
export function queueScriptRefresh(scripts: ScriptName[], kanjiLevels: number[] = []) {
  for (const entry of course().scriptTrack) {
    const kanji = entry.vocab.kanji;
    const include = kanji ? kanjiLevels.includes(kanji.jlpt) : scripts.includes(entry.group.script);
    if (include) {
      run(`INSERT OR IGNORE INTO vocab_refresh (vocab_id, unit_order, status) VALUES (?, 0, 'pending')`, [entry.vocab.id]);
    }
  }
}

/** True for reading-track items (kana/kanji characters) as opposed to course vocabulary. */
export function isScriptItem(vocabId: string) {
  return course().scriptById.has(vocabId);
}
