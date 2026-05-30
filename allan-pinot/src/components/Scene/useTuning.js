import { useState } from 'react';
import { CONFIG } from './config.js';

/*
  Tuning state holder + a DEV-only leva panel — split so leva stays out of prod.

  Why this shape: a static `import { useControls } from 'leva'` guarded by an
  `if (DEV)` does NOT tree-shake under Rolldown (verified: leva's theme/store
  leaked into the prod chunk). The reliable fix is to never statically reference
  leva from the production code path. So:

    - useTuning() (this file): no leva import at all. Holds the bloom params in
      state, seeded from CONFIG. Ships in prod as plain React state. Returns
      [tuning, setTuning].
    - <DevTuning/> (TuningPanel.jsx): the ONLY module that imports leva, and it
      is loaded exclusively through a DEV-gated React.lazy in Scene.jsx. In prod
      that lazy import is dead code, so leva is never fetched or bundled.
*/
export function useTuning() {
  return useState({
    bloomStrength: CONFIG.BLOOM_STRENGTH,
    bloomRadius: CONFIG.BLOOM_RADIUS,
    bloomThreshold: CONFIG.BLOOM_THRESHOLD,
  });
}
