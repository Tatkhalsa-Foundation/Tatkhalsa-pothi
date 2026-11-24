import { FULL_CORPUS_STATS, FULL_SEARCH_CORPUS } from '../data/fullSearchCorpus';
import {
  buildSearchIndex,
  parseDirectAngQuery,
  searchCorpus,
  type DirectAngTarget,
} from '../utils/gurbaniSearch';
import type { GranthId, SearchResult } from '../types/pothi';

export interface SearchWorkerRequest {
  requestId: number;
  query: string;
  granthFilter: GranthId | 'all';
}

export interface SearchWorkerResponse {
  requestId: number;
  results: SearchResult[];
  directAng: DirectAngTarget | null;
  elapsedMs: number;
  indexedShabads: number;
  indexedTuks: number;
}

const PRECOMPUTED_INDEX = buildSearchIndex(FULL_SEARCH_CORPUS);

self.onmessage = (event: MessageEvent<SearchWorkerRequest>) => {
  const { requestId, query, granthFilter } = event.data;
  const startedAt = performance.now();
  const results = searchCorpus(query, granthFilter, FULL_SEARCH_CORPUS, PRECOMPUTED_INDEX);
  const directAng = parseDirectAngQuery(query);
  const elapsedMs = Math.max(0.1, Number((performance.now() - startedAt).toFixed(2)));

  const response: SearchWorkerResponse = {
    requestId,
    results,
    directAng,
    elapsedMs,
    indexedShabads: FULL_CORPUS_STATS.totalShabads,
    indexedTuks: FULL_CORPUS_STATS.totalTuks,
  };
  self.postMessage(response);
};
