import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AudioButton, ChoiceOption, Feedback, haptic, type ChoiceState } from '@/components/ui/controls';
import { Icons } from '@/components/ui/icon';
import { Card } from '@/components/ui/layout';
import { TargetText, useReadingAids } from '@/components/ui/target-text';
import { isAllKana, romajiFor } from '@/lib/japanese';
import { needsRomaji } from '@/lib/reading-aids';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { language } from '@/lib/languages';
import { speak } from '@/lib/speech';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';

function optionState(i: number, picked: number | null, answer: number): ChoiceState {
  if (picked === null) return 'idle';
  if (i === answer) return 'correct';
  if (i === picked) return 'incorrect';
  return 'dimmed';
}

export function ClozeActivity({ activity, onDone }: ActivityProps<'cloze'>) {
  const { drill, options, grammarId, skill } = activity;
  const answerIndex = options.indexOf(drill.answer);
  const aids = useReadingAids();
  // Kana answer choices get romaji underneath until the learner can read them.
  const hint = (o: string) => (isAllKana(o) && needsRomaji(o, aids) ? romajiFor(o) : undefined);
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answerIndex;
  const full = drill.text.replace('___', drill.answer);
  const phrases = language().phrases;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    haptic(i === answerIndex ? 'success' : 'error');
    speak(full);
  }

  return (
    <ActivityShell
      kicker="Fill the gap"
      icon={Icons.pencil}
      footer={
        picked !== null ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: skill ?? 'grammar',
                score: correct ? 1 : 0,
                ref: grammarId,
                prompt: drill.text,
                expected: drill.answer,
                response: options[picked],
              })
            }
          />
        ) : null
      }>
      <Card style={styles.prompt}>
        <TargetText
          text={drill.text}
          reading={drill.reading}
          variant="title"
          gap={{
            text: picked === null ? '_____' : drill.answer,
            color: picked === null ? 'primary' : correct ? 'success' : 'error',
          }}
        />
        <Text variant="caption">{drill.en}</Text>
      </Card>
      <View style={styles.options}>
        {options.map((o, i) => (
          <ChoiceOption
            key={o}
            label={o}
            hint={hint(o)}
            state={optionState(i, picked, answerIndex)}
            onPress={() => choose(i)}
          />
        ))}
      </View>
      {picked !== null ? (
        <Feedback tone={correct ? 'success' : 'error'} title={correct ? phrases.correct : `It's "${drill.answer}"`}>
          <Text variant="body">{full}</Text>
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

export function ListenChoiceActivity({ activity, onDone }: ActivityProps<'listen-choice'>) {
  const { sentence, options, answerIndex } = activity;
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    speak(sentence.text);
  }, [sentence.text]);

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    haptic(i === answerIndex ? 'success' : 'error');
  }

  return (
    <ActivityShell
      kicker="Listening · What did you hear?"
      icon={Icons.ear}
      footer={
        picked !== null ? (
          <ContinueButton
            onPress={() =>
              onDone({
                skill: 'listening',
                score: picked === answerIndex ? 1 : 0,
                prompt: sentence.text,
                expected: sentence.en,
                response: options[picked],
              })
            }
          />
        ) : null
      }>
      <View style={styles.audio}>
        <AudioButton text={sentence.text} size={80} />
      </View>
      <View style={styles.options}>
        {options.map((o, i) => (
          <ChoiceOption key={`${i}-${o}`} label={o} state={optionState(i, picked, answerIndex)} onPress={() => choose(i)} />
        ))}
      </View>
      {picked !== null ? (
        <Feedback
          tone={picked === answerIndex ? 'success' : 'error'}
          title={picked === answerIndex ? language().phrases.veryGood : 'Not quite'}>
          <TargetText text={sentence.text} reading={sentence.reading} variant="bodyStrong" />
          <Text variant="caption">{sentence.en}</Text>
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  prompt: { paddingVertical: Spacing.four, gap: Spacing.two },
  options: { gap: Spacing.two },
  audio: { alignItems: 'center', paddingVertical: Spacing.four },
});
