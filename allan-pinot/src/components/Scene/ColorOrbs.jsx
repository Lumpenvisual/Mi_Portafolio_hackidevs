import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from './config.js';

/*
  ColorOrbs.jsx — 3 soft glowing "suns" that carry the scene's saturated colour.

  Sprites (camera-facing quads) with a procedural radial texture: hot white-ish
  core -> coloured mid -> transparent edge, blended additively so they bloom
  strongly. The stars stay white; these orbs are the coloured light sources.
  Each floats gently around its base position (Lissajous drift).

  Sprites are cheap (always round, always face camera) and few (3), so this is
  far lighter than instancing would be here.
*/

function makeOrbTexture(hexColor) {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0.0, '#ffffff');
  g.addColorStop(0.15, hexColor);
  g.addColorStop(0.5, hexColor);
  g.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Brighter saturated tints (these are the colour sources).
const ORBS = [
  { color: '#7a4cff', base: [-7, 3.5, -9], scale: 2.8 },
  { color: '#2f6bff', base: [8, -3, -11], scale: 3.2 },
  { color: '#9a6cff', base: [2, 6, -13], scale: 2.2 },
];

export default function ColorOrbs({ reducedMotion = false }) {
  const spritesRef = useRef([]);

  // Build one SpriteMaterial per orb (each owns its tinted texture). Phases are
  // randomized so the orbs don't drift in lockstep.
  const { materials, phases } = useMemo(() => {
    const materials = ORBS.map((o) => {
      const tex = makeOrbTexture(o.color);
      return new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        opacity: CONFIG.ORB_GLOW_STRENGTH,
        fog: false,
        toneMapped: false,
      });
    });
    const phases = ORBS.map(() => Math.random() * Math.PI * 2);
    return { materials, phases };
  }, []);

  useEffect(() => {
    return () => {
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    };
  }, [materials]);

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    spritesRef.current.forEach((sprite, i) => {
      if (!sprite) return;
      const [bx, by] = ORBS[i].base;
      sprite.position.x = bx + Math.sin(t * 0.25 + phases[i]) * 0.6;
      sprite.position.y = by + Math.cos(t * 0.2 + phases[i]) * 0.5;
    });
  });

  return (
    <>
      {ORBS.map((o, i) => (
        <sprite
          key={i}
          ref={(el) => (spritesRef.current[i] = el)}
          material={materials[i]}
          position={o.base}
          scale={o.scale}
        />
      ))}
    </>
  );
}
