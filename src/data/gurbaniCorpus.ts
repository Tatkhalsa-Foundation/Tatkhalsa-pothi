import type { GranthId, GranthMeta, Shabad } from '../types/pothi';

export const GRANTH_CATALOG: Record<GranthId, GranthMeta> = {
  sggs: {
    id: 'sggs',
    shortName: 'Sri Guru Granth Sahib Ji',
    fullName: 'Sri Guru Granth Sahib Ji',
    gurmukhiName: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    maxAng: 1430,
    unitLabel: 'Ang',
    description: 'Eternal Shabad Guru — 1,430 Angs across 31 classical Raags.',
  },
  dasam: {
    id: 'dasam',
    shortName: 'Sri Guru Dasam Granth Sahib Ji',
    fullName: 'Sri Guru Dasam Granth Sahib Ji',
    gurmukhiName: 'ਸ੍ਰੀ ਗੁਰੂ ਦਸਮ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    maxAng: 1428,
    unitLabel: 'Ang',
    description: 'Baani of Sri Guru Gobind Singh Ji — Jaap Sahib, Akal Ustat, Chaupai Sahib, Chandi Di Var.',
  },
  sarbloh: {
    id: 'sarbloh',
    shortName: 'Sri Guru Sarabloh Granth Sahib Ji',
    fullName: 'Sri Guru Sarabloh Granth Sahib Ji',
    gurmukhiName: 'ਸ੍ਰੀ ਗੁਰੂ ਸਰਬਲੋਹ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    maxAng: 1040,
    unitLabel: 'Ang',
    description: 'Sri Manglacharan Puran & Khalsa Mahima preserved in Puratan Dal Panth tradition.',
  },
  bgv: {
    id: 'bgv',
    shortName: 'Bhai Gurdas Ji Vaaran',
    fullName: 'Vaaran Bhai Gurdas Ji',
    gurmukhiName: 'ਵਾਰਾਂ ਭਾਈ ਗੁਰਦਾਸ ਜੀ',
    maxAng: 40,
    unitLabel: 'Vaar',
    description: 'Key to Gurbani — 40 heroic Vaars illuminating Gurmat philosophy and Sikh history.',
  },
  bnl: {
    id: 'bnl',
    shortName: 'Bhai Nand Lal Ji',
    fullName: 'Baani Bhai Nand Lal Ji Goya',
    gurmukhiName: 'ਬਾਣੀ ਭਾਈ ਨੰਦ ਲਾਲ ਜੀ',
    maxAng: 50,
    unitLabel: 'Patra',
    description: 'Ganjnama, Zindaginama, Tankhahnama & Rehatnama of Darbari poet Bhai Nand Lal Ji.',
  },
};

export const GRANTH_LIST: GranthMeta[] = [
  GRANTH_CATALOG.sggs,
  GRANTH_CATALOG.dasam,
  GRANTH_CATALOG.sarbloh,
  GRANTH_CATALOG.bgv,
  GRANTH_CATALOG.bnl,
];

export const SGGS_RAAG_SECTIONS: Array<{ start: number; end: number; raag: string; gurmukhi: string }> = [
  { start: 1, end: 13, raag: 'Nitnem (Jap, Sodar, Sohila)', gurmukhi: 'ਨਿਤਨੇਮ ਬਾਣੀਆਂ' },
  { start: 14, end: 93, raag: 'Sri Raag', gurmukhi: 'ਸਿਰੀਰਾਗੁ' },
  { start: 94, end: 150, raag: 'Raag Maajh', gurmukhi: 'ਰਾਗੁ ਮਾਝ' },
  { start: 151, end: 346, raag: 'Raag Gauri', gurmukhi: 'ਰਾਗੁ ਗਉੜੀ' },
  { start: 347, end: 488, raag: 'Raag Aasaa', gurmukhi: 'ਰਾਗੁ ਆਸਾ' },
  { start: 489, end: 526, raag: 'Raag Goojaree', gurmukhi: 'ਰਾਗੁ ਗੂਜਰੀ' },
  { start: 527, end: 594, raag: 'Raag Devgandhari & Bihagra & Wadhans', gurmukhi: 'ਦੇਵਗੰਧਾਰੀ, ਬਿਹਾਗੜਾ, ਵਡਹੰਸ' },
  { start: 595, end: 659, raag: 'Raag Sorath', gurmukhi: 'ਰਾਗੁ ਸੋਰਠਿ' },
  { start: 660, end: 695, raag: 'Raag Dhanaasaree', gurmukhi: 'ਰਾਗੁ ਧਨਾਸਰੀ' },
  { start: 696, end: 794, raag: 'Raag Jaitsri, Todi, Tilang & Suhi', gurmukhi: 'ਜੈਤਸਰੀ, ਟੋਡੀ, ਤਿਲੰਗ, ਸੂਹੀ' },
  { start: 795, end: 875, raag: 'Raag Bilawal & Gond', gurmukhi: 'ਬਿਲਾਵਲੁ ਅਤੇ ਗੋਂਡ' },
  { start: 876, end: 974, raag: 'Raag Raamkalee', gurmukhi: 'ਰਾਗੁ ਰਾਮਕਲੀ' },
  { start: 975, end: 1167, raag: 'Raag Nat, Mali Gaura, Maru, Tukhari & Bhairo', gurmukhi: 'ਮਾਰੂ, ਤੁਖਾਰੀ, ਭੈਰਉ' },
  { start: 1168, end: 1352, raag: 'Raag Basant, Sarang, Malar, Kaanra & Prabhati', gurmukhi: 'ਬਸੰਤੁ, ਸਾਰੰਗ, ਮਲਾਰ, ਪ੍ਰਭਾਤੀ' },
  { start: 1353, end: 1430, raag: 'Salok Sahaskriti, Savaiye, Salok M.9 & Mundavani', gurmukhi: 'ਸਲੋਕ, ਸਵਈਏ, ਮੁੰਦਾਵਣੀ' },
];

