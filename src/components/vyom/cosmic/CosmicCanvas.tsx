import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import CosmicScene from './CosmicScene';
import CosmicFallback from './CosmicFallback';
import { cosmicSceneConfig } from './config/cosmicSceneConfig';
import '@/styles/cosmic-scene.css';

interface CosmicCanvasProps {
  className?: string;
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({ className = '' }) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!hasWebGL || hasError) {
    return (
      <div className={`cosmic-canvas-container ${className}`}>
        <CosmicFallback />
      </div>
    );
  }

  return (
    <div
      className={`cosmic-canvas-container ${className}`}
      aria-label="Vyom 3D Interactive Cosmic Scene"
    >
      <div className="cosmic-canvas-viewport">
        <Canvas
          dpr={cosmicSceneConfig.renderer.dpr}
          gl={{
            antialias: cosmicSceneConfig.renderer.antialias,
            alpha: true,
            powerPreference: cosmicSceneConfig.renderer.powerPreference,
          }}
          camera={{
            fov: cosmicSceneConfig.camera.fov,
            near: cosmicSceneConfig.camera.near,
            far: cosmicSceneConfig.camera.far,
            position: cosmicSceneConfig.camera.initialPosition,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x050b1e, 1);
          }}
          onError={() => setHasError(true)}
        >
          <CosmicScene />
        </Canvas>
      </div>

      {/* Decorative luxury glass border matching Reference B */}
      <div className="cosmic-canvas-border" />
    </div>
  );
};

export default CosmicCanvas;
