import React from 'react';
import CosmicCanvas from '@/components/vyom/cosmic/CosmicCanvas';

interface CosmicHeroSceneProps {
  className?: string;
}

export default function CosmicHeroScene({ className = '' }: CosmicHeroSceneProps) {
  return <CosmicCanvas className={className} />;
}
