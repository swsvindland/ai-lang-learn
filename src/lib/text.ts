import { toHiragana } from 'wanakana';

import type { Sentence } from '@/lib/curriculum/types';
import { kataToHira, stripPunctuation } from '@/lib/japanese/furigana';
import { language } from '@/lib/languages';

/** Lowercase, strip punctuation, and optionally accents, for lenient comparison of Latin-script text. */
export function normalize(text: string, { keepAccents = false } = {}) {
  let t = text.toLowerCase().normalize('NFC');
  if (!keepAccents) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t
    .replace(/[¿¡!?.,;:"“”«»()\-–—…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function words(text: string, opts?: { keepAccents?: boolean }) {
  const n = normalize(text, opts);
  return n ? n.split(' ') : [];
}

function levenshtein<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean = (x, y) => x === y) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (eq(a[i - 1], b[j - 1]) ? 0 : 1)
      );
    }
  }
  return dp;
}

export function charSimilarity(a: string, b: string) {
  const x = [...a];
  const y = [...b];
  if (!x.length && !y.length) return 1;
  const d = levenshtein(x, y)[x.length][y.length];
  return 1 - d / Math.max(x.length, y.length);
}

export type WordMatch = { word: string; status: 'ok' | 'close' | 'missing' };

export type Comparison = { score: number; matches: WordMatch[] };

/**
 * Word-level alignment of what the learner said/typed against the target.
 * Returns a 0..1 score plus per-target-word status for display. For Japanese,
 * which has no spaces, this aligns characters instead, against both the text
 * and its kana reading (speech recognition and typing may produce either).
 */
export function compareSentences(target: string, attempt: string, reading?: string): Comparison {
  if (!language().spaced) {
    const byText = compareChars(target, attempt);
    if (!reading) return byText;
    const byReading = compareChars(reading, attempt);
    return byReading.score > byText.score ? byReading : byText;
  }
  return compareWords(target, attempt);
}

function compareWords(target: string, attempt: string): Comparison {
  const t = words(target);
  const a = words(attempt);
  const display = target.split(/\s+/).filter(Boolean);
  const close = (x: string, y: string) => x === y || charSimilarity(x, y) >= 0.75;
  const dp = levenshtein(t, a, close);

  // Walk back through the table to label each target word.
  const status: WordMatch['status'][] = Array(t.length).fill('missing');
  let i = t.length;
  let j = a.length;
  while (i > 0 && j > 0) {
    const cost = close(t[i - 1], a[j - 1]) ? 0 : 1;
    if (dp[i][j] === dp[i - 1][j - 1] + cost) {
      if (cost === 0) status[i - 1] = t[i - 1] === a[j - 1] ? 'ok' : 'close';
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j] + 1) {
      i--;
    } else {
      j--;
    }
  }

  const credit = status.reduce((s, st) => s + (st === 'ok' ? 1 : st === 'close' ? 0.6 : 0), 0);
  const extra = Math.max(0, a.length - t.length);
  const score = t.length ? Math.max(0, (credit - extra * 0.25) / t.length) : a.length ? 0 : 1;
  const matches: WordMatch[] = display.map((word, k) => ({ word, status: status[k] ?? 'missing' }));
  return { score, matches };
}

// ---------- Japanese ----------

/** Width, case, punctuation and spacing differences never matter. */
function normalizeJa(text: string) {
  return stripPunctuation(text.normalize('NFKC').toLowerCase());
}

// A vowel after a kana from its own row (or い after e, う after o) lengthens it.
const LONG_VOWEL_AFTER: Record<string, string> = {
  あ: 'あかがさざただなはばぱまやゃらわ',
  い: 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ',
  う: 'うくぐすずつづぬふぶぷむゆゅるおこごそぞとどのほぼぽもよょろ',
  え: 'えけげせぜてでねへべぺめれ',
  お: 'おこごそぞとどのほぼぽもよょろ',
};
// Romaji can't tell these apart, and they sound the same.
const KANA_VARIANT: Record<string, string> = { づ: 'ず', ぢ: 'じ' };

/**
 * Folds spelling differences a learner shouldn't lose points for: katakana vs
 * hiragana (already converted) and how a long vowel is written (おう/おお/ー all
 * become ー). Vowel length itself still counts: おばあさん ≠ おばさん. Works on
 * single characters so the target's display characters keep a 1:1 mapping to
 * comparison keys; '' means "ignore".
 */
