import type { ValuesVector } from './values';

/** A post submitted for scoring (pasted/shared by the user). */
export interface ExtractedPost {
  /** Stable id derived from author + text (FNV-1a hash). Used for dedupe. */
  id: string;
  platform: 'facebook' | 'manual';
  author: string;
  text: string;
}

/** A post as persisted in IndexedDB. Text is truncated; full text is not retained. */
export interface StoredPost {
  id: string;
  platform: 'facebook' | 'manual';
  author: string;
  snippet: string;
  firstSeen: number; // epoch ms
  /** Filled in by the AI scoring step (not implemented yet). */
  score?: number; // 0-100
  reason?: string;
  scoredAt?: number;
}

export type Provider = 'openai' | 'anthropic';

export interface Settings {
  valuesVector?: ValuesVector;
  onboardingComplete: boolean;
  provider: Provider;
  apiKey?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  onboardingComplete: false,
  provider: 'anthropic',
};

export interface DaySummary {
  date: string; // YYYY-MM-DD (local)
  seen: number;
  scored: number;
  avgScore: number | null;
}
