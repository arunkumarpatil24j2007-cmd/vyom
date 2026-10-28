import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Sparkles,
  BookOpen, Heart, Clock, ArrowRight, Shield, Info, Compass
} from 'lucide-react';
import { getActiveProfile, subscribeToGuestStore, type UserBirthDetails } from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import {
  evaluateMangalDosha,
  evaluateKaalSarpDosha,
  evaluateSadeSati,
} from '@/lib/astrology/rules/evaluateDosha';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import type { ChartData } from '@/types';

export default function DoshaPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedDosha, setSelectedDosha] = useState<string>('mangal');
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
          console.error('Error calculating Dosha chart:', e);
        }
      } else {
        setChart(null);
      }
    }

    load();
    const unsubscribe = subscribeToGuestStore(load);
    return unsubscribe;
  }, []);

  const mangal = chart ? evaluateMangalDosha(chart) : null;
  const kaalSarp = chart ? evaluateKaalSarpDosha(chart) : null;
  const sadeSati = chart ? evaluateSadeSati(chart) : null;

  const doshaCards = [
    {
      id: 'mangal',
      name: 'Kuja (Manglik) Analysis',
      status: mangal
        ? mangal.hasDosha
          ? mangal.isCancelled
            ? 'Cancelled (Bhanga)'
            : 'Active Affliction'
          : 'Absent (No Dosha)'
        : 'Awaiting Chart',
      isAfflicted: Boolean(mangal?.hasDosha && !mangal?.isCancelled),
      color: mangal?.hasDosha && !mangal?.isCancelled ? '#E32636' : '#08745B',
      placements: mangal ? `Mars in Bhava ${mangal.marsHouse} (${mangal.marsSign})` : 'N/A',
      cancellationRule: mangal?.cancellationReason || 'Mars is not in the 1st, 2nd, 4th, 7th, 8th or 12th house from Lagna (or the birth time is unknown).',
      classicalText: 'Kuja Dosha and its cancellations (Parihara) come from the marriage chapters of Muhurta Chintamani (Vivaha Prakarana) and Prashna Marga Ch. 21; they are not emphasised in early BPHS or Brihat Jataka. Cancellations include Mars in own/exalted sign, Cancer/Leo Lagna, Jupiter’s aspect or conjunction, and house-specific sign rules.',
      interpretation: mangal?.hasDosha
        ? mangal.isCancelled
          ? `Mars is present in House ${mangal.marsHouse}, but classical cancellations apply: ${mangal.cancellationReason}. Energy is channeled productively.`
          : `Mars is placed in House ${mangal.marsHouse} without standard cancellation. Suggests high drive, assertiveness, and requires conscious patience in relationships.`
        : 'Mars is outside the Manglik houses (1, 2, 4, 7, 8, 12 from Lagna), or the birth time is unknown so the Lagna-based check cannot be made.',
      remedy: 'Mindful, patient communication and regular physical discipline. Optional: a devotional practice such as the Mangal Gayatri, if it is meaningful to you. No paid ritual is required.',
    },
    {
      id: 'sade_sati',
      name: 'Shani Sade Sati (Saturn 7.5y Cycle)',
      status: sadeSati
        ? sadeSati.isActive
          ? `Active (${sadeSati.phase} Phase)`
          : 'Inactive'
        : 'Awaiting Chart',
      isAfflicted: Boolean(sadeSati?.isActive),
      color: sadeSati?.isActive ? '#FF9A20' : '#08745B',
      placements: sadeSati ? `Natal Moon in ${sadeSati.moonSign}; Saturn transiting ${sadeSati.saturnSign}` : 'N/A',
      cancellationRule: sadeSati?.isActive ? 'Progresses through 12th, 1st, and 2nd from radical Moon.' : 'Saturn is outside the 12th, 1st, or 2nd from natal Moon.',
      classicalText: 'Phaladeepika Ch. 26 (Gochara): Saturn transiting the 12th, 1st and 2nd signs from the natal Moon. Its experience is modulated by the running Dasha and Ashtakavarga, and it is read as a cycle of maturation rather than misfortune.',
      interpretation: sadeSati?.isActive
        ? `You are currently experiencing the ${sadeSati.phase} phase of Sade Sati. This period calls for rigorous discipline, patience, and dismantling of unsustainable illusions.`
        : 'Transiting Saturn is not in the 12th, 1st or 2nd sign from your natal Moon, so Sade Sati is not running now.',
      remedy: 'Seva (selfless service to the elderly or underprivileged), recitation of Hanuman Chalisa on Saturdays, ethical dedication.',
    },
    {
      id: 'kaal_sarp',
      name: 'Kaal Sarp Yoga Evaluation',
      status: kaalSarp
        ? kaalSarp.hasDosha
          ? 'Configuration present (non-classical)'
          : 'Absent (No Enclosure)'
        : 'Awaiting Chart',
      isAfflicted: Boolean(kaalSarp?.hasDosha),
      color: kaalSarp?.hasDosha ? '#FF9A20' : '#08745B',
      placements: chart
        ? `Rahu in ${chart.planets.find((p) => p.planet === 'Rahu')?.sign || 'N/A'}, Ketu in ${chart.planets.find((p) => p.planet === 'Ketu')?.sign || 'N/A'}`
        : 'N/A',
      cancellationRule: kaalSarp?.hasDosha ? 'All 7 classical planets hemmed between Rahu and Ketu.' : 'Planets are freely distributed outside the nodal axis.',
      classicalText: 'Kala Sarpa does not appear in Brihat Parashara Hora Shastra, Brihat Jataka, Phaladeepika, Saravali or Jataka Parijata. It is a 20th-century popularisation, derived loosely from the Nabhasa "Sarpa Yoga" (BPHS Ch. 35) and documented as non-classical by K.N. Rao, B.V. Raman, de Fouw & Svoboda.',
      interpretation: kaalSarp?.hasDosha
        ? 'All seven planets lie on one side of the Rahu–Ketu axis. Classical astrology attaches no Dosha to this; read the individual houses occupied by Rahu, Ketu and the planets instead. No remedy is needed.'
        : 'Your birth chart has planets distributed naturally across both hemispheres of the nodal axis. No Kaal Sarp enclosure is present.',
      remedy: 'None required by the classical texts. Grounded daily routines help with any period of intensity; devotional practice is optional and personal.',
    },
  ];

  const activeDoshaData = doshaCards.find((d) => d.id === selectedDosha) || doshaCards[0];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <ShieldCheck size={14} />
            <span>Karmic Patterns & Classical Cancellations</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Dosha & Karmic Analysis
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            {profile
              ? `Evaluating classical planetary afflictions and cancellations for ${profile.name}.`
              : 'Grounded evaluation of Kuja, Sade Sati, and Kaal Sarp without fear-based superstition.'}
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
            to="/remedies"
            className="btn-pill-orange text-xs !py-2.5 !px-4"
          >
            <Sparkles size={14} />
            <span>View Remedies</span>
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
              <span className="font-bold text-[#09132E] block">Dosha verification requires your true birth chart</span>
              <span className="text-[#7A8294]">Enter your birth details to verify your genuine planetary placements and cancellations.</span>
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

      {/* ═══ Dosha Selector Pills ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {doshaCards.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDosha(d.id)}
            className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
              selectedDosha === d.id
                ? 'bg-[#09132E] text-white border-[#09132E] shadow-md'
                : 'bg-white text-[#09132E] border-[#E8DCCB] hover:border-[#FF4B19]/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: selectedDosha === d.id ? '#FF4B19' : d.color }}>
                {d.name.split(' ')[0]}
              </span>
              {d.isAfflicted ? (
                <AlertTriangle size={14} className="text-[#E32636]" />
              ) : (
                <CheckCircle2 size={14} className="text-[#08745B]" />
              )}
            </div>
            <h4 className="font-extrabold text-sm line-clamp-1">{d.name}</h4>
            <span className={`inline-block text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
              selectedDosha === d.id
                ? 'bg-white/10 text-white'
                : d.isAfflicted
                ? 'bg-[#E32636]/10 text-[#E32636]'
                : 'bg-[#08745B]/10 text-[#08745B]'
            }`}>
              {d.status}
            </span>
          </button>
        ))}
      </div>

      {/* ═══ Selected Dosha Detail Panel ═══ */}
      <div className="card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DCCB]/60">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8294] block mb-1">
              Evaluated Condition
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#09132E]">
              {activeDoshaData.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              activeDoshaData.isAfflicted
                ? 'bg-[#E32636]/10 text-[#E32636] border-[#E32636]/30'
                : 'bg-[#08745B]/10 text-[#08745B] border-[#08745B]/30'
            }`}>
              {activeDoshaData.status}
            </span>
          </div>
        </div>

        {/* Fact Sheet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7A8294] block">Observed Placements</span>
            <p className="font-bold text-[#09132E]">{activeDoshaData.placements}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#7A8294] block">Classical Cancellation Factor</span>
            <p className="font-bold text-[#08745B]">{activeDoshaData.cancellationRule}</p>
          </div>
        </div>

        {/* Traditional Interpretation */}
        <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] space-y-2 text-xs leading-relaxed text-[#2D3748]">
          <h4 className="font-extrabold text-[#09132E] text-xs">Classical Jyotish Interpretation:</h4>
          <p>{activeDoshaData.interpretation}</p>
        </div>

        {/* Classical Shastra Citation */}
        <div className="p-4 rounded-2xl bg-[#FAF2E8] border border-[#E8DCCB] space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-[#08745B] font-bold">
            <BookOpen size={14} />
            <span>Classical Source Citation</span>
          </div>
          <blockquote className="italic text-[#4A5468] border-l-2 border-[#08745B] pl-3 py-0.5">
            "{activeDoshaData.classicalText}"
          </blockquote>
        </div>

        {/* Sattvic Upaya (Remedy) */}
        <div className="p-4 rounded-2xl bg-[#08745B]/10 border border-[#08745B]/20 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#08745B] uppercase text-[10px] tracking-wider">
              Recommended Sattvic Practice (Upaya)
            </span>
            <Link to="/remedies" className="text-[11px] font-bold text-[#08745B] hover:underline flex items-center gap-1">
              <span>View All Remedies</span>
              <ArrowRight size={12} />
            </Link>
          </div>
          <p className="text-[#09132E] font-medium leading-relaxed">
            {activeDoshaData.remedy}
          </p>
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
