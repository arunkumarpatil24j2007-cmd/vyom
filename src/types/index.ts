/* ═══════════════════════════════════════════════════════════════
   Jyotish AI — Core Type Definitions
   ═══════════════════════════════════════════════════════════════ */

// ─── Birth Profile ───

export interface BirthProfile {
  id: string;
  name: string;
  birthDate: string; // ISO date
  birthTime: string; // HH:MM format
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  updatedAt: string;
}

// ─── Planetary Data ───

export type GrahaName =
  | 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter'
  | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

export type RashiName =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type NakshatraName =
  | 'Ashwini' | 'Bharani' | 'Krittika' | 'Rohini'
  | 'Mrigashira' | 'Ardra' | 'Punarvasu' | 'Pushya'
  | 'Ashlesha' | 'Magha' | 'Purva Phalguni' | 'Uttara Phalguni'
  | 'Hasta' | 'Chitra' | 'Swati' | 'Vishakha'
  | 'Anuradha' | 'Jyeshtha' | 'Mula' | 'Purva Ashadha'
  | 'Uttara Ashadha' | 'Shravana' | 'Dhanishtha' | 'Shatabhisha'
  | 'Purva Bhadrapada' | 'Uttara Bhadrapada' | 'Revati';

export interface PlanetPosition {
  planet: GrahaName;
  sign: RashiName;
  signIndex: number; // 1-12
  house: number; // 1-12
  degree: number;
  degrees?: number;
  degreesFormatted?: string;
  dignity?: string;
  minutes?: number;
  nakshatra?: NakshatraName;
  pada?: number; // 1-4
  isRetrograde?: boolean;
  retrograde?: boolean;
  isCombust?: boolean;
  isExalted?: boolean;
  isDebilitated?: boolean;
  lordOf?: number[]; // houses ruled
  longitude?: number; // full-precision sidereal longitude 0-360
  speed?: number; // degrees per day (negative = retrograde)
}

export interface HouseData {
  house: number;
  sign: RashiName;
  signIndex: number;
  degree: number;
  planets: GrahaName[];
  signLord: GrahaName;
}

// ─── Chart Data ───

export type ChartLayout = 'north-indian' | 'south-indian';
export type AyanamshaType = 'lahiri' | 'raman' | 'kp' | 'true-chitra';
export type VargaType = 'D1' | 'D2' | 'D3' | 'D7' | 'D9' | 'D10' | 'D12';

export interface CalculationSettings {
  tradition: 'vedic';
  ayanamsha: AyanamshaType;
  houseSystem?: string;
  chartLayout: ChartLayout;
}

export interface CalculatedDasha {
  planet: GrahaName;
  startYear: number;
  endYear: number;
  durationYears: number;
}

export interface ChartData {
  id: string;
  profileId: string;
  calculationSettings: CalculationSettings;
  ascendant: {
    sign: RashiName;
    signIndex: number;
    degree: number;
    degreesFormatted?: string;
    rashiName?: string;
    nakshatra?: NakshatraName;
    pada?: number;
  };
  planets: PlanetPosition[];
  houses: HouseData[];
  moonSign: {
    sign: RashiName;
    rashiName?: string;
    degree?: number;
    nakshatra?: NakshatraName;
    pada?: number;
    degreesFormatted?: string;
  } | RashiName;
  moonNakshatra?: NakshatraName;
  dashas?: CalculatedDasha[];
  dashaPeriods?: DashaPeriod[];
  activeDasha?: ActiveDashaSummary | null;
  birthData?: BirthDataProvenance;
  calculatedAt?: string;
  isDemo: boolean;
}

/** Birth-time precision & workflow routing (DOCUMENT_01 §4, DOCUMENT_07 §2). */
export type BirthTimePrecision = 'exact' | 'approximate' | 'unknown';
export type TimeWorkflowId = 'A_exact' | 'B_approximate' | 'C_unknown_time' | 'E_midnight' | 'F_tz_dst_boundary';

