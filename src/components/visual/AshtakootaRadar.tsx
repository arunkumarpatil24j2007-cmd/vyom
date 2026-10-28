import React from 'react';
import { Heart, ShieldCheck, Star, Award, Compass } from 'lucide-react';
import type { CompatibilityResult, KootaFactor } from '@/lib/astrology/calculations/ashtakoota';

interface AshtakootaRadarProps {
  compatibility: CompatibilityResult;
  className?: string;
}

export default function AshtakootaRadar({
  compatibility,
  className = '',
}: AshtakootaRadarProps) {
  const { totalScore, percentage, verdict, factors } = compatibility;

  // Circular gauge math for total score (out of 36)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 36) * circumference;

  return (
    <div className={`card-cream p-6 md:p-8 rounded-[32px] border border-[#E8DCCB] space-y-6 shadow-sm ${className}`}>
      {/* ═══ Header with Score Dial & Traditional Verdict ═══ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#E8DCCB]/60">
        <div className="flex items-center gap-5">
          {/* Radial Score Gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-[#E8DCCB]/60"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="#FF4B19"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-[#09132E] leading-none">
                {totalScore}
              </span>
              <span className="text-[10px] font-bold text-[#7E889B] uppercase tracking-wider mt-0.5">
                / 36 Gunas
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF4B19]/10 text-[#FF4B19] text-[10px] font-extrabold uppercase tracking-widest">
              <Award size={12} />
              <span>{percentage}% Harmony Factor</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
              {verdict}
            </h3>
            <p className="text-xs text-[#7A8294] max-w-sm">
              Ashtakoota examines 8 dimensions of mutual compatibility ranging from biological temperament to mental communion.
            </p>
          </div>
        </div>

        {/* Traditional Criterion Badge */}
        <div className="p-3.5 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB] text-xs space-y-1 text-center md:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#7A8294] block">Shastric Threshold</span>
          <span className="font-extrabold text-[#09132E] text-sm block">18 / 36 Minimum</span>
          <span className={`text-[10px] font-bold ${totalScore >= 18 ? 'text-[#08745B]' : 'text-[#E32636]'}`}>
            {totalScore >= 18 ? 'Passed traditional auspicious threshold' : 'Requires mitigating planetary review'}
          </span>
        </div>
      </div>

      {/* ═══ 8 Kootas Visual Progress Bars ═══ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#7E889B]">
            Ashtakoota Factor Matrix (8 Classical Pillars)
          </h4>
          <span className="text-[11px] font-medium text-[#7E889B]">
            Nadi (8) & Bhakoot (7) carry highest weight
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {factors.map((factor) => {
            const fillPct = (factor.pointsObtained / factor.totalPoints) * 100;
            const isFull = factor.pointsObtained === factor.totalPoints;
            const isZero = factor.pointsObtained === 0;

            const badgeColor =
              factor.status === 'excellent'
                ? 'bg-[#08745B]/10 text-[#08745B] border-[#08745B]/20'
                : factor.status === 'good'
                ? 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20'
                : factor.status === 'average'
                ? 'bg-[#F7A928]/10 text-[#D97706] border-[#F7A928]/20'
                : 'bg-[#E32636]/10 text-[#E32636] border-[#E32636]/20';

            return (
              <div
                key={factor.name}
                className="p-3.5 rounded-2xl bg-white border border-[#E8DCCB] shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-[#09132E] text-xs">{factor.name}</span>
                    <span className="font-black text-[#FF4B19] text-xs">
                      {factor.pointsObtained}/{factor.totalPoints}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A8294] leading-snug line-clamp-2">
                    {factor.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {/* Visual Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#E8DCCB]/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isFull
                          ? 'bg-[#08745B]'
                          : isZero
                          ? 'bg-[#E32636]'
                          : 'bg-[#FF4B19]'
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${badgeColor}`}>
                      {factor.status}
                    </span>
                    <span className="text-[#B0B8C7] font-semibold">{Math.round(fillPct)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Ethical & Epistemic Shastric Note ═══ */}
      <div className="p-4 rounded-2xl bg-[#FAF2E8]/80 border border-[#E8DCCB] text-xs text-[#4A5468] leading-relaxed space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-[#09132E]">
          <ShieldCheck size={15} className="text-[#08745B]" />
          <span>Epistemic Note on Vedic Compatibility</span>
        </div>
        <p>
          Classical Ashtakoota calculation is an analytical framework from Brihat Parashara Hora Shastra evaluating temperamental, physiological, and psychic compatibility between natal Moon positions. It is a traditional aid for mutual understanding and not a deterministic forecast of relationship success.
        </p>
      </div>
    </div>
  );
}
