import React, { useMemo } from 'react';

interface StarfieldLayerProps {
  className?: string;
}

export default function StarfieldLayer({ className = '' }: StarfieldLayerProps) {
  // Deterministic seed for stars to avoid hydration mismatch
  const stars = useMemo(() => {
    return [
      { x: 12, y: 15, size: 1.5, opacity: 0.7, color: '#FFFFFF', delay: 0 },
      { x: 28, y: 35, size: 2.2, opacity: 0.9, color: '#FFE082', delay: 1.2 },
      { x: 45, y: 12, size: 1.2, opacity: 0.6, color: '#FFFFFF', delay: 2.5 },
      { x: 72, y: 22, size: 2.8, opacity: 0.95, color: '#FFF8E1', delay: 0.8 },
      { x: 88, y: 18, size: 1.4, opacity: 0.7, color: '#80D8FF', delay: 3.1 },
      { x: 62, y: 48, size: 1.8, opacity: 0.75, color: '#FFFFFF', delay: 1.7 },
      { x: 82, y: 65, size: 2.0, opacity: 0.85, color: '#FFE57F', delay: 2.2 },
      { x: 92, y: 45, size: 1.5, opacity: 0.8, color: '#FFFFFF', delay: 0.4 },
      { x: 20, y: 78, size: 2.4, opacity: 0.9, color: '#FFF9C4', delay: 2.9 },
      { x: 38, y: 88, size: 1.3, opacity: 0.6, color: '#FFFFFF', delay: 1.1 },
      { x: 55, y: 82, size: 2.0, opacity: 0.8, color: '#FFE082', delay: 3.5 },
      { x: 78, y: 92, size: 1.6, opacity: 0.7, color: '#FFFFFF', delay: 0.6 },
      { x: 15, y: 52, size: 1.2, opacity: 0.5, color: '#B3E5FC', delay: 2.0 },
      { x: 52, y: 28, size: 3.2, opacity: 1, color: '#FFFFFF', delay: 1.5, isCross: true },
      { x: 85, y: 78, size: 2.6, opacity: 0.95, color: '#FFE57F', delay: 2.8, isCross: true },
    ];
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ transform: 'translateZ(-40px)' }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
            animation: `pulseWarm ${3 + (i % 4)}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          {s.isCross && (
            <div
              className="absolute -inset-1 pointer-events-none opacity-80"
              style={{
                background: `radial-gradient(circle, ${s.color} 20%, transparent 80%)`,
                filter: 'drop-shadow(0 0 3px #FFE082)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
