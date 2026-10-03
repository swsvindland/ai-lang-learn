/**
 * Structural checks for bundled course content. Run with Node 22+:
 *
 *   node scripts/validate-course.ts            # every course
 *   node scripts/validate-course.ts ja         # one course
 *   node scripts/validate-course.ts ja src/lib/curriculum/ja/units-n5a.ts   # specific unit files
 *
 * Exits non-zero on errors. Warnings (e.g. a word taught twice) don't fail.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { Cefr, ClozeDrill, MediaItem, PlacementItem, Sentence, Unit } from '../src/lib/curriculum/types.ts';
import { alignFurigana, hasKanji, isAllKana, kataToHira, stripPunctuation } from '../src/lib/japanese/furigana.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const CURRICULUM = path.join(ROOT, 'src/lib/curriculum');

const COURSES: Record<string, { readings: boolean; units: string[]; placement: string; media: string }> = {
  es: {
    readings: false,
    units: ['es/units-a.ts', 'es/units-b.ts', 'es/units-c.ts'],
    placement: 'es/placement.ts',
    media: 'es/media.ts',
  },
  ja: {
    readings: true,
    units: [
      'ja/units-kana.ts',
      'ja/units-n5a.ts',
      'ja/units-n5b.ts',
      'ja/units-n4a.ts',
      'ja/units-n4b.ts',
      'ja/units-n3.ts',
      'ja/units-n2n1.ts',
    ],
    placement: 'ja/placement.ts',
    media: 'ja/media.ts',
  },
};

const LEVELS: Cefr[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const POS = new Set([
  'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'phrase', 'determiner',
  'interjection', 'number', 'particle', 'counter', 'character',
]);
const MEDIA_TYPES = new Set(['tv', 'movie', 'book', 'podcast', 'youtube', 'music', 'news', 'app']);
// Kana, the long-vowel mark, spaces, the cloze gap, and Japanese/ASCII punctuation.
const READING_CHARS = /^[ぁ-ゖゝ-ゟァ-ヺー-ヿ\s_。、．，・！？!?「」『』（）()〜~…：:；;"“”‘’\-.,]*$/;

let errors = 0;
let warnings = 0;
function error(where: string, msg: string) {
  errors++;
  console.log(`  ✗ ${where}: ${msg}`);
}
function warn(where: string, msg: string) {
  warnings++;
  console.log(`  ⚠ ${where}: ${msg}`);
}

async function exportedArrays<T>(file: string): Promise<T[]> {
  const full = path.resolve(CURRICULUM, file);
  if (!fs.existsSync(full)) {
    warn(path.relative(ROOT, full), 'file not found, skipped');
    return [];
  }
  const mod = await import(pathToFileURL(full).href);
  return Object.values(mod).filter(Array.isArray).flat() as T[];
}

function checkReading(where: string, text: string, reading: string | undefined, readings: boolean, required = true) {
  if (!readings) {
    if (reading) warn(where, 'has a reading but this course does not use readings');
    return;
  }
  if (!reading) {
    if (required && (hasKanji(text) || !isAllKana(text))) error(where, `missing reading for "${text}"`);
    return;
  }
  if (!READING_CHARS.test(reading)) {
    const bad = [...reading].filter((c) => !READING_CHARS.test(c)).join('');
    error(where, `reading must be kana only (found "${bad}") in "${reading}"`);
    return;
  }
  if (!hasKanji(text) && isAllKana(text)) {
    const a = kataToHira(stripPunctuation(text));
    const b = kataToHira(stripPunctuation(reading));
    if (a !== b) error(where, `kana text "${text}" doesn't match its reading "${reading}"`);
    return;
  }
  if (!alignFurigana(text, reading)) error(where, `reading doesn't line up with text: "${text}" / "${reading}"`);
}

/**
 * Romaji is generated from the spaced reading, so a kana-only sentence still
 * needs one; otherwise particles glue onto words ("nekohakawaii").
 */
function needsSpacedReading(text: string, reading: string | undefined, readings: boolean) {
  return readings && !reading && [...stripPunctuation(text.replace(/___/g, ''))].length > 5;
}

