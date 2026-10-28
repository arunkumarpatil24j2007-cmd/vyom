import type {
  BirthProfile, ChartData, Conversation, ConversationMessage,
  AstrologySource, DashaPeriod, KnowledgeCategory, SavedInsight,
  SystemStatus, CompatibilityFactor
} from '@/types';

// ─── Demo Birth Profiles ───

export const demoProfiles: BirthProfile[] = [
  {
    id: 'profile-1',
    name: 'Arjun Mehta',
    birthDate: '2002-08-14',
    birthTime: '07:42',
    birthPlace: 'Bengaluru, India',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
    gender: 'male',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'profile-2',
    name: 'Priya Sharma',
    birthDate: '1995-03-21',
    birthTime: '14:30',
    birthPlace: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
    gender: 'female',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z',
  },
];

// ─── Demo Chart Data ───

export const demoChart: ChartData = {
  id: 'chart-1',
  profileId: 'profile-1',
  calculationSettings: {
    tradition: 'vedic',
    ayanamsha: 'lahiri',
    chartLayout: 'north-indian',
  },
  ascendant: {
    sign: 'Leo',
    signIndex: 5,
    degree: 14.32,
    nakshatra: 'Magha',
    pada: 3,
  },
  moonSign: 'Pisces',
  moonNakshatra: 'Revati',
  planets: [
    { planet: 'Sun', sign: 'Cancer', signIndex: 4, house: 12, degree: 27.45, nakshatra: 'Ashlesha', pada: 4, isRetrograde: false, lordOf: [1] },
    { planet: 'Moon', sign: 'Pisces', signIndex: 12, house: 8, degree: 22.18, nakshatra: 'Revati', pada: 3, isRetrograde: false, lordOf: [12] },
    { planet: 'Mars', sign: 'Leo', signIndex: 5, house: 1, degree: 3.56, nakshatra: 'Magha', pada: 1, isRetrograde: false, lordOf: [4, 9] },
    { planet: 'Mercury', sign: 'Leo', signIndex: 5, house: 1, degree: 19.23, nakshatra: 'Purva Phalguni', pada: 2, isRetrograde: false, lordOf: [2, 11] },
    { planet: 'Jupiter', sign: 'Cancer', signIndex: 4, house: 12, degree: 12.07, isExalted: true, nakshatra: 'Pushya', pada: 4, isRetrograde: false, lordOf: [5, 8] },
    { planet: 'Venus', sign: 'Gemini', signIndex: 3, house: 11, degree: 8.34, nakshatra: 'Ardra', pada: 1, isRetrograde: false, lordOf: [3, 10] },
    { planet: 'Saturn', sign: 'Gemini', signIndex: 3, house: 11, degree: 22.51, nakshatra: 'Punarvasu', pada: 1, isRetrograde: true, lordOf: [6, 7] },
    { planet: 'Rahu', sign: 'Taurus', signIndex: 2, house: 10, degree: 15.42, nakshatra: 'Rohini', pada: 3, isRetrograde: true, lordOf: [] },
    { planet: 'Ketu', sign: 'Scorpio', signIndex: 8, house: 4, degree: 15.42, nakshatra: 'Anuradha', pada: 1, isRetrograde: true, lordOf: [] },
  ],
  houses: [
    { house: 1, sign: 'Leo', signIndex: 5, degree: 14.32, planets: ['Mars', 'Mercury'], signLord: 'Sun' },
    { house: 2, sign: 'Virgo', signIndex: 6, degree: 14.32, planets: [], signLord: 'Mercury' },
    { house: 3, sign: 'Libra', signIndex: 7, degree: 14.32, planets: [], signLord: 'Venus' },
    { house: 4, sign: 'Scorpio', signIndex: 8, degree: 14.32, planets: ['Ketu'], signLord: 'Mars' },
    { house: 5, sign: 'Sagittarius', signIndex: 9, degree: 14.32, planets: [], signLord: 'Jupiter' },
    { house: 6, sign: 'Capricorn', signIndex: 10, degree: 14.32, planets: [], signLord: 'Saturn' },
    { house: 7, sign: 'Aquarius', signIndex: 11, degree: 14.32, planets: [], signLord: 'Saturn' },
    { house: 8, sign: 'Pisces', signIndex: 12, degree: 14.32, planets: ['Moon'], signLord: 'Jupiter' },
    { house: 9, sign: 'Aries', signIndex: 1, degree: 14.32, planets: [], signLord: 'Mars' },
    { house: 10, sign: 'Taurus', signIndex: 2, degree: 14.32, planets: ['Rahu'], signLord: 'Venus' },
    { house: 11, sign: 'Gemini', signIndex: 3, degree: 14.32, planets: ['Venus', 'Saturn'], signLord: 'Mercury' },
    { house: 12, sign: 'Cancer', signIndex: 4, degree: 14.32, planets: ['Sun', 'Jupiter'], signLord: 'Moon' },
  ],
  calculatedAt: '2024-01-15T10:05:00Z',
  isDemo: true,
};

