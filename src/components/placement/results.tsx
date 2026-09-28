import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, Pill, ProgressBar, Row, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { ratingToCefr } from '@/lib/curriculum';
import type { PlacementPlan, PlacementResult } from '@/lib/placement';

export function PlacementResults({
  result,
  plan,
  onContinue,
  onStartOver,
}: {
  result: PlacementResult;
  plan: PlacementPlan;
  onContinue: () => void;
  onStartOver: () => void;
}) {
  const bars = [
    { label: 'Vocabulary', rating: result.vocab },
    { label: 'Grammar & reading', rating: result.grammar },
    { label: 'Listening', rating: result.listening },
  ];

  return (
    <View style={styles.container}>
      <Text variant="label">Your Spanish today</Text>
      <Text variant="title">{plan.headline}</Text>

      <Card>
        {bars.map((b) => (
          <View key={b.label} style={styles.bar}>
            <Row style={styles.between}>
              <Text variant="bodyStrong">{b.label}</Text>
              <Text variant="caption">{b.rating < 5 ? 'Just starting' : ratingToCefr(b.rating)}</Text>
            </Row>
            {/* Scale to B2 so early progress is visible. */}
            <ProgressBar value={b.rating / 400} height={8} />
          </View>
        ))}
        {result.wordsKnown > 0 ? (
          <Text variant="caption">
            You recognize roughly {result.wordsKnown} of the course&apos;s core words.
          </Text>
        ) : null}
      </Card>

      <Section title="Your plan">
        <Card tone="primarySoft">
          <Row>
            <Pill label={`Unit ${plan.startUnit.order} · ${plan.startUnit.cefr}`} tone="primary" />
          </Row>
          <Text variant="heading">{plan.startUnit.title}</Text>
          <Text variant="body">{plan.explanation}</Text>
        </Card>
      </Section>

      <Button label="Sounds good" size="lg" onPress={onContinue} />
      {plan.startUnit.order > 1 ? (
        <Button label="Start from the very beginning instead" variant="ghost" onPress={onStartOver} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  bar: { gap: 6, paddingVertical: 4 },
  between: { justifyContent: 'space-between' },
});
