import React from 'react';
import { cosmicMaterials } from './config/cosmicMaterials';

export const CosmicLighting: React.FC = () => {
  const { lighting } = cosmicMaterials;

  return (
    <group name="cosmic-lighting-system">
      {/* 1. Low-level ambient fill light in deep cosmic navy */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* 2. Hemisphere light: warm cosmic gold from above, deep navy from below */}
      <hemisphereLight
        color="#FFE5B5"
        groundColor="#081024"
        intensity={0.7}
      />

      {/* 3. Primary warm directional key light from upper-left */}
      <directionalLight
        color={lighting.directionalKeyColor}
        intensity={lighting.directionalKeyIntensity}
        position={[4, 6, 5]}
        castShadow={false}
      />

      {/* 4. Cool blue fill light for subtle planetary dark side rim illumination */}
      <directionalLight
        color={lighting.rimBlueColor}
        intensity={lighting.rimBlueIntensity}
        position={[-6, -4, 2]}
      />

      {/* 5. Warm accent light near the Saturn region */}
      <pointLight
        color="#FFCC80"
        intensity={1.2}
        distance={6}
        decay={2}
        position={[2.2, 1.5, 1.5]}
      />
    </group>
  );
};

export default CosmicLighting;
