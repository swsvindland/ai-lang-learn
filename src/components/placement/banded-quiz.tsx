import { useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ChoiceOption, haptic } from '@/components/ui/controls';
import { ProgressBar } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import type { Cefr } from '@/lib/curriculum';
import { tally, type BandTally } from '@/lib/placement';

export type QuizQuestion = {
  key: string;
  level: Cefr;
  prompt: ReactNode;
  options: string[];
  answerIndex: number;
  /** Shown briefly after answering (e.g. the Spanish sentence for listening). */
  reveal?: ReactNode;
};

type Outcome = 'correct' | 'wrong' | 'skipped';

/**
 * Runs questions ordered easy → hard. After each level, stops early if the
 * learner clearly doesn't know it: harder levels would only add guessing noise
 * and frustration.
 */
export function BandedQuiz({
  section,
  total,
  questions,
  stopBelow = 0.25,
  onDone,
}: {
  section: string;
  total: number;
  questions: QuizQuestion[];
  stopBelow?: number;
  onDone: (result: BandTally) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const results = useRef<{ level: Cefr; outcome: Outcome }[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const q = questions[index];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function record(outcome: Outcome, delay: number) {
    results.current.push({ level: q.level, outcome });
    timer.current = setTimeout(() => advance(), delay);
  }

  function advance() {
    setPicked(null);
    const next = questions[index + 1];
    const levelDone = !next || next.level !== q.level;
    if (levelDone) {
      const atLevel = results.current.filter((r) => r.level === q.level);
      const correct = atLevel.filter((r) => r.outcome === 'correct').length;
      const wrong = atLevel.filter((r) => r.outcome === 'wrong').length;
      const known = Math.max(0, (correct - wrong / 3) / atLevel.length);
      if (!next || known < stopBelow) {
        onDone(tally(results.current));
        return;
      }
    }
    setIndex(index + 1);
  }

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answerIndex;
    haptic(correct ? 'success' : 'error');
    record(correct ? 'correct' : 'wrong', q.reveal ? 1600 : 700);
  }

  function skip() {
    if (picked !== null) return;
    setPicked(-1);
    record('skipped', q.reveal ? 1600 : 500);
  }

  if (!q) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="label">{section}</Text>
        <Text variant="caption">
          {Math.min(index + 1, total)} / {total}
        </Text>
      </View>
      <ProgressBar value={index / total} />
      <View key={q.key} style={styles.prompt}>
        {q.prompt}
      </View>
      <View style={styles.options}>
        {q.options.map((o, i) => (
          <ChoiceOption
            key={`${q.key}-${i}`}
            label={o}
            state={
              picked === null ? 'idle' : i === q.answerIndex ? 'correct' : i === picked ? 'incorrect' : 'dimmed'
            }
            onPress={() => choose(i)}
          />
        ))}
      </View>
      {picked !== null && q.reveal ? <View style={styles.reveal}>{q.reveal}</View> : null}
      {picked === null ? <Button label="I don't know" variant="ghost" onPress={skip} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  prompt: { gap: Spacing.two, paddingVertical: Spacing.two },
  options: { gap: Spacing.two },
  reveal: { alignItems: 'center', gap: 2 },
});
