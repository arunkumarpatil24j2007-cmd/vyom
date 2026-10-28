import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Heart, Coins, Activity, Star,
  Sparkles, Compass, Calendar, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, BookOpen, AlertCircle, Orbit
} from 'lucide-react';
import { getActiveProfile, subscribeToGuestStore, type UserBirthDetails } from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import PlanetaryTransitVisualizer from '@/components/visual/PlanetaryTransitVisualizer';
import DashaTimelineVisualizer from '@/components/visual/DashaTimelineVisualizer';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import type { ChartData } from '@/types';

type CategoryId = 'career' | 'relationships' | 'wealth' | 'health' | 'growth';

interface CategoryData {
  id: CategoryId;
  label: string;
  icon: typeof Briefcase;
  color: string;
  theme: string;
  astrologicalTrigger: string;
  opportunity: string;
  caution: string;
  suggestedAction: string;
  timeframe: string;
  classicalSource: {
    text: string;
    chapter: string;
    shloka?: string;
    principle: string;
  };
  inDepthReasoning: string;
}

export default function PredictionsPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('career');
  const [expandedReasoning, setExpandedReasoning] = useState<boolean>(false);
  const [birthModalOpen, setBirthModalOpen] = useState(false);

  useEffect(() => {
    function load() {
      const current = getActiveProfile();
      setProfile(current);
      if (current) {
        try {
          const c = calculateNatalChart({
            name: current.name,
            birthDate: current.birthDate,
            birthTime: current.birthTimePrecision === 'unknown' ? '' : current.birthTime,
            birthTimePrecision: current.birthTimePrecision,
            birthPlace: current.birthPlace,
            latitude: current.latitude,
            longitude: current.longitude,
            timezone: current.timezone,
          });
          setChart(c);
        } catch (e) {
          console.error('Error calculating prediction chart:', e);
        }
      } else {
        setChart(null);
      }
    }

    load();
    const unsubscribe = subscribeToGuestStore(load);
    return unsubscribe;
  }, []);

  const lagnaName = chart?.ascendant ? (chart.ascendant.rashiName || chart.ascendant.sign) : 'Ascendant';
  const moonName = typeof chart?.moonSign === 'object' ? (chart.moonSign.rashiName || chart.moonSign.sign) : (chart?.moonSign || 'Moon');
  const dashaLord = chart?.activeDasha?.mahadasha || chart?.dashas?.[0]?.planet || 'Dasha Lord';

  const categoryCards: CategoryData[] = [
    {
      id: 'career',
      label: 'Career & Ambition',
      icon: Briefcase,
      color: '#FF4B19',
      theme: 'Strategic Leadership & Vocational Recognition',
      astrologicalTrigger: `Lagna (${lagnaName}) 10th Bhava dynamics influenced by ${dashaLord} Mahadasha cycle`,
      opportunity: 'Lead executive projects, establish thought leadership, publish high-impact work',
      caution: 'Avoid hasty lateral moves before key transit alignments stabilize',
      suggestedAction: 'Structure long-term roadmap; align daily focus with high-leverage outcomes',
      timeframe: 'Current Quarter Forecast',
      classicalSource: {
        text: 'Brihat Parashara Hora Shastra',
        chapter: 'Dasama Bhava Viveka (Ch. 13)',
        shloka: 'Verses 10-12',
        principle: 'The 10th house governs sustained action (Karma), executive commands, and durable professional reputation.'
      },
      inDepthReasoning: `For a ${lagnaName} native, vocational growth is amplified when the 10th lord and Lagna lord are honored through disciplined execution. Under ${dashaLord} Dasha, focus on mastering specialized knowledge rather than short-term acclaim.`
    },
    {
      id: 'relationships',
      label: 'Relationships & Alliances',
      icon: Heart,
      color: '#E32636',
      theme: 'Empathetic Discernment & Harmonious Reciprocity',
      astrologicalTrigger: `7th House (Kalatra Bhava) examined from ${moonName} Moon`,
      opportunity: 'Deepen emotional authenticity and mutual commitments with aligned partners',
      caution: 'Guard against projecting unspoken expectations into collaborative agreements',
      suggestedAction: 'Practice compassionate active listening; clarify expectations transparently',
      timeframe: 'Current Lunar Cycle',
      classicalSource: {
        text: 'Phaladeepika',
        chapter: 'Saptama Bhava Phala (Ch. 7)',
        shloka: 'Verses 14-16',
        principle: 'Benefics influencing the 7th house bestow mutual devotion, ethical alliances, and domestic equilibrium.'
      },
      inDepthReasoning: `Vedic principles prioritize the psychological harmony between Chandra (mind) and the 7th bhava. Cultivating patience allows bonds to mature without friction.`
    },
    {
      id: 'wealth',
      label: 'Wealth & Prosperity',
      icon: Coins,
      color: '#F7A928',
      theme: 'Sustainable Asset Accumulation & Ethical Enterprise',
      astrologicalTrigger: `2nd Bhava (Dhana) and 11th Bhava (Labha) axis`,
      opportunity: 'Scale dependable revenue streams and invest in foundational skills and assets',
      caution: 'Refrain from speculative, unverified high-risk ventures',
      suggestedAction: 'Consolidate savings, audit financial outlays, and pursue recurring equity',
      timeframe: 'Mid-Term Outlook',
      classicalSource: {
        text: 'Saravali',
        chapter: 'Ekadasa Bhava Adhyaya (Ch. 30)',
        shloka: 'Verses 4-6',
        principle: 'Planets placed in or aspecting the 11th house reward disciplined effort with sustained gains.'
      },
      inDepthReasoning: `True Vedic prosperity (Lakshmi) is grounded in Dharma. Aligning investments with ethical value creation produces durable financial independence.`
    },
    {
      id: 'health',
      label: 'Vitality & Balance',
      icon: Activity,
      color: '#08745B',
      theme: 'Sattvic Regimen, Nervous System Rest & Vitality',
      astrologicalTrigger: `Surya (Sun) vitality factor and 6th Bhava (Roga/Healing)`,
      opportunity: 'Establish a grounding circadian routine with meditation and nourishing nutrition',
      caution: 'Prevent mental fatigue caused by prolonged screen exposure and erratic sleep',
      suggestedAction: 'Engage in morning sunlight exposure (Surya Namaskar) and restorative hydration',
      timeframe: 'Daily Wellness Alignment',
      classicalSource: {
        text: 'Brihat Parashara Hora Shastra',
        chapter: 'Graha Gun Swaroopa (Ch. 3)',
        shloka: 'Verse 12',
        principle: 'Surya is the soul of all beings and the natural signifier of physical vitality and immunity.'
      },
      inDepthReasoning: `Vedic astrology views the body as a temple of cosmic energy. Preserving Ojas (vital vigor) through balanced rest directly enhances focus and clarity.`
    },
    {
      id: 'growth',
      label: 'Personal Growth & Dharma',
      icon: Star,
      color: '#2563EB',
      theme: 'Wisdom Integration & Spiritual Alignment',
      astrologicalTrigger: `9th Bhava (Dharma) & Guru (Jupiter) karakatva`,
      opportunity: 'Study profound classical philosophy, practice introspective journaling, seek mentors',
      caution: 'Avoid dogmatic rigidity; remain receptive to nuanced perspectives',
      suggestedAction: 'Dedicate 20 minutes daily to contemplation and sacred study',
      timeframe: 'Annual Cycle',
      classicalSource: {
        text: 'Jataka Parijata',
        chapter: 'Navama Bhava Prakarana (Ch. 11)',
        shloka: 'Verses 1-3',
        principle: 'The 9th house unlocks noble fortune (Bhagya) and higher philosophical illumination.'
      },
      inDepthReasoning: `Spiritual elevation occurs when the native acts in harmony with their Swadharma (authentic duty). Your chart highlights intellectual exploration as a vehicle for inner peace.`
    },
  ];

  const currentCategory = categoryCards.find((c) => c.id === selectedCategory) || categoryCards[0];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Top Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Compass size={14} />
            <span>Interactive Visual Astrology</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Cosmic Forecast & Transits
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            {profile
              ? `Structured astrological forecasts for ${profile.name} grounded in Lahiri Nirayana positions.`
              : 'Category-specific Jyotish analysis without arbitrary or fabricated scores.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-cream text-xs !py-2.5 !px-4 cursor-pointer"
          >
            <span>{profile ? 'Edit Birth Details' : 'Enter Details'}</span>
          </button>
          <Link
            to="/astrologer"
            className="btn-pill-orange text-xs !py-2.5 !px-4"
          >
            <Sparkles size={14} />
            <span>Consult Astrologer</span>
          </Link>
        </div>
      </div>

      {/* ═══ Missing Profile Alert ═══ */}
      {!profile && (
        <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center shrink-0">
              <Compass size={16} />
            </span>
            <div>
              <span className="font-bold text-[#09132E] block">Showing general framework</span>
              <span className="text-[#7A8294]">Enter your birth details to unlock personalized house and dasha alignments.</span>
            </div>
          </div>
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-orange !py-2 !px-4 text-xs shrink-0 cursor-pointer"
          >
            Enter Birth Details
          </button>
        </div>
      )}

      {/* ═══ Segmented Category Selector ═══ */}
      <div className="p-1.5 rounded-full bg-[#FAF2E8] border border-[#E8DCCB] flex items-center gap-1 overflow-x-auto shadow-xs">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setExpandedReasoning(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#09132E] text-white shadow-xs'
                  : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
              }`}
            >
              <Icon size={14} style={{ color: isActive ? '#FF4B19' : undefined }} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ Visual Transit Radar (Primary Celestial Visualization) ═══ */}
      <PlanetaryTransitVisualizer
        chart={chart}
        category={selectedCategory}
        timeframe={currentCategory.timeframe}
      />

      {/* ═══ Vimshottari Dasha Progression Timeline ═══ */}
      <DashaTimelineVisualizer
        dashas={chart?.dashas}
      />

      {/* ═══ Active Category Analysis Card ═══ */}
      <div className="card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-6 shadow-sm">
        {/* Category Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCCB]/60">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FF4B19] mb-1">
              <Calendar size={13} />
              <span>{currentCategory.timeframe}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#09132E]">
              {currentCategory.theme}
            </h2>
          </div>

          <Link
            to={`/astrologer?q=${encodeURIComponent(`Tell me more about my ${currentCategory.label} based on my chart`)}`}
            className="btn-pill-orange text-xs !py-2 !px-4 flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Sparkles size={13} />
            <span>Consult Astrologer</span>
          </Link>
        </div>

        {/* Astrological Trigger Banner */}
        <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] flex items-start gap-3">
          <Compass size={18} className="text-[#FF4B19] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-[#09132E] block">Planetary Factor & Trigger</span>
            <span className="text-[#4A5468]">{currentCategory.astrologicalTrigger}</span>
          </div>
        </div>

        {/* Actionable Triad: Opportunity, Caution, Suggested Action */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#08745B] block">Opportunity</span>
            <p className="font-semibold text-[#09132E] leading-relaxed">{currentCategory.opportunity}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#E32636] block">Caution</span>
            <p className="font-semibold text-[#09132E] leading-relaxed">{currentCategory.caution}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#2563EB] block">Suggested Action</span>
            <p className="font-semibold text-[#09132E] leading-relaxed">{currentCategory.suggestedAction}</p>
          </div>
        </div>

        {/* Classical Shastra Citation Card */}
        <div className="p-4 rounded-2xl bg-[#FAF2E8]/80 border border-[#E8DCCB] space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#08745B]" />
            <span className="text-xs font-bold text-[#09132E]">{currentCategory.classicalSource.text}</span>
            <span className="text-[11px] text-[#7A8294]">({currentCategory.classicalSource.chapter})</span>
          </div>
          <blockquote className="text-xs italic text-[#2D3748] border-l-2 border-[#08745B] pl-3 py-0.5">
            "{currentCategory.classicalSource.principle}"
          </blockquote>
        </div>

        {/* Expandable Detailed Astrological Reasoning */}
        <div className="pt-2 border-t border-[#E8DCCB]/60">
          <button
            onClick={() => setExpandedReasoning(!expandedReasoning)}
            className="flex items-center justify-between w-full text-left text-xs font-bold text-[#09132E] hover:text-[#FF4B19] transition-colors py-2 cursor-pointer"
          >
            <span>In-Depth Astrological Reasoning & Chart Factors</span>
            {expandedReasoning ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {expandedReasoning && (
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] text-xs text-[#4A5468] leading-relaxed mt-2 animate-fade-in space-y-2">
              <p>{currentCategory.inDepthReasoning}</p>
              <p className="text-[11px] text-[#7A8294]">
                Note: In authentic Vedic astrology, planetary influences indicate predisposition and potential. Individual outcomes are shaped by personal volition (Purushartha) and ethical action.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Birth Profile Modal */}
      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </div>
  );
}