export interface BirthDataProvenance {
  localDate: string;
  localTime: string | null;
  timePrecision: BirthTimePrecision;
  uncertaintyWindowMinutes: number;
  workflowId: TimeWorkflowId;
  utcDateTime: string;
  utcOffsetHours: number;
  timezone: string;
  latitude: number;
  longitude: number;
  jdUt: number;
  ayanamshaDeg: number;
  ascendantLongitude: number | null;
  /** Fraction (0-100) of the uncertainty window in which the Lagna sign stays the same. */
  lagnaSignStabilityPct: number;
  lagnaSignsInWindow: string[];
  navamshaLagnaSignsInWindow: string[];
  moonSignsInWindow: string[];
  moonNakshatrasInWindow: string[];
  suppressedFeatures: string[];
  warnings: string[];
}

export interface ActiveDashaSummary {
  mahadasha: GrahaName;
  mahadashaStart: string;
  mahadashaEnd: string;
  antardasha?: GrahaName;
  antardashaStart?: string;
  antardashaEnd?: string;
  nextAntardasha?: GrahaName;
  nextAntardashaStart?: string;
}

export interface SavedReport {
  id: string;
  title: string;
  date: string;
  category: 'career' | 'relationships' | 'wealth' | 'health' | 'spiritual' | 'general';
  chartName: string;
  summary: string;
  chartData?: ChartData;
}

// ─── Dasha (Planetary Periods) ───

export interface DashaPeriod {
  planet: GrahaName;
  startDate: string;
  endDate: string;
  isActive: boolean;
  subPeriods?: DashaPeriod[];
  startMs?: number;
  endMs?: number;
}

// ─── Sources & Knowledge ───

export interface AstrologySource {
  id: string;
  title: string;
  author?: string;
  tradition?: string;
  chapter?: string;
  verse?: string;
  page?: string;
  passage: string;
  sourceLocation?: string;
  category?: string;
  relevance?: string;
}

export interface AstrologyRule {
  id: string;
  topic: string;
  conditions: string;
  interpretation: string;
  exceptions?: string;
  sourceIds: string[];
  reviewStatus: 'draft' | 'reviewed' | 'approved';
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  nameDevanagari?: string;
  description: string;
  icon: string;
  count: number;
}

// ─── Conversation ───

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  analysis?: AIAnalysis;
  isLoading?: boolean;
}

export interface Conversation {
  id: string;
  profileId?: string;
  chartId?: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  summary: string;
  chartFactors?: ChartFactor[];
  traditionalInterpretation?: string;
  reasoning?: string;
  sources?: AstrologySource[];
  alternativeInterpretations?: string[];
  uncertaintyNotes?: string;
  followUpQuestions?: string[];
}

export interface ChartFactor {
  label: string;
  value: string;
  category: 'planet' | 'house' | 'nakshatra' | 'dasha' | 'yoga';
}

// ─── Saved Insights ───

export interface SavedInsight {
  id: string;
  type: 'ai_response' | 'chart_interpretation' | 'source_passage' | 'note' | 'bookmark';
  title: string;
  content: string;
  chartId?: string;
  conversationId?: string;
  sourceId?: string;
  tags: string[];
  note?: string;
  createdAt: string;
}

// ─── Compatibility ───

export interface CompatibilityResult {
  profile1: BirthProfile;
  profile2: BirthProfile;
  overallScore?: number;
  factors: CompatibilityFactor[];
  interpretation?: string;
  sources?: AstrologySource[];
  isDemo: boolean;
}

export interface CompatibilityFactor {
  name: string;
  nameDevanagari?: string;
  score?: number;
  maxScore: number;
  description: string;
}

// ─── App State ───

export interface AppSettings {
  defaultChartLayout: ChartLayout;
  defaultAyanamsha: AyanamshaType;
  responseStyle: 'concise' | 'detailed';
  includeSources: boolean;
  showReasoning: boolean;
  preferredTradition?: string;
}

// ─── System Status ───

export interface SystemStatus {
  knowledgeBase: 'connected' | 'disconnected' | 'demo';
  calculationEngine: 'connected' | 'disconnected' | 'demo';
  aiModel: 'connected' | 'disconnected' | 'demo';
  indexedDocuments: number;
}
