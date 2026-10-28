import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Compass, MessageSquareText,
  Calendar, Sun, Moon, ShieldCheck, ChevronRight,
  TrendingUp, Award, Clock, AlertTriangle, Layers, ShieldAlert
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import DashaTimelineVisualizer from '@/components/visual/DashaTimelineVisualizer';
import {
  getActiveProfile,
  subscribeToGuestStore,
  getSavedReports,
  type UserBirthDetails,
} from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import { calculatePanchang } from '@/lib/astrology/calculations/panchangCalculator';
import { evaluateSadeSati, evaluateMangalDosha } from '@/lib/astrology/rules/evaluateDosha';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import type { ChartData, SavedReport } from '@/types';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [chart, setChart] = useState<ChartData | null>(null);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [birthModalOpen, setBirthModalOpen] = useState(false);

  useEffect(() => {
    function loadData() {
      const current = getActiveProfile();
      setProfile(current);
      setReports(getSavedReports());

      if (current) {
        try {
          const calculated = calculateNatalChart({
            name: current.name,
            birthDate: current.birthDate,
            birthTime: current.birthTimePrecision === 'unknown' ? '' : current.birthTime,
            birthTimePrecision: current.birthTimePrecision,
            birthPlace: current.birthPlace,
            latitude: current.latitude,
            longitude: current.longitude,
            timezone: current.timezone,
          });
          setChart(calculated);
        } catch (e) {
          console.error('Error calculating dashboard chart:', e);
        }
      } else {
        setChart(null);
      }
    }

    loadData();
    const unsubscribe = subscribeToGuestStore(loadData);
    return unsubscribe;
  }, []);

  // Calculate real-time today's Panchang for user location (or New Delhi default)
  const panchang = calculatePanchang({
    date: new Date(),
    latitude: profile?.latitude ?? 28.6139,
    longitude: profile?.longitude ?? 77.209,
    timezoneOffsetHours: 5.5,
  });

  // Calculate Dosha status if chart is present
  const sadeSati = chart ? evaluateSadeSati(chart) : null;
  const mangalDosha = chart ? evaluateMangalDosha(chart) : null;
  // The Mahadasha running today (dashas[0] is the period at birth, not the current one)
  const currentMd = chart?.activeDasha;
  const activeDasha = currentMd
    ? chart?.dashas?.find((d) => d.planet === currentMd.mahadasha && String(d.startYear) === currentMd.mahadashaStart.slice(0, 4))
      ?? { planet: currentMd.mahadasha, startYear: Number(currentMd.mahadashaStart.slice(0, 4)), endYear: Number(currentMd.mahadashaEnd.slice(0, 4)) }
    : chart?.dashas?.[0];

  const ascendantRashi = chart?.ascendant ? (chart.ascendant.rashiName || chart.ascendant.sign) : 'Leo';
  const ascendantDeg = chart?.ascendant?.degreesFormatted || `${Math.floor(chart?.ascendant?.degree || 0)}°`;
  const moonRashi = typeof chart?.moonSign === 'object' ? (chart.moonSign.rashiName || chart.moonSign.sign) : chart?.moonSign || 'Moon';
  const moonNak = typeof chart?.moonSign === 'object' ? (chart.moonSign.nakshatra || 'Revati') : chart?.moonNakshatra || 'Revati';
  const moonPada = typeof chart?.moonSign === 'object' ? (chart.moonSign.pada || 1) : 1;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* ═══ Top Greeting & Snapshot ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Sparkles size={14} />
            <span>Personal Cosmic Workspace</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {getGreeting()}{profile ? `, ${profile.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            {profile
              ? `Real-time astronomical ephemeris calculated for ${profile.birthPlace}.`
              : 'Enter your birth details to generate your verified Sidereal Kundli and guidance.'}
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-cream text-xs !py-2.5 !px-4 cursor-pointer"
          >
            <Compass size={14} className="text-[#FF4B19]" />
            <span>{profile ? 'Edit Birth Details' : 'Enter Birth Details'}</span>
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

      {/* ═══ If Visitor Has No Profile: Welcoming Onboarding State ═══ */}
      {!profile && (
        <div className="card-cream p-6 md:p-10 border border-[#E8DCCB] shadow-sm relative overflow-hidden text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FF4B19]/10 text-[#FF4B19] flex items-center justify-center mx-auto mb-2">
            <Compass size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Chart Begins With Your Birth Details
          </h2>
          <p className="text-xs md:text-sm text-[#4A5468] max-w-lg mx-auto leading-relaxed">
            Vyom does not use random charts or fictional demonstration profiles. Enter your exact birth date, time, and city to unlock your true Nirayana Lagna, 27 Nakshatras, and 120-year Vimshottari timeline.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setBirthModalOpen(true)}
              className="btn-pill-orange text-xs md:text-sm !py-3 !px-8 cursor-pointer shadow-md hover:shadow-lg"
            >
              <Sparkles size={16} />
              <span>Set Up My Cosmic Profile</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#E8DCCB]/60 text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E8DCCB]">
              <span className="font-bold text-[#FF4B19] block mb-1">Sidereal Precision</span>
              <span className="text-[11px] text-[#7A8294]">True astronomical calculations via Lahiri Ayanamsha.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E8DCCB]">
              <span className="font-bold text-[#09132E] block mb-1">Classical Shastras</span>
              <span className="text-[11px] text-[#7A8294]">Grounded in BPHS, Phaladeepika, and Saravali.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E8DCCB]">
              <span className="font-bold text-[#08745B] block mb-1">Guest-First Privacy</span>
              <span className="text-[11px] text-[#7A8294]">Data stays strictly on your browser session. Clear anytime.</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ If Profile Exists: Active Personal Workspace ═══ */}
      {profile && chart && (
        <>
          {/* Primary Daily Guidance Section */}
          <div className="card-cream p-6 md:p-8 relative overflow-hidden border border-[#E8DCCB] shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FF4B19]/10 text-[#FF4B19] border border-[#FF4B19]/20">
                  <Sun size={13} className="fill-[#FF4B19]" />
                  <span>
                    Cosmic Influences • {activeDasha?.planet || 'Ketu'} Mahadasha Active
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-[#09132E]">
                  {ascendantRashi} Ascendant with {moonRashi} Moon ({moonNak} Nakshatra)
                </h2>

                <p className="text-xs md:text-sm text-[#4A5468] leading-relaxed">
                  Your true sidereal Lagna is anchored at {ascendantDeg} {ascendantRashi}.
                  The current lunar transit through {panchang.nakshatra.name} nakshatra stimulates your natural intuition and strategic focus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] uppercase font-bold text-[#FF4B19] block mb-0.5">Primary Focus</span>
                    <span className="font-bold text-[#09132E]">Knowledge & Dharma</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] uppercase font-bold text-[#08745B] block mb-0.5">Favorable Period</span>
                    <span className="font-bold text-[#09132E]">Deep Strategic Planning</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] uppercase font-bold text-[#E32636] block mb-0.5">Karmic Caution</span>
                    <span className="font-bold text-[#09132E]">Avoid Impulsive Words</span>
                  </div>
                </div>
              </div>

              {/* Verified Chart Factors Pill */}
              <div className="w-full lg:w-72 bg-[#FEF6EB] p-5 rounded-[24px] border border-[#E8DCCB] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8294]">
                  Calculated Graha Positions
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-[#E8DCCB]/60">
                    <span className="text-[#7A8294]">Lagna</span>
                    <span className="font-bold text-[#09132E]">{ascendantRashi} ({ascendantDeg})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#E8DCCB]/60">
                    <span className="text-[#7A8294]">Chandra</span>
                    <span className="font-bold text-[#FF4B19]">{moonRashi} ({moonNak})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#E8DCCB]/60">
                    <span className="text-[#7A8294]">Active Dasha</span>
                    <span className="font-bold text-[#09132E]">{activeDasha?.planet || 'Ketu'} ({activeDasha?.startYear}–{activeDasha?.endYear})</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#7A8294]">Sade Sati</span>
                    <span className={`font-bold ${sadeSati?.isActive ? 'text-[#E32636]' : 'text-[#08745B]'}`}>
                      {sadeSati?.isActive ? `${sadeSati.phase} Phase` : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Planetary Timeline (Vimshottari Dasha Progression) ═══ */}
          <DashaTimelineVisualizer dashas={chart.dashas} />

          {/* ═══ Main Two-Column Grid: Kundli Chart Preview & Compact Panchang ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Birth Chart Interactive Preview */}
            <div className="lg:col-span-7 card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#09132E]">D1 Rashi Chart (Lagna Kundli)</h3>
                  <p className="text-xs text-[#7A8294]">North Indian Diamond Format • Lahiri Sidereal</p>
                </div>
                <Link
                  to="/kundli"
                  className="text-xs font-bold text-[#FF4B19] hover:underline flex items-center gap-1"
                >
                  <span>Full View</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="flex justify-center p-2 bg-[#FFF8EF] rounded-2xl border border-[#E8DCCB]/60">
                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square">
                  <NorthIndianChart chart={chart} size={320} className="w-full h-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-[#FEF6EB] border border-[#E8DCCB]/70">
                  <span className="text-[10px] text-[#7A8294] block">Lagna Lord</span>
                  <span className="font-bold text-[#09132E]">{chart.planets[0]?.planet || 'Sun'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FEF6EB] border border-[#E8DCCB]/70">
                  <span className="text-[10px] text-[#7A8294] block">Moon Pada</span>
                  <span className="font-bold text-[#09132E]">Pada {moonPada}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FEF6EB] border border-[#E8DCCB]/70">
                  <span className="text-[10px] text-[#7A8294] block">Mangal Dosha</span>
                  <span className={`font-bold ${mangalDosha?.hasDosha && !mangalDosha.isCancelled ? 'text-[#E32636]' : 'text-[#08745B]'}`}>
                    {mangalDosha?.hasDosha ? (mangalDosha.isCancelled ? 'Cancelled' : 'Present') : 'None'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FEF6EB] border border-[#E8DCCB]/70">
                  <span className="text-[10px] text-[#7A8294] block">Ayanamsha</span>
                  <span className="font-bold text-[#09132E]">Lahiri (23°51')</span>
                </div>
              </div>
            </div>

            {/* Right: Real Astronomical Panchang & Feature Shortcuts */}
            <div className="lg:col-span-5 space-y-6">
              {/* Panchang Widget */}
              <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#09132E]">Today’s Panchang</h3>
                    <p className="text-xs text-[#7A8294]">
                      {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    to="/panchang"
                    className="text-xs font-bold text-[#FF4B19] hover:underline flex items-center gap-1"
                  >
                    <span>Full Ephemeris</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] text-[#7A8294] block">Tithi ({panchang.paksha})</span>
                    <span className="font-bold text-[#09132E]">{panchang.tithi.name}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] text-[#7A8294] block">Nakshatra</span>
                    <span className="font-bold text-[#FF4B19]">{panchang.nakshatra.name}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] text-[#7A8294] block">Yoga</span>
                    <span className="font-bold text-[#09132E]">{panchang.yoga.name}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                    <span className="text-[10px] text-[#7A8294] block">Karana</span>
                    <span className="font-bold text-[#09132E]">{panchang.karana.name}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] flex justify-between items-center text-xs">
                  <span className="text-[#7A8294]">Rahu Kaal (Avoid auspicious starts):</span>
                  <span className="font-bold text-[#E32636]">{panchang.rahuKaal.start} – {panchang.rahuKaal.end}</span>
                </div>
              </div>

              {/* Fast Feature Shortcuts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <Link
                  to="/kundli"
                  className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <Compass size={18} className="text-[#FF4B19] mb-1.5" />
                  <div>
                    <h4 className="font-bold text-[#09132E] group-hover:text-[#FF4B19] transition-colors">Kundli</h4>
                    <p className="text-[10px] text-[#7A8294] mt-0.5">D1, D9, D10 Charts</p>
                  </div>
                </Link>

                <Link
                  to="/predictions"
                  className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <TrendingUp size={18} className="text-[#F7A928] mb-1.5" />
                  <div>
                    <h4 className="font-bold text-[#09132E] group-hover:text-[#FF4B19] transition-colors">Predictions</h4>
                    <p className="text-[10px] text-[#7A8294] mt-0.5">Transits & Forecasts</p>
                  </div>
                </Link>

                <Link
                  to="/compatibility"
                  className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <Award size={18} className="text-[#08745B] mb-1.5" />
                  <div>
                    <h4 className="font-bold text-[#09132E] group-hover:text-[#FF4B19] transition-colors">Compatibility</h4>
                    <p className="text-[10px] text-[#7A8294] mt-0.5">36 Guna Milan</p>
                  </div>
                </Link>

                <Link
                  to="/dosha"
                  className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <ShieldAlert size={18} className="text-[#E32636] mb-1.5" />
                  <div>
                    <h4 className="font-bold text-[#09132E] group-hover:text-[#FF4B19] transition-colors">Dosha</h4>
                    <p className="text-[10px] text-[#7A8294] mt-0.5">Mangal & Sade Sati</p>
                  </div>
                </Link>

                <Link
                  to="/remedies"
                  className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] hover:shadow-md transition-all group flex flex-col justify-between col-span-2 sm:col-span-2"
                >
                  <ShieldCheck size={18} className="text-[#2563EB] mb-1.5" />
                  <div>
                    <h4 className="font-bold text-[#09132E] group-hover:text-[#FF4B19] transition-colors">Remedies</h4>
                    <p className="text-[10px] text-[#7A8294] mt-0.5">Sattvic Upayas, Mantras & Yantras</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Reports Section (Only if user has actual reports) */}
          {reports.length > 0 && (
            <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#09132E]">Your Saved Consultations</h3>
                  <p className="text-xs text-[#7A8294]">Session-bound reports and astrological interpretations</p>
                </div>
                <Link to="/reports" className="text-xs font-bold text-[#FF4B19] hover:underline flex items-center gap-1">
                  <span>View All ({reports.length})</span>
                  <ChevronRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-[#FF4B19]">{rep.category}</span>
                    <h4 className="font-bold text-[#09132E] line-clamp-1">{rep.title}</h4>
                    <p className="text-xs text-[#7A8294] line-clamp-2">{rep.summary}</p>
                    <span className="text-[10px] text-[#B0B8C7] block pt-1">{rep.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Birth Profile Entry Modal */}
      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </div>
  );
}
