import { GRANTH_CATALOG } from '../data/gurbaniCorpus';
import { NITNEM_AND_COLLECTIONS } from '../data/nitnemBaanis';
import { SAMPARDAI_POTHIS } from '../data/sampardaiPothis';
import type {
  BaaniCollection,
  GranthId,
  QueueItem,
  ReaderSettings,
  SampardaiPothi,
  SehajPaathProgress,
  Tuk,
} from '../types/pothi';

export const DEFAULT_SEHAJ_PROGRESS: SehajPaathProgress = {
  sggs: 1,
  dasam: 1,
  sarbloh: 1,
  bgv: 1,
  bnl: 1,
};

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  larivaar: false,
  vishraam: true,
  showTransliteration: true,
  showEnglish: true,
  showTeeka: false,
  fontSize: 28,
  gurmukhiFont: 'Noto Sans Gurmukhi',
  theme: 'parchment',
};

export function getPothiById(pothiId: string): SampardaiPothi {
  return SAMPARDAI_POTHIS.find((p) => p.id === pothiId) ?? SAMPARDAI_POTHIS[0];
}

/**
 * Returns the 9 Foundational Nitnem Baanis in the exact, isolated order prescribed
 * by the selected Sampardai Pothi.
 */
export function getOrderedNitnemForPothi(pothiId: string): BaaniCollection[] {
  const pothi = getPothiById(pothiId);
  const nitnemMap = new Map(
    NITNEM_AND_COLLECTIONS.filter((b) => b.category === 'nitnem').map((b) => [b.id, b]),
  );

  const ordered: BaaniCollection[] = [];
  for (const id of pothi.nitnemOrder) {
    const baani = nitnemMap.get(id);
    if (baani) {
      ordered.push(baani);
      nitnemMap.delete(id);
    }
  }
  for (const remaining of nitnemMap.values()) {
    ordered.push(remaining);
  }
  return ordered;
}

export function getAdditionalCollections(): BaaniCollection[] {
  return NITNEM_AND_COLLECTIONS.filter((b) => b.category === 'additional');
}

export interface ResolvedPothiBaani {
  pothi: SampardaiPothi;
  baani: BaaniCollection;
  openingNote: string | null;
  closingNote: string | null;
  tuks: Tuk[];
}

/**
 * Strictly isolates a Baani's Manglacharan, Maryada notes, and closing Tuks
 * to ONLY the selected Sampardai Pothi without ever mixing variants.
 */
export function resolveBaaniForPothi(
  pothiId: string,
  baaniId: string,
): ResolvedPothiBaani | null {
  const pothi = getPothiById(pothiId);
  const baani = NITNEM_AND_COLLECTIONS.find((b) => b.id === baaniId);
  if (!baani) return null;

  const variant = pothi.baaniVariants[baaniId];
  const tuks: Tuk[] = [
    pothi.manglacharan,
    ...(variant?.extraOpeningTuks ?? []),
    ...baani.tuks,
    ...(variant?.extraClosingTuks ?? []),
  ];

  return {
    pothi,
    baani,
    openingNote: variant?.openingNote ?? null,
    closingNote: variant?.closingNote ?? null,
    tuks,
  };
}

/**
 * Updates the Sehaj Paath bookmark for a single Granth independently,
 * clamping to that Granth's valid Ang/Vaar bounds without modifying other Granths.
 */
export function updateGranthAng(
  current: SehajPaathProgress,
  granth: GranthId,
  nextAng: number,
): SehajPaathProgress {
  const meta = GRANTH_CATALOG[granth];
  const safeAng = Math.max(1, Math.min(meta.maxAng, Math.floor(nextAng)));
  return {
    ...current,
    [granth]: safeAng,
  };
}

export function enqueueQueueItem(queue: QueueItem[], item: QueueItem): QueueItem[] {
  if (queue.some((existing) => existing.id === item.id)) {
    return queue;
  }
  return [...queue, item];
}

export function removeQueueItem(queue: QueueItem[], id: string): QueueItem[] {
  return queue.filter((item) => item.id !== id);
}

export function moveQueueItem(
  queue: QueueItem[],
  id: string,
  direction: 'up' | 'down',
): QueueItem[] {
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1) return queue;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= queue.length) return queue;
  const next = [...queue];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}
