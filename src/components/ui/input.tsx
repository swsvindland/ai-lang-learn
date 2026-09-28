import { forwardRef } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export const Input = forwardRef<TextInput, TextInputProps & { large?: boolean }>(function Input(
  { style, large, ...rest },
  ref
) {
  const theme = useTheme();
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={theme.textTertiary}
      autoCorrect={false}
      autoCapitalize="none"
      spellCheck={false}
      style={[
        styles.input,
        large && styles.large,
        { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text },
        style,
      ]}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 17,
    minHeight: 50,
  },
  large: { fontSize: 20, minHeight: 96, textAlignVertical: 'top', paddingTop: 14 },
});
