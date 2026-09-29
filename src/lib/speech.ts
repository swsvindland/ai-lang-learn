import * as Speech from 'expo-speech';

let voiceId: string | undefined;
let voiceLanguage = 'es-MX';
let voiceLoaded: Promise<void> | null = null;

const PREFERRED_LOCALES = ['es-MX', 'es-US', 'es-419', 'es-CO', 'es-AR', 'es-ES'];

/** Picks the best installed Latin American Spanish voice, preferring enhanced quality. */
function loadVoice() {
  voiceLoaded ??= Speech.getAvailableVoicesAsync()
    .then((voices) => {
      const spanish = voices.filter((v) => v.language.toLowerCase().startsWith('es'));
      const rank = (lang: string) => {
        const i = PREFERRED_LOCALES.findIndex((l) => l.toLowerCase() === lang.toLowerCase().replace('_', '-'));
        return i === -1 ? PREFERRED_LOCALES.length : i;
      };
      spanish.sort(
        (a, b) =>
          rank(a.language) - rank(b.language) ||
          Number(b.quality === Speech.VoiceQuality.Enhanced) - Number(a.quality === Speech.VoiceQuality.Enhanced)
      );
      const best = spanish[0];
      if (best) {
        voiceId = best.identifier;
        voiceLanguage = best.language.replace('_', '-');
      }
    })
    .catch(() => undefined);
  return voiceLoaded;
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

export function speakSpanish(text: string, { slow = false, onDone }: SpeakOptions = {}) {
  return enqueue(async () => {
    await loadVoice();
    await stopIfSpeaking();
    Speech.speak(text, {
      language: voiceLanguage,
      voice: voiceId,
      rate: slow ? 0.7 : 0.95,
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

export async function spanishVoiceInfo() {
  await loadVoice();
  return { id: voiceId, language: voiceLanguage };
}
