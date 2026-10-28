import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle,
  User, ArrowRight, Star, BookOpen, Compass
} from 'lucide-react';
import { getActiveProfile, subscribeToGuestStore, type UserBirthDetails } from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import { calculateAshtakoota, type CompatibilityResult } from '@/lib/astrology/calculations/ashtakoota';
import AshtakootaRadar from '@/components/visual/AshtakootaRadar';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import type { ChartData } from '@/types';

export default function CompatibilityPage() {
  const [profile1, setProfile1] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [partnerName, setPartnerName] = useState('Partner');
  const [partnerDate, setPartnerDate] = useState('1995-08-22');
  const [partnerTime, setPartnerTime] = useState('14:15');
  const [partnerPlace, setPartnerPlace] = useState('Mumbai, India');
  const [partnerLat, setPartnerLat] = useState(19.076);
  const [partnerLng, setPartnerLng] = useState(72.8777);

  const [chart1, setChart1] = useState<ChartData | null>(null);
  const [chart2, setChart2] = useState<ChartData | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [birthModalOpen, setBirthModalOpen] = useState(false);

  useEffect(() => {
    function calculateMilan() {
      const p1 = getActiveProfile();
      setProfile1(p1);

      if (!p1) {
        setChart1(null);
        setChart2(null);
        setCompatibility(null);
        return;
      }

      try {
        const c1 = calculateNatalChart({
          name: p1.name,
          birthDate: p1.birthDate,
          birthTime: p1.birthTime,
          birthPlace: p1.birthPlace,
          latitude: p1.latitude,
          longitude: p1.longitude,
          timezone: p1.timezone,
        });

        const c2 = calculateNatalChart({
          name: partnerName || 'Partner',
          birthDate: partnerDate,
          birthTime: partnerTime,
          birthPlace: partnerPlace,
          latitude: partnerLat,
          longitude: partnerLng,
          timezone: 'Asia/Kolkata',
        });

        setChart1(c1);
        setChart2(c2);

        // Get Moon Nirayana longitudes from both charts
        const moon1 = c1.planets.find((p) => p.planet === 'Moon');
        const moon2 = c2.planets.find((p) => p.planet === 'Moon');
        const mars1 = c1.planets.find((p) => p.planet === 'Mars');
        const mars2 = c2.planets.find((p) => p.planet === 'Mars');

        const moonLong1 = (moon1?.signIndex ? (moon1.signIndex - 1) * 30 : 0) + (moon1?.degrees || 0);
        const moonLong2 = (moon2?.signIndex ? (moon2.signIndex - 1) * 30 : 0) + (moon2?.degrees || 0);

        const result = calculateAshtakoota(
          moonLong1,
          moonLong2,
          mars1?.house || 1,
          mars2?.house || 1
        );
        setCompatibility(result);
      } catch (e) {
        console.error('Error calculating Milan compatibility:', e);
      }
    }

    calculateMilan();
    const unsubscribe = subscribeToGuestStore(calculateMilan);
    return unsubscribe;
  }, [partnerName, partnerDate, partnerTime, partnerPlace, partnerLat, partnerLng]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E32636] mb-1">
            <Heart size={14} />
            <span>Kundli Milan • Ashtakoota Synastry</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Relationship Compatibility
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            Mathematical 36 Guna evaluation, Kuja (Manglik) Dosha verification, and mental-karmic harmony.
          </p>
        </div>

        <Link
          to="/astrologer?q=Explain%20the%20compatibility%20dynamics%20and%20any%20doshas%20between%20our%20two%20charts"
          className="btn-pill-orange text-xs !py-2.5 !px-4"
        >
          <Sparkles size={14} />
          <span>Consult on Compatibility</span>
        </Link>
      </div>

      {/* ═══ Dual Partner Inputs ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Person 1 Card */}
        <div className="card-cream p-5 rounded-[28px] border border-[#E8DCCB] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#FF4B19] tracking-wider">
              Primary Chart (You)
            </span>
            <button
              onClick={() => setBirthModalOpen(true)}
              className="text-[11px] font-bold text-[#FF4B19] hover:underline cursor-pointer"
            >
              {profile1 ? 'Edit Details' : 'Set Your Details'}
            </button>
          </div>

          {profile1 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center font-extrabold text-sm">
                  {profile1.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#09132E]">{profile1.name}</h3>
                  <p className="text-xs text-[#7A8294]">
                    {profile1.birthDate} • {profile1.birthTime} • {profile1.birthPlace}
                  </p>
                </div>
              </div>

              {chart1 && (
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-[#E8DCCB]/60">
                  <div className="p-2 rounded-xl bg-[#FEF6EB]">
                    <span className="text-[#7A8294] block text-[10px]">Moon Sign</span>
                    <span className="font-bold text-[#09132E]">
                      {typeof chart1.moonSign === 'object' ? (chart1.moonSign.rashiName || chart1.moonSign.sign) : chart1.moonSign}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FEF6EB]">
                    <span className="text-[#7A8294] block text-[10px]">Nakshatra</span>
                    <span className="font-bold text-[#FF4B19]">
                      {typeof chart1.moonSign === 'object' ? `${chart1.moonSign.nakshatra} (P${chart1.moonSign.pada})` : chart1.moonNakshatra}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/60 border border-[#E8DCCB] text-center space-y-2">
              <p className="text-xs text-[#4A5468]">Enter your birth details to generate your natal Moon sign and coordinates.</p>
              <button
                onClick={() => setBirthModalOpen(true)}
                className="btn-pill-orange text-xs !py-2 !px-4 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Compass size={14} />
                <span>Enter Your Birth Details</span>
              </button>
            </div>
          )}
        </div>

        {/* Person 2 Card */}
        <div className="card-cream p-5 rounded-[28px] border border-[#E8DCCB] space-y-3">
          <span className="text-[10px] uppercase font-bold text-[#E32636] tracking-wider block">
            Partner Chart Details
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-[#7A8294] block mb-1">Partner Name</label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Partner name"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E8DCCB] text-xs font-semibold text-[#09132E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7A8294] block mb-1">Date of Birth</label>
              <input
                type="date"
                value={partnerDate}
                onChange={(e) => setPartnerDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E8DCCB] text-xs font-semibold text-[#09132E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7A8294] block mb-1">Time of Birth</label>
              <input
                type="time"
                value={partnerTime}
                onChange={(e) => setPartnerTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E8DCCB] text-xs font-semibold text-[#09132E]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#7A8294] block mb-1">City of Birth</label>
              <input
                type="text"
                value={partnerPlace}
                onChange={(e) => setPartnerPlace(e.target.value)}
                placeholder="City, Country"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E8DCCB] text-xs font-semibold text-[#09132E]"
              />
            </div>
          </div>

          {chart2 && profile1 && (
            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-2 border-t border-[#E8DCCB]/60">
              <div className="p-2 rounded-xl bg-[#FEF6EB]">
                <span className="text-[#7A8294] block text-[10px]">Moon Sign (Rashi)</span>
                <span className="font-bold text-[#09132E]">
                  {typeof chart2.moonSign === 'object' ? (chart2.moonSign.rashiName || chart2.moonSign.sign) : chart2.moonSign}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#FEF6EB]">
                <span className="text-[#7A8294] block text-[10px]">Nakshatra</span>
                <span className="font-bold text-[#E32636]">
                  {typeof chart2.moonSign === 'object' ? `${chart2.moonSign.nakshatra} (P${chart2.moonSign.pada})` : chart2.moonNakshatra}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Master Ashtakoota Score Synthesis (Only when profile1 is available) ═══ */}
      {compatibility ? (
        <AshtakootaRadar compatibility={compatibility} />
      ) : (
        <div className="card-cream p-8 md:p-12 rounded-[32px] border border-[#E8DCCB] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#E32636]/10 text-[#E32636] flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <h3 className="text-xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Enter Both Birth Details to Calculate Milan
          </h3>
          <p className="text-xs md:text-sm text-[#4A5468] max-w-md mx-auto leading-relaxed">
            Vyom calculates authentic Sidereal Moon coordinates and classical 36 Guna factors. No fabricated scores or sample alignments are shown prior to real input.
          </p>
          <div>
            <button
              onClick={() => setBirthModalOpen(true)}
              className="btn-pill-orange text-xs !py-3 !px-6 cursor-pointer"
            >
              Set Your Birth Details First
            </button>
          </div>
        </div>
      )}

      {/* Birth Profile Modal */}
      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={(updated) => setProfile1(updated)}
      />
    </div>
  );
}
