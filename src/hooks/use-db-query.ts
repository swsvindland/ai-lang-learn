import { addDatabaseChangeListener } from 'expo-sqlite';
import { useMemo, useSyncExternalStore } from 'react';

// One app-wide listener bumps a version number; bursts of writes (e.g. a
// transaction) coalesce into a single bump per frame.
let version = 0;
let scheduled = false;
const listeners = new Set<() => void>();

addDatabaseChangeListener(() => {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    version++;
    listeners.forEach((l) => l());
  }, 16);
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getVersion() {
  return version;
}

/** Bumps on every (coalesced) database change; lets derived data cache per change. */
export function dbVersion() {
  return version;
}

/**
 * Runs a synchronous query and re-runs it whenever any table changes.
 * The DB is small and local, so coarse invalidation keeps this simple. Pass
 * `key` when the query depends on props (e.g. a route id).
 */
export function useDbQuery<T>(query: () => T, key: string | number = ''): T {
  const v = useSyncExternalStore(subscribe, getVersion);
  // `query` is usually an inline closure; `key` captures what it depends on.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => query(), [v, key]);
}
