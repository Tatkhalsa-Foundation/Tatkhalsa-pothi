import { GRANTH_CATALOG } from '../data/gurbaniCorpus';
import type {
  GranthId,
  SearchMatchType,
  SearchResult,
  Shabad,
  VishraamMark,
} from '../types/pothi';

const GURMUKHI_BASE_LETTER_RE = /[\u0A05-\u0A39\u0A59-\u0A5E\u0A72-\u0A74]/;
const GURMUKHI_MATRA_RE = /[\u0A01-\u0A03\u0A3C\u0A3E-\u0A4D\u0A51\u0A70\u0A71\u0A75]/g;
const GURMUKHI_CHAR_RE = /[\u0A00-\u0A7F]/;

export interface VishraamToken {
  word: string;
  vishraamType: 'primary' | 'secondary' | null;
}

/**
 * Strips Gurmukhi vowel signs, nasalization marks, and nuktas so users can match
 * base Gurmukhi consonants smoothly during first-letter or loose Gurmukhi search.
 */
export function stripGurmukhiMatras(text: string): string {
  return text.replace(GURMUKHI_MATRA_RE, '');
}

/**
 * Extracts the first base Gurmukhi letter of every Gurmukhi word in a Tuk.
 * Example: "ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ" -> "ਸਨਕਪ"
 */
export function extractGurmukhiFirstLetters(text: string): string {
  const words = text.trim().split(/\s+/);
  const letters: string[] = [];

  for (const rawWord of words) {
    if (!rawWord) continue;
    if (rawWord.startsWith('ੴ')) {
      letters.push('ੲ');
      continue;
    }
    const stripped = stripGurmukhiMatras(rawWord);
    const match = stripped.match(GURMUKHI_BASE_LETTER_RE);
    if (match) {
      letters.push(match[0]);
    }
  }

  return letters.join('');
}

/**
 * Extracts the first ASCII letter of every word in a Romanized transliteration.
 * Example: "aad sach jugaad sach." -> "asjs"
 */
export function extractRomanFirstLetters(transliteration: string): string {
  const words = transliteration
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .trim()
    .split(/\s+/);
  let out = '';
  for (const word of words) {
    if (word.length > 0) {
      out += word[0];
    }
  }
  return out;
}

/**
 * Transforms Pad Ched (spaced) Gurmukhi into continuous Larivaar script.
 */
export function toLarivaar(gurmukhi: string): string {
  return gurmukhi.trim().replace(/\s+/g, '');
}

/**
 * Tokenizes a Gurmukhi Tuk into Pad Ched words tagged with optional Vishraam pause markers.
 */
export function tokenizeWithVishraam(
  gurmukhi: string,
  vishraam?: VishraamMark[],
): VishraamToken[] {
  const words = gurmukhi.trim().split(/\s+/).filter(Boolean);
  const markMap = new Map<number, 'primary' | 'secondary'>();
  if (vishraam) {
    for (const mark of vishraam) {
      markMap.set(mark.wordIndex, mark.type);
    }
  }
  return words.map((word, idx) => ({
    word,
    vishraamType: markMap.get(idx) ?? null,
  }));
}

export interface DirectAngTarget {
  granth?: GranthId;
  ang: number;
}

/**
 * Parses direct Ang / Page jump queries such as "611", "ang 262", "sggs 1429",
 * "dasam 15", "sarbloh 112", "vaar 1", or "bnl 12".
 */
