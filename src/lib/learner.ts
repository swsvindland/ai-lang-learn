import {
  CEFR_LEVELS,
  courseUnits,
  getGrammar,
  getUnit,
  nextUnit,
  ratingToCefr,
  type Cefr,
  type Unit,
} from '@/lib/curriculum';
import { all, courseHasProfile, first, firstIn, hasActiveCourse, run, transaction } from '@/lib/db';
import { LANGUAGE_CODES, type LanguageCode } from '@/lib/languages';
import type { Background, PlacementPlan } from '@/lib/placement';
import { isLearned } from '@/lib/srs';

export const SKILLS = ['vocab', 'grammar', 'listening', 'speaking', 'reading', 'writing'] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  listening: 'Listening',
  speaking: 'Speaking',
  reading: 'Reading',
  writing: 'Writing',
};

export type Interest =
  | 'movies'
  | 'music'
  | 'sports'
  | 'cooking'
  | 'travel'
  | 'books'
  | 'news'
  | 'history'
  | 'tech'
  | 'kids'
  | 'comedy'
  | 'podcasts';

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: 'movies', label: 'Movies & TV' },
  { value: 'music', label: 'Music' },
  { value: 'books', label: 'Books' },
  { value: 'podcasts', label: 'Podcasts' },
  { value: 'news', label: 'News' },
  { value: 'sports', label: 'Sports' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'travel', label: 'Travel' },
  { value: 'history', label: 'History' },
  { value: 'tech', label: 'Tech' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'kids', label: 'Kids content' },
];

export type Profile = {
  name: string | null;
  startLevel: Cefr;
  sessionsPerWeek: number;
  sessionMinutes: number;
  /** 1 = Sunday ... 7 = Saturday (expo-notifications weekday convention). */
  reminderDays: number[];
  reminderHour: number;
  reminderMinute: number;
  remindersEnabled: boolean;
  interests: Interest[];
  slowAudio: boolean;
  /** Prior experience with the language from onboarding; used for pacing and AI context. */
  background: Background | null;
  /** Furigana over kanji (languages with readings). */
  showReadings: boolean;
  /** Romaji under Japanese text, for learners still getting comfortable with kana. */
  showRomaji: boolean;
  createdAt: number;
};

type ProfileRow = {
  name: string | null;
  start_level: Cefr;
  sessions_per_week: number;
  session_minutes: number;
  reminder_days: string;
  reminder_hour: number;
  reminder_minute: number;
  reminders_enabled: number;
  interests: string;
  slow_audio: number;
  background: Background | null;
  show_readings: number;
  show_romaji: number;
  created_at: number;
};

function toProfile(row: ProfileRow): Profile {
  return {
    name: row.name,
    startLevel: row.start_level,
    sessionsPerWeek: row.sessions_per_week,
    sessionMinutes: row.session_minutes,
    reminderDays: JSON.parse(row.reminder_days),
    reminderHour: row.reminder_hour,
    reminderMinute: row.reminder_minute,
    remindersEnabled: !!row.reminders_enabled,
    interests: JSON.parse(row.interests),
    slowAudio: !!row.slow_audio,
    background: row.background,
    showReadings: !!row.show_readings,
    showRomaji: !!row.show_romaji,
    createdAt: row.created_at,
  };
}

export function getProfile(): Profile | null {
  if (!hasActiveCourse()) return null;
  const row = first<ProfileRow>('SELECT * FROM profile WHERE id = 1');
  return row ? toProfile(row) : null;
}

/** Another course's profile, e.g. to pre-fill setup when starting a second language. */
export function profileOf(code: LanguageCode): Profile | null {
  const row = firstIn<ProfileRow>(code, 'SELECT * FROM profile WHERE id = 1');
  return row ? toProfile(row) : null;
}

