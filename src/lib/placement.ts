import {
  CEFR_LEVELS,
  LEVEL_SPAN,
  ratingProgress,
  ratingToCefr,
  units,
  type Cefr,
  type Sentence,
  type Unit,
  type VocabItem,
} from '@/lib/curriculum';
import type { Skill } from '@/lib/learner';
import { charSimilarity, normalize, sample, shuffle } from '@/lib/text';

export type Background = 'none' | 'little' | 'school' | 'lots' | 'heritage';
export type LastUsed = 'recent' | 'years' | 'long';

export const BACKGROUND_OPTIONS: { value: Background; label: string; detail: string }[] = [
  { value: 'none', label: 'Never studied it', detail: 'Starting from zero' },
  { value: 'little', label: 'A little', detail: 'An app, a short course, or travel phrases' },
  { value: 'school', label: 'Classes in school', detail: 'High school or college, 1–3 years' },
  { value: 'lots', label: 'A lot', detail: '4+ years, a major, or lived somewhere Spanish-speaking' },
  { value: 'heritage', label: 'Grew up around it', detail: 'Heard or spoke it at home' },
];

export const LAST_USED_OPTIONS: { value: LastUsed; label: string }[] = [
  { value: 'recent', label: 'Within the last year' },
  { value: 'years', label: '1–5 years ago' },
  { value: 'long', label: 'More than 5 years ago' },
];

// ---------- Vocabulary check ----------

export type VocabQuestion = {
  vocab: VocabItem;
  level: Cefr;
  options: string[];
  answerIndex: number;
};

/** Items per band. Weighted toward the levels where most learners actually sit. */
const VOCAB_PLAN: [Cefr, number][] = [
  ['A1', 5],
  ['A2', 5],
  ['B1', 4],
  ['B2', 3],
  ['C1', 2],
];

const TESTABLE_POS = new Set(['noun', 'verb', 'adjective', 'adverb']);

/** Glosses sometimes carry usage hints that contain the Spanish word itself; drop them. */
function gloss(en: string) {
  return en.replace(/\s*\([^)]*\)/g, '').trim();
}

export function buildVocabQuestions(): VocabQuestion[] {
  const questions: VocabQuestion[] = [];
  for (const [level, count] of VOCAB_PLAN) {
    const pool = units
      .filter((u) => u.cefr === level)
      .flatMap((u) => u.vocab)
      .filter((v) => TESTABLE_POS.has(v.pos) && !v.es.includes(' '));
    // Near-identical cognates (hospital → hospital) say nothing about what you know.
    const informative = pool.filter((v) => charSimilarity(normalize(v.es), normalize(gloss(v.en))) < 0.7);
    for (const vocab of sample(informative, count)) {
      // Distractors of the same part of speech so the answer can't be guessed by shape.
      const answer = gloss(vocab.en);
      const distractors = sample(
        pool.filter((v) => v.pos === vocab.pos && gloss(v.en) !== answer),
        3
      ).map((v) => gloss(v.en));
      const options = shuffle([answer, ...distractors]);
      questions.push({ vocab, level, options, answerIndex: options.indexOf(answer) });
    }
  }
  return questions;
}

// ---------- Listening check ----------

export type ListeningQuestion = {
  sentence: Sentence;
  level: Cefr;
  options: string[];
  answerIndex: number;
};

const LISTENING_PLAN: [Cefr, number][] = [
  ['A1', 3],
  ['A2', 2],
  ['B1', 2],
  ['B2', 1],
];

export function buildListeningQuestions(): ListeningQuestion[] {
  const questions: ListeningQuestion[] = [];
  for (const [level, count] of LISTENING_PLAN) {
    const pool = units
      .filter((u) => u.cefr === level)
      .flatMap((u) => u.grammar.flatMap((g) => g.examples))
      .filter((s) => s.es.split(' ').length >= 4);
    for (const sentence of sample(pool, count)) {
      const distractors = sample(
        pool.filter((s) => s.en !== sentence.en),
        3
      ).map((s) => s.en);
      const options = shuffle([sentence.en, ...distractors]);
      questions.push({ sentence, level, options, answerIndex: options.indexOf(sentence.en) });
    }
  }
  return questions;
}

// ---------- Scoring ----------

/** Per-level tallies from one section. `skipped` = "I don't know" (no guessing penalty). */
export type BandTally = Partial<Record<Cefr, { correct: number; wrong: number; skipped: number }>>;

export function tally(results: { level: Cefr; outcome: 'correct' | 'wrong' | 'skipped' }[]): BandTally {
  const out: BandTally = {};
  for (const r of results) {
    const t = (out[r.level] ??= { correct: 0, wrong: 0, skipped: 0 });
    t[r.outcome]++;
  }
  return out;
}

