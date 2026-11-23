import test from 'node:test';
import assert from 'node:assert/strict';
import { GURBANI_CORPUS } from '../data/gurbaniCorpus';
import {
  extractGurmukhiFirstLetters,
  extractRomanFirstLetters,
  parseDirectAngQuery,
  searchCorpus,
  toLarivaar,
  tokenizeWithVishraam,
} from './gurbaniSearch';

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
    extractRomanFirstLetters('aad sach jugaad sach.'),
    'asjs',
  );
  assert.equal(
    extractRomanFirstLetters('gur pooraa bhayti-o vadbhaagee'),
    'gpbov',
  );
});

test('toLarivaar joins words into continuous script', () => {
  assert.equal(
    toLarivaar('ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥'),
    'ਆਦਿਸਚੁਜੁਗਾਦਿਸਚੁ॥',
  );
});

test('tokenizeWithVishraam attaches primary and secondary pause markers accurately', () => {
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

test('parseDirectAngQuery recognizes pure numbers and Granth-prefixed Ang lookups', () => {
  assert.deepEqual(parseDirectAngQuery('611'), { ang: 611 });
  assert.deepEqual(parseDirectAngQuery('ang 1429'), { ang: 1429 });
  assert.deepEqual(parseDirectAngQuery('dasam 15'), { granth: 'dasam', ang: 15 });
  assert.deepEqual(parseDirectAngQuery('sarbloh 112'), { granth: 'sarbloh', ang: 112 });
  assert.equal(parseDirectAngQuery('9999'), null);
  assert.equal(parseDirectAngQuery('dasam 1500'), null);
});

test('searchCorpus matches Gurmukhi first-letter, exact Gurmukhi, phonetic, English, and filters by Granth', () => {
  // First-letter Gurmukhi
  const flResults = searchCorpus('ਗਪਭਵ', 'all', GURBANI_CORPUS);
  assert.ok(flResults.length > 0);
  assert.equal(flResults[0].shabadId, 'sggs-611-hukamnama');
  assert.equal(flResults[0].matchType, 'first-letter-gurmukhi');

  // Exact Gurmukhi
  const exactResults = searchCorpus('ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ', 'all', GURBANI_CORPUS);
  assert.ok(exactResults.length > 0);
  assert.equal(exactResults[0].granth, 'sarbloh');
  assert.equal(exactResults[0].matchType, 'exact-gurmukhi');

  // Phonetic
  const phoneticResults = searchCorpus('mitar pi-aaray', 'all', GURBANI_CORPUS);
  assert.ok(phoneticResults.length > 0);
  assert.equal(phoneticResults[0].shabadId, 'dasam-710-shabad-hazare');

  // Granth filter strictness
  const dasamOnly = searchCorpus('truth', 'dasam', GURBANI_CORPUS);
  assert.ok(dasamOnly.length > 0);
  assert.ok(dasamOnly.every((r) => r.granth === 'dasam'));
});
