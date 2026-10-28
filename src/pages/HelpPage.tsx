import { useState } from 'react';
import {
  HelpCircle, BookOpen, Compass, Sparkles, ChevronDown,
  Layers, Info, ShieldCheck, CheckCircle2, Star, Search
} from 'lucide-react';

export default function HelpPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [glossarySearch, setGlossarySearch] = useState('');

  const glossary = [
    { term: 'Lagna (Ascendant)', sanskrit: 'लग्न', def: 'The zodiacal sign rising on the eastern horizon at the exact moment and latitude/longitude of birth. Forms the 1st House (Tanu Bhava) and anchors the entire horoscope.' },
    { term: 'Rashi (Zodiac Sign)', sanskrit: 'राशि', def: 'One of the twelve 30-degree divisions of the sidereal zodiac, from Mesha (Aries) to Meena (Pisces).' },
    { term: 'Bhava (House)', sanskrit: 'भाव', def: 'The twelve astrological houses representing distinct areas of human experience, such as vitality (1st), wealth (2nd), and career (10th).' },
    { term: 'Nakshatra (Lunar Mansion)', sanskrit: 'नक्षत्र', def: 'The 27 asterisms along the ecliptic, each spanning 13°20\', governed by planetary lords and ruling deities. Crucial for determining Dasha timing.' },
    { term: 'Dasha (Planetary Period)', sanskrit: 'दशा', def: 'The major timing cycle in Vedic astrology (Vimshottari Dasha spans 120 years), revealing when specific planetary karmas manifest in life.' },
    { term: 'Gochar (Transit)', sanskrit: 'गोचर', def: 'The real-time motion of celestial bodies across the sky relative to the natal planets and ascendant.' },
    { term: 'Drishti (Planetary Aspect)', sanskrit: 'दृष्टि', def: 'The glance or energetic influence cast by planets onto other houses and planets (e.g. all planets aspect the 7th house; Mars, Jupiter, and Saturn cast special aspects).' },
    { term: 'Varga (Divisional Chart)', sanskrit: 'वर्ग', def: 'Harmonic subdivisions of the natal chart, such as the Navamsa (D9) for marriage/dharma and the Dasamsa (D10) for career and status.' },
    { term: 'Shadbala', sanskrit: 'षड्बल', def: 'The six-fold system of evaluating planetary strength: Positional (Sthana), Directional (Dig), Temporal (Kala), Motional (Chesta), Natural (Naisargika), and Aspectual (Drik).' },
  ];

  const faqs = [
    {
      q: 'How does Vyom calculate my birth chart?',
      a: 'We use high-precision sidereal ephemeris calculations coupled with the Lahiri (Chitra Paksha) Ayanamsha. Your exact geographic coordinates and UTC birth timestamp determine the planetary longitudes, house cusps, and Nakshatra padas.'
    },
    {
      q: 'How does Vyom ensure astrological authenticity?',
      a: 'All interpretations are strictly grounded in verified Sanskrit treatises (Brihat Parashara Hora Shastra, Phaladeepika, Saravali, etc.). Consultations directly cross-reference classical shlokas and proven rule factors for each interpretation.'
    },
    {
      q: 'How do I read the North Indian diamond chart?',
      a: 'In a North Indian chart, the houses are fixed in place. The top central diamond is ALWAYS the 1st House (Lagna). The houses proceed counter-clockwise: House 2 is to the upper-left, House 3 to the lower-left, House 4 is the bottom-left diamond, and so forth. The numbers written inside the diamond correspond to the Zodiac Signs (e.g. 1 = Aries, 5 = Leo).'
    },
    {
      q: 'What is the difference between Vedic and Western astrology?',
      a: 'Vedic astrology (Jyotish) uses the Sidereal zodiac, which is aligned with the observable fixed constellations of the cosmos, accounting for the precession of equinoxes. Western astrology predominantly uses the Tropical zodiac, which is anchored to the seasonal solstices and equinoxes.'
    },
  ];

  const filteredGlossary = glossary.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.sanskrit.includes(glossarySearch) ||
    g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gold uppercase mb-1">
          <HelpCircle size={14} />
          <span>Documentation & Primer</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
          Help, Methodology & Jyotish Glossary
        </h1>
        <p className="text-sm text-text-3 mt-1">
          Learn how to interpret Kundlis, navigate Astrologer consultations, and explore core Vedic concepts
        </p>
      </div>

      {/* Reading a North Indian Kundli visual guide */}
      <div className="glass-card rounded-2xl p-6 border border-gold/30 bg-gradient-to-r from-surface-1/90 via-surface-2/60 to-surface-1/90 space-y-4">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-gold" />
          <h2 className="text-lg font-bold text-text">How to Read a North Indian Kundli</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-text-2 leading-relaxed">
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border space-y-2">
            <span className="text-xs font-bold text-gold uppercase">1. Fixed House Layout</span>
            <p>
              The 12 Bhavas never rotate. The top central diamond is perpetually the <strong>1st House (Lagna / Ascendant)</strong>, governing vitality, self, and physical life.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border space-y-2">
            <span className="text-xs font-bold text-gold-light uppercase">2. Counter-Clockwise Count</span>
            <p>
              Follow counter-clockwise direction to find the 2nd house (top-left triangle), 3rd house, 4th house (left central diamond), through to the 12th house (top-right triangle).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border space-y-2">
            <span className="text-xs font-bold text-indigo uppercase">3. Signs (Rashis)</span>
            <p>
              The numeric digits inside the boxes represent the <strong>Zodiac Sign</strong> occupying that house (1 = Aries, 2 = Taurus, ... 12 = Pisces). Planets are placed in their respective houses.
            </p>
          </div>
        </div>
      </div>

      {/* Jyotish Glossary */}
      <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen size={18} className="text-gold" />
              <span>Vedic Astrological Lexicon</span>
            </h2>
            <p className="text-xs text-text-3">Core terms and Sanskrit designations</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
            <input
              type="text"
              placeholder="Search glossary..."
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              className="input-field pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredGlossary.map((item) => (
            <div
              key={item.term}
              className="p-4 rounded-xl bg-surface-2/60 border border-border/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-text text-sm">{item.term}</h4>
                <span className="text-xs text-gold font-medium font-sans">{item.sanskrit}</span>
              </div>
              <p className="text-xs text-text-3 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-card rounded-2xl p-6 border border-border space-y-4">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <HelpCircle size={18} className="text-gold" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="border border-border rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-text hover:bg-surface-2/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-gold transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {activeFaq === i && (
                <div className="px-4 pb-4 pt-1 text-xs text-text-3 leading-relaxed border-t border-border/40 bg-surface-1/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
