import React, { useState } from 'react';
import { Download, WifiOff, X } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => {
          void install();
        }}
        aria-label="Install Tatkhalsa Pothi Sahib offline app"
        className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider bg-[var(--surface-card)] px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer"
      >
        <Download className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          aria-label="Install Tatkhalsa Pothi Sahib on iOS"
          className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider bg-[var(--surface-card)] px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
          <span>Install</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Install on iPhone or iPad"
          >
            <div className="w-full max-w-sm rounded-2xl border pothi-divider pothi-surface p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-[var(--ink-primary)]">
                  Install Pothi Sahib on iOS
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close install instructions"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--ink-secondary)]">
                <li>
                  Tap the <strong className="text-[var(--ink-primary)]">Share</strong> icon in Safari’s toolbar.
                </li>
                <li>
                  Scroll down and tap{' '}
                  <strong className="text-[var(--ink-primary)]">Add to Home Screen</strong> for offline Nitnem &amp; Sehaj Paath reading.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-lg bg-[var(--accent-navy)] py-2.5 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-[#0B1220] px-3.5 py-2 text-xs font-medium text-amber-200 shadow-lg"
    >
      <WifiOff className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
      <span>Offline Mode — Cached Sundar Gutka &amp; Pothi Corpus Active</span>
    </div>
  );
};
