/** Minimal client for OpenAI-compatible chat completion endpoints (OpenRouter and the Hablo Plus proxy). */

export type CloudEndpoint = {
  url: string;
  headers: Record<string, string>;
  /** Omitted for the Plus proxy, which picks the model server-side. */
  model?: string;
};

export type CloudRequest = {
  system?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  /** Ask for a JSON object response. */
  json?: boolean;
  signal?: AbortSignal;
};

export class CloudError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

const TIMEOUT_MS = 60_000;

function friendlyError(status: number, detail: string) {
  if (status === 401) return 'The API key was rejected. Check it in Settings → AI tutor.';
  if (status === 402) return 'Out of credits on this account.';
  if (status === 403) return detail || 'Your subscription is not active.';
  if (status === 429) return 'Too many requests right now. Try again in a moment.';
  return detail || `The AI service returned an error (${status}).`;
}

export async function chatCompletion(endpoint: CloudEndpoint, req: CloudRequest): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onAbort = () => controller.abort();
  req.signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch(endpoint.url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...endpoint.headers },
      body: JSON.stringify({
        ...(endpoint.model ? { model: endpoint.model } : {}),
        messages: [
          ...(req.system ? [{ role: 'system', content: req.system }] : []),
          { role: 'user', content: req.prompt },
        ],
        temperature: req.temperature,
        max_tokens: req.maxTokens,
        ...(req.json ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const detail = typeof body?.error?.message === 'string' ? body.error.message : '';
      throw new CloudError(friendlyError(res.status, detail), res.status);
    }
    const content = body?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new CloudError('The AI service returned an empty response.', res.status);
    return content;
  } catch (e) {
    if (controller.signal.aborted && !req.signal?.aborted) throw new CloudError('The AI service took too long to answer.', 0);
    throw e;
  } finally {
    clearTimeout(timer);
    req.signal?.removeEventListener('abort', onAbort);
  }
}
