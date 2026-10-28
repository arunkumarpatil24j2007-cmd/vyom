import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Sparkles, Layers, Info,
  ChevronRight, Sun, Moon, Calendar, AlertCircle
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import SouthIndianChart from '@/components/charts/SouthIndianChart';
import { getActiveProfile, subscribeToGuestStore, type UserBirthDetails } from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import BirthDetailsModal from '@/components/vyom/BirthDetailsModal';
import type { ChartData, GrahaName } from '@/types';

export default function KundliPage() {
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [chart, setChart] = useState<ChartData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<GrahaName | null>('Sun');
  const [chartType, setChartType] = useState<'D1' | 'D9'>('D1');
  const [chartFormat, setChartFormat] = useState<'north' | 'south'>('north');
  const [birthModalOpen, setBirthModalOpen] = useState(false);

  useEffect(() => {
    function loadChart() {
      const current = getActiveProfile();
      setProfile(current);
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
          console.error('Error calculating Kundli chart:', e);
        }
      } else {
        setChart(null);
      }
    }

    loadChart();
    const unsubscribe = subscribeToGuestStore(loadChart);
    return unsubscribe;
  }, []);

  const activePlanetData = chart?.planets.find((p) => p.planet === selectedPlanet) || chart?.planets[0];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12">
      {/* ═══ Top Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Compass size={14} />
            <span>Vedic Sidereal Calculations</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Birth Chart (Kundli)
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            {profile
              ? `${profile.name} • ${profile.birthDate} at ${profile.birthTime} • ${profile.birthPlace} (Lahiri Ayanamsha)`
              : 'Precision Sidereal calculations based on true astronomical ephemeris.'}
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

      {/* ═══ If No Profile: Guest Empty State ═══ */}
      {!profile && (
        <div className="card-cream p-8 md:p-12 border border-[#E8DCCB] text-center space-y-4 max-w-2xl mx-auto rounded-[32px]">
          <div className="w-16 h-16 rounded-full bg-[#FF4B19]/10 text-[#FF4B19] flex items-center justify-center mx-auto">
            <Compass size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#09132E]">
            No Birth Chart Available Yet
          </h2>
          <p className="text-xs md:text-sm text-[#4A5468] leading-relaxed max-w-md mx-auto">
            To view a real, mathematically verified North Indian Kundli with true Ascendant degree and planetary longitudes, provide your birth details.
          </p>
          <button
            onClick={() => setBirthModalOpen(true)}
            className="btn-pill-orange text-xs md:text-sm !py-3 !px-7 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>Compute My Kundli</span>
          </button>
        </div>
      )}

      {/* ═══ If Profile & Chart Available ═══ */}
      {profile && chart && (
        <>
          {/* Chart Controls Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-full bg-[#FAF2E8] border border-[#E8DCCB]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#7A8294] pl-3 pr-1">Division:</span>
              {(['D1', 'D9'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    chartType === t
                      ? 'bg-[#FF4B19] text-white shadow-xs'
                      : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
                  }`}
                >
                  {t === 'D1' ? 'D1 Rashi' : 'D9 Navamsa'}
                </button>
              ))}
            </div>

            {/* Chart Style Toggle: North vs South Indian */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#7A8294] pr-1">Format:</span>
              <button
                onClick={() => setChartFormat('north')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  chartFormat === 'north'
                    ? 'bg-[#09132E] text-white shadow-xs'
                    : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
                }`}
              >
                North (Diamond)
              </button>
              <button
                onClick={() => setChartFormat('south')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  chartFormat === 'south'
                    ? 'bg-[#09132E] text-white shadow-xs'
                    : 'text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4]'
                }`}
              >
                South (Square)
              </button>
            </div>

            <div className="flex items-center gap-2 pr-3 text-xs text-[#7A8294] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#08745B]" />
              <span>Lahiri: 23°51'25"</span>
            </div>
          </div>

          {/* ═══ Main Visualization Grid ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Chart Canvas */}
            <div className="lg:col-span-7 card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#09132E]">
                    {chartType === 'D1' ? 'D1 Rashi Kundli' : 'D9 Navamsa Chart'}
                    <span className="text-xs text-[#7A8294] font-normal ml-2">
                      ({chartFormat === 'north' ? 'North Indian Diamond' : 'South Indian Fixed Signs'})
                    </span>
                  </h3>
                  <p className="text-xs text-[#7A8294]">
                    Lagna: {chart.ascendant.rashiName || chart.ascendant.sign} ({chart.ascendant.degreesFormatted || `${Math.floor(chart.ascendant.degree)}°`}) • {chart.ascendant.nakshatra} (Pada {chart.ascendant.pada})
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B19] bg-[#FF4B19]/10 px-3 py-1 rounded-full border border-[#FF4B19]/20">
                  Interactive
                </span>
              </div>

              <div className="flex justify-center p-3 bg-[#FFF8EF] rounded-2xl border border-[#E8DCCB]/60">
                <div className="w-full max-w-[340px] sm:max-w-[400px] aspect-square">
                  {chartFormat === 'north' ? (
                    <NorthIndianChart
                      chart={chart}
                      size={400}
                      selectedPlanet={selectedPlanet}
                      onPlanetClick={(p) => setSelectedPlanet(p)}
                      interactive={true}
                      className="w-full h-full"
                    />
                  ) : (
                    <SouthIndianChart
                      chart={chart}
                      size={400}
                      selectedPlanet={selectedPlanet}
                      onPlanetClick={(p) => setSelectedPlanet(p)}
                      interactive={true}
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#7A8294] pt-1">
                <span>Click any planet inside chart or list to inspect planetary dignity</span>
                <span className="font-bold text-[#09132E]">12 Bhavas Calculated</span>
              </div>
            </div>

            {/* Right: Selected Graha Details & Astrological Strengths */}
            <div className="lg:col-span-5 space-y-4">
              {activePlanetData && (
                <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center font-extrabold text-sm">
                        {activePlanetData.planet.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-[#09132E]">
                          {activePlanetData.planet} (Graha)
                        </h4>
                        <span className="text-xs text-[#7A8294]">
                          Bhava {activePlanetData.house} • {activePlanetData.sign}
                        </span>
                      </div>
                    </div>
                    {activePlanetData.retrograde && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E32636]/10 text-[#E32636] border border-[#E32636]/20">
                        Vakri (Retrograde)
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                      <span className="text-[10px] text-[#7A8294] block">Ecliptic Longitude</span>
                      <span className="font-bold text-[#09132E]">{activePlanetData.degreesFormatted}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                      <span className="text-[10px] text-[#7A8294] block">Nakshatra</span>
                      <span className="font-bold text-[#FF4B19]">{activePlanetData.nakshatra} (P{activePlanetData.pada})</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                      <span className="text-[10px] text-[#7A8294] block">Dignity</span>
                      <span className="font-bold text-[#08745B]">{activePlanetData.dignity}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB]">
                      <span className="text-[10px] text-[#7A8294] block">House Type</span>
                      <span className="font-bold text-[#09132E]">
                        {[1, 4, 7, 10].includes(activePlanetData.house)
                          ? 'Kendra (Pillar)'
                          : [1, 5, 9].includes(activePlanetData.house)
                          ? 'Trikona (Dharma)'
                          : [6, 8, 12].includes(activePlanetData.house)
                          ? 'Dusthana (Karmic)'
                          : 'Upachaya (Growth)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A5468] leading-relaxed p-3 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB]">
                    In classical Jyotish, {activePlanetData.planet} governing the {activePlanetData.house}th house in {activePlanetData.sign} directs karmic focus toward its natural karakatvas.
                  </p>
                </div>
              )}

              {/* Vimshottari Mahadasha Timeline */}
              <div className="card-cream p-5 rounded-[28px] border border-[#E8DCCB] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#09132E]">
                    Vimshottari Dasha Periods
                  </h4>
                  <span className="text-[10px] text-[#7A8294]">120-Year Vedic Cycle</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(chart.dashas || []).map((d, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8DCCB]/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#09132E]">{d.planet} Mahadasha</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FF4B19]/15 text-[#FF4B19]">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#7A8294]">
                        {d.startYear} – {d.endYear}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══ Complete 9 Grahas Table ═══ */}
          <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
            <h3 className="text-base font-extrabold text-[#09132E]">Nirayana Graha Sphutas (Planetary Positions)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF2E8] text-[#7A8294] font-semibold border-b border-[#E8DCCB]">
                  <tr>
                    <th className="px-3 py-2.5">Graha</th>
                    <th className="px-3 py-2.5">Rashi (Sign)</th>
                    <th className="px-3 py-2.5">Degree</th>
                    <th className="px-3 py-2.5">Bhava (House)</th>
                    <th className="px-3 py-2.5">Nakshatra</th>
                    <th className="px-3 py-2.5">Pada</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCCB]/60">
                  {chart.planets.map((p) => (
                    <tr
                      key={p.planet}
                      onClick={() => setSelectedPlanet(p.planet)}
                      className={`hover:bg-[#FFF8EF] transition-colors cursor-pointer ${
                        selectedPlanet === p.planet ? 'bg-[#FF4B19]/5 font-semibold' : ''
                      }`}
                    >
                      <td className="px-3 py-2.5 font-bold text-[#09132E]">{p.planet}</td>
                      <td className="px-3 py-2.5 text-[#4A5468]">{p.sign}</td>
                      <td className="px-3 py-2.5 text-[#09132E]">{p.degreesFormatted}</td>
                      <td className="px-3 py-2.5 font-bold text-[#FF4B19]">H{p.house}</td>
                      <td className="px-3 py-2.5 text-[#4A5468]">{p.nakshatra}</td>
                      <td className="px-3 py-2.5 text-[#4A5468]">{p.pada}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE3D4] text-[#09132E]">
                          {p.dignity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Birth Profile Modal */}
      <BirthDetailsModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </div>
  );
}
