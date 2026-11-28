import React from 'react';
import type { AppRoute } from '../types/pothi';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 border-t pothi-divider bg-[var(--surface-card)] pb-20 md:pb-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-base font-semibold text-[var(--ink-primary)]">
            Tatkhalsa Pothi Sahib
          </p>
          <p className="text-xs text-[var(--ink-muted)]">
            100% Free Seva by Tatkhalsa Foundation · pothi.tatkhalsa.in · Public-Domain Unicode Gurmukhi
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--ink-secondary)]"
        >
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Pothi Vault
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/searcher')}
            className="hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Gurbani Searcher
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/gutka')}
            className="hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Sundar Gutka
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/reader')}
            className="hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Sehaj Paath Reader
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/pothi-present')}
            className="hover:text-[var(--accent-gold)] cursor-pointer"
          >
            Presenter Mode
          </button>
          <span aria-hidden="true" className="text-[var(--border-strong)]">|</span>
          <a
            href="https://tatkhalsa.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-gold)]"
          >
            tatkhalsa.in
          </a>
          <a
            href="https://calendar.tatkhalsa.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-gold)]"
          >
            calendar.tatkhalsa.in
          </a>
        </nav>
      </div>
    </footer>
  );
};
