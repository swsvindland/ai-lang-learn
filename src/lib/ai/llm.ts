import { Platform } from 'react-native';

import { OnDeviceLlm } from '@modules/on-device-llm';

import { chatCompletion, type CloudEndpoint } from './cloud';
import { initPlus, isPlusActive, plusAvailableInBuild, plusEndpoint, subscribePlus } from './plus';
import { aiProvider, loadOpenRouterKey, openRouterModel, type AiProvider } from './settings';

/** The JSON Schema subset the native layer can turn into guided generation. */
export type JsonSchema =
  | { type: 'string'; description?: string; enum?: string[] }
  | { type: 'number' | 'integer' | 'boolean'; description?: string }
  | { type: 'array'; description?: string; items: JsonSchema; minItems?: number; maxItems?: number }
  | {
      type: 'object';
      description?: string;
      properties: Record<string, JsonSchema>;
      required?: string[];
      /** Generation order for guided generation; defaults to declaration order. */
      propertyOrder?: string[];
    };

export type GenerateTextOptions = {
  priority?: Priority;
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  /** Receives the cumulative text as it streams (on-device only; cloud delivers it once at the end). */
  onPartial?: (text: string) => void;
};

export type GenerateJsonOptions<T> = {
  priority?: Priority;
  system?: string;
  prompt: string;
  schema: JsonSchema & { type: 'object' };
  /** Return the parsed value or null when the shape is wrong. */
  parse: (value: unknown) => T | null;
  temperature?: number;
  maxTokens?: number;
};

export type AiBackend = 'apple' | 'gemini-nano' | 'openrouter' | 'plus' | 'none';

export type LlmAvailability = {
  status: 'available' | 'downloadable' | 'downloading' | 'unavailable';
  provider: AiProvider;
  backend: AiBackend;
  /** Short name for the UI, e.g. "Apple Intelligence" or "DeepSeek via OpenRouter". */
  label: string;
  /** Requests leave the device. */
  cloud: boolean;
  reason?: string;
  /** Set when the chosen cloud tutor isn't ready and on-device AI stands in for it. */
  notice?: string;
};

const DEVICE_LABEL: Record<string, string> = { apple: 'Apple Intelligence', 'gemini-nano': 'Gemini Nano' };

// ---------- Availability ----------

let deviceStatus: LlmAvailability | null = null;
let cachedAvailability: LlmAvailability | null = null;
const listeners = new Set<(a: LlmAvailability) => void>();

async function deviceAvailability(refresh: boolean): Promise<LlmAvailability> {
  if (deviceStatus && !refresh) return deviceStatus;
  let next: LlmAvailability = {
    status: 'unavailable',
    provider: 'device',
    backend: 'none',
    label: 'On-device AI',
    cloud: false,
    reason:
      Platform.OS === 'web'
        ? 'On-device AI is not available on the web.'
        : 'On-device AI needs a development build (not Expo Go).',
  };
  if (OnDeviceLlm) {
    try {
      const native = await OnDeviceLlm.getAvailability();
      next = { ...next, ...native, label: DEVICE_LABEL[native.backend] ?? 'On-device AI', reason: native.reason };
    } catch (e) {
      next = { ...next, reason: String(e) };
    }
  }
  deviceStatus = next;
  return next;
}

function modelLabel(model: string) {
  const name = model.split('/').pop() ?? model;
  return `${name} via OpenRouter`;
}

async function cloudAvailability(provider: Exclude<AiProvider, 'device'>): Promise<LlmAvailability> {
  if (provider === 'openrouter') {
    const key = await loadOpenRouterKey();
    return {
      status: key ? 'available' : 'unavailable',
      provider,
      backend: 'openrouter',
      label: modelLabel(openRouterModel()),
      cloud: true,
      reason: key ? undefined : 'Add your OpenRouter API key in Settings → AI tutor.',
    };
  }
  const base = { provider, backend: 'plus' as const, label: 'Hablo Plus', cloud: true };
  if (!plusAvailableInBuild()) {
    return { ...base, status: 'unavailable', reason: "Hablo Plus isn't set up in this build of the app." };
  }
  await initPlus();
  return isPlusActive()
    ? { ...base, status: 'available' }
    : { ...base, status: 'unavailable', reason: 'Subscribe to Hablo Plus in Settings → AI tutor.' };
}

