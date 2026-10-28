import React from 'react';
import OrbitalPaths from './OrbitalPaths';
import Planet from './Planet';
import { cosmicObjects } from './config/cosmicObjects';

export const OrbitalSystem: React.FC = () => {
  const smallPlanets = cosmicObjects.smallPlanets;

  return (
    <group name="orbital-system-group">
      {/* 3D Gold Orbit Paths */}
      <OrbitalPaths />

      {/* Small Planetary Beads & Moon Spheres along orbits */}
      {smallPlanets.map((p) => (
        <Planet
          key={p.id}
          type={p.type as 'gold' | 'neutral'}
          position={p.position}
          radius={p.radius}
          rotationSpeed={0.03}
          name={p.id}
        />
      ))}
    </group>
  );
};

export default OrbitalSystem;
