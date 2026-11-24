import test from 'node:test';
import assert from 'node:assert/strict';
import { GRANTH_CATALOG } from '../data/gurbaniCorpus';
import { NITNEM_AND_COLLECTIONS } from '../data/nitnemBaanis';
import { SAMPARDAI_POTHIS } from '../data/sampardaiPothis';
import {
  DEFAULT_READER_SETTINGS,
  DEFAULT_SEHAJ_PROGRESS,
  enqueueQueueItem,
  getOrderedNitnemForPothi,
  moveQueueItem,
  recordHistoryEntry,
  removeBookmark,
  removeQueueItem,
  resolveBaaniForPothi,
  toggleBookmark,
  updateGranthAng,
} from './pothiState';
import type { BookmarkItem, HistoryEntry, QueueItem } from '../types/pothi';

test('respectful scripture naming and Japneesan naming are enforced across catalogs', () => {
  assert.equal(GRANTH_CATALOG.sggs.fullName, 'Sri Guru Granth Sahib Ji');
  assert.equal(GRANTH_CATALOG.dasam.fullName, 'Sri Guru Dasam Granth Sahib Ji');
  assert.equal(GRANTH_CATALOG.sarbloh.fullName, 'Sri Guru Sarabloh Granth Sahib Ji');

  const firstNitnem = NITNEM_AND_COLLECTIONS.find((b) => b.order === 1);
  assert.ok(firstNitnem);
  assert.equal(firstNitnem.nameEnglish, 'Japneesan');
  assert.equal(firstNitnem.nameGurmukhi, 'ਜਪੁਨੀਸਾਣੁ');

  assert.equal(DEFAULT_READER_SETTINGS.paathExitGuard, true);
});

test('all 15 Sampardai Pothis exist with unique IDs, clean subtitles, and isolated Sampardai Ardaas', () => {
  assert.equal(SAMPARDAI_POTHIS.length, 15);
  const ids = new Set(SAMPARDAI_POTHIS.map((p) => p.id));
  assert.equal(ids.size, 15);

  for (const pothi of SAMPARDAI_POTHIS) {
    assert.ok(!pothi.maryadaSummary.includes('====='), `Placeholder found in ${pothi.id}`);
    assert.ok(!pothi.name.includes('====='), `Placeholder found in ${pothi.id}`);
    assert.ok(!pothi.lineage.includes('====='), `Placeholder found in ${pothi.id}`);
    assert.ok(!pothi.lineage.includes('Hazuri Maryada'), `Copied UI phrase in ${pothi.id}`);
  }

  const uniqueInvocations = new Set(
    SAMPARDAI_POTHIS.map((p) => p.ardaas.tuks[3].gurmukhi),
  );
  assert.equal(uniqueInvocations.size, 15);
});

test('strict Maryada isolation keeps Baani notes and Nitnem order separate per Pothi', () => {
  const buddhaDalNitnem = getOrderedNitnemForPothi('buddha-dal');
  const sgpcNitnem = getOrderedNitnemForPothi('sgpc-maryada');
  assert.equal(buddhaDalNitnem.length, 9);
  assert.equal(sgpcNitnem.length, 9);
  assert.notDeepEqual(
    buddhaDalNitnem.map((b) => b.id),
    sgpcNitnem.map((b) => b.id),
  );

  const buddhaChaupai = resolveBaaniForPothi('buddha-dal', 'chaupai-sahib');
  const sgpcChaupai = resolveBaaniForPothi('sgpc-maryada', 'chaupai-sahib');
  assert.ok(buddhaChaupai && sgpcChaupai);
  assert.notEqual(buddhaChaupai.openingNote, sgpcChaupai.openingNote);
  assert.notEqual(buddhaChaupai.tuks[0].gurmukhi, sgpcChaupai.tuks[0].gurmukhi);
});

