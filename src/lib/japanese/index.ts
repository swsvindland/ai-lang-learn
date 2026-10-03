import { toRomaji } from 'wanakana';

import { kataToHira, stripPunctuation } from './furigana';

export * from './furigana';

// Particles are written は/へ/を but said wa/e/o. Readings keep particles as
// separate words, so a lone は is always the particle.
const PARTICLE_SOUND: Record<string, string> = { は: 'わ', へ: 'え', を: 'お' };

// Katakana combinations for foreign sounds that wanakana spells literally (ティ → "tei").
const EXTENDED: Record<string, string> = {
  ティ: 'ti', ディ: 'di', トゥ: 'tu', ドゥ: 'du', デュ: 'dyu', ファ: 'fa', フィ: 'fi', フェ: 'fe', フォ: 'fo',
  フュ: 'fyu', ウィ: 'wi', ウェ: 'we', ウォ: 'wo', ヴァ: 'va', ヴィ: 'vi', ヴ: 'vu', ヴェ: 've', ヴォ: 'vo',
  イェ: 'ye', クァ: 'kwa', グァ: 'gwa',
};
const ROMAJI_MAPPING: Record<string, string> = {};
for (const [kana, romaji] of Object.entries(EXTENDED)) {
  ROMAJI_MAPPING[kana] = romaji;
  ROMAJI_MAPPING[kataToHira(kana)] = romaji;
}

/** Hepburn-style romaji for a spaced kana reading, e.g. 'わたし は がくせい です。' → 'watashi wa gakusei desu.' */
export function romajiFor(reading: string) {
  return reading
    .trim()
    .split(/\s+/)
    .map((word) => {
      const core = stripPunctuation(word);
      let spoken = PARTICLE_SOUND[core] ? word.replace(core, PARTICLE_SOUND[core]) : word;
      // Greetings that froze a particle into the word: こんにちは = konnichiwa.
      if (/^(こんにち|こんばん)は$/.test(core)) spoken = spoken.replace(/は(?=[^は]*$)/, 'わ');
      return toRomaji(spoken, { customRomajiMapping: ROMAJI_MAPPING });
    })
    .join(' ')
    // Quotation brackets come out as curly quotes; the Japanese line already shows them.
    .replace(/[‘’“”「」『』]/g, '');
}