export function saveProfile(p: Profile) {
  run(
    `INSERT INTO profile (id, name, start_level, sessions_per_week, session_minutes, reminder_days,
       reminder_hour, reminder_minute, reminders_enabled, interests, slow_audio, background, show_readings,
       show_romaji, created_at)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, start_level = excluded.start_level,
       sessions_per_week = excluded.sessions_per_week, session_minutes = excluded.session_minutes,
       reminder_days = excluded.reminder_days, reminder_hour = excluded.reminder_hour,
       reminder_minute = excluded.reminder_minute, reminders_enabled = excluded.reminders_enabled,
       interests = excluded.interests, slow_audio = excluded.slow_audio, background = excluded.background,
       show_readings = excluded.show_readings, show_romaji = excluded.show_romaji`,
    [
      p.name,
      p.startLevel,
      p.sessionsPerWeek,
      p.sessionMinutes,
      JSON.stringify(p.reminderDays),
      p.reminderHour,
      p.reminderMinute,
      p.remindersEnabled ? 1 : 0,
      JSON.stringify(p.interests),
      p.slowAudio ? 1 : 0,
      p.background,
      p.showReadings ? 1 : 0,
      p.showRomaji ? 1 : 0,
      p.createdAt,
    ]
  );
}

export function updateProfile(patch: Partial<Profile>) {
  const current = getProfile();
  if (!current) return;
  saveProfile({ ...current, ...patch });
}

/**
 * Creates the learner model for a new profile. With a placement plan, skills
 * start where the diagnostic put them and earlier units are placed out of,
 * with their words queued for a quick refresh.
 */
export function initLearner(profile: Profile, plan?: PlacementPlan) {
  const now = Date.now();
  const units = courseUnits();
  const start = plan?.startUnit ?? units[0];
  transaction(() => {
    saveProfile({ ...profile, startLevel: start.cefr });
    for (const skill of SKILLS) {
      run('INSERT OR REPLACE INTO skills (skill, rating, attempts, updated_at) VALUES (?, ?, 0, ?)', [
        skill,
        plan?.skills[skill] ?? 0,
        now,
      ]);
    }
    for (const unit of units) {
      const status = unit.order < start.order ? 'skipped' : unit.id === start.id ? 'active' : 'locked';
      run('INSERT OR REPLACE INTO unit_progress (unit_id, status, started_at) VALUES (?, ?, ?)', [
        unit.id,
        status,
        status === 'active' ? now : null,
      ]);
      if (status !== 'skipped') continue;
      for (const v of unit.vocab) {
        run(`INSERT OR IGNORE INTO vocab_refresh (vocab_id, unit_order, status) VALUES (?, ?, 'pending')`, [
          v.id,
          unit.order,
        ]);
      }
      // Placed-out grammar starts half-mastered so it still shows up in spaced review.
      for (const g of unit.grammar) {
        run(
          `INSERT OR REPLACE INTO grammar_progress (grammar_id, attempts, correct, mastery, introduced_at, last_seen)
           VALUES (?, 0, 0, 0.5, ?, ?)`,
          [g.id, now, now]
        );
      }
    }
  });
}

/** Every language the app teaches, with whether it's been started and the level reached. */
export function courseSummaries(): { code: LanguageCode; started: boolean; level: Cefr }[] {
  return LANGUAGE_CODES.map((code) => {
    const started = courseHasProfile(code);
    const rating = started ? (firstIn<{ r: number | null }>(code, 'SELECT AVG(rating) AS r FROM skills')?.r ?? 0) : 0;
    return { code, started, level: ratingToCefr(rating) };
  });
}

// ---------- Vocabulary refresh (placed-out units) ----------

export function nextRefreshWords(limit: number, exclude: string[] = []) {
  const skip = exclude.length ? `AND vocab_id NOT IN (${exclude.map(() => '?').join(',')})` : '';
  return all<{ vocab_id: string }>(
    `SELECT vocab_id FROM vocab_refresh WHERE status = 'pending' ${skip} ORDER BY unit_order, rowid LIMIT ?`,
    [...exclude, limit]
  ).map((r) => r.vocab_id);
}

export function markRefreshed(vocabId: string, known: boolean) {
  run(`UPDATE vocab_refresh SET status = ?, checked_at = ? WHERE vocab_id = ?`, [
    known ? 'known' : 'relearn',
    Date.now(),
    vocabId,
  ]);
}

export function refreshProgress() {
  const rows = all<{ status: string; n: number }>(`SELECT status, COUNT(*) AS n FROM vocab_refresh GROUP BY status`);
  const count = (s: string) => rows.find((r) => r.status === s)?.n ?? 0;
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  return { total, pending: count('pending'), known: count('known'), relearn: count('relearn') };
}

// ---------- Skills ----------

export type SkillRating = { skill: Skill; rating: number; attempts: number };