// ─── Demo Dasha Periods ───

export const demoDashaPeriods: DashaPeriod[] = [
  {
    planet: 'Jupiter',
    startDate: '1998-03-15',
    endDate: '2014-03-15',
    isActive: false,
    subPeriods: [
      { planet: 'Jupiter', startDate: '1998-03-15', endDate: '2000-05-03', isActive: false },
      { planet: 'Saturn', startDate: '2000-05-03', endDate: '2002-11-15', isActive: false },
      { planet: 'Mercury', startDate: '2002-11-15', endDate: '2005-02-21', isActive: false },
    ],
  },
  {
    planet: 'Saturn',
    startDate: '2014-03-15',
    endDate: '2033-03-15',
    isActive: true,
    subPeriods: [
      { planet: 'Saturn', startDate: '2014-03-15', endDate: '2017-03-18', isActive: false },
      { planet: 'Mercury', startDate: '2017-03-18', endDate: '2019-11-26', isActive: false },
      { planet: 'Ketu', startDate: '2019-11-26', endDate: '2021-01-05', isActive: false },
      { planet: 'Venus', startDate: '2021-01-05', endDate: '2024-03-05', isActive: false },
      { planet: 'Sun', startDate: '2024-03-05', endDate: '2025-02-15', isActive: true },
      { planet: 'Moon', startDate: '2025-02-15', endDate: '2026-09-15', isActive: false },
      { planet: 'Mars', startDate: '2026-09-15', endDate: '2027-10-24', isActive: false },
    ],
  },
  {
    planet: 'Mercury',
    startDate: '2033-03-15',
    endDate: '2050-03-15',
    isActive: false,
  },
];

// ─── Demo Sources ───

export const demoSources: AstrologySource[] = [
  {
    id: 'src-1',
    title: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    tradition: 'Parashara',
    chapter: 'Ch. 3 — Planetary Characters and Descriptions',
    passage: 'Jupiter in Cancer is said to be in exaltation, attaining its highest dignity. When placed in the 12th house, it signifies spiritual gains, connections to foreign lands, and a naturally generous disposition that may lead to expenditure on noble causes.',
    category: 'Classical Text',
    relevance: 'Jupiter placement interpretation',
  },
  {
    id: 'src-2',
    title: 'Phaladeepika',
    author: 'Mantreshwara',
    tradition: 'Classical Jyotish',
    chapter: 'Ch. 7 — Effects of Planets in Houses',
    passage: 'Mars in the ascendant bestows courage, leadership qualities, and a strong physical constitution. The native may have a mark or scar on the body and possesses an energetic temperament.',
    category: 'Classical Text',
    relevance: 'Mars in Lagna interpretation',
  },
  {
    id: 'src-3',
    title: 'Jataka Parijata',
    author: 'Vaidyanatha Dikshita',
    tradition: 'Classical Jyotish',
    chapter: 'Ch. 2 — On the Natures of the Signs',
    verse: 'v. 14-17',
    passage: 'Leo as the ascending sign indicates a person of regal bearing, with natural authority and creative expression. The native may be drawn to positions of leadership and artistic endeavour.',
    category: 'Classical Text',
    relevance: 'Ascendant interpretation',
  },
  {
    id: 'src-4',
    title: 'Uttara Kalamrita',
    author: 'Kalidasa',
    tradition: 'Classical Jyotish',
    chapter: 'Section IV — Planetary Periods',
    passage: 'During the Mahadasha of Saturn, a person experiences the results of their past karmic actions. Saturn, when well-placed, can bestow discipline, longevity, and mastery through sustained effort.',
    category: 'Classical Text',
    relevance: 'Dasha interpretation',
  },
  {
    id: 'src-5',
    title: 'Light on Life',
    author: 'Hart de Fouw & Robert Svoboda',
    tradition: 'Modern Commentary',
    chapter: 'Ch. 9 — The Nakshatras',
    page: 'pp. 234-238',
    passage: 'Revati, the final nakshatra, is associated with completion, nurturing, and the journey towards transcendence. Moon in Revati suggests a compassionate and imaginative nature with an inclination towards spiritual pursuits.',
    category: 'Modern Commentary',
    relevance: 'Moon nakshatra interpretation',
  },
];

// ─── Demo Conversations ───

