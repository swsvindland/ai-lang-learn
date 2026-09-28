import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AudioButton } from '@/components/ui/controls';
import { Card, Pill, ProgressBar, Row, Screen, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { cardFor, vocabLabel } from '@/lib/cards';
import { getUnit } from '@/lib/curriculum';
import { grammarMastery, unitMastery, unitStatuses } from '@/lib/learner';
import { isLearned } from '@/lib/srs';

export default function UnitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const unit = getUnit(id);
  const data = useDbQuery(
    () =>
      unit
        ? {
            status: unitStatuses()[unit.id] ?? 'locked',
            mastery: unitMastery(unit),
            grammar: Object.fromEntries(unit.grammar.map((g) => [g.id, grammarMastery(g.id)?.mastery ?? 0])),
            words: Object.fromEntries(
              unit.vocab.map((v) => {
                const card = cardFor(v.id, 'es_en');
                return [v.id, card ? (isLearned(card) ? 'learned' : 'learning') : 'new'];
              })
            ),
          }
        : null,
    id
  );
  if (!unit || !data) return null;

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: unit.cefr }} />
      <View style={styles.header}>
        <Row>
          <Pill label={`Unit ${unit.order} · ${unit.cefr}`} tone="primary" />
          <Pill label={data.status} tone={data.status === 'active' ? 'primary' : data.status === 'locked' ? 'accent' : 'success'} />
        </Row>
        <Text variant="title">{unit.title}</Text>
        <Text variant="body" color="textSecondary">
          {unit.theme}
        </Text>
        {data.status === 'active' ? <ProgressBar value={data.mastery.overall} /> : null}
      </View>

      <Section title="You'll be able to">
        <Card>
          {unit.canDo.map((c) => (
            <Text key={c} variant="body">
              • {c}
            </Text>
          ))}
        </Card>
      </Section>

      <Section title="Grammar">
        {unit.grammar.map((g) => (
          <Card key={g.id}>
            <Row style={styles.between}>
              <Text variant="bodyStrong" style={styles.flex}>
                {g.title}
              </Text>
              {data.grammar[g.id] > 0 ? <Text variant="caption">{Math.round(data.grammar[g.id] * 100)}%</Text> : null}
            </Row>
            <Text variant="body" color="textSecondary">
              {g.summary}
            </Text>
            {g.examples.slice(0, 2).map((ex) => (
              <Row key={ex.es}>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{ex.es}</Text>
                  <Text variant="caption">{ex.en}</Text>
                </View>
                <AudioButton text={ex.es} size={34} showSlow={false} />
              </Row>
            ))}
          </Card>
        ))}
      </Section>

      <Section title={`Vocabulary · ${unit.vocab.length} words`}>
        <Card style={styles.vocab}>
          {unit.vocab.map((v) => (
            <Row key={v.id} style={styles.word}>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{vocabLabel(v)}</Text>
                <Text variant="caption">{v.en}</Text>
              </View>
              {data.words[v.id] !== 'new' ? (
                <Pill label={data.words[v.id]} tone={data.words[v.id] === 'learned' ? 'success' : 'warning'} />
              ) : null}
              <AudioButton text={vocabLabel(v)} size={32} showSlow={false} />
            </Row>
          ))}
        </Card>
      </Section>

      <Section title="Conversation">
        <Card>
          <Text variant="bodyStrong">{unit.scenario.title}</Text>
          <Text variant="caption">{unit.scenario.setting}</Text>
        </Card>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: Spacing.two },
  between: { justifyContent: 'space-between' },
  vocab: { gap: 0 },
  word: { paddingVertical: 6 },
});
