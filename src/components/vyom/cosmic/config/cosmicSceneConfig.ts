export const cosmicSceneConfig = {
  camera: {
    fov: 42,
    near: 0.1,
    far: 50,
    initialPosition: [0, 0, 6.2] as [number, number, number],
    lookAt: [0.12, 0.02, 0] as [number, number, number],
  },

  parallax: {
    maxTiltX: 0.08, // radians
    maxTiltY: 0.08,
    damping: 0.065,
    cameraShiftX: 0.25,
    cameraShiftY: 0.2,
  },

  renderer: {
    dpr: [1, 2] as [number, number],
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance' as const,
  },
};
