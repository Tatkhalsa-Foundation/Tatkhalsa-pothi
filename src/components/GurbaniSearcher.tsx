import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  Delete,
  Keyboard,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { FULL_CORPUS_STATS, FULL_SEARCH_CORPUS } from '../data/fullSearchCorpus';
import { GRANTH_CATALOG, GRANTH_LIST } from '../data/gurbaniCorpus';
import type {
  BookmarkItem,
  GranthId,
  QueueItem,
  SearchMatchType,
  SearchResult,
  Shabad,
} from '../types/pothi';
import { transliterateGurmukhi, type DirectAngTarget } from '../utils/gurbaniSearch';
import { GurbaniSearchClient } from '../utils/searchWorkerClient';

interface GurbaniSearcherProps {
  onOpenShabad: (shabadId: string, highlightTukId?: string) => void;
  onOpenAng: (granth: GranthId, ang: number) => void;
  onOpenBaani: (baaniId: string) => void;
  onOpenArdaas: (pothiId: string) => void;
  onEnqueueShabad: (shabad: Shabad) => void;
  onToggleBookmark: (candidate: Omit<BookmarkItem, 'savedAt'>) => void;
  bookmarks: BookmarkItem[];
  queue: QueueItem[];
}

const GURMUKHI_KEYS = [
  'ੳ', 'ਅ', 'ੲ', 'ਸ', 'ਹ',
  'ਕ', 'ਖ', 'ਗ', 'ਘ', 'ਙ',
  'ਚ', 'ਛ', 'ਜ', 'ਝ', 'ਞ',
  'ਟ', 'ਠ', 'ਡ', 'ਢ', 'ਣ',
  'ਤ', 'ਥ', 'ਦ', 'ਧ', 'ਨ',
  'ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ',
  'ਯ', 'ਰ', 'ਲ', 'ਵ', 'ੜ',
];

const QUICK_EXAMPLES: Array<{ label: string; query: string; desc: string }> = [
  { label: 'ਗਪਭਵ', query: 'ਗਪਭਵ', desc: 'Gurmukhi First-Letter' },
  { label: 'snkp', query: 'snkp', desc: 'Roman First-Letter' },
  { label: 'ਖਾਲਸਾ ਮੇਰੋ', query: 'ਖਾਲਸਾ ਮੇਰੋ', desc: 'Exact Gurmukhi' },
  { label: 'amrit', query: 'amrit', desc: 'Phonetic' },
  { label: '611', query: '611', desc: 'Direct Ang' },
];

function matchTypeLabel(type: SearchMatchType): string {
  switch (type) {
    case 'first-letter-gurmukhi':
      return 'First-Letter Gurmukhi';
    case 'first-letter-roman':
      return 'First-Letter Roman';
    case 'exact-gurmukhi':
      return 'Exact Gurmukhi';
    case 'phonetic':
      return 'Phonetic / Romanized';
    case 'direct-ang':
      return 'Direct Ang Match';
  }
}

