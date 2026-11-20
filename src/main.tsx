import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { startCloudSync, refreshFromCloud } from './lib/storeSync';

createRoot(document.getElementById('root')!).render(<App />);

// Two-way cloud sync (shared across all devices/browsers).
startCloudSync();
window.addEventListener('focus', refreshFromCloud);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
