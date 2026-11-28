import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { GRANTH_CATALOG } from '../data/gurbaniCorpus';
import { SAMPARDAI_POTHIS } from '../data/sampardaiPothis';
import type { BaaniCollection, QueueItem, SampardaiPothi } from '../types/pothi';
import { transliterateGurmukhi } from '../utils/gurbaniSearch';
import {
  getAdditionalCollections,
  getOrderedNitnemForPothi,
  getPothiById,
  resolveBaaniForPothi,
} from '../utils/pothiState';

interface SundarGutkaProps {
  activePothiId: string;
  onSelectPothi: (pothiId: string) => void;
  onOpenBaani: (baaniId: string, pothiId: string) => void;
  onOpenArdaas: (pothiId: string) => void;
  onEnqueueBaani: (baani: BaaniCollection, pothi: SampardaiPothi) => void;
  queue: QueueItem[];
}

export const SundarGutka: React.FC<SundarGutkaProps> = ({
  activePothiId,
  onSelectPothi,
  onOpenBaani,
  onOpenArdaas,
  onEnqueueBaani,
  queue,
}) => {
  const [showAllPothis, setShowAllPothis] = useState(false);

  const activePothi = getPothiById(activePothiId);
  const orderedNitnem = getOrderedNitnemForPothi(activePothiId);
  const additionalCollections = getAdditionalCollections();

  const isBaaniQueued = (baaniId: string) =>
    queue.some((q) => q.id === `baani:${activePothiId}:${baaniId}`);

  const ardaasPreviewGurmukhi = activePothi.ardaas.tuks[3]?.gurmukhi ?? '';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-10">
      {/* Header + Prominent Pothi Version Switcher */}
      <section className="rounded-2xl border pothi-divider pothi-surface p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
              Isolated Sampardai Pothi · {String(activePothi.index).padStart(2, '0')} of 15
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)]">
              Sundar Gutka &amp; Nitnem
            </h1>
            <p className="text-sm text-[var(--ink-secondary)]">
              Switch between 15 isolated Sampardai Pothis below. Baani sequence (beginning with Japneesan), Manglacharan, Chaupai/Rehras Maryada notes, and Sampardai Ardaas remain strictly isolated to your selected tradition.
            </p>
          </div>

          <div className="w-full lg:w-80 space-y-2 shrink-0">
            <label
              htmlFor="pothi-version-switcher"
              className="block text-xs font-semibold text-[var(--ink-primary)]"
            >
              Pothi Version Switcher (15 Traditions)
            </label>
            <select
              id="pothi-version-switcher"
              value={activePothiId}
              onChange={(e) => onSelectPothi(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface-canvas)] px-3.5 py-2.5 text-sm font-medium text-[var(--ink-primary)] min-h-[44px] focus:outline-2 focus:outline-[var(--accent-gold)]"
            >
              {SAMPARDAI_POTHIS.map((p) => (
                <option key={p.id} value={p.id}>
                  {String(p.index).padStart(2, '0')}. {p.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAllPothis((v) => !v)}
              aria-expanded={showAllPothis}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-gold)] hover:underline cursor-pointer"
            >
              {showAllPothis ? (
                <>
                  Hide all 15 Sampardai Pothis
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              ) : (
                <>
                  Compare all 15 Sampardai Pothis
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Expanded 15-Pothi Grid Selector */}
        {showAllPothis && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-4 border-t pothi-divider">
            {SAMPARDAI_POTHIS.map((p) => {
              const selected = p.id === activePothiId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectPothi(p.id);
                    setShowAllPothis(false);
                  }}
                  className={`text-left rounded-xl border p-3.5 cursor-pointer ${
                    selected
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)]/60'
                      : 'pothi-divider bg-[var(--surface-canvas)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  <p className="text-xs text-[var(--ink-muted)] font-mono-nums">
                    {String(p.index).padStart(2, '0')} · {p.region}
                  </p>
                  <p lang="pa" className="mt-1 font-gurmukhi-noto text-base font-medium text-[var(--ink-primary)]">
                    {p.gurmukhiName}
                  </p>
                  <p className="text-xs text-[var(--ink-secondary)] mt-0.5">
                    {p.name}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Sampardai Isolation Card */}
        <div className="rounded-xl border pothi-divider bg-[var(--surface-subtle)] p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--accent-gold)] shrink-0" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-[var(--ink-primary)]">
                {activePothi.name}
              </h2>
            </div>
            <span className="text-xs text-[var(--ink-muted)]">
              {activePothi.lineage} · {activePothi.region}
            </span>
          </div>

          <p lang="pa" className="font-gurmukhi-noto text-xl font-medium text-[var(--ink-primary)]">
            {activePothi.manglacharan.gurmukhi}
          </p>
          <p className="text-xs leading-relaxed text-[var(--ink-secondary)]">
            {activePothi.maryadaSummary}
          </p>
        </div>
      </section>

      {/* 9 Foundational Nitnem Baanis */}
      <section aria-labelledby="foundational-nitnem-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="foundational-nitnem-heading"
            className="font-display text-2xl font-semibold text-[var(--ink-primary)]"
          >
            9 Foundational Nitnem Baanis
          </h2>
          <span className="text-xs text-[var(--ink-muted)]">
            Isolated sequence for {activePothi.name}
          </span>
        </div>

        <div className="divide-y pothi-divider rounded-2xl border pothi-divider pothi-surface">
          {orderedNitnem.map((baani, idx) => {
            const resolved = resolveBaaniForPothi(activePothiId, baani.id);
            const queued = isBaaniQueued(baani.id);
            return (
              <div
                key={baani.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--surface-subtle)]/40"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-xs text-[var(--ink-muted)]">
                    <span className="font-mono-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true"> · </span>
                    <span>{baani.timeOfDay}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{GRANTH_CATALOG[baani.granthSource].shortName}</span>
                  </p>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3
                      lang="pa"
                      className="font-gurmukhi-noto text-xl font-semibold text-[var(--ink-primary)]"
                    >
                      {baani.nameGurmukhi}
                    </h3>
                    <span className="text-sm font-medium text-[var(--ink-secondary)]">
                      {baani.nameEnglish}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--ink-muted)] max-w-2xl">
                    {resolved?.openingNote ?? baani.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEnqueueBaani(baani, activePothi)}
                    className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[40px]"
                  >
                    {queued ? (
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
                    onClick={() => onOpenBaani(baani.id, activePothiId)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-4 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[40px]"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    Read Baani
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Isolated Sampardai Ardaas */}
      <section
        aria-labelledby="sampardai-ardaas-heading"
        className="rounded-2xl border border-[var(--accent-gold)]/60 pothi-surface p-6 sm:p-8 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-gold)]">
              Isolated Sampardai Ardaas
            </p>
            <h2
              id="sampardai-ardaas-heading"
              className="mt-1 font-display text-2xl font-semibold text-[var(--ink-primary)]"
            >
              {activePothi.ardaas.titleEnglish}
            </h2>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {activePothi.ardaas.maryadaNote}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenArdaas(activePothiId)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[42px] whitespace-nowrap shrink-0"
          >
            Read Full Sampardai Ardaas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="rounded-xl border pothi-divider bg-[var(--surface-subtle)] p-4 space-y-2">
          <p lang="pa" className="font-gurmukhi-noto text-lg leading-relaxed text-[var(--ink-primary)]">
            {ardaasPreviewGurmukhi}
          </p>
          {ardaasPreviewGurmukhi && (
            <p className="text-xs leading-relaxed text-[var(--accent-gold)]">
              {transliterateGurmukhi(ardaasPreviewGurmukhi)}
            </p>
          )}
        </div>
      </section>

      {/* Additional Collections */}
      <section aria-labelledby="additional-collections-heading" className="space-y-4">
        <div>
          <h2
            id="additional-collections-heading"
            className="font-display text-2xl font-semibold text-[var(--ink-primary)]"
          >
            Additional Pothi Collections
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            Sukhmani Sahib, Asa Di Var, Aarti Sahib, and Barah Maha Maajh with isolated {activePothi.name} Manglacharan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalCollections.map((col) => {
            const queued = isBaaniQueued(col.id);
            return (
              <div
                key={col.id}
                className="rounded-xl border pothi-divider pothi-surface p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-[var(--ink-muted)]">
                    {col.timeOfDay} · {GRANTH_CATALOG[col.granthSource].shortName}
                  </p>
                  <p
                    lang="pa"
                    className="mt-1.5 font-gurmukhi-noto text-xl font-semibold text-[var(--ink-primary)]"
                  >
                    {col.nameGurmukhi}
                  </p>
                  <h3 className="text-sm font-medium text-[var(--ink-secondary)]">
                    {col.nameEnglish}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">
                    {col.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t pothi-divider">
                  <button
                    type="button"
                    onClick={() => onEnqueueBaani(col, activePothi)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--accent-gold)] cursor-pointer min-h-[36px]"
                  >
                    {queued ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                        Queued
                      </>
                    ) : (
                      <>
                        <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                        Add to Queue
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenBaani(col.id, activePothiId)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[38px]"
                  >
                    Read Collection
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
