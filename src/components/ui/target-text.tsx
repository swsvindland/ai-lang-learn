import type { ReactNode } from 'react';
import { StyleSheet, Text as RNText, View, type StyleProp, type TextStyle } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { dbVersion, useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import { hasKanji, isAllKana, romajiFor, type FuriganaSegment } from '@/lib/japanese';
import { wordUnits, type WordUnit } from '@/lib/japanese/words';
import { language } from '@/lib/languages';
import { getProfile } from '@/lib/learner';
import { needsFurigana, needsRomaji, type ReadingAids } from '@/lib/reading-aids';
import { scriptKnowledge } from '@/lib/script';

import { Text, textStyles, type TextVariant } from './text';

const NO_AIDS: ReadingAids = { furigana: 'off', romaji: 'off', known: new Set() };

// Every TargetText on screen re-reads aids after each database change; compute once per change.
let cached: { version: number; code: string; aids: ReadingAids } | null = null;

function readingAids(): ReadingAids {
  const lang = language();
  if (!lang.readings) return NO_AIDS;
  const version = dbVersion();
  if (cached && cached.version === version && cached.code === lang.code) return cached.aids;
  const profile = getProfile();
  const aids: ReadingAids = profile
    ? {
        furigana: profile.furigana,
        romaji: profile.romaji,
        known: profile.furigana === 'auto' || profile.romaji === 'auto' ? scriptKnowledge().known : new Set(),
      }
    : NO_AIDS;
  cached = { version, code: lang.code, aids };
  return aids;
}

/** Which reading aids to show, and the characters the learner already knows (for "auto"). */
export function useReadingAids() {
  return useDbQuery(readingAids);
}

type Gap = { text: string; color: ThemeColor };

/**
 * Text in the language being learned. For Japanese, each word can carry
 * furigana over its kanji and romaji underneath, Duolingo-style; with the
 * "auto" setting both fade out character by character as the reading track
 * teaches kana and kanji. A cloze `gap` replaces `___` with a highlighted
 * blank or answer.
 */
export function TargetText({
  text,
  reading,
  variant = 'target',
  color,
  center,
  style,
  gap,
  aids = true,
}: {
  text: string;
  reading?: string;
  variant?: TextVariant;
  color?: ThemeColor;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  gap?: Gap;
  /** Turn off furigana/romaji, e.g. when reading the character is the exercise. */
  aids?: boolean;
}) {
  const settings = useReadingAids();
  const base = (
    <Text variant={variant} color={color} center={center} style={style}>
      {withGap(text, gap)}
    </Text>
  );
  if (!aids || (settings.furigana === 'off' && settings.romaji === 'off')) return base;

  // Without a spaced reading, only a single short kana word can be romanized safely.
  const words: WordUnit[] | null = reading
    ? wordUnits(text, reading)
    : isAllKana(text) && [...text].length <= 6
      ? [{ segments: [{ text }], reading: text }]
      : null;

  if (!words) {
    // The reading doesn't line up with the text (or there is none): show it whole rather than guess.
    if (!reading) return base;
    return (
      <View style={[styles.block, center && styles.centerBlock]}>
        {base}
        {settings.furigana !== 'off' && hasKanji(text) ? (
          <Text variant="caption" center={center}>
            {withGap(reading.replace(/\s+/g, ''), gap)}
          </Text>
        ) : null}
        {settings.romaji !== 'off' ? (
          <Text variant="caption" color="textTertiary" center={center}>
            {withGap(romajiFor(reading), romanizedGap(gap))}
          </Text>
        ) : null}
      </View>
    );
  }

  const rubyFor = (seg: FuriganaSegment) => (seg.reading && needsFurigana(seg.text, settings) ? seg.reading : null);
  const romajiOf = (w: WordUnit) => (needsRomaji(w.reading, settings) ? wordRomaji(w.reading, gap) : null);
  const anyRuby = words.some((w) => w.segments.some((seg) => rubyFor(seg)));
  const anyRomaji = words.some((w) => romajiOf(w));
  if (!anyRuby && !anyRomaji) return base;

  const flat = StyleSheet.flatten([textStyles[variant], style]);
  const size = flat.fontSize ?? 16;
  const rubyStyle = { fontSize: Math.max(9, Math.round(size * 0.48)), lineHeight: Math.round(size * 0.62) };
  const romajiStyle = { fontSize: Math.max(11, Math.round(size * 0.5)), lineHeight: Math.round(size * 0.68) };

  return (
    <View
      style={[styles.words, center && styles.centerRow]}
      accessible
      accessibilityLabel={text.replace(/___/g, gap?.text ?? 'blank')}>
      {words.map((word, i) => {
        const romaji = romajiOf(word);
        return (
          <View key={i} style={styles.word}>
            <View style={styles.segments}>
              {word.segments.map((seg, j) => {
                const ruby = rubyFor(seg);
                return (
                  <View key={j} style={styles.segment}>
                    {anyRuby ? (
                      <Text variant="caption" style={rubyStyle}>
                        {ruby ?? ' '}
                      </Text>
                    ) : null}
                    <Text variant={variant} color={color} style={style}>
                      {withGap(seg.text, gap)}
                    </Text>
                  </View>
                );
              })}
            </View>
            {anyRomaji ? (
              <Text variant="caption" color="textTertiary" style={romajiStyle}>
                {romaji ?? ' '}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

/** Romaji for a word's reading; a cloze gap shows the romanized answer once it's filled in. */
function wordRomaji(reading: string, gap?: Gap) {
  const filled = romanizedGap(gap);
  return romajiFor(reading).replace(/___/g, filled?.text ?? '___');
}

function romanizedGap(gap?: Gap): Gap | undefined {
  if (!gap) return undefined;
  return isAllKana(gap.text) ? { ...gap, text: romajiFor(gap.text) } : gap;
}

function withGap(text: string, gap?: Gap): ReactNode {
  if (!gap || !text.includes('___')) return text;
  const [before, ...rest] = text.split('___');
  return (
    <>
      {before}
      <GapText gap={gap} />
      {rest.join('___')}
    </>
  );
}

/** Inherits the surrounding font size; only the color and weight change. */
function GapText({ gap }: { gap: Gap }) {
  const theme = useTheme();
  return <RNText style={{ color: theme[gap.color], fontWeight: '700' }}>{gap.text}</RNText>;
}

const styles = StyleSheet.create({
  block: { gap: 2 },
  centerBlock: { alignItems: 'center' },
  words: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', columnGap: 6, rowGap: 4 },
  centerRow: { justifyContent: 'center' },
  word: { alignItems: 'center' },
  segments: { flexDirection: 'row', alignItems: 'flex-end' },
  segment: { alignItems: 'center' },
});
