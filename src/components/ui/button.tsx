import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './icon';
import { Text } from './text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  size = 'md',
  style,
  haptic = true,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'lg' | 'sm';
  style?: ViewStyle;
  haptic?: boolean;
}) {
  const theme = useTheme();
  const bg = {
    primary: theme.primary,
    secondary: theme.surfaceAlt,
    ghost: 'transparent',
    danger: theme.errorSoft,
  }[variant];
  const fg = {
    primary: theme.onPrimary,
    secondary: theme.text,
    ghost: theme.primary,
    danger: theme.error,
  }[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={() => {
        if (haptic && Platform.OS !== 'web') Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        { backgroundColor: bg, opacity: inactive ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={size === 'sm' ? 15 : 18} tint={fg} /> : null}
          <Text variant="bodyStrong" style={[{ color: fg }, size === 'sm' && styles.smText]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
  },
  sm: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Radius.pill },
  md: { paddingVertical: 13, paddingHorizontal: Spacing.four, minHeight: 48 },
  lg: { paddingVertical: 17, paddingHorizontal: Spacing.four, minHeight: 56 },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  smText: { fontSize: 14 },
});
