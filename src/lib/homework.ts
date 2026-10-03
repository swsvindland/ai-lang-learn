import { isAiReady } from '@/lib/ai/llm';
import { planHomework, reviewReflection } from '@/lib/ai/tutor';
import { CEFR_LEVELS, course, levelBase, type Cefr, type MediaItem, type MediaType, type Unit } from '@/lib/curriculum';
import { all, first, run, uid } from '@/lib/db';
import { language } from '@/lib/languages';
import { recordAttempt, type Interest } from '@/lib/learner';
import { shuffle } from '@/lib/text';

export type HomeworkStatus = 'assigned' | 'done' | 'skipped';

export type Homework = {
  id: string;
  created_at: number;
  session_id: string | null;
  media_id: string | null;
  kind: MediaType;
  title: string;
  instructions: string;
  level: Cefr;
  est_minutes: number;
  status: HomeworkStatus;
  completed_at: number | null;
  minutes_spent: number | null;
  reflection: string | null;
  feedback: string | null;
};

const INTEREST_TYPES: Partial<Record<Interest, MediaType[]>> = {
  movies: ['movie', 'tv'],
  music: ['music'],
  books: ['book'],
  news: ['news'],
  podcasts: ['podcast'],
  kids: ['tv', 'youtube'],
  comedy: ['tv', 'youtube'],
};

/** Media whose level range fits the learner, stretching one level up for "i+1" input. */
export function levelAppropriateMedia(level: Cefr, interests: Interest[] = []): MediaItem[] {
  const li = CEFR_LEVELS.indexOf(level);
  const fits = course().mediaCatalog.filter((m) => {
    const min = CEFR_LEVELS.indexOf(m.minLevel);
    const max = CEFR_LEVELS.indexOf(m.maxLevel);
    return min <= li + (li < 2 ? 0 : 1) && max >= li;
  });
  const preferred = new Set(interests.flatMap((i) => INTEREST_TYPES[i] ?? []));
  const score = (m: MediaItem) =>
    (preferred.has(m.type) ? 2 : 0) +
    (interests.some((i) => `${m.title} ${m.description}`.toLowerCase().includes(i)) ? 1 : 0) +
    Math.random();
  return [...fits].sort((a, b) => score(b) - score(a));
}

function recentMediaIds(days = 21) {
  return new Set(
    all<{ media_id: string }>(`SELECT media_id FROM homework WHERE created_at > ? AND media_id IS NOT NULL`, [
      Date.now() - days * 86_400_000,
    ]).map((r) => r.media_id)
  );
}

export function openHomework() {
  return all<Homework>(`SELECT * FROM homework WHERE status = 'assigned' ORDER BY created_at DESC`);
}

export function homeworkHistory(limit = 30) {
  return all<Homework>(`SELECT * FROM homework WHERE status != 'assigned' ORDER BY completed_at DESC LIMIT ?`, [
    limit,
  ]);
}

export function getHomework(id: string) {
  return first<Homework>('SELECT * FROM homework WHERE id = ?', [id]);
}

/**
 * Assigns immersion homework for the days between sessions. The AI picks from
 * the curated catalog and writes a concrete task; without AI we use the
 * catalog's own study tips.
 */
