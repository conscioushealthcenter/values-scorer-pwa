import { useEffect, useState } from 'react';
import { clearAll, getSettings, saveSettings } from '../db';
import type { Provider } from '../shared/types';
import { InstallCard } from './InstallCard';

export function Settings() {
  const [provider, setProvider] = useState<Provider>('anthropic');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    getSettings().then((s) => {
      setProvider(s.provider);
      setApiKey(s.apiKey ?? '');
    });
  }, []);

  async function save() {
    await saveSettings({ provider, apiKey: apiKey.trim() || undefined });
    setStatus('Saved.');
  }

  async function wipe() {
    if (!confirm('Delete all locally stored data, including your values and post history?')) return;
    await clearAll();
    // Reload so the app returns to first-run state.
    window.location.hash = '/home';
    window.location.reload();
  }

  return (
    <>
      <h1>Settings</h1>
      <InstallCard />
      <p className="muted">
        Your API key is stored only in this browser&rsquo;s IndexedDB, in plaintext, and is sent only to the provider you
        pick.
      </p>
      <label htmlFor="provider">AI provider</label>
      <select id="provider" value={provider} onChange={(e) => setProvider(e.target.value as Provider)}>
        <option value="anthropic">Anthropic</option>
        <option value="openai">OpenAI</option>
      </select>
      <label htmlFor="key">API key</label>
      <input id="key" type="password" autoComplete="off" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <p>
        <button className="btn" onClick={save}>Save</button>{' '}
        <button className="btn secondary" onClick={wipe}>Delete all data</button>
      </p>
      {status && <p className="muted" role="status">{status}</p>}
    </>
  );
}
