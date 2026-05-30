import { useMemo, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CONFIG } from './config.js';

/*
  Particles.jsx — the dense, compact star cloud, migrated from the Phase 1
  standalone prototype to React Three Fiber.

  Key R3F translations of the vanilla prototype:
    - The single THREE.Points / BufferGeometry / ShaderMaterial draw call
      becomes a declarative <points> with a <bufferGeometry> child and our
      extended <particlesMaterial>.
    - Geometry attributes are built ONCE in useMemo (keyed on count) — they are
      pure data and must not be recomputed every render; recomputing would
      reallocate large Float32Arrays and re-upload to the GPU each frame.
    - Animation runs in useFrame (R3F's rAF-driven loop) instead of a manual
      requestAnimationFrame, so it's tied to the renderer's frameloop and pauses
      when the tab is hidden.
    - Direct mutation of the <points> transform happens through a useRef, never
      through React state — state changes would re-render React every frame.
*/

// ---------------------------------------------------------------------------
// Custom ShaderMaterial via drei's shaderMaterial() helper. It generates a
// THREE.ShaderMaterial subclass whose uniforms become settable props, and we
// register it with extend() so it is usable as <particlesMaterial /> in JSX.
//
// The shaders are copied verbatim from the verified prototype: a circular,
// additive-blended point with a wide soft halo + tight bright core, plus
// linear fog fed in as uniforms (THREE doesn't auto-apply scene.fog to raw
// ShaderMaterial, so we pass fog params ourselves — same as the prototype).
// ---------------------------------------------------------------------------
const ParticlesMaterial = shaderMaterial(
  {
    uSize: CONFIG.PARTICLE_SIZE,
    uFogColor: new THREE.Color(CONFIG.BACKGROUND),
    uFogNear: CONFIG.FOG_NEAR,
    uFogFar: CONFIG.FOG_FAR,
  },
  // vertex
  /* glsl */ `
    attribute vec3 aColor;
    attribute float aSize;

    varying vec3 vColor;
    varying float vFogDepth;

    uniform float uSize;

    void main() {
      vColor = aColor;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // Perspective size attenuation: closer points render larger.
      gl_PointSize = uSize * aSize * (1.0 / -mvPosition.z);
      vFogDepth = -mvPosition.z;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // fragment
  /* glsl */ `
    precision mediump float;

    varying vec3 vColor;
    varying float vFogDepth;

    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    void main() {
      // Round the square point sprite; discard the corners.
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;

      // Wide soft halo + tight bright core. Additive blending stacks
      // overlapping sprites into bright cores that bloom amplifies.
      float halo = smoothstep(0.5, 0.0, d);
      float core = pow(halo, 3.0);
      float intensity = core + halo * 0.4;

      // Linear fog: distant particles fade into the background.
      float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
      vec3 color = mix(vColor, uFogColor, fogFactor);

      gl_FragColor = vec4(color, intensity * (1.0 - fogFactor));
    }
  `
);

extend({ ParticlesMaterial });

export default function Particles({ reducedMotion = false }) {
  const pointsRef = useRef();
  const materialRef = useRef();

  // Eased mouse-tilt state. Kept in a ref (not state) because it updates every
  // frame and must never trigger a React re-render.
  const tilt = useRef({ x: 0, y: 0 });

  // -------------------------------------------------------------------------
  // Geometry attributes — built once. Uniform sphere sampling via inverse-CDF
  // (acos(2v-1)) avoids the pole-clustering of naive lat/long sampling. The
  // three packed attributes (position / aColor / aSize) feed one Points draw
  // call for all CONFIG.PARTICLE_COUNT points.
  // -------------------------------------------------------------------------
  const { positions, colors, sizes, count } = useMemo(() => {
    const count = CONFIG.PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const cA = new THREE.Color(CONFIG.COLOR_A);
    const cB = new THREE.Color(CONFIG.COLOR_B);
    const cC = new THREE.Color(CONFIG.COLOR_C);
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u; // azimuth
      const phi = Math.acos(2 * v - 1); // polar (uniform on sphere)
      const r =
        CONFIG.SPHERE_RADIUS +
        (Math.random() - 0.5) * 2 * CONFIG.RADIUS_JITTER;

      const sinPhi = Math.sin(phi);
      positions[i * 3 + 0] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Stars are near-white; ~30% forced to pure-white cores so the field
      // sparkles. The scene's saturated colour lives in the nebula + orbs.
      if (Math.random() < CONFIG.COLOR_WHITE_RATIO) {
        tmp.copy(cC);
      } else {
        tmp.copy(cA).lerp(cB, Math.random());
      }
      colors[i * 3 + 0] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;

      sizes[i] =
        1 - CONFIG.SIZE_VARIANCE + Math.random() * CONFIG.SIZE_VARIANCE * 2;
    }

    return { positions, colors, sizes, count };
  }, []);

  // -------------------------------------------------------------------------
  // Animation. delta is read first (R3F passes it pre-computed, so no
  // getDelta/getElapsedTime ordering trap like the vanilla prototype had).
  // When reducedMotion is on we skip the loop body entirely — the field stays
  // on its static head-on transform.
  // -------------------------------------------------------------------------
  useFrame((state, delta) => {
    if (reducedMotion) return;
    const p = pointsRef.current;
    if (!p) return;

    // Constant idle rotation, plus a slow X drift for life.
    p.rotation.y += CONFIG.AUTO_ROTATE_SPEED * delta;
    p.rotation.x += CONFIG.AUTO_ROTATE_SPEED * 0.4 * delta;

    // Ease the field's tilt toward the mouse target (damped, no jitter).
    // R3F exposes the normalized pointer in state.pointer (-1..1, y already up).
    const mx = state.pointer.x;
    const my = -state.pointer.y; // flip to match the prototype's screen-space y
    tilt.current.x += (my * CONFIG.MOUSE_INFLUENCE - tilt.current.x) * CONFIG.MOUSE_DAMPING;
    tilt.current.y += (mx * CONFIG.MOUSE_INFLUENCE - tilt.current.y) * CONFIG.MOUSE_DAMPING;
    p.rotation.x += tilt.current.x * delta;
    p.rotation.z = -tilt.current.y * 0.3;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      {/*
        frustumCulled is disabled: the field is centered at the origin and the
        camera orbits inside its bounding region, so default sphere-culling can
        wrongly cull the whole cloud during the camera breathing dolly.
      */}
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      {/*
        Additive blending + depthWrite:false so overlapping glows sum into
        bright cores and never occlude one another. transparent enables the
        per-fragment alpha falloff. toneMapped:false keeps the additive energy
        linear so bloom (in Scene.jsx) gets the raw bright cores to work with.
      */}
      <particlesMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        uSize={CONFIG.PARTICLE_SIZE}
      />
    </points>
  );
}
