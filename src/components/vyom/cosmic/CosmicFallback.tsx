import React from 'react';

export const CosmicFallback: React.FC = () => {
  return (
    <div
      className="w-full h-full relative rounded-[38px] overflow-hidden flex items-center justify-center bg-[#07102B]"
      aria-label="Cosmic scene static fallback"
    >
      <img
        src="/assets/cosmic_hero_clean.png"
        alt="Vyom Cosmic Astrological System"
        className="w-full h-full object-contain pointer-events-none select-none"
        loading="eager"
      />
    </div>
  );
};

export default CosmicFallback;