test('Sehaj Paath tracks independent Ang progress across all 5 Granths including Sri Guru Sarabloh Granth Sahib Ji 1-1040', () => {
  assert.equal(GRANTH_CATALOG.sggs.maxAng, 1430);
  assert.equal(GRANTH_CATALOG.dasam.maxAng, 1428);
  assert.equal(GRANTH_CATALOG.sarbloh.maxAng, 1040);
  assert.equal(GRANTH_CATALOG.bgv.maxAng, 40);
  assert.equal(GRANTH_CATALOG.bnl.maxAng, 50);

  let progress = { ...DEFAULT_SEHAJ_PROGRESS };
  progress = updateGranthAng(progress, 'sggs', 394);
  progress = updateGranthAng(progress, 'dasam', 119);
  progress = updateGranthAng(progress, 'sarbloh', 1);
  progress = updateGranthAng(progress, 'bgv', 11);
  progress = updateGranthAng(progress, 'bnl', 12);

  assert.equal(progress.sggs, 394);
  assert.equal(progress.dasam, 119);
  assert.equal(progress.sarbloh, 1);
  assert.equal(progress.bgv, 11);
  assert.equal(progress.bnl, 12);

  // Bounds clamping
  const clamped = updateGranthAng(progress, 'sarbloh', 2500);
  assert.equal(clamped.sarbloh, 1040);
  assert.equal(clamped.sggs, 394);
});

test('Multi-View Queue supports deduped enqueue, reorder, and removal', () => {
  const itemA: QueueItem = {
    id: 'shabad:a',
    sourceType: 'shabad',
    sourceId: 'a',
    titleGurmukhi: 'A',
    titleEnglish: 'Shabad A',
    subtitle: 'Ang 1',
    granth: 'sggs',
    ang: 1,
    tuks: [],
  };
  const itemB: QueueItem = { ...itemA, id: 'shabad:b', sourceId: 'b', titleEnglish: 'Shabad B' };

  let q: QueueItem[] = [];
  q = enqueueQueueItem(q, itemA);
  q = enqueueQueueItem(q, itemA); // duplicate ignored
  q = enqueueQueueItem(q, itemB);
  assert.equal(q.length, 2);

  q = moveQueueItem(q, 'shabad:b', 'up');
  assert.equal(q[0].id, 'shabad:b');

  q = removeQueueItem(q, 'shabad:b');
  assert.equal(q.length, 1);
  assert.equal(q[0].id, 'shabad:a');
});

test('Bookmarks and Reading History helpers toggle, deduplicate, and bound history entries', () => {
  let bookmarks: BookmarkItem[] = [];
  const sample = {
    id: 'ang:sarbloh:1',
    kind: 'ang' as const,
    titleGurmukhi: 'ਸ੍ਰੀ ਗੁਰੂ ਸਰਬਲੋਹ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    titleEnglish: 'Sri Guru Sarabloh Granth Sahib Ji — Ang 1',
    subtitle: 'Sri Guru Sarabloh Granth Sahib Ji · Ang 1 of 1040',
    granth: 'sarbloh' as const,
    ang: 1,
  };

  bookmarks = toggleBookmark(bookmarks, sample, 1000);
  assert.equal(bookmarks.length, 1);
  assert.equal(bookmarks[0].savedAt, 1000);

  // Toggle again removes it
  bookmarks = toggleBookmark(bookmarks, sample, 2000);
  assert.equal(bookmarks.length, 0);

  bookmarks = toggleBookmark(bookmarks, sample, 3000);
  bookmarks = removeBookmark(bookmarks, 'ang:sarbloh:1');
  assert.equal(bookmarks.length, 0);

  // Reading history deduplicates and keeps most recent first
  let history: HistoryEntry[] = [];
  history = recordHistoryEntry(history, sample, 100, 2);
  history = recordHistoryEntry(history, { ...sample, id: 'ang:sggs:1' }, 200, 2);
  history = recordHistoryEntry(history, { ...sample, id: 'ang:dasam:1' }, 300, 2);
  assert.equal(history.length, 2);
  assert.equal(history[0].id, 'ang:dasam:1');
  assert.equal(history[1].id, 'ang:sggs:1');
});
