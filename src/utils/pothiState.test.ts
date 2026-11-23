import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPARDAI_POTHIS } from '../data/sampardaiPothis';
import {
  DEFAULT_SEHAJ_PROGRESS,
  enqueueQueueItem,
  getOrderedNitnemForPothi,
  moveQueueItem,
  removeQueueItem,
  resolveBaaniForPothi,
  updateGranthAng,
} from './pothiState';
import type { QueueItem } from '../types/pothi';

test('all 15 Sampardai Pothis exist with unique IDs and isolated Sampardai Ardaas', () => {
  assert.equal(SAMPARDAI_POTHIS.length, 15);
  const ids = new Set(SAMPARDAI_POTHIS.map((p) => p.id));
  assert.equal(ids.size, 15);

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

test('Sehaj Paath tracks independent Ang progress per Granth with proper bounds', () => {
  let progress = { ...DEFAULT_SEHAJ_PROGRESS };
  progress = updateGranthAng(progress, 'sggs', 611);
  progress = updateGranthAng(progress, 'dasam', 119);
  progress = updateGranthAng(progress, 'sarbloh', 495);

  assert.equal(progress.sggs, 611);
  assert.equal(progress.dasam, 119);
  assert.equal(progress.sarbloh, 495);
  assert.equal(progress.bgv, 1);

  // Bounds clamping
  const clamped = updateGranthAng(progress, 'sggs', 5000);
  assert.equal(clamped.sggs, 1430);
  assert.equal(clamped.dasam, 119);
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
