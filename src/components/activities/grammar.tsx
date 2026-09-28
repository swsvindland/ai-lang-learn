import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card, Pill } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { explainGrammar, type GrammarAnswer } from '@/lib/ai/tutor';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';

export function GrammarActivity({ activity, onDone, level, aiReady }: ActivityProps<'grammar'>) {
  const { grammar, refresher } = activity;
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<GrammarAnswer | null>(null);
  const [failed, setFailed] = useState(false);
  const [asking, setAsking] = useState(false);

  async function ask() {
    const q = question.trim();
    if (!q) return;
    setAsking(true);
    setAnswer(null);
    setFailed(false);
    try {
      setAnswer(await explainGrammar({ level, grammar, question: q }));
    } catch {
      setFailed(true);
    } finally {
      setAsking(false);
    }
  }

  return (
    <ActivityShell
      kicker={refresher ? 'Grammar refresher' : 'Grammar'}
      icon={Icons.graduation}
      footer={<ContinueButton onPress={() => onDone({ skill: 'grammar', score: 1, ref: grammar.id, noAttempt: true })} />}>
      <Text variant="title">{grammar.title}</Text>
      <Text variant="body">{grammar.summary}</Text>
      <View style={styles.examples}>
        {grammar.examples.map((ex) => (
          <Card key={ex.es} style={styles.example}>
            <View style={styles.exampleText}>
              <Text variant="bodyStrong">{ex.es}</Text>
              <Text variant="caption">{ex.en}</Text>
            </View>
            <AudioButton text={ex.es} size={40} showSlow={false} />
          </Card>
        ))}
      </View>
      {aiReady ? (
        <Card tone="surfaceAlt">
          <Pill label="Ask your tutor" tone="primary" />
          <Input
            value={question}
            onChangeText={setQuestion}
            placeholder="e.g. When do I use this instead of…?"
            autoCapitalize="sentences"
            returnKeyType="send"
            onSubmitEditing={ask}
          />
          <Button label="Ask" variant="secondary" size="sm" icon={Icons.question} loading={asking} onPress={ask} />
          {answer ? (
            <View style={styles.answer}>
              <Text variant="body">{answer.answer}</Text>
              {answer.examples.map((ex) => (
                <View key={ex.es} style={styles.answerExample}>
                  <View style={styles.exampleText}>
                    <Text variant="bodyStrong">{ex.es}</Text>
                    <Text variant="caption">{ex.en}</Text>
                  </View>
                  <AudioButton text={ex.es} size={34} showSlow={false} />
                </View>
              ))}
              <Text variant="caption" color="textTertiary">
                AI answers can be wrong. The notes above are the reference.
              </Text>
            </View>
          ) : null}
          {failed ? (
            <Text variant="caption" color="error">
              Sorry, I couldn&apos;t answer that right now.
            </Text>
          ) : null}
        </Card>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  examples: { gap: Spacing.two },
  example: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  exampleText: { flex: 1, gap: 2 },
  answer: { gap: Spacing.two },
  answerExample: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
