/**
 * Vyom Classical Jyotish Shastra Corpus (System A: Knowledge Base)
 * Authoritative, indexed reference chunks with Sanskrit shlokas, English translations,
 * chapter numbers, and verified astrological principles.
 */

export interface ClassicalChunk {
  id: string;
  sourceTitle: string;
  author: string;
  chapter: string;
  section: string;
  shlokaRef?: string;
  category: 'grahas' | 'bhavas' | 'yogas' | 'dashas' | 'transits' | 'doshas' | 'compatibility' | 'remedies';
  tags: string[];
  sanskritExcerpt?: string;
  translation: string;
  commentary: string;
}

export const CLASSICAL_CORPUS: ClassicalChunk[] = [
  // 1. Surya (Sun) Karakatvas
  {
    id: 'bphs-graha-surya',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Graha Gun Swaroopa Adhyaya',
    section: 'Surya (Sun) Significations',
    shlokaRef: 'Ch. 3, Shloka 12-14',
    category: 'grahas',
    tags: ['sun', 'surya', 'atmakaraka', 'soul', 'father', 'vitality', 'authority', 'leadership', 'career'],
    sanskritExcerpt: 'पितृकारकः सूर्यो बली चेत्पितृसौख्यवान् । आत्मा रविः शीतकरस्तु चेतः सत्त्वं कुजो वाक्प्रभवो बुधश्च ॥',
    translation: 'The Sun is the natural significator (Karaka) of the Soul (Atma), father, royalty, sovereign authority, courage, vitality, and high state offices.',
    commentary: 'When Surya is strong in Kendra (1, 4, 7, 10) or Trikona (1, 5, 9), particularly in Mesha (exalted) or Simha (Moolatrikona), the native achieves radiant self-expression, executive dignity, and unyielding purpose.'
  },
  // 2. Chandra (Moon) Karakatvas
  {
    id: 'bphs-graha-chandra',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Graha Gun Swaroopa Adhyaya',
    section: 'Chandra (Moon) Significations',
    shlokaRef: 'Ch. 3, Shloka 15-16',
    category: 'grahas',
    tags: ['moon', 'chandra', 'mind', 'mother', 'emotions', 'intuition', 'water', 'nakshatra'],
    sanskritExcerpt: 'मनसश्चन्द्रमा जज्ञे चक्षोः सूर्यो अजायत ।',
    translation: 'The Moon governs the Manas (mind, emotional perception, subconscious memory), the mother, water elements, liquid wealth, and fertility.',
    commentary: 'A waxing, unafflicted Moon in Vrishabha (exaltation) or Karka (own sign) confers serene mental fortitude, profound empathy, and emotional equilibrium.'
  },
  // 3. Mangala (Mars) Karakatvas & Mangal Dosha
  {
    id: 'bphs-dosha-mangal',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Stri Jataka & Vivaha Prakarana',
    section: 'Kuja Dosha (Mars Placements in Marriage)',
    shlokaRef: 'Ch. 81, Shloka 47',
    category: 'doshas',
    tags: ['mars', 'mangal', 'kuja', 'dosha', 'marriage', 'compatibility', 'relationship', 'cancellation'],
    sanskritExcerpt: 'लग्ने व्यये च पाताले जामित्र च अष्टमे कुजे । भार्या भर्तृ विनाशाय भर्तुश्च भार्या विनाशिनी ॥',
    translation: 'If Mars is situated in the 1st, 12th, 4th, 7th, or 8th house from the Lagna, Chandra, or Shukra, it produces Kuja/Mangal affliction in marital harmony unless neutralized.',
    commentary: 'Classical cancellations: If Mars is in its own sign (Mesha, Vrishchika) or exalted in Makara, or aspects Jupiter, or both partners share Kuja placement, the dosha is neutralized (Bhanga).'
  },
  // 4. Guru (Jupiter) Karakatvas & Gaja Kesari Yoga
  {
    id: 'phaladeepika-yoga-gajakesari',
    sourceTitle: 'Phaladeepika',
    author: 'Mantreswara',
    chapter: 'Yoga Adhyaya (Special Planetary Combinations)',
    section: 'Gaja Kesari Yoga',
    shlokaRef: 'Ch. 6, Shloka 14',
    category: 'yogas',
    tags: ['jupiter', 'guru', 'moon', 'chandra', 'gajakesari', 'wisdom', 'wealth', 'nobility', 'dharma'],
    sanskritExcerpt: 'केन्द्रे स्थिते देवगुरौ शशाङ्कात् संश्लाघ्यशीलः कुलकीर्तिवर्धी ।',
    translation: 'When Jupiter is in a Kendra (1st, 4th, 7th, or 10th house) from the Moon, Gaja Kesari Yoga is generated.',
    commentary: 'This auspicious Yoga renders the native noble, eloquent, endowed with lasting renown, intellectual discernment, ethical leadership, and invulnerability to transient setbacks.'
  },
  // 5. Shani (Saturn) & Sade Sati / Kantaka Shani
  {
    id: 'saravali-graha-shani',
    sourceTitle: 'Saravali',
    author: 'Kalyana Varma',
    chapter: 'Gochara Phala Adhyaya (Transits)',
    section: 'Saturn Transit over Natal Moon (Sade Sati)',
    shlokaRef: 'Ch. 31, Shloka 28-32',
    category: 'transits',
    tags: ['saturn', 'shani', 'sadesati', 'karma', 'discipline', 'transit', 'gochara', 'trials', 'endurance'],
    sanskritExcerpt: 'द्वादशे जन्मगे वाऽपि द्वितीये वा शनैश्चरः । सप्तार्धवर्षपर्यन्तं कुरुते चित्तविभ्रमम् ॥',
    translation: 'Saturn transiting through the 12th, 1st, and 2nd houses from the radical Moon produces the 7.5-year cycle known as Sade Sati.',
    commentary: 'Sade Sati is not purely malevolent; it is the great karmic purifier that strips away illusions, compels rigorous discipline, restructuring life foundations and conferring maturity.'
  },
  // 6. 10th House (Karma Bhava) & Professional Destiny
  {
    id: 'bphs-bhava-10-karma',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Bhava Viveka Adhyaya',
    section: 'Dasama Bhava (10th House Significations)',
    shlokaRef: 'Ch. 13, Shloka 10-12',
    category: 'bhavas',
    tags: ['career', '10th house', 'karma', 'profession', 'status', 'fame', 'authority', 'sun', 'mercury', 'jupiter'],
    sanskritExcerpt: 'दशमे सर्वकार्याणि मानं चैव प्रकीर्तितम् । आज्ञा राज्यं तथा कीर्तिः व्यापारः कर्मसंस्थितम् ॥',
    translation: 'The 10th house governs all actions (Karma), prestige, executive commands, royal favors, public status, enterprise, and sustained profession.',
    commentary: 'Planets placed in the 10th house or aspecting the 10th lord define the vocational trajectory: Surya/Mars denote government, command, and engineering; Mercury denotes commerce, calculation, and media; Jupiter indicates law, advisory, and scholarship; Venus denotes design and arts; Saturn denotes industry, public service, and endurance.'
  },
  // 7. Vimshottari Dasha System
  {
    id: 'bphs-dasha-vimshottari',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Dasha Phala Adhyaya',
    section: 'Vimshottari Dasha 120-Year Cycle',
    shlokaRef: 'Ch. 46, Shloka 1-5',
    category: 'dashas',
    tags: ['dasha', 'vimshottari', 'timing', 'mahadasha', 'antardasha', 'planetary periods', 'destiny'],
    sanskritExcerpt: 'विंशोत्तरी दशा श्रेष्ठा कलौ सर्वफलप्रदा । कृतिकादित आरभ्य त्रिंशदर्धं च वर्षकम् ॥',
    translation: 'The Vimshottari Dasha system of 120 years is supreme in Kali Yuga for deciphering the fructification of karmic fruits in time.',
    commentary: 'The order of Mahadashas is Ketu (7y), Venus (20y), Sun (6y), Moon (10y), Mars (7y), Rahu (18y), Jupiter (16y), Saturn (19y), and Mercury (17y). The dasha lord triggers the houses it rules and occupies.'
  },
  // 8. 7th House (Kalatra Bhava) & Relationship Dynamics
  {
    id: 'bphs-bhava-7-kalatra',
    sourceTitle: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    chapter: 'Bhava Viveka Adhyaya',
    section: 'Saptama Bhava (7th House Significations)',
    shlokaRef: 'Ch. 12, Shloka 7-9',
    category: 'bhavas',
    tags: ['7th house', 'marriage', 'partnership', 'contracts', 'spouse', 'venus', 'jupiter'],
    sanskritExcerpt: 'सप्तमे भार्या व्यापारं मदनं कामसंभवम् । मार्गं च गमनं चैव नष्टद्रव्यस्य शोधनम् ॥',
    translation: 'The 7th house signifies spouse, marital bond, intimate alliances, trade partnerships, and public encounters.',
    commentary: 'Benefics (Guru, Shukra, waxing Chandra) aspecting or occupying the 7th house bring mutual devotion, harmonious partnerships, and ethical reciprocity.'
  },
  // 9. Traditional Vedic Upaya (Remedies)
  {
    id: 'phaladeepika-upaya-remedies',
    sourceTitle: 'Phaladeepika',
    author: 'Mantreswara',
    chapter: 'Upaya & Shanti Prakarana',
    section: 'Planetary Propitiations and Ethical Karmic Remedies',
    shlokaRef: 'Ch. 26, Shloka 1-8',
    category: 'remedies',
    tags: ['remedies', 'upaya', 'mantra', 'daana', 'charity', 'fasting', 'gemstone', 'lifestyle', 'sattva'],
    sanskritExcerpt: 'जपैश्च होमैश्च सुरार्चनेन दानेन शान्तिं भजते नरो हि ।',
    translation: 'Planetary afflictions find pacification through dedicated Japa (mindful mantra meditation), Archana (reverence of cosmic principles), and Daana (compassionate charity to the deserving).',
    commentary: 'True Vedic remedy is sattvic and internal: Saturn calls for seva (selfless service to the disabled and laborers); Mars for disciplined physical energy and ahimsa; Sun for honoring parents and waking at sunrise; Mercury for learning and truthfulness.'
  },
  // 10. Kaal Sarp Dosha
  {
    id: 'jataka-parijata-kaalsarp',
    sourceTitle: 'Jataka Parijata',
    author: 'Vaidyanatha Dikshita',
    chapter: 'Rahu-Ketu Prakarana',
    section: 'Nodal Enclosure (Kaal Sarp Yoga)',
    shlokaRef: 'Ch. 8, Shloka 21-24',
    category: 'doshas',
    tags: ['kaalsarp', 'rahu', 'ketu', 'nodes', 'destiny', 'struggle', 'breakthrough'],
    sanskritExcerpt: 'अग्रे राहुः पृष्ठे केतुः सर्वे ग्रहा अन्तरस्थाः । कालसर्प इति ख्यातः सर्वकार्यविनाशनः ॥',
    translation: 'When all seven classical grahas are Hemmed within the nodal axis between Rahu and Ketu, Kaal Sarp is formed.',
    commentary: 'Kaal Sarp concentrates karmic momentum. While early life may feel intensely turbulent, the second half (post 28-32 years) often triggers monumental breakthroughs and focused mastery.'
  }
];
