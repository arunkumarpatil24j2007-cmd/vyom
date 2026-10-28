import React from 'react';

interface CelestialSphereProps {
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function CelestialSphere({ size = 320, className = '', children }: CelestialSphereProps) {
  return (
    <div
      className={`relative rounded-full flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Solar Corona Glow (3D back layer) */}
      <div
        className="absolute -inset-10 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 154, 32, 0.45) 0%, rgba(255, 110, 20, 0.25) 45%, rgba(255, 75, 25, 0.08) 65%, transparent 75%)',
          filter: 'blur(20px)',
          transform: 'translateZ(-20px)',
        }}
      />

      {/* Secondary Pulse Corona */}
      <div
        className="absolute -inset-4 rounded-full pointer-events-none animate-pulse-warm"
        style={{
          background: 'radial-gradient(circle, rgba(255, 200, 75, 0.35) 20%, rgba(255, 120, 25, 0.15) 60%, transparent 80%)',
          filter: 'blur(12px)',
          transform: 'translateZ(-10px)',
        }}
      />

      {/* The 3D Golden Spherical Body */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden shadow-2xl flex items-center justify-center"
        style={{
          background: `
            radial-gradient(circle at 35% 30%, #FFF5D0 0%, #FFC94A 22%, #FF8A12 50%, #D84A00 78%, #781800 100%)
          `,
          boxShadow: `
            inset -15px -15px 40px rgba(70, 10, 0, 0.85),
            inset 15px 15px 35px rgba(255, 245, 200, 0.6),
            inset 0 0 20px rgba(255, 220, 120, 0.5),
            0 15px 45px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(255, 125, 20, 0.35)
          `,
        }}
      >
        {/* Subtle Solar Surface Granulation & Flare Texture */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px), radial-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
          }}
        />

        {/* Specular Glint Reflection */}
        <div
          className="absolute top-4 left-8 w-28 h-16 rounded-full -rotate-25 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 80%)',
            filter: 'blur(4px)',
          }}
        />

        {/* Slotted Child Content (e.g. Zodiac Wheel) */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
