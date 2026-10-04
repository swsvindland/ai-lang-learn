import * as Speech from 'expo-speech';

import { language, type LanguageCode, type LanguageInfo } from '@/lib/languages';

type Voice = { id?: string; language: string };

const voices = new Map<LanguageCode, Promise<Voice>>();

/** Picks the best installed voice for the language being learned, preferring enhanced quality. */
function voiceFor(lang: LanguageInfo) {
  let voice = voices.get(lang.code);
  if (!voice) {
    const fallback: Voice = { language: lang.speech.voiceLocales[0] };
    voice = Speech.getAvailableVoicesAsync()
      .then((all) => {
        const matching = all.filter((v) => v.language.toLowerCase().startsWith(lang.speech.voicePrefix));
        const preferred = lang.speech.voiceLocales.map((l) => l.toLowerCase());
        const rank = (locale: string) => {
          const i = preferred.indexOf(locale.toLowerCase().replace('_', '-'));
          return i === -1 ? preferred.length : i;
        };
        matching.sort(
          (a, b) =>
            rank(a.language) - rank(b.language) ||
            Number(b.quality === Speech.VoiceQuality.Enhanced) - Number(a.quality === Speech.VoiceQuality.Enhanced)
        );
        const best = matching[0];
        return best ? { id: best.identifier, language: best.language.replace('_', '-') } : fallback;
      })
      .catch(() => fallback);
    voices.set(lang.code, voice);
  }
  return voice;
}

export type SpeakOptions = { slow?: boolean; onDone?: () => void };

// Speech calls run one at a time so a stop can never land after the speak it was meant to precede.
let queue: Promise<void> = Promise.resolve();

function enqueue(task: () => Promise<void>) {
  queue = queue.then(task).catch(() => undefined);
  return queue;
}

/**
 * iOS's synthesizer can lock up after `stop`, silently dropping every later
 * utterance with no callbacks. Only interrupt when something is actually playing.
 */
async function stopIfSpeaking() {
  if (await Speech.isSpeakingAsync()) await Speech.stop();
}

/** Speaks text in the language being learned. */
export function speak(text: string, { slow = false, onDone }: SpeakOptions = {}) {
  const lang = language();
  return enqueue(async () => {
    const voice = await voiceFor(lang);
    await stopIfSpeaking();
    Speech.speak(text, {
      language: voice.language,
      voice: voice.id,
      rate: slow ? lang.speech.rate.slow : lang.speech.rate.normal,
      onDone,
      onStopped: onDone,
      onError: () => onDone?.(),
    });
  });
}

export function speakEnglish(text: string) {
  return enqueue(async () => {
    await stopIfSpeaking();
    Speech.speak(text, { language: 'en-US' });
  });
}

export function stopSpeaking() {
  return enqueue(stopIfSpeaking);
}

export async function voiceInfo() {
  return voiceFor(language());
}
