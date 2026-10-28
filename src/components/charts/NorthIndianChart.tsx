import type { ChartData, GrahaName } from '@/types';

interface NorthIndianChartProps {
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

const SIGN_ABBR = [
  'Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'
];

// North Indian chart house positions (diamond layout)
// Each house is defined by its polygon points relative to the chart size
function getHousePoints(house: number, s: number): string {
  const c = s / 2; // center
  const points: Record<number, string> = {
    1:  `${c},${0} ${s},${0} ${c},${c}`,            // Top-right triangle
    2:  `${s},${0} ${s},${c} ${c},${c}`,             // Right-top triangle
    3:  `${s},${0} ${s},${c} ${s},${c}`,             // reuse handled by layout
    4:  `${c},${c} ${s},${c} ${s},${s} ${c},${s}`,   // Right rectangle becomes bottom-right
    5:  `${c},${s} ${s},${s} ${c},${c}`,             // Bottom-right triangle
    6:  `${0},${s} ${c},${s} ${c},${c}`,             // Bottom-left triangle
    7:  `${0},${c} ${0},${s} ${c},${c}`,             // Left-bottom triangle reuse
    8:  `${0},${0} ${0},${c} ${c},${c}`,             // Left-top triangle
    9:  `${0},${0} ${c},${0} ${c},${c}`,             // Top-left triangle
    10: `${0},${0} ${0},${c} ${c},${c}`,             // reuse
    11: `${0},${c} ${0},${s} ${c},${s} ${c},${c}`,   // Left rectangle
    12: `${0},${0} ${c},${0} ${c},${c} ${0},${c}`,   // Top-left rectangle
  };
  return points[house] || '';
}

// House label positions - center of each house area
function getHouseCenter(house: number, s: number): { x: number; y: number } {
  const c = s / 2;
  const q = s / 4;
  const centers: Record<number, { x: number; y: number }> = {
    1:  { x: c, y: q * 0.9 },       // Top center (Ascendant house)
    2:  { x: c + q * 1.1, y: q * 0.6 },
    3:  { x: s - q * 0.55, y: q * 0.9 },
    4:  { x: s - q * 0.55, y: c },
    5:  { x: s - q * 0.55, y: s - q * 0.9 },
    6:  { x: c + q * 1.1, y: s - q * 0.6 },
    7:  { x: c, y: s - q * 0.9 },
    8:  { x: c - q * 1.1, y: s - q * 0.6 },
    9:  { x: q * 0.55, y: s - q * 0.9 },
    10: { x: q * 0.55, y: c },
    11: { x: q * 0.55, y: q * 0.9 },
    12: { x: c - q * 1.1, y: q * 0.6 },
  };
  return centers[house] || { x: c, y: c };
}

export default function NorthIndianChart({
  chart, size = 380, onPlanetClick, selectedPlanet, interactive = true, className = ''
}: NorthIndianChartProps) {
  const s = size;
  const c = s / 2;
  const strokeColor = '#09132E';
  const strokeOpacity = 0.25;
  const strokeActive = '#FF4B19';

  // Find which house a planet is in
  const planetsByHouse: Record<number, typeof chart.planets> = {};
  chart.planets.forEach((p) => {
    if (!planetsByHouse[p.house]) planetsByHouse[p.house] = [];
    planetsByHouse[p.house].push(p);
  });

  // Determine ascendant house (house 1 sign)
  const ascSign = chart.ascendant.signIndex;

  return (
    <div className={`relative ${className}`} role="img" aria-label="North Indian birth chart">
      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        className="w-full h-auto max-w-full"
      >
        {/* Subtle chart surface background */}
        <rect
          x={2} y={2}
          width={s - 4} height={s - 4}
          fill="#FFFFFF"
          rx={16}
        />

        {/* Outer square */}
        <rect
          x={4} y={4}
          width={s - 8} height={s - 8}
          fill="none"
          stroke={strokeColor}
          strokeOpacity={strokeOpacity}
          strokeWidth={1.5}
          rx={14}
        />

        {/* Inner diamond (connecting midpoints) */}
        <polygon
          points={`${c},${4} ${s - 4},${c} ${c},${s - 4} ${4},${c}`}
          fill="rgba(255, 75, 25, 0.02)"
          stroke={strokeColor}
          strokeOpacity={strokeOpacity}
          strokeWidth={1.25}
        />

        {/* Diagonal lines creating the 12 houses */}
        <line x1={4} y1={4} x2={c} y2={c} stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth={1} />
        <line x1={s - 4} y1={4} x2={c} y2={c} stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth={1} />
        <line x1={s - 4} y1={s - 4} x2={c} y2={c} stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth={1} />
        <line x1={4} y1={s - 4} x2={c} y2={c} stroke={strokeColor} strokeOpacity={strokeOpacity} strokeWidth={1} />

        {/* House labels & planets */}
        {Array.from({ length: 12 }, (_, i) => {
          const houseNum = i + 1;
          const pos = getHouseCenter(houseNum, s);
          const planets = planetsByHouse[houseNum] || [];
          const signIdx = ((ascSign - 1 + (houseNum - 1)) % 12);

          return (
            <g key={houseNum}>
              {/* Sign label */}
              <text
                x={pos.x}
                y={pos.y - (planets.length > 0 ? 10 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#7A8294"
                fontSize={size > 300 ? 9 : 7}
                fontWeight={600}
                fontFamily="var(--font-sans)"
              >
                {SIGN_ABBR[signIdx]}
              </text>

              {/* Planets in this house */}
              {planets.map((planet, pi) => {
                const isSelected = selectedPlanet === planet.planet;
                const yOff = (pi - (planets.length - 1) / 2) * (size > 300 ? 14 : 11);

                return (
                  <g key={planet.planet}>
                    <text
                      x={pos.x}
                      y={pos.y + 6 + yOff}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSelected ? '#FF4B19' : planet.isRetrograde ? '#E32636' : '#09132E'}
                      fontSize={size > 300 ? 11 : 9}
                      fontWeight={isSelected ? 800 : 700}
                      fontFamily="var(--font-sans)"
                      style={{
                        cursor: interactive ? 'pointer' : 'default',
                      }}
                      onClick={() => interactive && onPlanetClick?.(planet.planet)}
                      role={interactive ? 'button' : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      aria-label={`${planet.planet} in ${planet.sign}, house ${planet.house}`}
                    >
                      {PLANET_ABBR[planet.planet]}
                      {planet.isRetrograde && (
                        <tspan fontSize={size > 300 ? 8 : 6} fill="#E32636"> ℞</tspan>
                      )}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Ascendant marker — "ASC" label in house 1 */}
        <text
          x={c}
          y={14 + (size > 300 ? 12 : 8)}
          textAnchor="middle"
          fill="#FF4B19"
          fontSize={size > 300 ? 8 : 6}
          fontWeight={800}
          fontFamily="var(--font-sans)"
          letterSpacing="0.1em"
        >
          ASC
        </text>
      </svg>

      {/* Screen reader description */}
      <div className="sr-only">
        <p>Birth chart for {chart.profileId}. Ascendant: {chart.ascendant.sign} at {chart.ascendant.degree.toFixed(1)}°.</p>
        {chart.planets.map((p) => (
          <p key={p.planet}>
            {p.planet}: {p.sign}, House {p.house}, {p.degree.toFixed(1)}°
            {p.isRetrograde ? ' (Retrograde)' : ''}
            {p.nakshatra ? `, ${p.nakshatra}` : ''}
          </p>
        ))}
      </div>
    </div>
  );
}
