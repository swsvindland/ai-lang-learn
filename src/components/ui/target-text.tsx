import type { ReactNode } from 'react';
import { StyleSheet, Text as RNText, View, type StyleProp, type TextStyle } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import { alignFurigana, hasKanji, isAllKana, romajiFor, type FuriganaSegment } from '@/lib/japanese';
import { language } from '@/lib/languages';
import { getProfile } from '@/lib/learner';

import { Text, textStyles, type TextVariant } from './text';

/** Which reading aids to show for the language being learned. */
export function useReadingAids() {
  return useDbQuery(() => {
    const profile = language().readings ? getProfile() : null;
    return { furigana: !!profile?.showReadings, romaji: !!profile?.showRomaji };
  });
}

type Gap = { text: string; color: ThemeColor };

/**
 * Text in the language being learned. For Japanese it adds furigana over kanji
 * (from `reading`) and an optional romaji line, per the learner's settings.
 * A cloze `gap` replaces `___` with a highlighted blank or answer.
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
  /** Turn off furigana/romaji, e.g. when the romaji would give away a kana flashcard. */
  aids?: boolean;
}) {
  const settings = useReadingAids();
  const furigana = aids && settings.furigana && !!reading && hasKanji(text);
  // Without a spaced reading, romaji is only reliable for a single short word (particles would glue on).
  const romajiSource = reading ?? (isAllKana(text) && [...text].length <= 5 ? text : null);
  const romaji = aids && settings.romaji && romajiSource ? romajiFor(romajiSource) : null;
  const segments = furigana ? alignFurigana(text, reading!) : null;

  const base = (
    <Text variant={variant} color={color} center={center} style={style}>
      {withGap(text, gap)}
    </Text>
  );

  return (
    <View style={[styles.block, center && styles.centerBlock]}>
      {segments ? <Ruby segments={segments} variant={variant} color={color} center={center} style={style} gap={gap} /> : base}
      {furigana && !segments ? (
        // The reading didn't line up with the text; show it whole rather than guess.
        <Text variant="caption" center={center}>
          {withGap(reading!.replace(/\s+/g, ''), gap)}
        </Text>
      ) : null}
      {romaji ? (
        <Text variant="caption" color="textTertiary" center={center}>
          {withGap(romaji, gap && isAllKana(gap.text) ? { ...gap, text: romajiFor(gap.text) } : gap)}
        </Text>
      ) : null}
    </View>
  );
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

function Ruby({
  segments,
  variant,
  color,
  center,
  style,
  gap,
}: {
  segments: FuriganaSegment[];
  variant: TextVariant;
  color?: ThemeColor;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  gap?: Gap;
}) {
  const flat = StyleSheet.flatten([textStyles[variant], style]);
  const size = flat.fontSize ?? 16;
  const rubyStyle = { fontSize: Math.max(9, Math.round(size * 0.48)), lineHeight: Math.round(size * 0.62) };
  // Kana runs are split into single characters so long sentences can wrap anywhere.
  const units: { text: string; reading?: string; gap?: boolean }[] = [];
  for (const seg of segments) {
    if (seg.reading) units.push(seg);
    else {
      for (const part of seg.text.split(/(___)/)) {
        if (part === '___') units.push({ text: part, gap: true });
        else for (const char of part) units.push({ text: char });
      }
    }
  }
  return (
    <View style={[styles.rubyRow, center && styles.rubyCenter]} accessible accessibilityLabel={segments.map((s) => s.text).join('')}>
      {units.map((u, i) => (
        <View key={i} style={styles.rubyUnit}>
          <Text variant="caption" style={[rubyStyle, styles.rubyText]}>
            {u.reading ?? ' '}
          </Text>
          <Text variant={variant} color={u.gap ? gap?.color : color} style={style}>
            {u.gap && gap ? gap.text : u.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 2 },
  centerBlock: { alignItems: 'center' },
  rubyRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' },
  rubyCenter: { justifyContent: 'center' },
  rubyUnit: { alignItems: 'center' },
  rubyText: { textAlign: 'center' },
});
