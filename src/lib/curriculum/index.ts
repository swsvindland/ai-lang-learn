import { language, type LanguageCode } from '@/lib/languages';

import { spanishCourse } from './es';
import { japaneseCourse } from './ja';
import { CEFR_LEVELS, type Cefr, type CourseContent, type GrammarPoint, type Unit, type VocabItem } from './types';

export * from './types';

const CONTENT: Record<LanguageCode, CourseContent> = { es: spanishCourse, ja: japaneseCourse };

type Course = CourseContent & {
  code: LanguageCode;
  unitById: Map<string, Unit>;
  vocabById: Map<string, { vocab: VocabItem; unit: Unit }>;
  grammarById: Map<string, { grammar: GrammarPoint; unit: Unit }>;
};

const built = new Map<LanguageCode, Course>();

function build(code: LanguageCode): Course {
  const content = CONTENT[code];
  const units = [...content.units].sort((a, b) => a.order - b.order);
  const vocabById: Course['vocabById'] = new Map();
  const grammarById: Course['grammarById'] = new Map();
  for (const unit of units) {
    for (const vocab of unit.vocab) vocabById.set(vocab.id, { vocab, unit });
    for (const grammar of unit.grammar) grammarById.set(grammar.id, { grammar, unit });
  }
  return { ...content, units, code, unitById: new Map(units.map((u) => [u.id, u])), vocabById, grammarById };
}

/** The bundled course for the language being studied (or `code`). */
export function course(code: LanguageCode = language().code): Course {
  let c = built.get(code);
  if (!c) {
    c = build(code);
    built.set(code, c);
  }
  return c;
}

export function courseUnits() {
  return course().units;
}

export function getUnit(id: string) {
  return course().unitById.get(id);
}

export function getVocab(id: string) {
  return course().vocabById.get(id);
}

export function getGrammar(id: string) {
  return course().grammarById.get(id);
}

export function allVocab() {
  return [...course().vocabById.values()];
}

/**
 * Proficiency is tracked on a 0-600 scale: each CEFR band spans 100 points
 * (A1 = 0-99 ... C2 = 500-600). "Fluent" in this app means reaching C1.
 */
export const LEVEL_SPAN = 100;
export const FLUENT_RATING = 400;

export function levelBase(level: Cefr) {
  return CEFR_LEVELS.indexOf(level) * LEVEL_SPAN;
}

export function ratingToCefr(rating: number): Cefr {
  const idx = Math.max(0, Math.min(CEFR_LEVELS.length - 1, Math.floor(rating / LEVEL_SPAN)));
  return CEFR_LEVELS[idx];
}

/** Position within the current band, 0..1. */
export function ratingProgress(rating: number) {
  if (rating >= CEFR_LEVELS.length * LEVEL_SPAN) return 1;
  return (rating % LEVEL_SPAN) / LEVEL_SPAN;
}

/** Difficulty of material in a unit on the same 0-600 scale. */
export function unitDifficulty(unit: Unit) {
  const peers = courseUnits().filter((u) => u.cefr === unit.cefr);
  const index = peers.findIndex((u) => u.id === unit.id);
  return levelBase(unit.cefr) + ((index + 0.5) / Math.max(1, peers.length)) * LEVEL_SPAN;
}

export function firstUnitAtLevel(level: Cefr) {
  const units = courseUnits();
  return units.find((u) => CEFR_LEVELS.indexOf(u.cefr) >= CEFR_LEVELS.indexOf(level)) ?? units[units.length - 1];
}

export function nextUnit(unitId: string) {
  const unit = getUnit(unitId);
  if (!unit) return undefined;
  return courseUnits().find((u) => u.order > unit.order);
}

export function levelIndex(level: Cefr) {
  return CEFR_LEVELS.indexOf(level);
}
