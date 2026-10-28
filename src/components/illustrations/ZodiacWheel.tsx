import React from 'react';

interface ZodiacWheelProps {
  size?: number;
  rotation?: number;
  className?: string;
}

export default function ZodiacWheel({ size = 260, rotation = 0, className = '' }: ZodiacWheelProps) {
  const center = size / 2;
  const radius = size * 0.44;
  const innerRadius = size * 0.35;
  const starRadius = size * 0.18;

  const signs = [
    { symbol: '♈', name: 'Aries / Mesha', angle: 0 },
    { symbol: '♉', name: 'Taurus / Vrishabha', angle: 30 },
    { symbol: '♊', name: 'Gemini / Mithuna', angle: 60 },
    { symbol: '♋', name: 'Cancer / Karka', angle: 90 },
    { symbol: '♌', name: 'Leo / Simha', angle: 120 },
    { symbol: '♍', name: 'Virgo / Kanya', angle: 150 },
    { symbol: '♎', name: 'Libra / Tula', angle: 180 },
    { symbol: '♏', name: 'Scorpio / Vrishchika', angle: 210 },
    { symbol: '♐', name: 'Sagittarius / Dhanu', angle: 240 },
    { symbol: '♑', name: 'Capricorn / Makara', angle: 270 },
    { symbol: '♒', name: 'Aquarius / Kumbha', angle: 300 },
    { symbol: '♓', name: 'Pisces / Meena', angle: 330 },
  ];

  // 8-point central star polygon
  const starPoints = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? starRadius : starRadius * 0.38;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.1s linear',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FFC837" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#FF8008" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFF1B8" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="starFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF6D1" />
            <stop offset="100%" stopColor="#FF9A20" />
          </linearGradient>

          <linearGradient id="starFacet2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFAE34" />
            <stop offset="100%" stopColor="#D95C00" />
          </linearGradient>
        </defs>

        {/* Outer concentric golden boundaries */}
        <circle
          cx={center}
          cy={center}
          r={radius + 8}
          fill="none"
          stroke="url(#goldRingGrad)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          opacity="0.6"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="url(#goldRingGrad)"
          strokeWidth="1.6"
          opacity="0.85"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="url(#goldRingGrad)"
          strokeWidth="1.4"
          opacity="0.8"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 6}
          fill="none"
          stroke="url(#goldRingGrad)"
          strokeWidth="0.8"
          strokeDasharray="3 4"
          opacity="0.5"
        />

        {/* 72 Degree division ticks around the circumference */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          const isMajor = i % 6 === 0;
          const r1 = radius;
          const r2 = radius - (isMajor ? 6 : 3);
          return (
            <line
              key={i}
              x1={center + r1 * Math.cos(a)}
              y1={center + r1 * Math.sin(a)}
              x2={center + r2 * Math.cos(a)}
              y2={center + r2 * Math.sin(a)}
              stroke="#FFD580"
              strokeWidth={isMajor ? 1.2 : 0.6}
              opacity={isMajor ? 0.8 : 0.4}
            />
          );
        })}

        {/* 12 House Dividing Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={center + innerRadius * Math.cos(a)}
              y1={center + innerRadius * Math.sin(a)}
              x2={center + radius * Math.cos(a)}
              y2={center + radius * Math.sin(a)}
              stroke="#FFE8A3"
              strokeWidth="0.9"
              opacity="0.5"
            />
          );
        })}

        {/* 12 Zodiac Glyphs */}
        {signs.map((s) => {
          const midAngle = ((s.angle + 15) * Math.PI) / 180 - Math.PI / 2;
          const glyphRadius = (radius + innerRadius) / 2;
          const gx = center + glyphRadius * Math.cos(midAngle);
          const gy = center + glyphRadius * Math.sin(midAngle);

          return (
            <g key={s.name} transform={`translate(${gx}, ${gy})`}>
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#FFF4D0"
                fontSize={size * 0.055}
                fontWeight="bold"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(255, 180, 50, 0.6))',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {s.symbol}
              </text>
            </g>
          );
        })}

        {/* Inner Star Ring */}
        <circle
          cx={center}
          cy={center}
          r={starRadius + 6}
          fill="none"
          stroke="url(#goldRingGrad)"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Central 8-Pointed Faceted Celestial Star */}
        <polygon
          points={starPoints}
          fill="url(#starFacet1)"
          stroke="#FFF2BF"
          strokeWidth="0.8"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255, 170, 30, 0.8))' }}
        />

        {/* Shaded facets for 3D depth on the star */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a1 = (i * Math.PI) / 4 - Math.PI / 2;
          const a2 = a1 + Math.PI / 8;
          const p1 = `${center},${center}`;
          const p2 = `${center + starRadius * Math.cos(a1)},${center + starRadius * Math.sin(a1)}`;
          const p3 = `${center + starRadius * 0.38 * Math.cos(a2)},${center + starRadius * 0.38 * Math.sin(a2)}`;
          return (
            <polygon
              key={i}
              points={`${p1} ${p2} ${p3}`}
              fill={i % 2 === 0 ? 'url(#starFacet2)' : 'none'}
              opacity="0.6"
            />
          );
        })}

        {/* Central jewel bead */}
        <circle
          cx={center}
          cy={center}
          r={size * 0.022}
          fill="#FFFBF0"
          style={{ filter: 'drop-shadow(0 0 4px #FF9A20)' }}
        />
      </svg>
    </div>
  );
}