async function resolveAvailability(refresh: boolean): Promise<LlmAvailability> {
  const provider = aiProvider();
  const device = await deviceAvailability(refresh || !deviceStatus);
  if (provider === 'device') return device;
  const cloud = await cloudAvailability(provider);
  if (cloud.status === 'available' || device.status !== 'available') return cloud;
  // Don't switch the tutor off while the cloud option is being set up (or a subscription lapsed).
  return { ...device, notice: `${cloud.label} isn't ready: ${cloud.reason} Using ${device.label} in the meantime.` };
}

let availabilitySeq = 0;
let inflight: Promise<LlmAvailability> | null = null;

/** Status of the tutor the learner picked. Call with `refresh` after changing AI settings. */
export function getAvailability(refresh = false): Promise<LlmAvailability> {
  if (cachedAvailability && !refresh) return Promise.resolve(cachedAvailability);
  if (inflight && !refresh) return inflight;
  // Checks can overlap (e.g. a slow store lookup at launch while the learner changes
  // provider); only the newest one may update the cache.
  const seq = ++availabilitySeq;
  const run = resolveAvailability(refresh).then((next) => {
    if (seq !== availabilitySeq) return cachedAvailability ?? next;
    cachedAvailability = next;
    listeners.forEach((l) => l(next));
    return next;
  });
  inflight = run;
  run.finally(() => {
    if (inflight === run) inflight = null;
  }).catch(() => undefined);
  return run;
}

/** On-device status regardless of the chosen provider (used for the settings screen and fallback). */
export function getDeviceAvailability(refresh = false) {
  return deviceAvailability(refresh);
}

export function peekAvailability() {
  return cachedAvailability;
}

