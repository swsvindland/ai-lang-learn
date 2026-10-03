import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton, Feedback, haptic } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/layout';
import { TargetText } from '@/components/ui/target-text';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { gradeTranslation, type Grade as AiGrade } from '@/lib/ai/tutor';
import { language } from '@/lib/languages';
import { speak } from '@/lib/speech';
import { checkTyped, compareSentences, type WordMatch } from '@/lib/text';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';
import { WordDiff } from './word-diff';

export function DictationActivity({ activity, onDone }: ActivityProps<'dictation'>) {
  const { sentence } = activity;
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ score: number; matches: WordMatch[]; slip: boolean } | null>(null);
  const lang = language();

  useEffect(() => {
    speak(sentence.text);
  }, [sentence.text]);

  function check() {
    const typed = checkTyped(sentence.text, text, sentence.reading);
    const cmp = compareSentences(sentence.text, text, sentence.reading);
    // Kana for kanji is a fine way to take dictation; missing accents (Spanish) cost a little.
    const slipScore = lang.spaced ? 0.9 : 1;
    const score = typed.correct ? (typed.slip ? slipScore : 1) : cmp.score;
    setResult({ score, matches: cmp.matches, slip: typed.slip });
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
                expected: sentence.text,
                response: text,
              })
            }
          />
        ) : (
          <Button label="Check" size="lg" disabled={!text.trim()} onPress={check} />
        )
      }>
      <View style={styles.audio}>
        <AudioButton text={sentence.text} size={80} />
      </View>
      <Input
        large
        multiline
        value={text}
        onChangeText={setText}
        editable={!result}
        placeholder={lang.phrases.writeHere}
        autoFocus
      />
      {result ? (
        <Feedback
          tone={result.score >= 0.95 ? 'success' : result.score >= 0.6 ? 'warning' : 'error'}
          title={
            result.score >= 0.95
              ? result.slip && lang.spaced
                ? lang.slipTitle
                : lang.phrases.perfect
              : result.score >= 0.6
                ? 'Close!'
                : 'Keep listening'
          }>
          <WordDiff matches={result.matches} />
          {!lang.spaced ? <TargetText text={sentence.text} reading={sentence.reading} variant="bodyStrong" /> : null}
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
  const lang = language();

  async function check() {
    setChecking(true);
    let result: AiGrade | null = null;
    if (aiReady) {
      try {
        result = await gradeTranslation({ level, english: sentence.en, reference: sentence.text, answer: text });
      } catch {
        result = null;
      }
    }
    if (!result) {
      // Offline fallback: compare against the reference sentence.
      const typed = checkTyped(sentence.text, text, sentence.reading);
      const cmp = compareSentences(sentence.text, text, sentence.reading);
      const score = typed.correct ? 1 : cmp.score;
      result = {
        score,
        verdict: score >= 0.95 ? 'correct' : score >= 0.7 ? 'almost' : 'incorrect',
        corrected: sentence.text,
        explanation:
          score >= 0.95
            ? 'Matches the model answer.'
            : 'Compared with the model answer. Other phrasings can also be right.',
      };
    }
    setGrade(result);
    setChecking(false);
    haptic(result.score >= 0.7 ? 'success' : 'error');
    // Romaji answers can't be read aloud properly, so Japanese always plays the model answer.
    speak(result.verdict === 'correct' && lang.spaced ? text : sentence.text);
  }

  const tone = grade?.verdict === 'correct' ? 'success' : grade?.verdict === 'almost' ? 'warning' : 'error';

  return (
    <ActivityShell
      kicker={`Translate into ${lang.name}`}
      icon={Icons.pencil}
      footer={
        grade ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: 'writing',
                score: grade.score,
                prompt: sentence.en,
                expected: sentence.text,
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
        placeholder={lang.phrases.writeInLanguage}
        autoFocus
      />
      {grade ? (
        <Feedback
          tone={tone}
          title={grade.verdict === 'correct' ? lang.phrases.excellent : grade.verdict === 'almost' ? 'Almost there' : 'Not quite'}>
          <Text variant="body">{grade.explanation}</Text>
          {grade.verdict !== 'correct' && grade.corrected ? (
            <Text variant="bodyStrong">✓ {grade.corrected}</Text>
          ) : null}
          {grade.corrected !== sentence.text ? (
            <>
              <Text variant="caption">Model answer:</Text>
              <TargetText text={sentence.text} reading={sentence.reading} variant="body" />
            </>
          ) : null}
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  audio: { alignItems: 'center', paddingVertical: Spacing.three },
  prompt: { paddingVertical: Spacing.four },
});
