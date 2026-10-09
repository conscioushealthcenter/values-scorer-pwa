import { useEffect, useState } from 'react';
import { getSettings } from '../db';
import { useOnline } from '../pwa/pwa';
import { Dashboard } from './Dashboard';
import { Home } from './Home';
import { Quiz } from './Quiz';
import { Settings } from './Settings';

const ROUTES = [
  { path: 'home', label: 'Today', icon: '◉' },
  { path: 'dashboard', label: 'Dashboard', icon: '▤' },
  { path: 'quiz', label: 'Values', icon: '♡' },
  { path: 'settings', label: 'Settings', icon: '⚙' },
] as const;
type RoutePath = (typeof ROUTES)[number]['path'];

/** Hash routing: works on any static host and inside an installed PWA without server rewrites. */
function useRoute(): [RoutePath, (r: RoutePath) => void] {
  const read = (): RoutePath => {
    const h = window.location.hash.replace(/^#\/?/, '');
    return ROUTES.some((r) => r.path === h) ? (h as RoutePath) : 'home';
  };
  const [route, setRoute] = useState<RoutePath>(read);
  useEffect(() => {
    const onHash = () => setRoute(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, (r) => (window.location.hash = `/${r}`)];
}

export function App() {
  const [route, go] = useRoute();
  const online = useOnline();
  // null = still loading; avoids flashing the quiz for returning users.
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    getSettings().then((s) => setOnboarded(s.onboardingComplete));
  }, [route]);

  if (onboarded === null) return null;

  // First run: the quiz is the only screen until it is saved.
  if (!onboarded) {
    return (
      <div className="shell">
        <main className="page">
          <Quiz onSaved={() => { setOnboarded(true); go('home'); }} />
        </main>
      </div>
    );
  }

  return (
    <div className="shell">
      {!online && <div className="banner" role="status">You&rsquo;re offline. Your data is available; AI scoring needs a connection.</div>}
      <main className="page">
        {route === 'home' && <Home go={go} />}
        {route === 'dashboard' && <Dashboard />}
        {route === 'quiz' && <Quiz onSaved={() => go('home')} />}
        {route === 'settings' && <Settings />}
      </main>
      <nav className="tabbar" aria-label="Main">
        {ROUTES.map((r) => (
          <a key={r.path} href={`#/${r.path}`} aria-current={route === r.path ? 'page' : undefined}>
            <span aria-hidden="true">{r.icon}</span>
            {r.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