export function getSkills(): SkillRating[] {
  const rows = all<SkillRating>('SELECT skill, rating, attempts FROM skills');
  return SKILLS.map((s) => rows.find((r) => r.skill === s) ?? { skill: s, rating: 0, attempts: 0 });
}

export function overallRating(skills = getSkills()) {
  if (!skills.length) return 0;
  return skills.reduce((sum, s) => sum + s.rating, 0) / skills.length;
}

export function overallLevel() {
  return ratingToCefr(overallRating());
}

export function weakestSkills(n = 2): Skill[] {
  return [...getSkills()]
    .sort((a, b) => a.rating - b.rating)
    .slice(0, n)
    .map((s) => s.skill);
}

/**
 * Elo-style update: an exercise of `difficulty` (0-600 scale) answered with
 * `score` (0..1) nudges the skill rating toward where the learner really is.
 */
function updateSkill(skill: Skill, difficulty: number, score: number) {
  const row = first<SkillRating>('SELECT skill, rating, attempts FROM skills WHERE skill = ?', [skill]);
  if (!row) return;
  const expected = 1 / (1 + Math.exp((difficulty - row.rating) / 35));
  const k = Math.max(3, 16 / Math.sqrt(1 + row.attempts / 25));
  const rating = Math.max(0, Math.min(600, row.rating + k * (score - expected)));
  run('UPDATE skills SET rating = ?, attempts = attempts + 1, updated_at = ? WHERE skill = ?', [
    rating,
    Date.now(),
    skill,
  ]);
}

export type AttemptInput = {
  sessionId: string | null;
  kind: string;
  skill: Skill;
  /** Vocab id, grammar id, or other content reference. */
  ref?: string | null;
  score: number;
  difficulty: number;
  prompt?: string;
  expected?: string;
  response?: string;
  feedback?: string;
};

