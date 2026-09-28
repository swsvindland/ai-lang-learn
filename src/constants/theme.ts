import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1D1B19',
    textSecondary: '#6B645C',
    textTertiary: '#9A9289',
    background: '#FBF8F4',
    surface: '#FFFFFF',
    surfaceAlt: '#F3EEE7',
    border: '#E7E1D8',
    primary: '#D9480F',
    primarySoft: '#FFE8DC',
    onPrimary: '#FFFFFF',
    accent: '#1971C2',
    accentSoft: '#E1EFFD',
    success: '#2B8A3E',
    successSoft: '#E6F6EA',
    error: '#C92A2A',
    errorSoft: '#FDECEC',
    warning: '#E67700',
    warningSoft: '#FFF3DB',
  },
  dark: {
    text: '#F5F1EC',
    textSecondary: '#A8A097',
    textTertiary: '#7A736B',
    background: '#121110',
    surface: '#1C1A18',
    surfaceAlt: '#27231F',
    border: '#36312C',
    primary: '#FF7A45',
    primarySoft: '#3D2418',
    onPrimary: '#1A0D06',
    accent: '#4DABF7',
    accentSoft: '#15293B',
    success: '#51CF66',
    successSoft: '#17301D',
    error: '#FF6B6B',
    errorSoft: '#3A1D1D',
    warning: '#FFA94D',
    warningSoft: '#3A2A14',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof ThemeColors;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const MaxContentWidth = 640;