export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    profileId: 'profile-1',
    chartId: 'chart-1',
    title: 'Career & Professional Direction',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What factors in my chart traditionally indicate career direction?',
        timestamp: '2024-03-10T14:00:00Z',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '',
        timestamp: '2024-03-10T14:00:05Z',
        analysis: {
          summary: 'Your chart shows several notable factors traditionally associated with career and professional direction. The 10th house (Taurus) contains Rahu, and the 10th lord Venus is placed in the 11th house with Saturn. The Lagna lord Sun is in the 12th house with an exalted Jupiter.',
          chartFactors: [
            { label: 'Rahu in 10th House', value: 'Taurus — unconventional career path, technology, foreign connections', category: 'planet' },
            { label: '10th Lord Venus', value: 'Gemini, 11th House — communication, networking, artistic expression', category: 'planet' },
            { label: 'Saturn in 11th', value: 'Retrograde, Gemini — disciplined approach to gains, long-term goals', category: 'planet' },
            { label: 'Jupiter Exalted in 12th', value: 'Cancer — foreign opportunities, spiritual or academic pursuits', category: 'planet' },
            { label: 'Mars in Lagna', value: 'Leo — leadership drive, technical ability, initiative', category: 'planet' },
          ],
          traditionalInterpretation: 'The placement of Rahu in the 10th house is traditionally interpreted as indicating an unconventional or innovative career path. Classical texts suggest this placement can draw the native towards technology, media, or fields involving foreign cultures. The 10th lord Venus in the 11th house, conjunct retrograde Saturn, suggests that professional success may come through disciplined, long-term effort in creative or communication-related fields. The exalted Jupiter in the 12th house can indicate opportunities connected to foreign lands, higher education, or spiritual/philosophical pursuits.',
          reasoning: 'The analysis considers the 10th house (karma-sthana), its lord, planets influencing the 10th house, the Lagna and its lord, and the placement of Saturn as the karaka for career. The conjunction of Venus and Saturn in Gemini suggests a blend of creativity and discipline in professional life.',
          sources: [demoSources[0], demoSources[1]],
          alternativeInterpretations: ['Some traditions emphasise the Dasamsa (D10) chart for career analysis, which provides additional divisional dignity nuances.'],
          uncertaintyNotes: 'This interpretation is based on the Rashi chart (D1) only. A complete analysis would include the Dasamsa chart, current dasha periods, and transits.',
          followUpQuestions: [
            'How does my current Saturn Mahadasha affect career?',
            'What does the Navamsa chart show about career?',
            'What are the traditional remedial measures for Rahu in the 10th?',
          ],
        },
      },
    ],
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-03-10T14:05:00Z',
  },
  {
    id: 'conv-2',
    profileId: 'profile-1',
    chartId: 'chart-1',
    title: 'Planetary Period Overview',
    messages: [],
    createdAt: '2024-03-08T09:00:00Z',
    updatedAt: '2024-03-08T09:30:00Z',
  },
  {
    id: 'conv-3',
    profileId: 'profile-1',
    chartId: 'chart-1',
    title: 'Navamsa Exploration',
    messages: [],
    createdAt: '2024-03-05T16:00:00Z',
    updatedAt: '2024-03-05T16:45:00Z',
  },
  {
    id: 'conv-4',
    profileId: 'profile-1',
    chartId: 'chart-1',
    title: 'Birth Chart Overview',
    messages: [],
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:30:00Z',
  },
];

// ─── Demo Knowledge Categories ───

export const demoCategories: KnowledgeCategory[] = [
  { id: 'grahas', name: 'Grahas', nameDevanagari: 'ग्रह', description: 'The nine celestial bodies — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu', icon: 'sun', count: 47 },
  { id: 'rashis', name: 'Rashis', nameDevanagari: 'राशि', description: 'The twelve zodiacal signs from Aries to Pisces', icon: 'circle', count: 36 },
  { id: 'bhavas', name: 'Bhavas', nameDevanagari: 'भाव', description: 'The twelve houses representing different life domains', icon: 'layout-grid', count: 52 },
  { id: 'nakshatras', name: 'Nakshatras', nameDevanagari: 'नक्षत्र', description: 'The 27 lunar mansions used in Vedic astrology', icon: 'stars', count: 81 },
  { id: 'yogas', name: 'Yogas', nameDevanagari: 'योग', description: 'Special planetary combinations and their interpretations', icon: 'git-merge', count: 124 },
  { id: 'dashas', name: 'Dashas', nameDevanagari: 'दशा', description: 'Planetary period systems including Vimshottari and others', icon: 'clock', count: 33 },
  { id: 'gochar', name: 'Gochar', nameDevanagari: 'गोचर', description: 'Planetary transits and their effects on natal charts', icon: 'move', count: 28 },
  { id: 'vargas', name: 'Vargas', nameDevanagari: 'वर्ग', description: 'Divisional charts for detailed analysis of specific life areas', icon: 'grid-3x3', count: 45 },
  { id: 'prashna', name: 'Prashna', nameDevanagari: 'प्रश्न', description: 'Horary astrology — answering questions from the chart of the moment', icon: 'help-circle', count: 19 },
  { id: 'muhurta', name: 'Muhurta', nameDevanagari: 'मुहूर्त', description: 'Electional astrology — selecting auspicious times for activities', icon: 'calendar', count: 22 },
  { id: 'remedies', name: 'Remedies', nameDevanagari: 'उपाय', description: 'Traditional practices, mantras, gemstones, and rituals', icon: 'gem', count: 38 },
  { id: 'texts', name: 'Classical Texts', nameDevanagari: 'ग्रन्थ', description: 'Foundational works of Jyotish Shastra', icon: 'book-open', count: 15 },
];

