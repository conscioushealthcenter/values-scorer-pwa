import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { registerServiceWorker, requestPersistentStorage } from './pwa/pwa';
import './ui/styles.css';

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
registerServiceWorker();
void requestPersistentStorage();
