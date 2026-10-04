import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AudioButton, ChoiceOption, haptic } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card } from '@/components/ui/layout';
import { TargetText } from '@/components/ui/target-text';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';

export function ReadingActivity({ activity, onDone }: ActivityProps<'reading'>) {
  const { passage } = activity;
  const [answers, setAnswers] = useState<(number | null)[]>(() => passage.questions.map(() => null));
  const done = answers.every((a) => a !== null);
  const score = passage.questions.reduce((s, q, i) => s + (answers[i] === q.answerIndex ? 1 : 0), 0) / passage.questions.length;

  function answer(qi: number, oi: number) {
    if (answers[qi] !== null) return;
    haptic(oi === passage.questions[qi].answerIndex ? 'success' : 'error');
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  }

  return (
    <ActivityShell
      kicker="Reading"
      icon={Icons.book}
      footer={
        done ? (
          <ContinueButton
            onPress={() => onDone({ skill: 'reading', score, prompt: passage.title, response: `${Math.round(score * 100)}%` })}
          />
        ) : null
      }>
      <Card style={styles.passage}>
        <Text variant="heading">{passage.title}</Text>
        {passage.reading ? (
          <TargetText text={passage.text} reading={passage.reading} variant="body" style={styles.text} />
        ) : (
          <Text variant="body" style={styles.text} selectable>
            {passage.text}
          </Text>
        )}
        <AudioButton text={passage.text} size={44} />
      </Card>
      {passage.questions.map((q, qi) => (
        <View key={q.question} style={styles.question}>
          <Text variant="bodyStrong">
            {qi + 1}. {q.question}
          </Text>
          {q.options.map((o, oi) => {
            const picked = answers[qi];
            const state =
              picked === null ? 'idle' : oi === q.answerIndex ? 'correct' : oi === picked ? 'incorrect' : 'dimmed';
            return <ChoiceOption key={`${oi}-${o}`} label={o} state={state} onPress={() => answer(qi, oi)} />;
          })}
        </View>
      ))}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  passage: { gap: Spacing.three },
  text: { fontSize: 18, lineHeight: 28 },
  question: { gap: Spacing.two },
});
