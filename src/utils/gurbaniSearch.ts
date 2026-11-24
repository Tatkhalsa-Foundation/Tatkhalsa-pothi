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

const CONSONANT_MAP: Record<string, string> = {
  ਕ: 'k',
  ਖ: 'kh',
  ਗ: 'g',
  ਘ: 'gh',
  ਙ: 'ng',
  ਚ: 'ch',
  ਛ: 'chh',
  ਜ: 'j',
  ਝ: 'jh',
  ਞ: 'ny',
  ਟ: 't',
  ਠ: 'th',
  ਡ: 'd',
  ਢ: 'dh',
  ਣ: 'n',
  ਤ: 't',
  ਥ: 'th',
  ਦ: 'd',
  ਧ: 'dh',
  ਨ: 'n',
  ਪ: 'p',
  ਫ: 'ph',
  ਬ: 'b',
  ਭ: 'bh',
  ਮ: 'm',
  ਯ: 'y',
  ਰ: 'r',
  ਲ: 'l',
  ਲ਼: 'l',
  ਵ: 'v',
  ਸ਼: 'sh',
  ਸ: 's',
  ਹ: 'h',
  ਖ਼: 'kh',
  ਗ਼: 'gh',
  ਜ਼: 'z',
  ੜ: 'r',
  ਫ਼: 'f',
};

const NUKTA_MAP: Record<string, string> = {
  ਸ: 'sh',
  ਖ: 'kh',
  ਗ: 'gh',
  ਜ: 'z',
  ਫ: 'f',
  ਲ: 'l',
};

const INDEPENDENT_VOWEL_MAP: Record<string, string> = {
  ਅ: 'a',
  ਆ: 'aa',
  ਇ: 'i',
  ਈ: 'ee',
  ਉ: 'u',
  ਊ: 'oo',
  ਏ: 'e',
  ਐ: 'ai',
  ਓ: 'o',
  ਔ: 'au',
};

const MATRA_MAP: Record<string, string> = {
  'ਾ': 'aa',
  'ਿ': 'i',
  'ੀ': 'ee',
  'ੁ': 'u',
  'ੂ': 'oo',
  'ੇ': 'e',
  'ੈ': 'ai',
  'ੋ': 'o',
  'ੌ': 'au',
};

const DIGIT_MAP: Record<string, string> = {
  '੦': '0',
  '੧': '1',
  '੨': '2',
  '੩': '3',
  '੪': '4',
  '੫': '5',
  '੬': '6',
  '੭': '7',
  '੮': '8',
  '੯': '9',
};

const LABIAL_CONSONANTS = new Set(['ਪ', 'ਫ', 'ਬ', 'ਭ', 'ਮ']);