export const GurbaniSearcher: React.FC<GurbaniSearcherProps> = ({
  onOpenShabad,
  onOpenAng,
  onOpenBaani,
  onOpenArdaas,
  onEnqueueShabad,
  onToggleBookmark,
  bookmarks,
  queue,
}) => {
  const workerClientRef = useRef<GurbaniSearchClient | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState('');
  const [granthFilter, setGranthFilter] = useState<GranthId | 'all'>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [directAng, setDirectAng] = useState<DirectAngTarget | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  // Direct Ang Jump Form state
  const [jumpGranth, setJumpGranth] = useState<GranthId>('sggs');
  const [jumpAngInput, setJumpAngInput] = useState('');
  const [jumpError, setJumpError] = useState<string | null>(null);

  useEffect(() => {
    const client = new GurbaniSearchClient();
    workerClientRef.current = client;
    return () => {
      client.dispose();
      workerClientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setDirectAng(null);
      setElapsedMs(null);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    const client = workerClientRef.current;
    if (!client) return;

    client.search(trimmed, granthFilter).then((outcome) => {
      if (cancelled) return;
      setResults(outcome.results);
      setDirectAng(outcome.directAng);
      setElapsedMs(outcome.elapsedMs);
      setIsSearching(false);
    });

    return () => {
      cancelled = true;
    };
  }, [query, granthFilter]);

  const shabadMap = useMemo(
    () => new Map(FULL_SEARCH_CORPUS.map((s) => [s.id, s])),
    [],
  );

  const queuedIds = useMemo(
    () => new Set(queue.map((q) => q.sourceId)),
    [queue],
  );

  const bookmarkedIds = useMemo(
    () => new Set(bookmarks.map((b) => b.id)),
    [bookmarks],
  );

  const openCorpusEntry = (shabad: Shabad, highlightTukId?: string) => {
    if (shabad.baaniId) {
      onOpenBaani(shabad.baaniId);
    } else if (shabad.pothiId) {
      onOpenArdaas(shabad.pothiId);
    } else {
      onOpenShabad(shabad.id, highlightTukId);
    }
  };

  const makeBookmarkPayload = (shabad: Shabad): Omit<BookmarkItem, 'savedAt'> => {
    const meta = GRANTH_CATALOG[shabad.granth];
    if (shabad.baaniId) {
      return {
        id: `baani:${shabad.baaniId}`,
        kind: 'baani',
        titleGurmukhi: shabad.titleGurmukhi,
        titleEnglish: shabad.titleEnglish,
        subtitle: `${meta.shortName} · ${shabad.raag}`,
        granth: shabad.granth,
        baaniId: shabad.baaniId,
      };
    }
    if (shabad.pothiId) {
      return {
        id: `ardaas:${shabad.pothiId}`,
        kind: 'ardaas',
        titleGurmukhi: shabad.titleGurmukhi,
        titleEnglish: shabad.titleEnglish,
        subtitle: `${shabad.author} · Sampardai Ardaas`,
        granth: shabad.granth,
        pothiId: shabad.pothiId,
      };
    }
    return {
      id: `shabad:${shabad.id}`,
      kind: 'shabad',
      titleGurmukhi: shabad.titleGurmukhi,
      titleEnglish: shabad.titleEnglish,
      subtitle: `${meta.shortName} · ${meta.unitLabel} ${shabad.ang} · ${shabad.raag}`,
      granth: shabad.granth,
      ang: shabad.ang,
      shabadId: shabad.id,
    };
  };

  const getBookmarkKeyForShabad = (shabad: Shabad): string => {
    if (shabad.baaniId) return `baani:${shabad.baaniId}`;
    if (shabad.pothiId) return `ardaas:${shabad.pothiId}`;
    return `shabad:${shabad.id}`;
  };

  const filteredBrowseCorpus = useMemo(() => {
    return FULL_SEARCH_CORPUS.filter((s) => {
      if (granthFilter !== 'all' && s.granth !== granthFilter) return false;
      if (savedOnly && !bookmarkedIds.has(getBookmarkKeyForShabad(s))) return false;
      return true;
    });
  }, [granthFilter, savedOnly, bookmarkedIds]);

  const filteredResults = useMemo(() => {
    if (!savedOnly) return results;
    return results.filter((res) => {
      const shabad = shabadMap.get(res.shabadId);
      return shabad ? bookmarkedIds.has(getBookmarkKeyForShabad(shabad)) : false;
    });
  }, [results, savedOnly, shabadMap, bookmarkedIds]);

  const handleDirectJump = (e: React.FormEvent) => {
    e.preventDefault();
    const meta = GRANTH_CATALOG[jumpGranth];
    const parsed = Number.parseInt(jumpAngInput.trim(), 10);
    if (Number.isNaN(parsed) || parsed < 1 || parsed > meta.maxAng) {
      setJumpError(`Enter a valid ${meta.unitLabel} between 1 and ${meta.maxAng}.`);
      return;
    }
    setJumpError(null);
    onOpenAng(jumpGranth, parsed);
  };

  const handleVirtualKey = (char: string) => {
    setQuery((prev) => prev + char);
    inputRef.current?.focus();
  };

  const handleVirtualBackspace = () => {
    setQuery((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Header & Direct Ang Jump */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink-primary)]">
            Gurbani Searcher
          </h1>
          <p className="text-sm text-[var(--ink-secondary)]">
            Instant client-side Web Worker search across {FULL_CORPUS_STATS.totalShabads} Shabads, Nitnem Baanis &amp; Sampardai Ardaas ({FULL_CORPUS_STATS.totalTuks} indexed Unicode Gurmukhi Tuks) — First-letter Gurmukhi, Roman first-letter, exact Gurmukhi, phonetic search, and direct Ang jump.
          </p>
        </div>

        {/* Direct Ang Jump Form */}
        <form
          onSubmit={handleDirectJump}
          aria-label="Direct Ang Jump"
          className="rounded-xl border pothi-divider pothi-surface p-3 flex flex-col gap-2 shrink-0"
        >
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <label htmlFor="jump-granth-select" className="sr-only">
              Select Granth for direct Ang jump
            </label>
            <select
              id="jump-granth-select"
              value={jumpGranth}
              onChange={(e) => {
                setJumpGranth(e.target.value as GranthId);
                setJumpError(null);
              }}
              className="rounded-lg border pothi-divider bg-[var(--surface-canvas)] px-2.5 py-2 text-xs font-medium text-[var(--ink-primary)] min-h-[40px] max-w-[240px]"
            >
              {GRANTH_LIST.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.shortName} (1–{g.maxAng})
                </option>
              ))}
            </select>

            <label htmlFor="jump-ang-input" className="sr-only">
              Ang or Page number
            </label>
            <input
              id="jump-ang-input"
              type="number"
              min={1}
              max={GRANTH_CATALOG[jumpGranth].maxAng}
              value={jumpAngInput}
              onChange={(e) => {
                setJumpAngInput(e.target.value);
                setJumpError(null);
              }}
              placeholder={`${GRANTH_CATALOG[jumpGranth].unitLabel} 1–${GRANTH_CATALOG[jumpGranth].maxAng}`}
              className="w-24 rounded-lg border pothi-divider bg-[var(--surface-canvas)] px-2.5 py-2 text-xs font-mono-nums text-[var(--ink-primary)] min-h-[40px]"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[40px] whitespace-nowrap shrink-0"
            >
              Jump
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {jumpError && (
            <p className="text-xs text-red-600 dark:text-red-400" role="alert">
              {jumpError}
            </p>
          )}
        </form>
      </div>

      {/* Main Search Input & Gurmukhi Keypad */}
      <section className="rounded-2xl border pothi-divider pothi-surface p-4 sm:p-6 space-y-4">
        <div className="relative flex items-center gap-2">
          <Search
            className="pointer-events-none absolute left-4 h-5 w-5 text-[var(--ink-muted)]"
            aria-hidden="true"
          />
          <label htmlFor="gurbani-search-input" className="sr-only">
            Search Gurbani by Gurmukhi first letters, Roman initials, exact Gurmukhi, phonetic spelling, or Ang number
          </label>
          <input
            ref={inputRef}
            id="gurbani-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type Gurmukhi first-letters (ਗਪਭਵ), exact Gurmukhi, Roman initials (snkp), phonetic (sat naam), or Ang (611)..."
            className="w-full rounded-xl border pothi-divider bg-[var(--surface-canvas)] pl-12 pr-24 py-3.5 text-base font-gurmukhi-noto text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-2 focus:outline-[var(--accent-gold)]"
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowKeyboard((v) => !v)}
              aria-expanded={showKeyboard}
              aria-label="Toggle Gurmukhi first-letter keyboard"
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium cursor-pointer ${
                showKeyboard
                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                  : 'pothi-divider text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              <Keyboard className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Gurmukhi</span>
            </button>
          </div>
        </div>

        {/* Sample Queries */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="text-[var(--ink-muted)]">Try searching:</span>
          {QUICK_EXAMPLES.map((ex) => (
            <button
              key={ex.query}
              type="button"
              onClick={() => setQuery(ex.query)}
              className="text-[var(--ink-secondary)] hover:text-[var(--accent-gold)] cursor-pointer"
            >
              <span className="font-gurmukhi-noto font-medium text-[var(--ink-primary)]">
                {ex.label}
              </span>{' '}
              <span className="text-[var(--ink-muted)]">({ex.desc})</span>
            </button>
          ))}
        </div>

        {/* Virtual Gurmukhi First-Letter Keyboard */}
        {showKeyboard && (
          <div
            aria-label="Gurmukhi First-Letter Keypad"
            className="rounded-xl border pothi-divider bg-[var(--surface-subtle)] p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
              <span>Tap Gurmukhi base letters for instant first-letter search</span>
              <button
                type="button"
                onClick={handleVirtualBackspace}
                aria-label="Backspace Gurmukhi character"
                className="inline-flex items-center gap-1 rounded-md border pothi-divider bg-[var(--surface-card)] px-2.5 py-1 text-xs font-medium text-[var(--ink-primary)] hover:border-[var(--accent-gold)] cursor-pointer"
              >
                <Delete className="h-3.5 w-3.5" aria-hidden="true" />
                Backspace
              </button>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
              {GURMUKHI_KEYS.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleVirtualKey(ch)}
                  className="font-gurmukhi-noto h-10 rounded-lg border pothi-divider bg-[var(--surface-card)] text-lg text-[var(--ink-primary)] hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold-soft)] cursor-pointer"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Granth Filter Tabs + Saved Bookmarks Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t pothi-divider">
          <div
            role="group"
            aria-label="Filter by Granth source"
            className="flex flex-wrap items-center gap-1.5"
          >
            <button
              type="button"
              aria-pressed={granthFilter === 'all'}
              onClick={() => setGranthFilter('all')}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap cursor-pointer min-h-[38px] ${
                granthFilter === 'all'
                  ? 'bg-[var(--accent-navy)] text-white dark:text-[#0B1220]'
                  : 'bg-[var(--surface-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
              }`}
            >
              All Sources ({FULL_CORPUS_STATS.totalShabads})
            </button>
            {GRANTH_LIST.map((g) => {
              const active = granthFilter === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setGranthFilter(g.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap cursor-pointer min-h-[38px] ${
                    active
                      ? 'bg-[var(--accent-navy)] text-white dark:text-[#0B1220]'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]'
                  }`}
                >
                  {g.shortName} ({FULL_CORPUS_STATS.byGranth[g.id]})
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap cursor-pointer min-h-[38px] ${
              savedOnly
                ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--ink-primary)]'
                : 'pothi-divider text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            Saved ({bookmarks.length})
          </button>
        </div>
      </section>

      {/* Direct Ang Shortcut Banner */}
      {directAng && (
        <div className="rounded-xl border border-[var(--accent-gold)] bg-[var(--accent-gold-soft)]/50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--ink-primary)]">
              Direct {GRANTH_CATALOG[directAng.granth ?? (granthFilter === 'all' ? 'sggs' : granthFilter)].unitLabel} Jump Available
            </p>
            <p className="text-xs text-[var(--ink-secondary)]">
              Open {GRANTH_CATALOG[directAng.granth ?? (granthFilter === 'all' ? 'sggs' : granthFilter)].fullName} directly at {GRANTH_CATALOG[directAng.granth ?? (granthFilter === 'all' ? 'sggs' : granthFilter)].unitLabel} {directAng.ang}.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenAng(
                directAng.granth ?? (granthFilter === 'all' ? 'sggs' : granthFilter),
                directAng.ang,
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-4 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[40px]"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Open Ang {directAng.ang}
          </button>
        </div>
      )}

      {/* Results Section */}
      <section aria-live="polite" className="space-y-4">
        {!query.trim() ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-[var(--ink-primary)]">
                {savedOnly
                  ? 'Saved / Bookmarked Shabads & Baanis'
                  : 'Indexed Shabads, Nitnem Baanis & Sampardai Ardaas'}
              </h2>
              <span className="text-xs text-[var(--ink-muted)] font-mono-nums">
                {filteredBrowseCorpus.length} indexed entries · {FULL_CORPUS_STATS.totalTuks} Tuks
              </span>
            </div>

            {filteredBrowseCorpus.length === 0 ? (
              <div className="rounded-2xl border pothi-divider pothi-surface p-8 text-center space-y-2">
                <p className="text-sm font-medium text-[var(--ink-primary)]">
                  No saved bookmarks match this Granth filter yet.
                </p>
                <p className="text-xs text-[var(--ink-muted)]">
                  Tap the Bookmark icon on any Shabad or Baani to save it here for instant access.
                </p>
              </div>
            ) : (
              <div className="divide-y pothi-divider rounded-2xl border pothi-divider pothi-surface">
                {filteredBrowseCorpus.map((shabad) => {
                  const isQueued = queuedIds.has(shabad.id);
                  const isSaved = bookmarkedIds.has(getBookmarkKeyForShabad(shabad));
                  const meta = GRANTH_CATALOG[shabad.granth];
                  const openingGurmukhi = shabad.tuks[0]?.gurmukhi ?? '';
                  return (
                    <div
                      key={shabad.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-subtle)]/50"
                    >
                      <button
                        type="button"
                        onClick={() => openCorpusEntry(shabad)}
                        className="text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <p className="text-xs text-[var(--ink-muted)]">
                          <span>{meta.shortName}</span>
                          {!shabad.baaniId && !shabad.pothiId && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span className="font-mono-nums">
                                {meta.unitLabel} {shabad.ang}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true"> · </span>
                          <span>{shabad.raag}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{shabad.author}</span>
                        </p>
                        <p
                          lang="pa"
                          className="mt-1.5 font-gurmukhi-noto text-xl font-medium text-[var(--ink-primary)]"
                        >
                          {openingGurmukhi}
                        </p>
                        {openingGurmukhi && (
                          <p className="mt-1 text-sm text-[var(--accent-gold)]">
                            {transliterateGurmukhi(openingGurmukhi)}
                          </p>
                        )}
                      </button>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(makeBookmarkPayload(shabad))}
                          aria-pressed={isSaved}
                          aria-label={
                            isSaved
                              ? `Remove ${shabad.titleEnglish} from bookmarks`
                              : `Bookmark ${shabad.titleEnglish}`
                          }
                          className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-lg border cursor-pointer ${
                            isSaved
                              ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                              : 'pothi-divider text-[var(--ink-muted)] hover:border-[var(--accent-gold)] hover:text-[var(--ink-primary)]'
                          }`}
                        >
                          <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEnqueueShabad(shabad)}
                          aria-label={`Add ${shabad.titleEnglish} to queue`}
                          className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-3 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[38px]"
                        >
                          {isQueued ? (
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
                          onClick={() => openCorpusEntry(shabad)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[38px]"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ink-muted)]">
              <span>
                {isSearching
                  ? 'Searching full Gurbani corpus...'
                  : `${filteredResults.length} matching ${filteredResults.length === 1 ? 'Tuk' : 'Tuks'} found across ${FULL_CORPUS_STATS.totalShabads} Shabads & Baanis`}
                {granthFilter !== 'all' ? ` in ${GRANTH_CATALOG[granthFilter].shortName}` : ''}
              </span>
              {elapsedMs !== null && !isSearching && (
                <span className="font-mono-nums">{elapsedMs} ms</span>
              )}
            </div>

            {filteredResults.length === 0 && !isSearching ? (
              <div className="rounded-2xl border pothi-divider pothi-surface p-10 text-center space-y-2">
                <p className="font-display text-lg font-medium text-[var(--ink-primary)]">
                  No matching Tuks found for “{query}”
                </p>
                <p className="text-sm text-[var(--ink-muted)] max-w-md mx-auto">
                  Try switching the Granth filter to All Sources, searching with Gurmukhi first-letters (e.g. ਗਪਭਵ), Roman initials (e.g. snkp), phonetic spelling (e.g. sat naam), or an Ang number (e.g. 611).
                </p>
              </div>
            ) : (
              <div className="divide-y pothi-divider rounded-2xl border pothi-divider pothi-surface">
                {filteredResults.map((res) => {
                  const shabad = shabadMap.get(res.shabadId);
                  const isQueued = queuedIds.has(res.shabadId);
                  const isSaved = shabad
                    ? bookmarkedIds.has(getBookmarkKeyForShabad(shabad))
                    : false;
                  const meta = GRANTH_CATALOG[res.granth];

                  const handleOpen = () => {
                    if (shabad) {
                      openCorpusEntry(shabad, res.tukId);
                    } else if (res.baaniId) {
                      onOpenBaani(res.baaniId);
                    } else if (res.pothiId) {
                      onOpenArdaas(res.pothiId);
                    } else {
                      onOpenShabad(res.shabadId, res.tukId);
                    }
                  };

                  return (
                    <div
                      key={`${res.shabadId}-${res.tukId}`}
                      className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-[var(--surface-subtle)]/50"
                    >
                      <button
                        type="button"
                        onClick={handleOpen}
                        className="text-left flex-1 min-w-0 cursor-pointer space-y-1.5"
                      >
                        <p className="text-xs text-[var(--ink-muted)]">
                          <span className="font-medium text-[var(--accent-gold)]">
                            {matchTypeLabel(res.matchType)}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span>{meta.shortName}</span>
                          {!res.baaniId && !res.pothiId && (
                            <>
                              <span aria-hidden="true"> · </span>
                              <span className="font-mono-nums">
                                {meta.unitLabel} {res.ang}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true"> · </span>
                          <span>{res.raag}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{res.author}</span>
                        </p>

                        <p
                          lang="pa"
                          className="font-gurmukhi-noto text-xl sm:text-2xl leading-[1.7] text-[var(--ink-primary)]"
                        >
                          {res.matchedTuk.gurmukhi}
                        </p>

                        <p className="text-sm text-[var(--accent-gold)]">
                          {transliterateGurmukhi(res.matchedTuk.gurmukhi)}
                        </p>
                      </button>

                      <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleOpen}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-navy)] px-3.5 py-2 text-xs font-medium text-white dark:text-[#0B1220] hover:bg-[var(--accent-navy-hover)] cursor-pointer min-h-[38px] whitespace-nowrap"
                        >
                          Open Shabad
                        </button>
                        <div className="flex items-center gap-1.5">
                          {shabad && (
                            <button
                              type="button"
                              onClick={() => onToggleBookmark(makeBookmarkPayload(shabad))}
                              aria-pressed={isSaved}
                              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark Shabad'}
                              className={`inline-flex h-[36px] w-[36px] items-center justify-center rounded-lg border cursor-pointer ${
                                isSaved
                                  ? 'border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--accent-gold)]'
                                  : 'pothi-divider text-[var(--ink-muted)] hover:border-[var(--accent-gold)]'
                              }`}
                            >
                              <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          )}
                          {shabad && (
                            <button
                              type="button"
                              onClick={() => onEnqueueShabad(shabad)}
                              aria-label={`Add ${shabad.titleEnglish} to queue`}
                              className="inline-flex items-center gap-1.5 rounded-lg border pothi-divider px-2.5 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--ink-primary)] cursor-pointer min-h-[36px] whitespace-nowrap"
                            >
                              {isQueued ? (
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
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
