import React, { useRef } from 'react';
import * as THREE from 'three';
import CosmicCamera from './CosmicCamera';
import CosmicLighting from './CosmicLighting';
import CosmicBackground from './CosmicBackground';
import StarField from './StarField';
import ZodiacCore from './ZodiacCore';
import RingedPlanet from './RingedPlanet';
import Planet from './Planet';
import OrbitalSystem from './OrbitalSystem';
import CelestialRibbon from './CelestialRibbon';
import CosmicInteraction from './CosmicInteraction';
import { cosmicObjects } from './config/cosmicObjects';

export const CosmicScene: React.FC = () => {
  const masterGroupRef = useRef<THREE.Group>(null);

  return (
    <>
      {/* Perspective Camera controller */}
      <CosmicCamera />

      {/* Cosmic Lighting system */}
      <CosmicLighting />

      {/* Pointer Parallax interaction controller */}
      <CosmicInteraction sceneGroupRef={masterGroupRef} />

      {/* Master 3D Astronomical Group */}
      <group ref={masterGroupRef} name="master-cosmic-system">
        {/* Deep Space Background plane */}
        <CosmicBackground />

        {/* Subtle twinkling background starfield */}
        <StarField count={220} />

        {/* 3D Gold Orbital Tracks & Small Planetary Node Beads */}
        <OrbitalSystem />

        {/* Central Golden Sun & Rotating Astrological Zodiac Wheel */}
        <ZodiacCore
          position={cosmicObjects.centralZodiac.position}
          radius={cosmicObjects.centralZodiac.radius}
          rotationSpeed={cosmicObjects.centralZodiac.rotationSpeed}
        />

        {/* Shani Graha: Ringed Planet (Saturn) at Upper-Right with 3D Rings */}
        <RingedPlanet
          position={cosmicObjects.ringedPlanet.position}
          radius={cosmicObjects.ringedPlanet.radius}
          ringInner={cosmicObjects.ringedPlanet.ringInner}
          ringOuter={cosmicObjects.ringedPlanet.ringOuter}
          tilt={cosmicObjects.ringedPlanet.tilt}
          rotationSpeed={cosmicObjects.ringedPlanet.rotationSpeed}
        />

        {/* Chandra / Oceanic Blue Planet at Lower-Left */}
        <Planet
          type="blue"
          position={cosmicObjects.bluePlanet.position}
          radius={cosmicObjects.bluePlanet.radius}
          rotationSpeed={cosmicObjects.bluePlanet.rotationSpeed}
          name="blue-planet-oceanic"
        />

        {/* Mangala: Red-Orange Planet at Lower-Right */}
        <Planet
          type="red"
          position={cosmicObjects.redPlanet.position}
          radius={cosmicObjects.redPlanet.radius}
          rotationSpeed={cosmicObjects.redPlanet.rotationSpeed}
          name="red-planet-mars"
        />

        {/* Translucent Curved Celestial Glass Ribbons */}
        <CelestialRibbon />
      </group>
    </>
  );
};

export default CosmicScene;