// ─── Demo Saved Insights ───

export const demoInsights: SavedInsight[] = [
  {
    id: 'insight-1',
    type: 'ai_response',
    title: 'Career Direction Analysis',
    content: 'Rahu in the 10th house traditionally indicates an unconventional career path, often connected to technology, media, or foreign cultures.',
    chartId: 'chart-1',
    conversationId: 'conv-1',
    tags: ['career', '10th house', 'rahu'],
    createdAt: '2024-03-10T14:05:00Z',
  },
  {
    id: 'insight-2',
    type: 'source_passage',
    title: 'Jupiter Exalted in Cancer — BPHS',
    content: 'Jupiter in Cancer is said to be in exaltation, attaining its highest dignity.',
    sourceId: 'src-1',
    tags: ['jupiter', 'exaltation', 'classical'],
    createdAt: '2024-03-08T09:15:00Z',
  },
  {
    id: 'insight-3',
    type: 'note',
    title: 'Personal observation on Saturn return',
    content: 'Saturn transit over natal Saturn position may correlate with a period of restructuring. Watch for changes around mid-2025.',
    chartId: 'chart-1',
    tags: ['saturn', 'transit', 'personal'],
    note: 'Track how this manifests over the next 6 months.',
    createdAt: '2024-03-05T16:30:00Z',
  },
];

// ─── Demo Compatibility Factors (Ashtakoota) ───

export const demoCompatibilityFactors: CompatibilityFactor[] = [
  { name: 'Varna', nameDevanagari: 'वर्ण', score: 1, maxScore: 1, description: 'Spiritual compatibility and ego levels' },
  { name: 'Vashya', nameDevanagari: 'वश्य', score: 1, maxScore: 2, description: 'Mutual attraction and dominance' },
  { name: 'Tara', nameDevanagari: 'तारा', score: 3, maxScore: 3, description: 'Birth star compatibility and health' },
  { name: 'Yoni', nameDevanagari: 'योनि', score: 3, maxScore: 4, description: 'Physical and intimate compatibility' },
  { name: 'Graha Maitri', nameDevanagari: 'ग्रह मैत्री', score: 4, maxScore: 5, description: 'Mental compatibility and friendship' },
  { name: 'Gana', nameDevanagari: 'गण', score: 5, maxScore: 6, description: 'Temperament and nature alignment' },
  { name: 'Bhakoot', nameDevanagari: 'भकूट', score: 7, maxScore: 7, description: 'Emotional compatibility and prosperity' },
  { name: 'Nadi', nameDevanagari: 'नाडी', score: 8, maxScore: 8, description: 'Genetic and health compatibility' },
];

// ─── Demo System Status ───

export const demoSystemStatus: SystemStatus = {
  knowledgeBase: 'demo',
  calculationEngine: 'demo',
  aiModel: 'demo',
  indexedDocuments: 0,
};

// ─── Suggested Questions ───

export const suggestedQuestions: string[] = [
  'Explain my Lagna and its ruler.',
  'Analyse my 10th house for career indications.',
  'Explain my current Mahadasha.',
  'Explore my Navamsa chart.',
  'What factors are traditionally associated with career?',
  'Show the sources behind an interpretation.',
  'What yogas are formed in my chart?',
  'Analyse the relationship between my Moon and ascendant.',
];

// ─── Recent Analyses for Dashboard ───

export const recentAnalyses = [
  { id: 'ra-1', title: 'Career & Professional Direction', date: '2024-03-10', chartName: 'Arjun Mehta', conversationId: 'conv-1' },
  { id: 'ra-2', title: 'Planetary Period Overview', date: '2024-03-08', chartName: 'Arjun Mehta', conversationId: 'conv-2' },
  { id: 'ra-3', title: 'Navamsa Exploration', date: '2024-03-05', chartName: 'Arjun Mehta', conversationId: 'conv-3' },
  { id: 'ra-4', title: 'Birth Chart Overview', date: '2024-03-01', chartName: 'Arjun Mehta', conversationId: 'conv-4' },
];
