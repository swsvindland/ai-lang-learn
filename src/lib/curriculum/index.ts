import { mediaCatalog } from './data/media';
import { placementItems } from './data/placement';
import { unitsA } from './data/units-a';
import { unitsB } from './data/units-b';
import { unitsC } from './data/units-c';
import { CEFR_LEVELS, type Cefr, type GrammarPoint, type Unit, type VocabItem } from './types';

export * from './types';
export { mediaCatalog, placementItems };

export const units: Unit[] = [...unitsA, ...unitsB, ...unitsC].sort((a, b) => a.order - b.order);

const unitById = new Map(units.map((u) => [u.id, u]));
const vocabById = new Map<string, { vocab: VocabItem; unit: Unit }>();
const grammarById = new Map<string, { grammar: GrammarPoint; unit: Unit }>();
for (const unit of units) {
  for (const vocab of unit.vocab) vocabById.set(vocab.id, { vocab, unit });
  for (const grammar of unit.grammar) grammarById.set(grammar.id, { grammar, unit });
}

export function getUnit(id: string) {
  return unitById.get(id);
}

export function getVocab(id: string) {
  return vocabById.get(id);
}

export function getGrammar(id: string) {
  return grammarById.get(id);
}

export function allVocab() {
  return [...vocabById.values()];
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
  const peers = units.filter((u) => u.cefr === unit.cefr);
  const index = peers.findIndex((u) => u.id === unit.id);
  return levelBase(unit.cefr) + ((index + 0.5) / Math.max(1, peers.length)) * LEVEL_SPAN;
}

export function firstUnitAtLevel(level: Cefr) {
  return units.find((u) => CEFR_LEVELS.indexOf(u.cefr) >= CEFR_LEVELS.indexOf(level)) ?? units[units.length - 1];
}

export function nextUnit(unitId: string) {
  const unit = getUnit(unitId);
  if (!unit) return undefined;
  return units.find((u) => u.order > unit.order);
}

export function levelIndex(level: Cefr) {
  return CEFR_LEVELS.indexOf(level);
}

/**
 * Rough guided-study hours to reach each level for an English speaker, based on
 * commonly cited estimates (FSI puts Spanish at ~600-750 class hours for
 * professional working proficiency). Includes out-of-app immersion.
 */
export const CUMULATIVE_HOURS: Record<Cefr, number> = {
  A1: 0,
  A2: 80,
  B1: 200,
  B2: 400,
  C1: 650,
  C2: 1000,
};

export const LEVEL_DESCRIPTIONS: Record<Cefr, string> = {
  A1: 'Beginner: introduce yourself, order food, handle simple, slow exchanges.',
  A2: 'Elementary: talk about your past, routines, shopping, travel basics.',
  B1: 'Intermediate: tell stories, give opinions, handle most travel situations.',
  B2: 'Upper-intermediate: follow native TV, debate, work in Spanish with effort.',
  C1: 'Advanced (fluent): express yourself spontaneously and precisely on almost anything.',
  C2: 'Mastery: near-native nuance, humor, and register.',
};
