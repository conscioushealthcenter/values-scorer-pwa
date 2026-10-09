import { useInstall } from '../pwa/pwa';

/** Add-to-Home-Screen prompt; renders nothing once installed or when the browser offers no install path. */
export function InstallCard() {
  const state = useInstall();
  if (state.kind === 'installed' || state.kind === 'unavailable') return null;
  return (
    <div className="card">
      <strong>Install Values Scorer</strong>
      {state.kind === 'prompt' ? (
        <>
          <p className="muted">Add it to your home screen for full-screen, offline-ready access.</p>
          <button className="btn" onClick={() => void state.install()}>Install app</button>
        </>
      ) : (
        <p className="muted">
          In Safari, tap the Share button, then <strong>Add to Home Screen</strong>.
        </p>
      )}
    </div>
  );
}
