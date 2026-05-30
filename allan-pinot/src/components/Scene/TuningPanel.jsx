import { useEffect } from 'react';
import { useControls } from 'leva';
import { CONFIG } from './config.js';

/*
  DevTuning — the ONLY module that imports leva.

  It is loaded exclusively via a DEV-gated React.lazy() in Scene.jsx, so in
  production builds the import is dead code and Rolldown drops leva entirely
  (verified: no leva strings in the prod bundle).

  It uses leva's useControls hook normally (this IS a component, so hooks are
  valid) and lifts the values up to the parent via the onChange callback. The
  parent owns the tuning state (useTuning) so the rest of the scene reads plain
  state and has no leva dependency.

  Rendered as a normal React component (not inside the R3F Canvas) — leva paints
  its own DOM overlay, so it must live in the regular DOM tree.
*/
export default function DevTuning({ onChange }) {
  const values = useControls('Bloom', {
    bloomStrength: { value: CONFIG.BLOOM_STRENGTH, min: 0, max: 2, step: 0.01 },
    bloomRadius: { value: CONFIG.BLOOM_RADIUS, min: 0, max: 1, step: 0.01 },
    bloomThreshold: { value: CONFIG.BLOOM_THRESHOLD, min: 0, max: 1, step: 0.01 },
  });

  // Push leva changes up to the parent's tuning state.
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return null;
}
