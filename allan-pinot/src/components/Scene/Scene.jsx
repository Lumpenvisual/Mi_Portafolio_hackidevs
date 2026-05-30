import { Suspense, lazy, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useReducedMotion } from '../../hooks/useReducedMotion.js';
import * as THREE from 'three';
import Particles from './Particles.jsx';
import Nebula from './Nebula.jsx';
import ColorOrbs from './ColorOrbs.jsx';
import { CONFIG } from './config.js';
import { useTuning } from './useTuning.js';

/*
  Scene.jsx — assembles the full hero scene inside an R3F <Canvas>.

  Responsibilities:
    - Canvas setup: capped pixel ratio, ACES tone mapping, sRGB output, black
      clear color, frustum culling left ON globally (only the centered Particles
      opts out, for the reason documented in Particles.jsx).
    - Camera "breathing" dolly + mouse look-around (CameraRig).
    - Post-processing bloom (EffectComposer + Bloom) tuned to the prototype's
      subtle UnrealBloomPass values.
    - prefers-reduced-motion: when set, the animation loops short-circuit and we
      render a single static head-on frame (frameloop="demand").
    - A DEV-only leva tuning panel, loaded via a DEV-gated React.lazy so leva is
      fully absent from the production bundle (see useTuning.js / TuningPanel.jsx).

  This whole module is React.lazy-loaded by App.jsx, so none of three / drei /
  postprocessing is in the entry chunk — the HTML hero paints first.
*/

// DEV-only leva panel. The lazy() call AND its dynamic import() live inside the
// `import.meta.env.DEV` branch so that, in prod, the whole statement is dead
// code — Rolldown then drops the TuningPanel chunk and leva entirely. (Gating
// only the JSX render is not enough: the top-level import() would still keep
// the chunk reachable.)
const DevTuning = import.meta.env.DEV
  ? lazy(() => import('./TuningPanel.jsx'))
  : null;

// ---------------------------------------------------------------------------
// CameraRig: the gentle sinusoidal dolly ("breathing") + slight mouse parallax.
// Runs inside the Canvas so it can use useFrame/useThree. Skipped (and the
// camera parked head-on) under reduced motion.
// ---------------------------------------------------------------------------
function CameraRig({ reducedMotion }) {
  const { camera } = useThree();

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;

    // Breathing dolly in/out on Z.
    camera.position.z =
      CONFIG.CAMERA_DISTANCE +
      Math.sin(t * CONFIG.CAMERA_BREATH_SPEED) * CONFIG.CAMERA_BREATH_AMP;

    // Slight look-around toward the pointer for parallax.
    const px = state.pointer.x * 2;
    const py = state.pointer.y * 2;
    camera.position.x += (px - camera.position.x) * 0.05;
    camera.position.y += (py - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Inner scene contents. Receives the tuning values from the parent (which owns
// the state shared with the dev panel).
function SceneContents({ reducedMotion, tuning }) {
  return (
    <>
      {/* Fog fades distant particles into the black background -> depth/mood. */}
      <fog attach="fog" args={[CONFIG.BACKGROUND, CONFIG.FOG_NEAR, CONFIG.FOG_FAR]} />

      <CameraRig reducedMotion={reducedMotion} />

      <Nebula reducedMotion={reducedMotion} />
      <ColorOrbs reducedMotion={reducedMotion} />
      <Particles reducedMotion={reducedMotion} />

      {/*
        Bloom is the single biggest contributor to the luminous look: it blooms
        the bright additive cores (stars + orbs) into halos. mipmapBlur gives a
        smoother, cheaper glow than the old UnrealBloom kernel. luminanceThreshold
        mirrors the prototype's BLOOM_THRESHOLD so only bright cores bloom and
        the black background stays black.

        Bloom only affects the canvas; the Hero HTML lives in a separate DOM
        layer above it (App.jsx) and is never touched.
      */}
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={tuning.bloomStrength}
          luminanceThreshold={tuning.bloomThreshold}
          luminanceSmoothing={0.2}
          radius={tuning.bloomRadius}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  // Local hook reads prefers-reduced-motion reactively (drei v10 has none).
  const reducedMotion = useReducedMotion();

  // Tuning state lives here (in the regular DOM tree) so it can be shared
  // between the DEV leva panel and the Bloom effect inside the Canvas.
  const [tuning, setTuning] = useTuning();

  const dpr = useRef([
    1,
    Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      CONFIG.PIXEL_RATIO_CAP
    ),
  ]);

  return (
    <>
      {/*
        Fixed full-viewport layer. The wrapper (not the Canvas) carries the
        `.scene` styles: R3F sets `position: relative` *inline* on its own
        canvas-wrapper div, and an inline style beats our stylesheet rule — so
        putting `className="scene"` directly on <Canvas> left it `position:
        relative`, in-flow at 100vh, which pushed the .hero overlay a full
        viewport below the fold (clipped by body{overflow:hidden}). Wrapping in
        a fixed div keeps the Canvas (which fills its parent) out of flow so the
        hero text layers on top as intended.
      */}
      <div className="scene" aria-hidden="true">
      <Canvas
        // Cap pixel ratio so retina/4K don't render 4x the pixels (perf rule).
        dpr={dpr.current}
        // Under reduced motion, render on demand (one frame); otherwise always.
        frameloop={reducedMotion ? 'demand' : 'always'}
        camera={{
          fov: CONFIG.CAMERA_FOV,
          near: 0.1,
          far: 100,
          position: [0, 0, CONFIG.CAMERA_DISTANCE],
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          // ACES Filmic tone mapping + sRGB output for a cinematic falloff.
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = new THREE.Color(CONFIG.BACKGROUND);
        }}
      >
        {/* Suspense guards any async (texture/material) work inside the tree. */}
        <Suspense fallback={null}>
          <SceneContents reducedMotion={reducedMotion} tuning={tuning} />
        </Suspense>
      </Canvas>
      </div>

      {/* DEV-only leva panel (regular DOM, outside the Canvas). Dead-code-
          eliminated in prod, so leva never ships. */}
      {import.meta.env.DEV && DevTuning && (
        <Suspense fallback={null}>
          <DevTuning onChange={setTuning} />
        </Suspense>
      )}
    </>
  );
}
