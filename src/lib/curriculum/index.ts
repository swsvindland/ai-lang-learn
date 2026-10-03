import { language, type LanguageCode } from '@/lib/languages';

import { spanishCourse } from './es';
import { japaneseCourse } from './ja';
import { kanjiLesson } from './ja/kanji-lesson';
import {
  CEFR_LEVELS,
  type Cefr,
  type CourseContent,
  type GrammarPoint,
  type KanjiEntry,
  type ScriptGroup,
  type Sentence,
  type Unit,
  type VocabItem,
} from './types';

export * from './types';

const CONTENT: Record<LanguageCode, CourseContent> = { es: spanishCourse, ja: japaneseCourse };

export type ScriptEntry = {
  vocab: VocabItem;
  group: ScriptGroup;
  /** Position in the reading track. */
  index: number;
  /** Earliest unit whose vocabulary uses this character (Infinity if none); paces kanji with the course. */
  firstUnitOrder: number;
};

type Course = CourseContent & {
  code: LanguageCode;
  unitById: Map<string, Unit>;
  vocabById: Map<string, { vocab: VocabItem; unit: Unit }>;
  grammarById: Map<string, { grammar: GrammarPoint; unit: Unit }>;
  /** Reading track (kana, then kanji), in teaching order. Empty for languages without one. */
  scriptTrack: ScriptEntry[];
  scriptById: Map<string, ScriptEntry>;
  scriptByChar: Map<string, ScriptEntry>;
};

const built = new Map<LanguageCode, Course>();

// JLPT N5 kanji sit in the A1 band, N4 in A2, and so on.
const JLPT_CEFR: Record<number, Cefr> = { 5: 'A1', 4: 'A2', 3: 'B1', 2: 'B2', 1: 'C1' };

export function jlptToCefr(level: number): Cefr {
  return JLPT_CEFR[level] ?? 'C1';
}

type CharUse = { firstUnitOrder: number; words: Sentence[] };

/** One pass over the course vocabulary: for each character, where it's first used and a few words that use it. */
function characterUses(units: Unit[]) {
  const uses = new Map<string, CharUse>();
  for (const u of units) {
    for (const v of u.vocab) {
      for (const char of new Set(v.text)) {
        let use = uses.get(char);
        if (!use) uses.set(char, (use = { firstUnitOrder: u.order, words: [] }));
        if (use.words.length < 3) use.words.push({ text: v.text, reading: v.reading, en: v.en });
      }
    }
  }
  return uses;
}

function kanjiGroups(entries: KanjiEntry[], uses: Map<string, CharUse>): ScriptGroup[] {
  return [5, 4, 3, 2, 1].map((level) => ({
    id: `ja-kanji-n${level}`,
    title: `Kanji N${level}`,
    script: 'kanji' as const,
    lessons: level === 5 ? [kanjiLesson] : [],
    items: entries
      .filter((e) => e.l === level)
      .map((e) => {
        // Course words that use the kanji, earliest unit first.
        const examples = uses.get(e.k)?.words ?? [];
        return {
          id: `kj-${e.k}`,
          text: e.k,
          en: e.m.join('; '),
          pos: 'character' as const,
          example: examples[0] ?? { text: e.k, en: e.m[0] ?? '' },
          kanji: { on: e.on, kun: e.kun, strokes: e.s, jlpt: e.l, examples },
        };
      }),
  }));
}

function buildScript(content: CourseContent, units: Unit[]) {
  const track: ScriptEntry[] = [];
  if (!content.script) return track;
  const uses = characterUses(units);
  const firstUse = (char: string) => uses.get(char)?.firstUnitOrder ?? Infinity;
  const kanji = kanjiGroups(content.script.kanji, uses);
  for (const group of [...content.script.kana, ...kanji]) {
    const entries = group.items.map((vocab) => ({ vocab, group, index: 0, firstUnitOrder: firstUse(vocab.text) }));
    if (group.script === 'kanji') {
      // Within a level, teach kanji in the order the course's words need them, then by frequency.
      const freq = new Map(content.script.kanji.map((e) => [e.k, e.f]));
      entries.sort((a, b) => a.firstUnitOrder - b.firstUnitOrder || (freq.get(a.vocab.text) ?? 0) - (freq.get(b.vocab.text) ?? 0));
      group.items = entries.map((e) => e.vocab);
    }
    track.push(...entries);
  }
  track.forEach((e, i) => (e.index = i));
  return track;
}

function build(code: LanguageCode): Course {
  const content = CONTENT[code];
  const units = [...content.units].sort((a, b) => a.order - b.order);
  const vocabById: Course['vocabById'] = new Map();
  const grammarById: Course['grammarById'] = new Map();
  for (const unit of units) {
    for (const vocab of unit.vocab) vocabById.set(vocab.id, { vocab, unit });
    for (const grammar of unit.grammar) grammarById.set(grammar.id, { grammar, unit });
  }
  const scriptTrack = buildScript(content, units);
  return {
    ...content,
    units,
    code,
    unitById: new Map(units.map((u) => [u.id, u])),
    vocabById,
    grammarById,
    scriptTrack,
    scriptById: new Map(scriptTrack.map((e) => [e.vocab.id, e])),
    scriptByChar: new Map(scriptTrack.map((e) => [e.vocab.text, e])),
  };
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

export function getScriptEntry(id: string) {
  return course().scriptById.get(id);
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
