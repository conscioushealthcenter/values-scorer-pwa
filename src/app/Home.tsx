import { useEffect, useState } from 'react';
import { getDaySummary, getSettings } from '../db';
import type { DaySummary } from '../shared/types';
import { InstallCard } from './InstallCard';

export function Home({ go }: { go: (r: 'settings' | 'dashboard') => void }) {
  const [summary, setSummary] = useState<DaySummary | null>(null);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    getDaySummary().then(setSummary);
    getSettings().then((s) => setHasKey(Boolean(s.apiKey)));
  }, []);

  return (
    <>
      <h1>Today</h1>
      <InstallCard />
      {!hasKey && (
        <div className="card">
          <p>Add your AI provider API key to enable scoring.</p>
          <button className="btn" onClick={() => go('settings')}>Open settings</button>
        </div>
      )}
      <div className="card stats">
        <div className="stat">
          <div className="n">{summary?.seen ?? '–'}</div>
          <div className="muted">posts analyzed</div>
        </div>
        <div className="stat">
          <div className="n">{summary?.avgScore != null ? Math.round(summary.avgScore) : '–'}</div>
          <div className="muted">avg alignment</div>
        </div>
      </div>
      <p className="muted">
        Manual analysis (paste a post to score it against your values) is the next feature. Nothing is scored yet.
      </p>
      <button className="btn secondary" onClick={() => go('dashboard')}>Weekly dashboard</button>
    </>
  );
}
