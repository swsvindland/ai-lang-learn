import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton, Feedback, haptic } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { gradeTranslation, type Grade as AiGrade } from '@/lib/ai/tutor';
import { speakSpanish } from '@/lib/speech';
import { checkTyped, compareSentences, type WordMatch } from '@/lib/text';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';
import { WordDiff } from './word-diff';

export function DictationActivity({ activity, onDone }: ActivityProps<'dictation'>) {
  const { sentence } = activity;
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; matches: WordMatch[]; accentSlip: boolean } | null>(null);

  useEffect(() => {
    speakSpanish(sentence.es);
  }, [sentence.es]);

  function check() {
    const typed = checkTyped(sentence.es, text);
    const cmp = compareSentences(sentence.es, text);
    const score = typed.correct ? (typed.accentSlip ? 0.9 : 1) : cmp.score;
    setResult({ score, matches: cmp.matches, accentSlip: typed.accentSlip });
    haptic(score >= 0.8 ? 'success' : 'error');
  }

  return (
    <ActivityShell
      kicker="Dictation · Type what you hear"
      icon={Icons.ear}
      footer={
        result ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: 'listening',
                score: result.score,
                prompt: 'dictation',
                expected: sentence.es,
                response: text,
              })
            }
          />
        ) : (
          <Button label="Check" size="lg" disabled={!text.trim()} onPress={check} />
        )
      }>
      <View style={styles.audio}>
        <AudioButton text={sentence.es} size={80} />
      </View>
      <Input
        large
        multiline
        value={text}
        onChangeText={setText}
        editable={!result}
        placeholder="Escribe aquí…"
        autoFocus
      />
      {result ? (
        <Feedback
          tone={result.score >= 0.95 ? 'success' : result.score >= 0.6 ? 'warning' : 'error'}
          title={
            result.score >= 0.95
              ? result.accentSlip
                ? 'Right — watch the accents'
                : '¡Perfecto!'
              : result.score >= 0.6
                ? 'Close!'
                : 'Keep listening'
          }>
          <WordDiff matches={result.matches} />
          <Text variant="caption">{sentence.en}</Text>
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

export function TranslateActivity({ activity, onDone, level, aiReady }: ActivityProps<'translate'>) {
  const { sentence } = activity;
  const [text, setText] = useState('');
  const [checking, setChecking] = useState(false);
  const [grade, setGrade] = useState<AiGrade | null>(null);

  async function check() {
    setChecking(true);
    let result: AiGrade | null = null;
    if (aiReady) {
      try {
        result = await gradeTranslation({ level, english: sentence.en, reference: sentence.es, answer: text });
      } catch {
        result = null;
      }
    }
    if (!result) {
      // Offline fallback: compare against the reference sentence.
      const typed = checkTyped(sentence.es, text);
      const cmp = compareSentences(sentence.es, text);
      const score = typed.correct ? 1 : cmp.score;
      result = {
        score,
        verdict: score >= 0.95 ? 'correct' : score >= 0.7 ? 'almost' : 'incorrect',
        corrected: sentence.es,
        explanation:
          score >= 0.95
            ? 'Matches the model answer.'
            : 'Compared with the model answer. Other phrasings can also be right.',
      };
    }
    setGrade(result);
    setChecking(false);
    haptic(result.score >= 0.7 ? 'success' : 'error');
    speakSpanish(result.verdict === 'correct' ? text : sentence.es);
  }

  const tone = grade?.verdict === 'correct' ? 'success' : grade?.verdict === 'almost' ? 'warning' : 'error';

  return (
    <ActivityShell
      kicker="Translate into Spanish"
      icon={Icons.pencil}
      footer={
        grade ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: 'writing',
                score: grade.score,
                prompt: sentence.en,
                expected: sentence.es,
                response: text,
                feedback: grade.explanation,
              })
            }
          />
        ) : (
          <Button label="Check" size="lg" disabled={!text.trim()} loading={checking} onPress={check} />
        )
      }>
      <Card style={styles.prompt}>
        <Text variant="title">{sentence.en}</Text>
      </Card>
      <Input
        large
        multiline
        value={text}
        onChangeText={setText}
        editable={!grade}
        placeholder="En español…"
        autoFocus
      />
      {grade ? (
        <Feedback
          tone={tone}
          title={grade.verdict === 'correct' ? '¡Excelente!' : grade.verdict === 'almost' ? 'Almost there' : 'Not quite'}>
          <Text variant="body">{grade.explanation}</Text>
          {grade.verdict !== 'correct' && grade.corrected ? (
            <Text variant="bodyStrong">✓ {grade.corrected}</Text>
          ) : null}
          {grade.corrected !== sentence.es ? <Text variant="caption">Model answer: {sentence.es}</Text> : null}
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  audio: { alignItems: 'center', paddingVertical: Spacing.three },
  prompt: { paddingVertical: Spacing.four },
});
