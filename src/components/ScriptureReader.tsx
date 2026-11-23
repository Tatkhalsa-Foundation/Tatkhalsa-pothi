import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Check,
  Layers,
  MonitorPlay,
  Moon,
  SlidersHorizontal,
  Sun,
} from 'lucide-react';
import {
  GRANTH_CATALOG,
  GRANTH_LIST,
  GURBANI_CORPUS,
  getRaagForSggsAng,
} from '../data/gurbaniCorpus';
import type {
  GranthId,
  GurmukhiFont,
  QueueItem,
  ReaderSettings,
  ReaderTarget,
  SehajPaathProgress,
  ThemeMode,
  Tuk,
} from '../types/pothi';
import { getPothiById, resolveBaaniForPothi } from '../utils/pothiState';
import { SanthyaAudioBar } from './SanthyaAudioBar';
import { TukLine } from './TukLine';

interface ScriptureReaderProps {
  target: ReaderTarget;
  onChangeTarget: (next: ReaderTarget) => void;
  sehajProgress: SehajPaathProgress;
  onUpdateSehajAng: (granth: GranthId, ang: number) => void;
  settings: ReaderSettings;
  onUpdateSettings: (patch: Partial<ReaderSettings>) => void;
  queue: QueueItem[];
  onEnqueueCurrent: (item: QueueItem) => void;
  onLaunchPresenterWithItem: (item: QueueItem) => void;
}

