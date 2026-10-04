import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { language } from '@/lib/languages';
import type { Profile } from '@/lib/learner';

const CHANNEL = 'study-reminders';

export const WEEKDAYS = [
  { value: 2, short: 'Mon' },
  { value: 3, short: 'Tue' },
  { value: 4, short: 'Wed' },
  { value: 5, short: 'Thu' },
  { value: 6, short: 'Fri' },
  { value: 7, short: 'Sat' },
  { value: 1, short: 'Sun' },
] as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** One weekly reminder per chosen study day. Returns false if permission was denied. */
export async function syncReminders(profile: Profile): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!profile.remindersEnabled || !profile.reminderDays.length) return true;

  const perm = await Notifications.requestPermissionsAsync();
  if (!perm.granted) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Study reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const weekday of profile.reminderDays) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: language().phrases.studyTime,
        body: `Your ${profile.sessionMinutes}-minute ${language().name} session is ready.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour: profile.reminderHour,
        minute: profile.reminderMinute,
        channelId: CHANNEL,
      },
    });
  }
  return true;
}