function transliterateWord(word: string): string {
  if (!word) return '';
  if (word === 'ੴ') return 'ik oankaar';
  if (word === '॥') return '||';
  if (word === '।') return '|';

  const chars = Array.from(word);
  let out = '';
  let unitCount = 0;

  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (ch === 'ੴ') {
      out += 'ik oankaar';
      continue;
    }
    if (ch === '॥') {
      out += '||';
      continue;
    }
    if (ch === '।') {
      out += '|';
      continue;
    }
    if (DIGIT_MAP[ch]) {
      out += DIGIT_MAP[ch];
      continue;
    }

    // Addak doubles the onset of the next consonant
    if (ch === 'ੱ') {
      const next = chars[i + 1];
      if (next && CONSONANT_MAP[next]) {
        out += CONSONANT_MAP[next][0];
      }
      continue;
    }

    // Independent vowels and vowel carriers (ੲ, ੳ)
    if (INDEPENDENT_VOWEL_MAP[ch] || ch === 'ੲ' || ch === 'ੳ') {
      unitCount += 1;
      let vowel = INDEPENDENT_VOWEL_MAP[ch] ?? '';
      const next = chars[i + 1];
      if (next && MATRA_MAP[next]) {
        vowel = MATRA_MAP[next];
        i += 1;
      } else if (ch === 'ੲ') {
        vowel = 'i';
      } else if (ch === 'ੳ') {
        vowel = 'u';
      }
      out += vowel;
      continue;
    }

    // Tippi / Bindi nasalization
    if (ch === 'ੰ' || ch === 'ਂ' || ch === 'ਁ') {
      const next = chars[i + 1];
      out += next && LABIAL_CONSONANTS.has(next) ? 'm' : 'n';
      continue;
    }

    // Visarga / Udaat / Yakash
    if (ch === 'ੵ') {
      out += 'y';
      continue;
    }
    if (ch === 'ਃ' || ch === 'ੑ') {
      continue;
    }

    // Consonants (with optional nukta, halant, or matra)
    if (CONSONANT_MAP[ch]) {
      unitCount += 1;
      let base = CONSONANT_MAP[ch];
      let nextIdx = i + 1;

      if (chars[nextIdx] === '਼') {
        base = NUKTA_MAP[ch] ?? base;
        nextIdx += 1;
      }

      const after = chars[nextIdx];
      if (after === '੍') {
        // Halant suppresses inherent vowel (conjunct like ਪ੍ਰ / ਮ੍ਰ)
        out += base;
        i = nextIdx;
        continue;
      }

      if (after && MATRA_MAP[after]) {
        const isLastUnit = nextIdx === chars.length - 1;
        // Omit silent grammatical final sihari/aunkar on multi-unit Gurbani words
        if (isLastUnit && unitCount > 1 && (after === 'ਿ' || after === 'ੁ')) {
          out += base;
        } else {
          out += base + MATRA_MAP[after];
        }
        i = nextIdx;
        continue;
      }

      // Inherent 'a' if followed by another Gurmukhi letter/modifier inside the word
      const hasMoreLetters =
        nextIdx < chars.length &&
        chars[nextIdx] !== '॥' &&
        chars[nextIdx] !== '।' &&
        !DIGIT_MAP[chars[nextIdx]];

      if (hasMoreLetters) {
        out += `${base}a`;
      } else {
        out += base;
      }
      i = nextIdx - 1;
      continue;
    }

    // Fallback for ASCII / punctuation
    if (!MATRA_MAP[ch] && ch !== '਼' && ch !== '੍') {
      out += ch;
    }
  }

  return out;
}

/**
 * Deterministic, self-contained Unicode Gurmukhi -> Roman phonetic transliteration.
 * Computed purely algorithmically from raw public-domain Unicode Gurmukhi text
 * without any stored third-party transliteration or translation data.
 */
export function transliterateGurmukhi(gurmukhi: string): string {
  const words = gurmukhi.trim().split(/\s+/).filter(Boolean);
  return words.map(transliterateWord).join(' ');
}

/**
 * Normalizes Roman phonetic strings so variant spellings (e.g. "waheguru" vs "vaahiguroo",
 * "khalsa" vs "khaalasaa", "satnam" vs "sat naam") match reliably.
 */
export function normalizePhonetic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/w/g, 'v')
    .replace(/aa+/g, 'a')
    .replace(/ee+/g, 'i')
    .replace(/oo+/g, 'u')
    .replace(/sh/g, 's');
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
 * Extracts the first ASCII letter of every word in a Romanized phonetic string.
 * Example: "aad sach jugaad sach" -> "asjs"
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
 * Tokenizes a Gurmukhi Tuk into Pad Ched words tagged with optional in-house Vishraam markers.
 */
