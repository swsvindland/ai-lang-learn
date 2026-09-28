import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import type { Cefr } from '@/lib/curriculum';
import type { Grade } from '@/lib/srs';
import type { Activity, ActivityResult } from '@/lib/session/types';

export type ActivityProps<K extends Activity['kind']> = {
  activity: Extract<Activity, { kind: K }>;
  level: Cefr;
  aiReady: boolean;
  onDone: (result: ActivityResult, grade?: Grade) => void;
};

/** Common frame: a kind label, the body, and a pinned footer for actions. */
export function ActivityShell({
  kicker,
  icon,
  children,
  footer,
}: {
  kicker: string;
  icon: IconName;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.kicker}>
        <Icon name={icon} size={14} color="textSecondary" />
        <Text variant="label">{kicker}</Text>
      </View>
      <View style={styles.body}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

export function ContinueButton({ onPress, label = 'Continue' }: { onPress: () => void; label?: string }) {
  return <Button label={label} size="lg" onPress={onPress} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.three },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  body: { flex: 1, gap: Spacing.three },
  footer: { gap: Spacing.two, paddingTop: Spacing.two },
});
