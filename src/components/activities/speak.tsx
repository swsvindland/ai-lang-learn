import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton, Feedback, haptic } from '@/components/ui/controls';
import { Icon, Icons } from '@/components/ui/icon';
import { Card } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useSpanishRecognizer } from '@/hooks/use-spanish-recognizer';
import { useTheme } from '@/hooks/use-theme';
import { gradeTranslation } from '@/lib/ai/tutor';
import { speakSpanish } from '@/lib/speech';
import { compareSentences, type WordMatch } from '@/lib/text';

import { ActivityShell, ContinueButton, type ActivityProps } from './shell';
import { WordDiff } from './word-diff';

type Outcome = { score: number; matches: WordMatch[]; heard: string; note?: string };

export function MicButton({
  state,
  onStart,
  onStop,
  size = 88,
}: {
  state: 'idle' | 'listening' | 'processing';
  onStart: () => void;
  onStop: () => void;
  size?: number;
}) {
  const theme = useTheme();
  const listening = state === 'listening';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={listening ? 'Stop recording' : 'Start recording'}
      onPress={listening ? onStop : onStart}
      disabled={state === 'processing'}
      style={({ pressed }) => [
        styles.mic,
        {
          width: size,
          height: size,
          backgroundColor: listening ? theme.error : theme.primary,
          opacity: pressed || state === 'processing' ? 0.8 : 1,
        },
      ]}>
      <Icon name={listening ? Icons.stop : Icons.mic} size={size * 0.38} tint={theme.onPrimary} />
    </Pressable>
  );
}

export function SpeakActivity({ activity, onDone, level, aiReady }: ActivityProps<'speak'>) {
  const { sentence, mode } = activity;
  // No contextual hints: biasing toward the target words would inflate the score.
  const recognizer = useSpanishRecognizer({ onFinal: score });
  const player = useAudioPlayer(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [grading, setGrading] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (mode === 'repeat') speakSpanish(sentence.es);
  }, [mode, sentence.es]);

  function settle(result: Outcome) {
    setOutcome(result);
    haptic(result.score >= 0.7 ? 'success' : 'error');
  }

  function score(heard: string) {
    // Nothing recognized: the recognizer shows its own error; let them retry.
    if (!heard.trim()) return;
    const cmp = compareSentences(sentence.es, heard);
    if (mode === 'produce' && aiReady && cmp.score < 0.95) {
      // A different but valid phrasing should still count; let the tutor judge meaning.
      setGrading(true);
      gradeTranslation({ level, english: sentence.en, reference: sentence.es, answer: heard })
        .then((g) => settle({ score: Math.max(g.score, cmp.score), matches: cmp.matches, heard, note: g.explanation }))
        .catch(() => settle({ score: cmp.score, matches: cmp.matches, heard }))
        .finally(() => setGrading(false));
    } else {
      settle({ score: cmp.score, matches: cmp.matches, heard });
    }
  }

  async function playMine() {
    if (!recognizer.recordingUri) return;
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
    player.replace({ uri: recognizer.recordingUri });
    player.play();
  }

  function retry() {
    setOutcome(null);
    recognizer.reset();
  }

  const tone = !outcome ? 'accent' : outcome.score >= 0.85 ? 'success' : outcome.score >= 0.6 ? 'warning' : 'error';

  return (
    <ActivityShell
      kicker={mode === 'repeat' ? 'Speaking · Repeat after me' : 'Speaking · Say it in Spanish'}
      icon={Icons.mic}
      footer={
        outcome || skipped ? (
          <ContinueButton
            onPress={() =>
              onDone(
                skipped
                  ? { skill: 'speaking', score: 0, noAttempt: true }
                  : {
                      skill: 'speaking',
                      score: outcome!.score,
                      prompt: mode === 'repeat' ? sentence.es : sentence.en,
                      expected: sentence.es,
                      response: outcome!.heard,
                      feedback: outcome!.note,
                    }
              )
            }
          />
        ) : (
          <Button label="Can't speak right now" variant="ghost" onPress={() => setSkipped(true)} />
        )
      }>
      <Card style={styles.prompt}>
        {mode === 'repeat' ? (
          <>
            <Text variant="spanish" center>
              {sentence.es}
            </Text>
            <Text variant="caption" center>
              {sentence.en}
            </Text>
            <AudioButton text={sentence.es} size={48} />
          </>
        ) : (
          <>
            <Text variant="title" center>
              {sentence.en}
            </Text>
            {outcome || skipped ? (
              <>
                <Text variant="spanish" center color="primary">
                  {sentence.es}
                </Text>
                <AudioButton text={sentence.es} size={44} />
              </>
            ) : null}
          </>
        )}
      </Card>

      {!outcome && !skipped ? (
        <View style={styles.micArea}>
          <MicButton state={recognizer.state} onStart={recognizer.start} onStop={recognizer.stop} />
          <Text variant="caption" center>
            {recognizer.state === 'listening'
              ? recognizer.transcript || 'Listening… tap to stop'
              : grading
                ? 'Checking…'
                : 'Tap and speak'}
          </Text>
          {recognizer.error ? (
            <Text variant="caption" color="error" center>
              {recognizer.error}
            </Text>
          ) : null}
        </View>
      ) : null}

      {outcome ? (
        <Feedback
          tone={tone}
          title={outcome.score >= 0.85 ? '¡Excelente pronunciación!' : outcome.score >= 0.6 ? 'Good — a few words to polish' : "Let's try that again"}>
          <WordDiff matches={outcome.matches} />
          <Text variant="caption">I heard: “{outcome.heard || '…'}”</Text>
          {outcome.note ? <Text variant="body">{outcome.note}</Text> : null}
          <View style={styles.actions}>
            {recognizer.recordingUri ? (
              <Button label="Hear yourself" variant="secondary" size="sm" icon={Icons.play} onPress={playMine} />
            ) : null}
            <Button label="Try again" variant="secondary" size="sm" icon={Icons.mic} onPress={retry} />
          </View>
        </Feedback>
      ) : null}
    </ActivityShell>
  );
}

const styles = StyleSheet.create({
  prompt: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
  micArea: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.three },
  mic: { borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.two, flexWrap: 'wrap', marginTop: Spacing.one },
});
