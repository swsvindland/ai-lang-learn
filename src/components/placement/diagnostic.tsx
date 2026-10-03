import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AudioButton } from '@/components/ui/controls';
import { Icon, Icons, type IconName } from '@/components/ui/icon';
import { Card, Row } from '@/components/ui/layout';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { course } from '@/lib/curriculum';
import { language } from '@/lib/languages';
import {
  buildListeningQuestions,
  buildVocabQuestions,
  estimateWordsKnown,
  ratingFromBands,
  type BandTally,
} from '@/lib/placement';
import { speak } from '@/lib/speech';

import { BandedQuiz, type QuizQuestion } from './banded-quiz';

export type DiagnosticScores = { vocab: number; grammar: number; listening: number; wordsKnown: number };

type Stage = 'intro' | 'vocab' | 'grammar' | 'listening';

/** Three short adaptive sections, each measuring one skill separately. */
export function Diagnostic({ onDone }: { onDone: (scores: DiagnosticScores) => void }) {
  const [stage, setStage] = useState<Stage>('intro');
  const [vocabQs] = useState(buildVocabQuestions);
  const [listeningQs] = useState(buildListeningQuestions);
  const [scores, setScores] = useState<Partial<DiagnosticScores>>({});

  const vocabQuiz: QuizQuestion[] = vocabQs.map((q) => ({
    key: q.vocab.id,
    level: q.level,
    options: q.options,
    answerIndex: q.answerIndex,
    prompt: (
      <>
        <Text variant="caption">What does this word mean?</Text>
        <Text variant="target" style={styles.word}>
          {q.vocab.text}
        </Text>
        {/* Placement tests vocabulary, not kanji, so the reading is always shown. */}
        {q.vocab.reading ? <Text variant="body" color="textSecondary">{q.vocab.reading}</Text> : null}
      </>
    ),
  }));

  const grammarQuiz: QuizQuestion[] = course().placementItems.map((p) => ({
    key: p.id,
    level: p.cefr,
    options: p.options,
    answerIndex: p.answerIndex,
    prompt: (
      <>
        <Text variant="caption">{p.instruction}</Text>
        <Card>
          <Text variant="heading">{p.question}</Text>
        </Card>
      </>
    ),
  }));

  const listeningQuiz: QuizQuestion[] = listeningQs.map((q, i) => ({
    key: `l-${i}`,
    level: q.level,
    options: q.options,
    answerIndex: q.answerIndex,
    prompt: <ListeningPrompt text={q.sentence.text} />,
    reveal: (
      <>
        <Text variant="bodyStrong" center>
          {q.sentence.text}
        </Text>
        {q.sentence.reading ? (
          <Text variant="caption" center>
            {q.sentence.reading}
          </Text>
        ) : null}
        <Text variant="caption" center>
          {q.sentence.en}
        </Text>
      </>
    ),
  }));

  if (stage === 'intro') {
    return (
      <View style={styles.container}>
        <Text variant="title">Let&apos;s see what you remember</Text>
        <Text variant="body" color="textSecondary">
          Three quick parts, about 5 minutes. Each one gets harder and stops once it&apos;s past your level.
        </Text>
        <Card>
          <Part icon={Icons.cards} title="Vocabulary" text="Recognize common words" />
          <Part icon={Icons.graduation} title="Grammar & reading" text="Pick the right form" />
          <Part icon={Icons.ear} title="Listening" text={`Understand spoken ${language().name}`} />
        </Card>
        <Card tone="accentSoft">
          <Text variant="bodyStrong">Tap &quot;I don&apos;t know&quot; instead of guessing.</Text>
          <Text variant="caption">
            Guesses make the result less accurate, and a lower start just means faster early lessons.
          </Text>
        </Card>
        <Button label="Start" size="lg" onPress={() => setStage('vocab')} />
      </View>
    );
  }

  if (stage === 'vocab') {
    return (
      <BandedQuiz
        key="vocab"
        section="Part 1 of 3 · Vocabulary"
        total={vocabQuiz.length}
        questions={vocabQuiz}
        onDone={(t: BandTally) => {
          setScores({ vocab: ratingFromBands(t), wordsKnown: estimateWordsKnown(t) });
          setStage('grammar');
        }}
      />
    );
  }

  if (stage === 'grammar') {
    return (
      <BandedQuiz
        key="grammar"
        section="Part 2 of 3 · Grammar & reading"
        total={grammarQuiz.length}
        questions={grammarQuiz}
        stopBelow={0.35}
        onDone={(t) => {
          setScores((s) => ({ ...s, grammar: ratingFromBands(t) }));
          setStage('listening');
        }}
      />
    );
  }

  return (
    <BandedQuiz
      key="listening"
      section="Part 3 of 3 · Listening"
      total={listeningQuiz.length}
      questions={listeningQuiz}
      onDone={(t) => {
        onDone({
          vocab: scores.vocab ?? 0,
          grammar: scores.grammar ?? 0,
          wordsKnown: scores.wordsKnown ?? 0,
          listening: ratingFromBands(t),
        });
      }}
    />
  );
}

function ListeningPrompt({ text }: { text: string }) {
  useEffect(() => {
    speak(text);
  }, [text]);
  return (
    <>
      <Text variant="caption">What did you hear?</Text>
      <View style={styles.audio}>
        <AudioButton text={text} size={72} />
      </View>
    </>
  );
}

function Part({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <Row style={styles.part}>
      <Icon name={icon} color="primary" />
      <View style={styles.flex}>
        <Text variant="bodyStrong">{title}</Text>
        <Text variant="caption">{text}</Text>
      </View>
    </Row>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.three },
  flex: { flex: 1 },
  word: { fontSize: 38, lineHeight: 46, textAlign: 'center', paddingVertical: Spacing.three },
  audio: { alignItems: 'center', paddingVertical: Spacing.two },
  part: { gap: Spacing.three, paddingVertical: 6 },
});
