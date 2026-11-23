import React, { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { GurbaniSearcher } from './components/GurbaniSearcher';
import { HomeVault } from './components/HomeVault';
import { Navbar } from './components/Navbar';
import { PresenterMode } from './components/PresenterMode';
import { QueueDrawer } from './components/QueueDrawer';
import { ScriptureReader } from './components/ScriptureReader';
import { SundarGutka } from './components/SundarGutka';
import { GRANTH_CATALOG } from './data/gurbaniCorpus';
import type {
  AppRoute,
  BaaniCollection,
  GranthId,
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
  moveQueueItem,
  removeQueueItem,
  resolveBaaniForPothi,
  updateGranthAng,
} from './utils/pothiState';

const STORAGE_KEYS = {
  pothiId: 'tatkhalsa.pothi.activePothiId',
  sehaj: 'tatkhalsa.pothi.sehajProgress',
  settings: 'tatkhalsa.pothi.readerSettings',
  queue: 'tatkhalsa.pothi.queue',
} as const;

function normalizeRoute(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
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
  const [readerTarget, setReaderTarget] = useState<ReaderTarget>(() => ({
    mode: 'ang',
    granth: 'sggs',
    ang: readStoredJson(STORAGE_KEYS.sehaj, DEFAULT_SEHAJ_PROGRESS).sggs,
  }));
  const [queueOpen, setQueueOpen] = useState(false);
  const [presenterStartIndex, setPresenterStartIndex] = useState(0);

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

  const handleOpenAng = useCallback(
    (granth: GranthId, ang: number) => {
      setSehajProgress((prev) => updateGranthAng(prev, granth, ang));
      setReaderTarget({ mode: 'ang', granth, ang });
      navigate('/reader');
    },
    [navigate],
  );

  const handleOpenShabad = useCallback(
    (shabadId: string, highlightTukId?: string) => {
      setReaderTarget({ mode: 'shabad', shabadId, highlightTukId });
      navigate('/reader');
    },
    [navigate],
  );

  const handleOpenBaani = useCallback(
    (baaniId: string, pothiId?: string) => {
      const resolvedPothiId = pothiId ?? activePothiId;
      setActivePothiId(resolvedPothiId);
      setReaderTarget({ mode: 'baani', baaniId, pothiId: resolvedPothiId });
      navigate('/reader');
    },
    [activePothiId, navigate],
  );

  const handleOpenArdaas = useCallback(
    (pothiId: string) => {
      setActivePothiId(pothiId);
      setReaderTarget({ mode: 'ardaas', pothiId });
      navigate('/reader');
    },
    [navigate],
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
      <PresenterMode
        queue={queue}
        initialQueueIndex={presenterStartIndex}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onExit={() => navigate('/reader')}
      />
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
          />
        )}

        {(route === '/searcher' || route === '/gurbani') && (
          <GurbaniSearcher
            onOpenShabad={handleOpenShabad}
            onOpenAng={handleOpenAng}
            onEnqueueShabad={handleEnqueueShabad}
            queue={queue}
          />
        )}

        {route === '/gutka' && (
          <SundarGutka
            activePothiId={activePothiId}
            onSelectPothi={setActivePothiId}
            onOpenBaani={handleOpenBaani}
            onOpenArdaas={handleOpenArdaas}
            onEnqueueBaani={handleEnqueueBaani}
            queue={queue}
          />
        )}

        {route === '/reader' && (
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
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

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
    </div>
  );
};

export default App;
