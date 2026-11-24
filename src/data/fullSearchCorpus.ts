import { GURBANI_CORPUS } from './gurbaniCorpus';
import { NITNEM_AND_COLLECTIONS } from './nitnemBaanis';
import { SAMPARDAI_POTHIS } from './sampardaiPothis';
import type { GranthId, Shabad } from '../types/pothi';

/**
 * Additional landmark Shabads across Sri Guru Granth Sahib Ji, Sri Guru Dasam Granth Sahib Ji,
 * Sri Guru Sarabloh Granth Sahib Ji, Bhai Gurdas Ji Vaaran, and Bhai Nand Lal Ji so the Searcher
 * and Reader cover rich everyday Gurbani passages well beyond the initial 23-Shabad seed.
 */
const EXPANDED_LANDMARK_SHABADS: Shabad[] = [
  {
    id: 'sggs-13-gagan-mai-thaal',
    granth: 'sggs',
    ang: 13,
    titleGurmukhi: 'ਗਗਨ ਮੈ ਥਾਲੁ ਰਵਿ ਚੰਦੁ ਦੀਪਕ ਬਨੇ',
    titleEnglish: 'Aarti — The Cosmic Platter (Raag Dhanasri)',
    raag: 'Raag Dhanaasaree',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Sohila / Aarti',
    tuks: [
      {
        id: 'sggs-13-1',
        gurmukhi: 'ਗਗਨ ਮੈ ਥਾਲੁ ਰਵਿ ਚੰਦੁ ਦੀਪਕ ਬਨੇ ਤਾਰਿਕਾ ਮੰਡਲ ਜਨਕ ਮੋਤੀ ॥',
      },
      {
        id: 'sggs-13-2',
        gurmukhi: 'ਧੂਪੁ ਮਲਆਨਲੋ ਪਵਣੁ ਚਵਰੋ ਕਰੇ ਸਗਲ ਬਨਰਾਇ ਫੂਲੰਤ ਜੋਤੀ ॥੧॥',
      },
      {
        id: 'sggs-13-3',
        gurmukhi: 'ਕੈਸੀ ਆਰਤੀ ਹੋਇ ਭਵ ਖੰਡਨਾ ਤੇਰੀ ਆਰਤੀ ॥',
      },
    ],
  },
  {
    id: 'sggs-262-sukhmani-opening',
    granth: 'sggs',
    ang: 262,
    titleGurmukhi: 'ਆਦਿ ਗੁਰਏ ਨਮਹ ॥ ਜੁਗਾਦਿ ਗੁਰਏ ਨਮਹ ॥',
    titleEnglish: 'Sukhmani Sahib — Opening Salok & Ashtpadi 1',
    raag: 'Raag Gauri Sukhmani',
    author: 'Sri Guru Arjan Dev Ji',
    section: 'Ashtpadi 1',
    tuks: [
      {
        id: 'sggs-262-1',
        gurmukhi: 'ਆਦਿ ਗੁਰਏ ਨਮਹ ॥ ਜੁਗਾਦਿ ਗੁਰਏ ਨਮਹ ॥ ਸਤਿਗੁਰਏ ਨਮਹ ॥ ਸ੍ਰੀ ਗੁਰਦੇਵਏ ਨਮਹ ॥੧॥',
      },
      {
        id: 'sggs-262-2',
        gurmukhi: 'ਸਿਮਰਉ ਸਿਮਰਿ ਸਿਮਰਿ ਸੁਖੁ ਪਾਵਉ ॥ ਕਲਿ ਕਲੇਸ ਤਨ ਮਾਹਿ ਮਿਟਾਵਉ ॥',
      },
    ],
  },
  {
    id: 'sggs-628-taati-vao',
    granth: 'sggs',
    ang: 819,
    titleGurmukhi: 'ਤਾਤੀ ਵਾਉ ਨ ਲਗਈ ਪਾਰਬ੍ਰਹਮ ਸਰਣਾਈ ॥',
    titleEnglish: 'Taati Vao Na Lagaee (Raag Bilawal)',
    raag: 'Raag Bilawal',
    author: 'Sri Guru Arjan Dev Ji',
    section: 'Bilawal M.5',
    tuks: [
      {
        id: 'sggs-819-1',
        gurmukhi: 'ਤਾਤੀ ਵਾਉ ਨ ਲਗਈ ਪਾਰਬ੍ਰਹਮ ਸਰਣਾਈ ॥',
      },
      {
        id: 'sggs-819-2',
        gurmukhi: 'ਚਉਗਿਰਦ ਹਮਾਰੈ ਰਾਮ ਕਾਰ ਦੁਖੁ ਲਗੈ ਨ ਭਾਈ ॥੧॥',
      },
    ],
  },
  {
    id: 'sggs-722-tilang-yak-arj',
    granth: 'sggs',
    ang: 721,
    titleGurmukhi: 'ਯਕ ਅਰਜ ਗੁਫਤਮ ਪੇਸਿ ਤੋ ਦਰ ਗੋਸ ਕੁਨ ਕਰਤਾਰ ॥',
    titleEnglish: 'Yak Arj Guftam (Raag Tilang)',
    raag: 'Raag Tilang',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Tilang M.1',
    tuks: [
      {
        id: 'sggs-721-1',
        gurmukhi: 'ਯਕ ਅਰਜ ਗੁਫਤਮ ਪੇਸਿ ਤੋ ਦਰ ਗੋਸ ਕੁਨ ਕਰਤਾਰ ॥',
      },
      {
        id: 'sggs-721-2',
        gurmukhi: 'ਹਕਾ ਕਬੀਰ ਕਰੀਮ ਤੂ ਬੇਐਬ ਪਰਵਦਗਾਰ ॥੧॥',
      },
    ],
  },
  {
    id: 'sggs-917-anand-opening',
    granth: 'sggs',
    ang: 917,
    titleGurmukhi: 'ਅਨੰਦੁ ਭਇਆ ਮੇਰੀ ਮਾਏ ਸਤਿਗੁਰੂ ਮੈ ਪਾਇਆ ॥',
    titleEnglish: 'Anand Sahib — Pauri 1 (Raag Ramkali)',
    raag: 'Raag Raamkalee',
    author: 'Sri Guru Amar Das Ji',
    section: 'Anand Sahib',
    tuks: [
      {
        id: 'sggs-917-1',
        gurmukhi: 'ਅਨੰਦੁ ਭਇਆ ਮੇਰੀ ਮਾਏ ਸਤਿਗੁਰੂ ਮੈ ਪਾਇਆ ॥',
      },
      {
        id: 'sggs-917-2',
        gurmukhi: 'ਸਤਿਗੁਰੁ ਤ ਪਾਇਆ ਸਹਜ ਸੇਤੀ ਮਨਿ ਵਜੀਆ ਵਾਧਾਈਆ ॥',
      },
    ],
  },
  {
    id: 'sggs-1349-prabhati-aval-allah',
    granth: 'sggs',
    ang: 1349,
    titleGurmukhi: 'ਅਵਲਿ ਅਲਹ ਨੂਰੁ ਉਪਾਇਆ ਕੁਦਰਤਿ ਕੇ ਸਭ ਬੰਦੇ ॥',
    titleEnglish: 'Aval Allah Noor Upaiaa (Bhagat Kabir Ji)',
    raag: 'Raag Prabhati',
    author: 'Bhagat Kabir Ji',
    section: 'Prabhati Kabir Ji',
    tuks: [
      {
        id: 'sggs-1349-1',
        gurmukhi: 'ਅਵਲਿ ਅਲਹ ਨੂਰੁ ਉਪਾਇਆ ਕੁਦਰਤਿ ਕੇ ਸਭ ਬੰਦੇ ॥',
      },
      {
        id: 'sggs-1349-2',
        gurmukhi: 'ਏਕ ਨੂਰ ਤੇ ਸਭੁ ਜਗੁ ਉਪਜਿਆ ਕਉਨ ਭਲੇ ਕੋ ਮੰਦੇ ॥੧॥',
      },
    ],
  },
  {
    id: 'dasam-11-akal-ustat',
    granth: 'dasam',
    ang: 11,
    titleGurmukhi: 'ਅਕਾਲ ਪੁਰਖ ਕੀ ਰਛਾ ਹਮਨੈ ॥',
    titleEnglish: 'Akal Ustat — Opening Invocation',
    raag: 'Akal Ustat',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Akal Ustat',
    tuks: [
      {
        id: 'dasam-11-1',
        gurmukhi: 'ਅਕਾਲ ਪੁਰਖ ਕੀ ਰਛਾ ਹਮਨੈ ॥ ਸਰਬ ਲੋਹ ਦੀ ਰਛਿਆ ਹਮਨੈ ॥',
      },
      {
        id: 'dasam-11-2',
        gurmukhi: 'ਮਾਨਸ ਕੀ ਜਾਤ ਸਬੈ ਏਕੈ ਪਹਿਚਾਨਬੋ ॥',
      },
    ],
  },
  {
    id: 'dasam-717-shastar-naam-mala',
    granth: 'dasam',
    ang: 717,
    titleGurmukhi: 'ਖਗ ਖੰਡ ਬਿਹੰਡੰ ਖਲ ਦਲ ਖੰਡੰ ਅਤਿ ਰਣ ਮੰਡੰ ਬਰ ਬੰਡੰ ॥',
    titleEnglish: 'Shastar Naam Mala Puran (Opening)',
    raag: 'Shastar Naam Mala',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Shastar Naam Mala',
    tuks: [
      {
        id: 'dasam-717-1',
        gurmukhi: 'ਖਗ ਖੰਡ ਬਿਹੰਡੰ ਖਲ ਦਲ ਖੰਡੰ ਅਤਿ ਰਣ ਮੰਡੰ ਬਰ ਬੰਡੰ ॥',
      },
    ],
  },
  {
    id: 'dasam-1389-zafarnama',
    granth: 'dasam',
    ang: 1389,
    titleGurmukhi: 'ਚੁ ਕਾਰ ਅਜ਼ ਹਮਹ ਹੀਲਤੇ ਦਰ ਗੁਜ਼ਸ਼ਤ ॥',
    titleEnglish: 'Zafarnama — Righteousness of the Sword',
    raag: 'Zafarnama',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Epistle of Victory',
    tuks: [
      {
        id: 'dasam-1389-1',
        gurmukhi: 'ਚੁ ਕਾਰ ਅਜ਼ ਹਮਹ ਹੀਲਤੇ ਦਰ ਗੁਜ਼ਸ਼ਤ ॥ ਹਲਾਲ ਅਸਤ ਬੁਰਦਨ ਬ ਸ਼ਮਸ਼ੀਰ ਦਸਤ ॥੨੨॥',
      },
    ],
  },
  {
    id: 'sarbloh-530-khalsa-mahima',
    granth: 'sarbloh',
    ang: 530,
    titleGurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ ਹੈ ਖਾਸ ॥',
    titleEnglish: 'Khalsa Mahima — Sri Guru Sarabloh Granth Sahib Ji',
    raag: 'Sarbloh Manglacharan',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Khalsa Mahima',
    tuks: [
      {
        id: 'sarbloh-530-1',
        gurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ ਹੈ ਖਾਸ ॥ ਖਾਲਸੇ ਮਹਿ ਹੌ ਕਰੌ ਨਿਵਾਸ ॥',
      },
      {
        id: 'sarbloh-530-2',
        gurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਮੁਖ ਹੈ ਅੰਗਾ ॥ ਖਾਲਸੇ ਕੇ ਹੌ ਸਦ ਸਦ ਸੰਗਾ ॥',
      },
    ],
  },
  {
    id: 'bgv-11-pauri-1',
    granth: 'bgv',
    ang: 11,
    titleGurmukhi: 'ਸਚੁ ਸਚੇ ਦਾ ਸਚੁ ਢੋਆ ॥',
    titleEnglish: 'Vaar 11 — Devoted Gursikhs of the Guru',
    raag: 'Vaar 11',
    author: 'Bhai Gurdas Ji',
    section: 'Vaar 11 Pauri 1',
    tuks: [
      {
        id: 'bgv-11-1',
        gurmukhi: 'ਗੁਰਮੁਖਿ ਜਨਮੁ ਸਵਾਰਿ ਦਰਗਹ ਚਲਿਆ ॥',
      },
    ],
  },
  {
    id: 'bnl-1-ganjnama',
    granth: 'bnl',
    ang: 1,
    titleGurmukhi: 'ਨਾਸਰੋ ਮਨਸੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥',
    titleEnglish: 'Ganjnama — Praise of Sri Guru Gobind Singh Ji',
    raag: 'Ganjnama',
    author: 'Bhai Nand Lal Ji Goya',
    section: 'Ganjnama Patra 1',
    tuks: [
      {
        id: 'bnl-1-1',
        gurmukhi: 'ਨਾਸਰੋ ਮਨਸੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥ ਏਜ਼ਦੀ ਮਨਜ਼ੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥',
      },
    ],
  },
];

