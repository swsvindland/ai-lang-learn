import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, Icons } from '@/components/ui/icon';
import { Card, ProgressBar, Row, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { resolveVocab, vocabLabel } from '@/lib/cards';
import { getUnit, type Unit } from '@/lib/curriculum';
import { getHomework } from '@/lib/homework';
import { language } from '@/lib/languages';
import { SKILL_LABELS, type Skill } from '@/lib/learner';
import type { SessionSummary } from '@/lib/session/types';

export function SessionSummaryView({
  summary,
  unit,
  onClose,
}: {
  summary: SessionSummary;
  unit: Unit;
  onClose: () => void;
}) {
  const minutes = Math.round(summary.activeSeconds / 60);
  const duration = minutes < 1 ? 'Under a minute' : `${minutes} minute${minutes === 1 ? '' : 's'}`;
  const newWords = summary.newWords.map((id) => resolveVocab(id)?.vocab).filter((v) => !!v);
  const homework = summary.homeworkIds.map(getHomework).filter((h) => !!h);
  const advanced = summary.unitAdvancedTo ? getUnit(summary.unitAdvancedTo) : null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text variant="display" center>
          {language().phrases.wellDone}
        </Text>
        <Text variant="body" color="textSecondary" center>
          {duration} of focused practice · {summary.activities} exercise{summary.activities === 1 ? '' : 's'}
        </Text>
      </View>

      {advanced ? (
        <Card tone="successSoft">
          <Row>
            <Icon name={Icons.flag} color="success" />
            <Text variant="bodyStrong" color="success">
              Unit complete: {unit.title}
            </Text>
          </Row>
          <Text variant="body">Next up: {advanced.title}</Text>
        </Card>
      ) : null}

      <Row gap={Spacing.two}>
        <Card style={styles.stat}>
          <Text variant="label">Accuracy</Text>
          <Text variant="title">{Math.round(summary.averageScore * 100)}%</Text>
        </Card>
        <Card style={styles.stat}>
          <Text variant="label">New words</Text>
          <Text variant="title">{summary.newWords.length}</Text>
        </Card>
        <Card style={styles.stat}>
          <Text variant="label">Reviewed</Text>
          <Text variant="title">{summary.reviewed}</Text>
        </Card>
      </Row>

      {Object.keys(summary.skills).length ? (
        <Section title="Skills practiced">
          <Card>
            {(Object.entries(summary.skills) as [Skill, { count: number; avg: number }][]).map(([skill, s]) => (
              <View key={skill} style={styles.skill}>
                <Row style={styles.skillHeader}>
                  <Text variant="bodyStrong">{SKILL_LABELS[skill]}</Text>
                  <Text variant="caption">
                    {s.count}× · {Math.round(s.avg * 100)}%
                  </Text>
                </Row>
                <ProgressBar value={s.avg} height={6} color={s.avg >= 0.8 ? 'success' : s.avg >= 0.5 ? 'warning' : 'error'} />
              </View>
            ))}
          </Card>
        </Section>
      ) : null}

      {newWords.length ? (
        <Section title="Words you met">
          <Card>
            <Text variant="body">{newWords.map((v) => `${vocabLabel(v)}${v.reading ? ` (${v.reading})` : ''} — ${v.en}`).join('\n')}</Text>
          </Card>
        </Section>
      ) : null}

      {summary.newCharacters?.length ? (
        <Section title="Characters you learned">
          <Card>
            <Text variant="title">{summary.newCharacters.join('  ')}</Text>
            <Text variant="caption">They&apos;ll come back in reviews; their romaji and furigana fade once you know them.</Text>
          </Card>
        </Section>
      ) : null}

      {homework.length ? (
        <Section title="Homework before next time">
          {homework.map((hw) => (
            <Card key={hw.id}>
              <Text variant="bodyStrong">{hw.title}</Text>
              <Text variant="caption">
                ~{hw.est_minutes} min · {hw.instructions}
              </Text>
            </Card>
          ))}
          <Text variant="caption" center>
            Immersion between sessions is where fluency grows. Log it in the Homework tab.
          </Text>
        </Section>
      ) : null}

      <Button label="Done" size="lg" onPress={onClose} />
      {homework.length ? (
        <Button
          label="View homework"
          variant="ghost"
          onPress={() => router.navigate('/homework')}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  hero: { gap: Spacing.two, paddingVertical: Spacing.four },
  stat: { flex: 1, gap: 2 },
  skill: { gap: 6, paddingVertical: 4 },
  skillHeader: { justifyContent: 'space-between' },
});
