import type { CardRow } from '@/lib/cards';
import type { ClozeDrill, GrammarPoint, Scenario, Sentence, Unit, VocabItem } from '@/lib/curriculum';
import type { ReadingPassage } from '@/lib/ai/tutor';
import type { Skill } from '@/lib/learner';

export type BlockKind = 'review' | 'refresh' | 'read' | 'learn' | 'practice' | 'converse';

export type Block = {
  kind: BlockKind;
  title: string;
  budgetSeconds: number;
};

export type Activity =
  | { kind: 'flashcard'; card: CardRow; vocab: VocabItem; difficulty: number }
  | { kind: 'introduce'; vocab: VocabItem; difficulty: number }
  /** Fast "do you still know this?" check for words from units the learner placed out of. */
  | { kind: 'quick-check'; vocab: VocabItem; difficulty: number }
  /** A grammar note, or (with `reading`) a lesson about the writing system. */
  | { kind: 'grammar'; grammar: GrammarPoint; refresher: boolean; reading?: boolean }
  /** Read a known word written in characters just learned: pick its sound (romaji) or meaning. */
  | { kind: 'read-word'; vocab: VocabItem; ask: 'sound' | 'meaning'; options: string[]; answerIndex: number }
  | { kind: 'cloze'; drill: ClozeDrill; grammarId: string; options: string[]; skill?: Skill }
  | { kind: 'listen-choice'; sentence: Sentence; options: string[]; answerIndex: number }
  | { kind: 'dictation'; sentence: Sentence }
  | { kind: 'speak'; sentence: Sentence; mode: 'repeat' | 'produce' }
  | { kind: 'translate'; sentence: Sentence }
  | { kind: 'reading'; passage: ReadingPassage }
  | { kind: 'conversation'; scenario: Scenario; unit: Unit };

export type ActivityResult = {
  skill: Skill;
  score: number;
  ref?: string | null;
  prompt?: string;
  expected?: string;
  response?: string;
  feedback?: string;
  /** Skip recording an attempt (e.g. a pure presentation screen). */
  noAttempt?: boolean;
};

export type SessionSummary = {
  activeSeconds: number;
  activities: number;
  averageScore: number;
  newWords: string[];
  /** Reading-track characters introduced this session (kana, kanji). */
  newCharacters: string[];
  reviewed: number;
  skills: Partial<Record<Skill, { count: number; avg: number }>>;
  unitAdvancedTo: string | null;
  homeworkIds: string[];
};
