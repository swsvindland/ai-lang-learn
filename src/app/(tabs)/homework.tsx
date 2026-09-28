import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, Icons, type IconName } from '@/components/ui/icon';
import { Card, Pill, Row, Screen, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import type { MediaType } from '@/lib/curriculum';
import {
  assignHomework,
  homeworkHistory,
  levelAppropriateMedia,
  MEDIA_TYPE_LABEL,
  openHomework,
  type Homework,
} from '@/lib/homework';
import { currentUnit, getProfile, overallLevel } from '@/lib/learner';

const MEDIA_ICONS: Record<MediaType, IconName> = {
  tv: Icons.tv,
  movie: Icons.film,
  book: Icons.book,
  podcast: Icons.headphones,
  youtube: Icons.video,
  music: Icons.music,
  news: Icons.newspaper,
  app: Icons.phone,
};

export default function HomeworkScreen() {
  const theme = useTheme();
  const [assigning, setAssigning] = useState(false);
  const data = useDbQuery(() => {
    const profile = getProfile();
    const level = overallLevel();
    return {
      open: openHomework(),
      history: homeworkHistory(10),
      level,
      library: levelAppropriateMedia(level, profile?.interests ?? []).slice(0, 12),
    };
  });

  async function suggestMore() {
    const profile = getProfile();
    if (!profile) return;
    setAssigning(true);
    try {
      await assignHomework({
        level: data.level,
        unit: currentUnit(),
        interests: profile.interests,
        sessionId: null,
        count: 1,
      });
    } finally {
      setAssigning(false);
    }
  }

  return (
    <Screen>
      <Text variant="display">Homework</Text>
      <Text variant="body" color="textSecondary">
        Real Spanish between sessions: shows, books, and podcasts picked for your level ({data.level}). Log what you do
        and it counts toward your hours.
      </Text>

      <Section title="Assigned">
        {data.open.length ? (
          data.open.map((hw) => <HomeworkCard key={hw.id} hw={hw} />)
        ) : (
          <Card tone="surfaceAlt">
            <Text variant="body">Nothing assigned right now. Finish a session or ask for something new.</Text>
          </Card>
        )}
        {data.open.length < 3 ? (
          <Button
            label="Suggest something"
            variant="secondary"
            icon={Icons.sparkles}
            loading={assigning}
            onPress={suggestMore}
          />
        ) : null}
      </Section>

      <Section title={`Library for ${data.level}`}>
        {data.library.map((m) => (
          <Card key={m.id} style={styles.media}>
            <View style={[styles.mediaIcon, { backgroundColor: theme.accentSoft }]}>
              <Icon name={MEDIA_ICONS[m.type]} color="accent" />
            </View>
            <View style={styles.flex}>
              <Text variant="bodyStrong">{m.title}</Text>
              <Text variant="caption">
                {MEDIA_TYPE_LABEL[m.type]} · {m.minLevel}–{m.maxLevel} · {m.region}
              </Text>
              <Text variant="body" color="textSecondary">
                {m.description}
              </Text>
              <Text variant="caption">
                <Text variant="caption" style={styles.bold}>
                  Tip:{' '}
                </Text>
                {m.howToUse}
              </Text>
              <Text variant="caption" color="accent">
                {m.whereToFind}
              </Text>
            </View>
          </Card>
        ))}
      </Section>

      {data.history.length ? (
        <Section title="Done">
          {data.history.map((hw) => (
            <HomeworkCard key={hw.id} hw={hw} />
          ))}
        </Section>
      ) : null}
    </Screen>
  );
}

function HomeworkCard({ hw }: { hw: Homework }) {
  const theme = useTheme();
  const done = hw.status === 'done';
  return (
    <Pressable onPress={() => router.push(`/homework/${hw.id}`)}>
      <Card style={styles.media}>
        <View style={[styles.mediaIcon, { backgroundColor: done ? theme.successSoft : theme.primarySoft }]}>
          <Icon name={done ? Icons.check : MEDIA_ICONS[hw.kind]} color={done ? 'success' : 'primary'} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">{hw.title}</Text>
          <Text variant="caption" numberOfLines={done ? 1 : 3}>
            {hw.instructions}
          </Text>
          <Row>
            <Pill label={`~${hw.est_minutes} min`} tone="accent" />
            {hw.status === 'skipped' ? <Pill label="skipped" tone="warning" /> : null}
            {done && hw.minutes_spent ? <Pill label={`${hw.minutes_spent} min logged`} tone="success" /> : null}
          </Row>
        </View>
        <Icon name={Icons.chevronRight} size={14} color="textTertiary" />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 4 },
  bold: { fontWeight: '700' },
  media: { flexDirection: 'row', gap: Spacing.three, alignItems: 'flex-start' },
  mediaIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
});
