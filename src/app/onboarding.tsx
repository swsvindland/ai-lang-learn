import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Diagnostic } from '@/components/placement/diagnostic';
import { PlacementResults } from '@/components/placement/results';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/controls';
import { Icon, Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card, Row, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { prepareModel } from '@/lib/ai/llm';
import { units } from '@/lib/curriculum';
import { initLearner, INTEREST_OPTIONS, type Interest } from '@/lib/learner';
import {
  BACKGROUND_OPTIONS,
  LAST_USED_OPTIONS,
  planFromPlacement,
  type Background,
  type LastUsed,
  type PlacementPlan,
  type PlacementResult,
} from '@/lib/placement';
import { syncReminders, WEEKDAYS } from '@/lib/reminders';

type Step =
  | 'welcome'
  | 'name'
  | 'background'
  | 'lastUsed'
  | 'diagnostic'
  | 'results'
  | 'schedule'
  | 'interests'
  | 'ai';

const EMPTY_RESULT: PlacementResult = {
  background: 'none',
  lastUsed: null,
  vocab: 0,
  grammar: 0,
  listening: 0,
  wordsKnown: 0,
};

// Spread sessions through the week so there's recovery time between them.
const DEFAULT_DAYS: Record<number, number[]> = {
  2: [3, 6],
  3: [2, 4, 6],
  4: [2, 3, 5, 7],
  5: [2, 3, 4, 5, 6],
  6: [2, 3, 4, 5, 6, 7],
  7: [1, 2, 3, 4, 5, 6, 7],
};

const TIMES = [
  { label: 'Morning · 8:00', h: 8, m: 0 },
  { label: 'Lunch · 12:30', h: 12, m: 30 },
  { label: 'Evening · 19:00', h: 19, m: 0 },
  { label: 'Night · 21:00', h: 21, m: 0 },
];

export default function Onboarding() {
  const ai = useAiStatus();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [background, setBackground] = useState<Background>('none');
  const [lastUsed, setLastUsed] = useState<LastUsed | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [plan, setPlan] = useState<PlacementPlan | null>(null);
  const [sessions, setSessions] = useState(3);
  const [minutes, setMinutes] = useState(25);
  const [days, setDays] = useState<number[]>(DEFAULT_DAYS[3]);
  const [time, setTime] = useState(TIMES[2]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [preparing, setPreparing] = useState(false);

  function finish() {
    const chosen = plan ?? planFromPlacement(EMPTY_RESULT);
    const profile = {
      name: name.trim() || null,
      startLevel: chosen.startUnit.cefr,
      sessionsPerWeek: sessions,
      sessionMinutes: minutes,
      reminderDays: days,
      reminderHour: time.h,
      reminderMinute: time.m,
      remindersEnabled: days.length > 0,
      interests,
      slowAudio: false,
      background,
      createdAt: Date.now(),
    };
    initLearner(profile, chosen);
    syncReminders(profile);
  }

  return (
    <Screen edges={['top', 'bottom']} contentStyle={styles.content}>
      {step === 'welcome' ? (
        <>
          <View style={styles.hero}>
            <Text variant="display">Hablo</Text>
            <Text variant="title" color="primary">
              De cero a fluido.
            </Text>
          </View>
          <Text variant="body">
            Forget 3-minute streaks. Real progress comes from focused practice: about 25 minutes, a few times a week, plus
            real Spanish in between.
          </Text>
          <Card>
            <Feature icon={Icons.clock} text="2–5 deep sessions a week, not daily nagging" />
            <Feature icon={Icons.mic} text="Speaking, listening, reading, writing & flashcards in every session" />
            <Feature icon={Icons.chat} text="Role-play conversations with an on-device AI tutor" />
            <Feature icon={Icons.tv} text="Homework with real shows, books & podcasts at your level" />
            <Feature icon={Icons.lock} text="100% local. Nothing leaves your phone." />
          </Card>
          <View style={styles.spacer} />
          <Button label="Let's start" size="lg" onPress={() => setStep('name')} />
        </>
      ) : null}

      {step === 'name' ? (
        <>
          <Text variant="title">¿Cómo te llamas?</Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Your name (optional)"
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => setStep('background')}
          />
          <View style={styles.spacer} />
          <Button label="Continue" size="lg" onPress={() => setStep('background')} />
        </>
      ) : null}

      {step === 'background' ? (
        <>
          <Text variant="title">Have you studied Spanish before?</Text>
          <View style={styles.options}>
            {BACKGROUND_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => {
                  setBackground(o.value);
                  if (o.value === 'none') {
                    setPlan(planFromPlacement({ ...EMPTY_RESULT, background: 'none' }));
                    setStep('schedule');
                  } else {
                    setStep(o.value === 'heritage' ? 'diagnostic' : 'lastUsed');
                  }
                }}>
                <Card>
                  <Text variant="bodyStrong">{o.label}</Text>
                  <Text variant="caption">{o.detail}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {step === 'lastUsed' ? (
        <>
          <Text variant="title">When did you last use it?</Text>
          <View style={styles.options}>
            {LAST_USED_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                onPress={() => {
                  setLastUsed(o.value);
                  setStep('diagnostic');
                }}>
                <Card>
                  <Text variant="bodyStrong">{o.label}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {step === 'diagnostic' ? (
        <Diagnostic
          onDone={(scores) => {
            const r: PlacementResult = { ...scores, background, lastUsed };
            setResult(r);
            setPlan(planFromPlacement(r));
            setStep('results');
          }}
        />
      ) : null}

      {step === 'results' && result && plan ? (
        <PlacementResults
          result={result}
          plan={plan}
          onContinue={() => setStep('schedule')}
          onStartOver={() => {
            // Keep the measured skill levels; only the starting unit changes.
            setPlan({ ...plan, startUnit: units[0], skippedUnits: [], refreshWords: 0 });
            setStep('schedule');
          }}
        />
      ) : null}

      {step === 'schedule' ? (
        <>
          <Text variant="title">Your study rhythm</Text>
          <Text variant="caption">Sessions per week</Text>
          <Row style={styles.wrap}>
            {[2, 3, 4, 5, 6, 7].map((n) => (
              <Chip
                key={n}
                label={String(n)}
                selected={sessions === n}
                onPress={() => {
                  setSessions(n);
                  setDays(DEFAULT_DAYS[n]);
                }}
              />
            ))}
          </Row>
          <Text variant="caption">Minutes per session</Text>
          <Row style={styles.wrap}>
            {[15, 25, 40].map((n) => (
              <Chip key={n} label={`${n} min${n === 25 ? ' ★' : ''}`} selected={minutes === n} onPress={() => setMinutes(n)} />
            ))}
          </Row>
          <Text variant="caption">Remind me on</Text>
          <Row style={styles.wrap}>
            {WEEKDAYS.map((d) => (
              <Chip
                key={d.value}
                label={d.short}
                selected={days.includes(d.value)}
                onPress={() =>
                  setDays((prev) => (prev.includes(d.value) ? prev.filter((x) => x !== d.value) : [...prev, d.value]))
                }
              />
            ))}
          </Row>
          <Text variant="caption">At</Text>
          <Row style={styles.wrap}>
            {TIMES.map((t) => (
              <Chip key={t.label} label={t.label} selected={time === t} onPress={() => setTime(t)} />
            ))}
          </Row>
          <Card tone="surfaceAlt">
            <Text variant="caption">
              That&apos;s about {((sessions * minutes) / 60).toFixed(1)} hours of lessons a week. Add 1–2 hours of homework
              and you&apos;re on a real path to fluency.
            </Text>
          </Card>
          <View style={styles.spacer} />
          <Button label="Continue" size="lg" onPress={() => setStep('interests')} />
        </>
      ) : null}

      {step === 'interests' ? (
        <>
          <Text variant="title">What do you enjoy?</Text>
          <Text variant="body" color="textSecondary">
            Homework and reading passages lean toward your interests.
          </Text>
          <Row style={styles.wrap}>
            {INTEREST_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                selected={interests.includes(o.value)}
                onPress={() =>
                  setInterests((prev) =>
                    prev.includes(o.value) ? prev.filter((x) => x !== o.value) : [...prev, o.value]
                  )
                }
              />
            ))}
          </Row>
          <View style={styles.spacer} />
          <Button label="Continue" size="lg" onPress={() => setStep('ai')} />
        </>
      ) : null}

      {step === 'ai' ? (
        <>
          <Text variant="title">Your AI tutor</Text>
          <Card tone={ai?.status === 'available' ? 'successSoft' : 'warningSoft'}>
            <Row>
              <Icon name={ai?.status === 'available' ? Icons.checkCircle : Icons.warning} color={ai?.status === 'available' ? 'success' : 'warning'} />
              <Text variant="bodyStrong">
                {ai?.status === 'available'
                  ? `${ai.backend === 'apple' ? 'Apple Intelligence' : 'Gemini Nano'} is ready`
                  : ai?.status === 'downloadable' || ai?.status === 'downloading'
                    ? 'Model needs to download'
                    : 'On-device AI unavailable'}
              </Text>
            </Row>
            <Text variant="caption">
              {ai?.status === 'available'
                ? 'Conversation role-plays, grammar Q&A, personalized sentences, reading passages and feedback all run privately on your phone.'
                : `${ai?.reason ?? ''} You can still learn with the full built-in course (flashcards, listening, speaking, grammar); AI extras switch on automatically when available.`}
            </Text>
            {ai && ai.status !== 'available' && ai.backend !== 'none' ? (
              <Button
                label={Platform.OS === 'android' ? 'Download Gemini Nano' : 'Check again'}
                variant="secondary"
                loading={preparing}
                onPress={async () => {
                  setPreparing(true);
                  await prepareModel().catch(() => undefined);
                  setPreparing(false);
                }}
              />
            ) : null}
          </Card>
          <View style={styles.spacer} />
          <Button label="Start learning" size="lg" icon={Icons.play} onPress={finish} />
        </>
      ) : null}
    </Screen>
  );
}

function Feature({ icon, text }: { icon: (typeof Icons)[keyof typeof Icons]; text: string }) {
  return (
    <Row style={styles.feature}>
      <Icon name={icon} color="primary" />
      <Text variant="body" style={styles.flex}>
        {text}
      </Text>
    </Row>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: Spacing.three, paddingTop: Spacing.four },
  hero: { gap: Spacing.one, paddingTop: Spacing.five },
  spacer: { flexGrow: 1, minHeight: Spacing.three },
  wrap: { flexWrap: 'wrap', gap: Spacing.two },
  options: { gap: Spacing.two },
  feature: { paddingVertical: 4, gap: Spacing.three },
});
