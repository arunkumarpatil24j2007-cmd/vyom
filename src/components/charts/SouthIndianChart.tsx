import React from 'react';
import type { ChartData, GrahaName } from '@/types';

interface SouthIndianChartProps {
  chart: ChartData;
  size?: number;
  onPlanetClick?: (planet: GrahaName) => void;
  selectedPlanet?: GrahaName | null;
  interactive?: boolean;
  className?: string;
}

const PLANET_ABBR: Record<GrahaName, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me',
  Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

// 12 Fixed Zodiac Signs in South Indian System (clockwise starting top-left Pisces)
// Coordinates in a 4x4 grid (col: 0..3, row: 0..3)
const SIGN_BOXES: Array<{ signNumber: number; name: string; abbr: string; col: number; row: number }> = [
  { signNumber: 12, name: 'Pisces', abbr: 'Pi', col: 0, row: 0 },
  { signNumber: 1,  name: 'Aries', abbr: 'Ar', col: 1, row: 0 },
  { signNumber: 2,  name: 'Taurus', abbr: 'Ta', col: 2, row: 0 },
  { signNumber: 3,  name: 'Gemini', abbr: 'Ge', col: 3, row: 0 },
  { signNumber: 4,  name: 'Cancer', abbr: 'Cn', col: 3, row: 1 },
  { signNumber: 5,  name: 'Leo', abbr: 'Le', col: 3, row: 2 },
  { signNumber: 6,  name: 'Virgo', abbr: 'Vi', col: 3, row: 3 },
  { signNumber: 7,  name: 'Libra', abbr: 'Li', col: 2, row: 3 },
  { signNumber: 8,  name: 'Scorpio', abbr: 'Sc', col: 1, row: 3 },
  { signNumber: 9,  name: 'Sagittarius', abbr: 'Sg', col: 0, row: 3 },
  { signNumber: 10, name: 'Capricorn', abbr: 'Cp', col: 0, row: 2 },
  { signNumber: 11, name: 'Aquarius', abbr: 'Aq', col: 0, row: 1 },
];

export default function SouthIndianChart({
  chart,
  size = 400,
  onPlanetClick,
  selectedPlanet,
  interactive = true,
  className = '',
}: SouthIndianChartProps) {
  const cellSize = size / 4;

  // Determine Lagna sign index (1 = Aries ... 12 = Pisces)
  const lagnaSignIndex = chart.ascendant?.signIndex || 1;

  // Group planets by sign index (1-12)
  const planetsBySign: Record<number, Array<(typeof chart.planets)[0]>> = {};
  for (let i = 1; i <= 12; i++) {
    planetsBySign[i] = [];
  }

  chart.planets.forEach((p) => {
    const sIndex = p.signIndex || 1;
    if (planetsBySign[sIndex]) {
      planetsBySign[sIndex].push(p);
    }
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`select-none ${className}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Background Outer Border */}
      <rect
        x="2"
        y="2"
        width={size - 4}
        height={size - 4}
        fill="#FEFBF6"
        stroke="#D4AF37"
        strokeWidth="2.5"
        rx="8"
      />

      {/* Grid Lines (Outer Border & Cell Dividers) */}
      {[1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          {/* Top/Bottom Horizontal Lines */}
          <line
            x1="0"
            y1={i * cellSize}
            x2={size}
            y2={i * cellSize}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          {/* Left/Right Vertical Lines */}
          <line
            x1={i * cellSize}
            y1="0"
            x2={i * cellSize}
            y2={size}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
        </React.Fragment>
      ))}

      {/* Center 2x2 Square (Covers central inner grid lines) */}
      <rect
        x={cellSize}
        y={cellSize}
        width={cellSize * 2}
        height={cellSize * 2}
        fill="#FAF2E8"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />

      {/* Central Emblem & Title */}
      <text
        x={size / 2}
        y={size / 2 - 14}
        textAnchor="middle"
        fill="#09132E"
        fontSize={Math.max(12, size * 0.035)}
        fontWeight="800"
        fontFamily="var(--font-heading)"
      >
        D1 Rashi Kundli
      </text>
      <text
        x={size / 2}
        y={size / 2 + 6}
        textAnchor="middle"
        fill="#FF4B19"
        fontSize={Math.max(10, size * 0.026)}
        fontWeight="700"
      >
        Lagna: {chart.ascendant?.rashiName || chart.ascendant?.sign}
      </text>
      <text
        x={size / 2}
        y={size / 2 + 22}
        textAnchor="middle"
        fill="#7A8294"
        fontSize={Math.max(9, size * 0.022)}
        fontWeight="600"
      >
        South Indian Format • Lahiri
      </text>

      {/* Render 12 Sign Boxes */}
      {SIGN_BOXES.map((box) => {
        const x = box.col * cellSize;
        const y = box.row * cellSize;
        const isLagna = box.signNumber === lagnaSignIndex;
        const boxPlanets = planetsBySign[box.signNumber] || [];

        return (
          <g key={box.signNumber}>
            {/* Lagna Highlight Diagonal Stroke */}
            {isLagna && (
              <>
                <line
                  x1={x + 4}
                  y1={y + cellSize - 4}
                  x2={x + cellSize - 4}
                  y2={y + 4}
                  stroke="#FF4B19"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  opacity="0.8"
                />
                <rect
                  x={x + 4}
                  y={y + 4}
                  width="28"
                  height="14"
                  rx="4"
                  fill="#FF4B19"
                />
                <text
                  x={x + 18}
                  y={y + 14}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="8"
                  fontWeight="800"
                >
                  ASC
                </text>
              </>
            )}

            {/* Sign Abbreviation in top-right corner of cell */}
            <text
              x={x + cellSize - 6}
              y={y + 14}
              textAnchor="end"
              fill="#A0AEC0"
              fontSize={Math.max(9, size * 0.024)}
              fontWeight="700"
            >
              {box.abbr}
            </text>

            {/* Planets in this Sign */}
            <g transform={`translate(${x + cellSize / 2}, ${y + (isLagna ? cellSize / 2 + 4 : cellSize / 2)})`}>
              {boxPlanets.map((p, idx) => {
                const isSelected = selectedPlanet === p.planet;
                const totalInBox = boxPlanets.length;
                const offsetY = (idx - (totalInBox - 1) / 2) * 16;
                const abbr = PLANET_ABBR[p.planet] || p.planet.slice(0, 2);

                return (
                  <g
                    key={p.planet}
                    transform={`translate(0, ${offsetY})`}
                    className={interactive ? 'cursor-pointer' : ''}
                    onClick={() => interactive && onPlanetClick?.(p.planet)}
                  >
                    {isSelected && (
                      <rect
                        x="-20"
                        y="-8"
                        width="40"
                        height="16"
                        rx="4"
                        fill="#FF4B19"
                        opacity="0.2"
                      />
                    )}
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isSelected ? '#FF4B19' : '#09132E'}
                      fontSize={Math.max(11, size * 0.028)}
                      fontWeight={isSelected ? '900' : '700'}
                    >
                      {abbr}
                      {p.retrograde ? 'ᴿ' : ''}
                      <tspan
                        fontSize={Math.max(8, size * 0.02)}
                        fill="#7A8294"
                        fontWeight="600"
                        dx="2"
                      >
                        {Math.floor((p.degrees ?? p.degree ?? 0) % 30)}°
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
