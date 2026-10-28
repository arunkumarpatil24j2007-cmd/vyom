import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Edit3, Download, Save, Copy, ChevronDown, X, Info
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import { demoChart, demoProfiles } from '@/data/demo';
import type { GrahaName } from '@/types';

const PLANET_DETAILS: Record<GrahaName, { color: string; deity: string }> = {
  Sun: { color: '#E4C995', deity: 'Surya' },
  Moon: { color: '#C8D4E8', deity: 'Chandra' },
  Mars: { color: '#D46B6B', deity: 'Mangala' },
  Mercury: { color: '#76B89A', deity: 'Budha' },
  Jupiter: { color: '#E4C995', deity: 'Brihaspati' },
  Venus: { color: '#D4A5C8', deity: 'Shukra' },
  Saturn: { color: '#7779E8', deity: 'Shani' },
  Rahu: { color: '#737A8E', deity: 'Rahu' },
  Ketu: { color: '#D7AD65', deity: 'Ketu' },
};

export default function ChartDetailPage() {
  const [selectedPlanet, setSelectedPlanet] = useState<GrahaName | null>(null);
  const [chartLayout, setChartLayout] = useState<'north-indian' | 'south-indian'>('north-indian');
  const [showToast, setShowToast] = useState(false);

  const profile = demoProfiles[0];
  const chart = demoChart;
  const selected = chart.planets.find(p => p.planet === selectedPlanet);

  const handleCopy = () => {
    const text = chart.planets.map(p => `${p.planet}: ${p.sign} (House ${p.house}) ${p.degree.toFixed(1)}°`).join('\n');
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="badge badge-gold mb-2">Demo Chart</span>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {profile.name} — Birth Chart
          </h1>
          <p className="text-xs text-text-3 mt-1">
            {new Date(profile.birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • {profile.birthTime} • {profile.birthPlace}
          </p>
          <p className="text-xs text-text-3">Vedic / Sidereal • Lahiri • {chartLayout === 'north-indian' ? 'North Indian' : 'South Indian'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-sm"><Edit3 size={14} /> Edit</button>
          <button className="btn btn-ghost btn-sm"><Download size={14} /> Export</button>
          <button onClick={handleCopy} className="btn btn-ghost btn-sm"><Copy size={14} /> Copy</button>
          <button className="btn btn-secondary btn-sm"><Save size={14} /> Save</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ═══ Main Chart ═══ */}
        <div className="lg:col-span-2">
          <div className="card-glass p-6">
            {/* Chart Layout Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="tab-list">
                <button
                  className={`tab-item ${chartLayout === 'north-indian' ? 'active' : ''}`}
                  onClick={() => setChartLayout('north-indian')}
                >
                  North Indian
                </button>
                <button
                  className={`tab-item ${chartLayout === 'south-indian' ? 'active' : ''}`}
                  onClick={() => setChartLayout('south-indian')}
                >
                  South Indian
                </button>
              </div>
              {selectedPlanet && (
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="btn btn-ghost btn-sm text-text-3"
                >
                  Clear selection <X size={12} />
                </button>
              )}
            </div>

            {/* Chart */}
            <div className="flex justify-center py-4">
              <NorthIndianChart
                chart={chart}
                size={420}
                onPlanetClick={setSelectedPlanet}
                selectedPlanet={selectedPlanet}
              />
            </div>
          </div>

          {/* ═══ Planet Summary Table ═══ */}
          <div className="card-glass mt-6 overflow-hidden">
            <div className="p-4 border-b border-border-2">
              <h3 className="text-sm font-semibold">Planetary Positions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-text-3 border-b border-border-2">
                    <th className="text-left py-2.5 px-4 font-medium">Planet</th>
                    <th className="text-left py-2.5 px-4 font-medium">Sign</th>
                    <th className="text-left py-2.5 px-4 font-medium">House</th>
                    <th className="text-left py-2.5 px-4 font-medium">Degree</th>
                    <th className="text-left py-2.5 px-4 font-medium">Nakshatra</th>
                    <th className="text-left py-2.5 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.planets.map(p => (
                    <tr
                      key={p.planet}
                      className={`border-b border-border-2 cursor-pointer transition-colors ${
                        selectedPlanet === p.planet ? 'bg-[rgba(201,169,110,0.06)]' : 'hover:bg-[rgba(255,255,255,0.02)]'
                      }`}
                      onClick={() => setSelectedPlanet(p.planet)}
                    >
                      <td className="py-2.5 px-4 font-medium" style={{ color: PLANET_DETAILS[p.planet].color }}>
                        {p.planet}
                      </td>
                      <td className="py-2.5 px-4 text-text-2">{p.sign}</td>
                      <td className="py-2.5 px-4 text-text-2">{p.house}</td>
                      <td className="py-2.5 px-4 text-text-2">{p.degree.toFixed(2)}°</td>
                      <td className="py-2.5 px-4 text-text-2">{p.nakshatra || '—'}</td>
                      <td className="py-2.5 px-4">
                        {p.isRetrograde && <span className="badge badge-warning text-[10px]">℞ Retro</span>}
                        {p.isExalted && <span className="badge badge-success text-[10px]">Exalted</span>}
                        {p.isDebilitated && <span className="badge badge-error text-[10px]">Debilitated</span>}
                        {!p.isRetrograde && !p.isExalted && !p.isDebilitated && <span className="text-text-3">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ═══ Side Panel ═══ */}
        <div className="space-y-4">
          {/* Chart Summary */}
          <div className="card-glass p-5">
            <h3 className="text-xs font-semibold text-text-3 uppercase tracking-wider mb-3">Chart Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Lagna (Ascendant)', value: `${chart.ascendant.sign} ${chart.ascendant.degree.toFixed(1)}°`, sub: chart.ascendant.nakshatra ? `${chart.ascendant.nakshatra} Pada ${chart.ascendant.pada}` : undefined },
                { label: 'Moon Sign', value: typeof chart.moonSign === 'object' ? (chart.moonSign.rashiName || chart.moonSign.sign) : chart.moonSign },
                { label: 'Moon Nakshatra', value: chart.moonNakshatra || 'Not calculated' },
                { label: 'Sun Sign', value: chart.planets.find(p => p.planet === 'Sun')?.sign || 'N/A' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-border-2">
                  <p className="text-xs text-text-3 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gold-light">{value}</p>
                  {sub && <p className="text-xs text-text-3 mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Planet Detail Panel */}
          {selected && (
            <div className="card-glass p-5 animate-slide-in-right">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: PLANET_DETAILS[selected.planet].color }}>
                  {selected.planet}
                </h3>
                <button onClick={() => setSelectedPlanet(null)} className="text-text-3 hover:text-text">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-2.5">
                {[
                  { l: 'Vedic Name', v: PLANET_DETAILS[selected.planet].deity },
                  { l: 'Sign', v: selected.sign },
                  { l: 'House', v: `${selected.house}` },
                  { l: 'Degree', v: `${selected.degree.toFixed(2)}°` },
                  { l: 'Nakshatra', v: selected.nakshatra || 'Not calculated' },
                  { l: 'Pada', v: selected.pada ? `${selected.pada}` : 'Not calculated' },
                  { l: 'Retrograde', v: selected.isRetrograde ? 'Yes' : 'No' },
                  { l: 'Lordship', v: selected.lordOf?.length ? `Houses ${selected.lordOf.join(', ')}` : '—' },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between py-1 text-xs border-b border-border-2">
                    <span className="text-text-3">{l}</span>
                    <span className="text-text">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-border-2">
                <p className="text-xs text-text-3 flex items-start gap-1.5">
                  <Info size={12} className="flex-shrink-0 mt-0.5" />
                  Classical shastric interpretations and planetary insights can be consulted directly in Astrologer.
                </p>
              </div>

              <Link to="/astrologer" className="btn btn-gold-outline btn-sm w-full mt-3">
                Consult Astrologer about {selected.planet}
              </Link>
            </div>
          )}

          {/* Quick Links */}
          <div className="card-glass p-5">
            <h3 className="text-xs font-semibold text-text-3 uppercase tracking-wider mb-3">Explore</h3>
            <div className="space-y-1.5">
              <Link to="/astrologer" className="block text-sm text-text-2 hover:text-gold transition-colors py-1">
                → Ask about this chart
              </Link>
              <Link to="/app/predictions" className="block text-sm text-text-2 hover:text-gold transition-colors py-1">
                → View Dasha periods
              </Link>
              <Link to="/app/compatibility" className="block text-sm text-text-2 hover:text-gold transition-colors py-1">
                → Compare with another chart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast-container">
          <div className="glass-gold px-4 py-2.5 rounded-full text-sm text-gold-light animate-fade-in">
            Chart data copied to clipboard
          </div>
        </div>
      )}
    </div>
  );
}
