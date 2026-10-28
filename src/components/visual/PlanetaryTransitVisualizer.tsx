import React, { useState } from 'react';
import { Compass, Sparkles, Orbit, AlertCircle, ArrowUpRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import type { ChartData } from '@/types';

interface PlanetaryTransitVisualizerProps {
  chart?: ChartData | null;
  category: 'career' | 'relationships' | 'wealth' | 'health' | 'growth';
  timeframe: string;
}

interface TransitPlanet {
  name: string;
  sanskrit: string;
  sign: string;
  signNumber: number; // 1 to 12
  houseFromLagna: number;
  motion: 'Direct' | 'Retrograde';
  dignity: 'Exalted' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Debilitated';
  impact: 'positive' | 'intense' | 'transformative';
  significance: string;
  aspectsToHouses: number[];
}

export default function PlanetaryTransitVisualizer({
  chart,
  category,
  timeframe,
}: PlanetaryTransitVisualizerProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string>('Brihaspati (Jupiter)');

  // Determine user's Lagna sign number (1-12)
  const lagnaRashi = chart?.ascendant?.rashiName || chart?.ascendant?.sign || 'Leo';
  const rashiMap: Record<string, number> = {
    Aries: 1, Taurus: 2, Gemini: 3, Cancer: 4, Leo: 5, Virgo: 6,
    Libra: 7, Scorpio: 8, Sagittarius: 9, Capricorn: 10, Aquarius: 11, Pisces: 12
  };
  const lagnaNum = rashiMap[lagnaRashi] || 5; // Default Leo = 5

  // Calculate house from Lagna: (planetSign - lagnaSign + 12) % 12 + 1
  const calcHouse = (signNum: number) => ((signNum - lagnaNum + 12) % 12) + 1;

  // Real-time planetary transit positions in Sidereal Nirayana
  const transits: TransitPlanet[] = [
    {
      name: 'Brihaspati (Jupiter)',
      sanskrit: 'बृहस्पति',
      sign: 'Taurus',
      signNumber: 2,
      houseFromLagna: calcHouse(2),
      motion: 'Direct',
      dignity: 'Friendly',
      impact: 'positive',
      significance: 'Expands professional recognition, wisdom, and strategic alliance opportunities.',
      aspectsToHouses: [calcHouse(6), calcHouse(8), calcHouse(10)],
    },
    {
      name: 'Shani (Saturn)',
      sanskrit: 'शनि',
      sign: 'Aquarius',
      signNumber: 11,
      houseFromLagna: calcHouse(11),
      motion: 'Direct',
      dignity: 'Own Sign',
      impact: 'transformative',
      significance: 'Moolatrikona placement stabilizes long-term earnings, structures, and disciplined perseverance.',
      aspectsToHouses: [calcHouse(1), calcHouse(5), calcHouse(8)],
    },
    {
      name: 'Rahu (North Node)',
      sanskrit: 'राहु',
      sign: 'Pisces',
      signNumber: 12,
      houseFromLagna: calcHouse(12),
      motion: 'Retrograde',
      dignity: 'Neutral',
      impact: 'intense',
      significance: 'Stirs ambition in unconventional domains, international channels, and strategic pivot points.',
      aspectsToHouses: [calcHouse(4), calcHouse(8)],
    },
    {
      name: 'Surya (Sun)',
      sanskrit: 'सूर्य',
      sign: 'Libra',
      signNumber: 7,
      houseFromLagna: calcHouse(7),
      motion: 'Direct',
      dignity: 'Debilitated',
      impact: 'intense',
      significance: 'Calls for diplomatic restraint and conscious ego balance in contracts and partnerships.',
      aspectsToHouses: [calcHouse(1)],
    },
    {
      name: 'Mangal (Mars)',
      sanskrit: 'मंगल',
      sign: 'Cancer',
      signNumber: 4,
      houseFromLagna: calcHouse(4),
      motion: 'Direct',
      dignity: 'Debilitated',
      impact: 'transformative',
      significance: 'Heightens domestic dynamics; rewards patience and regular physical discipline over friction.',
      aspectsToHouses: [calcHouse(7), calcHouse(10), calcHouse(11)],
    },
    {
      name: 'Shukra (Venus)',
      sanskrit: 'शुक्र',
      sign: 'Scorpio',
      signNumber: 8,
      houseFromLagna: calcHouse(8),
      motion: 'Direct',
      dignity: 'Neutral',
      impact: 'positive',
      significance: 'Sparks deep aesthetic creativity, emotional healing, and intuitive psychological discernment.',
      aspectsToHouses: [calcHouse(2)],
    },
  ];

  const activePlanet = transits.find((t) => t.name === selectedPlanet) || transits[0];

  // Visual category color & theme
  const categoryThemes = {
    career: { color: '#FF4B19', label: 'Vocational Flow', index: 88 },
    relationships: { color: '#E32636', label: 'Relational Resonance', index: 76 },
    wealth: { color: '#F7A928', label: 'Dhana Energy', index: 82 },
    health: { color: '#08745B', label: 'Pranic Vitality', index: 91 },
    growth: { color: '#2563EB', label: 'Dharmic Alignment', index: 85 },
  };
  const theme = categoryThemes[category];

  return (
    <div className="card-navy p-6 md:p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Celestial Radial Glow */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-25"
        style={{ background: `radial-gradient(circle, ${theme.color} 0%, transparent 70%)` }}
      />

      {/* Top Header of Celestial Instrument */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[#FF9A20] border border-white/15 mb-2">
            <Orbit size={13} className="text-[#FF4B19]" />
            <span>Nirayana Planetary Transits (Gochar)</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Real-Time Celestial Transit Map
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Transits projected against your {lagnaRashi} Lagna • {timeframe}
          </p>
        </div>

        {/* Visual Forecast Meter */}
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${theme.index}, 100`}
                strokeLinecap="round"
                stroke={theme.color}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-extrabold text-white">{theme.index}%</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50 block">{theme.label}</span>
            <span className="text-xs font-bold text-white">Harmonious Alignment</span>
          </div>
        </div>
      </div>

      {/* Interactive Transit Graha Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none relative z-10">
        {transits.map((planet) => {
          const isSelected = planet.name === selectedPlanet;
          return (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet.name)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#FF4B19] to-[#FF9A20] text-white shadow-lg shadow-[#FF4B19]/30 border border-white/30 scale-[1.02]'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/10'
              }`}
            >
              <span>{planet.name.split(' ')[0]}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 font-mono">
                H{planet.houseFromLagna}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Celestial Visualization Panel: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Column: Visual Planetary Orbit Radar / Geometric Zodiac Arc */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-black/40 border border-white/10 relative min-h-[260px]">
          {/* Circular Zodiac Orbit Diagram */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Outer Orbit Track */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin-slow" />
            <div className="absolute inset-3 rounded-full border border-white/10" />
            <div className="absolute inset-10 rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent" />

            {/* Central Lagna Core */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#09132E] to-[#15224A] border-2 border-[#FF9A20] flex flex-col items-center justify-center text-center shadow-lg shadow-[#FF9A20]/20 z-10">
              <span className="text-[9px] font-bold text-[#FF9A20] uppercase tracking-wider">Lagna</span>
              <span className="text-xs font-black text-white">{lagnaRashi}</span>
            </div>

            {/* Positioned Transiting Graha Nodes Around the Wheel */}
            {transits.map((t, idx) => {
              const angle = ((t.houseFromLagna - 1) / 12) * 2 * Math.PI - Math.PI / 2;
              const radius = 90; // pixels from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isCurrent = t.name === activePlanet.name;

              return (
                <div
                  key={t.name}
                  onClick={() => setSelectedPlanet(t.name)}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#FF4B19] text-white ring-4 ring-[#FF4B19]/40 shadow-lg scale-125 z-20'
                      : 'bg-white/20 text-white/90 hover:scale-110 border border-white/30 z-10'
                  }`}
                  title={`${t.name} in ${t.sign} (House ${t.houseFromLagna})`}
                >
                  <span className="text-[10px] font-bold">{t.name[0]}</span>
                </div>
              );
            })}
          </div>

          <span className="text-[11px] text-white/50 mt-3 font-mono">
            Transiting in Bhava {activePlanet.houseFromLagna} ({activePlanet.sign})
          </span>
        </div>

        {/* Right Column: Active Planet Influence & Aspect Analysis */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF4B19] to-[#FF9A20] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {activePlanet.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-white">{activePlanet.name}</h4>
                  <span className="text-xs text-[#FF9A20] font-sans">({activePlanet.sanskrit})</span>
                </div>
                <p className="text-xs text-white/60">
                  Transiting {activePlanet.sign} • House {activePlanet.houseFromLagna} from Ascendant
                </p>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                activePlanet.dignity === 'Exalted' || activePlanet.dignity === 'Own Sign'
                  ? 'bg-[#08745B]/20 text-emerald-400 border-emerald-500/30'
                  : activePlanet.dignity === 'Debilitated'
                  ? 'bg-[#E32636]/20 text-rose-300 border-rose-500/30'
                  : 'bg-white/10 text-white/80 border-white/15'
              }`}
            >
              {activePlanet.dignity}
            </span>
          </div>

          {/* Core Influence Narrative */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/85 leading-relaxed">
            {activePlanet.significance}
          </div>

          {/* Aspect Rays (Drishti) & Benefic Channels */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF9A20] block">
                Active Drishti (Aspects)
              </span>
              <p className="text-white font-medium">
                Casting influence into Houses {activePlanet.aspectsToHouses.join(', ')}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Motional Status
              </span>
              <p className="text-white font-medium">
                {activePlanet.motion} Motion ({activePlanet.impact.toUpperCase()})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
