import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Draws crisp, authentic vector astronomical glyphs on high-resolution canvas
 * Guarantees 100% warm gold coloring with ZERO OS emoji substitution.
 */
function drawVectorZodiacGlyph(ctx: CanvasRenderingContext2D, index: number, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = '#FFE89E';
  ctx.fillStyle = '#FFE89E';
  ctx.lineWidth = size * 0.095;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const s = size * 0.42;

  switch (index) {
    case 0: // Aries ♈ (Ram horns)
      ctx.beginPath();
      ctx.moveTo(-s * 0.9, -s * 0.3);
      ctx.bezierCurveTo(-s * 0.9, -s * 0.9, -s * 0.3, -s * 0.95, 0, -s * 0.4);
      ctx.lineTo(0, s * 0.95);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(s * 0.9, -s * 0.3);
      ctx.bezierCurveTo(s * 0.9, -s * 0.9, s * 0.3, -s * 0.95, 0, -s * 0.4);
      ctx.stroke();
      break;

    case 1: // Taurus ♉ (Bull horns & circle)
      // Horns
      ctx.beginPath();
      ctx.arc(0, -s * 0.45, s * 0.55, Math.PI * 0.15, Math.PI * 0.85, true);
      ctx.stroke();
      // Circle head
      ctx.beginPath();
      ctx.arc(0, s * 0.35, s * 0.48, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 2: // Gemini ♊ (Twin pillars)
      // Top curve
      ctx.beginPath();
      ctx.arc(0, -s * 0.75, s * 0.9, Math.PI * 0.3, Math.PI * 0.7);
      ctx.stroke();
      // Bottom curve
      ctx.beginPath();
      ctx.arc(0, s * 0.75, s * 0.9, Math.PI * 1.3, Math.PI * 1.7);
      ctx.stroke();
      // Two vertical pillars
      ctx.beginPath();
      ctx.moveTo(-s * 0.38, -s * 0.65);
      ctx.lineTo(-s * 0.38, s * 0.65);
      ctx.moveTo(s * 0.38, -s * 0.65);
      ctx.lineTo(s * 0.38, s * 0.65);
      ctx.stroke();
      break;

    case 3: // Cancer ♋ (Crab claws)
      // Top claw
      ctx.beginPath();
      ctx.arc(-s * 0.45, -s * 0.35, s * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.05, -s * 0.35, s * 0.65, Math.PI * 1.0, Math.PI * 1.95);
      ctx.stroke();
      // Bottom claw
      ctx.beginPath();
      ctx.arc(s * 0.45, s * 0.35, s * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-s * 0.05, s * 0.35, s * 0.65, 0, Math.PI * 0.95);
      ctx.stroke();
      break;

    case 4: // Leo ♌ (Lion head and tail)
      ctx.beginPath();
      ctx.arc(-s * 0.45, s * 0.35, s * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, s * 0.2);
      ctx.bezierCurveTo(0, -s * 0.8, s * 0.6, -s * 0.8, s * 0.5, 0);
      ctx.bezierCurveTo(s * 0.4, s * 0.7, s * 0.8, s * 0.95, s * 0.95, s * 0.6);
      ctx.stroke();
      break;

    case 5: // Virgo ♍ (Maiden)
      ctx.beginPath();
      // m shape
      ctx.moveTo(-s * 0.75, s * 0.65);
      ctx.lineTo(-s * 0.75, -s * 0.45);
      ctx.bezierCurveTo(-s * 0.75, -s * 0.85, -s * 0.35, -s * 0.85, -s * 0.35, -s * 0.45);
      ctx.lineTo(-s * 0.35, s * 0.65);
      ctx.moveTo(-s * 0.35, -s * 0.45);
      ctx.bezierCurveTo(-s * 0.35, -s * 0.85, s * 0.05, -s * 0.85, s * 0.05, -s * 0.45);
      ctx.lineTo(s * 0.05, s * 0.65);
      // Loop & cross
      ctx.moveTo(s * 0.05, -s * 0.2);
      ctx.bezierCurveTo(s * 0.5, -s * 0.6, s * 0.95, -s * 0.3, s * 0.75, s * 0.35);
      ctx.lineTo(s * 0.25, s * 0.9);
      ctx.stroke();
      break;

    case 6: // Libra ♎ (Scales)
      // Bottom line
      ctx.beginPath();
      ctx.moveTo(-s * 0.85, s * 0.6);
      ctx.lineTo(s * 0.85, s * 0.6);
      ctx.stroke();
      // Top line with arch
      ctx.beginPath();
      ctx.moveTo(-s * 0.85, s * 0.1);
      ctx.lineTo(-s * 0.38, s * 0.1);
      ctx.arc(0, s * 0.1, s * 0.38, Math.PI, 0, false);
      ctx.lineTo(s * 0.85, s * 0.1);
      ctx.stroke();
      break;

    case 7: // Scorpio ♏ (Scorpion with tail)
      ctx.beginPath();
      // m shape
      ctx.moveTo(-s * 0.75, s * 0.65);
      ctx.lineTo(-s * 0.75, -s * 0.45);
      ctx.bezierCurveTo(-s * 0.75, -s * 0.85, -s * 0.35, -s * 0.85, -s * 0.35, -s * 0.45);
      ctx.lineTo(-s * 0.35, s * 0.65);
      ctx.moveTo(-s * 0.35, -s * 0.45);
      ctx.bezierCurveTo(-s * 0.35, -s * 0.85, s * 0.05, -s * 0.85, s * 0.05, -s * 0.45);
      ctx.lineTo(s * 0.05, s * 0.65);
      // Tail curving right and up with arrow
      ctx.bezierCurveTo(s * 0.05, s * 0.95, s * 0.45, s * 0.95, s * 0.75, s * 0.6);
      ctx.lineTo(s * 0.85, s * 0.5);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(s * 0.55, s * 0.5);
      ctx.lineTo(s * 0.85, s * 0.5);
      ctx.lineTo(s * 0.85, s * 0.8);
      ctx.stroke();
      break;

    case 8: // Sagittarius ♐ (Archer arrow)
      ctx.beginPath();
      // Diagonal arrow shaft
      ctx.moveTo(-s * 0.75, s * 0.75);
      ctx.lineTo(s * 0.75, -s * 0.75);
      ctx.stroke();
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(s * 0.25, -s * 0.75);
      ctx.lineTo(s * 0.75, -s * 0.75);
      ctx.lineTo(s * 0.75, -s * 0.25);
      ctx.stroke();
      // Crossbar
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.05);
      ctx.lineTo(s * 0.05, s * 0.35);
      ctx.stroke();
      break;

    case 9: // Capricorn ♑ (Sea goat)
      ctx.beginPath();
      ctx.moveTo(-s * 0.7, -s * 0.7);
      ctx.lineTo(-s * 0.3, s * 0.5);
      ctx.lineTo(0.1, -s * 0.35);
      ctx.bezierCurveTo(s * 0.5, -s * 0.8, s * 0.9, -s * 0.3, s * 0.75, s * 0.25);
      ctx.bezierCurveTo(s * 0.6, s * 0.8, s * 0.15, s * 0.8, s * 0.35, s * 0.45);
      ctx.stroke();
      break;

    case 10: // Aquarius ♒ (Two waves)
      for (let w = 0; w < 2; w++) {
        const yOffset = w === 0 ? -s * 0.32 : s * 0.32;
        ctx.beginPath();
        ctx.moveTo(-s * 0.85, yOffset);
        ctx.lineTo(-s * 0.55, yOffset - s * 0.25);
        ctx.lineTo(-s * 0.25, yOffset + s * 0.25);
        ctx.lineTo(s * 0.05, yOffset - s * 0.25);
        ctx.lineTo(s * 0.35, yOffset + s * 0.25);
        ctx.lineTo(s * 0.65, yOffset - s * 0.25);
        ctx.lineTo(s * 0.85, yOffset);
        ctx.stroke();
      }
      break;

    case 11: // Pisces ♓ (Two fishes linked)
      // Left arc
      ctx.beginPath();
      ctx.arc(-s * 0.4, 0, s * 0.75, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      // Right arc
      ctx.beginPath();
      ctx.arc(s * 0.4, 0, s * 0.75, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();
      // Connecting bar
      ctx.beginPath();
      ctx.moveTo(-s * 0.85, 0);
      ctx.lineTo(s * 0.85, 0);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

/**
 * Creates a high-res CanvasTexture with the vector glyph in warm gold
 */
function createVectorGlyphTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);

    // Subtle soft outer glow
    ctx.shadowColor = 'rgba(255, 175, 40, 0.7)';
    ctx.shadowBlur = 10;

    // Draw authentic astronomical symbol
    drawVectorZodiacGlyph(ctx, index, 128, 128, 180);

    // Core crisp stroke overlay
    ctx.shadowBlur = 0;
    drawVectorZodiacGlyph(ctx, index, 128, 128, 180);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

interface ZodiacGlyphsProps {
  radius?: number;
  glyphSize?: number;
}

export const ZodiacGlyphs: React.FC<ZodiacGlyphsProps> = ({
  radius = 0.88,
  glyphSize = 0.2,
}) => {
  const glyphData = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      // 12 sectors around circle starting from top Aries
      const angle = (index * Math.PI * 2) / 12 - Math.PI / 2 + Math.PI / 12;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const texture = createVectorGlyphTexture(index);

      return {
        id: `glyph-${index}`,
        position: [x, y, 0.015] as [number, number, number],
        // Align rotation facing outward
        rotationZ: angle + Math.PI / 2,
        texture,
      };
    });
  }, [radius]);

  return (
    <group name="zodiac-glyphs-vector-group">
      {glyphData.map((item) => (
        <mesh
          key={item.id}
          position={item.position}
          rotation={[0, 0, item.rotationZ]}
        >
          <planeGeometry args={[glyphSize, glyphSize]} />
          <meshBasicMaterial
            map={item.texture}
            transparent={true}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ZodiacGlyphs;
