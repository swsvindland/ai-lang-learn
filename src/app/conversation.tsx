import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';

import { Conversation } from '@/components/activities/conversation';
import { Icon, Icons } from '@/components/ui/icon';
import { Card, Pill, Screen } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { courseUnits, unitDifficulty, type Unit } from '@/lib/curriculum';
import { levelLabel } from '@/lib/languages';
import { overallLevel, recordAttempt, unitStatuses } from '@/lib/learner';

/** Free conversation practice outside of sessions, using any unlocked scenario. */
export default function ConversationScreen() {
  const [unit, setUnit] = useState<Unit | null>(null);
  const level = overallLevel();
  const statuses = unitStatuses();
  const available = courseUnits()
    .filter((u) => statuses[u.id] && statuses[u.id] !== 'locked')
    .reverse();

  if (!unit) {
    return (
      <Screen edges={[]}>
        <Text variant="body" color="textSecondary">
          Pick a situation. Your partner stays in character and gently corrects mistakes.
        </Text>
        {available.map((u) => (
          <Pressable key={u.id} onPress={() => setUnit(u)}>
            <Card style={styles.row}>
              <View style={styles.flex}>
                <Pill label={levelLabel(u.cefr)} tone="primary" />
                <Text variant="bodyStrong">{u.scenario.title}</Text>
                <Text variant="caption" numberOfLines={2}>
                  {u.scenario.setting}
                </Text>
              </View>
              <Icon name={Icons.chevronRight} color="textTertiary" />
            </Card>
          </Pressable>
        ))}
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}>
      <View style={styles.chat}>
        <Conversation
          scenario={unit.scenario}
          level={level}
          onFinish={(result) => {
            if (!result.noAttempt) {
              recordAttempt({
                sessionId: null,
                kind: 'conversation',
                skill: result.skill,
                score: result.score,
                difficulty: unitDifficulty(unit) + 10,
                prompt: result.prompt,
                response: result.response,
                feedback: result.feedback,
              });
            }
            router.back();
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  chat: { flex: 1, padding: Spacing.three, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
});
