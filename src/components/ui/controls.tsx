import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { getProfile } from '@/lib/learner';
import { speak } from '@/lib/speech';

import { Icon, Icons } from './icon';
import { Text } from './text';

/** Round play button that speaks text in the language being learned, with an optional slow variant. */
export function AudioButton({ text, size = 56, showSlow = true }: { text: string; size?: number; showSlow?: boolean }) {
  const theme = useTheme();
  const [playing, setPlaying] = useState<'normal' | 'slow' | null>(null);

  function play(slow: boolean) {
    setPlaying(slow ? 'slow' : 'normal');
    speak(text, { slow: slow || !!getProfile()?.slowAudio, onDone: () => setPlaying(null) });
  }

  return (
    <View style={styles.audioRow}>
      <Pressable
        accessibilityLabel="Play audio"
        onPress={() => play(false)}
        style={[
          styles.audio,
          { width: size, height: size, backgroundColor: playing === 'normal' ? theme.primary : theme.primarySoft },
        ]}>
        <Icon name={Icons.speaker} size={size * 0.42} tint={playing === 'normal' ? theme.onPrimary : theme.primary} />
      </Pressable>
      {showSlow ? (
        <Pressable
          accessibilityLabel="Play slowly"
          onPress={() => play(true)}
          style={[
            styles.audio,
            {
              width: size * 0.72,
              height: size * 0.72,
              backgroundColor: playing === 'slow' ? theme.primary : theme.surfaceAlt,
            },
          ]}>
          <Icon name={Icons.turtle} size={size * 0.32} tint={playing === 'slow' ? theme.onPrimary : theme.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'dimmed';

export function ChoiceOption({
  label,
  state,
  onPress,
  disabled,
}: {
  label: string;
  state: ChoiceState;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  const palette = {
    idle: { bg: theme.surface, border: theme.border, fg: theme.text },
    selected: { bg: theme.accentSoft, border: theme.accent, fg: theme.text },
    correct: { bg: theme.successSoft, border: theme.success, fg: theme.success },
    incorrect: { bg: theme.errorSoft, border: theme.error, fg: theme.error },
    dimmed: { bg: theme.surface, border: theme.border, fg: theme.textTertiary },
  }[state];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        { backgroundColor: palette.bg, borderColor: palette.border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Text variant="bodyStrong" style={{ color: palette.fg, flex: 1 }}>
        {label}
      </Text>
      {state === 'correct' ? <Icon name={Icons.checkCircle} color="success" /> : null}
      {state === 'incorrect' ? <Icon name={Icons.xCircle} color="error" /> : null}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
      ]}>
      <Text variant="bodyStrong" style={{ color: selected ? theme.onPrimary : theme.text, fontSize: 15 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Feedback({
  tone,
  title,
  children,
}: {
  tone: 'success' | 'error' | 'warning' | 'accent';
  title: string;
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  const icon = tone === 'success' ? Icons.checkCircle : tone === 'error' ? Icons.xCircle : Icons.lightbulb;
  return (
    <View style={[styles.feedback, { backgroundColor: theme[`${tone}Soft`] }]}>
      <View style={styles.feedbackHeader}>
        <Icon name={icon} color={tone} />
        <Text variant="bodyStrong" style={{ color: theme[tone] }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export function haptic(kind: 'success' | 'error') {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(
    kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
  );
}

const styles = StyleSheet.create({
  audioRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, justifyContent: 'center' },
  audio: { borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    paddingVertical: 14,
    paddingHorizontal: Spacing.three,
    minHeight: 54,
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two,
    paddingHorizontal: 14,
  },
  feedback: { borderRadius: Radius.md, padding: Spacing.three, gap: Spacing.one, borderCurve: 'continuous' },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
