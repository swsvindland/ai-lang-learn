import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';

import { stopSpeaking } from '@/lib/speech';

export type RecognizerState = 'idle' | 'listening' | 'processing';

/**
 * Wraps on-device speech recognition for Spanish. Keeps the recorded audio so
 * learners can hear themselves back next to the native model.
 */
export function useSpanishRecognizer({
  contextualStrings,
  onFinal,
}: {
  contextualStrings?: string[];
  /** Called once per utterance with the final transcript (may be empty). */
  onFinal?: (transcript: string) => void;
} = {}) {
  const [state, setState] = useState<RecognizerState>('idle');
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState<string | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const latest = useRef('');
  const delivered = useRef(false);

  useSpeechRecognitionEvent('start', () => setState('listening'));
  useSpeechRecognitionEvent('result', (e) => {
    const text = e.results[0]?.transcript ?? '';
    latest.current = text;
    setTranscript(text);
  });
  useSpeechRecognitionEvent('audioend', (e) => {
    if (e.uri) setRecordingUri(e.uri);
  });
  useSpeechRecognitionEvent('end', () => {
    setState('idle');
    setFinalTranscript(latest.current);
    if (!delivered.current) {
      delivered.current = true;
      onFinal?.(latest.current);
    }
  });
  useSpeechRecognitionEvent('error', (e) => {
    setState('idle');
    if (e.error === 'no-speech') setError("Didn't catch that — try again a little louder.");
    else if (e.error !== 'aborted') setError(e.message || e.error);
  });

  async function start() {
    setError(null);
    setTranscript('');
    setFinalTranscript(null);
    setRecordingUri(null);
    latest.current = '';
    delivered.current = false;
    stopSpeaking();
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setError('Microphone and speech recognition permission are needed for speaking practice.');
      return;
    }
    const onDevice = ExpoSpeechRecognitionModule.supportsOnDeviceRecognition();
    setState('listening');
    ExpoSpeechRecognitionModule.start({
      lang: 'es-MX',
      interimResults: true,
      continuous: false,
      // Keep audio local whenever the platform allows it.
      requiresOnDeviceRecognition: onDevice,
      addsPunctuation: false,
      contextualStrings,
      iosTaskHint: 'dictation',
      recordingOptions: { persist: Platform.OS !== 'web' },
    });
  }

  function stop() {
    setState('processing');
    ExpoSpeechRecognitionModule.stop();
  }

  function reset() {
    delivered.current = true;
    ExpoSpeechRecognitionModule.abort();
    setState('idle');
    setTranscript('');
    setFinalTranscript(null);
    setRecordingUri(null);
    setError(null);
  }

  return { state, transcript, finalTranscript, recordingUri, error, start, stop, reset };
}
