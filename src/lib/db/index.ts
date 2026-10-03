import { openDatabaseSync, type SQLiteBindParams, type SQLiteDatabase } from 'expo-sqlite';

import { isLanguageCode, LANGUAGE_CODES, setActiveLanguageCode, type LanguageCode } from '@/lib/languages';

/**
 * Storage is split in two:
 * - `app.db` holds app-wide settings (which course is active, the AI provider).
 * - Each language has its own course database with the learner's profile,
 *   cards, sessions and homework, so switching languages keeps both histories.
 */
const appDb = openDatabaseSync('app.db', { enableChangeListener: true });

// Spanish predates multi-language support and keeps its original file.
const COURSE_FILES: Record<LanguageCode, string> = { es: 'hablo.db', ja: 'hablo-ja.db' };

const COURSE_MIGRATIONS: string[] = [
  // 1: initial schema
  `
  CREATE TABLE profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    start_level TEXT NOT NULL,
    sessions_per_week INTEGER NOT NULL,
    session_minutes INTEGER NOT NULL,
    reminder_days TEXT NOT NULL,
    reminder_hour INTEGER NOT NULL,
    reminder_minute INTEGER NOT NULL,
    reminders_enabled INTEGER NOT NULL DEFAULT 1,
    interests TEXT NOT NULL,
    slow_audio INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE unit_progress (
    unit_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    started_at INTEGER,
    completed_at INTEGER,
    conversations INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    vocab_id TEXT NOT NULL,
    direction TEXT NOT NULL,
    state TEXT NOT NULL,
    due INTEGER NOT NULL,
    interval_days REAL NOT NULL DEFAULT 0,
    ease REAL NOT NULL DEFAULT 2.5,
    step INTEGER NOT NULL DEFAULT 0,
    reps INTEGER NOT NULL DEFAULT 0,
    lapses INTEGER NOT NULL DEFAULT 0,
    last_review INTEGER,
    created_at INTEGER NOT NULL,
    UNIQUE (vocab_id, direction)
  );
  CREATE INDEX cards_due ON cards (due);
  CREATE TABLE custom_vocab (
    id TEXT PRIMARY KEY,
    es TEXT NOT NULL,
    en TEXT NOT NULL,
    pos TEXT NOT NULL,
    gender TEXT,
    example_es TEXT NOT NULL,
    example_en TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE grammar_progress (
    grammar_id TEXT PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0,
    correct REAL NOT NULL DEFAULT 0,
    mastery REAL NOT NULL DEFAULT 0,
    introduced_at INTEGER,
    last_seen INTEGER
  );
  CREATE TABLE skills (
    skill TEXT PRIMARY KEY,
    rating REAL NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    target_minutes INTEGER NOT NULL,
    active_seconds INTEGER NOT NULL DEFAULT 0,
    unit_id TEXT,
    status TEXT NOT NULL,
    summary TEXT
  );
  CREATE TABLE attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    kind TEXT NOT NULL,
    skill TEXT NOT NULL,
    ref TEXT,
    score REAL NOT NULL,
    prompt TEXT,
    expected TEXT,
    response TEXT,
    feedback TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX attempts_session ON attempts (session_id);
  CREATE TABLE homework (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    session_id TEXT,
    media_id TEXT,
    kind TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    level TEXT NOT NULL,
    est_minutes INTEGER NOT NULL,
    status TEXT NOT NULL,
    completed_at INTEGER,
    minutes_spent INTEGER,
    reflection TEXT,
    feedback TEXT
  );
  `,
  // 2: placement background + vocabulary refresh queue for units placed out of
  `
  ALTER TABLE profile ADD COLUMN background TEXT;
  CREATE TABLE vocab_refresh (
    vocab_id TEXT PRIMARY KEY,
    unit_order INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    checked_at INTEGER
  );
  CREATE INDEX vocab_refresh_pending ON vocab_refresh (status, unit_order);
  `,
  // 3: reading aids for languages with non-Latin scripts
  `
  ALTER TABLE profile ADD COLUMN show_readings INTEGER NOT NULL DEFAULT 1;
  ALTER TABLE profile ADD COLUMN show_romaji INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE custom_vocab ADD COLUMN reading TEXT;
  `,
];

