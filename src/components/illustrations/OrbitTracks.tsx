import React from 'react';

interface OrbitTracksProps {
  className?: string;
}

export default function OrbitTracks({ className = '' }: OrbitTracksProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 620 530"
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbitGold1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFB300" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFA000" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="orbitGold2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FF8F00" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFE082" stopOpacity="0.8" />
          </linearGradient>

          {/* Golden sphere bead gradient */}
          <radialGradient id="goldBeadSphere" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="35%" stopColor="#FFCA28" />
            <stop offset="70%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#C45A00" />
          </radialGradient>
        </defs>

        {/* ── Outer Primary Orbit Track (Sweeping Ellipse) ── */}
        <ellipse
          cx="315"
          cy="270"
          rx="245"
          ry="155"
          transform="rotate(-18 315 270)"
          fill="none"
          stroke="url(#orbitGold1)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
          opacity="0.75"
        />

        {/* ── Inner Planetary Orbit Track ── */}
        <ellipse
          cx="310"
          cy="265"
          rx="185"
          ry="115"
          transform="rotate(-26 310 265)"
          fill="none"
          stroke="url(#orbitGold2)"
          strokeWidth="1.4"
          opacity="0.8"
        />

        {/* ── High-Inclination Oblique Orbit ── */}
        <ellipse
          cx="325"
          cy="260"
          rx="210"
          ry="135"
          transform="rotate(32 325 260)"
          fill="none"
          stroke="url(#orbitGold1)"
          strokeWidth="0.9"
          strokeDasharray="2 3"
          opacity="0.5"
        />

        {/* ── Golden Planet Node Beads Placed on Orbital Intersections ── */}
        {/* Node 1: Top-center orbital bead */}
        <g transform="translate(370, 115)">
          <circle cx="0" cy="0" r="10" fill="rgba(255, 179, 0, 0.25)" filter="blur(3px)" />
          <circle cx="0" cy="0" r="6.5" fill="url(#goldBeadSphere)" stroke="#FFF8E1" strokeWidth="0.8" />
          <circle cx="-1.5" cy="-2" r="1.8" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Node 2: Left-mid orbital bead */}
        <g transform="translate(142, 230)">
          <circle cx="0" cy="0" r="11" fill="rgba(255, 179, 0, 0.25)" filter="blur(3px)" />
          <circle cx="0" cy="0" r="7.5" fill="url(#goldBeadSphere)" stroke="#FFF8E1" strokeWidth="0.8" />
          <circle cx="-2" cy="-2.5" r="2.2" fill="#FFFFFF" opacity="0.95" />
        </g>

        {/* Node 3: Center-left intermediate bead */}
        <g transform="translate(202, 168)">
          <circle cx="0" cy="0" r="8" fill="rgba(255, 179, 0, 0.2)" filter="blur(2px)" />
          <circle cx="0" cy="0" r="4.8" fill="url(#goldBeadSphere)" stroke="#FFF8E1" strokeWidth="0.6" />
          <circle cx="-1" cy="-1.5" r="1.4" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Node 4: Lower-right small node */}
        <g transform="translate(495, 335)">
          <circle cx="0" cy="0" r="9" fill="rgba(255, 179, 0, 0.2)" filter="blur(2px)" />
          <circle cx="0" cy="0" r="5.2" fill="url(#goldBeadSphere)" stroke="#FFF8E1" strokeWidth="0.6" />
          <circle cx="-1.2" cy="-1.6" r="1.5" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Node 5: Near Saturn trajectory */}
        <g transform="translate(450, 150)">
          <circle cx="0" cy="0" r="6" fill="rgba(255, 179, 0, 0.2)" filter="blur(2px)" />
          <circle cx="0" cy="0" r="3.8" fill="url(#goldBeadSphere)" stroke="#FFF8E1" strokeWidth="0.5" />
          <circle cx="-0.8" cy="-1" r="1.1" fill="#FFFFFF" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
