export interface CosmicObjectConfig {
  position: [number, number, number];
  scale: number;
  rotationSpeed?: number;
  tilt?: [number, number, number];
  radius?: number;
}

export const cosmicObjects = {
  centralZodiac: {
    position: [0.18, 0.04, 0] as [number, number, number],
    scale: 1,
    radius: 1.22,
    rotationSpeed: 0.012, // continuous, majestic astrological rotation
  },

  ringedPlanet: {
    position: [1.98, 1.25, -0.1] as [number, number, number],
    scale: 0.65,
    radius: 0.65,
    ringInner: 0.82,
    ringOuter: 1.58,
    tilt: [-0.45, 0.22, -0.52] as [number, number, number],
    rotationSpeed: 0.02,
  },

  bluePlanet: {
    position: [-1.88, -1.02, 0.35] as [number, number, number],
    scale: 0.62,
    radius: 0.62,
    rotationSpeed: 0.015,
  },

  redPlanet: {
    position: [1.88, -0.58, 0.3] as [number, number, number],
    scale: 0.48,
    radius: 0.48,
    rotationSpeed: 0.018,
  },

  smallPlanets: [
    {
      id: 'gold-bead-top-spoke',
      type: 'gold',
      position: [0.18, 1.82, 0.05] as [number, number, number],
      radius: 0.12,
    },
    {
      id: 'orange-bead-upper-left',
      type: 'red',
      position: [-0.92, 1.48, 0.15] as [number, number, number],
      radius: 0.14,
    },
    {
      id: 'gold-bead-mid-top-left',
      type: 'gold',
      position: [-0.68, 1.05, 0.22] as [number, number, number],
      radius: 0.09,
    },
    {
      id: 'gold-bead-left',
      type: 'gold',
      position: [-1.48, 0.38, 0.18] as [number, number, number],
      radius: 0.11,
    },
    {
      id: 'gold-bead-lower-left',
      type: 'gold',
      position: [-1.02, -0.28, 0.28] as [number, number, number],
      radius: 0.12,
    },
    {
      id: 'neutral-moon-bottom',
      type: 'neutral',
      position: [-0.45, -1.52, 0.1] as [number, number, number],
      radius: 0.12,
    },
    {
      id: 'gold-bead-mars-orbit',
      type: 'gold',
      position: [1.48, -0.88, 0.35] as [number, number, number],
      radius: 0.13,
    },
    {
      id: 'neutral-planet-far-right',
      type: 'neutral',
      position: [2.45, 0.68, -0.25] as [number, number, number],
      radius: 0.13,
    },
  ],

  orbitalRings: [
    {
      id: 'orbit-inner-1',
      radiusX: 1.55,
      radiusY: 1.42,
      rotation: [0.15, -0.1, 0.12] as [number, number, number],
      center: [0.18, 0.04, 0] as [number, number, number],
      tubeRadius: 0.007,
      color: '#FFB834',
    },
    {
      id: 'orbit-inner-2',
      radiusX: 1.78,
      radiusY: 1.62,
      rotation: [-0.18, 0.12, -0.15] as [number, number, number],
      center: [0.18, 0.04, 0] as [number, number, number],
      tubeRadius: 0.006,
      color: '#FFC850',
    },
    {
      id: 'orbit-mid-saturn',
      radiusX: 2.45,
      radiusY: 1.95,
      rotation: [0.25, 0.08, -0.22] as [number, number, number],
      center: [0.18, 0.04, -0.05] as [number, number, number],
      tubeRadius: 0.008,
      color: '#FFC040',
    },
    {
      id: 'orbit-outer-mars',
      radiusX: 2.85,
      radiusY: 2.25,
      rotation: [-0.22, -0.15, 0.3] as [number, number, number],
      center: [0.18, 0.04, 0.05] as [number, number, number],
      tubeRadius: 0.007,
      color: '#FFAE25',
    },
  ],
};
