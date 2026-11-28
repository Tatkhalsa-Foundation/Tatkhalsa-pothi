import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { HomeVault } from './components/HomeVault';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/PWAInstallButton';
import { GRANTH_CATALOG, GURBANI_CORPUS } from './data/gurbaniCorpus';
import type {
  AppRoute,
  BaaniCollection,
  BookmarkItem,
  GranthId,
  HistoryEntry,
  QueueItem,
  ReaderSettings,
  ReaderTarget,
  SampardaiPothi,
  SehajPaathProgress,
  Shabad,
  ThemeMode,
} from './types/pothi';
import {
  DEFAULT_READER_SETTINGS,
  DEFAULT_SEHAJ_PROGRESS,
  enqueueQueueItem,
  getPothiById,
  moveQueueItem,
  recordHistoryEntry,
  removeBookmark,
  removeQueueItem,
  resolveBaaniForPothi,
  toggleBookmark,
  updateGranthAng,
} from './utils/pothiState';

const GurbaniSearcher = lazy(() =>
  import('./components/GurbaniSearcher').then((m) => ({ default: m.GurbaniSearcher })),
);
const SundarGutka = lazy(() =>
  import('./components/SundarGutka').then((m) => ({ default: m.SundarGutka })),
);
const ScriptureReader = lazy(() =>
  import('./components/ScriptureReader').then((m) => ({ default: m.ScriptureReader })),
);
const PresenterMode = lazy(() =>
  import('./components/PresenterMode').then((m) => ({ default: m.PresenterMode })),
);
const QueueDrawer = lazy(() =>
  import('./components/QueueDrawer').then((m) => ({ default: m.QueueDrawer })),
);

const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-[var(--ink-muted)]"
  >
    Opening Pothi Sahib view…
  </div>
);

const STORAGE_KEYS = {
  pothiId: 'tatkhalsa.pothi.activePothiId',
  sehaj: 'tatkhalsa.pothi.sehajProgress',
  settings: 'tatkhalsa.pothi.readerSettings',
  queue: 'tatkhalsa.pothi.queue',
  bookmarks: 'tatkhalsa.pothi.bookmarks',
  history: 'tatkhalsa.pothi.history',
  lastTarget: 'tatkhalsa.pothi.lastReaderTarget',
} as const;

