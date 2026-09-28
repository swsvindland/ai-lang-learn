import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useDbQuery } from '@/hooks/use-db-query';
import { getAvailability } from '@/lib/ai/llm';
import { migrate } from '@/lib/db';
import { getProfile } from '@/lib/learner';

migrate();
getAvailability();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
  const onboarded = useDbQuery(() => !!getProfile());
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
      </Stack>
    </ThemeProvider>
  );
}
