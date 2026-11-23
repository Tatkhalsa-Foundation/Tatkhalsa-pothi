import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

// Reload once (with a 15-second cooldown) if a stale hashed asset/chunk fails to load
const CHUNK_RELOAD_KEY = 'pothi_chunk_reload_at';
const CHUNK_RELOAD_COOLDOWN_MS = 15_000;

function triggerChunkRecoveryReload(): void {
  try {
    const lastReloadRaw = window.sessionStorage.getItem(CHUNK_RELOAD_KEY);
    const lastReloadAt = lastReloadRaw ? Number(lastReloadRaw) : 0;
    const now = Date.now();
    if (!Number.isFinite(lastReloadAt) || now - lastReloadAt >= CHUNK_RELOAD_COOLDOWN_MS) {
      window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  triggerChunkRecoveryReload();
});

window.addEventListener(
  'error',
  (event) => {
    const target = event.target;
    if (target instanceof HTMLScriptElement) {
      const src = target.getAttribute('src') || target.src || '';
      if (src.includes('/assets/')) {
        triggerChunkRecoveryReload();
      }
    } else if (target instanceof HTMLLinkElement) {
      const href = target.getAttribute('href') || target.href || '';
      if (href.includes('/assets/')) {
        triggerChunkRecoveryReload();
      }
    }
  },
  true,
);

// Unregister any leftover Service Workers and legacy caches on startup
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {});
      });
    })
    .catch(() => {});
}
if (typeof window !== 'undefined' && 'caches' in window) {
  window.caches
    .keys()
    .then((keys) => {
      keys
        .filter((k) => k.startsWith('tatkhalsa-pwa-') || k.startsWith('tatkhalsa-gurbani-db-'))
        .forEach((k) => {
          window.caches.delete(k).catch(() => {});
        });
    })
    .catch(() => {});
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
