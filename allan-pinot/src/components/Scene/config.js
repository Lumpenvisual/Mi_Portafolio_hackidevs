/*
  config.js — single source of truth for the hero scene look.
  Ported verbatim from the verified Phase 1 prototype CONFIG. Centralizing it
  here lets Particles / Nebula / ColorOrbs / Scene share the exact same tuned
  values, and lets the leva dev panel (Scene.jsx) override a subset live.

  The "dense cinematic" look comes from: a tight compact star shell + additive
  glow + a faint procedural nebula backdrop + a few saturated glowing orbs +
  subtle bloom. NOT from raw particle count. (See agent memory: phase1.)
*/

// Desktop caps at 6000, mobile at 3000 (perf rule: max 3000 particles on
// mobile). A coarse touch/width check is enough for the hero.
const isMobile =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(max-width: 768px)').matches ||
    'ontouchstart' in window);

export const CONFIG = {
  // --- Particle field ---
  PARTICLE_COUNT: isMobile ? 3000 : 6000,
  SPHERE_RADIUS: 6, // tight shell -> compact, dense-looking cloud
  RADIUS_JITTER: 1.5, // thin shell so points pile up visually
  PARTICLE_SIZE: 13, // SMALL points; brightness comes from bloom
  SIZE_VARIANCE: 0.7,

  // --- Colors (stars near-white; colour lives in nebula + orbs) ---
  COLOR_A: 0xbcd2ff, // faint cool blue-white
  COLOR_B: 0xe8f0ff, // brighter blue-white
  COLOR_C: 0xffffff, // pure white cores
  COLOR_WHITE_RATIO: 0.3,

  // --- Motion ---
  AUTO_ROTATE_SPEED: 0.03,
  MOUSE_INFLUENCE: 0.35,
  MOUSE_DAMPING: 0.05,
  CAMERA_BREATH_AMP: 0.45,
  CAMERA_BREATH_SPEED: 0.4,

  // --- Scene ---
  CAMERA_DISTANCE: 14,
  CAMERA_FOV: 55,
  FOG_NEAR: 10,
  FOG_FAR: 28,
  BACKGROUND: 0x000000,
  PIXEL_RATIO_CAP: 2,

  // --- Nebula backdrop (procedural, additive, faint) ---
  NEBULA_OPACITY: 0.16,
  NEBULA_PURPLE: '#4a2c9c',
  NEBULA_BLUE: '#143a8c',

  // --- Colour orbs (glowing focal suns) ---
  ORB_GLOW_STRENGTH: 0.55,

  // --- Bloom (UnrealBloomPass equivalent) ---
  BLOOM_STRENGTH: 0.55,
  BLOOM_RADIUS: 0.5,
  BLOOM_THRESHOLD: 0.18,
};
