import { StyleSheet, View } from 'react-native';

import { AudioButton } from '@/components/ui/controls';
import { TargetText } from '@/components/ui/target-text';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import type { VocabItem } from '@/lib/curriculum';

/** KANJIDIC style (か.つ, -がち, ひと-) → learner style: か(つ), 〜がち, ひと〜. */
function formatKun(kun: string) {
  const [stem, okurigana] = kun.split('.');
  const word = okurigana ? `${stem}(${okurigana})` : stem;
  return word.replace(/^-/, '〜').replace(/-$/, '〜');
}

/** What a kanji card shows once revealed: meaning, readings, and words from the course that use it. */
export function KanjiDetails({ vocab }: { vocab: VocabItem }) {
  const kanji = vocab.kanji;
  if (!kanji) return null;
  return (
    <View style={styles.container}>
      <Text variant="title" center>
        {vocab.en}
      </Text>
      <View style={styles.readings}>
        {kanji.on.length ? (
          <Text variant="body" center>
            <Text variant="label">On </Text>
            {kanji.on.join('、')}
          </Text>
        ) : null}
        {kanji.kun.length ? (
          <Text variant="body" center>
            <Text variant="label">Kun </Text>
            {kanji.kun.map(formatKun).join('、')}
          </Text>
        ) : null}
        <Text variant="caption" center>
          {kanji.strokes} strokes · JLPT N{kanji.jlpt}
        </Text>
      </View>
      {kanji.examples.map((ex) => (
        <View key={ex.text} style={styles.example}>
          <View style={styles.exampleText}>
            <TargetText text={ex.text} reading={ex.reading} variant="bodyStrong" />
            <Text variant="caption">{ex.en}</Text>
          </View>
          <AudioButton text={ex.text} size={34} showSlow={false} />
        </View>
      ))}
    </View>
  );
}

/** A lone kanji has several readings, so audio plays its first example word when there is one. */
export function kanjiSpeech(vocab: VocabItem) {
  return vocab.kanji?.examples[0]?.text ?? vocab.text;
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch', alignItems: 'center', gap: Spacing.two },
  readings: { alignItems: 'center', gap: 2 },
  example: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  exampleText: { flex: 1, gap: 2 },
});
