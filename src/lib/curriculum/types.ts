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
  | 'number'
  | 'particle'
  | 'counter'
  /** A single kana character being learned (Japanese writing-system units). */
  | 'character';

/**
 * Target-language text with an English gloss. `reading` is only used for
 * languages written with characters whose pronunciation isn't obvious
 * (Japanese): the whole text in kana, with spaces between words and particles,
 * e.g. { text: '私は学生です。', reading: 'わたし は がくせい です。' }.
 */
export type Sentence = { text: string; reading?: string; en: string };

/** A fill-in-the-blank drill. `text` (and `reading`) contain exactly one `___` that `answer` fills. */
export type ClozeDrill = {
  text: string;
  reading?: string;
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
  text: string;
  /** Kana reading for Japanese; omitted when it would equal `text`. */
  reading?: string;
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
  /** The AI's first line, in the target language, level-appropriate. */
  opener: string;
  /** Kana reading of `opener` (Japanese). */
  openerReading?: string;
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
  /** Country, region, or variety of the language used, e.g. "Mexico", "Spain", "Tokyo (standard)", "Neutral". */
  region: string;
  description: string;
  /** Concrete study tip for using this with a language focus. */
  howToUse: string;
  /** Where it can typically be found, e.g. "Netflix", "YouTube", "Spotify, Apple Podcasts". */
  whereToFind: string;
};

/** Everything bundled for one language. */
export type CourseContent = {
  units: Unit[];
  placementItems: PlacementItem[];
  mediaCatalog: MediaItem[];
};
