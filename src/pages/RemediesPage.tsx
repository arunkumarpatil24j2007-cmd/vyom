import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, BookOpen, Heart, ShieldCheck, Sun,
  CheckCircle2, AlertCircle, ArrowRight, Star,
  Compass, Clock, HeartHandshake, Eye, Feather, HelpCircle
} from 'lucide-react';

interface RemedyItem {
  id: string;
  category: 'mantra' | 'charity' | 'meditation' | 'lifestyle';
  targetGraha: string;
  title: string;
  shortPurpose: string;
  timing: string;
  steps: string[];
  sourceReference: string;
  safetyPrecaution: string;
  detailedContext: string;
  icon: typeof Sun;
  accentColor: string;
}

export default function RemediesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const remedies: RemedyItem[] = [
    {
      id: 'mantra_surya',
      category: 'mantra',
      targetGraha: 'Surya (Sun) • Vitality & Leadership',
      title: 'Surya Arghya & Gayatri Contemplation at Dawn',
      shortPurpose: 'Fortifies inner willpower, natural vitality, and mental clarity through morning solar light attunement.',
      timing: 'Daily at sunrise or during Brahma Muhurta (approx. 48 minutes before sunrise)',
      steps: [
        'Wake before sunrise and complete morning cleansing.',
        'Offer clean water from a copper vessel (Arghya) toward the rising sun.',
        'Sit peacefully for 10 minutes reciting the Gayatri or Surya Gayatri mantra.',
        'Cultivate reverence for the source of physical light and inner consciousness.'
      ],
      sourceReference: 'Brihat Parashara Hora Shastra, Ch. 84 (Surya Upaya Prakarana)',
      safetyPrecaution: 'Gentle contemplative ritual. Avoid staring directly into mid-day sun; practice only in early soft dawn light.',
      detailedContext: 'Classical Vedic astrology identifies Surya as the natural Atmakaraka (soul significator). Dawn contemplation stimulates the circadian melatonin-serotonin cycle while cultivating serene executive confidence.',
      icon: Sun,
      accentColor: '#FF4B19',
    },
    {
      id: 'daan_shani',
      category: 'charity',
      targetGraha: 'Shani (Saturn) • Karmic Rectification & Discipline',
      title: 'Seva (Selfless Service) & Food Donation for Laborers',
      shortPurpose: 'Neutralizes harsh karmic friction and Sade Sati intensity through humility and compassionate support for working laborers.',
      timing: 'Saturdays or during Shani Hora',
      steps: [
        'Identify community members, construction workers, or elderly individuals in genuine need.',
        'Provide nutritious food, clean water, or seasonal clothing with sincere humility.',
        'Feed birds or animals (such as black sesame or seeds) in quiet natural spaces.',
        'Maintain quiet self-restraint and avoid speaking pridefully of charitable acts.'
      ],
      sourceReference: 'Phaladeepika by Mantreswara, Ch. 28 (Shanti Prakarana)',
      safetyPrecaution: 'Direct compassionate charity. Never spend beyond your financial means; true Vedic dana is about humble intent.',
      detailedContext: 'Saturn represents the dignity of labor, time, and patient endurance. Classical Jyotish asserts that genuine humility and practical aid to laborers are vastly superior to expensive mechanical rituals.',
      icon: Heart,
      accentColor: '#09132E',
    },
    {
      id: 'meditation_jupiter',
      category: 'meditation',
      targetGraha: 'Guru (Jupiter) • Wisdom & Dharma',
      title: 'Svadhyaya (Sacred Philosophical Study) & Breathwork',
      shortPurpose: 'Fortifies optimism, ethical discernment, and intellectual breadth by steeping the intellect in timeless wisdom.',
      timing: 'Thursdays or evenings before sleep',
      steps: [
        'Select an authentic philosophical treatise (Upanishads, Bhagavad Gita, or Marcus Aurelius).',
        'Read 1-2 pages slowly and take 5 minutes to reflect on how to apply the principle in daily ethics.',
        'Engage in 10 minutes of gentle Pranayama (Anulom Vilom / alternate nostril breathing).',
        'Offer mental gratitude to all teachers and mentors who helped your growth.'
      ],
      sourceReference: 'Saravali by Kalyana Varma, Ch. 34 (Guru Phala Viveka)',
      safetyPrecaution: 'Intellectual and contemplative practice. Accessible to all individuals without restriction.',
      detailedContext: 'Jupiter signifies Sattva (purity of intention), knowledge, and dharma. Svadhyaya purifies mental confusion and aligns vocational choices with long-term ethical purpose.',
      icon: Feather,
      accentColor: '#F7A928',
    },
    {
      id: 'lifestyle_mars',
      category: 'lifestyle',
      targetGraha: 'Mangala (Mars) • Physical Vitality & Ahimsa',
      title: 'Disciplined Physical Training & Conscious Ahimsa',
      shortPurpose: 'Channels excess martial heat and Kuja aggression into constructive stamina, sports, and patient speech.',
      timing: 'Tuesdays and ongoing daily routine',
      steps: [
        'Engage in regular physical exercise, yoga asanas, or martial conditioning.',
        'When anger or impatience arises, pause for 3 deep breaths before replying in communication.',
        'Practice non-violence (Ahimsa) in thought and dietary choices where practical.',
        'Channel competitive drive toward personal self-mastery rather than interpersonal conflict.'
      ],
      sourceReference: 'Brihat Parashara Hora Shastra, Ch. 81 (Stri Jataka & Kuja Dosha Shanti)',
      safetyPrecaution: 'Do not overstrain physically; adapt exercise intensity to your current medical health.',
      detailedContext: 'Mars represents biological vitality (Tejas) and assertiveness. When unguided, it produces friction; when harnessed through disciplined physical habits, it confers unyielding courage.',
      icon: ShieldCheck,
      accentColor: '#E32636',
    },
  ];

  const filtered = selectedCategory === 'all'
    ? remedies
    : remedies.filter((r) => r.category === selectedCategory);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#08745B] mb-1">
            <Feather size={14} />
            <span>Sattvic Vedic Upayas (Remedial Measures)</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Astrological Remedies & Practices
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            Ethical, constructive rituals derived from Brihat Parashara Hora Shastra and Phaladeepika.
          </p>
        </div>

        <Link
          to="/astrologer?q=What%20personal%20remedial%20upayas%20are%20most%20effective%20for%20my%20chart?"
          className="btn-pill-orange text-xs !py-2.5 !px-4 self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Consult for Tailored Upayas</span>
        </Link>
      </div>

      {/* ═══ Safety & Ethical Notice ═══ */}
      <div className="p-4 rounded-2xl bg-[#08745B]/10 border border-[#08745B]/20 flex items-start gap-3 text-xs leading-relaxed text-[#2D3748]">
        <ShieldCheck size={18} className="text-[#08745B] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#09132E] block">Ethical Remedial Philosophy</span>
          <span>
            True Vedic astrology never endorses fear-mongering, hazardous asceticism, or commercialized guaranteed-outcome rituals. Authentic remedies are internal: cultivating self-discipline, compassionate service (Seva), ethical mindfulness, and sacred contemplation.
          </span>
        </div>
      </div>

      {/* ═══ Category Tabs ═══ */}
      <div className="p-1.5 rounded-full bg-[#FAF2E8] border border-[#E8DCCB] flex items-center gap-1 overflow-x-auto shadow-xs text-xs">
        {[
          { id: 'all', label: 'All Practices' },
          { id: 'mantra', label: 'Mantras & Japa' },
          { id: 'charity', label: 'Seva & Dana (Charity)' },
          { id: 'meditation', label: 'Meditation & Study' },
          { id: 'lifestyle', label: 'Lifestyle & Habits' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#09132E] text-white shadow-xs'
                : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Remedy Cards Grid ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rem) => {
          const Icon = rem.icon;
          const isExpanded = expandedId === rem.id;

          return (
            <div
              key={rem.id}
              className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#FF4B19]/40 transition-all"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: rem.accentColor }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8294] block">
                        {rem.targetGraha}
                      </span>
                      <h3 className="font-extrabold text-base text-[#09132E] leading-snug">
                        {rem.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#4A5468] leading-relaxed">
                  {rem.shortPurpose}
                </p>

                {/* Timing Badge */}
                <div className="p-2.5 rounded-xl bg-[#FFF8EF] border border-[#E8DCCB] flex items-center gap-2 text-[11px] text-[#09132E]">
                  <Clock size={13} className="text-[#FF4B19] shrink-0" />
                  <span><strong>Optimal Timing:</strong> {rem.timing}</span>
                </div>

                {/* Practical Steps */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-[#7A8294] block">
                    Recommended Steps:
                  </span>
                  <ul className="space-y-1 text-xs text-[#2D3748] pl-3 list-disc marker:text-[#08745B]">
                    {rem.steps.map((st, i) => (
                      <li key={i} className="pl-1">{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Shastra Source Reference */}
                <div className="flex items-center gap-1.5 text-[10px] text-[#7A8294] pt-1">
                  <BookOpen size={12} className="text-[#08745B]" />
                  <span>Source: {rem.sourceReference}</span>
                </div>
              </div>

              {/* Expandable Context & Precaution */}
              <div className="pt-3 border-t border-[#E8DCCB]/60">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rem.id)}
                  className="text-xs font-bold text-[#FF4B19] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Details' : 'View In-Depth Context & Safety'}</span>
                  <ArrowRight size={12} className={`transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-3 p-3.5 rounded-2xl bg-white border border-[#E8DCCB] text-xs space-y-2 animate-fade-in">
                    <div>
                      <span className="font-bold text-[#09132E] block text-[11px]">Jyotish Rationale:</span>
                      <p className="text-[#4A5468] text-[11px] leading-relaxed">{rem.detailedContext}</p>
                    </div>
                    <div className="pt-1 border-t border-[#E8DCCB]/60">
                      <span className="font-bold text-[#08745B] block text-[10px] uppercase">Safety Note:</span>
                      <p className="text-[#7A8294] text-[10px]">{rem.safetyPrecaution}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
