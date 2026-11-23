import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Layers,
  MonitorPlay,
  ScrollText,
  Search,
  Sun,
  Moon,
  BookMarked,
} from 'lucide-react';
import heroParchmentImg from '../assets/images/hero_pothi_parchment_1795425542305.jpg';
import darbarFiligreeImg from '../assets/images/darbar_marble_filigree_1795425539948.jpg';
import {
  GRANTH_CATALOG,
  GURBANI_CORPUS,
  TODAYS_HUKAMNAMA_ID,
} from '../data/gurbaniCorpus';
import { SAMPARDAI_POTHIS } from '../data/sampardaiPothis';
import type {
  AppRoute,
  GranthId,
  QueueItem,
  ReaderSettings,
  SehajPaathProgress,
  Shabad,
  ThemeMode,
} from '../types/pothi';
import { getOrderedNitnemForPothi, getPothiById } from '../utils/pothiState';

interface HomeVaultProps {
  activePothiId: string;
  onSelectPothi: (pothiId: string) => void;
  sehajProgress: SehajPaathProgress;
  settings: ReaderSettings;
  onChangeTheme: (theme: ThemeMode) => void;
  onNavigate: (route: AppRoute) => void;
  onOpenShabad: (shabadId: string) => void;
  onOpenAng: (granth: GranthId, ang: number) => void;
  onOpenBaani: (baaniId: string, pothiId?: string) => void;
  onOpenArdaas: (pothiId: string) => void;
  onEnqueueShabad: (shabad: Shabad) => void;
  queue: QueueItem[];
}

const SEHAJ_GRANTHIS: GranthId[] = ['sggs', 'dasam', 'sarbloh'];

