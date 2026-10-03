import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chip, Feedback } from '@/components/ui/controls';
import { Input } from '@/components/ui/input';
import { Card, Pill, Row, Screen, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { useDbQuery } from '@/hooks/use-db-query';
import { completeHomework, getHomework, MEDIA_TYPE_LABEL, mediaFor, skipHomework } from '@/lib/homework';
import { overallLevel } from '@/lib/learner';
import { language } from '@/lib/languages';

const MINUTE_OPTIONS = [15, 30, 45, 60, 90];

export default function HomeworkDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hw = useDbQuery(() => getHomework(id), id);
  const ai = useAiStatus();
  const [minutes, setMinutes] = useState<number | null>(null);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ feedback: string | null; corrected: string | null } | null>(null);

  if (!hw) return null;
  const media = mediaFor(hw);
  const minutesChoice = minutes ?? hw.est_minutes;

  async function submit() {
    setSaving(true);
    const r = await completeHomework({ id, minutes: minutesChoice, reflection, level: overallLevel() });
    setSaving(false);
    if (r.feedback) setResult(r);
    else router.back();
  }

  return (
    <Screen edges={[]}>
        <Row>
          <Pill label={MEDIA_TYPE_LABEL[hw.kind]} tone="accent" />
          <Pill label={hw.level} tone="primary" />
          <Pill label={`~${hw.est_minutes} min`} tone="accent" />
        </Row>
        <Text variant="title">{hw.title}</Text>
        <Text variant="body">{hw.instructions}</Text>

        {media ? (
          <Card tone="surfaceAlt">
            <Text variant="bodyStrong">{media.title}</Text>
            <Text variant="caption">{media.description}</Text>
            <Text variant="caption" color="accent">
              Find it on: {media.whereToFind}
            </Text>
          </Card>
        ) : null}

        {hw.status === 'assigned' && !result ? (
          <>
            <Section title="How long did you spend?">
              <Row style={styles.wrap}>
                {MINUTE_OPTIONS.map((m) => (
                  <Chip key={m} label={`${m} min`} selected={minutesChoice === m} onPress={() => setMinutes(m)} />
                ))}
              </Row>
            </Section>
            <Section title={`Reflection (in ${language().name}, if you can)`}>
              <Input
                large
                multiline
                value={reflection}
                onChangeText={setReflection}
                autoCapitalize="sentences"
                placeholder={language().phrases.reflectionPrompt}
              />
              <Text variant="caption">
                {ai?.status === 'available'
                  ? 'Your tutor will correct it and give you a tip. Writing about what you watched is great practice.'
                  : 'Optional. Writing a few sentences about it is great practice.'}
              </Text>
            </Section>
            <Button label="Mark as done" size="lg" loading={saving} onPress={submit} />
            <Button
              label="Skip this one"
              variant="ghost"
              onPress={() => {
                skipHomework(id);
                router.back();
              }}
            />
          </>
        ) : null}

        {result?.feedback ? (
          <>
            <Feedback tone="success" title="Logged! Tutor feedback:">
              <Text variant="body">{result.feedback}</Text>
              {result.corrected ? <Text variant="bodyStrong">✓ {result.corrected}</Text> : null}
            </Feedback>
            <Button label="Done" size="lg" onPress={() => router.back()} />
          </>
        ) : null}

        {hw.status !== 'assigned' && !result ? (
          <Card>
            <Text variant="label">{hw.status === 'done' ? `Done · ${hw.minutes_spent ?? 0} min` : 'Skipped'}</Text>
            {hw.reflection ? <Text variant="body">{hw.reflection}</Text> : null}
            {hw.feedback ? (
              <Text variant="body" color="textSecondary">
                {hw.feedback}
              </Text>
            ) : null}
          </Card>
        ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexWrap: 'wrap', gap: Spacing.two },
});