export const ScriptureReader: React.FC<ScriptureReaderProps> = ({
  target,
  onChangeTarget,
  sehajProgress,
  onUpdateSehajAng,
  settings,
  onUpdateSettings,
  queue,
  onEnqueueCurrent,
  onLaunchPresenterWithItem,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [angInput, setAngInput] = useState('');

  // Resolve active reading content based on ReaderTarget
  const resolved = useMemo(() => {
    if (target.mode === 'baani') {
      const data = resolveBaaniForPothi(target.pothiId, target.baaniId);
      if (data) {
        const queueItem: QueueItem = {
          id: `baani:${data.pothi.id}:${data.baani.id}`,
          sourceType: 'baani',
          sourceId: data.baani.id,
          titleGurmukhi: data.baani.nameGurmukhi,
          titleEnglish: `${data.baani.nameEnglish} (${data.pothi.name})`,
          subtitle: `${data.pothi.name} · ${data.baani.timeOfDay}`,
          granth: data.baani.granthSource,
          tuks: data.tuks,
        };
        return {
          headingGurmukhi: data.baani.nameGurmukhi,
          headingEnglish: data.baani.nameEnglish,
          metaLine: `${data.pothi.name} · ${data.baani.timeOfDay} · ${GRANTH_CATALOG[data.baani.granthSource].shortName}`,
          maryadaNote: data.openingNote,
          tuks: data.tuks,
          audioLabel: data.baani.audioLabel,
          audioUrl: data.baani.audioUrl,
          queueItem,
          activeGranth: data.baani.granthSource,
          activeAng: null as number | null,
          highlightTukId: undefined as string | undefined,
        };
      }
    }

    if (target.mode === 'ardaas') {
      const pothi = getPothiById(target.pothiId);
      const queueItem: QueueItem = {
        id: `ardaas:${pothi.id}`,
        sourceType: 'baani',
        sourceId: `ardaas-${pothi.id}`,
        titleGurmukhi: pothi.ardaas.titleGurmukhi,
        titleEnglish: pothi.ardaas.titleEnglish,
        subtitle: `${pothi.name} Isolated Ardaas`,
        granth: 'dasam',
        tuks: pothi.ardaas.tuks,
      };
      return {
        headingGurmukhi: pothi.ardaas.titleGurmukhi,
        headingEnglish: pothi.ardaas.titleEnglish,
        metaLine: `${pothi.lineage} · ${pothi.region}`,
        maryadaNote: pothi.ardaas.maryadaNote,
        tuks: pothi.ardaas.tuks,
        audioLabel: `Santhya — ${pothi.ardaas.titleEnglish}`,
        audioUrl: undefined,
        queueItem,
        activeGranth: 'dasam' as GranthId,
        activeAng: null as number | null,
        highlightTukId: undefined as string | undefined,
      };
    }

    if (target.mode === 'shabad') {
      const shabad =
        GURBANI_CORPUS.find((s) => s.id === target.shabadId) ?? GURBANI_CORPUS[0];
      const meta = GRANTH_CATALOG[shabad.granth];
      const queueItem: QueueItem = {
        id: `shabad:${shabad.id}`,
        sourceType: 'shabad',
        sourceId: shabad.id,
        titleGurmukhi: shabad.titleGurmukhi,
        titleEnglish: shabad.titleEnglish,
        subtitle: `${meta.shortName} · ${meta.unitLabel} ${shabad.ang}`,
        granth: shabad.granth,
        ang: shabad.ang,
        tuks: shabad.tuks,
      };
      return {
        headingGurmukhi: shabad.titleGurmukhi,
        headingEnglish: shabad.titleEnglish,
        metaLine: `${meta.shortName} · ${meta.unitLabel} ${shabad.ang} · ${shabad.raag} · ${shabad.author}`,
        maryadaNote: null as string | null,
        tuks: shabad.tuks,
        audioLabel: shabad.audioLabel ?? `Santhya — ${meta.unitLabel} ${shabad.ang}`,
        audioUrl: shabad.audioUrl,
        queueItem,
        activeGranth: shabad.granth,
        activeAng: shabad.ang,
        highlightTukId: target.highlightTukId,
      };
    }

    // Mode: 'ang' (Sehaj Paath Ang-by-Ang) or fallback when Baani ID isn't found
    const granth: GranthId = target.mode === 'ang' ? target.granth : 'sggs';
    const meta = GRANTH_CATALOG[granth];
    const requestedAng = target.mode === 'ang' ? target.ang : 1;
    const ang = Math.max(1, Math.min(meta.maxAng, requestedAng));
    const highlightTukId = target.mode === 'ang' ? target.highlightTukId : undefined;
    const matchingShabads = GURBANI_CORPUS.filter(
      (s) => s.granth === granth && s.ang === ang,
    );

    if (matchingShabads.length > 0) {
      const combinedTuks: Tuk[] = matchingShabads.flatMap((s) => s.tuks);
      const first = matchingShabads[0];
      const queueItem: QueueItem = {
        id: `shabad:${first.id}`,
        sourceType: 'shabad',
        sourceId: first.id,
        titleGurmukhi: first.titleGurmukhi,
        titleEnglish: first.titleEnglish,
        subtitle: `${meta.shortName} · ${meta.unitLabel} ${ang}`,
        granth,
        ang,
        tuks: combinedTuks,
      };
      return {
        headingGurmukhi: first.titleGurmukhi,
        headingEnglish: `${meta.shortName} — ${meta.unitLabel} ${ang}`,
        metaLine: `${meta.shortName} · ${meta.unitLabel} ${ang} of ${meta.maxAng} · ${first.raag} · ${first.author}`,
        maryadaNote: null as string | null,
        tuks: combinedTuks,
        audioLabel: first.audioLabel ?? `Santhya — ${meta.shortName} ${meta.unitLabel} ${ang}`,
        audioUrl: first.audioUrl,
        queueItem,
        activeGranth: granth,
        activeAng: ang,
        highlightTukId,
      };
    }

    // Intermediate Ang within full 1..maxAng Sehaj Paath range
    const sggsSection = granth === 'sggs' ? getRaagForSggsAng(ang) : null;
    return {
      headingGurmukhi: sggsSection ? sggsSection.gurmukhi : meta.gurmukhiName,
      headingEnglish: `${meta.shortName} — ${meta.unitLabel} ${ang}`,
      metaLine: sggsSection
        ? `${meta.shortName} · Ang ${ang} of ${meta.maxAng} · ${sggsSection.raag}`
        : `${meta.shortName} · ${meta.unitLabel} ${ang} of ${meta.maxAng}`,
      maryadaNote: null as string | null,
      tuks: [] as Tuk[],
      audioLabel: `Santhya — ${meta.shortName} ${meta.unitLabel} ${ang}`,
      audioUrl: undefined,
      queueItem: null as QueueItem | null,
      activeGranth: granth,
      activeAng: ang,
      highlightTukId: undefined as string | undefined,
    };
  }, [target]);

  const landmarkAngsForGranth = useMemo(() => {
    const granth = resolved.activeGranth;
    return Array.from(
      new Set(
        GURBANI_CORPUS.filter((s) => s.granth === granth).map((s) => s.ang),
      ),
    ).sort((a, b) => a - b);
  }, [resolved.activeGranth]);

  const isQueued = resolved.queueItem
    ? queue.some((q) => q.id === resolved.queueItem?.id)
    : false;

  const handleSelectGranth = (granth: GranthId) => {
    const savedAng = sehajProgress[granth] ?? 1;
    onChangeTarget({ mode: 'ang', granth, ang: savedAng });
  };

  const handleStepAng = (delta: number) => {
    const granth = resolved.activeGranth;
    const current = resolved.activeAng ?? sehajProgress[granth] ?? 1;
    const meta = GRANTH_CATALOG[granth];
    const next = Math.max(1, Math.min(meta.maxAng, current + delta));
    onUpdateSehajAng(granth, next);
    onChangeTarget({ mode: 'ang', granth, ang: next });
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const granth = resolved.activeGranth;
    const meta = GRANTH_CATALOG[granth];
    const num = Number.parseInt(angInput.trim(), 10);
    if (!Number.isNaN(num) && num >= 1 && num <= meta.maxAng) {
      onUpdateSehajAng(granth, num);
      onChangeTarget({ mode: 'ang', granth, ang: num });
      setAngInput('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 md:py-9 space-y-6">
      {/* Granth Switcher & Independent Sehaj Paath Ang Stepper */}
      <section
        aria-label="Sehaj Paath Granth and Ang Navigation"
        className="rounded-2xl border pothi-divider pothi-surface p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Select Granth for Sehaj Paath"
            className="flex flex-wrap items-center gap-1.5"
          >
            {GRANTH_LIST.map((g) => {
              const active = resolved.activeGranth === g.id && target.mode === 'ang';
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectGranth(g.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer min-h-[36px] ${
                    active
                      ? 'bg-[var(--accent-navy)] text-white dark:text-[#0c1220]'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {g.shortName.replace('Sri ', '').replace(' Sahib Ji', '')}{' '}
                  <span className="font-mono-nums opacity-80">
                    ({sehajProgress[g.id]})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowControls((v) => !v)}
            aria-expanded={showControls}
            className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)] cursor-pointer min-h-[36px] whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            {showControls ? 'Hide Controls' : 'Reading Controls'}
          </button>
        </div>

        {/* Ang Stepper + Direct Jump */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t pothi-divider">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepAng(-1)}
              disabled={(resolved.activeAng ?? sehajProgress[resolved.activeGranth]) <= 1}
              className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] disabled:opacity-35 cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Prev {GRANTH_CATALOG[resolved.activeGranth].unitLabel}
            </button>
            <span className="px-2 text-xs font-mono-nums font-semibold text-[var(--ink-primary)]">
              {GRANTH_CATALOG[resolved.activeGranth].unitLabel}{' '}
              {resolved.activeAng ?? sehajProgress[resolved.activeGranth]} /{' '}
              {GRANTH_CATALOG[resolved.activeGranth].maxAng}
            </span>
            <button
              type="button"
              onClick={() => handleStepAng(1)}
              disabled={
                (resolved.activeAng ?? sehajProgress[resolved.activeGranth]) >=
                GRANTH_CATALOG[resolved.activeGranth].maxAng
              }
              className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:bg-[var(--surface-subtle)] disabled:opacity-35 cursor-pointer min-h-[40px]"
            >
              Next {GRANTH_CATALOG[resolved.activeGranth].unitLabel}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
            <label htmlFor="reader-ang-jump" className="sr-only">
              Jump to Ang number
            </label>
            <input
              id="reader-ang-jump"
              type="number"
              min={1}
              max={GRANTH_CATALOG[resolved.activeGranth].maxAng}
              value={angInput}
              onChange={(e) => setAngInput(e.target.value)}
              placeholder={`Go to ${GRANTH_CATALOG[resolved.activeGranth].unitLabel}...`}
              className="w-28 rounded-lg border pothi-divider bg-[var(--surface-canvas)] px-2.5 py-2 text-xs font-mono-nums text-[var(--ink-primary)] min-h-[38px]"
            />
            <button
              type="submit"
              className="rounded-lg border pothi-divider bg-[var(--surface-subtle)] px-3 py-2 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] cursor-pointer min-h-[38px]"
            >
              Go
            </button>
          </form>
        </div>

        {/* Indexed Landmark Ang Quick Shortcuts */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[var(--ink-muted)] mr-1">
            Indexed {GRANTH_CATALOG[resolved.activeGranth].unitLabel}s:
          </span>
          {landmarkAngsForGranth.map((angNum) => {
            const isCurrent =
              target.mode === 'ang' &&
              resolved.activeAng === angNum;
            return (
              <button
                key={angNum}
                type="button"
                onClick={() => {
                  onUpdateSehajAng(resolved.activeGranth, angNum);
                  onChangeTarget({
                    mode: 'ang',
                    granth: resolved.activeGranth,
                    ang: angNum,
                  });
                }}
                className={`rounded-md px-2.5 py-1 font-mono-nums transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--accent-gold)] text-white font-semibold'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                }`}
              >
                {angNum}
              </button>
            );
          })}
        </div>
      </section>

      {/* Typography, Larivaar, Vishraam, Translations & Theme Controls */}
      {showControls && (
        <section
          aria-label="Reading Typography and Display Controls"
          className="rounded-2xl border pothi-divider pothi-surface p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              aria-pressed={settings.larivaar}
              onClick={() => onUpdateSettings({ larivaar: !settings.larivaar })}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                settings.larivaar
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Larivaar: {settings.larivaar ? 'On' : 'Off'}
            </button>

            <button
              type="button"
              aria-pressed={settings.vishraam}
              onClick={() => onUpdateSettings({ vishraam: !settings.vishraam })}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                settings.vishraam
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Vishraam: {settings.vishraam ? 'On' : 'Off'}
            </button>

            <button
              type="button"
              aria-pressed={settings.showTransliteration}
              onClick={() =>
                onUpdateSettings({
                  showTransliteration: !settings.showTransliteration,
                })
              }
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                settings.showTransliteration
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Transliteration
            </button>

            <button
              type="button"
              aria-pressed={settings.showEnglish}
              onClick={() =>
                onUpdateSettings({ showEnglish: !settings.showEnglish })
              }
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                settings.showEnglish
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              English
            </button>

            <button
              type="button"
              aria-pressed={settings.showTeeka}
              onClick={() =>
                onUpdateSettings({ showTeeka: !settings.showTeeka })
              }
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
                settings.showTeeka
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              Teeka / Arth
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t pothi-divider items-center">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3">
              <label
                htmlFor="gurmukhi-font-size"
                className="text-xs font-medium text-[var(--ink-secondary)] whitespace-nowrap"
              >
                Size ({settings.fontSize}px)
              </label>
              <input
                id="gurmukhi-font-size"
                type="range"
                min={18}
                max={48}
                step={2}
                value={settings.fontSize}
                onChange={(e) =>
                  onUpdateSettings({ fontSize: Number(e.target.value) })
                }
                className="w-full accent-[var(--accent-gold)] cursor-pointer"
              />
            </div>

            {/* Gurmukhi Font Selector */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="gurmukhi-font-family"
                className="text-xs font-medium text-[var(--ink-secondary)] whitespace-nowrap"
              >
                Font
              </label>
              <select
                id="gurmukhi-font-family"
                value={settings.gurmukhiFont}
                onChange={(e) =>
                  onUpdateSettings({
                    gurmukhiFont: e.target.value as GurmukhiFont,
                  })
                }
                className="flex-1 rounded-lg border pothi-divider bg-[var(--surface-canvas)] px-2.5 py-1.5 text-xs font-medium text-[var(--ink-primary)] min-h-[36px]"
              >
                <option value="Noto Sans Gurmukhi">Noto Sans Gurmukhi</option>
                <option value="GurbaniAkharThick">GurbaniAkharThick</option>
              </select>
            </div>

            {/* Theme Selector */}
            <div
              className="flex items-center justify-end gap-1 rounded-lg border pothi-divider bg-[var(--surface-subtle)] p-1"
              role="group"
              aria-label="Reader theme"
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
                    aria-pressed={active}
                    onClick={() => onUpdateSettings({ theme: t.id as ThemeMode })}
                    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
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

          {settings.vishraam && (
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--ink-muted)] pt-2 border-t pothi-divider">
              <span>Vishraam Key:</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="vishraam-primary font-gurmukhi-noto text-sm">ਠਹਿਰਾਉ</span>
                <span>Primary Heavy Pause (solid underline)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="vishraam-secondary font-gurmukhi-noto text-sm">ਲਘੂ</span>
                <span>Secondary Light Pause (dashed underline)</span>
              </span>
            </div>
          )}
        </section>
      )}

      {/* Santhya Audio Bar */}
      <SanthyaAudioBar
        trackLabel={resolved.audioLabel}
        initialAudioUrl={resolved.audioUrl}
      />

      {/* Main Scripture Reading Surface */}
      <article className="rounded-2xl border pothi-divider pothi-surface p-6 sm:p-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b pothi-divider">
          <div className="space-y-1.5">
            <p className="text-xs text-[var(--ink-muted)]">{resolved.metaLine}</p>
            <h1
              lang="pa"
              className="font-gurmukhi-noto text-2xl sm:text-3xl font-semibold text-[var(--ink-primary)]"
            >
              {resolved.headingGurmukhi}
            </h1>
            <p className="text-sm font-medium text-[var(--ink-secondary)]">
              {resolved.headingEnglish}
            </p>
          </div>

          {resolved.queueItem && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onEnqueueCurrent(resolved.queueItem!)}
                className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3.5 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[40px] whitespace-nowrap"
              >
                {isQueued ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[var(--accent-gold)]" aria-hidden="true" />
                    In Queue
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
                onClick={() => onLaunchPresenterWithItem(resolved.queueItem!)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[40px] whitespace-nowrap"
              >
                <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
                Present
              </button>
            </div>
          )}
        </header>

        {resolved.maryadaNote && (
          <div className="rounded-xl border pothi-divider bg-[var(--surface-subtle)] px-4 py-3 text-xs leading-relaxed text-[var(--ink-secondary)]">
            <strong className="font-semibold text-[var(--ink-primary)] mr-1.5">
              Maryada Note:
            </strong>
            {resolved.maryadaNote}
          </div>
        )}

        {resolved.tuks.length > 0 ? (
          <div className="divide-y pothi-divider">
            {resolved.tuks.map((tuk) => (
              <TukLine
                key={tuk.id}
                tuk={tuk}
                larivaar={settings.larivaar}
                vishraam={settings.vishraam}
                showTransliteration={settings.showTransliteration}
                showEnglish={settings.showEnglish}
                showTeeka={settings.showTeeka}
                fontSize={settings.fontSize}
                gurmukhiFont={settings.gurmukhiFont}
                highlighted={resolved.highlightTukId === tuk.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center space-y-4">
            <p className="font-display text-xl font-medium text-[var(--ink-primary)]">
              Sehaj Paath Bookmark Saved at {GRANTH_CATALOG[resolved.activeGranth].unitLabel}{' '}
              {resolved.activeAng}
            </p>
            <p className="text-sm text-[var(--ink-muted)] max-w-lg mx-auto">
              Your independent Sehaj Paath bookmark for{' '}
              <strong>{GRANTH_CATALOG[resolved.activeGranth].fullName}</strong> is saved locally at{' '}
              {GRANTH_CATALOG[resolved.activeGranth].unitLabel} {resolved.activeAng}. Select an indexed landmark{' '}
              {GRANTH_CATALOG[resolved.activeGranth].unitLabel} below to read full bundled Gurmukhi Tuks with Vishraam and Teeka.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {landmarkAngsForGranth.map((angNum) => (
                <button
                  key={angNum}
                  type="button"
                  onClick={() => {
                    onUpdateSehajAng(resolved.activeGranth, angNum);
                    onChangeTarget({
                      mode: 'ang',
                      granth: resolved.activeGranth,
                      ang: angNum,
                    });
                  }}
                  className="rounded-lg border pothi-divider bg-[var(--surface-subtle)] px-3.5 py-2 text-xs font-mono-nums font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] cursor-pointer"
                >
                  Open {GRANTH_CATALOG[resolved.activeGranth].unitLabel} {angNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
