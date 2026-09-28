import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/controls';
import { Icon, Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useSpanishRecognizer } from '@/hooks/use-spanish-recognizer';
import { useTheme } from '@/hooks/use-theme';
import { checkSpanish, conversationTurn, type ChatTurn } from '@/lib/ai/tutor';
import type { Cefr, Scenario } from '@/lib/curriculum';
import type { ActivityResult } from '@/lib/session/types';
import { speakSpanish } from '@/lib/speech';

import { ActivityShell, type ActivityProps } from './shell';
import { MicButton } from './speak';

type Message = ChatTurn & { english?: string; correction?: string; spoken?: boolean };

const MAX_LEARNER_TURNS = 10;
// The model tends to call the goal met too early; require a real exchange first.
const MIN_TURNS_FOR_GOAL = 3;

export function ConversationActivity({ activity, onDone, level }: ActivityProps<'conversation'>) {
  return <Conversation scenario={activity.scenario} level={level} onFinish={onDone} />;
}

export function Conversation({
  scenario,
  level,
  onFinish,
}: {
  scenario: Scenario;
  level: Cefr;
  onFinish: (result: ActivityResult) => void;
}) {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: scenario.opener }]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [goalMet, setGoalMet] = useState(false);
  const [showEnglish, setShowEnglish] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  // Voice input fills the draft so the learner can review before sending.
  const recognizer = useSpanishRecognizer({ onFinal: (text) => text && setDraft(text) });
  const learnerTurns = messages.filter((m) => m.role === 'learner');
  const atLimit = learnerTurns.length >= MAX_LEARNER_TURNS;

  useEffect(() => {
    speakSpanish(scenario.opener);
  }, [scenario.opener]);

  async function send() {
    const text = draft.trim();
    if (!text || thinking) return;
    const spoken = !!recognizer.finalTranscript && text === recognizer.finalTranscript.trim();
    const history: Message[] = [...messages, { role: 'learner', text, spoken }];
    setMessages(history);
    setDraft('');
    recognizer.reset();
    setThinking(true);
    setError(null);
    try {
      const reply = await conversationTurn({ level, scenario, history });
      setMessages((prev) => [...prev, { role: 'ai', text: reply.reply, english: reply.replyEnglish }]);
      const learnerCount = history.filter((m) => m.role === 'learner').length;
      if (reply.goalMet && learnerCount >= MIN_TURNS_FOR_GOAL) setGoalMet(true);
      speakSpanish(reply.reply);
      // Proofread after the reply is on screen so the conversation never waits on it.
      const previousAi = [...messages].reverse().find((m) => m.role === 'ai')?.text;
      const learnerIndex = history.length - 1;
      checkSpanish({ level, text, context: previousAi })
        .then((check) => {
          if (!check) return;
          const note = check.explanation ? `${check.explanation} → ${check.corrected}` : `Better: ${check.corrected}`;
          setMessages((prev) => prev.map((m, i) => (i === learnerIndex ? { ...m, correction: note } : m)));
        })
        .catch(() => undefined);
    } catch {
      setError('Your partner lost their train of thought. Try sending again.');
      setMessages(messages);
      setDraft(text);
    } finally {
      setThinking(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }

  function finish() {
    const turns = learnerTurns.length;
    const corrections = learnerTurns.filter((m) => m.correction).length;
    const spokenTurns = learnerTurns.filter((m) => m.spoken).length;
    const accuracy = turns ? 1 - corrections / turns : 0;
    // Reward engagement as well as accuracy: a 1-turn chat shouldn't score like a full one.
    const engagement = Math.min(1, turns / 5);
    onFinish({
      skill: spokenTurns * 2 >= turns ? 'speaking' : 'writing',
      score: turns ? 0.3 + 0.7 * accuracy * (0.5 + 0.5 * engagement) : 0,
      noAttempt: turns === 0,
      prompt: scenario.title,
      response: learnerTurns.map((m) => m.text).join(' | '),
      feedback: learnerTurns
        .map((m) => m.correction)
        .filter(Boolean)
        .join(' | '),
    });
  }

  return (
    <ActivityShell
      kicker={`Conversation · ${scenario.title}`}
      icon={Icons.chat}
      footer={
        <>
          {goalMet || atLimit ? (
            <Feedback tone="success" title={goalMet ? '¡Lo lograste! Goal reached.' : 'Great conversation!'} />
          ) : null}
          {!goalMet && !atLimit ? (
            <View style={styles.composer}>
              <Input
                value={draft}
                onChangeText={setDraft}
                placeholder={recognizer.state === 'listening' ? recognizer.transcript || 'Escuchando…' : 'Escribe en español…'}
                style={styles.draft}
                multiline
                autoCapitalize="sentences"
                editable={recognizer.state !== 'listening'}
              />
              {draft.trim() ? (
                <Pressable
                  accessibilityLabel="Send"
                  onPress={send}
                  disabled={thinking}
                  style={[styles.send, { backgroundColor: theme.primary, opacity: thinking ? 0.5 : 1 }]}>
                  <Icon name={Icons.send} tint={theme.onPrimary} size={22} />
                </Pressable>
              ) : (
                <MicButton size={50} state={recognizer.state} onStart={recognizer.start} onStop={recognizer.stop} />
              )}
            </View>
          ) : null}
          <Button
            label={goalMet || atLimit ? 'Finish conversation' : 'End conversation'}
            variant={goalMet || atLimit ? 'primary' : 'ghost'}
            size={goalMet || atLimit ? 'lg' : 'md'}
            onPress={finish}
          />
        </>
      }>
      {learnerTurns.length === 0 ? (
        <Card tone="surfaceAlt">
          <Text variant="caption">{scenario.setting}</Text>
          <Text variant="bodyStrong">Your goal: {scenario.learnerGoal}</Text>
        </Card>
      ) : (
        <Text variant="caption" numberOfLines={2}>
          Goal: {scenario.learnerGoal}
        </Text>
      )}
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((m, i) =>
          m.role === 'ai' ? (
            <Pressable
              key={i}
              onPress={() => speakSpanish(m.text)}
              onLongPress={() => setShowEnglish((s) => ({ ...s, [i]: !s[i] }))}
              style={[styles.bubble, styles.aiBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text variant="body">{m.text}</Text>
              {showEnglish[i] && m.english ? <Text variant="caption">{m.english}</Text> : null}
              {m.english ? (
                <Text
                  variant="caption"
                  color="accent"
                  onPress={() => setShowEnglish((s) => ({ ...s, [i]: !s[i] }))}>
                  {showEnglish[i] ? 'Hide translation' : 'Translate'}
                </Text>
              ) : null}
            </Pressable>
          ) : (
            <View key={i} style={styles.learnerWrap}>
              <View style={[styles.bubble, styles.learnerBubble, { backgroundColor: theme.primarySoft }]}>
                <Text variant="body">{m.text}</Text>
              </View>
              {m.correction ? (
                <View style={[styles.correction, { backgroundColor: theme.warningSoft }]}>
                  <Icon name={Icons.lightbulb} size={14} color="warning" />
                  <Text variant="caption" style={styles.flex}>
                    {m.correction}
                  </Text>
                </View>
              ) : null}
            </View>
          )
        )}
        {thinking ? (
          <View style={[styles.bubble, styles.aiBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text variant="body" color="textTertiary">
              …
            </Text>
          </View>
        ) : null}
        {error ? (
          <Text variant="caption" color="error">
            {error}
          </Text>
        ) : null}
      </ScrollView>
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  messages: { gap: Spacing.two, paddingVertical: Spacing.two },
  bubble: { borderRadius: Radius.lg, padding: 12, maxWidth: '85%', gap: 4, borderCurve: 'continuous' },
  aiBubble: { alignSelf: 'flex-start', borderWidth: StyleSheet.hairlineWidth, borderBottomLeftRadius: 4 },
  learnerWrap: { alignItems: 'flex-end', gap: 4 },
  learnerBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  correction: {
    flexDirection: 'row',
    gap: 6,
    borderRadius: Radius.sm,
    padding: 8,
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  draft: { flex: 1, maxHeight: 120 },
  send: { width: 50, height: 50, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
});
