import { GURBANI_CORPUS } from '../data/gurbaniCorpus';
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
}

const PRECOMPUTED_INDEX = buildSearchIndex(GURBANI_CORPUS);

self.onmessage = (event: MessageEvent<SearchWorkerRequest>) => {
  const { requestId, query, granthFilter } = event.data;
  const startedAt = performance.now();
  const results = searchCorpus(query, granthFilter, GURBANI_CORPUS, PRECOMPUTED_INDEX);
  const directAng = parseDirectAngQuery(query);
  const elapsedMs = Math.max(0.1, Number((performance.now() - startedAt).toFixed(2)));

  const response: SearchWorkerResponse = {
    requestId,
    results,
    directAng,
    elapsedMs,
  };
  self.postMessage(response);
};
