export type GranthId = 'sggs' | 'dasam' | 'sarbloh' | 'bgv' | 'bnl';

export type ThemeMode = 'light' | 'parchment' | 'dark';

export type GurmukhiFont = 'Noto Sans Gurmukhi';

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
  /** primary = heavy pause, secondary = light pause */
  type: 'primary' | 'secondary';
}

export interface Tuk {
  id: string;
  /** Raw public-domain Unicode Gurmukhi scripture text */
  gurmukhi: string;
  /** Empty schema hook reserved strictly for Tatkhalsa Foundation's future original translations */
  inHouseTranslation?: string;
  /** Empty schema hook reserved strictly for verified public-domain late-19th-century Faridkot Vala Teeka */
  faridkotTeeka?: string;
  /** Empty schema hook reserved strictly for Tatkhalsa Foundation's future original Vishraam data */
  inHouseVishraam?: VishraamMark[];
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
  /** Optional linkage when indexed from Sundar Gutka Baani or Sampardai Ardaas */
  baaniId?: string;
  pothiId?: string;
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
  /** Algorithmic phonetic Romanization derived strictly from Unicode Gurmukhi */
  showTransliteration: boolean;
  fontSize: number;
  theme: ThemeMode;
  /** Warns before accidental browser reload/exit during active Paath */
  paathExitGuard: boolean;
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

export interface BookmarkItem {
  id: string;
  kind: 'shabad' | 'ang' | 'baani' | 'ardaas';
  titleGurmukhi: string;
  titleEnglish: string;
  subtitle: string;
  granth: GranthId;
  ang?: number;
  shabadId?: string;
  baaniId?: string;
  pothiId?: string;
  savedAt: number;
}

export interface HistoryEntry {
  id: string;
  kind: 'shabad' | 'ang' | 'baani' | 'ardaas';
  titleGurmukhi: string;
  titleEnglish: string;
  subtitle: string;
  granth: GranthId;
  ang?: number;
  shabadId?: string;
  baaniId?: string;
  pothiId?: string;
  visitedAt: number;
}

export type SearchMatchType =
  | 'direct-ang'
  | 'first-letter-gurmukhi'
  | 'first-letter-roman'
  | 'exact-gurmukhi'
  | 'phonetic';

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
  baaniId?: string;
  pothiId?: string;
}

export type ReaderTarget =
  | { mode: 'ang'; granth: GranthId; ang: number; highlightTukId?: string }
  | { mode: 'shabad'; shabadId: string; highlightTukId?: string }
  | { mode: 'baani'; baaniId: string; pothiId: string }
  | { mode: 'ardaas'; pothiId: string };
