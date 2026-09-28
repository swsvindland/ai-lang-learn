import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityView } from '@/components/activities';
import { SessionSummaryView } from '@/components/session-summary';
import { Icon, Icons } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { cancelBackgroundWork, getAvailability, peekAvailability } from '@/lib/ai/llm';
import { assignHomework } from '@/lib/homework';
import { getProfile } from '@/lib/learner';
import { SessionEngine } from '@/lib/session/engine';
import type { Activity, ActivityResult, SessionSummary } from '@/lib/session/types';
import { stopSpeaking } from '@/lib/speech';
import type { Grade } from '@/lib/srs';

function formatTime(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function SessionScreen() {
  const theme = useTheme();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  // The plan depends on whether the AI tutor is usable, so resolve that first.
  const [ready, setReady] = useState(() => peekAvailability() !== null);

  useEffect(() => {
    if (!ready) getAvailability().finally(() => setReady(true));
  }, [ready]);

  if (!ready) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }
  return <SessionRunner mode={mode === 'review' ? 'review' : 'full'} />;
}

function SessionRunner({ mode }: { mode: 'full' | 'review' }) {
  const theme = useTheme();
  const [engine] = useState(() => new SessionEngine(mode));
  const [activity, setActivity] = useState<Activity | null>(null);
  const [activityKey, setActivityKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [finishing, setFinishing] = useState(false);
  const finished = useRef(false);

  // Only count time while the app is in front and not paused: this is "active" study time.
  useEffect(() => {
    let active = AppState.currentState === 'active';
    const sub = AppState.addEventListener('change', (s) => {
      active = s === 'active';
    });
    const id = setInterval(() => {
      if (!active || paused || summary || finishing) return;
      engine.tick(1);
      setElapsed(engine.activeSeconds);
    }, 1000);
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [engine, paused, summary, finishing]);

  useEffect(() => {
    engine.prefetch();
    advance();
    return () => {
      stopSpeaking();
      cancelBackgroundWork();
      if (!finished.current) engine.abandon();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function advance() {
    setLoading(true);
    const next = await engine.next();
    if (next) {
      setActivity(next);
      setActivityKey((k) => k + 1);
      setLoading(false);
    } else {
      await wrapUp();
    }
  }

  async function wrapUp() {
    setFinishing(true);
    setActivity(null);
    stopSpeaking();
    cancelBackgroundWork();
    const profile = getProfile();
    let homeworkIds: string[] = [];
    if (engine.mode === 'full' && profile) {
      try {
        homeworkIds = await assignHomework({
          level: engine.level,
          unit: engine.unit,
          interests: profile.interests,
          sessionId: engine.id,
        });
      } catch {
        homeworkIds = [];
      }
    }
    finished.current = true;
    setSummary(engine.finish(homeworkIds));
    setFinishing(false);
    setLoading(false);
  }

  function onDone(result: ActivityResult, grade?: Grade) {
    if (!activity) return;
    stopSpeaking();
    engine.complete(activity, result, grade);
    advance();
  }

  function close() {
    if (summary) {
      router.back();
      return;
    }
    Alert.alert('End session early?', 'Everything you did so far is saved and counts toward your progress.', [
      { text: 'Keep going', style: 'cancel' },
      { text: 'Wrap up now', onPress: () => wrapUp() },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ]);
  }

  const block = engine.currentBlock;
  const total = engine.totalBudget;
  const isConversation = activity?.kind === 'conversation';

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Close session" onPress={close} hitSlop={12}>
          <Icon name={Icons.xmark} size={22} color="textSecondary" />
        </Pressable>
        <View style={styles.progress}>
          <ProgressBar value={summary ? 1 : elapsed / total} />
          <View style={styles.headerMeta}>
            <Text variant="caption" numberOfLines={1} style={styles.flex}>
              {summary ? 'Session complete' : finishing ? 'Wrapping up…' : block?.title ?? ''}
            </Text>
            <Text variant="caption" style={styles.timer}>
              {formatTime(elapsed)} / {formatTime(total)}
            </Text>
          </View>
        </View>
        {!summary ? (
          <Pressable accessibilityLabel={paused ? 'Resume' : 'Pause'} onPress={() => setPaused((p) => !p)} hitSlop={12}>
            <Icon name={paused ? Icons.play : Icons.pause} size={20} color="textSecondary" />
          </Pressable>
        ) : null}
      </View>

      {summary ? (
        <SessionSummaryView summary={summary} unit={engine.unit} onClose={() => router.back()} />
      ) : paused ? (
        <View style={styles.center}>
          <Text variant="title">Paused</Text>
          <Text variant="body" color="textSecondary">
            The clock only runs while you&apos;re studying.
          </Text>
          <Pressable
            onPress={() => setPaused(false)}
            style={[styles.resume, { backgroundColor: theme.primary }]}>
            <Icon name={Icons.play} tint={theme.onPrimary} size={28} />
          </Pressable>
        </View>
      ) : loading || !activity ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.primary} />
          {finishing ? (
            <Text variant="caption">Picking your homework…</Text>
          ) : null}
        </View>
      ) : isConversation ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={8}>
          <View style={[styles.flex, styles.content]}>
            <ActivityView key={activityKey} activity={activity} level={engine.level} aiReady={engine.aiReady} onDone={onDone} />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, styles.grow]}
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled">
          <ActivityView key={activityKey} activity={activity} level={engine.level} aiReady={engine.aiReady} onDone={onDone} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  progress: { flex: 1, gap: 6 },
  headerMeta: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two },
  timer: { fontVariant: ['tabular-nums'] },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    paddingBottom: Spacing.four,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three, padding: Spacing.four },
  resume: { width: 72, height: 72, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
});
