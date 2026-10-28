import React from 'react';

interface KlarGlassMorphProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function KlarGlassMorph({ className = '', style }: KlarGlassMorphProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* ── Main Liquid Glass Primary Shell (wrapping the right & bottom-right cosmos) ── */}
      <div
        className="absolute"
        style={{
          top: '20px',
          right: '-25px',
          width: '560px',
          height: '490px',
          borderRadius: '52% 48% 62% 38% / 46% 54% 46% 54%',
          transform: 'rotate(-16deg) translateZ(120px)',
          background: `
            radial-gradient(ellipse at 75% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 215, 140, 0.08) 35%, rgba(255, 140, 40, 0.03) 65%, transparent 85%),
            linear-gradient(135deg, rgba(255, 240, 200, 0.14) 0%, rgba(255, 180, 70, 0.05) 45%, rgba(10, 20, 50, 0.12) 100%)
          `,
          backdropFilter: 'blur(7px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(7px) saturate(1.3)',
          border: '1.5px solid rgba(255, 240, 200, 0.35)',
          boxShadow: `
            inset 2px 2px 6px 0px rgba(255, 255, 255, 0.5),
            inset -2px -2px 8px 0px rgba(255, 150, 30, 0.3),
            0 16px 40px -10px rgba(0, 0, 0, 0.35),
            0 0 35px rgba(255, 180, 60, 0.15)
          `,
        }}
      >
        {/* Upper Specular Glass Caustic Edge */}
        <div
          className="absolute top-2 left-16 right-16 h-8 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.65) 40%, rgba(255, 230, 160, 0.8) 60%, transparent 100%)',
            filter: 'blur(2px)',
            transform: 'rotate(-4deg)',
          }}
        />

        {/* Lower Amber Refraction Glow */}
        <div
          className="absolute bottom-6 right-12 w-48 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 150, 40, 0.2) 0%, rgba(255, 100, 20, 0.08) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* ── Secondary Elongated Glass Droplet Bubble (Upper-Left Loop) ── */}
      <div
        className="absolute"
        style={{
          top: '35px',
          left: '10px',
          width: '240px',
          height: '380px',
          borderRadius: '45% 55% 50% 50% / 60% 40% 60% 40%',
          transform: 'rotate(-32deg) translateZ(135px)',
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 210, 120, 0.09) 40%, transparent 80%),
            linear-gradient(160deg, rgba(255, 245, 220, 0.16) 0%, rgba(255, 160, 40, 0.04) 50%, rgba(0, 0, 0, 0.08) 100%)
          `,
          backdropFilter: 'blur(6px) saturate(1.25)',
          WebkitBackdropFilter: 'blur(6px) saturate(1.25)',
          border: '1.4px solid rgba(255, 245, 210, 0.38)',
          boxShadow: `
            inset 1.5px 1.5px 5px rgba(255, 255, 255, 0.6),
            inset -1.5px -1.5px 6px rgba(255, 140, 30, 0.25),
            0 12px 30px rgba(0, 0, 0, 0.25)
          `,
        }}
      >
        {/* Specular crest on the upper-left droplet */}
        <div
          className="absolute top-4 left-6 w-24 h-6 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.75) 50%, transparent 100%)',
            filter: 'blur(1.5px)',
            transform: 'rotate(-20deg)',
          }}
        />
      </div>

      {/* ── Tertiary Floating Glass Micro-Orb (Depth accent) ── */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: '120px',
          left: '120px',
          width: '42px',
          height: '42px',
          transform: 'translateZ(145px)',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 200, 100, 0.15) 50%, rgba(0, 0, 0, 0.1) 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: 'inset 1px 1px 3px rgba(255, 255, 255, 0.7), 0 4px 12px rgba(0, 0, 0, 0.25)',
        }}
      />
    </div>
  );
}
