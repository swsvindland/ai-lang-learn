import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = SymbolViewProps['name'];

export function Icon({
  name,
  size = 20,
  color = 'text',
  tint,
}: {
  name: IconName;
  size?: number;
  color?: ThemeColor;
  /** Raw color override (e.g. on filled buttons). */
  tint?: string;
}) {
  const theme = useTheme();
  return <SymbolView name={name} size={size} tintColor={tint ?? theme[color]} resizeMode="scaleAspectFit" />;
}

/** Cross-platform icon names used around the app (SF Symbols / Material Symbols). */
export const Icons = {
  speaker: { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' },
  turtle: { ios: 'tortoise.fill', android: 'slow_motion_video', web: 'slow_motion_video' },
  mic: { ios: 'mic.fill', android: 'mic', web: 'mic' },
  stop: { ios: 'stop.fill', android: 'stop', web: 'stop' },
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  xmark: { ios: 'xmark', android: 'close', web: 'close' },
  xCircle: { ios: 'xmark.circle.fill', android: 'cancel', web: 'cancel' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' },
  book: { ios: 'book.fill', android: 'menu_book', web: 'menu_book' },
  tv: { ios: 'tv.fill', android: 'tv', web: 'tv' },
  film: { ios: 'film.fill', android: 'movie', web: 'movie' },
  headphones: { ios: 'headphones', android: 'headphones', web: 'headphones' },
  music: { ios: 'music.note', android: 'music_note', web: 'music_note' },
  newspaper: { ios: 'newspaper.fill', android: 'newspaper', web: 'newspaper' },
  video: { ios: 'play.rectangle.fill', android: 'smart_display', web: 'smart_display' },
  phone: { ios: 'iphone', android: 'smartphone', web: 'smartphone' },
  chat: { ios: 'bubble.left.and.bubble.right.fill', android: 'forum', web: 'forum' },
  send: { ios: 'arrow.up.circle.fill', android: 'send', web: 'send' },
  clock: { ios: 'clock.fill', android: 'schedule', web: 'schedule' },
  flame: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  flag: { ios: 'flag.checkered', android: 'sports_score', web: 'sports_score' },
  lightbulb: { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' },
  pause: { ios: 'pause.fill', android: 'pause', web: 'pause' },
  eye: { ios: 'eye.fill', android: 'visibility', web: 'visibility' },
  question: { ios: 'questionmark.bubble.fill', android: 'contact_support', web: 'contact_support' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
  cards: { ios: 'rectangle.stack.fill', android: 'style', web: 'style' },
  pencil: { ios: 'pencil', android: 'edit', web: 'edit' },
  ear: { ios: 'ear.fill', android: 'hearing', web: 'hearing' },
  graduation: { ios: 'graduationcap.fill', android: 'school', web: 'school' },
} satisfies Record<string, IconName>;
