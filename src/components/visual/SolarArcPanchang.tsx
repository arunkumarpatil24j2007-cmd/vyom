import React from 'react';
import { Sun, Moon, Clock, Compass, Shield, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SolarArcPanchangProps {
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  abhijitMuhurat: string;
  cityName: string;
  dateStr: string;
  className?: string;
}

export default function SolarArcPanchang({
  sunrise,
  sunset,
  rahuKaal,
  abhijitMuhurat,
  cityName,
  dateStr,
  className = '',
}: SolarArcPanchangProps) {
  // Typical Choghadiya daytime divisions (Sunrise to Sunset divided into 8 equal parts of ~1.5 hours)
  const daytimeSegments = [
    { name: 'Shubh', ruler: 'Jupiter', quality: 'auspicious', color: '#08745B', label: 'Good' },
    { name: 'Rog', ruler: 'Venus', quality: 'inauspicious', color: '#E32636', label: 'Discord' },
    { name: 'Udveg', ruler: 'Sun', quality: 'caution', color: '#D97706', label: 'Anxiety' },
    { name: 'Char', ruler: 'Moon', quality: 'neutral', color: '#2563EB', label: 'Travel/Change' },
    { name: 'Labh', ruler: 'Mercury', quality: 'auspicious', color: '#08745B', label: 'Profit' },
    { name: 'Amrit', ruler: 'Moon', quality: 'auspicious', color: '#08745B', label: 'Nectar/Best' },
    { name: 'Kaal', ruler: 'Saturn', quality: 'inauspicious', color: '#E32636', label: 'Obstacle' },
    { name: 'Shubh', ruler: 'Jupiter', quality: 'auspicious', color: '#08745B', label: 'Good' },
  ];

  return (
    <div className={`card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-6 shadow-sm ${className}`}>
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#FF4B19] mb-1">
            <Sun size={13} />
            <span>Diurnal Solar Arc & Auspicious Muhurta Ribbon</span>
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Solar Trajectory & Day Segments
          </h3>
          <p className="text-xs text-[#7A8294] mt-0.5">
            Geocentric solar elevation for {cityName} • {dateStr}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] text-xs">
          <Clock size={13} className="text-[#FF4B19]" />
          <span className="text-[#7A8294]">Midday Apex:</span>
          <span className="font-extrabold text-[#09132E]">12:15 PM</span>
        </div>
      </div>

      {/* ═══ Visual Celestial Sky Arc (SVG) ═══ */}
      <div className="relative pt-4 pb-2 px-4 flex flex-col items-center">
        <div className="w-full max-w-xl h-36 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 140">
            {/* Horizon baseline */}
            <line
              x1="20"
              y1="120"
              x2="380"
              y2="120"
              stroke="#E8DCCB"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Sun path arc */}
            <path
              d="M 40 120 A 160 100 0 0 1 360 120"
              fill="none"
              stroke="url(#solarArcGradient)"
              strokeWidth="3"
            />

            {/* Gradients */}
            <defs>
              <linearGradient id="solarArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F7A928" />
                <stop offset="50%" stopColor="#FF4B19" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* Sunrise Point */}
            <circle cx="40" cy="120" r="6" fill="#F7A928" />
            <text x="40" y="136" textAnchor="middle" fill="#7A8294" fontSize="10" fontWeight="bold">
              Rise {sunrise}
            </text>

            {/* Abhijit Solar Apex (Mid-sky) */}
            <circle cx="200" cy="20" r="10" fill="#FF4B19" className="animate-pulse" />
            <circle cx="200" cy="20" r="14" fill="none" stroke="#FF4B19" strokeWidth="1.5" opacity="0.4" />
            <text x="200" y="10" textAnchor="middle" fill="#FF4B19" fontSize="10" fontWeight="bold">
              Abhijit Peak
            </text>

            {/* Sunset Point */}
            <circle cx="360" cy="120" r="6" fill="#D97706" />
            <text x="360" y="136" textAnchor="middle" fill="#7A8294" fontSize="10" fontWeight="bold">
              Set {sunset}
            </text>
          </svg>
        </div>

        {/* Time Indicators Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-4 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-[#E8DCCB] space-y-0.5">
            <span className="text-[10px] text-[#7A8294] uppercase font-bold block">Sunrise</span>
            <span className="font-extrabold text-[#09132E] text-sm">{sunrise}</span>
            <span className="text-[10px] text-[#08745B] block">Pratah Kaal</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#08745B]/10 border border-[#08745B]/20 space-y-0.5">
            <span className="text-[10px] text-[#08745B] uppercase font-bold block">Abhijit Muhurta</span>
            <span className="font-extrabold text-[#09132E] text-sm">{abhijitMuhurat}</span>
            <span className="text-[10px] text-[#08745B] block">Supreme Auspiciousness</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#E32636]/10 border border-[#E32636]/20 space-y-0.5">
            <span className="text-[10px] text-[#E32636] uppercase font-bold block">Rahu Kaal</span>
            <span className="font-extrabold text-[#09132E] text-sm">{rahuKaal}</span>
            <span className="text-[10px] text-[#E32636] block">Avoid Auspicious Starts</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#E8DCCB] space-y-0.5">
            <span className="text-[10px] text-[#7A8294] uppercase font-bold block">Sunset</span>
            <span className="font-extrabold text-[#09132E] text-sm">{sunset}</span>
            <span className="text-[10px] text-[#7A8294] block">Sayam Sandhya</span>
          </div>
        </div>
      </div>

      {/* ═══ Choghadiya Daytime Ribbon ═══ */}
      <div className="space-y-3 pt-2 border-t border-[#E8DCCB]/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7E889B]">
            Day Choghadiya Divisions (8 Solar Segments)
          </span>
          <span className="text-[10px] font-bold text-[#08745B] bg-[#08745B]/10 px-2 py-0.5 rounded-full">
            Amrit, Shubh & Labh Recommended
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-xs">
          {daytimeSegments.map((seg, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border space-y-1 transition-all ${
                seg.quality === 'auspicious'
                  ? 'bg-[#08745B]/10 border-[#08745B]/30'
                  : seg.quality === 'inauspicious'
                  ? 'bg-[#E32636]/10 border-[#E32636]/30'
                  : 'bg-white border-[#E8DCCB]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-[#09132E]">{seg.name}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
              </div>
              <span className="text-[10px] text-[#7A8294] block">Part {idx + 1}</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider block"
                style={{ color: seg.color }}
              >
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
