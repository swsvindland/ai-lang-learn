import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { vocabLabel } from '@/lib/cards';
import { speakSpanish } from '@/lib/speech';
import type { Grade } from '@/lib/srs';

import { ActivityShell, type ActivityProps } from './shell';

const GRADES: { grade: Grade; label: string; tone: 'error' | 'warning' | 'success' | 'accent' }[] = [
  { grade: 1, label: 'Again', tone: 'error' },
  { grade: 2, label: 'Hard', tone: 'warning' },
  { grade: 3, label: 'Good', tone: 'success' },
  { grade: 4, label: 'Easy', tone: 'accent' },
];

const SCORE: Record<Grade, number> = { 1: 0, 2: 0.6, 3: 0.9, 4: 1 };

export function FlashcardActivity({ activity, onDone }: ActivityProps<'flashcard'>) {
  const theme = useTheme();
  const { vocab, card } = activity;
  const recognition = card.direction === 'es_en';
  const [revealed, setRevealed] = useState(false);
  const spanish = vocabLabel(vocab);

  useEffect(() => {
    if (recognition) speakSpanish(spanish);
  }, [recognition, spanish]);

  function reveal() {
    setRevealed(true);
    if (!recognition) speakSpanish(spanish);
  }

  return (
    <ActivityShell
      kicker={recognition ? 'Flashcard · What does it mean?' : 'Flashcard · Say it in Spanish'}
      icon={Icons.cards}
      footer={
        revealed ? (
          <View style={styles.grades}>
            {GRADES.map((g) => (
              <Pressable
                key={g.grade}
                accessibilityRole="button"
                onPress={() =>
                  onDone(
                    {
                      skill: 'vocab',
                      score: SCORE[g.grade],
                      ref: vocab.id,
                      prompt: recognition ? spanish : vocab.en,
                      expected: recognition ? vocab.en : spanish,
                    },
                    g.grade
                  )
                }
                style={({ pressed }) => [
                  styles.grade,
                  { backgroundColor: theme[`${g.tone}Soft`], opacity: pressed ? 0.8 : 1 },
                ]}>
                <Text variant="bodyStrong" style={{ color: theme[g.tone] }}>
                  {g.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Button label="Show answer" size="lg" onPress={reveal} />
        )
      }>
      <Card style={styles.card}>
        {card.state === 'new' ? <Pill label="New" tone="primary" /> : null}
        {recognition ? (
          <>
            <Text variant="spanish" center>
              {spanish}
            </Text>
            <AudioButton text={spanish} size={48} />
          </>
        ) : (
          <Text variant="title" center>
            {vocab.en}
          </Text>
        )}
        {revealed ? (
          <View style={[styles.answer, { borderTopColor: theme.border }]}>
            {recognition ? (
              <Text variant="title" center>
                {vocab.en}
              </Text>
            ) : (
              <>
                <Text variant="spanish" center color="primary">
                  {spanish}
                </Text>
                <AudioButton text={spanish} size={44} />
              </>
            )}
            <Text variant="body" center color="textSecondary">
              {vocab.example.es}
            </Text>
            <Text variant="caption" center>
              {vocab.example.en}
            </Text>
          </View>
        ) : null}
      </Card>
    </ActivityShell>
  );
}

export function IntroduceActivity({ activity, onDone }: ActivityProps<'introduce'>) {
  const { vocab } = activity;
  const spanish = vocabLabel(vocab);

  useEffect(() => {
    speakSpanish(spanish);
  }, [spanish]);

  return (
    <ActivityShell
      kicker="New word"
      icon={Icons.sparkles}
      footer={
        <Button
          label="Got it"
          size="lg"
          onPress={() => onDone({ skill: 'vocab', score: 1, ref: vocab.id, noAttempt: true })}
        />
      }>
      <Card style={styles.card}>
        <Pill label={vocab.pos} tone="accent" />
        <Text variant="spanish" center style={styles.big}>
          {spanish}
        </Text>
        <Text variant="title" center color="textSecondary">
          {vocab.en}
        </Text>
        <AudioButton text={spanish} />
      </Card>
      <Card tone="surfaceAlt">
        <Text variant="label">Example</Text>
        <Text variant="bodyStrong">{vocab.example.es}</Text>
        <Text variant="caption">{vocab.example.en}</Text>
        <AudioButton text={vocab.example.es} size={40} />
      </Card>
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.five },
  big: { fontSize: 36, lineHeight: 44 },
  answer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  grades: { flexDirection: 'row', gap: Spacing.two },
  grade: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
  },
});