function checkSentence(where: string, s: Sentence | undefined, readings: boolean) {
  if (!s || typeof s.text !== 'string' || !s.text.trim()) return error(where, 'missing text');
  if (typeof s.en !== 'string' || !s.en.trim()) error(where, `missing English for "${s.text}"`);
  if (s.text.includes('___')) error(where, `sentence contains a gap: "${s.text}"`);
  if (needsSpacedReading(s.text, s.reading, readings)) error(where, `kana sentence needs a spaced reading: "${s.text}"`);
  checkReading(where, s.text, s.reading, readings);
}

function checkDrill(where: string, d: ClozeDrill, readings: boolean) {
  if ((d.text.match(/___/g) ?? []).length !== 1) error(where, `drill needs exactly one ___: "${d.text}"`);
  if (!d.en?.trim()) error(where, 'drill missing English');
  if (!d.answer?.trim()) error(where, 'drill missing answer');
  if (!Array.isArray(d.distractors) || d.distractors.length < 2 || d.distractors.length > 3) {
    error(where, `drill needs 2-3 distractors: "${d.text}"`);
  } else {
    if (d.distractors.includes(d.answer)) error(where, `answer "${d.answer}" is also a distractor`);
    if (new Set(d.distractors).size !== d.distractors.length) error(where, `duplicate distractors in "${d.text}"`);
  }
  if (readings) {
    if (d.reading && (d.reading.match(/___/g) ?? []).length !== 1) error(where, `drill reading needs exactly one ___: "${d.reading}"`);
    if (needsSpacedReading(d.text, d.reading, readings)) error(where, `kana drill needs a spaced reading: "${d.text}"`);
    checkReading(where, d.text, d.reading, readings);
  }
}

