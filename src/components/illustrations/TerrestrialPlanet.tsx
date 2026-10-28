import React from 'react';

interface TerrestrialPlanetProps {
  type: 'blue' | 'red';
  size?: number;
  className?: string;
}

export default function TerrestrialPlanet({ type, size = 80, className = '' }: TerrestrialPlanetProps) {
  const isBlue = type === 'blue';

  return (
    <div
      className={`relative rounded-full select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Atmospheric Haze */}
      <div
        className="absolute -inset-2 rounded-full pointer-events-none"
        style={{
          background: isBlue
            ? 'radial-gradient(circle, rgba(74, 144, 226, 0.4) 0%, rgba(26, 59, 139, 0.2) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255, 75, 25, 0.45) 0%, rgba(227, 38, 54, 0.2) 60%, transparent 80%)',
          filter: 'blur(8px)',
          transform: 'translateZ(-5px)',
        }}
      />

      {/* 3D Planet Body */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
        style={{
          background: isBlue
            ? `radial-gradient(circle at 35% 30%, #8CC5FF 0%, #3D82E0 25%, #184A9E 55%, #0B255E 80%, #030B1E 100%)`
            : `radial-gradient(circle at 35% 30%, #FFA270 0%, #FF5A25 30%, #C92608 60%, #7A1200 85%, #350500 100%)`,
          boxShadow: isBlue
            ? `
              inset -8px -8px 20px rgba(0, 5, 25, 0.95),
              inset 8px 8px 18px rgba(180, 220, 255, 0.6),
              0 8px 25px rgba(0, 0, 0, 0.7)
            `
            : `
              inset -8px -8px 20px rgba(40, 5, 0, 0.95),
              inset 8px 8px 18px rgba(255, 200, 160, 0.6),
              0 8px 25px rgba(0, 0, 0, 0.7)
            `,
        }}
      >
        {/* Surface Contours & Cloud Bands */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: isBlue
              ? `
                radial-gradient(ellipse at 40% 40%, rgba(255, 255, 255, 0.7) 0%, transparent 40%),
                repeating-linear-gradient(25deg, transparent, transparent 8px, rgba(255, 255, 255, 0.4) 8px, rgba(255, 255, 255, 0.4) 14px)
              `
              : `
                radial-gradient(circle at 60% 50%, rgba(0, 0, 0, 0.6) 0%, transparent 35%),
                radial-gradient(circle at 30% 70%, rgba(0, 0, 0, 0.5) 0%, transparent 40%),
                repeating-linear-gradient(-15deg, transparent, transparent 10px, rgba(120, 20, 0, 0.5) 10px, rgba(120, 20, 0, 0.5) 18px)
              `,
          }}
        />

        {/* Crescent Limb Highlight */}
        <div
          className="absolute top-1.5 left-2 w-8 h-6 rounded-full -rotate-25 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.65) 0%, transparent 80%)',
            filter: 'blur(2px)',
          }}
        />
      </div>
    </div>
  );
}
