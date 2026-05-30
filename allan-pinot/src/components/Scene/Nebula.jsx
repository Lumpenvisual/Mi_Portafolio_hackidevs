import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from './config.js';

/*
  Nebula.jsx — the soft purple/blue "fog of colour" behind the stars.

  Two large additive radial-gradient planes painted onto offscreen 2D canvases
  (procedural -> no external image assets, keeping the project self-contained).
  They sit far back, never write depth, ignore fog, and slowly counter-rotate.

  Kept FAINT (opacity 0.16, muted tints): the prototype proved that bright /
  large nebula planes wash the whole frame purple and kill the hero text
  contrast. This is the dense-but-dark look from agent memory.

  Disposal: textures + materials are created imperatively, so we dispose them
  in a useEffect cleanup to avoid GPU leaks across hot-reloads / unmounts.
*/

function makeNebulaTexture(hexColor) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0.0, hexColor);
  g.addColorStop(0.35, hexColor);
  g.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// The two backdrop clouds: purple upper-left, blue lower-right -> a colour
// gradient across the frame.
const PLANES = [
  { color: CONFIG.NEBULA_PURPLE, pos: [-8, 6, -20], scale: 1.0, rot: 0.4, spin: 0.01 },
  { color: CONFIG.NEBULA_BLUE, pos: [9, -6, -22], scale: 1.1, rot: -0.6, spin: -0.008 },
];

export default function Nebula({ reducedMotion = false }) {
  const groupRef = useRef();

  // Build the materials once. One shared PlaneGeometry across both meshes.
  const { geometry, materials } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(34, 34);
    const materials = PLANES.map((p) => {
      const tex = makeNebulaTexture(p.color);
      return new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false, // always behind; never occludes stars
        opacity: CONFIG.NEBULA_OPACITY,
        fog: false,
        toneMapped: false,
      });
    });
    return { geometry, materials };
  }, []);

  // Dispose geometry, textures, and materials on unmount.
  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    };
  }, [geometry, materials]);

  // Slow counter-rotation for a living backdrop (skipped under reduced motion).
  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    const [a, b] = groupRef.current.children;
    if (a) a.rotation.z += PLANES[0].spin * delta;
    if (b) b.rotation.z += PLANES[1].spin * delta;
  });

  return (
    <group ref={groupRef}>
      {PLANES.map((p, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={materials[i]}
          position={p.pos}
          scale={p.scale}
          rotation={[0, 0, p.rot]}
          renderOrder={-1} // draw before the stars
        />
      ))}
    </group>
  );
}
