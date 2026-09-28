import { Button, FieldGroup, Host, Picker, Row, Spacer, Switch, Text } from '@expo/ui';
import { background, scrollContentBackground } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text as RNText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import { prepareModel } from '@/lib/ai/llm';
import { resetAll } from '@/lib/db';
import { getProfile, INTEREST_OPTIONS, updateProfile, type Interest, type Profile } from '@/lib/learner';
import { syncReminders, WEEKDAYS } from '@/lib/reminders';

const TIMES = Array.from({ length: 34 }, (_, i) => {
  const minutes = 6 * 60 + i * 30;
  return { h: Math.floor(minutes / 60), m: minutes % 60 };
});

function formatTime(h: number, m: number) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function SettingsScreen() {
  const profile = useDbQuery(getProfile);
  if (!profile) return null;
  return <SettingsForm profile={profile} />;
}

function SettingsForm({ profile }: { profile: Profile }) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const ai = useAiStatus();
  const [preparing, setPreparing] = useState(false);
  const textColor = scheme === 'dark' ? '#F5F1EC' : '#1D1B19';
  const secondary = scheme === 'dark' ? '#A8A097' : '#6B645C';

  function save(patch: Partial<Profile>) {
    const next = { ...profile, ...patch };
    updateProfile(patch);
    if ('reminderDays' in patch || 'reminderHour' in patch || 'remindersEnabled' in patch || 'sessionMinutes' in patch) {
      syncReminders(next).then((ok) => {
        if (!ok && next.remindersEnabled) {
          Alert.alert('Notifications are off', 'Enable notifications for Hablo in system settings to get reminders.');
        }
      });
    }
  }

  function toggleDay(day: number, on: boolean) {
    const days = on ? [...profile.reminderDays, day] : profile.reminderDays.filter((d) => d !== day);
    save({ reminderDays: days.sort() });
  }

  function toggleInterest(value: Interest, on: boolean) {
    save({ interests: on ? [...profile.interests, value] : profile.interests.filter((i) => i !== value) });
  }

  async function prepare() {
    setPreparing(true);
    try {
      await prepareModel();
    } catch (e) {
      Alert.alert('Could not prepare the model', String(e));
    } finally {
      setPreparing(false);
    }
  }

  const timeKey = `${profile.reminderHour}:${profile.reminderMinute}`;
  const aiLabel =
    ai?.status === 'available'
      ? `Ready · ${ai.backend === 'apple' ? 'Apple Intelligence' : 'Gemini Nano'}`
      : ai?.status === 'downloadable'
        ? 'Needs download'
        : ai?.status === 'downloading'
          ? 'Downloading…'
          : 'Unavailable';

  return (
    <SafeAreaView edges={['top']} style={[styles.flex, { backgroundColor: theme.background }]}>
      <View style={styles.title}>
        <RNText variant="display">Settings</RNText>
      </View>
      <Host style={styles.flex}>
        <FieldGroup
          modifiers={
            // Let the app's warm background show through the SwiftUI form.
            Platform.OS === 'ios' ? [scrollContentBackground('hidden'), background(theme.background)] : undefined
          }>
          <FieldGroup.Section title="Study plan">
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>Sessions per week</Text>
              <Spacer flexible />
              <Picker selectedValue={profile.sessionsPerWeek} onValueChange={(v: number) => save({ sessionsPerWeek: v })}>
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <Picker.Item key={n} label={String(n)} value={n} />
                ))}
              </Picker>
            </Row>
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>Session length</Text>
              <Spacer flexible />
              <Picker selectedValue={profile.sessionMinutes} onValueChange={(v: number) => save({ sessionMinutes: v })}>
                {[15, 20, 25, 30, 40, 50].map((n) => (
                  <Picker.Item key={n} label={`${n} min`} value={n} />
                ))}
              </Picker>
            </Row>
            <Switch label="Slower Spanish audio" value={profile.slowAudio} onValueChange={(v) => save({ slowAudio: v })} />
          </FieldGroup.Section>

          <FieldGroup.Section title="Reminders">
            <Switch
              label="Study-day reminders"
              value={profile.remindersEnabled}
              onValueChange={(v) => save({ remindersEnabled: v })}
            />
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>Time</Text>
              <Spacer flexible />
              <Picker
                selectedValue={timeKey}
                onValueChange={(v: string) => {
                  const [h, m] = v.split(':').map(Number);
                  save({ reminderHour: h, reminderMinute: m });
                }}>
                {TIMES.map((t) => (
                  <Picker.Item key={`${t.h}:${t.m}`} label={formatTime(t.h, t.m)} value={`${t.h}:${t.m}`} />
                ))}
              </Picker>
            </Row>
            {WEEKDAYS.map((d) => (
              <Switch
                key={d.value}
                label={d.short}
                value={profile.reminderDays.includes(d.value)}
                onValueChange={(on) => toggleDay(d.value, on)}
              />
            ))}
          </FieldGroup.Section>

          <FieldGroup.Section title="Interests (for homework picks)">
            {INTEREST_OPTIONS.map((o) => (
              <Switch
                key={o.value}
                label={o.label}
                value={profile.interests.includes(o.value)}
                onValueChange={(on) => toggleInterest(o.value, on)}
              />
            ))}
          </FieldGroup.Section>

          <FieldGroup.Section title="On-device AI">
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>Tutor model</Text>
              <Spacer flexible />
              <Text textStyle={{ color: secondary }}>{aiLabel}</Text>
            </Row>
            {ai?.reason && ai.status !== 'available' ? (
              <Text textStyle={{ color: secondary, fontSize: 13 }}>{ai.reason}</Text>
            ) : null}
            {ai && ai.status !== 'available' && ai.backend !== 'none' ? (
              <Button label={preparing ? 'Preparing…' : 'Download / prepare model'} onPress={prepare} disabled={preparing} />
            ) : null}
            <Text textStyle={{ color: secondary, fontSize: 13 }}>
              Everything runs on this device. Your answers, recordings, and progress never leave your phone.
            </Text>
          </FieldGroup.Section>

          {__DEV__ ? (
            <FieldGroup.Section title="Developer">
              <Button label="Activity gallery" variant="text" onPress={() => router.push('/dev')} />
            </FieldGroup.Section>
          ) : null}

          <FieldGroup.Section title="Data">
            <Button
              label="Reset progress & retake placement"
              variant="text"
              onPress={() =>
                Alert.alert('Start over?', 'This deletes your progress, cards, sessions, and homework, then runs setup and the placement check again.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: () => resetAll() },
                ])
              }
            />
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: { paddingHorizontal: Spacing.three, paddingTop: Spacing.two, paddingBottom: Spacing.one },
});
