import { getVocab, unitDifficulty, type Unit, type VocabItem } from '@/lib/curriculum';
import { all, first, run, transaction, uid } from '@/lib/db';
import { language } from '@/lib/languages';
import { newCard, schedule, type CardState, type Grade, type SrsCard } from '@/lib/srs';

export type Direction = 'es_en' | 'en_es';

export type CardRow = SrsCard & {
  id: string;
  vocab_id: string;
  direction: Direction;
  state: CardState;
};

export type ResolvedVocab = { vocab: VocabItem; unit: Unit | null; difficulty: number };

// Columns are named for the original Spanish-only schema: `es` holds target-language text.
type CustomVocabRow = {
  id: string;
  es: string;
  reading: string | null;
  en: string;
  pos: VocabItem['pos'];
  gender: 'm' | 'f' | null;
  example_es: string;
  example_en: string;
};

/** Bundled vocab or words the learner saved from homework/conversations. */
export function resolveVocab(id: string, fallbackDifficulty = 50): ResolvedVocab | null {
  const bundled = getVocab(id);
  if (bundled) return { ...bundled, difficulty: unitDifficulty(bundled.unit) };
  const row = first<CustomVocabRow>('SELECT * FROM custom_vocab WHERE id = ?', [id]);
  if (!row) return null;
  return {
    vocab: {
      id: row.id,
      text: row.es,
      reading: row.reading ?? undefined,
      en: row.en,
      pos: row.pos,
      gender: row.gender ?? undefined,
      example: { text: row.example_es, en: row.example_en },
    },
    unit: null,
    difficulty: fallbackDifficulty,
  };
}

export function addCustomVocab(v: Omit<VocabItem, 'id'>, source: string) {
  const id = uid('cv-');
  run(
    `INSERT INTO custom_vocab (id, es, reading, en, pos, gender, example_es, example_en, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, v.text, v.reading ?? null, v.en, v.pos, v.gender ?? null, v.example.text, v.example.en, source, Date.now()]
  );
  introduceVocab(id);
  return id;
}

/**
 * Creates recognition (es→en) and production (en→es) cards. Production starts
 * a day later so a brand-new word isn't drilled both ways in one sitting.
 */
export function introduceVocab(vocabId: string, now = Date.now()) {
  transaction(() => {
    const base = newCard(now);
    for (const direction of ['es_en', 'en_es'] as const) {
      run(
        `INSERT OR IGNORE INTO cards (id, vocab_id, direction, state, due, interval_days, ease, step, reps, lapses, last_review, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${vocabId}:${direction}`,
          vocabId,
          direction,
          'new',
          direction === 'es_en' ? now : now + 20 * 3_600_000,
          base.interval_days,
          base.ease,
          0,
          0,
          0,
          null,
          now,
        ]
      );
    }
  });
}

/**
 * For a word the learner already knows (placement refresh): recognition goes
 * straight to review a few days out; production starts as a new card tomorrow,
 * since recognizing a word doesn't mean you can produce it.
 */
export function markKnownVocab(vocabId: string, now = Date.now()) {
  const days = 5;
  transaction(() => {
    run(
      `INSERT OR IGNORE INTO cards (id, vocab_id, direction, state, due, interval_days, ease, step, reps, lapses, last_review, created_at)
       VALUES (?, ?, 'es_en', 'review', ?, ?, 2.5, 0, 1, 0, ?, ?)`,
      [`${vocabId}:es_en`, vocabId, now + days * 86_400_000, days, now, now]
    );
    run(
      `INSERT OR IGNORE INTO cards (id, vocab_id, direction, state, due, interval_days, ease, step, reps, lapses, last_review, created_at)
       VALUES (?, ?, 'en_es', 'new', ?, 0, 2.5, 0, 0, 0, NULL, ?)`,
      [`${vocabId}:en_es`, vocabId, now + 86_400_000, now]
    );
  });
}

export function isIntroduced(vocabId: string) {
  return !!first('SELECT 1 FROM cards WHERE vocab_id = ? LIMIT 1', [vocabId]);
}

export function dueCards(limit: number, now = Date.now(), excludeIds: string[] = []): CardRow[] {
  const exclude = excludeIds.length ? `AND id NOT IN (${excludeIds.map(() => '?').join(',')})` : '';
  return all<CardRow>(
    `SELECT * FROM cards WHERE due <= ? ${exclude}
     ORDER BY CASE state WHEN 'relearning' THEN 0 WHEN 'learning' THEN 1 ELSE 2 END, due LIMIT ?`,
    [now, ...excludeIds, limit]
  );
}

export function dueCount(now = Date.now()) {
  return first<{ n: number }>('SELECT COUNT(*) AS n FROM cards WHERE due <= ?', [now])?.n ?? 0;
}

export function reviewCard(card: CardRow, grade: Grade, now = Date.now()) {
  const next = schedule(card, grade, now);
  run(
    `UPDATE cards SET state = ?, due = ?, interval_days = ?, ease = ?, step = ?, reps = ?, lapses = ?, last_review = ?
     WHERE id = ?`,
    [next.state, next.due, next.interval_days, next.ease, next.step, next.reps, next.lapses, next.last_review, card.id]
  );
  return next;
}

export function cardFor(vocabId: string, direction: Direction) {
  return first<CardRow>('SELECT * FROM cards WHERE vocab_id = ? AND direction = ?', [vocabId, direction]);
}

/** Vocab the learner has seen, most recent first — used to keep AI content in known words. */
export function knownVocab(limit = 60): VocabItem[] {
  const rows = all<{ vocab_id: string }>(
    `SELECT vocab_id FROM cards WHERE direction = 'es_en' ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => resolveVocab(r.vocab_id)?.vocab).filter((v): v is VocabItem => !!v);
}

export function weakVocab(limit = 10): VocabItem[] {
  const rows = all<{ vocab_id: string }>(
    `SELECT vocab_id FROM cards WHERE reps > 0 ORDER BY lapses DESC, ease ASC LIMIT ?`,
    [limit]
  );
  return rows.map((r) => resolveVocab(r.vocab_id)?.vocab).filter((v): v is VocabItem => !!v);
}

// Feminine nouns starting with a stressed "a" take "el" in the singular.
const STRESSED_A_NOUNS = new Set(['agua', 'águila', 'alma', 'arma', 'área', 'hambre', 'hacha', 'ave', 'aula', 'hada', 'ala', 'ancla', 'arpa', 'ama']);

/**
 * How a word is shown on cards. Spanish nouns get their article when we can
 * tell they're singular; plural-looking nouns get a gender tag.
 */
export function vocabLabel(v: VocabItem) {
  if (language().code !== 'es' || v.pos !== 'noun' || !v.gender) return v.text;
  const head = v.text.split(' ')[0].toLowerCase();
  if (head.endsWith('s')) return `${v.text} (${v.gender === 'm' ? 'masc.' : 'fem.'})`;
  const article = v.gender === 'm' || STRESSED_A_NOUNS.has(head) ? 'el' : 'la';
  return `${article} ${v.text}`;
}
