/**
 * Character classes and furigana alignment for Japanese. Dependency-free so
 * the course validator script can import it directly.
 */

// Hiragana, katakana (minus ヵ/ヶ, which are read like kanji in 一ヶ月), and the long-vowel mark.
const KANA = /[ぁ-ゖゝ-ゟァ-ヴヷ-ヺー-ヿ]/;
const KANJI = /[㐀-䶿一-鿿豈-﫿々-〇ヵヶ]/;
const PUNCT = /[\s　。、．，・！？!?「」『』（）()〜~…‥：:；;"'“”‘’\-–—.,/]/;
const PUNCT_ALL = new RegExp(PUNCT.source, 'g');
/** Stands in for a cloze gap (`___`) so it lines up between text and reading. */
const GAP = '＿';

export function isKana(char: string) {
  return KANA.test(char);
}

export function hasKanji(text: string) {
  return KANJI.test(text);
}

/** True when every character is kana, punctuation, or a gap. */
export function isAllKana(text: string) {
  return [...text.replace(/___/g, '')].every((c) => KANA.test(c) || PUNCT.test(c));
}

/** Katakana → hiragana by code point; everything else is left alone. Length-preserving. */
export function kataToHira(text: string) {
  return text.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

export function stripPunctuation(text: string) {
  return text.replace(PUNCT_ALL, '');
}

export type FuriganaSegment = { text: string; reading?: string };

type Run = { kind: 'kana' | 'punct' | 'other'; text: string };

function runsOf(text: string): Run[] {
  const runs: Run[] = [];
  for (const char of text) {
    const kind = char === GAP || KANA.test(char) ? 'kana' : PUNCT.test(char) ? 'punct' : 'other';
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.text += char;
    else runs.push({ kind, text: char });
  }
  return runs;
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function alignChunk(text: string, reading: string): FuriganaSegment[] | null {
  const runs = runsOf(text);
  // Two kanji/number runs with only a space or symbol between them (東京　大阪, 3.5) have no kana
  // anchor to split the reading, so any split would be a guess.
  let previous: Run['kind'] | null = null;
  for (const run of runs) {
    if (run.kind === 'punct') continue;
    if (run.kind === 'other' && previous === 'other') return null;
    previous = run.kind;
  }
  const plain = stripPunctuation(reading);
  // Kana in the text must appear verbatim in the reading; everything else (kanji,
  // digits, Latin letters) is a group whose reading sits between those anchors.
  const pattern = runs
    .map((r) => (r.kind === 'kana' ? escapeRegex(kataToHira(r.text)) : r.kind === 'other' ? '(.+?)' : ''))
    .join('');
  const match = new RegExp(`^${pattern}$`, 'u').exec(kataToHira(plain));
  if (!match) return null;
  const segments: FuriganaSegment[] = [];
  let pos = 0;
  let group = 1;
  for (const run of runs) {
    if (run.kind === 'kana') {
      segments.push({ text: run.text });
      pos += run.text.length;
    } else if (run.kind === 'punct') {
      segments.push({ text: run.text });
    } else {
      const len = match[group++].length;
      // Slice the original reading (not the hiragana copy) so katakana readings survive.
      segments.push({ text: run.text, reading: plain.slice(pos, pos + len) });
      pos += len;
    }
  }
  return segments;
}

// Punctuation that should appear in both text and reading; splitting on it keeps
// two kanji runs on either side of a comma from bleeding into each other.
const BOUNDARY = /[。、．，・！？!?「」『』（）()〜~…‥：:；;"“”‘’\n]+/;

/** [part, boundary, part, boundary, …, part] */
function splitOnBoundaries(text: string) {
  const out: string[] = [];
  let rest = text;
  for (;;) {
    const m = BOUNDARY.exec(rest);
    if (!m) {
      out.push(rest);
      return out;
    }
    out.push(rest.slice(0, m.index), m[0]);
    rest = rest.slice(m.index + m[0].length);
  }
}

/**
 * Splits `text` into segments, attaching the matching slice of `reading` to
 * each kanji run so it can be shown as furigana. Returns null when the two
 * don't line up (e.g. the reading has a typo), so callers can fall back to
 * showing the reading as a separate line.
 */
export function alignFurigana(text: string, reading: string): FuriganaSegment[] | null {
  const t = text.replace(/___/g, GAP);
  const r = reading.replace(/___/g, GAP).replace(/\s+/g, '');
  if (!hasKanji(t) && !/[A-Za-z0-9０-９Ａ-Ｚａ-ｚ]/.test(t)) {
    return [{ text }];
  }
  const tParts = splitOnBoundaries(t);
  const rParts = splitOnBoundaries(r);
  let out: FuriganaSegment[] | null = [];
  if (tParts.length === rParts.length) {
    for (let i = 0; i < tParts.length && out; i++) {
      if (i % 2 === 1) out.push({ text: tParts[i] });
      else if (tParts[i]) {
        const segs = alignChunk(tParts[i], rParts[i]);
        out = segs ? [...out, ...segs] : null;
      } else if (rParts[i]) out = null;
    }
  } else {
    out = null;
  }
  // Punctuation differs between the two: align the whole thing ignoring it, for short text only
  // (a lazy-group regex over a long passage can backtrack badly).
  if (!out && t.length <= 80) out = alignChunk(t, r);
  return out && out.map((s) => ({ ...s, text: s.text.replace(new RegExp(GAP, 'g'), '___') }));
}
