import { Button, FieldGroup, Host, Picker, Row, Spacer, Switch, Text } from '@expo/ui';
import { background, scrollContentBackground } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text as RNText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import { resetCourse, selectCourse } from '@/lib/db';
import { language, LANGUAGES, levelLabel, type LanguageCode } from '@/lib/languages';
import {
  courseSummaries,
  getProfile,
  INTEREST_OPTIONS,
  updateProfile,
  type Interest,
  type Profile,
} from '@/lib/learner';
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
  const courses = useDbQuery(courseSummaries);
  const lang = language();
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

  function switchCourse(code: LanguageCode, started: boolean) {
    const target = LANGUAGES[code];
    Alert.alert(
      started ? `Switch to ${target.name}?` : `Start learning ${target.name}?`,
      started
        ? 'Your progress in every language is kept.'
        : `Your ${lang.name} progress is kept, and you can switch back any time from Settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: started ? 'Switch' : 'Start',
          onPress: () => {
            selectCourse(code);
            // A started course reschedules its own reminders; a new one does it at the end of setup.
            const next = getProfile();
            if (next) syncReminders(next);
          },
        },
      ]
    );
  }

  const timeKey = `${profile.reminderHour}:${profile.reminderMinute}`;
  const aiLabel =
    ai?.status === 'available'
      ? `Ready · ${ai.label}`
      : ai?.status === 'downloadable'
        ? 'Needs download'
        : ai?.status === 'downloading'
          ? 'Downloading…'
          : 'Off';

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
          <FieldGroup.Section title="Language">
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>{`${lang.flag}  ${lang.name}`}</Text>
              <Spacer flexible />
              <Text textStyle={{ color: secondary }}>
                {levelLabel(courses.find((c) => c.code === lang.code)?.level ?? 'A1')}
              </Text>
            </Row>
            {courses
              .filter((c) => c.code !== lang.code)
              .map((c) => (
                <Button
                  key={c.code}
                  variant="text"
                  label={
                    c.started
                      ? `Switch to ${LANGUAGES[c.code].name} ${LANGUAGES[c.code].flag} (${LANGUAGES[c.code].levelLabels[c.level]})`
                      : `Start learning ${LANGUAGES[c.code].name} ${LANGUAGES[c.code].flag}`
                  }
                  onPress={() => switchCourse(c.code, c.started)}
                />
              ))}
          </FieldGroup.Section>

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
            <Switch
              label={`Slower ${lang.name} audio`}
              value={profile.slowAudio}
              onValueChange={(v) => save({ slowAudio: v })}
            />
          </FieldGroup.Section>

          {lang.readings ? (
            <FieldGroup.Section title="Reading aids">
              <Switch
                label="Furigana over kanji"
                value={profile.showReadings}
                onValueChange={(v) => save({ showReadings: v })}
              />
              <Switch label="Romaji" value={profile.showRomaji} onValueChange={(v) => save({ showRomaji: v })} />
              <Text textStyle={{ color: secondary, fontSize: 13 }}>
                Romaji helps while you learn kana. Turn it off once you can read hiragana and katakana.
              </Text>
            </FieldGroup.Section>
          ) : null}

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

          <FieldGroup.Section title="AI tutor">
            <Row alignment="center">
              <Text textStyle={{ color: textColor }}>Tutor</Text>
              <Spacer flexible />
              <Text textStyle={{ color: secondary }}>{aiLabel}</Text>
            </Row>
            {ai?.reason && ai.status !== 'available' ? (
              <Text textStyle={{ color: secondary, fontSize: 13 }}>{ai.reason}</Text>
            ) : null}
            <Button label="Choose AI tutor…" variant="text" onPress={() => router.push('/ai')} />
            <Text textStyle={{ color: secondary, fontSize: 13 }}>
              {ai?.cloud
                ? 'Tutor requests (your answers and messages) are sent to the cloud model. Recordings and progress stay on this phone.'
                : 'Everything runs on this device. Your answers, recordings, and progress never leave your phone.'}
            </Text>
          </FieldGroup.Section>

          {__DEV__ ? (
            <FieldGroup.Section title="Developer">
              <Button label="Activity gallery" variant="text" onPress={() => router.push('/dev')} />
            </FieldGroup.Section>
          ) : null}

          <FieldGroup.Section title="Data">
            <Button
              label={`Reset ${lang.name} progress & retake placement`}
              variant="text"
              onPress={() =>
                Alert.alert(
                  'Start over?',
                  `This deletes your ${lang.name} progress, cards, sessions, and homework, then runs setup and the placement check again. Other languages are not affected.`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reset', style: 'destructive', onPress: () => resetCourse() },
                  ]
                )
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
