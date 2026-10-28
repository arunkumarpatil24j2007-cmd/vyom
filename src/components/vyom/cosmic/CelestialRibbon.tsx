import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createRibbonGeometry } from './geometry/createRibbonGeometry';
import { createCelestialRibbonShaderMaterial } from './materials/RibbonMaterial';

export const CelestialRibbon: React.FC = () => {
  // Ribbon 1: Upper-left sweeping outer glass loop
  const ribbon1Geo = useMemo(() => {
    const points = [
      new THREE.Vector3(-2.2, -0.1, 0.45),
      new THREE.Vector3(-1.95, 0.95, 0.52),
      new THREE.Vector3(-1.25, 1.82, 0.42),
      new THREE.Vector3(-0.05, 2.05, 0.28),
      new THREE.Vector3(1.25, 1.78, 0.12),
      new THREE.Vector3(2.1, 1.15, -0.12),
    ];
    const widths = [0.35, 0.68, 0.82, 0.74, 0.55, 0.32];
    const twists = [0.2, 0.12, -0.08, -0.18, -0.12, 0.08];
    return createRibbonGeometry(points, widths, 180, twists);
  }, []);

  // Ribbon 2: Lower-right sweeping glass loop enclosing Mars
  const ribbon2Geo = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.65, -1.05, 0.52),
      new THREE.Vector3(-0.7, -1.68, 0.48),
      new THREE.Vector3(0.68, -1.58, 0.42),
      new THREE.Vector3(1.85, -1.18, 0.32),
      new THREE.Vector3(2.45, -0.28, 0.18),
      new THREE.Vector3(2.35, 0.68, -0.02),
    ];
    const widths = [0.35, 0.66, 0.8, 0.72, 0.52, 0.28];
    const twists = [-0.12, -0.18, -0.08, 0.12, 0.18, 0.08];
    return createRibbonGeometry(points, widths, 180, twists);
  }, []);

  // Ribbon 3: Warm golden-amber inner swirl in upper-left
  const ribbon3Geo = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.75, 0.35, 0.45),
      new THREE.Vector3(-1.35, 1.25, 0.48),
      new THREE.Vector3(-0.45, 1.62, 0.38),
      new THREE.Vector3(0.55, 1.48, 0.25),
    ];
    const widths = [0.24, 0.48, 0.42, 0.22];
    return createRibbonGeometry(points, widths, 120);
  }, []);

  // Ribbon 4: Translucent glass diagonal arc across lower center
  const ribbon4Geo = useMemo(() => {
    const points = [
      new THREE.Vector3(-1.55, 0.55, 0.5),
      new THREE.Vector3(-0.95, -0.25, 0.55),
      new THREE.Vector3(0.15, -0.75, 0.5),
      new THREE.Vector3(1.25, -0.65, 0.42),
      new THREE.Vector3(1.95, -0.15, 0.32),
    ];
    const widths = [0.22, 0.44, 0.48, 0.4, 0.24];
    return createRibbonGeometry(points, widths, 140);
  }, []);

  // Materials with tuned colors matching Reference B
  const matCrystalGlass = useMemo(
    () =>
      createCelestialRibbonShaderMaterial({
        rimColor: '#FFE099',
        bodyColor: '#3A5C9E',
        baseOpacity: 0.64,
      }),
    []
  );

  const matGoldenAmber = useMemo(
    () =>
      createCelestialRibbonShaderMaterial({
        rimColor: '#FFB84D',
        bodyColor: '#C47A22',
        baseOpacity: 0.58,
      }),
    []
  );

  const matInnerArc = useMemo(
    () =>
      createCelestialRibbonShaderMaterial({
        rimColor: '#FFF2C4',
        bodyColor: '#25447A',
        baseOpacity: 0.48,
      }),
    []
  );

  return (
    <group name="celestial-ribbons-group">
      {/* 1. Upper-Left Outer Glass Loop */}
      <mesh geometry={ribbon1Geo} material={matCrystalGlass} renderOrder={10} />

      {/* 2. Lower-Right Outer Glass Loop */}
      <mesh geometry={ribbon2Geo} material={matCrystalGlass} renderOrder={11} />

      {/* 3. Warm Amber Fluid Swirl */}
      <mesh geometry={ribbon3Geo} material={matGoldenAmber} renderOrder={12} />

      {/* 4. Translucent Glass Diagonal Arc */}
      <mesh geometry={ribbon4Geo} material={matInnerArc} renderOrder={13} />
    </group>
  );
};

export default CelestialRibbon;