function normalizeRoute(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/pothi' || clean.startsWith('/pothi/')) {
    return '/';
  }
  switch (clean) {
    case '/':
      return '/';
    case '/searcher':
      return '/searcher';
    case '/gurbani':
      return '/gurbani';
    case '/gutka':
      return '/gutka';
    case '/reader':
      return '/reader';
    case '/pothi-present':
      return '/pothi-present';
    default:
      return '/';
  }
}

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function readStoredArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readStoredTarget(fallback: ReaderTarget): ReaderTarget {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.lastTarget);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as ReaderTarget;
    if (
      parsed &&
      (parsed.mode === 'ang' ||
        parsed.mode === 'shabad' ||
        parsed.mode === 'baani' ||
        parsed.mode === 'ardaas')
    ) {
      return parsed;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(() =>
    normalizeRoute(window.location.pathname),
  );
  const [activePothiId, setActivePothiId] = useState<string>(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.pothiId) || 'buddha-dal';
    } catch {
      return 'buddha-dal';
    }
  });
  const [sehajProgress, setSehajProgress] = useState<SehajPaathProgress>(() =>
    readStoredJson(STORAGE_KEYS.sehaj, DEFAULT_SEHAJ_PROGRESS),
  );
  const [settings, setSettings] = useState<ReaderSettings>(() =>
    readStoredJson(STORAGE_KEYS.settings, DEFAULT_READER_SETTINGS),
  );
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    readStoredArray<QueueItem>(STORAGE_KEYS.queue, []),
  );
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    readStoredArray<BookmarkItem>(STORAGE_KEYS.bookmarks, []),
  );
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    readStoredArray<HistoryEntry>(STORAGE_KEYS.history, []),
  );
  const [readerTarget, setReaderTarget] = useState<ReaderTarget>(() =>
    readStoredTarget({
      mode: 'ang',
      granth: 'sggs',
      ang: readStoredJson(STORAGE_KEYS.sehaj, DEFAULT_SEHAJ_PROGRESS).sggs,
    }),
  );
  const [queueOpen, setQueueOpen] = useState(false);
  const [presenterStartIndex, setPresenterStartIndex] = useState(0);

  // Consolidate legacy /pothi paths to / cleanly in the address bar
  useEffect(() => {
    const clean = window.location.pathname.replace(/\/+$/, '') || '/';
    if (clean === '/pothi' || clean.startsWith('/pothi/')) {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Accidental Reload / Exit Guard during active Paath
  useEffect(() => {
    if (route !== '/reader' || !settings.paathExitGuard) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [route, settings.paathExitGuard]);

  // Sync HTML root theme classes (Light / Warm Parchment / Dark Night)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-parchment');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'parchment') {
      root.classList.add('theme-parchment');
    }
  }, [settings.theme]);

  // Persist states cleanly to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.pothiId, activePothiId);
    } catch {
      // ignore storage quota errors
    }
  }, [activePothiId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.sehaj,
        JSON.stringify(sehajProgress),
      );
    } catch {
      // ignore
    }
  }, [sehajProgress]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(settings),
      );
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(queue));
    } catch {
      // ignore
    }
  }, [queue]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.bookmarks,
        JSON.stringify(bookmarks),
      );
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.history,
        JSON.stringify(history),
      );
    } catch {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.lastTarget,
        JSON.stringify(readerTarget),
      );
    } catch {
      // ignore
    }
  }, [readerTarget]);

  // Browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizeRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleUpdateSettings = useCallback((patch: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleChangeTheme = useCallback((theme: ThemeMode) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const handleUpdateSehajAng = useCallback((granth: GranthId, ang: number) => {
    setSehajProgress((prev) => updateGranthAng(prev, granth, ang));
  }, []);

  const handleToggleBookmark = useCallback(
    (candidate: Omit<BookmarkItem, 'savedAt'>) => {
      setBookmarks((prev) => toggleBookmark(prev, candidate));
    },
    [],
  );

  const handleRemoveBookmark = useCallback((id: string) => {
    setBookmarks((prev) => removeBookmark(prev, id));
  }, []);

  const handleOpenAng = useCallback(
    (granth: GranthId, ang: number) => {
      const meta = GRANTH_CATALOG[granth];
      const safeAng = Math.max(1, Math.min(meta.maxAng, Math.floor(ang)));
      setSehajProgress((prev) => updateGranthAng(prev, granth, safeAng));
      setReaderTarget({ mode: 'ang', granth, ang: safeAng });
      setHistory((prev) =>
        recordHistoryEntry(prev, {
          id: `ang:${granth}:${safeAng}`,
          kind: 'ang',
          titleGurmukhi: meta.gurmukhiName,
          titleEnglish: `${meta.shortName} — ${meta.unitLabel} ${safeAng}`,
          subtitle: `${meta.shortName} · ${meta.unitLabel} ${safeAng} of ${meta.maxAng}`,
          granth,
          ang: safeAng,
        }),
      );
      navigate('/reader');
    },
    [navigate],
  );

  const handleOpenShabad = useCallback(
    (shabadId: string, highlightTukId?: string) => {
      const recordShabadHistory = (found: Shabad) => {
        const meta = GRANTH_CATALOG[found.granth];
        setHistory((prev) =>
          recordHistoryEntry(prev, {
            id: `shabad:${found.id}`,
            kind: 'shabad',
            titleGurmukhi: found.titleGurmukhi,
            titleEnglish: found.titleEnglish,
            subtitle: `${meta.shortName} · ${meta.unitLabel} ${found.ang} · ${found.raag}`,
            granth: found.granth,
            ang: found.ang,
            shabadId: found.id,
          }),
        );
      };

      const found = GURBANI_CORPUS.find((s) => s.id === shabadId);
      if (found) {
        recordShabadHistory(found);
      } else {
        import('./data/fullSearchCorpus')
          .then(({ FULL_SEARCH_CORPUS }) => {
            const match = FULL_SEARCH_CORPUS.find((s) => s.id === shabadId);
            if (match) recordShabadHistory(match);
          })
          .catch(() => {});
      }
      setReaderTarget({ mode: 'shabad', shabadId, highlightTukId });
      navigate('/reader');
    },
    [navigate],
  );

  const handleOpenBaani = useCallback(
    (baaniId: string, pothiId?: string) => {
      const resolvedPothiId = pothiId ?? activePothiId;
      setActivePothiId(resolvedPothiId);
      const resolved = resolveBaaniForPothi(resolvedPothiId, baaniId);
      if (resolved) {
        setHistory((prev) =>
          recordHistoryEntry(prev, {
            id: `baani:${resolved.pothi.id}:${resolved.baani.id}`,
            kind: 'baani',
            titleGurmukhi: resolved.baani.nameGurmukhi,
            titleEnglish: resolved.baani.nameEnglish,
            subtitle: `${resolved.pothi.name} · ${resolved.baani.timeOfDay}`,
            granth: resolved.baani.granthSource,
            baaniId: resolved.baani.id,
            pothiId: resolved.pothi.id,
          }),
        );
      }
      setReaderTarget({ mode: 'baani', baaniId, pothiId: resolvedPothiId });
      navigate('/reader');
    },
    [activePothiId, navigate],
  );

  const handleOpenArdaas = useCallback(
    (pothiId: string) => {
      setActivePothiId(pothiId);
      const pothi = getPothiById(pothiId);
      setHistory((prev) =>
        recordHistoryEntry(prev, {
          id: `ardaas:${pothi.id}`,
          kind: 'ardaas',
          titleGurmukhi: pothi.ardaas.titleGurmukhi,
          titleEnglish: pothi.ardaas.titleEnglish,
          subtitle: `${pothi.name} · Sampardai Ardaas`,
          granth: 'dasam',
          pothiId: pothi.id,
        }),
      );
      setReaderTarget({ mode: 'ardaas', pothiId });
      navigate('/reader');
    },
    [navigate],
  );

  const handleOpenSavedItem = useCallback(
    (item: Pick<BookmarkItem, 'kind' | 'granth' | 'ang' | 'shabadId' | 'baaniId' | 'pothiId'>) => {
      if (item.kind === 'baani' && item.baaniId) {
        handleOpenBaani(item.baaniId, item.pothiId);
      } else if (item.kind === 'ardaas' && item.pothiId) {
        handleOpenArdaas(item.pothiId);
      } else if (item.kind === 'shabad' && item.shabadId) {
        handleOpenShabad(item.shabadId);
      } else if (item.granth && item.ang) {
        handleOpenAng(item.granth, item.ang);
      }
    },
    [handleOpenAng, handleOpenArdaas, handleOpenBaani, handleOpenShabad],
  );

  const handleEnqueueShabad = useCallback((shabad: Shabad) => {
    const meta = GRANTH_CATALOG[shabad.granth];
    const item: QueueItem = {
      id: `shabad:${shabad.id}`,
      sourceType: 'shabad',
      sourceId: shabad.id,
      titleGurmukhi: shabad.titleGurmukhi,
      titleEnglish: shabad.titleEnglish,
      subtitle: `${meta.shortName} · ${meta.unitLabel} ${shabad.ang} · ${shabad.raag}`,
      granth: shabad.granth,
      ang: shabad.ang,
      tuks: shabad.tuks,
    };
    setQueue((prev) => enqueueQueueItem(prev, item));
  }, []);

  const handleEnqueueBaani = useCallback(
    (baani: BaaniCollection, pothi: SampardaiPothi) => {
      const resolved = resolveBaaniForPothi(pothi.id, baani.id);
      if (!resolved) return;
      const item: QueueItem = {
        id: `baani:${pothi.id}:${baani.id}`,
        sourceType: 'baani',
        sourceId: baani.id,
        titleGurmukhi: baani.nameGurmukhi,
        titleEnglish: `${baani.nameEnglish} (${pothi.name})`,
        subtitle: `${pothi.name} · ${baani.timeOfDay}`,
        granth: baani.granthSource,
        tuks: resolved.tuks,
      };
      setQueue((prev) => enqueueQueueItem(prev, item));
    },
    [],
  );

  const handleEnqueueItem = useCallback((item: QueueItem) => {
    setQueue((prev) => enqueueQueueItem(prev, item));
  }, []);

  const handleLaunchPresenterWithItem = useCallback(
    (item: QueueItem) => {
      setQueue((prev) => {
        const next = enqueueQueueItem(prev, item);
        const idx = next.findIndex((q) => q.id === item.id);
        setPresenterStartIndex(Math.max(0, idx));
        return next;
      });
      navigate('/pothi-present');
    },
    [navigate],
  );

  const handleOpenQueueItemInReader = useCallback(
    (item: QueueItem) => {
      if (item.sourceType === 'shabad') {
        handleOpenShabad(item.sourceId);
      } else if (item.id.startsWith('ardaas:')) {
        handleOpenArdaas(item.id.replace('ardaas:', ''));
      } else {
        const parts = item.id.split(':');
        const pothiId = parts[1] ?? activePothiId;
        handleOpenBaani(item.sourceId, pothiId);
      }
    },
    [activePothiId, handleOpenArdaas, handleOpenBaani, handleOpenShabad],
  );

  if (route === '/pothi-present') {
    return (
      <>
        <Suspense fallback={<RouteLoadingFallback />}>
          <PresenterMode
            queue={queue}
            initialQueueIndex={presenterStartIndex}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onExit={() => navigate('/reader')}
          />
        </Suspense>
        <OfflineIndicator />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface-canvas)] text-[var(--ink-primary)]">
      <Navbar
        currentRoute={route}
        onNavigate={navigate}
        queueCount={queue.length}
        onOpenQueue={() => setQueueOpen(true)}
      />

      <main className="flex-1">
        {route === '/' && (
          <HomeVault
            activePothiId={activePothiId}
            onSelectPothi={setActivePothiId}
            sehajProgress={sehajProgress}
            settings={settings}
            onChangeTheme={handleChangeTheme}
            onNavigate={navigate}
            onOpenShabad={handleOpenShabad}
            onOpenAng={handleOpenAng}
            onOpenBaani={handleOpenBaani}
            onOpenArdaas={handleOpenArdaas}
            onEnqueueShabad={handleEnqueueShabad}
            queue={queue}
            bookmarks={bookmarks}
            history={history}
            onRemoveBookmark={handleRemoveBookmark}
            onOpenBookmark={handleOpenSavedItem}
            onOpenHistory={handleOpenSavedItem}
          />
        )}

        {(route === '/searcher' || route === '/gurbani') && (
          <Suspense fallback={<RouteLoadingFallback />}>
            <GurbaniSearcher
              onOpenShabad={handleOpenShabad}
              onOpenAng={handleOpenAng}
              onOpenBaani={handleOpenBaani}
              onOpenArdaas={handleOpenArdaas}
              onEnqueueShabad={handleEnqueueShabad}
              onToggleBookmark={handleToggleBookmark}
              bookmarks={bookmarks}
              queue={queue}
            />
          </Suspense>
        )}

        {route === '/gutka' && (
          <Suspense fallback={<RouteLoadingFallback />}>
            <SundarGutka
              activePothiId={activePothiId}
              onSelectPothi={setActivePothiId}
              onOpenBaani={handleOpenBaani}
              onOpenArdaas={handleOpenArdaas}
              onEnqueueBaani={handleEnqueueBaani}
              queue={queue}
            />
          </Suspense>
        )}

        {route === '/reader' && (
          <Suspense fallback={<RouteLoadingFallback />}>
            <ScriptureReader
              target={readerTarget}
              onChangeTarget={setReaderTarget}
              sehajProgress={sehajProgress}
              onUpdateSehajAng={handleUpdateSehajAng}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              queue={queue}
              onEnqueueCurrent={handleEnqueueItem}
              onLaunchPresenterWithItem={handleLaunchPresenterWithItem}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
              onOpenBookmark={handleOpenSavedItem}
            />
          </Suspense>
        )}
      </main>

      <Footer onNavigate={navigate} />

      {queueOpen && (
        <Suspense fallback={null}>
          <QueueDrawer
            open={queueOpen}
            onClose={() => setQueueOpen(false)}
            queue={queue}
            onRemove={(id) => setQueue((prev) => removeQueueItem(prev, id))}
            onMove={(id, dir) => setQueue((prev) => moveQueueItem(prev, id, dir))}
            onClear={() => setQueue([])}
            onOpenInReader={handleOpenQueueItemInReader}
            onLaunchPresenter={(idx = 0) => {
              setPresenterStartIndex(idx);
              navigate('/pothi-present');
            }}
          />
        </Suspense>
      )}

      <OfflineIndicator />
    </div>
  );
};

export default App;
