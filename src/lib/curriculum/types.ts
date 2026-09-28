export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type Cefr = (typeof CEFR_LEVELS)[number];

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'phrase'
  | 'determiner'
  | 'interjection'
  | 'number';

export type Sentence = { es: string; en: string };

/** A fill-in-the-blank drill. `es` contains exactly one `___` that `answer` fills. */
export type ClozeDrill = {
  es: string;
  en: string;
  answer: string;
  /** Plausible wrong answers for multiple choice (2-3). */
  distractors: string[];
};

export type GrammarPoint = {
  id: string;
  title: string;
  /** Plain-English explanation aimed at the unit's level, 2-5 sentences. */
  summary: string;
  examples: Sentence[];
  drills: ClozeDrill[];
};

export type VocabItem = {
  id: string;
  es: string;
  en: string;
  pos: PartOfSpeech;
  gender?: 'm' | 'f';
  example: Sentence;
};

/** A role-play the AI runs as the unit's conversation practice. */
export type Scenario = {
  title: string;
  /** English description of the situation shown to the learner. */
  setting: string;
  /** Who the AI plays, in English. */
  aiRole: string;
  /** What the learner should try to accomplish, in English. */
  learnerGoal: string;
  /** The AI's first line, in Spanish, level-appropriate. */
  opener: string;
};

export type Unit = {
  id: string;
  cefr: Cefr;
  /** Global order across the whole course, starting at 1. */
  order: number;
  title: string;
  theme: string;
  canDo: string[];
  grammar: GrammarPoint[];
  vocab: VocabItem[];
  scenario: Scenario;
};

export type PlacementItem = {
  id: string;
  cefr: Cefr;
  /** English instruction, e.g. "Choose the correct translation". */
  instruction: string;
  question: string;
  options: string[];
  answerIndex: number;
};

export type MediaType = 'tv' | 'movie' | 'book' | 'podcast' | 'youtube' | 'music' | 'news' | 'app';

export type MediaItem = {
  id: string;
  title: string;
  type: MediaType;
  minLevel: Cefr;
  maxLevel: Cefr;
  /** Country or region of the Spanish used, e.g. "Mexico", "Spain", "Colombia", "Neutral". */
  region: string;
  description: string;
  /** Concrete study tip for using this with a language focus. */
  howToUse: string;
  /** Where it can typically be found, e.g. "Netflix", "YouTube", "Spotify, Apple Podcasts". */
  whereToFind: string;
};
