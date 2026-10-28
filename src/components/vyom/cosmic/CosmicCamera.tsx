import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { cosmicSceneConfig } from './config/cosmicSceneConfig';

export const CosmicCamera: React.FC = () => {
  const { camera, size } = useThree();
  const initialLookAt = useRef(new THREE.Vector3(...cosmicSceneConfig.camera.lookAt));

  useEffect(() => {
    // Configure perspective camera parameters
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cosmicSceneConfig.camera.fov;
      camera.near = cosmicSceneConfig.camera.near;
      camera.far = cosmicSceneConfig.camera.far;

      // Adjust camera distance if the aspect ratio changes on smaller screens
      const aspect = size.width / Math.max(size.height, 1);
      let camZ = cosmicSceneConfig.camera.initialPosition[2];

      if (aspect < 1.0) {
        // Portrait or narrow container: zoom out slightly so the full composition fits
        camZ = 6.2 * (1.1 / aspect);
      } else if (aspect < 1.25) {
        camZ = 6.6;
      } else {
        camZ = 6.2;
      }

      camera.position.set(
        cosmicSceneConfig.camera.initialPosition[0],
        cosmicSceneConfig.camera.initialPosition[1],
        camZ
      );

      camera.lookAt(initialLookAt.current);
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  return null;
};

export default CosmicCamera;
