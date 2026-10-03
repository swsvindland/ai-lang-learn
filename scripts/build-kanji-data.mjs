#!/usr/bin/env node
/**
 * Builds src/lib/curriculum/ja/kanji.json: the JLPT N5–N1 kanji with meanings
 * and readings, for the Japanese reading track.
 *
 * Input: kanji.json from https://github.com/davidluzgouveia/kanji-data, which
 * repackages KANJIDIC (© EDRDG, CC BY-SA 4.0) with JLPT levels from Jonathan
 * Waller's lists (tanos.co.uk). Only those fields are kept; the WaniKani fields
 * in that file are not used.
 *
 *   curl -sO https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json
 *   node scripts/build-kanji-data.mjs kanji.json
 */
import fs from 'node:fs';
import path from 'node:path';

const [input] = process.argv.slice(2);
if (!input) {
  console.error('usage: node scripts/build-kanji-data.mjs <kanji.json>');
  process.exit(1);
}

const KEEP_CAPITALIZED = new Set(['Japan', 'Japanese', 'China', 'Chinese', 'Buddha', 'Buddhist', 'Buddhism', 'Shinto', 'Korea', 'Korean', 'Europe', 'America', 'Mr.', 'Mrs.', 'Ms.']);

function meaning(text) {
  return text
    .split(' ')
    .map((w) => (KEEP_CAPITALIZED.has(w) ? w : w.charAt(0).toLowerCase() + w.slice(1)))
    .join(' ');
}

const toKatakana = (s) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));

const source = JSON.parse(fs.readFileSync(input, 'utf8'));
const out = Object.entries(source)
  .filter(([, v]) => v.jlpt_new)
  .map(([k, v]) => ({
    k,
    // JLPT level, 5 (N5, easiest) … 1 (N1)
    l: v.jlpt_new,
    s: v.strokes,
    // Newspaper frequency rank (lower is more common); 9999 when unranked
    f: v.freq ?? 9999,
    // Radical-number glosses ("one radical (no.1)") are dictionary trivia, not meanings.
    m: (v.meanings ?? []).filter((x, i, all) => !/radical/i.test(x) || all.length === 1).slice(0, 4).map(meaning),
    on: (v.readings_on ?? []).slice(0, 3).map(toKatakana),
    kun: (v.readings_kun ?? []).slice(0, 4),
  }))
  .sort((a, b) => b.l - a.l || a.f - b.f);

const target = path.resolve(import.meta.dirname, '../src/lib/curriculum/ja/kanji.json');
fs.writeFileSync(target, `[\n${out.map((e) => JSON.stringify(e)).join(',\n')}\n]\n`);
const byLevel = Object.fromEntries([5, 4, 3, 2, 1].map((l) => [`N${l}`, out.filter((e) => e.l === l).length]));
console.log(`wrote ${out.length} kanji to ${path.relative(process.cwd(), target)}`, byLevel);
