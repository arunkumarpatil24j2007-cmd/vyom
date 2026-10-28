import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Sparkles, Star } from 'lucide-react';
import type { DashaPeriod, CalculatedDasha } from '@/types';

export interface NormalizedDasha {
  planet: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isActive: boolean;
  subPeriods?: {
    planet: string;
    startDate: string;
    endDate: string;
    durationYears: number;
  }[];
}

interface DashaTimelineVisualizerProps {
  dashas?: (CalculatedDasha | DashaPeriod)[];
  className?: string;
}

export default function DashaTimelineVisualizer({
  dashas,
  className = '',
}: DashaTimelineVisualizerProps) {
  const currentYear = new Date().getFullYear();

  // Classical Vimshottari 120-year planetary sequence fallback if chart is not loaded yet
  const defaultDashas: NormalizedDasha[] = [
    {
      planet: 'Saturn',
      startDate: '2012-04-10',
      endDate: '2031-04-10',
      durationYears: 19,
      isActive: true,
      subPeriods: [
        { planet: 'Saturn', startDate: '2012-04-10', endDate: '2015-04-13', durationYears: 3 },
        { planet: 'Mercury', startDate: '2015-04-13', endDate: '2017-12-22', durationYears: 2.7 },
        { planet: 'Ketu', startDate: '2017-12-22', endDate: '2019-01-31', durationYears: 1.1 },
        { planet: 'Venus', startDate: '2019-01-31', endDate: '2022-04-01', durationYears: 3.2 },
        { planet: 'Sun', startDate: '2022-04-01', endDate: '2023-03-14', durationYears: 0.9 },
        { planet: 'Moon', startDate: '2023-03-14', endDate: '2024-10-13', durationYears: 1.6 },
        { planet: 'Mars', startDate: '2024-10-13', endDate: '2025-11-22', durationYears: 1.1 },
        { planet: 'Rahu', startDate: '2025-11-22', endDate: '2028-09-28', durationYears: 2.8 },
        { planet: 'Jupiter', startDate: '2028-09-28', endDate: '2031-04-10', durationYears: 2.5 },
      ],
    },
    {
      planet: 'Mercury',
      startDate: '2031-04-10',
      endDate: '2048-04-10',
      durationYears: 17,
      isActive: false,
    },
    {
      planet: 'Ketu',
      startDate: '2048-04-10',
      endDate: '2055-04-10',
      durationYears: 7,
      isActive: false,
    },
    {
      planet: 'Venus',
      startDate: '2055-04-10',
      endDate: '2075-04-10',
      durationYears: 20,
      isActive: false,
    },
  ];

  const normalizedDashas: NormalizedDasha[] = React.useMemo(() => {
    if (!dashas || dashas.length === 0) return defaultDashas;

    return dashas.map((d: any) => {
      if ('startYear' in d) {
        // CalculatedDasha format
        const sYear = d.startYear;
        const eYear = d.endYear;
        const active = currentYear >= sYear && currentYear <= eYear;
        return {
          planet: d.planet,
          startDate: `${sYear}-01-01`,
          endDate: `${eYear}-12-31`,
          durationYears: d.durationYears || (eYear - sYear),
          isActive: active,
        };
      }

      // DashaPeriod format
      const startYr = parseInt(d.startDate?.slice(0, 4) || '0', 10);
      const endYr = parseInt(d.endDate?.slice(0, 4) || '0', 10);
      const active = d.isActive ?? (currentYear >= startYr && currentYear <= endYr);
      return {
        planet: d.planet,
        startDate: d.startDate || `${currentYear}-01-01`,
        endDate: d.endDate || `${currentYear + 5}-12-31`,
        durationYears: endYr > startYr ? endYr - startYr : 5,
        isActive: active,
        subPeriods: d.subPeriods?.map((sp: any) => ({
          planet: sp.planet,
          startDate: sp.startDate,
          endDate: sp.endDate,
          durationYears: 1,
        })),
      };
    });
  }, [dashas, currentYear]);

  const periodList = normalizedDashas;
  const currentDasha = periodList.find((d) => d.isActive) || periodList[0];
  const [selectedPlanet, setSelectedPlanet] = useState<string>(currentDasha.planet);

  const activeDetail = periodList.find((d) => d.planet === selectedPlanet) || currentDasha;

  const planetThemes: Record<string, { theme: string; element: string; color: string }> = {
    Sun: { theme: 'Authority, Sovereignty, Vitality, Father', element: 'Fire', color: '#FF4B19' },
    Moon: { theme: 'Mind, Emotional Harmony, Public Acclaim, Mother', element: 'Water', color: '#38BDF8' },
    Mars: { theme: 'Initiative, Enterprise, Courage, Real Property', element: 'Fire', color: '#E32636' },
    Mercury: { theme: 'Intellect, Commerce, Communications, Analytical Skills', element: 'Earth', color: '#10B981' },
    Jupiter: { theme: 'Wisdom, Expansion, Dharma, Higher Counsel', element: 'Ether', color: '#F7A928' },
    Venus: { theme: 'Creative Arts, Design, Alliances, Material Elegance', element: 'Water', color: '#EC4899' },
    Saturn: { theme: 'Discipline, Long-term Architecture, Endurance, Duty', element: 'Air', color: '#6366F1' },
    Rahu: { theme: 'Innovative Breakthroughs, Unconventional Paths, Ambition', element: 'Air', color: '#8B5CF6' },
    Ketu: { theme: 'Spiritual Insight, Detached Mastery, Intuition', element: 'Fire', color: '#D97706' },
  };

  return (
    <div className={`card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FF4B19] mb-1">
            <Clock size={13} />
            <span>Vimshottari Dasha Sequence (120-Year Timeline)</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Karmic Timing & Planetary Eras
          </h3>
          <p className="text-xs text-[#7E889B] mt-0.5">
            Active Mahadasha governs primary karmic focus; Antardashas shape quarterly opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#FAF2E8] border border-[#E8DCCB]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#08745B] animate-pulse" />
          <span className="text-xs font-bold text-[#09132E]">
            Active: {currentDasha.planet} Mahadasha
          </span>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Strip */}
      <div className="relative pt-4 pb-2">
        <div className="relative flex items-center justify-between gap-3 overflow-x-auto pb-4 scrollbar-none">
          {periodList.map((period, i) => {
            const isSelected = period.planet === selectedPlanet;
            const isCurrent = period.isActive;
            const meta = planetThemes[period.planet] || { color: '#FF4B19', theme: 'Karmic Period' };

            return (
              <button
                key={period.planet}
                onClick={() => setSelectedPlanet(period.planet)}
                className={`relative flex-1 min-w-[140px] p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#FF4B19] shadow-lg shadow-[#FF4B19]/10 scale-[1.02]'
                    : isCurrent
                    ? 'bg-[#FFF8EF] border-[#FF9A20]/40 hover:border-[#FF4B19]'
                    : 'bg-[#FAF2E8]/60 border-[#E8DCCB]/70 hover:bg-white hover:border-[#E8DCCB]'
                }`}
              >
                {/* Active Indicator Pin */}
                {isCurrent && (
                  <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-[#FF4B19] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-xs">
                    Current Era
                  </span>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-[#09132E]">{period.planet}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                </div>

                <div className="text-[11px] font-semibold text-[#7E889B]">
                  {period.startDate.split('-')[0]} – {period.endDate.split('-')[0]}
                </div>
                <div className="text-[10px] text-[#09132E] font-medium mt-1">
                  {period.durationYears} Years Duration
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Deep Dive & Sub-Periods (Antardashas) */}
      <div className="p-5 rounded-2xl bg-[#FAF2E8]/80 border border-[#E8DCCB] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#09132E]">
                {activeDetail.planet} Mahadasha Focus
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#E8DCCB] font-medium text-[#7E889B]">
                {activeDetail.startDate} to {activeDetail.endDate}
              </span>
            </div>
            <p className="text-xs text-[#4A5468] mt-1 font-medium">
              {planetThemes[activeDetail.planet]?.theme || 'Major life focus and evolutionary lessons.'}
            </p>
          </div>
        </div>

        {/* Antardasha Sequence (if present on active period) */}
        {activeDetail.subPeriods && activeDetail.subPeriods.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#E8DCCB]/60">
            <span className="text-[11px] font-bold text-[#7E889B] uppercase tracking-wider block">
              Antardasha Sub-Cycles
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {activeDetail.subPeriods.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white border border-[#E8DCCB]/80 space-y-0.5 shadow-2xs"
                >
                  <span className="font-bold text-[#09132E] block">{sub.planet}</span>
                  <span className="text-[10px] text-[#7E889B] block">
                    {sub.startDate.split('-')[0]} – {sub.endDate.split('-')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
