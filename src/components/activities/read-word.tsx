import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AudioButton, ChoiceOption, Feedback, haptic, type ChoiceState } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card } from '@/components/ui/layout';
import { TargetText } from '@/components/ui/target-text';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { language } from '@/lib/languages';
import { speak } from '@/lib/speech';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';

function optionState(i: number, picked: number | null, answer: number): ChoiceState {
  if (picked === null) return 'idle';
  if (i === answer) return 'correct';
  if (i === picked) return 'incorrect';
  return 'dimmed';
}

/**
 * Reading practice with words from the spoken course: the learner already
 * knows how to say the word, and now reads it in the characters they just
 * learned (no furigana or romaji until they answer).
 */
export function ReadWordActivity({ activity, onDone }: ActivityProps<'read-word'>) {
  const { vocab, ask, options, answerIndex } = activity;
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answerIndex;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    haptic(i === answerIndex ? 'success' : 'error');
    speak(vocab.text);
  }

  return (
    <ActivityShell
      kicker={ask === 'sound' ? 'Reading · How do you say it?' : 'Reading · What does it mean?'}
      icon={Icons.book}
      footer={
        picked !== null ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: 'reading',
                score: correct ? 1 : 0,
                ref: vocab.id,
                prompt: vocab.text,
                expected: options[answerIndex],
                response: options[picked],
              })
            }
          />
        ) : null
      }>
      <Card style={styles.card}>
        {picked === null ? (
          <TargetText text={vocab.text} center style={styles.word} aids={false} />
        ) : (
          <>
            <TargetText text={vocab.text} reading={vocab.reading} center style={styles.word} />
            <AudioButton text={vocab.text} size={44} />
          </>
        )}
      </Card>
      <View style={styles.options}>
        {options.map((o, i) => (
          <ChoiceOption key={`${i}-${o}`} label={o} state={optionState(i, picked, answerIndex)} onPress={() => choose(i)} />
        ))}
      </View>
      {picked !== null ? (
        <Feedback tone={correct ? 'success' : 'error'} title={correct ? language().phrases.correct : 'Not quite'}>
          <Text variant="body">
            {vocab.text}
            {vocab.reading && vocab.reading.replace(/\s+/g, '') !== vocab.text ? ` (${vocab.reading.replace(/\s+/g, '')})` : ''}{' '}
            — {vocab.en}
          </Text>
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.five },
  word: { fontSize: 40, lineHeight: 50 },
  options: { gap: Spacing.two },
});
