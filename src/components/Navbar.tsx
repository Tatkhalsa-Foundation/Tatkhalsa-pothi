import React from 'react';
import {
  BookOpen,
  Home,
  Layers,
  MonitorPlay,
  ScrollText,
  Search,
} from 'lucide-react';
import type { AppRoute } from '../types/pothi';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  queueCount: number;
  onOpenQueue: () => void;
}

const NAV_ITEMS: Array<{
  route: AppRoute;
  label: string;
  mobileLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { route: '/', label: 'Pothi Vault', mobileLabel: 'Vault', icon: Home },
  { route: '/searcher', label: 'Searcher', mobileLabel: 'Search', icon: Search },
  { route: '/gutka', label: 'Sundar Gutka', mobileLabel: 'Gutka', icon: ScrollText },
  { route: '/reader', label: 'Sehaj Paath', mobileLabel: 'Reader', icon: BookOpen },
  { route: '/pothi-present', label: 'Presenter', mobileLabel: 'Present', icon: MonitorPlay },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  queueCount,
  onOpenQueue,
}) => {
  const isRouteActive = (route: AppRoute): boolean => {
    if (route === '/searcher' && currentRoute === '/gurbani') return true;
    return currentRoute === route;
  };

  return (
    <>
      {/* Desktop & Mobile Top Navigation Header — Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b pothi-divider bg-[var(--surface-card)]/95 backdrop-blur-md">
        <div className="mx-auto flex h-12 md:h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-element Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="font-display text-lg md:text-xl font-semibold tracking-tight text-[var(--ink-primary)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-gold)]"
          >
            Tatkhalsa Web Pothi
          </a>

          {/* Zone 2: 5 Single-Line Text Navigation Links (Desktop) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const active = isRouteActive(item.route);
              return (
                <a
                  key={item.route}
                  href={item.route}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.route);
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-gold)] ${
                    active
                      ? 'text-[var(--ink-primary)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-[var(--accent-gold)]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action (Multi-View Queue) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenQueue}
              aria-label={`Open Shabad Queue (${queueCount} queued)`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs sm:text-sm font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] transition-colors whitespace-nowrap shrink-0 min-h-[38px] md:min-h-[40px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-gold)]"
            >
              <Layers className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Queue <span className="font-mono-nums opacity-90">({queueCount})</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Zone Navigation Bar (compact 56px, combined <= 15% of mobile viewport) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t pothi-divider bg-[var(--surface-card)]/95 backdrop-blur-md"
      >
        <div className="grid grid-cols-5 h-14 items-center px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.route);
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
                  active
                    ? 'text-[var(--accent-gold)] font-semibold'
                    : 'text-[var(--ink-muted)]'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="mt-0.5 text-[11px] leading-none whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
