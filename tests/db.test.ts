import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { addPosts, clearAll, getDaySummary, getSettings, saveSettings } from '../src/db';
import { defaultVector } from '../src/shared/values';

const post = (id: string, text = 'x'.repeat(40)) => ({ id, platform: 'facebook' as const, author: 'A', text });

describe('db', () => {
  beforeEach(clearAll);

  it('returns defaults then persists settings', async () => {
    expect((await getSettings()).onboardingComplete).toBe(false);
    await saveSettings({ valuesVector: defaultVector(4), onboardingComplete: true });
    const s = await getSettings();
    expect(s.onboardingComplete).toBe(true);
    expect(s.valuesVector?.empathy).toBe(4);
    expect(s.provider).toBe('anthropic');
  });

  it('dedupes posts by id and summarizes the day', async () => {
    expect(await addPosts([post('a'), post('b')])).toEqual(['a', 'b']);
    expect(await addPosts([post('b'), post('c')])).toEqual(['c']);
    const s = await getDaySummary();
    expect(s.seen).toBe(3);
    expect(s.avgScore).toBeNull();
  });

  it('truncates stored text', async () => {
    await addPosts([post('long', 'y'.repeat(1000))]);
    const { getPostsBetween } = await import('../src/db');
    const [p] = await getPostsBetween(0, Date.now() + 1000);
    expect(p.snippet.length).toBe(280);
  });
});
