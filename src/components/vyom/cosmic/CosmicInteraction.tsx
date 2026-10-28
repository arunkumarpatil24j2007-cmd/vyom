import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { cosmicSceneConfig } from './config/cosmicSceneConfig';
import { damp } from './utils/animation';

interface CosmicInteractionProps {
  sceneGroupRef: React.RefObject<THREE.Group | null>;
}

export const CosmicInteraction: React.FC<CosmicInteractionProps> = ({ sceneGroupRef }) => {
  const { camera, gl } = useThree();

  const mouseTarget = useRef({ x: 0, y: 0, isHovering: false });
  const currentRotation = useRef({ x: 0, y: 0 });
  const initialCamPos = useRef(new THREE.Vector3(...cosmicSceneConfig.camera.initialPosition));

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Normalized coordinates: -1 to +1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseTarget.current.x = Math.max(-1, Math.min(1, nx));
      mouseTarget.current.y = Math.max(-1, Math.min(1, ny));
      mouseTarget.current.isHovering = true;
    };

    const onPointerLeave = () => {
      mouseTarget.current.x = 0;
      mouseTarget.current.y = 0;
      mouseTarget.current.isHovering = false;
    };

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointercancel', onPointerLeave, { passive: true });

    return () => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
    };
  }, [gl]);

  // Silky smooth damping per frame
  useFrame((_, delta) => {
    const { maxTiltX, maxTiltY, damping, cameraShiftX, cameraShiftY } = cosmicSceneConfig.parallax;
    const targetX = mouseTarget.current.y * maxTiltX;
    const targetY = mouseTarget.current.x * maxTiltY;

    currentRotation.current.x = damp(currentRotation.current.x, targetX, damping * 60, delta);
    currentRotation.current.y = damp(currentRotation.current.y, targetY, damping * 60, delta);

    // Apply gentle rotation to master scene group
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.x = currentRotation.current.x;
      sceneGroupRef.current.rotation.y = currentRotation.current.y;
    }

    // Subtle camera parallax shift
    const targetCamX = initialCamPos.current.x + mouseTarget.current.x * cameraShiftX;
    const targetCamY = initialCamPos.current.y + mouseTarget.current.y * cameraShiftY;

    camera.position.x = damp(camera.position.x, targetCamX, damping * 60, delta);
    camera.position.y = damp(camera.position.y, targetCamY, damping * 60, delta);
  });

  return null;
};

export default CosmicInteraction;