export const HomeVault: React.FC<HomeVaultProps> = ({
  activePothiId,
  onSelectPothi,
  sehajProgress,
  settings,
  onChangeTheme,
  onNavigate,
  onOpenShabad,
  onOpenAng,
  onOpenBaani,
  onOpenArdaas,
  onEnqueueShabad,
  queue,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [vaultImgFailed, setVaultImgFailed] = useState(false);

  const activePothi = getPothiById(activePothiId);
  const nitnemList = getOrderedNitnemForPothi(activePothiId);
  const hukamnama =
    GURBANI_CORPUS.find((s) => s.id === TODAYS_HUKAMNAMA_ID) ?? GURBANI_CORPUS[0];
  const isHukamQueued = queue.some((q) => q.sourceId === hukamnama.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-14">
      {/* Editorial Hero Split — Focal Anchor + Today's Hukamnama */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border pothi-divider pothi-surface flex flex-col justify-between p-6 sm:p-10">
          {!heroImgFailed && (
            <img
              src={heroParchmentImg}
              alt="Illuminated Sikh manuscript marginalia on warm archival rag paper"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-12"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--surface-card)]/85 via-[var(--surface-card)]/75 to-[var(--surface-card)]/95"
          />

          <div className="relative z-10 space-y-5">
            <p className="text-xs font-medium tracking-wider uppercase text-[var(--accent-gold)]">
              Tatkhalsa Foundation · 100% Free Seva
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15] font-semibold text-[var(--ink-primary)] max-w-xl">
              Reverent Gurbani Pothi Sahib &amp; Sampardai Vault
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--ink-secondary)] max-w-xl">
              Read Sundar Gutka across 15 strictly isolated Sampardai Maryadas, continue independent Sehaj Paath across Sri Guru Granth Sahib Ji, Sri Dasam Granth Sahib Ji, and Sarbloh Granth Sahib Ji, or search Gurbani instantly without distractions.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/searcher')}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-navy)] px-5 py-2.5 text-sm font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] transition-colors cursor-pointer min-h-[44px]"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Gurbani Searcher
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/gutka')}
                className="inline-flex items-center gap-2 rounded-lg border pothi-divider bg-[var(--surface-card)] px-5 py-2.5 text-sm font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer min-h-[44px]"
              >
                <ScrollText className="h-4 w-4 text-[var(--accent-gold)]" aria-hidden="true" />
                Sundar Gutka
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/pothi-present')}
                className="inline-flex items-center gap-2 rounded-lg border pothi-divider bg-[var(--surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer min-h-[44px]"
              >
                <MonitorPlay className="h-4 w-4" aria-hidden="true" />
                Presenter Mode
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-5 border-t pothi-divider flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[var(--ink-muted)]">
              Active Pothi:{' '}
              <span className="font-medium text-[var(--ink-primary)]">
                {activePothi.name}
              </span>
            </div>

            <div
              className="inline-flex items-center gap-1 rounded-lg border pothi-divider bg-[var(--surface-subtle)] p-1"
              role="group"
              aria-label="Reading theme"
            >
              {(
                [
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'parchment', label: 'Parchment', icon: BookMarked },
                  { id: 'dark', label: 'Night', icon: Moon },
                ] as const
              ).map((t) => {
                const Icon = t.icon;
                const active = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onChangeTheme(t.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[var(--surface-card)] text-[var(--ink-primary)] shadow-xs'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink-primary)]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Today's Hukamnama Card */}
        <article className="lg:col-span-5 rounded-2xl border pothi-divider pothi-surface p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
              <span className="font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
                Today’s Hukamnama
              </span>
              <span className="font-mono-nums">
                Ang {hukamnama.ang} · {hukamnama.raag}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <p
                lang="pa"
                className="font-gurmukhi-noto text-2xl sm:text-[1.65rem] leading-[1.7] font-medium text-[var(--ink-primary)]"
              >
                {hukamnama.tuks[1]?.gurmukhi}
              </p>
              <p
                lang="pa"
                className="font-gurmukhi-noto text-xl leading-[1.7] text-[var(--ink-primary)]"
              >
                {hukamnama.tuks[4]?.gurmukhi}
              </p>
              <p className="text-sm leading-relaxed text-[var(--accent-gold)]">
                {hukamnama.tuks[1]?.transliteration}
              </p>
              <p className="text-sm leading-relaxed text-[var(--ink-secondary)]">
                {hukamnama.tuks[1]?.english} {hukamnama.tuks[4]?.english}
              </p>
              {hukamnama.tuks[1]?.teeka && (
                <p
                  lang="pa"
                  className="pt-2 border-t pothi-divider font-gurmukhi-noto text-xs leading-relaxed text-[var(--ink-muted)]"
                >
                  {hukamnama.tuks[1].teeka}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t pothi-divider flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--ink-muted)]">
              {hukamnama.author}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEnqueueShabad(hukamnama)}
                className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer min-h-[38px]"
              >
                {isHukamQueued ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                    Queued
                  </>
                ) : (
                  <>
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    Queue
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onOpenShabad(hukamnama.id)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] transition-colors cursor-pointer min-h-[38px]"
              >
                Read Full Shabad
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Sehaj Paath Independent Resume Cards */}
      <section aria-labelledby="sehaj-paath-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="sehaj-paath-heading"
              className="font-display text-2xl font-semibold text-[var(--ink-primary)]"
            >
              Continue Sehaj Paath
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Independent local Ang bookmarks saved separately for each Granth Sahib.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/reader')}
            className="text-sm font-medium text-[var(--accent-gold)] hover:underline cursor-pointer"
          >
            Open Scripture Reader
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SEHAJ_GRANTHIS.map((granthId) => {
            const meta = GRANTH_CATALOG[granthId];
            const currentAng = sehajProgress[granthId];
            const pct = Math.min(100, Math.max(1, Math.round((currentAng / meta.maxAng) * 100)));

            return (
              <div
                key={granthId}
                className="rounded-xl border pothi-divider pothi-surface p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <p lang="pa" className="font-gurmukhi-noto text-lg font-semibold text-[var(--ink-primary)]">
                    {meta.gurmukhiName}
                  </p>
                  <p className="text-sm font-medium text-[var(--ink-secondary)] mt-0.5">
                    {meta.shortName}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[var(--ink-muted)]">
                    <span>Saved Bookmark</span>
                    <span className="font-mono-nums font-medium text-[var(--ink-primary)]">
                      {meta.unitLabel} {currentAng} / {meta.maxAng}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-gold)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAng(granthId, currentAng)}
                  className="inline-flex items-center justify-between rounded-lg border pothi-divider bg-[var(--surface-subtle)] px-4 py-2.5 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] transition-colors cursor-pointer min-h-[42px]"
                >
                  <span>Resume at {meta.unitLabel} {currentAng}</span>
                  <BookOpen className="h-4 w-4 text-[var(--accent-gold)]" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Access: 9 Foundational Nitnem Baanis */}
      <section aria-labelledby="nitnem-quick-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="nitnem-quick-heading"
              className="font-display text-2xl font-semibold text-[var(--ink-primary)]"
            >
              Sundar Gutka — 9 Foundational Nitnem Baanis
            </h2>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Ordered according to <strong className="font-medium text-[var(--ink-primary)]">{activePothi.name}</strong> Maryada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/gutka')}
            className="text-sm font-medium text-[var(--accent-gold)] hover:underline cursor-pointer"
          >
            Switch Pothi Version &amp; View Ardaas
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nitnemList.map((baani, index) => (
            <button
              key={baani.id}
              type="button"
              onClick={() => onOpenBaani(baani.id, activePothiId)}
              className="group text-left rounded-xl border pothi-divider pothi-surface p-5 hover:border-[var(--accent-gold)] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                <span className="font-mono-nums">
                  {String(index + 1).padStart(2, '0')} · {baani.timeOfDay}
                </span>
                <ArrowRight
                  className="h-4 w-4 text-[var(--ink-muted)] group-hover:text-[var(--accent-gold)] transition-colors"
                  aria-hidden="true"
                />
              </div>
              <p
                lang="pa"
                className="mt-2 font-gurmukhi-noto text-xl font-semibold text-[var(--ink-primary)]"
              >
                {baani.nameGurmukhi}
              </p>
              <p className="mt-0.5 text-sm font-medium text-[var(--ink-secondary)]">
                {baani.nameEnglish}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 15 Sampardai Pothis Vault */}
      <section aria-labelledby="sampardai-vault-heading" className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border pothi-divider bg-[#14213d] text-white">
          {!vaultImgFailed && (
            <img
              src={darbarFiligreeImg}
              alt="Carved white marble jaali lattice and warm brass archway in morning light"
              referrerPolicy="no-referrer"
              onError={() => setVaultImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0e172b]/95 via-[#0e172b]/80 to-[#0e172b]/55"
          />
          <div className="relative z-10 p-6 sm:p-9 max-w-2xl space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#f0be67]">
              Strict Maryada Isolation
            </p>
            <h2
              id="sampardai-vault-heading"
              className="font-display text-2xl sm:text-3xl font-semibold text-white"
            >
              15 Sampardai Pothis Vault
            </h2>
            <p className="text-sm leading-relaxed text-slate-200">
              Each Sampardai Pothi preserves its own authentic Manglacharan, Nitnem order, Baani text boundaries, and Sampardai Ardaas in strict isolation without mixing Maryada variants.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPARDAI_POTHIS.map((pothi) => {
            const isSelected = pothi.id === activePothiId;
            return (
              <div
                key={pothi.id}
                className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                  isSelected
                    ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)]/50'
                    : 'pothi-divider pothi-surface'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
                    <span className="font-mono-nums">
                      Pothi {String(pothi.index).padStart(2, '0')} · {pothi.region}
                    </span>
                    {isSelected && (
                      <span className="font-semibold text-[var(--accent-gold)]">
                        Active
                      </span>
                    )}
                  </div>
                  <p
                    lang="pa"
                    className="mt-2 font-gurmukhi-noto text-lg font-semibold text-[var(--ink-primary)]"
                  >
                    {pothi.gurmukhiName}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-[var(--ink-secondary)]">
                    {pothi.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                    {pothi.maryadaSummary}
                  </p>
                </div>

                <div className="pt-3 border-t pothi-divider flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPothi(pothi.id);
                      onNavigate('/gutka');
                    }}
                    className="text-xs font-medium text-[var(--accent-gold)] hover:underline cursor-pointer min-h-[36px] px-1"
                  >
                    {isSelected ? 'Open Sundar Gutka' : 'Select & Open Gutka'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPothi(pothi.id);
                      onOpenArdaas(pothi.id);
                    }}
                    className="text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[36px] px-1"
                  >
                    Sampardai Ardaas
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