export function getRaagForSggsAng(ang: number): { raag: string; gurmukhi: string } {
  const clamped = Math.max(1, Math.min(1430, Math.floor(ang)));
  const found = SGGS_RAAG_SECTIONS.find((s) => clamped >= s.start && clamped <= s.end);
  return found ?? SGGS_RAAG_SECTIONS[0];
}

export const GURBANI_CORPUS: Shabad[] = [
  {
    id: 'sggs-1-japji',
    granth: 'sggs',
    ang: 1,
    titleGurmukhi: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ — ਜਪੁ',
    titleEnglish: 'Mool Mantar & Japneesan (Opening)',
    raag: 'Jap (Nitnem)',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Mool Mantar & Pauri 1',
    tuks: [
      {
        id: 'sggs-1-1',
        gurmukhi: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
      },
      {
        id: 'sggs-1-2',
        gurmukhi: '॥ ਜਪੁ ॥',
      },
      {
        id: 'sggs-1-3',
        gurmukhi: 'ਆਦਿ ਸਚੁ ਜੁਗਾਦਿ ਸਚੁ ॥',
      },
      {
        id: 'sggs-1-4',
        gurmukhi: 'ਹੈ ਭੀ ਸਚੁ ਨਾਨਕ ਹੋਸੀ ਭੀ ਸਚੁ ॥੧॥',
      },
      {
        id: 'sggs-1-5',
        gurmukhi: 'ਸੋਚੈ ਸੋਚਿ ਨ ਹੋਵਈ ਜੇ ਸੋਚੀ ਲਖ ਵਾਰ ॥',
      },
      {
        id: 'sggs-1-6',
        gurmukhi: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਖਿਆ ਨਾਲਿ ॥੧॥',
      },
    ],
  },
  {
    id: 'sggs-2-hukami',
    granth: 'sggs',
    ang: 2,
    titleGurmukhi: 'ਹੁਕਮੀ ਹੋਵਨਿ ਆਕਾਰ ਹੁਕਮੁ ਨ ਕਹਿਆ ਜਾਈ ॥',
    titleEnglish: 'Japneesan — Pauri 2 & 4 (Hukam & Amrit Vela)',
    raag: 'Jap (Nitnem)',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Pauri 2 & 4',
    tuks: [
      {
        id: 'sggs-2-1',
        gurmukhi: 'ਹੁਕਮੀ ਹੋਵਨਿ ਆਕਾਰ ਹੁਕਮੁ ਨ ਕਹਿਆ ਜਾਈ ॥',
      },
      {
        id: 'sggs-2-2',
        gurmukhi: 'ਨਾਨਕ ਹੁਕਮੈ ਜੇ ਬੁਝੈ ਤ ਹਉਮੈ ਕਹੈ ਨ ਕੋਇ ॥੨॥',
      },
      {
        id: 'sggs-2-3',
        gurmukhi: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ ॥',
      },
      {
        id: 'sggs-2-4',
        gurmukhi: 'ਕਰਮੀ ਆਵੈ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ ॥',
      },
    ],
  },
  {
    id: 'sggs-8-sodar',
    granth: 'sggs',
    ang: 8,
    titleGurmukhi: 'ਸੋ ਦਰੁ ਰਾਗੁ ਆਸਾ ਮਹਲਾ ੧',
    titleEnglish: 'So Dar — Raag Aasaa Mahalla 1',
    raag: 'Raag Aasaa',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Sodar (Rehras Opening)',
    tuks: [
      {
        id: 'sggs-8-1',
        gurmukhi: 'ਸੋ ਦਰੁ ਰਾਗੁ ਆਸਾ ਮਹਲਾ ੧ ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
      },
      {
        id: 'sggs-8-2',
        gurmukhi: 'ਸੋ ਦਰੁ ਤੇਰਾ ਕੇਹਾ ਸੋ ਘਰੁ ਕੇਹਾ ਜਿਤੁ ਬਹਿ ਸਰਬ ਸਮਾਲੇ ॥',
      },
      {
        id: 'sggs-8-3',
        gurmukhi: 'ਵਾਜੇ ਤੇਰੇ ਨਾਦ ਅਨੇਕ ਅਸੰਖਾ ਕੇਤੇ ਤੇਰੇ ਵਾਵਣਹਾਰੇ ॥',
      },
      {
        id: 'sggs-8-4',
        gurmukhi: 'ਸੋਈ ਸੋਈ ਸਦਾ ਸਚੁ ਸਾਹਿਬੁ ਸਾਚਾ ਸਾਚੀ ਨਾਈ ॥',
      },
    ],
  },
  {
    id: 'sggs-12-sohila',
    granth: 'sggs',
    ang: 12,
    titleGurmukhi: 'ਸੋਹਿਲਾ ਰਾਗੁ ਗਉੜੀ ਦੀਪਕੀ ਮਹਲਾ ੧',
    titleEnglish: 'Sohila — Raag Gauri Deepaki Mahalla 1',
    raag: 'Raag Gauri Deepaki',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Kirtan Sohila',
    tuks: [
      {
        id: 'sggs-12-1',
        gurmukhi: 'ਜੈ ਘਰਿ ਕੀਰਤਿ ਆਖੀਐ ਕਰਤੇ ਕਾ ਹੋਇ ਬੀਚਾਰੋ ॥',
      },
      {
        id: 'sggs-12-2',
        gurmukhi: 'ਤਿਤੁ ਘਰਿ ਗਾਵਹੁ ਸੋਹਿਲਾ ਸਿਵਰਿਹੁ ਸਿਰਜਣਹਾਰੋ ॥੧॥',
      },
      {
        id: 'sggs-12-3',
        gurmukhi: 'ਤੁਮ ਗਾਵਹੁ ਮੇਰੇ ਨਿਰਭਉ ਕਾ ਸੋਹਿਲਾ ॥',
      },
    ],
  },
  {
    id: 'sggs-13-gagan',
    granth: 'sggs',
    ang: 13,
    titleGurmukhi: 'ਗਗਨ ਮੈ ਥਾਲੁ ਰਵਿ ਚੰਦੁ ਦੀਪਕ ਬਨੇ',
    titleEnglish: 'Aarti in Sohila — Raag Dhanaasaree Mahalla 1',
    raag: 'Raag Dhanaasaree',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Kirtan Sohila / Aarti',
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
      {
        id: 'sggs-13-4',
        gurmukhi: 'ਅਨਹਤਾ ਸਬਦ ਵਾਜੰਤ ਭੇਰੀ ॥੧॥ ਰਹਾਉ ॥',
      },
    ],
  },
  {
    id: 'sggs-262-sukhmani',
    granth: 'sggs',
    ang: 262,
    titleGurmukhi: 'ਗਉੜੀ ਸੁਖਮਨੀ ਮਃ ੫ — ਆਦਿ ਗੁਰਏ ਨਮਹ',
    titleEnglish: 'Sukhmani Sahib — Ashtpadi 1 (Opening)',
    raag: 'Raag Gauri',
    author: 'Sri Guru Arjan Dev Ji',
    section: 'Sukhmani Sahib',
    tuks: [
      {
        id: 'sggs-262-1',
        gurmukhi: 'ਆਦਿ ਗੁਰਏ ਨਮਹ ॥ ਜੁਗਾਦਿ ਗੁਰਏ ਨਮਹ ॥',
      },
      {
        id: 'sggs-262-2',
        gurmukhi: 'ਸਤਿਗੁਰਏ ਨਮਹ ॥ ਸ੍ਰੀ ਗੁਰਦੇਵਏ ਨਮਹ ॥੧॥',
      },
      {
        id: 'sggs-262-3',
        gurmukhi: 'ਸਿਮਰਉ ਸਿਮਰਿ ਸਿਮਰਿ ਸੁਖੁ ਪਾਵਉ ॥',
      },
      {
        id: 'sggs-262-4',
        gurmukhi: 'ਸੁਖਮਨੀ ਸੁਖ ਅੰਮ੍ਰਿਤ ਪ੍ਰਭ ਨਾਮੁ ॥ ਭਗਤ ਜਨਾ ਕੈ ਮਨਿ ਬਿਸ੍ਰਾਮੁ ॥ ਰਹਾਉ ॥',
      },
    ],
  },
  {
    id: 'sggs-462-asa-di-var',
    granth: 'sggs',
    ang: 462,
    titleGurmukhi: 'ਆਸਾ ਮਹਲਾ ੧ ॥ ਵਾਰ ਸਲੋਕਾ ਨਾਲਿ',
    titleEnglish: 'Asa Di Var — Salok 1 (Balihaari Gur Aapne)',
    raag: 'Raag Aasaa',
    author: 'Sri Guru Nanak Dev Ji',
    section: 'Asa Di Var',
    tuks: [
      {
        id: 'sggs-462-1',
        gurmukhi: 'ਬਲਿਹਾਰੀ ਗੁਰ ਆਪਣੇ ਦਿਉਹਾੜੀ ਸਦ ਵਾਰ ॥',
      },
      {
        id: 'sggs-462-2',
        gurmukhi: 'ਜਿਨਿ ਮਾਣਸ ਤੇ ਦੇਵਤੇ ਕੀਏ ਕਰਤ ਨ ਲਾਗੀ ਵਾਰ ॥੧॥',
      },
      {
        id: 'sggs-462-3',
        gurmukhi: 'ਜੇ ਸਉ ਚੰਦਾ ਉਗਵਹਿ ਸੂਰਜ ਚੜਹਿ ਹਜਾਰ ॥',
      },
      {
        id: 'sggs-462-4',
        gurmukhi: 'ਏਤੇ ਚਾਨਣ ਹੋਦਿਆਂ ਗੁਰ ਬਿਨੁ ਘੋਰ ਅੰਧਾਰ ॥੨॥',
      },
    ],
  },
  {
    id: 'sggs-611-hukamnama',
    granth: 'sggs',
    ang: 611,
    titleGurmukhi: 'ਸੋਰਠਿ ਮਹਲਾ ੫ ॥ ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਓ ਵਡਭਾਗੀ',
    titleEnglish: 'Today’s Hukamnama — Sorath Mahalla 5',
    raag: 'Raag Sorath',
    author: 'Sri Guru Arjan Dev Ji',
    section: 'Daily Mukhwak (Hukamnama)',
    tuks: [
      {
        id: 'sggs-611-1',
        gurmukhi: 'ਸੋਰਠਿ ਮਹਲਾ ੫ ॥',
      },
      {
        id: 'sggs-611-2',
        gurmukhi: 'ਗੁਰੁ ਪੂਰਾ ਭੇਟਿਓ ਵਡਭਾਗੀ ਮਨਹਿ ਭਇਆ ਪਰਗਾਸਾ ॥',
      },
      {
        id: 'sggs-611-3',
        gurmukhi: 'ਕੋਇ ਨ ਪਹੁਚਨਹਾਰਾ ਦੂਜਾ ਅਪੁਨੇ ਸਾਹਿਬ ਕਾ ਭਰਵਾਸਾ ॥੧॥',
      },
      {
        id: 'sggs-611-4',
        gurmukhi: 'ਅਪੁਨੇ ਸਤਿਗੁਰ ਕੈ ਬਲਿਹਾਰੈ ॥',
      },
      {
        id: 'sggs-611-5',
        gurmukhi: 'ਆਗੈ ਸੁਖੁ ਪਾਛੈ ਸੁਖ ਸਹਜਾ ਘਰਿ ਆਨੰਦੁ ਹਮਾਰੈ ॥ ਰਹਾਉ ॥',
      },
      {
        id: 'sggs-611-6',
        gurmukhi: 'ਅੰਤਰਜਾਮੀ ਕਰਣੈਹਾਰਾ ਸੋਈ ਖਸਮੁ ਹਮਾਰਾ ॥',
      },
      {
        id: 'sggs-611-7',
        gurmukhi: 'ਨਿਰਭਉ ਭਏ ਗੁਰ ਚਰਣੀ ਲਾਗੇ ਇਕ ਰਾਮ ਨਾਮ ਆਧਾਰਾ ॥੨॥',
      },
    ],
  },
  {
    id: 'sggs-917-anand',
    granth: 'sggs',
    ang: 917,
    titleGurmukhi: 'ਰਾਮਕਲੀ ਮਹਲਾ ੩ ਅਨੰਦੁ',
    titleEnglish: 'Anand Sahib — Raamkalee Mahalla 3',
    raag: 'Raag Raamkalee',
    author: 'Sri Guru Amar Das Ji',
    section: 'Anand Sahib (Pauri 1 & 40)',
    tuks: [
      {
        id: 'sggs-917-1',
        gurmukhi: 'ਅਨੰਦੁ ਭਇਆ ਮੇਰੀ ਮਾਏ ਸਤਿਗੁਰੂ ਮੈ ਪਾਇਆ ॥',
      },
      {
        id: 'sggs-917-2',
        gurmukhi: 'ਸਤਿਗੁਰੁ ਤ ਪਾਇਆ ਸਹਜ ਸੇਤੀ ਮਨਿ ਵਜੀਆ ਵਾਧਾਈਆ ॥',
      },
      {
        id: 'sggs-917-3',
        gurmukhi: 'ਅਨਦੁ ਸੁਣਹੁ ਵਡਭਾਗੀਹੋ ਸਗਲ ਮਨੋਰਥ ਪੂਰੇ ॥',
      },
    ],
  },
  {
    id: 'sggs-1426-salok-m9',
    granth: 'sggs',
    ang: 1426,
    titleGurmukhi: 'ਸਲੋਕ ਮਹਲਾ ੯ ॥ ਗੁਨ ਗੋਬਿੰਦ ਗਾਇਓ ਨਹੀ',
    titleEnglish: 'Salok Mahalla 9 — Opening & Bhog Saloks',
    raag: 'Salok Mahalla 9',
    author: 'Sri Guru Tegh Bahadur Ji',
    section: 'Salok Mahalla 9',
    tuks: [
      {
        id: 'sggs-1426-1',
        gurmukhi: 'ਗੁਨ ਗੋਬਿੰਦ ਗਾਇਓ ਨਹੀ ਜਨਮੁ ਅਕਾਰਥ ਕੀਨੁ ॥',
      },
      {
        id: 'sggs-1426-2',
        gurmukhi: 'ਕਹੁ ਨਾਨਕ ਹਰਿ ਭਜੁ ਮਨਾ ਜਿਹ ਬਿਧਿ ਜਲ ਕਉ ਮੀਨੁ ॥੧॥',
      },
      {
        id: 'sggs-1426-3',
        gurmukhi: 'ਭੈ ਕਾਹੂ ਕਉ ਦੇਤ ਨਹਿ ਨਹਿ ਭੈ ਮਾਨਤ ਆਨ ॥',
      },
    ],
  },
  {
    id: 'sggs-1429-mundavani',
    granth: 'sggs',
    ang: 1429,
    titleGurmukhi: 'ਮੁੰਦਾਵਣੀ ਮਹਲਾ ੫ ॥ ਥਾਲ ਵਿਚਿ ਤਿੰਨਿ ਵਸਤੂ ਪਈਓ',
    titleEnglish: 'Mundavani & Closing Salok Mahalla 5',
    raag: 'Bhog (Mundavani)',
    author: 'Sri Guru Arjan Dev Ji',
    section: 'Bhog Sri Guru Granth Sahib Ji',
    tuks: [
      {
        id: 'sggs-1429-1',
        gurmukhi: 'ਥਾਲ ਵਿਚਿ ਤਿੰਨਿ ਵਸਤੂ ਪਈਓ ਸਤੁ ਸੰਤੋਖੁ ਵੀਚਾਰੋ ॥',
      },
      {
        id: 'sggs-1429-2',
        gurmukhi: 'ਅੰਮ੍ਰਿਤ ਨਾਮੁ ਠਾਕੁਰ ਕਾ ਪਇਓ ਜਿਸ ਕਾ ਸਭਸੁ ਅਧਾਰੋ ॥',
      },
      {
        id: 'sggs-1429-3',
        gurmukhi: 'ਤੇਰਾ ਕੀਤਾ ਜਾਤੋ ਨਾਹੀ ਮੈਨੋ ਜੋਗੁ ਕੀਤੋਈ ॥',
      },
    ],
  },
  {
    id: 'dasam-1-jaap',
    granth: 'dasam',
    ang: 1,
    titleGurmukhi: 'ਸ੍ਰੀ ਮੁਖਵਾਕ ਪਾਤਿਸ਼ਾਹੀ ੧੦ ॥ ਜਾਪੁ ਸਾਹਿਬ',
    titleEnglish: 'Jaap Sahib — Opening Chhappai Chhand',
    raag: 'Chhappai Chhand',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Sri Jaap Sahib',
    tuks: [
      {
        id: 'dasam-1-1',
        gurmukhi: 'ਚੱਕ੍ਰ ਚਿਹਨ ਅਰੁ ਬਰਨ ਜਾਤਿ ਅਰੁ ਪਾਤਿ ਨਹਿਨ ਜਿਹ ॥',
      },
      {
        id: 'dasam-1-2',
        gurmukhi: 'ਰੂਪ ਰੰਗ ਅਰੁ ਰੇਖ ਭੇਖ ਕੋਊ ਕਹਿ ਨ ਸਕਤਿ ਕਿਹ ॥',
      },
      {
        id: 'dasam-1-3',
        gurmukhi: 'ਅਚਲ ਮੂਰਤਿ ਅਨੁਭਉ ਪ੍ਰਕਾਸ ਅਮਿਤੋਜਿ ਕਹਿੱਜੈ ॥',
      },
      {
        id: 'dasam-1-4',
        gurmukhi: 'ਨਮਸਤ੍ਵੰ ਅਕਾਲੇ ॥ ਨਮਸਤ੍ਵੰ ਕ੍ਰਿਪਾਲੇ ॥',
      },
    ],
  },
  {
    id: 'dasam-13-savaiye',
    granth: 'dasam',
    ang: 13,
    titleGurmukhi: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਸ੍ਰਾਵਗ ਸੁਧ)',
    titleEnglish: 'Tav Prasad Savaiye (Sravag Sudh)',
    raag: 'Savaiye (Akal Ustat)',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Nitnem Savaiye',
    tuks: [
      {
        id: 'dasam-13-1',
        gurmukhi: 'ਸ੍ਰਾਵਗ ਸੁਧ ਸਮੂਹ ਸਿਧਾਨ ਕੇ ਦੇਖਿ ਫਿਰਿਓ ਘਰ ਜੋਗ ਜਤੀ ਕੇ ॥',
      },
      {
        id: 'dasam-13-2',
        gurmukhi: 'ਸਾਚੁ ਕਹੋਂ ਸੁਨ ਲੇਹੁ ਸਭੈ ਜਿਨ ਪ੍ਰੇਮ ਕੀਓ ਤਿਨ ਹੀ ਪ੍ਰਭੁ ਪਾਇਓ ॥੯॥',
      },
    ],
  },
  {
    id: 'dasam-15-chaupai',
    granth: 'dasam',
    ang: 15,
    titleGurmukhi: 'ਕਬਿਯੋ ਬਾਚ ਬੇਨਤੀ ॥ ਚੌਪਈ',
    titleEnglish: 'Chaupai Sahib — Kabiyo Bach Benti',
    raag: 'Chaupai Chhand',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Sri Charitropakhyan (Benti Chaupai)',
    tuks: [
      {
        id: 'dasam-15-1',
        gurmukhi: 'ਹਮਰੀ ਕਰੋ ਹਾਥ ਦੈ ਰੱਛਾ ॥ ਪੂਰਨ ਹੋਇ ਚਿਤ ਕੀ ਇੱਛਾ ॥',
      },
      {
        id: 'dasam-15-2',
        gurmukhi: 'ਤਵ ਚਰਨਨ ਮਨ ਰਹੈ ਹਮਾਰਾ ॥ ਅਪਨਾ ਜਾਨ ਕਰੋ ਪ੍ਰਤਿਪਾਰਾ ॥੧॥',
      },
      {
        id: 'dasam-15-3',
        gurmukhi: 'ਕ੍ਰਿਪਾ ਦ੍ਰਿਸਟਿ ਤਨ ਜਾਹਿ ਨਿਹਰਿਹੋ ॥ ਤਾ ਕੇ ਤਾਪ ਤਨਕ ਮਹਿ ਹਰਿਹੋ ॥',
      },
    ],
  },
  {
    id: 'dasam-119-chandi',
    granth: 'dasam',
    ang: 119,
    titleGurmukhi: 'ਵਾਰ ਸ੍ਰੀ ਭਗਉਤੀ ਜੀ ਕੀ (ਚੰਡੀ ਦੀ ਵਾਰ)',
    titleEnglish: 'Chandi Di Var — Pritham Bhagauti Simar Kai',
    raag: 'Vaar (Pauri 1)',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Vaar Sri Bhagauti Ji Ki',
    tuks: [
      {
        id: 'dasam-119-1',
        gurmukhi: 'ਪ੍ਰਿਥਮ ਭਗੌਤੀ ਸਿਮਰਿ ਕੈ ਗੁਰ ਨਾਨਕ ਲਈਂ ਧਿਆਇ ॥',
      },
      {
        id: 'dasam-119-2',
        gurmukhi: 'ਫਿਰ ਅੰਗਦ ਗੁਰ ਤੇ ਅਮਰਦਾਸੁ ਰਾਮਦਾਸੈ ਹੋਈਂ ਸਹਾਇ ॥',
      },
      {
        id: 'dasam-119-3',
        gurmukhi: 'ਤੇਗ ਬਹਾਦਰ ਸਿਮਰਿਐ ਘਰ ਨਉ ਨਿਧਿ ਆਵੈ ਧਾਇ ॥ ਸਭ ਥਾਈਂ ਹੋਇ ਸਹਾਇ ॥੧॥',
      },
    ],
  },
  {
    id: 'dasam-710-shabad-hazare',
    granth: 'dasam',
    ang: 710,
    titleGurmukhi: 'ਖਿਆਲ ਪਾਤਿਸ਼ਾਹੀ ੧੦ ॥ ਮਿਤ੍ਰ ਪਿਆਰੇ ਨੂੰ',
    titleEnglish: 'Shabad Hazare Patshahi 10 — Mittar Piare Nu',
    raag: 'Khyal Patshahi 10',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Shabad Hazare Patshahi 10',
    tuks: [
      {
        id: 'dasam-710-1',
        gurmukhi: 'ਮਿਤ੍ਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲੁ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ ॥',
      },
      {
        id: 'dasam-710-2',
        gurmukhi: 'ਤੁਧੁ ਬਿਨੁ ਰੋਗੁ ਰਜਾਈਆਂ ਦਾ ਓਢਣ ਨਾਗ ਨਿਵਾਸਾਂ ਦੇ ਰਹਿਣਾ ॥',
      },
      {
        id: 'dasam-710-3',
        gurmukhi: 'ਯਾਰੜੇ ਦਾ ਸਾਨੂੰ ਸਥਰੁ ਚੰਗਾ ਭੱਠ ਖੇੜਿਆਂ ਦਾ ਰਹਿਣਾ ॥੧॥੧॥੬॥',
      },
    ],
  },
  {
    id: 'sarbloh-1-manglacharan',
    granth: 'sarbloh',
    ang: 1,
    titleGurmukhi: 'ਸ੍ਰੀ ਸਰਬਲੋਹ ਗ੍ਰੰਥ — ਮੰਗਲਾਚਰਨ (ਅਕਾਲ ਪੁਰਖ ਕੀ ਰੱਛਾ)',
    titleEnglish: 'Sri Guru Sarabloh Granth Sahib Ji — Opening Manglacharan',
    raag: 'Manglacharan',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Aad Manglacharan',
    tuks: [
      {
        id: 'sarbloh-1-1',
        gurmukhi: 'ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹ ॥ ਸ੍ਰੀ ਭਗੌਤੀ ਜੀ ਸਹਾਇ ॥',
      },
      {
        id: 'sarbloh-1-2',
        gurmukhi: 'ਅਕਾਲ ਪੁਰਖ ਕੀ ਰੱਛਾ ਹਮਨੈ ॥ ਸਰਬ ਲੋਹ ਦੀ ਰੱਛਿਆ ਹਮਨੈ ॥',
      },
      {
        id: 'sarbloh-1-3',
        gurmukhi: 'ਸਰਬ ਕਾਲ ਜੀ ਦੀ ਰੱਛਿਆ ਹਮਨੈ ॥ ਸਰਬ ਲੋਹ ਜੀ ਦੀ ਸਦਾ ਰੱਛਿਆ ਹਮਨੈ ॥',
      },
    ],
  },
  {
    id: 'sarbloh-112-khalsa-mahima',
    granth: 'sarbloh',
    ang: 112,
    titleGurmukhi: 'ਖਾਲਸਾ ਮਹਿਮਾ — ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ ਹੈ ਖਾਸ',
    titleEnglish: 'Khalsa Mahima — Khalsa Mero Roop Hai Khaas',
    raag: 'Khalsa Mahima',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Sri Guru Sarabloh Granth Sahib Ji',
    tuks: [
      {
        id: 'sarbloh-112-1',
        gurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਰੂਪ ਹੈ ਖਾਸ ॥ ਖਾਲਸੇ ਮਹਿ ਹੌ ਕਰੌ ਨਿਵਾਸ ॥',
      },
      {
        id: 'sarbloh-112-2',
        gurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਮੁਖ ਹੈ ਅੰਗਾ ॥ ਖਾਲਸੇ ਕੇ ਹੌ ਸਦ ਸਦ ਸੰਗਾ ॥',
      },
      {
        id: 'sarbloh-112-3',
        gurmukhi: 'ਖਾਲਸਾ ਮੇਰੋ ਸਤਿਗੁਰ ਪੂਰਾ ॥ ਖਾਲਸਾ ਮੇਰੋ ਸੱਜਣ ਸੂਰਾ ॥',
      },
    ],
  },
  {
    id: 'sarbloh-495-aarti',
    granth: 'sarbloh',
    ang: 495,
    titleGurmukhi: 'ਆਰਤੀ ਸ੍ਰੀ ਸਰਬਲੋਹ — ਯਾ ਤੇ ਪ੍ਰਸੰਨ ਭਏ',
    titleEnglish: 'Aarti & Prayer from Sri Sri Guru Sarabloh Granth Sahib Ji',
    raag: 'Aarti / Mangal',
    author: 'Sri Guru Gobind Singh Ji',
    section: 'Sarbloh Aarti',
    tuks: [
      {
        id: 'sarbloh-495-1',
        gurmukhi: 'ਜੋਤਿ ਸਰੂਪੀ ਅਲਖ ਅਪਾਰਾ ॥ ਨਿਰੰਕਾਰ ਨਿਰਵੈਰ ਕਰਤਾਰਾ ॥',
      },
      {
        id: 'sarbloh-495-2',
        gurmukhi: 'ਅਕਾਲ ਸਹਾਇ ਸਦਾ ਪ੍ਰਤਿਪਾਲਕ ॥ ਸੰਤ ਉਬਾਰਨ ਦੁਸਟ ਬਿਦਾਰਕ ॥',
      },
    ],
  },
  {
    id: 'bgv-1-1-namaskaar',
    granth: 'bgv',
    ang: 1,
    titleGurmukhi: 'ਵਾਰ ੧ ਪਉੜੀ ੧ — ਨਮਸਕਾਰ ਗੁਰਦੇਵ ਕੋ',
    titleEnglish: 'Vaar 1, Pauri 1 & 23 — Sun Pukaar Datar Prabh',
    raag: 'Vaar 1',
    author: 'Bhai Gurdas Ji',
    section: 'Vaar 1 (Guru Nanak Pragatya)',
    tuks: [
      {
        id: 'bgv-1-1',
        gurmukhi: 'ਨਮਸਕਾਰ ਗੁਰਦੇਵ ਕੋ ਸਤਿਨਾਮੁ ਜਿਸੁ ਮੰਤ੍ਰ ਸੁਣਾਇਆ ॥',
      },
      {
        id: 'bgv-1-2',
        gurmukhi: 'ਸੁਣੀ ਪੁਕਾਰਿ ਦਾਤਾਰ ਪ੍ਰਭੁ ਗੁਰੁ ਨਾਨਕ ਜਗ ਮਾਹਿ ਪਠਾਇਆ ॥',
      },
      {
        id: 'bgv-1-3',
        gurmukhi: 'ਸਤਿਗੁਰ ਨਾਨਕ ਪ੍ਰਗਟਿਆ ਮਿਟੀ ਧੁੰਧੁ ਜਗਿ ਚਾਨਣੁ ਹੋਆ ॥',
      },
    ],
  },
  {
    id: 'bgv-11-gursikh',
    granth: 'bgv',
    ang: 11,
    titleGurmukhi: 'ਵਾਰ ੪੦ ਪਉੜੀ ੧੧ — ਵਾਹ ਵਾਹ ਗੋਬਿੰਦ ਸਿੰਘ',
    titleEnglish: 'Vaar 40 / 41 — Vah Vah Gobind Singh Aape Gur Chela',
    raag: 'Vaar 41',
    author: 'Bhai Gurdas Ji (Second)',
    section: 'Khalsa Panth Glory',
    tuks: [
      {
        id: 'bgv-40-1',
        gurmukhi: 'ਵਾਹ ਵਾਹ ਗੋਬਿੰਦ ਸਿੰਘ ਆਪੇ ਗੁਰ ਚੇਲਾ ॥',
      },
      {
        id: 'bgv-40-2',
        gurmukhi: 'ਗੁਰਸਿਖ ਭਲਕੇ ਉਠਿ ਕਰਿ ਅੰਮ੍ਰਿਤ ਵੇਲੇ ਸਰੁ ਨਾਵੰਦਾ ॥',
      },
    ],
  },
  {
    id: 'bnl-1-ganjnama',
    granth: 'bnl',
    ang: 1,
    titleGurmukhi: 'ਗੰਜਨਾਮਾ — ਨਾਸਰੋ ਮਨਸੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ',
    titleEnglish: 'Ganjnama — Nasro Mansoor Guru Gobind Singh',
    raag: 'Ganjnama (Patshahi 10)',
    author: 'Bhai Nand Lal Ji Goya',
    section: 'Ganjnama',
    tuks: [
      {
        id: 'bnl-1-1',
        gurmukhi: 'ਨਾਸਰੋ ਮਨਸੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥ ਏਜ਼ਦੀ ਮਨਜ਼ੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥',
      },
      {
        id: 'bnl-1-2',
        gurmukhi: 'ਹੱਕ ਰਾ ਗੰਜੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥ ਜੁਮਲਾ ਫ਼ੈਜ਼ੇ ਨੂਰ ਗੁਰੁ ਗੋਬਿੰਦ ਸਿੰਘ ॥',
      },
    ],
  },
  {
    id: 'bnl-12-rehatnama',
    granth: 'bnl',
    ang: 12,
    titleGurmukhi: 'ਰਹਿਤਨਾਮਾ ਭਾਈ ਨੰਦ ਲਾਲ ਜੀ — ਪ੍ਰਸ਼ਨ ਉੱਤਰ',
    titleEnglish: 'Rehatnama & Tankhahnama — Guru’s Three Forms',
    raag: 'Rehatnama',
    author: 'Bhai Nand Lal Ji Goya',
    section: 'Rehatnama / Tankhahnama',
    tuks: [
      {
        id: 'bnl-12-1',
        gurmukhi: 'ਸੁਨਹੁ ਨੰਦ ਲਾਲ ਇਹੁ ਸਾਚ ॥ ਪ੍ਰਗਟ ਕਰਊਂ ਅਪੁਨਾ ਉਨਮਾਚ ॥',
      },
      {
        id: 'bnl-12-2',
        gurmukhi: 'ਰਾਜ ਕਰੇਗਾ ਖਾਲਸਾ ਆਕੀ ਰਹੇ ਨ ਕੋਇ ॥ ਖ੍ਵਾਰ ਹੋਇ ਸਭ ਮਿਲੈਂਗੇ ਬਚੇ ਸ਼ਰਨ ਜੋ ਹੋਇ ॥',
      },
    ],
  },
];

export const TODAYS_HUKAMNAMA_ID = 'sggs-611-hukamnama';