const APP_MIGRATIONS: string[] = [
  `CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);`,
];

function migrateDb(target: SQLiteDatabase, migrations: string[]) {
  const row = target.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  target.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  while (version < migrations.length) {
    const sql = migrations[version];
    target.withTransactionSync(() => {
      target.execSync(sql);
      target.execSync(`PRAGMA user_version = ${version + 1}`);
    });
    version++;
  }
}

// ---------- App settings ----------

export function getSetting(key: string): string | null {
  return appDb.getFirstSync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key])?.value ?? null;
}

export function setSetting(key: string, value: string | null) {
  if (value === null) appDb.runSync('DELETE FROM settings WHERE key = ?', [key]);
  else appDb.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
}

// ---------- Courses ----------

const courseDbs = new Map<LanguageCode, SQLiteDatabase>();

function courseDb(code: LanguageCode) {
  let target = courseDbs.get(code);
  if (!target) {
    target = openDatabaseSync(COURSE_FILES[code], { enableChangeListener: true });
    migrateDb(target, COURSE_MIGRATIONS);
    courseDbs.set(code, target);
  }
  return target;
}

let db: SQLiteDatabase | null = null;

/** Opens the app settings and the last-used course. Call once at startup. */
export function initDatabases() {
  migrateDb(appDb, APP_MIGRATIONS);
  let code = getSetting('language');
  if (!isLanguageCode(code)) {
    // Installs from before language choice were Spanish-only.
    code = courseHasProfile('es') ? 'es' : null;
    if (code) setSetting('language', code);
  }
  if (isLanguageCode(code)) {
    db = courseDb(code);
    setActiveLanguageCode(code);
  }
}

/** Makes `code` the active course. Its data is created on first use. */
export function selectCourse(code: LanguageCode) {
  db = courseDb(code);
  setActiveLanguageCode(code);
  // Also wakes every useDbQuery so screens re-read from the new course.
  setSetting('language', code);
}

export function hasActiveCourse() {
  return db !== null;
}

export function courseHasProfile(code: LanguageCode) {
  return !!courseDb(code).getFirstSync('SELECT 1 FROM profile WHERE id = 1');
}

/** Reads from a course other than (or including) the active one, e.g. for the course switcher. */
export function firstIn<T>(code: LanguageCode, sql: string, params: SQLiteBindParams = []): T | null {
  return courseDb(code).getFirstSync<T>(sql, params);
}

export function startedCourses(): LanguageCode[] {
  return LANGUAGE_CODES.filter(courseHasProfile);
}

function requireDb() {
  if (!db) throw new Error('No course selected');
  return db;
}

export function all<T>(sql: string, params: SQLiteBindParams = []): T[] {
  return requireDb().getAllSync<T>(sql, params);
}

export function first<T>(sql: string, params: SQLiteBindParams = []): T | null {
  return requireDb().getFirstSync<T>(sql, params);
}

export function run(sql: string, params: SQLiteBindParams = []) {
  return requireDb().runSync(sql, params);
}

export function transaction(fn: () => void) {
  requireDb().withTransactionSync(fn);
}

export function uid(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Wipes the active course's learner data (settings "reset progress"). Other courses are untouched. */
export function resetCourse() {
  const target = requireDb();
  target.withTransactionSync(() => {
    for (const table of [
      'profile',
      'unit_progress',
      'cards',
      'custom_vocab',
      'grammar_progress',
      'skills',
      'sessions',
      'attempts',
      'homework',
      'vocab_refresh',
    ]) {
      // `WHERE 1` stops SQLite's truncate shortcut, which skips the change hook useDbQuery relies on.
      target.execSync(`DELETE FROM ${table} WHERE 1`);
    }
  });
}
