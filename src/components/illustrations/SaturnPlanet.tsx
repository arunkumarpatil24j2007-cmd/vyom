import React from 'react';

interface SaturnPlanetProps {
  size?: number;
  className?: string;
  tilt?: number;
}

export default function SaturnPlanet({ size = 110, className = '', tilt = -28 }: SaturnPlanetProps) {
  // Dimensions proportional to size
  const ringWidth = size * 2.1;
  const ringHeight = size * 0.58;

  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: ringWidth,
        height: size * 1.3,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotate(${tilt}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── 1. Rear Half of Rings (passes BEHIND the planet body in 3D) ── */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            width: ringWidth,
            height: ringHeight,
            borderRadius: '50%',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)', // top half only
            background: `
              radial-gradient(ellipse at center,
                transparent 52%,
                rgba(215, 175, 120, 0.45) 54%,
                rgba(235, 195, 135, 0.85) 60%,
                rgba(195, 155, 100, 0.9) 66%,
                rgba(80, 55, 30, 0.95) 68%, /* Cassini division */
                rgba(225, 185, 125, 0.95) 71%,
                rgba(240, 205, 145, 0.8) 82%,
                rgba(180, 140, 90, 0.4) 88%,
                transparent 92%
              )
            `,
            filter: 'drop-shadow(0 0 4px rgba(220, 180, 120, 0.3))',
            transform: 'translateZ(-5px)',
          }}
        />

        {/* ── 2. The Spherical Saturn Planet Body ── */}
        <div
          className="relative rounded-full overflow-hidden shadow-2xl z-10"
          style={{
            width: size,
            height: size,
            background: `
              radial-gradient(circle at 35% 30%,
                #F8E0B5 0%,
                #E2BC84 25%,
                #C4985A 50%,
                #986E38 75%,
                #4E3314 100%
              )
            `,
            boxShadow: `
              inset -10px -10px 25px rgba(25, 14, 5, 0.9),
              inset 10px 10px 20px rgba(255, 235, 190, 0.6),
              0 10px 25px rgba(0, 0, 0, 0.6)
            `,
          }}
        >
          {/* Atmospheric Cloud Belts / Banding */}
          <div
            className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 6px,
                rgba(140, 95, 45, 0.35) 6px,
                rgba(140, 95, 45, 0.35) 12px,
                transparent 12px,
                transparent 18px,
                rgba(80, 45, 15, 0.4) 18px,
                rgba(80, 45, 15, 0.4) 22px
              )`,
            }}
          />

          {/* Ring Shadow Cast Across Planet Body */}
          <div
            className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 opacity-75 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 10, 2, 0.85) 0%, rgba(20, 10, 2, 0.2) 100%)',
              filter: 'blur(1px)',
              transform: 'rotate(-4deg)',
            }}
          />

          {/* Specular Limb Glow */}
          <div
            className="absolute top-2 left-4 w-12 h-8 rounded-full -rotate-20 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, transparent 80%)',
              filter: 'blur(3px)',
            }}
          />
        </div>

        {/* ── 3. Front Half of Rings (passes IN FRONT of the planet body) ── */}
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            width: ringWidth,
            height: ringHeight,
            borderRadius: '50%',
            clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)', // bottom half only
            background: `
              radial-gradient(ellipse at center,
                transparent 52%,
                rgba(215, 175, 120, 0.45) 54%,
                rgba(235, 195, 135, 0.85) 60%,
                rgba(195, 155, 100, 0.9) 66%,
                rgba(80, 55, 30, 0.95) 68%, /* Cassini division */
                rgba(225, 185, 125, 0.95) 71%,
                rgba(240, 205, 145, 0.8) 82%,
                rgba(180, 140, 90, 0.4) 88%,
                transparent 92%
              )
            `,
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))',
            transform: 'translateZ(10px)',
          }}
        />
      </div>
    </div>
  );
}
