import { alignFurigana, stripPunctuation, type FuriganaSegment } from './furigana';

/** One word of a Japanese sentence, with its furigana segments and its slice of the spaced reading. */
export type WordUnit = {
  segments: FuriganaSegment[];
  /** The word's reading tokens, space-separated (e.g. 'たべます' or 'わたし'). */
  reading: string;
};

type Atom = FuriganaSegment & { length: number };

const OPENERS = /^[「『（(〈《【]+$/;

/**
 * Splits `text` into words using the spaces in its kana `reading`
 * ('私は学生です。' + 'わたし は がくせい です。' → 私 | は | 学生 | です。), so each word can
 * carry its own furigana and romaji. A kanji run is never split; if a reading
 * boundary falls inside one, the words merge. Returns null if text and reading
 * don't line up.
 */
export function wordUnits(text: string, reading: string): WordUnit[] | null {
  const segments = alignFurigana(text, reading);
  if (!segments) return null;

  // Atoms: single kana (1 reading character each), whole kanji runs (their reading's
  // length), and punctuation (0).
  const atoms: Atom[] = [];
  for (const seg of segments) {
    if (seg.reading) atoms.push({ ...seg, length: stripPunctuation(seg.reading).length });
    else for (const char of seg.text) atoms.push({ text: char, length: stripPunctuation(char).length });
  }

  const tokens = reading.trim().split(/\s+/).filter(Boolean);
  // Where each token starts, counted in reading characters without punctuation.
  const starts: number[] = [];
  let at = 0;
  for (const token of tokens) {
    starts.push(at);
    at += stripPunctuation(token).length;
  }
  const tokenAt = (pos: number) => {
    let i = 0;
    while (i + 1 < starts.length && starts[i + 1] <= pos) i++;
    return i;
  };

  const words: { atoms: Atom[]; from: number; to: number }[] = [];
  let pending: Atom[] = [];
  let pos = 0;
  for (const atom of atoms) {
    const current = words[words.length - 1];
    if (!atom.length) {
      // Opening brackets belong to the next word; other punctuation to the previous one.
      if (OPENERS.test(atom.text) || !current) pending.push(atom);
      else current.atoms.push(atom);
      continue;
    }
    const startsWord = !current || starts.includes(pos);
    if (startsWord) {
      words.push({ atoms: [...pending, atom], from: pos, to: pos + atom.length });
      pending = [];
    } else {
      current.atoms.push(atom);
      current.to = pos + atom.length;
    }
    pos += atom.length;
  }
  if (pending.length && words.length) words[words.length - 1].atoms.push(...pending);

  return words.map((w) => {
    const first = tokenAt(w.from);
    const last = tokenAt(Math.max(w.from, w.to - 1));
    // Merge neighboring kana atoms back into runs for rendering.
    const merged: FuriganaSegment[] = [];
    for (const a of w.atoms) {
      const prev = merged[merged.length - 1];
      if (prev && !prev.reading && !a.reading) prev.text += a.text;
      else merged.push(a.reading ? { text: a.text, reading: a.reading } : { text: a.text });
    }
    return { segments: merged, reading: tokens.slice(first, last + 1).join(' ') };
  });
}
