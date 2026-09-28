import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, Icons } from '@/components/ui/icon';
import { Card, Pill, ProgressBar, Row, Screen, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import {
  CEFR_LEVELS,
  CUMULATIVE_HOURS,
  FLUENT_RATING,
  LEVEL_DESCRIPTIONS,
  ratingToCefr,
  units,
} from '@/lib/curriculum';
import {
  getProfile,
  getSkills,
  overallRating,
  SKILL_LABELS,
  studyStats,
  unitMastery,
  unitStatuses,
} from '@/lib/learner';

export default function JourneyScreen() {
  const theme = useTheme();
  const data = useDbQuery(() => {
    const skills = getSkills();
    const statuses = unitStatuses();
    const active = units.find((u) => statuses[u.id] === 'active');
    return {
      skills,
      rating: overallRating(skills),
      stats: studyStats(),
      statuses,
      activeMastery: active ? unitMastery(active).overall : 0,
      profile: getProfile(),
    };
  });
  const { skills, rating, stats, statuses, activeMastery, profile } = data;
  const level = ratingToCefr(rating);
  const toFluent = Math.min(1, rating / FLUENT_RATING);

  // Pace projection: hours per week from the plan + expected homework.
  const weeklyHours = profile ? (profile.sessionsPerWeek * profile.sessionMinutes) / 60 + 1.5 : 3;
  const hoursRemaining = Math.max(0, CUMULATIVE_HOURS.C1 - Math.max(stats.totalHours, CUMULATIVE_HOURS[level]));
  const weeksToFluent = Math.ceil(hoursRemaining / weeklyHours);

  return (
    <Screen>
      <Text variant="display">Your journey</Text>

      <Card style={styles.hero}>
        <Row style={styles.between}>
          <View>
            <Text variant="label">Current level</Text>
            <Text variant="display" color="primary">
              {level}
            </Text>
          </View>
          <View style={styles.right}>
            <Text variant="label">To fluent (C1)</Text>
            <Text variant="title">{Math.round(toFluent * 100)}%</Text>
          </View>
        </Row>
        <ProgressBar value={toFluent} height={10} />
        <Text variant="body" color="textSecondary">
          {LEVEL_DESCRIPTIONS[level]}
        </Text>
        <View style={styles.ladder}>
          {CEFR_LEVELS.slice(0, 5).map((l) => {
            const reached = CEFR_LEVELS.indexOf(l) <= CEFR_LEVELS.indexOf(level);
            return (
              <View key={l} style={styles.rung}>
                <View
                  style={[
                    styles.rungDot,
                    { backgroundColor: reached ? theme.primary : theme.surfaceAlt, borderColor: theme.primary },
                  ]}
                />
                <Text variant="caption" color={reached ? 'primary' : 'textTertiary'}>
                  {l}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Row gap={Spacing.two}>
        <Card style={styles.stat}>
          <Text variant="label">Study time</Text>
          <Text variant="title">{stats.totalHours.toFixed(1)}h</Text>
          <Text variant="caption">
            {stats.lessonHours.toFixed(1)}h lessons · {stats.homeworkHours.toFixed(1)}h immersion
          </Text>
        </Card>
        <Card style={styles.stat}>
          <Text variant="label">At your pace</Text>
          <Text variant="title">{formatDuration(weeksToFluent)}</Text>
          <Text variant="caption">to C1 at ~{weeklyHours.toFixed(1)}h/week incl. homework</Text>
        </Card>
      </Row>

      <Section title="Skills">
        <Card>
          {skills.map((s) => (
            <View key={s.skill} style={styles.skill}>
              <Row style={styles.between}>
                <Text variant="bodyStrong">{SKILL_LABELS[s.skill]}</Text>
                <Text variant="caption">
                  {ratingToCefr(s.rating)} · {Math.round(s.rating)}
                </Text>
              </Row>
              <ProgressBar value={s.rating / 500} height={6} color="accent" />
            </View>
          ))}
          <Text variant="caption">
            Skills move with every exercise you do. Your sessions lean toward your weakest two.
          </Text>
        </Card>
      </Section>

      <Section title="Course">
        {CEFR_LEVELS.slice(0, 5).map((lvl) => {
          const levelUnits = units.filter((u) => u.cefr === lvl);
          if (!levelUnits.length) return null;
          return (
            <View key={lvl} style={styles.levelGroup}>
              <Row>
                <Pill label={lvl} tone="primary" />
                <Text variant="caption" style={styles.flex}>
                  ~{CUMULATIVE_HOURS[CEFR_LEVELS[CEFR_LEVELS.indexOf(lvl) + 1]] ?? '1000+'} total hours to finish
                </Text>
              </Row>
              {levelUnits.map((u) => {
                const status = statuses[u.id] ?? 'locked';
                return (
                  <Pressable key={u.id} onPress={() => router.push(`/unit/${u.id}`)}>
                    <Card
                      style={[styles.unit, status === 'active' && { borderColor: theme.primary, borderWidth: 2 }]}>
                      <View
                        style={[
                          styles.unitIcon,
                          {
                            backgroundColor:
                              status === 'done' || status === 'skipped'
                                ? theme.successSoft
                                : status === 'active'
                                  ? theme.primarySoft
                                  : theme.surfaceAlt,
                          },
                        ]}>
                        <Icon
                          name={
                            status === 'done' || status === 'skipped'
                              ? Icons.check
                              : status === 'active'
                                ? Icons.play
                                : Icons.lock
                          }
                          size={16}
                          color={status === 'done' || status === 'skipped' ? 'success' : status === 'active' ? 'primary' : 'textTertiary'}
                        />
                      </View>
                      <View style={styles.flex}>
                        <Text variant="bodyStrong" color={status === 'locked' ? 'textSecondary' : 'text'}>
                          {u.order}. {u.title}
                        </Text>
                        <Text variant="caption" numberOfLines={1}>
                          {u.grammar.map((g) => g.title).join(' · ')}
                        </Text>
                        {status === 'active' ? <ProgressBar value={activeMastery} height={5} /> : null}
                        {status === 'skipped' ? (
                          <Text variant="caption" color="success">
                            Placed out · words in refresh
                          </Text>
                        ) : null}
                      </View>
                      <Icon name={Icons.chevronRight} size={14} color="textTertiary" />
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </Section>
    </Screen>
  );
}

function formatDuration(weeks: number) {
  if (weeks <= 0) return '🎉';
  if (weeks < 10) return `~${weeks} wks`;
  if (weeks < 78) return `~${Math.round(weeks / 4.35)} mo`;
  return `~${(weeks / 52).toFixed(1)} yrs`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { gap: Spacing.three, padding: Spacing.four },
  between: { justifyContent: 'space-between' },
  right: { alignItems: 'flex-end' },
  ladder: { flexDirection: 'row', justifyContent: 'space-between' },
  rung: { alignItems: 'center', gap: 4 },
  rungDot: { width: 14, height: 14, borderRadius: Radius.pill, borderWidth: 2 },
  stat: { flex: 1, gap: 2 },
  skill: { gap: 6, paddingVertical: 4 },
  levelGroup: { gap: Spacing.two, marginBottom: Spacing.two },
  unit: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  unitIcon: { width: 34, height: 34, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
});
