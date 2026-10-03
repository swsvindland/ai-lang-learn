import { hasKanji, isKana, stripPunctuation } from '@/lib/japanese';
import type { AidMode } from '@/lib/learner';

/** The learner's aid settings plus the characters they know solidly (for "auto"). */
export type ReadingAids = { furigana: AidMode; romaji: AidMode; known: ReadonlySet<string> };

/** Furigana over this kanji run? "auto" keeps it until every kanji in the run is learned. */
export function needsFurigana(text: string, aids: ReadingAids) {
  if (aids.furigana === 'off' || !hasKanji(text)) return false;
  return aids.furigana === 'always' || [...text].some((c) => hasKanji(c) && !aids.known.has(c));
}

/** Romaji under this word? "auto" keeps it until every kana in its reading is learned. */
export function needsRomaji(reading: string, aids: ReadingAids) {
  if (aids.romaji === 'off') return false;
  return aids.romaji === 'always' || [...stripPunctuation(reading)].some((c) => isKana(c) && !aids.known.has(c));
}
