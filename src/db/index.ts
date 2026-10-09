import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { DEFAULT_SETTINGS, type DaySummary, type ExtractedPost, type Settings, type StoredPost } from '../shared/types';

interface ScorerDB extends DBSchema {
  settings: { key: string; value: unknown };
  posts: {
    key: string;
    value: StoredPost;
    indexes: { 'by-firstSeen': number };
  };
}

export const DB_NAME = 'values-scorer';
export const DB_VERSION = 1;
const SNIPPET_LEN = 280;

let dbPromise: Promise<IDBPDatabase<ScorerDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<ScorerDB>> {
  dbPromise ??= openDB<ScorerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('settings');
      const posts = db.createObjectStore('posts', { keyPath: 'id' });
      posts.createIndex('by-firstSeen', 'firstSeen');
    },
  });
  return dbPromise;
}

/** Test helper: drop the cached connection. */
export async function closeDB(): Promise<void> {
  if (!dbPromise) return;
  (await dbPromise).close();
  dbPromise = null;
}

// ---- settings -------------------------------------------------------------

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const stored = (await db.get('settings', 'settings')) as Partial<Settings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch };
  const db = await getDB();
  await db.put('settings', next, 'settings');
  return next;
}

// ---- posts ----------------------------------------------------------------

/** Insert posts not seen before. Returns the ids that were newly added. */
export async function addPosts(posts: ExtractedPost[], now = Date.now()): Promise<string[]> {
  const db = await getDB();
  const tx = db.transaction('posts', 'readwrite');
  const added: string[] = [];
  for (const p of posts) {
    if (await tx.store.get(p.id)) continue;
    await tx.store.put({
      id: p.id,
      platform: p.platform,
      author: p.author,
      snippet: p.text.slice(0, SNIPPET_LEN),
      firstSeen: now,
    });
    added.push(p.id);
  }
  await tx.done;
  return added;
}

export async function getPostsBetween(from: number, to: number): Promise<StoredPost[]> {
  const db = await getDB();
  return db.getAllFromIndex('posts', 'by-firstSeen', IDBKeyRange.bound(from, to, false, true));
}

export function localDateString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export async function getDaySummary(day = new Date()): Promise<DaySummary> {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
  const posts = await getPostsBetween(start, start + 24 * 60 * 60 * 1000);
  const scored = posts.filter((p) => typeof p.score === 'number');
  const avg = scored.length ? scored.reduce((s, p) => s + (p.score as number), 0) / scored.length : null;
  return { date: localDateString(day), seen: posts.length, scored: scored.length, avgScore: avg };
}

/** Wipe all stored data (settings + posts). */
export async function clearAll(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['settings', 'posts'], 'readwrite');
  await Promise.all([tx.objectStore('settings').clear(), tx.objectStore('posts').clear(), tx.done]);
}
