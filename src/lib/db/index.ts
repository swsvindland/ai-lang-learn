import { openDatabaseSync, type SQLiteBindParams } from 'expo-sqlite';

export const db = openDatabaseSync('hablo.db', { enableChangeListener: true });

const MIGRATIONS: string[] = [
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
];

export function migrate() {
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  db.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  while (version < MIGRATIONS.length) {
    const sql = MIGRATIONS[version];
    db.withTransactionSync(() => {
      db.execSync(sql);
      db.execSync(`PRAGMA user_version = ${version + 1}`);
    });
    version++;
  }
}

export function all<T>(sql: string, params: SQLiteBindParams = []): T[] {
  return db.getAllSync<T>(sql, params);
}

export function first<T>(sql: string, params: SQLiteBindParams = []): T | null {
  return db.getFirstSync<T>(sql, params);
}

export function run(sql: string, params: SQLiteBindParams = []) {
  return db.runSync(sql, params);
}

export function transaction(fn: () => void) {
  db.withTransactionSync(fn);
}

export function uid(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Wipes all learner data (settings "reset progress"). */
export function resetAll() {
  db.withTransactionSync(() => {
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
      db.execSync(`DELETE FROM ${table}`);
    }
  });
}
