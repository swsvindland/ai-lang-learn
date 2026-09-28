/** Lowercase, strip punctuation, and optionally accents, for lenient comparison. */
export function normalize(text: string, { keepAccents = false } = {}) {
  let t = text.toLowerCase().normalize('NFC');
  if (!keepAccents) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
  return t
    .replace(/[¿¡!?.,;:"“”«»()\-–—…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function words(text: string, opts?: { keepAccents?: boolean }) {
  const n = normalize(text, opts);
  return n ? n.split(' ') : [];
}

function levenshtein<T>(a: T[], b: T[], eq: (x: T, y: T) => boolean = (x, y) => x === y) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (eq(a[i - 1], b[j - 1]) ? 0 : 1)
      );
    }
  }
  return dp;
}

export function charSimilarity(a: string, b: string) {
  const x = [...a];
  const y = [...b];
  if (!x.length && !y.length) return 1;
  const d = levenshtein(x, y)[x.length][y.length];
  return 1 - d / Math.max(x.length, y.length);
}

export type WordMatch = { word: string; status: 'ok' | 'close' | 'missing' };

/**
 * Word-level alignment of what the learner said/typed against the target.
 * Returns a 0..1 score plus per-target-word status for display.
 */
export function compareSentences(target: string, attempt: string) {
  const t = words(target);
  const a = words(attempt);
  const display = target.split(/\s+/).filter(Boolean);
  const close = (x: string, y: string) => x === y || charSimilarity(x, y) >= 0.75;
  const dp = levenshtein(t, a, close);

  // Walk back through the table to label each target word.
  const status: WordMatch['status'][] = Array(t.length).fill('missing');
  let i = t.length;
  let j = a.length;
  while (i > 0 && j > 0) {
    const cost = close(t[i - 1], a[j - 1]) ? 0 : 1;
    if (dp[i][j] === dp[i - 1][j - 1] + cost) {
      if (cost === 0) status[i - 1] = t[i - 1] === a[j - 1] ? 'ok' : 'close';
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j] + 1) {
      i--;
    } else {
      j--;
    }
  }

  const credit = status.reduce((s, st) => s + (st === 'ok' ? 1 : st === 'close' ? 0.6 : 0), 0);
  const extra = Math.max(0, a.length - t.length);
  const score = t.length ? Math.max(0, (credit - extra * 0.25) / t.length) : a.length ? 0 : 1;
  const matches: WordMatch[] = display.map((word, k) => ({ word, status: status[k] ?? 'missing' }));
  return { score, matches };
}

/** Exact-ish answer check for typed short answers; reports accent-only slips separately. */
export function checkTyped(expected: string, given: string) {
  const exact = normalize(expected, { keepAccents: true }) === normalize(given, { keepAccents: true });
  if (exact) return { correct: true, accentSlip: false };
  const loose = normalize(expected) === normalize(given);
  return { correct: loose, accentSlip: loose };
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function sample<T>(items: readonly T[], n: number): T[] {
  return shuffle(items).slice(0, n);
}