export function tokenizeWithVishraam(
  gurmukhi: string,
  inHouseVishraam?: VishraamMark[],
): VishraamToken[] {
  const words = gurmukhi.trim().split(/\s+/).filter(Boolean);
  const markMap = new Map<number, 'primary' | 'secondary'>();
  if (inHouseVishraam) {
    for (const mark of inHouseVishraam) {
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
 * Parses direct Ang / Page jump queries such as "611", "ang 262", "sggsj 1429",
 * "sgdgsj 15", "sgsgsj 112", "vaar 1", or "bnl 12".
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
    /^(sggsj|sggs|sgdgsj|dasam|sgsgsj|sarbloh|sarabloh|bgv|vaar|bnl|ang|page|p)\s*[:#-]?\s*(\d{1,4})$/,
  );
  if (!prefixed) return null;

  const prefix = prefixed[1];
  const ang = Number.parseInt(prefixed[2], 10);
  if (Number.isNaN(ang) || ang < 1) return null;

  let granth: GranthId | undefined;
  if (prefix === 'sggs' || prefix === 'sggsj') granth = 'sggs';
  else if (prefix === 'dasam' || prefix === 'sgdgsj') granth = 'dasam';
  else if (prefix === 'sarbloh' || prefix === 'sarabloh' || prefix === 'sgsgsj') granth = 'sarbloh';
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
  phoneticNormalized: string;
  metaLower: string;
}

export function buildSearchIndex(corpus: Shabad[]): IndexedTukEntry[] {
  const index: IndexedTukEntry[] = [];
  for (const shabad of corpus) {
    const metaLower =
      `${shabad.titleEnglish} ${shabad.raag} ${shabad.author} ${shabad.section ?? ''}`.toLowerCase();
    for (let i = 0; i < shabad.tuks.length; i += 1) {
      const tuk = shabad.tuks[i];
      const roman = transliterateGurmukhi(tuk.gurmukhi);
      index.push({
        shabad,
        tukIndex: i,
        gurmukhiFirstLetters: extractGurmukhiFirstLetters(tuk.gurmukhi),
        gurmukhiStripped: stripGurmukhiMatras(tuk.gurmukhi),
        romanFirstLetters: extractRomanFirstLetters(roman),
        romanLower: roman.toLowerCase(),
        phoneticNormalized: normalizePhonetic(roman),
        metaLower,
      });
    }
  }
  return index;
}

/**
 * Pure, deterministic client-side Gurbani search derived 100% from raw public-domain
 * Unicode Gurmukhi scripture text:
 * 1. Direct Ang / Page jump
 * 2. First-letter Gurmukhi search (single-akhar e.g. "ਅ" or multi-akhar "ਸਨਕਪ" / "ਗਪਭਵ")
 * 3. First-letter Roman search (e.g., "snkp" or "asjs")
 * 4. Exact Gurmukhi word/substring search (with or without matras)
 * 5. Algorithmic Phonetic / Romanized substring search & title/raag metadata
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
  const queryPhonetic = normalizePhonetic(query);
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
      !entry.shabad.baaniId &&
      !entry.shabad.pothiId &&
      entry.shabad.ang === directAng.ang &&
      (!directAng.granth || entry.shabad.granth === directAng.granth)
    ) {
      matchType = 'direct-ang';
      score = 120;
    }

    // 2. Gurmukhi queries: First-letter Gurmukhi and Exact Gurmukhi
    if (!matchType && isGurmukhiQuery) {
      const normalizedQueryBase = stripGurmukhiMatras(query).replace(/\s+/g, '');
      if (normalizedQueryBase.length === 1) {
        if (entry.gurmukhiFirstLetters.startsWith(normalizedQueryBase)) {
          matchType = 'first-letter-gurmukhi';
          score = 112;
        } else if (entry.gurmukhiFirstLetters.includes(normalizedQueryBase)) {
          matchType = 'first-letter-gurmukhi';
          score = 96;
        } else if (tuk.gurmukhi.includes(query)) {
          matchType = 'exact-gurmukhi';
          score = 84;
        }
      } else if (tuk.gurmukhi.includes(query)) {
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
      } else if (
        entry.tukIndex === 0 &&
        (entry.shabad.titleGurmukhi.includes(query) ||
          (gurmukhiQueryStripped.length >= 2 &&
            stripGurmukhiMatras(entry.shabad.titleGurmukhi)
              .replace(/\s+/g, '')
              .includes(gurmukhiQueryStripped)))
      ) {
        matchType = 'exact-gurmukhi';
        score = 86;
      }
    }

    // 3. Latin queries: First-letter Roman, Algorithmic Phonetic, and Title/Raag metadata
    if (!matchType && !isGurmukhiQuery) {
      const isAlphaOnly = /^[a-z]+$/.test(queryNoSpace);

      if (entry.romanLower.includes(queryLower)) {
        matchType = 'phonetic';
        score = entry.romanLower.startsWith(queryLower) ? 102 : 92;
      } else if (
        isAlphaOnly &&
        queryNoSpace.length >= 2 &&
        queryNoSpace.length <= 12 &&
        entry.romanFirstLetters.includes(queryNoSpace)
      ) {
        matchType = 'first-letter-roman';
        score = entry.romanFirstLetters.startsWith(queryNoSpace) ? 98 : 88;
      } else if (
        queryPhonetic.length >= 3 &&
        entry.phoneticNormalized.includes(queryPhonetic)
      ) {
        matchType = 'phonetic';
        score = entry.phoneticNormalized.startsWith(queryPhonetic) ? 90 : 82;
      } else if (entry.tukIndex === 0 && entry.metaLower.includes(queryLower)) {
        matchType = 'phonetic';
        score = 74;
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
          baaniId: entry.shabad.baaniId,
          pothiId: entry.shabad.pothiId,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score || a.ang - b.ang);
}
