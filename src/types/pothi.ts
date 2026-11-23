export type GranthId = 'sggs' | 'dasam' | 'sarbloh' | 'bgv' | 'bnl';

export type ThemeMode = 'light' | 'parchment' | 'dark';

export type GurmukhiFont = 'Noto Sans Gurmukhi' | 'GurbaniAkharThick';

export type AppRoute =
  | '/'
  | '/searcher'
  | '/gurbani'
  | '/gutka'
  | '/reader'
  | '/pothi-present';

export interface VishraamMark {
  /** Zero-based index of the word in the Pad Ched Tuk */
  wordIndex: number;
  /** primary = heavy pause (Thahraav ';'), secondary = light pause (',') */
  type: 'primary' | 'secondary';
}

export interface Tuk {
  id: string;
  gurmukhi: string;
  transliteration: string;
  english: string;
  teeka: string;
  vishraam?: VishraamMark[];
}

export interface Shabad {
  id: string;
  granth: GranthId;
  ang: number;
  titleGurmukhi: string;
  titleEnglish: string;
  raag: string;
  author: string;
  section?: string;
  tuks: Tuk[];
  audioUrl?: string;
  audioLabel?: string;
}

export interface BaaniCollection {
  id: string;
  category: 'nitnem' | 'additional';
  order: number;
  nameGurmukhi: string;
  nameEnglish: string;
  timeOfDay: string;
  granthSource: GranthId;
  description: string;
  audioLabel: string;
  audioUrl?: string;
  tuks: Tuk[];
}

export interface BaaniMaryadaVariant {
  titleVariant?: string;
  openingNote?: string;
  closingNote?: string;
  extraOpeningTuks?: Tuk[];
  extraClosingTuks?: Tuk[];
}

export interface SampardaiArdaas {
  titleGurmukhi: string;
  titleEnglish: string;
  openingInvocation: string;
  maryadaNote: string;
  tuks: Tuk[];
}

export interface SampardaiPothi {
  id: string;
  index: number;
  name: string;
  gurmukhiName: string;
  lineage: string;
  region: string;
  maryadaSummary: string;
  manglacharan: Tuk;
  nitnemOrder: string[];
  baaniVariants: Record<string, BaaniMaryadaVariant>;
  ardaas: SampardaiArdaas;
}

export interface GranthMeta {
  id: GranthId;
  shortName: string;
  fullName: string;
  gurmukhiName: string;
  maxAng: number;
  unitLabel: string;
  description: string;
}

export interface ReaderSettings {
  larivaar: boolean;
  vishraam: boolean;
  showTransliteration: boolean;
  showEnglish: boolean;
  showTeeka: boolean;
  fontSize: number;
  gurmukhiFont: GurmukhiFont;
  theme: ThemeMode;
}

export type SehajPaathProgress = Record<GranthId, number>;

export interface QueueItem {
  id: string;
  sourceType: 'shabad' | 'baani';
  sourceId: string;
  titleGurmukhi: string;
  titleEnglish: string;
  subtitle: string;
  granth: GranthId;
  ang?: number;
  tuks: Tuk[];
}

export type SearchMatchType =
  | 'direct-ang'
  | 'first-letter-gurmukhi'
  | 'first-letter-roman'
  | 'exact-gurmukhi'
  | 'phonetic'
  | 'english';

export interface SearchResult {
  shabadId: string;
  tukId: string;
  granth: GranthId;
  ang: number;
  raag: string;
  author: string;
  titleGurmukhi: string;
  titleEnglish: string;
  matchedTuk: Tuk;
  matchType: SearchMatchType;
  score: number;
}

export type ReaderTarget =
  | { mode: 'ang'; granth: GranthId; ang: number; highlightTukId?: string }
  | { mode: 'shabad'; shabadId: string; highlightTukId?: string }
  | { mode: 'baani'; baaniId: string; pothiId: string }
  | { mode: 'ardaas'; pothiId: string };
