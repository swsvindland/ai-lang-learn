import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ActivityView } from '@/components/activities';
import { Button } from '@/components/ui/button';
import { Row } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useAiStatus } from '@/hooks/use-ai-status';
import { generatePracticeSentences, generateReading } from '@/lib/ai/tutor';
import type { Unit } from '@/lib/curriculum';
import { currentUnit } from '@/lib/learner';
import type { Activity } from '@/lib/session/types';
import { newCard } from '@/lib/srs';

function staticActivities(unit: Unit): Record<string, Activity> {
  const vocab = unit.vocab[0];
  const grammar = unit.grammar[0];
  const sentence = grammar.examples[0];
  return {
    flashcard: {
      kind: 'flashcard',
      card: { ...newCard(), id: 'dev', vocab_id: vocab.id, direction: 'es_en' },
      vocab,
      difficulty: 10,
    },
    introduce: { kind: 'introduce', vocab, difficulty: 10 },
    grammar: { kind: 'grammar', grammar, refresher: false },
    cloze: {
      kind: 'cloze',
      drill: grammar.drills[0],
      grammarId: grammar.id,
      options: [grammar.drills[0].answer, ...grammar.drills[0].distractors],
    },
    listen: {
      kind: 'listen-choice',
      sentence,
      options: grammar.examples.map((e) => e.en),
      answerIndex: 0,
    },
    dictation: { kind: 'dictation', sentence },
    speak: { kind: 'speak', sentence, mode: 'repeat' },
    produce: { kind: 'speak', sentence, mode: 'produce' },
    translate: { kind: 'translate', sentence },
    conversation: { kind: 'conversation', scenario: unit.scenario, unit },
  };
}

/** Dev-only gallery for exercising each activity type without a full session. */
export default function DevGallery() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [key, setKey] = useState(0);
  const [log, setLog] = useState('');
  const [busy, setBusy] = useState(false);
  const aiReady = useAiStatus()?.status === 'available';
  // The learner's current unit, so the gallery shows the language being studied.
  const unit = useMemo(() => currentUnit(), []);
  const grammar = unit.grammar[0];
  const STATIC = useMemo(() => staticActivities(unit), [unit]);

  function show(a: Activity) {
    setActivity(a);
    setKey((k) => k + 1);
  }

  async function aiReading() {
    setBusy(true);
    try {
      const passage = await generateReading({ level: 'A1', unit, words: unit.vocab.slice(0, 8), interests: ['movies'] });
      show({ kind: 'reading', passage });
    } catch (e) {
      setLog(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function aiSentences() {
    setBusy(true);
    try {
      const s = await generatePracticeSentences({ level: 'A1', grammar, words: unit.vocab.slice(0, 10), count: 4 });
      setLog(s.map((x) => `${x.text}${x.reading ? ` (${x.reading})` : ''} — ${x.en}`).join('\n'));
      show({ kind: 'translate', sentence: s[0] });
    } catch (e) {
      setLog(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.flex}>
      <ScrollView horizontal style={styles.bar} contentContainerStyle={styles.barContent}>
        <Row>
          {Object.entries(STATIC).map(([name, a]) => (
            <Button key={name} label={name} size="sm" variant="secondary" onPress={() => show(a)} />
          ))}
          <Button label="AI reading" size="sm" disabled={!aiReady} onPress={aiReading} />
          <Button label="AI sentences" size="sm" disabled={!aiReady} onPress={aiSentences} />
        </Row>
      </ScrollView>
      {busy ? <ActivityIndicator /> : null}
      {log ? (
        <Text variant="caption" style={styles.log} selectable>
          {log}
        </Text>
      ) : null}
      {activity ? (
        activity.kind === 'conversation' ? (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={110}>
            <View style={[styles.flex, styles.content]}>
              <ActivityView key={key} activity={activity} level="A1" aiReady={aiReady} onDone={(r) => setLog(JSON.stringify(r))} />
            </View>
          </KeyboardAvoidingView>
        ) : (
          <ScrollView contentContainerStyle={[styles.content, styles.grow]} automaticallyAdjustKeyboardInsets>
            <ActivityView key={key} activity={activity} level="A1" aiReady={aiReady} onDone={(r) => setLog(JSON.stringify(r))} />
          </ScrollView>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  bar: { flexGrow: 0 },
  barContent: { padding: Spacing.two },
  log: { paddingHorizontal: Spacing.three },
  content: { padding: Spacing.three, width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' },
});
