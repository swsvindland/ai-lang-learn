import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card, Pill } from '@/components/ui/layout';
import { TargetText } from '@/components/ui/target-text';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { vocabLabel } from '@/lib/cards';
import { language } from '@/lib/languages';
import { speak } from '@/lib/speech';
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
  // Card directions are stored as 'es_en' (recognize) / 'en_es' (produce) for every language.
  const recognition = card.direction === 'es_en';
  const character = vocab.pos === 'character';
  const [revealed, setRevealed] = useState(false);
  const label = vocabLabel(vocab);

  useEffect(() => {
    if (recognition) speak(label);
  }, [recognition, label]);

  function reveal() {
    setRevealed(true);
    if (!recognition) speak(label);
  }

  const kicker = character
    ? recognition
      ? 'Flashcard · How is it read?'
      : 'Flashcard · Picture the character'
    : recognition
      ? 'Flashcard · What does it mean?'
      : `Flashcard · Say it in ${language().name}`;

  return (
    <ActivityShell
      kicker={kicker}
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
                      prompt: recognition ? label : vocab.en,
                      expected: recognition ? vocab.en : label,
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
            <TargetText
              text={label}
              reading={vocab.reading}
              center
              style={character ? styles.big : undefined}
              aids={!character || revealed}
            />
            <AudioButton text={label} size={48} />
          </>
        ) : (
          <>
            <Text variant="title" center>
              {vocab.en}
            </Text>
            {character ? (
              // Romaji alone is ambiguous (ka → か or カ), so name the script and give the example's meaning.
              <Text variant="caption" center>
                {/[\u30A0-\u30FF]/.test(vocab.text) ? 'katakana' : 'hiragana'} · as in “{vocab.example.en}”
              </Text>
            ) : null}
          </>
        )}
        {revealed ? (
          <View style={[styles.answer, { borderTopColor: theme.border }]}>
            {recognition ? (
              <Text variant="title" center>
                {vocab.en}
              </Text>
            ) : (
              <>
                <TargetText text={label} reading={vocab.reading} center color="primary" style={character ? styles.big : undefined} />
                <AudioButton text={label} size={44} />
              </>
            )}
            <TargetText
              text={vocab.example.text}
              reading={vocab.example.reading}
              variant="body"
              color="textSecondary"
              center
            />
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
  const label = vocabLabel(vocab);
  const character = vocab.pos === 'character';

  useEffect(() => {
    speak(label);
  }, [label]);

  return (
    <ActivityShell
      kicker={character ? 'New character' : 'New word'}
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
        <TargetText text={label} reading={vocab.reading} center style={styles.big} aids={!character} />
        <Text variant="title" center color="textSecondary">
          {vocab.en}
        </Text>
        <AudioButton text={label} />
      </Card>
      <Card tone="surfaceAlt">
        <Text variant="label">Example</Text>
        <TargetText text={vocab.example.text} reading={vocab.example.reading} variant="bodyStrong" />
        <Text variant="caption">{vocab.example.en}</Text>
        <AudioButton text={vocab.example.text} size={40} />
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
