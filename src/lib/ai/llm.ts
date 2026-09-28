import { Platform } from 'react-native';

import { OnDeviceLlm, type LlmAvailability } from '@modules/on-device-llm';

export type { LlmAvailability };

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
  /** Receives the cumulative text as it streams. */
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

const UNAVAILABLE: LlmAvailability = {
  status: 'unavailable',
  backend: 'none',
  reason:
    Platform.OS === 'web'
      ? 'On-device AI is not available on the web.'
      : 'On-device AI needs a development build (not Expo Go).',
};

let cachedAvailability: LlmAvailability | null = null;
const listeners = new Set<(a: LlmAvailability) => void>();

export async function getAvailability(refresh = false): Promise<LlmAvailability> {
  if (cachedAvailability && !refresh) return cachedAvailability;
  let next = UNAVAILABLE;
  if (OnDeviceLlm) {
    try {
      next = await OnDeviceLlm.getAvailability();
    } catch (e) {
      next = { status: 'unavailable', backend: 'none', reason: String(e) };
    }
  }
  cachedAvailability = next;
  listeners.forEach((l) => l(next));
  return next;
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

export function isAiReady() {
  return cachedAvailability?.status === 'available';
}

/** Downloads (Android) and warms up the model. Safe to call repeatedly. */
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

// On-device models run one request at a time well; queue calls so a prefetch
// never races the request the learner is waiting on.
let queue: Promise<unknown> = Promise.resolve();
// Bumped by cancelBackgroundWork(); background jobs from an older epoch are skipped.
let backgroundEpoch = 0;
const runningBackground = new Set<string>();

export type Priority = 'foreground' | 'background';

function enqueue<T>(job: () => Promise<T>, priority: Priority = 'foreground'): Promise<T> {
  const epoch = backgroundEpoch;
  const guarded = () => {
    if (priority === 'background' && epoch !== backgroundEpoch) {
      return Promise.reject(new Error('Cancelled'));
    }
    return job();
  };
  const run = queue.then(guarded, guarded);
  queue = run.catch(() => undefined);
  return run;
}

/** Drops queued prefetch work and stops any running one, e.g. when a session wraps up. */
export function cancelBackgroundWork() {
  backgroundEpoch++;
  for (const id of runningBackground) OnDeviceLlm?.cancel(id);
  runningBackground.clear();
}

let requestCounter = 0;

export async function generateText(options: GenerateTextOptions): Promise<string> {
  const llm = OnDeviceLlm;
  if (!llm || !isAiReady()) throw new Error('On-device AI unavailable');
  const requestId = `req-${Date.now()}-${requestCounter++}`;
  return enqueue(async () => {
    if (options.priority === 'background') runningBackground.add(requestId);
    const sub = options.onPartial
      ? llm.addListener('onChunk', (e) => {
          if (e.requestId === requestId) options.onPartial?.(e.text);
        })
      : null;
    try {
      const text = await llm.generate({
        requestId,
        prompt: options.prompt,
        system: options.system,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        stream: !!options.onPartial,
      });
      return text.trim();
    } finally {
      sub?.remove();
      runningBackground.delete(requestId);
    }
  }, options.priority);
}

export async function generateJson<T>(options: GenerateJsonOptions<T>): Promise<T> {
  const llm = OnDeviceLlm;
  if (!llm || !isAiReady()) throw new Error('On-device AI unavailable');
  const guided = cachedAvailability?.backend === 'apple';
  // Guided generation constrains Apple's model to the schema. Gemini Nano only has
  // prompt-level JSON, so describe the shape and validate afterwards.
  const prompt = guided
    ? options.prompt
    : `${options.prompt}\n\nRespond with ONLY a JSON object (no markdown, no commentary) matching this JSON Schema:\n${JSON.stringify(options.schema)}`;

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const requestId = `req-${Date.now()}-${requestCounter++}`;
    try {
      const raw = await enqueue(async () => {
        if (options.priority === 'background') runningBackground.add(requestId);
        try {
          return await llm.generate({
            requestId,
            prompt,
            system: options.system,
            temperature: options.temperature ?? (attempt === 0 ? 0.4 : 0.2),
            maxTokens: options.maxTokens,
            schemaJson: guided ? JSON.stringify(options.schema) : undefined,
          });
        } finally {
          runningBackground.delete(requestId);
        }
      }, options.priority);
      const parsed = options.parse(extractJson(raw));
      if (parsed) return parsed;
      lastError = new Error(`Model output did not match schema: ${raw.slice(0, 200)}`);
    } catch (e) {
      lastError = e;
      if (e instanceof Error && e.message === 'Cancelled') break;
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
