import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, Icons } from '@/components/ui/icon';
import { Card, ProgressBar, Row, Screen, Section } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { useDbQuery } from '@/hooks/use-db-query';
import { useTheme } from '@/hooks/use-theme';
import { dueCount } from '@/lib/cards';
import { ratingProgress, ratingToCefr } from '@/lib/curriculum';
import { openHomework } from '@/lib/homework';
import { language, levelLabel } from '@/lib/languages';
import {
  currentUnit,
  getProfile,
  overallRating,
  refreshProgress,
  sessionsThisWeek,
  startOfWeek,
  studyStats,
  unitMastery,
} from '@/lib/learner';
import { WEEKDAYS } from '@/lib/reminders';
import { nextScriptItems, scriptKnowledge } from '@/lib/script';

function greeting() {
  return language().phrases.greeting(new Date().getHours());
}

export default function TodayScreen() {
  const theme = useTheme();
  const ai = useAiStatus();
  const data = useDbQuery(() => {
    const unit = currentUnit();
    const rating = overallRating();
    return {
      profile: getProfile(),
      unit,
      mastery: unitMastery(unit),
      due: dueCount(),
      week: sessionsThisWeek(),
      stats: studyStats(),
      homework: openHomework(),
      rating,
      refresh: refreshProgress(),
      nextChars: nextScriptItems(8, unit.order, scriptKnowledge().introducedIds),
    };
  });
  const { profile, unit, mastery, due, week, stats, homework, rating, refresh, nextChars } = data;
  if (!profile) return null;

  const goal = profile.sessionsPerWeek;
  const goalMet = week.length >= goal;
  const weekStart = startOfWeek();
  const studiedDays = new Set(week.map((s) => Math.floor((s.started_at - weekStart) / 86_400_000)));
  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="caption">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        <Text variant="display">
          {greeting()}
          {profile.name ? `, ${profile.name}` : ''}
        </Text>
      </View>

      <Card style={styles.hero} tone="primarySoft">
        <Text variant="label" color="primary">
          {goalMet ? 'Weekly goal reached · bonus session' : `Session ${week.length + 1} of ${goal} this week`}
        </Text>
        <Text variant="title">{unit.title}</Text>
        <Text variant="body" color="textSecondary">
          {profile.sessionMinutes} focused minutes · {language().name} {levelLabel(unit.cefr)}
        </Text>
        <View style={styles.plan}>
          {due > 0 ? <PlanLine icon={Icons.cards} text={`Review ${due} due card${due === 1 ? '' : 's'}`} /> : null}
          {refresh.pending > 0 ? (
            <PlanLine
              icon={Icons.lightbulb}
              text={`Refresh earlier words: ${refresh.total - refresh.pending} of ${refresh.total} checked`}
            />
          ) : null}
          {nextChars.length ? (
            <PlanLine
              icon={Icons.book}
              text={`Reading: ${nextChars[0].group.script} ${nextChars
                .filter((c) => c.group.script === nextChars[0].group.script)
                .slice(0, 5)
                .map((c) => c.vocab.text)
                .join(' ')}`}
            />
          ) : null}
          <PlanLine icon={Icons.graduation} text={unit.grammar.map((g) => g.title).join(' · ')} />
          <PlanLine icon={Icons.mic} text="Listening, speaking & writing practice" />
          {ai?.status === 'available' ? <PlanLine icon={Icons.chat} text={`Role-play: ${unit.scenario.title}`} /> : null}
        </View>
        <Row>
          <View style={styles.flex}>
            <ProgressBar value={mastery.overall} />
          </View>
          <Text variant="caption">{Math.round(mastery.overall * 100)}% of unit</Text>
        </Row>
        <Button label="Start session" icon={Icons.play} size="lg" onPress={() => router.push('/session')} />
      </Card>

      <Section title="This week">
        <Card>
          <View style={styles.week}>
            {WEEKDAYS.map((d, i) => {
              const done = studiedDays.has(i);
              const planned = profile.reminderDays.includes(d.value);
              return (
                <View key={d.value} style={styles.day}>
                  <Text variant="caption" color={i === todayIndex ? 'primary' : 'textSecondary'}>
                    {d.short}
                  </Text>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: done ? theme.primary : 'transparent',
                        borderColor: done ? theme.primary : planned ? theme.primary : theme.border,
                        borderStyle: planned && !done ? 'dashed' : 'solid',
                      },
                    ]}>
                    {done ? <Icon name={Icons.check} size={14} tint={theme.onPrimary} /> : null}
                  </View>
                </View>
              );
            })}
          </View>
          <Text variant="caption" center>
            {goalMet
              ? `Goal met: ${week.length} session${week.length === 1 ? '' : 's'}. Anything extra is a bonus.`
              : `${goal - week.length} more session${goal - week.length === 1 ? '' : 's'} to hit your weekly goal.`}
          </Text>
        </Card>
      </Section>

      <Row gap={Spacing.two}>
        <Stat label="Level" value={levelLabel(ratingToCefr(rating))} progress={ratingProgress(rating)} />
        <Stat label="Hours" value={stats.totalHours.toFixed(1)} />
        <Stat label="Words" value={String(stats.wordsKnown)} />
      </Row>

      {homework.length ? (
        <Section title="Homework">
          {homework.slice(0, 2).map((hw) => (
            <Pressable key={hw.id} onPress={() => router.push(`/homework/${hw.id}`)}>
              <Card style={styles.hwCard}>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{hw.title}</Text>
                  <Text variant="caption" numberOfLines={2}>
                    {hw.instructions}
                  </Text>
                </View>
                <Icon name={Icons.chevronRight} color="textTertiary" />
              </Card>
            </Pressable>
          ))}
        </Section>
      ) : null}

      <Section title="Extra practice">
        <Row gap={Spacing.two}>
          {ai?.status === 'available' ? (
            <Button
              style={styles.flex}
              variant="secondary"
              icon={Icons.chat}
              label="Chat"
              onPress={() => router.push('/conversation')}
            />
          ) : null}
          <Button
            style={styles.flex}
            variant="secondary"
            icon={Icons.cards}
            label={due ? `Review (${due})` : 'Review'}
            disabled={!due}
            onPress={() => router.push({ pathname: '/session', params: { mode: 'review' } })}
          />
        </Row>
      </Section>

      {ai && ai.status !== 'available' ? (
        <Pressable onPress={() => router.push('/ai')}>
          <Card tone="warningSoft">
            <Row>
              <Icon name={Icons.warning} color="warning" />
              <Text variant="bodyStrong" style={styles.flex}>
                AI tutor is off
              </Text>
              <Icon name={Icons.chevronRight} color="textTertiary" />
            </Row>
            <Text variant="caption">
              {ai.reason ?? 'The AI tutor is unavailable.'} Lessons still work with the built-in course. For
              conversation practice and feedback, use on-device AI or a cloud model.
            </Text>
          </Card>
        </Pressable>
      ) : null}
    </Screen>
  );
}

function PlanLine({ icon, text }: { icon: (typeof Icons)[keyof typeof Icons]; text: string }) {
  return (
    <Row>
      <Icon name={icon} size={16} color="primary" />
      <Text variant="body" style={styles.flex} numberOfLines={2}>
        {text}
      </Text>
    </Row>
  );
}

function Stat({ label, value, progress }: { label: string; value: string; progress?: number }) {
  return (
    <Card style={styles.stat}>
      <Text variant="label">{label}</Text>
      <Text variant="title">{value}</Text>
      {progress !== undefined ? <ProgressBar value={progress} height={5} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { gap: 2, paddingTop: Spacing.two },
  hero: { gap: Spacing.three, padding: Spacing.four },
  plan: { gap: Spacing.two },
  week: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.one },
  day: { alignItems: 'center', gap: 6 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stat: { flex: 1, gap: 4 },
  hwCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