function foldSequence(chars: string[]): string[] {
  let prev = '';
  return chars.map((c) => {
    let k = KANA_VARIANT[c] ?? c;
    if (k === 'ー' || (prev && LONG_VOWEL_AFTER[k]?.includes(prev))) return 'ー';
    if (k) prev = k;
    return k;
  });
}

function toKanaChars(text: string) {
  return [...toHiragana(text, { convertLongVowelMark: false })];
}

// Romaji spells particles by sound; the target text spells them は/を/へ.
const ROMAJI_PARTICLE: Record<string, string> = { wa: 'ha', o: 'wo', e: 'he', konnichiwa: 'konnichiha', konbanwa: 'konbanha' };

/** Learner input → folded kana. Romaji words are respelled first so "watashi wa" matches わたしは. */
function foldAnswer(text: string) {
  const respelled = text
    .normalize('NFKC')
    .toLowerCase()
    .split(/(\s+)/)
    .map((word) => {
      const bare = word.replace(/[^a-z]/g, '');
      return ROMAJI_PARTICLE[bare] ? word.replace(bare, ROMAJI_PARTICLE[bare]) : word;
    })
    .join('');
  return foldSequence(toKanaChars(stripPunctuation(respelled))).join('');
}

/** Target text or reading → folded kana. */
function foldTarget(text: string) {
  return foldSequence(toKanaChars(normalizeJa(text))).join('');
}

function compareChars(target: string, attempt: string): Comparison {
  // Display units: the target's characters (punctuation rides along with its neighbor).
  const chars = [...target.replace(/\s+/g, '')];
  // Each display character maps to one comparison key ('' for punctuation and folded-away letters).
  const keys = foldSequence(
    chars.map((c) => (stripPunctuation(c) ? toKanaChars(c.normalize('NFKC').toLowerCase()).join('') : ''))
  );
  const units = chars.map((char, i) => ({ char, key: keys[i] }));
  const t = units.filter((u) => u.key).map((u) => u.key);
  const a = [...foldAnswer(attempt)];
  const dp = levenshtein(t, a);
  const status: WordMatch['status'][] = Array(t.length).fill('missing');
  let i = t.length;
  let j = a.length;
  while (i > 0 && j > 0) {
    const cost = t[i - 1] === a[j - 1] ? 0 : 1;
    if (dp[i][j] === dp[i - 1][j - 1] + cost) {
      if (cost === 0) status[i - 1] = 'ok';
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j] + 1) {
      i--;
    } else {
      j--;
    }
  }
  const ok = status.filter((st) => st === 'ok').length;
  const extra = Math.max(0, a.length - t.length);
  const score = t.length ? Math.max(0, (ok - extra * 0.5) / t.length) : a.length ? 0 : 1;

  // Group runs of the same status so the diff reads as chunks rather than single letters.
  const matches: WordMatch[] = [];
  let k = 0;
  for (const unit of units) {
    const st = unit.key ? status[k++] : matches[matches.length - 1]?.status ?? 'ok';
    const last = matches[matches.length - 1];
    if (last && last.status === st) last.word += unit.char;
    else matches.push({ word: unit.char, status: st });
  }
  return { score, matches };
}

/**
 * Exact-ish answer check for typed short answers. `slip` marks answers that are
 * right apart from a spelling detail: missing accents (Spanish), or kana/romaji
 * where the target uses kanji or the other kana script (Japanese).
 */
export function checkTyped(expected: string, given: string, reading?: string) {
  if (!language().spaced) {
    const exact = normalizeJa(expected) === normalizeJa(given);
    if (exact) return { correct: true, slip: false };
    const g = foldAnswer(given);
    const loose = foldTarget(expected) === g || (!!reading && foldTarget(reading) === g);
    return { correct: loose, slip: loose };
  }
  const exact = normalize(expected, { keepAccents: true }) === normalize(given, { keepAccents: true });
  if (exact) return { correct: true, slip: false };
  const loose = normalize(expected) === normalize(given);
  return { correct: loose, slip: loose };
}

/** Rough length in words, for picking sentences that suit an exercise. */
export function sentenceLength(s: Pick<Sentence, 'text' | 'reading'>) {
  if (language().spaced) return words(s.text).length;
  if (s.reading) return s.reading.trim().split(/\s+/).length;
  // No reading to count words from: Japanese averages a little over two characters a word.
  return Math.ceil(stripPunctuation(s.text).length / 2.5);
}

/** Loose comparison key, e.g. for de-duplicating sentences regardless of punctuation or script. */
export function comparisonKey(text: string) {
  return language().spaced ? normalize(text) : kataToHira(normalizeJa(text));
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}