function checkUnits(units: Unit[], readings: boolean, fullCourse: boolean) {
  const unitIds = new Set<string>();
  const grammarIds = new Set<string>();
  const vocabIds = new Set<string>();
  const vocabTexts = new Map<string, string>();
  const orders = units.map((u) => u.order).sort((a, b) => a - b);
  if (fullCourse) {
    orders.forEach((o, i) => {
      if (o !== i + 1) error('course', `unit orders should run 1..${units.length} without gaps (got ${orders.join(',')})`);
    });
  }
  let lastLevel = 0;
  for (const u of [...units].sort((a, b) => a.order - b.order)) {
    const where = `unit ${u.id}`;
    if (unitIds.has(u.id)) error(where, 'duplicate unit id');
    unitIds.add(u.id);
    if (!LEVELS.includes(u.cefr)) error(where, `bad cefr ${u.cefr}`);
    if (LEVELS.indexOf(u.cefr) < lastLevel) error(where, 'units must not go down in level');
    lastLevel = LEVELS.indexOf(u.cefr);
    if (!u.title?.trim() || !u.theme?.trim()) error(where, 'missing title/theme');
    if (!u.canDo?.length) error(where, 'missing canDo');
    if (!u.grammar?.length) error(where, 'no grammar points');
    if (!u.vocab?.length) error(where, 'no vocab');
    for (const g of u.grammar ?? []) {
      const gw = `${where} grammar ${g.id}`;
      if (grammarIds.has(g.id)) error(gw, 'duplicate grammar id');
      grammarIds.add(g.id);
      if (!g.title?.trim() || !g.summary?.trim()) error(gw, 'missing title/summary');
      if ((g.examples?.length ?? 0) < 2) error(gw, 'needs at least 2 examples');
      if ((g.drills?.length ?? 0) < 3) error(gw, 'needs at least 3 drills');
      g.examples?.forEach((e, i) => checkSentence(`${gw} example ${i + 1}`, e, readings));
      g.drills?.forEach((d, i) => checkDrill(`${gw} drill ${i + 1}`, d, readings));
    }
    for (const v of u.vocab ?? []) {
      const vw = `${where} vocab ${v.id}`;
      if (vocabIds.has(v.id)) error(vw, 'duplicate vocab id');
      vocabIds.add(v.id);
      if (!v.text?.trim() || !v.en?.trim()) error(vw, 'missing text/en');
      if (!POS.has(v.pos)) error(vw, `bad pos "${v.pos}"`);
      if (v.gender && v.gender !== 'm' && v.gender !== 'f') error(vw, `bad gender "${v.gender}"`);
      if (v.pos === 'character') {
        if ([...v.text].length > 3) error(vw, `character item should be one kana (or a digraph): "${v.text}"`);
        if (!/^[a-z' -]+$/.test(v.en)) warn(vw, `character meaning should be its romaji: "${v.en}"`);
      }
      checkReading(vw, v.text, v.reading, readings);
      checkSentence(`${vw} example`, v.example, readings);
      // A kana character (も) and the word spelled the same way (the particle も) are different items.
      const key = `${v.text}|${v.reading ?? ''}|${v.pos === 'character' ? 'char' : 'word'}`;
      const owner = vocabTexts.get(key);
      if (owner) warn(vw, `"${v.text}" is also taught in ${owner}`);
      else vocabTexts.set(key, u.id);
    }
    const s = u.scenario;
    if (!s?.title || !s.setting || !s.aiRole || !s.learnerGoal || !s.opener) error(where, 'incomplete scenario');
    else {
      if (needsSpacedReading(s.opener, s.openerReading, readings)) error(`${where} scenario opener`, 'kana opener needs a spaced reading');
      checkReading(`${where} scenario opener`, s.opener, s.openerReading, readings);
    }
  }
  const vocabCount = units.reduce((n, u) => n + (u.vocab?.length ?? 0), 0);
  const grammarCount = units.reduce((n, u) => n + (u.grammar?.length ?? 0), 0);
  console.log(`  ${units.length} units, ${vocabCount} vocab, ${grammarCount} grammar points`);
}

function checkPlacement(items: PlacementItem[]) {
  const ids = new Set<string>();
  for (const p of items) {
    const where = `placement ${p.id}`;
    if (ids.has(p.id)) error(where, 'duplicate id');
    ids.add(p.id);
    if (!LEVELS.includes(p.cefr)) error(where, `bad cefr ${p.cefr}`);
    if (!p.instruction || !p.question) error(where, 'missing instruction/question');
    if (p.options?.length !== 4) error(where, 'needs 4 options');
    if (new Set(p.options).size !== p.options?.length) error(where, 'duplicate options');
    if (!(p.answerIndex >= 0 && p.answerIndex < (p.options?.length ?? 0))) error(where, 'answerIndex out of range');
  }
  for (const level of LEVELS) {
    const n = items.filter((p) => p.cefr === level).length;
    if (n < 5) warn('placement', `only ${n} items at ${level} (expected 5)`);
  }
  const answerSpread = new Set(items.map((p) => p.answerIndex));
  if (items.length >= 10 && answerSpread.size < 4) warn('placement', 'correct answers always sit in the same few positions');
  console.log(`  ${items.length} placement items`);
}

function checkMedia(items: MediaItem[]) {
  const ids = new Set<string>();
  for (const m of items) {
    const where = `media ${m.id}`;
    if (ids.has(m.id)) error(where, 'duplicate id');
    ids.add(m.id);
    if (!MEDIA_TYPES.has(m.type)) error(where, `bad type ${m.type}`);
    if (!LEVELS.includes(m.minLevel) || !LEVELS.includes(m.maxLevel)) error(where, 'bad level');
    if (LEVELS.indexOf(m.minLevel) > LEVELS.indexOf(m.maxLevel)) error(where, 'minLevel above maxLevel');
    for (const k of ['title', 'region', 'description', 'howToUse', 'whereToFind'] as const) {
      if (!m[k]?.trim()) error(where, `missing ${k}`);
    }
  }
  console.log(`  ${items.length} media items`);
}

async function main() {
  const [lang, ...files] = process.argv.slice(2);
  const codes = lang ? [lang] : Object.keys(COURSES);
  for (const code of codes) {
    const course = COURSES[code];
    if (!course) throw new Error(`Unknown course "${code}"`);
    console.log(`\n${code}`);
    if (files.length) {
      const units = (await Promise.all(files.map((f) => exportedArrays<Unit>(path.resolve(f))))).flat();
      checkUnits(units, course.readings, false);
      continue;
    }
    const units = (await Promise.all(course.units.map((f) => exportedArrays<Unit>(f)))).flat();
    checkUnits(units, course.readings, true);
    checkPlacement(await exportedArrays<PlacementItem>(course.placement));
    checkMedia(await exportedArrays<MediaItem>(course.media));
  }
  console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  process.exit(errors ? 1 : 0);
}

main();
