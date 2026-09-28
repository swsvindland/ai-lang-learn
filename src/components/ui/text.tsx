import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'bodyStrong' | 'caption' | 'label' | 'spanish';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ThemeColor;
  center?: boolean;
};

export function Text({ variant = 'body', color, center, style, ...rest }: TextProps) {
  const theme = useTheme();
  const defaultColor: ThemeColor = variant === 'caption' || variant === 'label' ? 'textSecondary' : 'text';
  return (
    <RNText
      style={[styles[variant], { color: theme[color ?? defaultColor] }, center && styles.center, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 19, lineHeight: 25, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 23, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  spanish: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  center: { textAlign: 'center' },
});