export function recordAttempt(a: AttemptInput) {
  const now = Date.now();
  transaction(() => {
    run(
      `INSERT INTO attempts (session_id, kind, skill, ref, score, prompt, expected, response, feedback, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        a.sessionId,
        a.kind,
        a.skill,
        a.ref ?? null,
        a.score,
        a.prompt ?? null,
        a.expected ?? null,
        a.response ?? null,
        a.feedback ?? null,
        now,
      ]
    );
    updateSkill(a.skill, a.difficulty, a.score);
    if (a.ref && getGrammar(a.ref)) {
      run(
        `INSERT INTO grammar_progress (grammar_id, attempts, correct, mastery, introduced_at, last_seen)
         VALUES (?, 1, ?, ?, ?, ?)
         ON CONFLICT(grammar_id) DO UPDATE SET attempts = attempts + 1, correct = correct + excluded.correct,
           mastery = mastery * 0.7 + excluded.correct * 0.3, last_seen = excluded.last_seen`,
        [a.ref, a.score, a.score * 0.3, now, now]
      );
    }
  });
}

export function markGrammarIntroduced(grammarId: string) {
  const now = Date.now();
  run(
    `INSERT INTO grammar_progress (grammar_id, introduced_at, last_seen) VALUES (?, ?, ?)
     ON CONFLICT(grammar_id) DO UPDATE SET last_seen = excluded.last_seen`,
    [grammarId, now, now]
  );
}

export function grammarMastery(grammarId: string) {
  return first<{ mastery: number; attempts: number; introduced_at: number | null }>(
    'SELECT mastery, attempts, introduced_at FROM grammar_progress WHERE grammar_id = ?',
    [grammarId]
  );
}

/** Recent mistakes, for AI personalization and review. */
export function recentMistakes(limit = 5) {
  return all<{ kind: string; prompt: string | null; expected: string | null; response: string | null }>(
    `SELECT kind, prompt, expected, response FROM attempts
     WHERE score < 0.6 AND response IS NOT NULL ORDER BY created_at DESC LIMIT ?`,
    [limit]
  );
}

// ---------- Units ----------

export type UnitStatus = 'locked' | 'active' | 'done' | 'skipped';

export function unitStatuses(): Record<string, UnitStatus> {
  const rows = all<{ unit_id: string; status: UnitStatus }>('SELECT unit_id, status FROM unit_progress');
  return Object.fromEntries(rows.map((r) => [r.unit_id, r.status]));
}

export function currentUnit(): Unit {
  const row = first<{ unit_id: string }>(
    `SELECT unit_id FROM unit_progress WHERE status = 'active' ORDER BY unit_id LIMIT 1`
  );
  const unit = row ? getUnit(row.unit_id) : undefined;
  if (unit) return unit;
  // Everything finished (or state missing): keep practising the last unit.
  const units = courseUnits();
  return units[units.length - 1];
}

export function unitMastery(unit: Unit) {
  const cards = all<{ vocab_id: string; state: string; interval_days: number }>(
    `SELECT vocab_id, state, interval_days FROM cards WHERE vocab_id IN (${unit.vocab.map(() => '?').join(',')})`,
    unit.vocab.map((v) => v.id)
  );
  const learnedWords = new Set(
    cards.filter((c) => isLearned({ state: c.state as never, interval_days: c.interval_days })).map((c) => c.vocab_id)
  );
  const introducedWords = new Set(cards.map((c) => c.vocab_id));
  const vocabScore = unit.vocab.length
    ? (learnedWords.size + 0.5 * (introducedWords.size - learnedWords.size)) / unit.vocab.length
    : 1;
  const grammarScores = unit.grammar.map((g) => grammarMastery(g.id)?.mastery ?? 0);
  const grammarScore = grammarScores.length
    ? grammarScores.reduce((a, b) => a + b, 0) / grammarScores.length
    : 1;
  const conv = first<{ conversations: number }>('SELECT conversations FROM unit_progress WHERE unit_id = ?', [
    unit.id,
  ]);
  return {
    vocab: vocabScore,
    grammar: grammarScore,
    introduced: introducedWords.size,
    conversations: conv?.conversations ?? 0,
    overall: vocabScore * 0.5 + grammarScore * 0.5,
  };
}

export function recordConversation(unitId: string) {
  run('UPDATE unit_progress SET conversations = conversations + 1 WHERE unit_id = ?', [unitId]);
}

/**
 * Moves to the next unit once the current one is solid: most words introduced
 * and sticking, grammar mostly right. Returns the new unit when it advanced.
 */
export function maybeAdvanceUnit(unit: Unit, requireConversation: boolean): Unit | null {
  const m = unitMastery(unit);
  const allIntroduced = m.introduced >= unit.vocab.length;
  if (!allIntroduced || m.overall < 0.7) return null;
  if (requireConversation && m.conversations < 1) return null;
  const next = nextUnit(unit.id);
  const now = Date.now();
  transaction(() => {
    run(`UPDATE unit_progress SET status = 'done', completed_at = ? WHERE unit_id = ?`, [now, unit.id]);
    if (next) {
      run(`UPDATE unit_progress SET status = 'active', started_at = ? WHERE unit_id = ?`, [now, next.id]);
    }
  });
  return next ?? null;
}

// ---------- Time & stats ----------

export function studyStats() {
  const s = first<{ secs: number | null; count: number }>(
    `SELECT SUM(active_seconds) AS secs, COUNT(*) AS count FROM sessions WHERE status = 'done'`
  );
  const h = first<{ mins: number | null; count: number }>(
    `SELECT SUM(minutes_spent) AS mins, COUNT(*) AS count FROM homework WHERE status = 'done'`
  );
  const words = first<{ n: number }>(`SELECT COUNT(DISTINCT vocab_id) AS n FROM cards WHERE state = 'review'`);
  const lessonHours = (s?.secs ?? 0) / 3600;
  const homeworkHours = (h?.mins ?? 0) / 60;
  return {
    sessions: s?.count ?? 0,
    lessonHours,
    homeworkHours,
    totalHours: lessonHours + homeworkHours,
    homeworkDone: h?.count ?? 0,
    wordsKnown: words?.n ?? 0,
  };
}

export function startOfWeek(now = new Date()) {
  const d = new Date(now);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

export function sessionsThisWeek() {
  return all<{ id: string; started_at: number; active_seconds: number }>(
    `SELECT id, started_at, active_seconds FROM sessions WHERE status = 'done' AND started_at >= ? ORDER BY started_at`,
    [startOfWeek()]
  );
}

export function levelFromIndex(i: number): Cefr {
  return CEFR_LEVELS[Math.max(0, Math.min(CEFR_LEVELS.length - 1, i))];
}
