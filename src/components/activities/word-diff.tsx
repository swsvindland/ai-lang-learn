import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { WordMatch } from '@/lib/text';

/** Target sentence with each word tinted by whether the learner got it. */
export function WordDiff({ matches }: { matches: WordMatch[] }) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {matches.map((m, i) => {
        const color = m.status === 'ok' ? theme.success : m.status === 'close' ? theme.warning : theme.error;
        const bg = m.status === 'ok' ? theme.successSoft : m.status === 'close' ? theme.warningSoft : theme.errorSoft;
        return (
          <View key={`${i}-${m.word}`} style={[styles.word, { backgroundColor: bg }]}>
            <Text variant="bodyStrong" style={{ color, fontSize: 18 }}>
              {m.word}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  word: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
});