/**
 * Converts band results into a 0-600 rating. Each band contributes up to 100
 * points, scaled by how much of it the learner knows (corrected for guessing on
 * 4-option questions). Knowing 80% of a band counts as fully covering it.
 */
export function ratingFromBands(bands: BandTally): number {
  let rating = 0;
  let previous = 1;
  for (const level of CEFR_LEVELS) {
    const t = bands[level];
    if (!t) break;
    const n = t.correct + t.wrong + t.skipped;
    if (!n) break;
    const known = Math.max(0, (t.correct - t.wrong / 3) / n);
    // A band can't count for more than the one below it (lucky guesses on hard words).
    const covered = Math.min(previous, Math.min(1, known / 0.8));
    rating += covered * LEVEL_SPAN;
    previous = covered;
  }
  return Math.round(rating);
}

/** Estimated count of course words already known, for the results screen. */
export function estimateWordsKnown(bands: BandTally): number {
  let total = 0;
  for (const level of CEFR_LEVELS) {
    const t = bands[level];
    if (!t) continue;
    const n = t.correct + t.wrong + t.skipped;
    if (!n) continue;
    const known = Math.max(0, (t.correct - t.wrong / 3) / n);
    const bandWords = units.filter((u) => u.cefr === level).reduce((s, u) => s + u.vocab.length, 0);
    total += known * bandWords;
  }
  return Math.round(total / 10) * 10;
}

export type PlacementResult = {
  background: Background;
  lastUsed: LastUsed | null;
  vocab: number;
  grammar: number;
  listening: number;
  wordsKnown: number;
};

export type PlacementPlan = {
  skills: Record<Skill, number>;
  startUnit: Unit;
  /** Units the learner places out of; their vocabulary goes into the refresh queue. */
  skippedUnits: Unit[];
  refreshWords: number;
  headline: string;
  explanation: string;
};

/** The first unit at or beyond a rating, e.g. 150 → the middle of A2. */
export function unitForRating(rating: number): Unit {
  const level = ratingToCefr(rating);
  const peers = units.filter((u) => u.cefr === level);
  if (!peers.length) return units[units.length - 1];
  const index = Math.min(peers.length - 1, Math.floor(ratingProgress(rating) * peers.length));
  return peers[index];
}

/**
 * Grammar sets where you start, but vocabulary caps it: B1 lessons with A1 words
 * are frustrating. Skipped units aren't forgotten; their words get a quick
 * know-it/don't-know refresh so faded vocabulary comes back fast.
 */
export function planFromPlacement(r: PlacementResult): PlacementPlan {
  // Caps tuned so a returning learner with faded vocab lands just before the first
  // grammar they half-know, rather than past it. Weak listening only caps loosely:
  // sessions already lean toward the weakest skill, so it shouldn't block progress.
  const start = Math.max(0, Math.min(r.grammar, r.vocab + 30, r.listening + 100));
  const startUnit = unitForRating(start);
  const skippedUnits = units.filter((u) => u.order < startUnit.order);
  const refreshWords = skippedUnits.reduce((s, u) => s + u.vocab.length, 0);
  const production = Math.min(r.vocab, r.grammar);
  const skills: Record<Skill, number> = {
    vocab: r.vocab,
    grammar: r.grammar,
    listening: r.listening,
    reading: Math.round((r.vocab + r.grammar) / 2),
    // Speaking and writing lag recognition for almost everyone, especially after a break.
    speaking: Math.round(Math.min(production, r.listening + 20) * 0.85),
    writing: Math.round(production * 0.9),
  };

  const gap = r.grammar - r.vocab;
  let headline: string;
  let explanation: string;
  if (r.background === 'none' || start < 15) {
    headline = 'Starting from the beginning';
    explanation =
      "You'll build from greetings and the verb ser. Sessions mix new words, grammar, listening and speaking from day one.";
  } else if (gap >= 40) {
    headline = 'Returning learner: grammar is ahead of vocabulary';
    explanation = `You still recognize a lot of the grammar, but many words have faded. That's normal after a break. You'll start at "${startUnit.title}", and your first sessions include a fast refresh of the ${refreshWords} words from earlier units: the ones you still know get scheduled far out, and the ones you've forgotten get relearned.`;
  } else if (r.listening + 40 < Math.min(r.vocab, r.grammar)) {
    headline = 'You read better than you hear';
    explanation = `You'll start at "${startUnit.title}". Your ear needs to catch up, so practice leans toward listening and dictation.${
      refreshWords ? ` Earlier words (${refreshWords}) get a quick refresh along the way.` : ''
    }`;
  } else {
    headline = `Starting in ${startUnit.cefr}`;
    explanation = `You'll start at "${startUnit.title}".${
      refreshWords ? ` Your first sessions include a quick refresh of the ${refreshWords} words from earlier units.` : ''
    } The app keeps adjusting to how you actually do.`;
  }

  return { skills, startUnit, skippedUnits, refreshWords, headline, explanation };
}
