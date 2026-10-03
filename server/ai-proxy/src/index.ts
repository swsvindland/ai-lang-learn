/**
 * Hablo Plus AI proxy (Cloudflare Worker).
 *
 * The app sends OpenAI-style chat completion requests here with
 * `Authorization: Bearer <RevenueCat app user id>`. The worker:
 *   1. checks with RevenueCat that this subscriber has the Plus entitlement,
 *   2. applies a per-subscriber daily request cap,
 *   3. forwards to OpenRouter with the server-held API key and a fixed model.
 * The app never sees the OpenRouter key, and clients can't pick an expensive model.
 */

export interface Env {
  OPENROUTER_API_KEY: string;
  REVENUECAT_SECRET_KEY: string;
  MODEL: string;
  ENTITLEMENT: string;
  DAILY_REQUEST_LIMIT: string;
  MAX_TOKENS: string;
  USAGE: KVNamespace;
  /** Per-IP limiter that runs before any RevenueCat lookup or KV write. */
  IP_LIMITER: RateLimit;
}

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const MAX_MESSAGES = 60;
const MAX_CHARS = 60_000;

function errorResponse(status: number, message: string) {
  return Response.json({ error: { message } }, { status });
}

// The app uses RevenueCat's anonymous ids. If you add accounts (Purchases.logIn), widen this to match your ids.
const SUBSCRIBER_ID = /^\$RCAnonymousID:[0-9a-f]{32}$/;

function subscriberId(request: Request) {
  const header = request.headers.get('Authorization') ?? '';
  const id = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  return SUBSCRIBER_ID.test(id) ? id : null;
}

/** RevenueCat entitlement check, cached in KV (briefly for "no" so new purchases unlock fast). */
async function isSubscribed(userId: string, env: Env) {
  const cacheKey = `ent:${userId}`;
  const cached = await env.USAGE.get(cacheKey);
  if (cached !== null) return cached === '1';

  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
    headers: { Authorization: `Bearer ${env.REVENUECAT_SECRET_KEY}` },
  });
  if (!res.ok) throw new Error(`RevenueCat returned ${res.status}`);
  const data = (await res.json()) as {
    subscriber?: {
      entitlements?: Record<string, { expires_date: string | null; grace_period_expires_date?: string | null }>;
    };
  };
  const entitlement = data.subscriber?.entitlements?.[env.ENTITLEMENT];
  // Lifetime purchases have no expiry; a billing grace period keeps access until it ends.
  const until = Math.max(
    0,
    ...[entitlement?.expires_date, entitlement?.grace_period_expires_date]
      .map((d) => (d ? Date.parse(d) : NaN))
      .filter(Number.isFinite)
  );
  const active = !!entitlement && (entitlement.expires_date === null || until > Date.now());
  await env.USAGE.put(cacheKey, active ? '1' : '0', { expirationTtl: active ? 600 : 60 });
  return active;
}

/** Approximate daily cap (KV isn't atomic, which is fine for a cost guardrail). */
async function takeDailyQuota(userId: string, env: Env) {
  const day = new Date().toISOString().slice(0, 10);
  const key = `use:${userId}:${day}`;
  const used = Number((await env.USAGE.get(key)) ?? '0');
  if (used >= Number(env.DAILY_REQUEST_LIMIT || '400')) return false;
  await env.USAGE.put(key, String(used + 1), { expirationTtl: 2 * 86_400 });
  return true;
}

function sanitizeMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || !value.length || value.length > MAX_MESSAGES) return null;
  let chars = 0;
  const out: ChatMessage[] = [];
  for (const m of value) {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== 'system' && role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    chars += content.length;
    out.push({ role, content });
  }
  return chars <= MAX_CHARS ? out : null;
}

async function hashId(id: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/v1/chat/completions') return errorResponse(404, 'Not found');
    if (request.method !== 'POST') return errorResponse(405, 'Use POST');

    // Cheap checks first, so junk traffic never reaches RevenueCat or KV.
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (!(await env.IP_LIMITER.limit({ key: ip })).success) return errorResponse(429, 'Too many requests.');
    const userId = subscriberId(request);
    if (!userId) return errorResponse(401, 'Missing or malformed subscriber id.');

    let body: { messages?: unknown; temperature?: unknown; max_tokens?: unknown; response_format?: { type?: unknown } };
    try {
      body = await request.json();
    } catch {
      return errorResponse(400, 'Invalid JSON.');
    }
    const messages = sanitizeMessages(body.messages);
    if (!messages) return errorResponse(400, 'Invalid or oversized messages.');

    try {
      if (!(await isSubscribed(userId, env))) return errorResponse(403, 'Hablo Plus is not active for this account.');
    } catch {
      return errorResponse(503, 'Could not verify your subscription right now. Try again shortly.');
    }
    if (!(await takeDailyQuota(userId, env))) {
      return errorResponse(429, "You've reached today's tutor limit. It resets at midnight UTC.");
    }

    const maxTokens = Math.min(Number(body.max_tokens) || 1024, Number(env.MAX_TOKENS || '2000'));
    const temperature = typeof body.temperature === 'number' ? Math.min(1.5, Math.max(0, body.temperature)) : undefined;
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'Hablo Plus',
      },
      body: JSON.stringify({
        model: env.MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        ...(body.response_format?.type === 'json_object' ? { response_format: { type: 'json_object' } } : {}),
        // Lets OpenRouter attribute abuse to a subscriber without learning who they are.
        user: await hashId(userId),
      }),
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
    });
  },
};