export async function assignHomework(args: {
  level: Cefr;
  unit: Unit;
  interests: Interest[];
  sessionId: string | null;
  count?: number;
}): Promise<string[]> {
  const count = args.count ?? 2;
  // Don't pile up: top up to at most 3 open assignments.
  const open = openHomework().length;
  const toAssign = Math.max(0, Math.min(count, 3 - open));
  if (!toAssign) return [];

  const recent = recentMediaIds();
  const candidates = levelAppropriateMedia(args.level, args.interests)
    .filter((m) => !recent.has(m.id))
    .slice(0, 10);
  if (!candidates.length) return [];

  let plans: { media: MediaItem; title: string; instructions: string; minutes: number }[] = [];
  if (isAiReady()) {
    try {
      const ai = await planHomework({
        level: args.level,
        unit: args.unit,
        interests: args.interests,
        candidates,
        count: toAssign,
      });
      plans = ai
        .map((p) => ({ ...p, media: candidates.find((c) => c.id === p.mediaId)! }))
        .filter((p) => p.media);
    } catch {
      plans = [];
    }
  }
  if (!plans.length) {
    // Mix media types so it's not two podcasts.
    const picked: MediaItem[] = [];
    for (const m of shuffle(candidates.slice(0, 6))) {
      if (picked.length >= toAssign) break;
      if (!picked.some((p) => p.type === m.type)) picked.push(m);
    }
    plans = picked.map((m) => ({
      media: m,
      title: `${verbFor(m.type)} ${m.title}`,
      instructions: `${m.howToUse} Afterwards, jot down 3-5 new words and write two sentences in ${language().name} about what you ${pastVerbFor(m.type)}.`,
      minutes: m.type === 'movie' ? 60 : 30,
    }));
  }

  const now = Date.now();
  return plans.slice(0, toAssign).map((p) => {
    const id = uid('hw-');
    run(
      `INSERT INTO homework (id, created_at, session_id, media_id, kind, title, instructions, level, est_minutes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'assigned')`,
      [id, now, args.sessionId, p.media.id, p.media.type, p.title, p.instructions, args.level, p.minutes]
    );
    return id;
  });
}

export async function completeHomework(args: {
  id: string;
  minutes: number;
  reflection: string;
  level: Cefr;
}): Promise<{ feedback: string | null; corrected: string | null }> {
  const hw = getHomework(args.id);
  if (!hw) return { feedback: null, corrected: null };
  let feedback: string | null = null;
  let corrected: string | null = null;
  const text = args.reflection.trim();
  if (text && isAiReady()) {
    try {
      const review = await reviewReflection({ level: args.level, task: hw.instructions, reflection: text });
      feedback = review.feedback;
      corrected = review.corrected;
      recordAttempt({
        sessionId: null,
        kind: 'homework-reflection',
        skill: 'writing',
        ref: hw.id,
        score: review.score,
        difficulty: levelBase(args.level) + 50,
        prompt: hw.instructions,
        response: text,
        feedback: review.feedback,
      });
    } catch {
      // Feedback is a bonus; completion still counts.
    }
  }
  const stored = feedback ? (corrected ? `${feedback}\n\nCorrected: ${corrected}` : feedback) : null;
  run(
    `UPDATE homework SET status = 'done', completed_at = ?, minutes_spent = ?, reflection = ?, feedback = ? WHERE id = ?`,
    [Date.now(), args.minutes, text || null, stored, args.id]
  );
  return { feedback, corrected };
}

export function skipHomework(id: string) {
  run(`UPDATE homework SET status = 'skipped', completed_at = ? WHERE id = ?`, [Date.now(), id]);
}

export function mediaFor(hw: Pick<Homework, 'media_id'>) {
  return hw.media_id ? course().mediaCatalog.find((m) => m.id === hw.media_id) : undefined;
}

function verbFor(type: MediaType) {
  return { tv: 'Watch', movie: 'Watch', youtube: 'Watch', book: 'Read', news: 'Read', podcast: 'Listen to', music: 'Listen to', app: 'Try' }[type];
}

function pastVerbFor(type: MediaType) {
  return { tv: 'watched', movie: 'watched', youtube: 'watched', book: 'read', news: 'read', podcast: 'heard', music: 'heard', app: 'did' }[type];
}

export const MEDIA_TYPE_LABEL: Record<MediaType, string> = {
  tv: 'TV series',
  movie: 'Film',
  book: 'Book',
  podcast: 'Podcast',
  youtube: 'YouTube',
  music: 'Music',
  news: 'News',
  app: 'App',
};
