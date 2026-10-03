import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { getAvailability } from '@/lib/ai/llm';
import { hasActiveCourse, initDatabases } from '@/lib/db';
import { getProfile } from '@/lib/learner';

initDatabases();
getAvailability();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  // Each language is its own course; a course without a profile still needs setup.
  const onboarded = useDbQuery(() => hasActiveCourse() && !!getProfile());
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: { ...base.colors, background: colors.background, primary: colors.primary, card: colors.surface },
      }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          {/* A card (not fullScreenModal) so safe-area insets are reported correctly. */}
          <Stack.Screen name="session" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen
            name="conversation"
            options={{ presentation: 'modal', headerShown: true, title: 'Conversation practice' }}
          />
          <Stack.Screen name="homework/[id]" options={{ presentation: 'modal', headerShown: true, title: 'Homework' }} />
          <Stack.Screen name="unit/[id]" options={{ headerShown: true, title: '', headerBackTitle: 'Journey' }} />
          <Stack.Screen name="dev" options={{ headerShown: true, title: 'Activity gallery (dev)' }} />
        </Stack.Protected>
        {/* Reachable from onboarding too: AI settings are app-wide, not per course. */}
        <Stack.Screen name="ai" options={{ presentation: 'modal', headerShown: true, title: 'AI tutor' }} />
      </Stack>
    </ThemeProvider>
  );
}