export function subscribeAvailability(listener: (a: LlmAvailability) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

subscribePlus(() => {
  if (aiProvider() === 'plus') getAvailability(true);
});

export function isAiReady() {
  return cachedAvailability?.status === 'available';
}

/** Cloud models have room for much longer prompts and chat history than on-device ones. */
export function hasLargeContext() {
  return !!cachedAvailability?.cloud;
}

/** Downloads (Android) and warms up the on-device model. Safe to call repeatedly. */
export async function prepareModel(onProgress?: (bytes: number) => void) {
  if (!OnDeviceLlm) return getAvailability(true);
  const sub = onProgress ? OnDeviceLlm.addListener('onDownloadProgress', (e) => onProgress(e.bytes)) : null;
  try {
    await OnDeviceLlm.prepare();
  } finally {
    sub?.remove();
  }
  return getAvailability(true);
}

// ---------- Running requests ----------

export type Priority = 'foreground' | 'background';

type Job = {
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  schema?: JsonSchema;
  priority?: Priority;
  onPartial?: (text: string) => void;
};

// On-device models run one request at a time well; queue calls so a prefetch
// never races the request the learner is waiting on. Cloud requests run in parallel.
let queue: Promise<unknown> = Promise.resolve();
// Bumped by cancelBackgroundWork(); background jobs from an older epoch are skipped.
let backgroundEpoch = 0;
const runningDevice = new Set<string>();
const runningCloud = new Set<AbortController>();
let requestCounter = 0;

class Cancelled extends Error {
  constructor() {
    super('Cancelled');
  }
}

function enqueue<T>(job: () => Promise<T>, priority: Priority = 'foreground'): Promise<T> {
  const epoch = backgroundEpoch;
  const guarded = () => {
    if (priority === 'background' && epoch !== backgroundEpoch) return Promise.reject(new Cancelled());
    return job();
  };
  const run = queue.then(guarded, guarded);
  queue = run.catch(() => undefined);
  return run;
}

/** Drops queued prefetch work and stops any running one, e.g. when a session wraps up. */
export function cancelBackgroundWork() {
  backgroundEpoch++;
  for (const id of runningDevice) OnDeviceLlm?.cancel(id);
  runningDevice.clear();
  for (const controller of runningCloud) controller.abort();
  runningCloud.clear();
}

function stripOrder(schema: JsonSchema) {
  return JSON.stringify(schema, (key, value) => (key === 'propertyOrder' ? undefined : value));
}

function withSchemaInPrompt(prompt: string, schema: JsonSchema) {
  return `${prompt}\n\nRespond with ONLY a JSON object (no markdown, no commentary) matching this JSON Schema:\n${stripOrder(schema)}`;
}

async function runOnDevice(job: Job): Promise<string> {
  const llm = OnDeviceLlm;
  if (!llm || deviceStatus?.status !== 'available') throw new Error('On-device AI unavailable');
  // Guided generation constrains Apple's model to the schema. Gemini Nano only has
  // prompt-level JSON, so describe the shape and validate afterwards.
  const guided = deviceStatus.backend === 'apple';
  const requestId = `req-${Date.now()}-${requestCounter++}`;
  return enqueue(async () => {
    if (job.priority === 'background') runningDevice.add(requestId);
    const sub = job.onPartial
      ? llm.addListener('onChunk', (e) => {
          if (e.requestId === requestId) job.onPartial?.(e.text);
        })
      : null;
    try {
      return await llm.generate({
        requestId,
        prompt: job.schema && !guided ? withSchemaInPrompt(job.prompt, job.schema) : job.prompt,
        system: job.system,
        temperature: job.temperature,
        maxTokens: job.maxTokens,
        schemaJson: job.schema && guided ? JSON.stringify(job.schema) : undefined,
        stream: !!job.onPartial && !job.schema,
      });
    } finally {
      sub?.remove();
      runningDevice.delete(requestId);
    }
  }, job.priority);
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function cloudEndpoint(provider: AiProvider): Promise<CloudEndpoint> {
  if (provider === 'plus') return plusEndpoint();
  const key = await loadOpenRouterKey();
  if (!key) throw new Error('No OpenRouter API key');
  return {
    url: OPENROUTER_URL,
    headers: { Authorization: `Bearer ${key}`, 'X-Title': 'Hablo' },
    model: openRouterModel(),
  };
}

async function runInCloud(job: Job, provider: AiProvider): Promise<string> {
  if (job.priority === 'background' && runningCloud.size > 4) throw new Cancelled();
  const epoch = backgroundEpoch;
  const controller = new AbortController();
  if (job.priority === 'background') runningCloud.add(controller);
  try {
    const endpoint = await cloudEndpoint(provider);
    if (job.priority === 'background' && epoch !== backgroundEpoch) throw new Cancelled();
    const text = await chatCompletion(endpoint, {
      system: job.system,
      prompt: job.schema ? withSchemaInPrompt(job.prompt, job.schema) : job.prompt,
      temperature: job.temperature,
      maxTokens: job.maxTokens,
      json: !!job.schema,
      signal: controller.signal,
    });
    job.onPartial?.(text);
    return text;
  } catch (e) {
    if (controller.signal.aborted) throw new Cancelled();
    throw e;
  } finally {
    runningCloud.delete(controller);
  }
}

async function run(job: Job): Promise<string> {
  const status = cachedAvailability;
  if (!status || status.status !== 'available') throw new Error(status?.reason ?? 'AI unavailable');
  if (!status.cloud) return runOnDevice(job);
  try {
    return await runInCloud(job, status.provider);
  } catch (e) {
    // Offline or the service is down: fall back to the on-device model when there is one.
    if (e instanceof Cancelled || deviceStatus?.status !== 'available') throw e;
    return runOnDevice(job);
  }
}

/** Sends a tiny request with a key/model before saving them. Resolves to null on success, else an error message. */
export async function testOpenRouter(key: string, model: string): Promise<string | null> {
  try {
    await chatCompletion(
      { url: OPENROUTER_URL, headers: { Authorization: `Bearer ${key.trim()}`, 'X-Title': 'Hablo' }, model: model.trim() },
      { prompt: 'Reply with the single word: ok', maxTokens: 5, temperature: 0 }
    );
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const text = await run({ ...options });
  return text.trim();
}

export async function generateJson<T>(options: GenerateJsonOptions<T>): Promise<T> {
  let lastError: unknown = null;
  const epoch = backgroundEpoch;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await run({
        system: options.system,
        prompt: options.prompt,
        schema: options.schema,
        temperature: options.temperature ?? (attempt === 0 ? 0.4 : 0.2),
        maxTokens: options.maxTokens,
        priority: options.priority,
      });
      const parsed = options.parse(extractJson(raw));
      if (parsed) return parsed;
      lastError = new Error(`Model output did not match schema: ${raw.slice(0, 200)}`);
    } catch (e) {
      lastError = e;
      // A cancelled native request rejects with its own error type; don't retry stale background work.
      if (e instanceof Cancelled || (options.priority === 'background' && epoch !== backgroundEpoch)) {
        throw new Cancelled();
      }
    }
  }
  throw lastError ?? new Error('Generation failed');
}

export function extractJson(raw: string): unknown {
  const trimmed = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '');
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
