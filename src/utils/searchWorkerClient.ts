import { GURBANI_CORPUS } from '../data/gurbaniCorpus';
import {
  buildSearchIndex,
  parseDirectAngQuery,
  searchCorpus,
  type DirectAngTarget,
} from './gurbaniSearch';
import type { GranthId, SearchResult } from '../types/pothi';
import type {
  SearchWorkerRequest,
  SearchWorkerResponse,
} from '../workers/gurbaniSearch.worker';

export interface WorkerSearchOutcome {
  results: SearchResult[];
  directAng: DirectAngTarget | null;
  elapsedMs: number;
  usedWorker: boolean;
}

let fallbackIndex: ReturnType<typeof buildSearchIndex> | null = null;

export class GurbaniSearchClient {
  private worker: Worker | null = null;
  private nextRequestId = 1;
  private pending = new Map<number, (outcome: WorkerSearchOutcome) => void>();

  constructor() {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(
          new URL('../workers/gurbaniSearch.worker.ts', import.meta.url),
          { type: 'module' },
        );
        this.worker.onmessage = (event: MessageEvent<SearchWorkerResponse>) => {
          const { requestId, results, directAng, elapsedMs } = event.data;
          const resolver = this.pending.get(requestId);
          if (resolver) {
            this.pending.delete(requestId);
            resolver({ results, directAng, elapsedMs, usedWorker: true });
          }
        };
        this.worker.onerror = () => {
          this.worker?.terminate();
          this.worker = null;
        };
      } catch {
        this.worker = null;
      }
    }
  }

  public search(
    query: string,
    granthFilter: GranthId | 'all',
  ): Promise<WorkerSearchOutcome> {
    if (this.worker) {
      const requestId = this.nextRequestId++;
      return new Promise((resolve) => {
        this.pending.set(requestId, resolve);
        const payload: SearchWorkerRequest = { requestId, query, granthFilter };
        this.worker?.postMessage(payload);
      });
    }

    const startedAt = performance.now();
    if (!fallbackIndex) {
      fallbackIndex = buildSearchIndex(GURBANI_CORPUS);
    }
    const results = searchCorpus(query, granthFilter, GURBANI_CORPUS, fallbackIndex);
    const directAng = parseDirectAngQuery(query);
    const elapsedMs = Math.max(0.1, Number((performance.now() - startedAt).toFixed(2)));
    return Promise.resolve({
      results,
      directAng,
      elapsedMs,
      usedWorker: false,
    });
  }

  public dispose(): void {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
  }
}