export function parseDirectAngQuery(query: string): DirectAngTarget | null {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;

  const pureNum = clean.match(/^(\d{1,4})$/);
  if (pureNum) {
    const ang = Number.parseInt(pureNum[1], 10);
    if (ang >= 1 && ang <= 1430) {
      return { ang };
    }
    return null;
  }

  const prefixed = clean.match(
    /^(sggs|dasam|sarbloh|bgv|vaar|bnl|ang|page|p)\s*[:#-]?\s*(\d{1,4})$/,
  );
  if (!prefixed) return null;

  const prefix = prefixed[1];
  const ang = Number.parseInt(prefixed[2], 10);
  if (Number.isNaN(ang) || ang < 1) return null;

  let granth: GranthId | undefined;
  if (prefix === 'sggs') granth = 'sggs';
  else if (prefix === 'dasam') granth = 'dasam';
  else if (prefix === 'sarbloh') granth = 'sarbloh';
  else if (prefix === 'bgv' || prefix === 'vaar') granth = 'bgv';
  else if (prefix === 'bnl') granth = 'bnl';

  const maxAllowed = granth ? GRANTH_CATALOG[granth].maxAng : 1430;
  if (ang > maxAllowed) return null;

  return granth ? { granth, ang } : { ang };
}

export interface IndexedTukEntry {
  shabad: Shabad;
  tukIndex: number;
  gurmukhiFirstLetters: string;
  gurmukhiStripped: string;
  romanFirstLetters: string;
  romanLower: string;
  englishLower: string;
  metaLower: string;
}

export function buildSearchIndex(corpus: Shabad[]): IndexedTukEntry[] {
  const index: IndexedTukEntry[] = [];
  for (const shabad of corpus) {
    const metaLower =
      `${shabad.titleEnglish} ${shabad.raag} ${shabad.author} ${shabad.section ?? ''}`.toLowerCase();
    for (let i = 0; i < shabad.tuks.length; i += 1) {
      const tuk = shabad.tuks[i];
      index.push({
        shabad,
        tukIndex: i,
        gurmukhiFirstLetters: extractGurmukhiFirstLetters(tuk.gurmukhi),
        gurmukhiStripped: stripGurmukhiMatras(tuk.gurmukhi),
        romanFirstLetters: extractRomanFirstLetters(tuk.transliteration),
        romanLower: tuk.transliteration.toLowerCase(),
        englishLower: `${tuk.english} ${tuk.teeka}`.toLowerCase(),
        metaLower,
      });
    }
  }
  return index;
}

/**
 * Pure, deterministic client-side Gurbani search supporting:
 * 1. Direct Ang / Page jump
 * 2. First-letter Gurmukhi search (e.g., "ਸਨਕਪ" or "ਗਪਭਵ")
 * 3. First-letter Roman search (e.g., "snkp" or "gpbv")
 * 4. Exact Gurmukhi substring search (with or without matras)
 * 5. Phonetic / Romanized substring search
 * 6. English translation & metadata keyword search
 */
export function searchCorpus(
  rawQuery: string,
  granthFilter: GranthId | 'all',
  corpus: Shabad[],
  precomputedIndex?: IndexedTukEntry[],
): SearchResult[] {
  const query = rawQuery.trim();
  if (!query) return [];

  const index = precomputedIndex ?? buildSearchIndex(corpus);
  const directAng = parseDirectAngQuery(query);
  const isGurmukhiQuery = GURMUKHI_CHAR_RE.test(query);
  const queryLower = query.toLowerCase();
  const queryNoSpace = queryLower.replace(/\s+/g, '');
  const gurmukhiQueryStripped = stripGurmukhiMatras(query).replace(/\s+/g, '');

  const results: SearchResult[] = [];
  const seenShabadTuks = new Set<string>();

  for (const entry of index) {
    if (granthFilter !== 'all' && entry.shabad.granth !== granthFilter) {
      continue;
    }

    const tuk = entry.shabad.tuks[entry.tukIndex];
    let matchType: SearchMatchType | null = null;
    let score = 0;

    // 1. Direct Ang match (surface first tuk of matching Ang)
    if (
      directAng &&
      entry.tukIndex === 0 &&
      entry.shabad.ang === directAng.ang &&
      (!directAng.granth || entry.shabad.granth === directAng.granth)
    ) {
      matchType = 'direct-ang';
      score = 120;
    }

    // 2. Gurmukhi queries: First-letter Gurmukhi & Exact Gurmukhi
    if (!matchType && isGurmukhiQuery) {
      const normalizedQueryBase = stripGurmukhiMatras(query).replace(/\s+/g, '');
      if (tuk.gurmukhi.includes(query)) {
        matchType = 'exact-gurmukhi';
        score = 110;
      } else if (
        normalizedQueryBase.length >= 2 &&
        entry.gurmukhiFirstLetters.includes(normalizedQueryBase)
      ) {
        matchType = 'first-letter-gurmukhi';
        score = entry.gurmukhiFirstLetters.startsWith(normalizedQueryBase) ? 105 : 95;
      } else if (
        gurmukhiQueryStripped.length >= 2 &&
        entry.gurmukhiStripped.replace(/\s+/g, '').includes(gurmukhiQueryStripped)
      ) {
        matchType = 'exact-gurmukhi';
        score = 88;
      }
    }

    // 3. Latin queries: First-letter Roman, Phonetic/Transliteration, English/Metadata
    if (!matchType && !isGurmukhiQuery) {
      const isAlphaOnly = /^[a-z]+$/.test(queryNoSpace);

      if (entry.romanLower.includes(queryLower)) {
        matchType = 'phonetic';
        score = entry.romanLower.startsWith(queryLower) ? 100 : 90;
      } else if (
        isAlphaOnly &&
        queryNoSpace.length >= 2 &&
        queryNoSpace.length <= 12 &&
        entry.romanFirstLetters.includes(queryNoSpace)
      ) {
        matchType = 'first-letter-roman';
        score = entry.romanFirstLetters.startsWith(queryNoSpace) ? 98 : 86;
      } else if (entry.englishLower.includes(queryLower)) {
        matchType = 'english';
        score = 78;
      } else if (entry.tukIndex === 0 && entry.metaLower.includes(queryLower)) {
        matchType = 'english';
        score = 72;
      }
    }

    if (matchType) {
      const dedupeKey = `${entry.shabad.id}:${tuk.id}`;
      if (!seenShabadTuks.has(dedupeKey)) {
        seenShabadTuks.add(dedupeKey);
        results.push({
          shabadId: entry.shabad.id,
          tukId: tuk.id,
          granth: entry.shabad.granth,
          ang: entry.shabad.ang,
          raag: entry.shabad.raag,
          author: entry.shabad.author,
          titleGurmukhi: entry.shabad.titleGurmukhi,
          titleEnglish: entry.shabad.titleEnglish,
          matchedTuk: tuk,
          matchType,
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score || a.ang - b.ang);
}
