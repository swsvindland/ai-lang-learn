import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card, Row } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { vocabLabel } from '@/lib/cards';
import { speakSpanish } from '@/lib/speech';

import { ActivityShell, type ActivityProps } from './shell';

type Phase = 'ask' | 'confirm' | 'learn';

/**
 * Self-assessed check for words from units the learner placed out of. Fast by
 * design (a few seconds per word), with a confirmation step so "I know it"
 * stays honest.
 */
export function QuickCheckActivity({ activity, onDone }: ActivityProps<'quick-check'>) {
  const { vocab } = activity;
  const spanish = vocabLabel(vocab);
  const [phase, setPhase] = useState<Phase>('ask');

  useEffect(() => {
    speakSpanish(spanish);
  }, [spanish]);

  function finish(known: boolean) {
    onDone({
      skill: 'vocab',
      score: known ? 1 : 0,
      ref: vocab.id,
      prompt: spanish,
      expected: vocab.en,
      response: known ? 'known' : 'forgotten',
    });
  }

  return (
    <ActivityShell
      kicker="Refresh · Do you still know it?"
      icon={Icons.lightbulb}
      footer={
        phase === 'ask' ? (
          <Row gap={Spacing.two}>
            <Button style={styles.flex} size="lg" variant="secondary" label="Not sure" onPress={() => setPhase('learn')} />
            <Button style={styles.flex} size="lg" label="I know it" onPress={() => setPhase('confirm')} />
          </Row>
        ) : phase === 'confirm' ? (
          <Row gap={Spacing.two}>
            <Button style={styles.flex} size="lg" variant="danger" label="No, I was wrong" onPress={() => finish(false)} />
            <Button style={styles.flex} size="lg" label="Yes, got it" onPress={() => finish(true)} />
          </Row>
        ) : (
          <Button size="lg" label="Learn it again" onPress={() => finish(false)} />
        )
      }>
      <Card style={styles.card}>
        <Text variant="spanish" center style={styles.word}>
          {spanish}
        </Text>
        <AudioButton text={spanish} size={48} />
        {phase !== 'ask' ? (
          <View style={styles.answer}>
            <Text variant="title" center>
              {vocab.en}
            </Text>
            <Text variant="body" center color="textSecondary">
              {vocab.example.es}
            </Text>
            <Text variant="caption" center>
              {vocab.example.en}
            </Text>
          </View>
        ) : null}
      </Card>
      {phase === 'confirm' ? (
        <Text variant="caption" center>
          Was that what you had in mind?
        </Text>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.five },
  word: { fontSize: 36, lineHeight: 44 },
  answer: { alignItems: 'center', gap: Spacing.two },
});
