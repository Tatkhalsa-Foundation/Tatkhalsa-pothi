import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Radio,
  X,
} from 'lucide-react';
import { GURBANI_CORPUS, TODAYS_HUKAMNAMA_ID } from '../data/gurbaniCorpus';
import type { QueueItem, ReaderSettings } from '../types/pothi';
import { toLarivaar, transliterateGurmukhi } from '../utils/gurbaniSearch';
import {
  createPresenterSyncClient,
  type ProjectionPalette,
} from '../utils/pothiPresenterSync';

interface PresenterModeProps {
  queue: QueueItem[];
  initialQueueIndex: number;
  settings: ReaderSettings;
  onUpdateSettings: (patch: Partial<ReaderSettings>) => void;
  onExit: () => void;
}

export const PresenterMode: React.FC<PresenterModeProps> = ({
  queue,
  initialQueueIndex,
  settings,
  onUpdateSettings,
  onExit,
}) => {
  const effectiveItems = useMemo<QueueItem[]>(() => {
    if (queue.length > 0) return queue;
    const hukam =
      GURBANI_CORPUS.find((s) => s.id === TODAYS_HUKAMNAMA_ID) ?? GURBANI_CORPUS[0];
    return [
      {
        id: `shabad:${hukam.id}`,
        sourceType: 'shabad',
        sourceId: hukam.id,
        titleGurmukhi: hukam.titleGurmukhi,
        titleEnglish: hukam.titleEnglish,
        subtitle: `Sri Guru Granth Sahib Ji · Ang ${hukam.ang} · ${hukam.raag}`,
        granth: hukam.granth,
        ang: hukam.ang,
        tuks: hukam.tuks,
      },
    ];
  }, [queue]);

  const [itemIndex, setItemIndex] = useState(
    Math.min(initialQueueIndex, Math.max(0, effectiveItems.length - 1)),
  );
  const [tukIndex, setTukIndex] = useState(0);
  const [palette, setPalette] = useState<ProjectionPalette>('navy');
  const [blackout, setBlackout] = useState(false);
  const [fontScale, setFontScale] = useState(52);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [syncLinked, setSyncLinked] = useState(false);

  const syncClientRef = useRef<ReturnType<typeof createPresenterSyncClient> | null>(null);
  const applyingRemoteRef = useRef(false);

  const activeItem = effectiveItems[itemIndex] ?? effectiveItems[0];
  const activeTuk = activeItem.tuks[tukIndex] ?? activeItem.tuks[0];

  // Cross-tab / multi-window presenter sync
  useEffect(() => {
    const client = createPresenterSyncClient((payload) => {
      applyingRemoteRef.current = true;
      setSyncLinked(true);
      const boundedItem = Math.max(
        0,
        Math.min(effectiveItems.length - 1, payload.itemIndex),
      );
      const targetItem = effectiveItems[boundedItem] ?? effectiveItems[0];
      const boundedTuk = Math.max(
        0,
        Math.min(Math.max(0, targetItem.tuks.length - 1), payload.tukIndex),
      );
      setItemIndex(boundedItem);
      setTukIndex(boundedTuk);
      setPalette(payload.palette);
      setBlackout(payload.blackout);
      setFontScale(payload.fontScale);
      onUpdateSettings({
        larivaar: payload.larivaar,
        showTransliteration: payload.showTransliteration,
      });
      window.setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    });
    syncClientRef.current = client;
    return () => {
      client.dispose();
      syncClientRef.current = null;
    };
  }, [effectiveItems, onUpdateSettings]);

  // Broadcast state changes to companion projector tabs
  useEffect(() => {
    if (applyingRemoteRef.current) return;
    syncClientRef.current?.publish({
      itemIndex,
      tukIndex,
      palette,
      blackout,
      fontScale,
      larivaar: settings.larivaar,
      showTransliteration: settings.showTransliteration,
    });
  }, [
    itemIndex,
    tukIndex,
    palette,
    blackout,
    fontScale,
    settings.larivaar,
    settings.showTransliteration,
  ]);

  const goNext = useCallback(() => {
    if (tukIndex < activeItem.tuks.length - 1) {
      setTukIndex((t) => t + 1);
    } else if (itemIndex < effectiveItems.length - 1) {
      setItemIndex((i) => i + 1);
      setTukIndex(0);
    }
  }, [tukIndex, activeItem.tuks.length, itemIndex, effectiveItems.length]);

  const goPrev = useCallback(() => {
    if (tukIndex > 0) {
      setTukIndex((t) => t - 1);
    } else if (itemIndex > 0) {
      const prevItem = effectiveItems[itemIndex - 1];
      setItemIndex((i) => i - 1);
      setTukIndex(Math.max(0, prevItem.tuks.length - 1));
    }
  }, [tukIndex, itemIndex, effectiveItems]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen may be restricted inside iframes
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'b' || e.key === 'B') {
        setBlackout((v) => !v);
      } else if (e.key === 'l' || e.key === 'L') {
        onUpdateSettings({ larivaar: !settings.larivaar });
      } else if (e.key === 't' || e.key === 'T') {
        onUpdateSettings({ showTransliteration: !settings.showTransliteration });
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        void toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (blackout) {
          setBlackout(false);
        } else {
          onExit();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    goNext,
    goPrev,
    blackout,
    onExit,
    onUpdateSettings,
    settings.larivaar,
    settings.showTransliteration,
    toggleFullscreen,
  ]);

  const paletteClasses =
    palette === 'obsidian'
      ? 'bg-[#08090c] text-[#f5efe2]'
      : palette === 'parchment'
        ? 'bg-[#FAF5E8] text-[#1E1710]'
        : 'bg-[#0B1220] text-[#FAF5E8]';

  const subtleBarClasses =
    palette === 'parchment'
      ? 'border-[#d6cab2] bg-[#FAF5E8]/95 text-[#2c2116]'
      : 'border-white/12 bg-black/45 text-slate-200';

  const goldAccent = palette === 'parchment' ? 'text-[#9a600c]' : 'text-[#D4AF37]';

  const phoneticRoman = activeTuk ? transliterateGurmukhi(activeTuk.gurmukhi) : '';

  return (
    <div
      data-testid="presenter-stage"
      className={`fixed inset-0 z-50 flex flex-col justify-between transition-colors ${paletteClasses}`}
    >
      {/* Top Quiet Projection Header */}
      <header className="flex items-center justify-between gap-4 px-6 py-4 opacity-90">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-xs font-medium tracking-wider uppercase ${goldAccent}`}>
              Tatkhalsa Pothi Sahib · Presenter Mode
            </p>
            <span
              className="inline-flex items-center gap-1 text-[11px] opacity-75"
              title="Open /pothi-present in another browser window to mirror slides live"
            >
              <Radio
                className={`h-3 w-3 ${syncLinked ? 'text-emerald-400' : ''}`}
                aria-hidden="true"
              />
              {syncLinked ? 'Tab Synced' : 'Multi-Tab Sync Ready'}
            </span>
          </div>
          <p className="text-xs opacity-75 truncate mt-0.5">
            {activeItem.subtitle} · {activeItem.titleEnglish}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {effectiveItems.length > 1 && (
            <select
              aria-label="Select queued Shabad to project"
              value={itemIndex}
              onChange={(e) => {
                setItemIndex(Number(e.target.value));
                setTukIndex(0);
              }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium min-h-[38px] ${
                palette === 'parchment'
                  ? 'border-[#cfc2a8] bg-white text-[#241b12]'
                  : 'border-white/15 bg-white/10 text-white'
              }`}
            >
              {effectiveItems.map((it, idx) => (
                <option key={it.id} value={idx} className="text-slate-900">
                  {idx + 1}. {it.titleEnglish}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={onExit}
            aria-label="Exit Presenter Mode"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer min-h-[38px] ${
              palette === 'parchment'
                ? 'border-[#cfc2a8] bg-white text-[#241b12] hover:bg-[#efe6d5]'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Exit
          </button>
        </div>
      </header>

      {/* Center Projection Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-14 lg:px-24 text-center overflow-y-auto">
        {blackout ? (
          <div className="space-y-3 opacity-60">
            <p className="text-sm">Screen Blackout Active</p>
            <button
              type="button"
              onClick={() => setBlackout(false)}
              className="rounded-lg border border-white/25 px-4 py-2 text-xs font-medium cursor-pointer"
            >
              Resume Display (B)
            </button>
          </div>
        ) : activeTuk ? (
          <div className="max-w-5xl space-y-6 py-4">
            <p
              lang="pa"
              data-testid="presenter-gurmukhi"
              className={`font-gurmukhi-noto leading-[1.65] break-words ${settings.larivaar ? 'larivaar-mode' : ''}`}
              style={{ fontSize: `${fontScale}px` }}
            >
              {settings.larivaar ? toLarivaar(activeTuk.gurmukhi) : activeTuk.gurmukhi}
            </p>

            {settings.showTransliteration && phoneticRoman && (
              <p className={`text-lg sm:text-2xl leading-relaxed ${goldAccent}`}>
                {phoneticRoman}
              </p>
            )}

            {activeTuk.inHouseTranslation && (
              <p className="text-base sm:text-xl leading-relaxed opacity-90 max-w-4xl mx-auto">
                {activeTuk.inHouseTranslation}
              </p>
            )}
          </div>
        ) : null}
      </main>

      {/* Bottom Projection Control Dock */}
      <footer className={`border-t backdrop-blur-md px-4 sm:px-6 py-3 ${subtleBarClasses}`}>
        <div className="mx-auto max-w-6xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Tuk Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                disabled={tukIndex === 0 && itemIndex === 0}
                aria-label="Previous Tuk"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-current/20 hover:bg-current/10 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <span
                data-testid="presenter-counter"
                className="px-2 text-xs font-mono-nums font-medium"
              >
                Tuk {tukIndex + 1} / {activeItem.tuks.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={
                  tukIndex >= activeItem.tuks.length - 1 &&
                  itemIndex >= effectiveItems.length - 1
                }
                aria-label="Next Tuk"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-current/20 hover:bg-current/10 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Display Toggles */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={settings.larivaar}
                onClick={() => onUpdateSettings({ larivaar: !settings.larivaar })}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                  settings.larivaar ? 'border-[#D4AF37] bg-[#D4AF37]/20' : 'border-current/20'
                }`}
              >
                Larivaar (L)
              </button>
              <button
                type="button"
                aria-pressed={settings.showTransliteration}
                onClick={() =>
                  onUpdateSettings({ showTransliteration: !settings.showTransliteration })
                }
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium cursor-pointer ${
                  settings.showTransliteration
                    ? 'border-[#D4AF37] bg-[#D4AF37]/20'
                    : 'border-current/20'
                }`}
              >
                Phonetic (T)
              </button>

              <div className="flex items-center gap-1 ml-1">
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.max(28, s - 4))}
                  aria-label="Decrease projection font size"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-current/20 hover:bg-current/10 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="text-xs font-mono-nums w-10 text-center">
                  {fontScale}
                </span>
                <button
                  type="button"
                  onClick={() => setFontScale((s) => Math.min(84, s + 4))}
                  aria-label="Increase projection font size"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-current/20 hover:bg-current/10 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Palette & Screen Actions */}
            <div className="flex items-center gap-1.5">
              {(['navy', 'obsidian', 'parchment'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={palette === p}
                  onClick={() => setPalette(p)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs capitalize cursor-pointer ${
                    palette === p
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 font-semibold'
                      : 'border-current/20'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setBlackout((v) => !v)}
                aria-pressed={blackout}
                aria-label="Toggle screen blackout (B)"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border cursor-pointer ${
                  blackout ? 'border-[#D4AF37] bg-[#D4AF37]/25' : 'border-current/20'
                }`}
              >
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-current/20 hover:bg-current/10 cursor-pointer"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <p className="hidden sm:block text-[11px] opacity-60 text-center">
            Shortcuts: ← / → Next &amp; Previous Tuk · L Larivaar · T Phonetic · F Fullscreen · B Blackout · Esc Exit
          </p>
        </div>
      </footer>
    </div>
  );
};
