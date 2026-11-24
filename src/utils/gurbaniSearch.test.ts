import test from 'node:test';
import assert from 'node:assert/strict';
import { FULL_CORPUS_STATS, FULL_SEARCH_CORPUS } from '../data/fullSearchCorpus';
import { GURBANI_CORPUS } from '../data/gurbaniCorpus';
import {
  extractGurmukhiFirstLetters,
  extractRomanFirstLetters,
  parseDirectAngQuery,
  searchCorpus,
  toLarivaar,
  tokenizeWithVishraam,
  transliterateGurmukhi,
} from './gurbaniSearch';

test('transliterateGurmukhi produces deterministic phonetic Romanization strictly from Unicode Gurmukhi', () => {
  assert.equal(
    transliterateGurmukhi('ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥'),
    'aad sach jugaad sach ||',
  );
  const mool = transliterateGurmukhi('ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ');
  assert.ok(mool.includes('ik oankaar'));
  assert.ok(mool.includes('sat naam'));
  assert.ok(mool.includes('purakh'));
});

test('extractGurmukhiFirstLetters extracts base Gurmukhi initials without matras', () => {
  const letters = extractGurmukhiFirstLetters(
    'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ',
  );
  assert.equal(letters, 'ੲਸਨਕਪਨਨ');

  const hukamLetters = extractGurmukhiFirstLetters(
    'ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਓ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥',
  );
  assert.equal(hukamLetters, 'ਗਪਭਵਮਭਪ');
});

test('extractRomanFirstLetters extracts Latin word initials cleanly', () => {
  assert.equal(
    extractRomanFirstLetters(transliterateGurmukhi('ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥')),
    'asjs',
  );
  assert.equal(
    extractRomanFirstLetters(transliterateGurmukhi('ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ')),
    'snkp',
  );
});

test('toLarivaar joins words into continuous script', () => {
  assert.equal(
    toLarivaar('ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥'),
    'ਆਦਿਸਚੁਜੁਗਾਦਿਸਚੁ॥',
  );
});

test('tokenizeWithVishraam supports optional future in-house Vishraam marks without bundled copied data', () => {
  const tokens = tokenizeWithVishraam('ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ ॥', [
    { wordIndex: 1, type: 'secondary' },
    { wordIndex: 3, type: 'primary' },
  ]);
  assert.equal(tokens.length, 7);
  assert.equal(tokens[1].word, 'ਵੇਲਾ');
  assert.equal(tokens[1].vishraamType, 'secondary');
  assert.equal(tokens[3].word, 'ਨਾਉ');
  assert.equal(tokens[3].vishraamType, 'primary');
  assert.equal(tokens[0].vishraamType, null);
});

test('parseDirectAngQuery recognizes pure numbers and respectful Granth-prefixed Ang lookups', () => {
  assert.deepEqual(parseDirectAngQuery('611'), { ang: 611 });
  assert.deepEqual(parseDirectAngQuery('ang 1429'), { ang: 1429 });
  assert.deepEqual(parseDirectAngQuery('sggsj 1'), { granth: 'sggs', ang: 1 });
  assert.deepEqual(parseDirectAngQuery('sgdgsj 15'), { granth: 'dasam', ang: 15 });
  assert.deepEqual(parseDirectAngQuery('sgsgsj 112'), { granth: 'sarbloh', ang: 112 });
  assert.deepEqual(parseDirectAngQuery('sarbloh 1040'), { granth: 'sarbloh', ang: 1040 });
  assert.equal(parseDirectAngQuery('9999'), null);
  assert.equal(parseDirectAngQuery('dasam 1500'), null);
});

test('searchCorpus matches Gurmukhi first-letter, Roman first-letter, exact Gurmukhi, phonetic, and filters by Granth', () => {
  // First-letter Gurmukhi
  const flResults = searchCorpus('ਗਪਭਵ', 'all', GURBANI_CORPUS);
  assert.ok(flResults.length > 0);
  assert.equal(flResults[0].shabadId, 'sggs-611-hukamnama');
  assert.equal(flResults[0].matchType, 'first-letter-gurmukhi');

  // First-letter Roman (computed purely algorithmically from Unicode Gurmukhi)
  const romanFl = searchCorpus('snkp', 'all', GURBANI_CORPUS);
  assert.ok(romanFl.length > 0);
  assert.equal(romanFl[0].matchType, 'first-letter-roman');

  // Exact Gurmukhi
  const exactResults = searchCorpus('ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ', 'all', GURBANI_CORPUS);
  assert.ok(exactResults.length > 0);
  assert.equal(exactResults[0].granth, 'sarbloh');
  assert.equal(exactResults[0].matchType, 'exact-gurmukhi');

  // Algorithmic phonetic search
  const phoneticResults = searchCorpus('amrit', 'all', GURBANI_CORPUS);
  assert.ok(phoneticResults.length > 0);
  assert.equal(phoneticResults[0].matchType, 'phonetic');

  // Granth filter strictness
  const dasamOnly = searchCorpus('akal', 'dasam', FULL_SEARCH_CORPUS);
  assert.ok(dasamOnly.length > 0);
  assert.ok(dasamOnly.every((r) => r.granth === 'dasam'));
});

test('FULL_SEARCH_CORPUS indexes Shabads, Sundar Gutka Baanis, and Sampardai Ardaas with zero third-party copyright fields', () => {
  assert.ok(FULL_SEARCH_CORPUS.length > 50, `Expected > 50 entries, got ${FULL_SEARCH_CORPUS.length}`);
  assert.equal(FULL_CORPUS_STATS.totalShabads, FULL_SEARCH_CORPUS.length);
  assert.ok(FULL_CORPUS_STATS.totalTuks > 150, `Expected > 150 tuks, got ${FULL_CORPUS_STATS.totalTuks}`);

  // Verify zero legacy copyrighted properties exist on any Shabad or Tuk
  for (const shabad of FULL_SEARCH_CORPUS) {
    const rawShabad = shabad as unknown as Record<string, unknown>;
    assert.equal(rawShabad.audioUrl, undefined);
    assert.equal(rawShabad.audioLabel, undefined);
    for (const tuk of shabad.tuks) {
      const rawTuk = tuk as unknown as Record<string, unknown>;
      assert.equal(rawTuk.english, undefined);
      assert.equal(rawTuk.teeka, undefined);
      assert.equal(rawTuk.transliteration, undefined);
      assert.equal(rawTuk.vishraam, undefined);
    }
  }

  // Single-akhar Gurmukhi search (ਅ)
  const singleAkhar = searchCorpus('ਅ', 'all', FULL_SEARCH_CORPUS);
  assert.ok(singleAkhar.length > 0);
  assert.equal(singleAkhar[0].matchType, 'first-letter-gurmukhi');

  // Unpacked Sundar Gutka Baani indexed
  const baaniResults = searchCorpus('ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', 'all', FULL_SEARCH_CORPUS);
  assert.ok(baaniResults.some((r) => r.baaniId === 'tav-prasad-savaiye'));

  // Isolated Sampardai Ardaas indexed
  const ardaasResults = searchCorpus('ਪ੍ਰਿਥਮ ਭਗੌਤੀ ਸਿਮਰਿ ਕੈ', 'all', FULL_SEARCH_CORPUS);
  assert.ok(ardaasResults.some((r) => Boolean(r.pothiId)));
});
