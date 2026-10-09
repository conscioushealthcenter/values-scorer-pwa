import { useEffect, useState } from 'react';
import { getSettings, saveSettings } from '../db';
import { VALUES, defaultVector, type ValuesVector } from '../shared/values';

const SCALE = [1, 2, 3, 4, 5] as const;

export function Quiz({ onSaved }: { onSaved: () => void }) {
  const [vector, setVector] = useState<ValuesVector>(defaultVector());

  // Pre-fill when re-taking the quiz.
  useEffect(() => {
    getSettings().then((s) => s.valuesVector && setVector(s.valuesVector));
  }, []);

  async function finish() {
    await saveSettings({ valuesVector: vector, onboardingComplete: true });
    onSaved();
  }

  return (
    <>
      <h1>What matters to you?</h1>
      <p className="muted">
        Rate how important each value is to you, from 1 (not very) to 5 (core to who I am). Your answers stay on this
        device and are never sent anywhere except, when scoring, to the AI provider you choose.
      </p>
      {VALUES.map((v) => (
        <div className="card value-row" key={v.id}>
          <span className="title">{v.label}</span>
          <span className="muted">{v.blurb}</span>
          <div className="scale" role="group" aria-label={`${v.label} importance`}>
            {SCALE.map((n) => (
              <button key={n} aria-pressed={vector[v.id] === n} onClick={() => setVector({ ...vector, [v.id]: n })}>
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="btn block" onClick={finish}>Save my values</button>
    </>
  );
}
