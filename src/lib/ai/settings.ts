import * as SecureStore from 'expo-secure-store';

import { getSetting, setSetting } from '@/lib/db';

/**
 * Where tutor requests run:
 * - `device`: Apple Intelligence / Gemini Nano. Free and private.
 * - `openrouter`: the learner's own OpenRouter API key, any model they pick.
 * - `plus`: the Hablo Plus subscription, which proxies to a hosted model.
 */
export type AiProvider = 'device' | 'openrouter' | 'plus';

const PROVIDERS: AiProvider[] = ['device', 'openrouter', 'plus'];

export const DEFAULT_OPENROUTER_MODEL = 'deepseek/deepseek-chat';

export const MODEL_PRESETS: { id: string; label: string; detail: string }[] = [
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek', detail: 'Very cheap, strong in Spanish and Japanese' },
  { id: 'google/gemini-2.5-flash', label: 'Gemini Flash', detail: 'Fast and especially good at Japanese' },
];

export function aiProvider(): AiProvider {
  const saved = getSetting('ai.provider');
  return PROVIDERS.includes(saved as AiProvider) ? (saved as AiProvider) : 'device';
}

export function setAiProvider(provider: AiProvider) {
  setSetting('ai.provider', provider);
}

export function openRouterModel() {
  return getSetting('ai.openrouterModel') || DEFAULT_OPENROUTER_MODEL;
}

export function setOpenRouterModel(model: string) {
  setSetting('ai.openrouterModel', model.trim() || null);
}

/** The learner agreed that cloud providers receive their answers and messages. */
export function hasCloudConsent() {
  return getSetting('ai.cloudConsent') === '1';
}

export function setCloudConsent(granted: boolean) {
  setSetting('ai.cloudConsent', granted ? '1' : null);
}

// The API key lives in the keychain/keystore, never in SQLite.
const KEY_NAME = 'openrouter-api-key';
let cachedKey: string | null | undefined;

export async function loadOpenRouterKey() {
  if (cachedKey === undefined) {
    try {
      cachedKey = await SecureStore.getItemAsync(KEY_NAME);
    } catch {
      cachedKey = null;
    }
  }
  return cachedKey;
}

export async function saveOpenRouterKey(key: string | null) {
  const trimmed = key?.trim() || null;
  if (trimmed) await SecureStore.setItemAsync(KEY_NAME, trimmed);
  else await SecureStore.deleteItemAsync(KEY_NAME);
  cachedKey = trimmed;
}
