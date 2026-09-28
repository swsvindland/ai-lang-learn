import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { MaxContentWidth, Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  contentStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
}) {
  const theme = useTheme();
  const inner = <View style={[styles.content, contentStyle]}>{children}</View>;
  return (
    <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: theme.background }]}>
      {scroll ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}>
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  tone = 'surface',
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: ThemeColor;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme[tone], borderColor: tone === 'surface' ? theme.border : 'transparent' },
        style,
      ]}>
      {children}
    </View>
  );
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="label">{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export function ProgressBar({
  value,
  color = 'primary',
  height = 8,
}: {
  value: number;
  color?: ThemeColor;
  height?: number;
}) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, { height, backgroundColor: theme.surfaceAlt }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: theme[color] }]} />
    </View>
  );
}

export function Row({ children, style, gap = Spacing.two }: { children: ReactNode; style?: ViewStyle; gap?: number }) {
  return <View style={[styles.row, { gap }, style]}>{children}</View>;
}

export function Pill({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'primary' | 'success' | 'warning' | 'error' }) {
  const theme = useTheme();
  const soft = `${tone}Soft` as ThemeColor;
  return (
    <View style={[styles.pill, { backgroundColor: theme[soft] }]}>
      <Text variant="caption" style={{ color: theme[tone], fontWeight: '700' }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  card: {
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
  },
  section: { gap: Spacing.two },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.one },
  track: { borderRadius: Radius.pill, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', borderRadius: Radius.pill },
  row: { flexDirection: 'row', alignItems: 'center' },
  pill: { borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
});