function buildBaaniSearchEntries(): Shabad[] {
  return NITNEM_AND_COLLECTIONS.map((baani) => ({
    id: `baani:${baani.id}`,
    granth: baani.granthSource,
    ang: 1,
    titleGurmukhi: baani.nameGurmukhi,
    titleEnglish: `${baani.nameEnglish} (Sundar Gutka)`,
    raag: baani.category === 'nitnem' ? 'Nitnem Sundar Gutka' : 'Additional Baani Collection',
    author: baani.timeOfDay,
    section: baani.description,
    tuks: baani.tuks,
    baaniId: baani.id,
  }));
}

function buildArdaasSearchEntries(): Shabad[] {
  return SAMPARDAI_POTHIS.map((pothi) => ({
    id: `ardaas:${pothi.id}`,
    granth: 'dasam' as GranthId,
    ang: pothi.index,
    titleGurmukhi: pothi.ardaas.titleGurmukhi,
    titleEnglish: `${pothi.ardaas.titleEnglish} (${pothi.name})`,
    raag: 'Sampardai Ardaas',
    author: pothi.name,
    section: pothi.lineage,
    tuks: pothi.ardaas.tuks,
    pothiId: pothi.id,
  }));
}

const existingIds = new Set(GURBANI_CORPUS.map((s) => s.id));

export const FULL_SEARCH_CORPUS: Shabad[] = [
  ...GURBANI_CORPUS,
  ...EXPANDED_LANDMARK_SHABADS.filter((s) => !existingIds.has(s.id)),
  ...buildBaaniSearchEntries(),
  ...buildArdaasSearchEntries(),
];

export const FULL_CORPUS_STATS = {
  totalShabads: FULL_SEARCH_CORPUS.length,
  totalTuks: FULL_SEARCH_CORPUS.reduce((acc, s) => acc + s.tuks.length, 0),
  byGranth: FULL_SEARCH_CORPUS.reduce(
    (acc, s) => {
      acc[s.granth] = (acc[s.granth] ?? 0) + 1;
      return acc;
    },
    { sggs: 0, dasam: 0, sarbloh: 0, bgv: 0, bnl: 0 } as Record<GranthId, number>,
  ),
};
