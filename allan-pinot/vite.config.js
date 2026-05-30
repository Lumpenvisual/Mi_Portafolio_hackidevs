import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Isolated R3F build config. This project is intentionally separate from the
// root portfolio (../) so its heavy 3D dependencies (three/webgpu, drei,
// postprocessing) never bloat the live portfolio's lean bundle.
export default defineConfig({
  root: __dirname,
  plugins: [react()],
  build: {
    // Manual chunking keeps the heavy libraries out of the entry chunk so the
    // HTML hero text can paint before three.js/drei/postprocessing parse.
    // The 3D subtree is *also* React.lazy-loaded at runtime (see App.jsx); this
    // split just makes the lazy chunk a clean, cacheable vendor boundary.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Normalize Windows backslashes so path matching is OS-agnostic
          // (on win32 module ids use `\`, so `/three/` never matched before).
          const n = id.replace(/\\/g, '/');
          if (n.includes('node_modules')) {
            // Order matters: most specific package paths first.
            // three.js is the largest single dep — give it its own chunk so it
            // caches independently of the effects library.
            if (n.includes('/three/') || n.includes('three-stdlib'))
              return 'vendor-three';
            if (
              n.includes('@react-three/postprocessing') ||
              n.includes('/postprocessing/')
            )
              return 'vendor-postprocessing';
            if (n.includes('@react-three')) return 'vendor-r3f';
            if (n.includes('/react/') || n.includes('/react-dom/') || n.includes('/scheduler/'))
              return 'vendor-react';
          }
        },
      },
    },
    // The merged three + r3f + postprocessing vendor chunk is ~960 kB raw
    // (~255 kB gzip). It is fully code-split from the 2.9 kB entry and lazy-
    // loaded behind the HTML hero, so it never blocks first paint. Rolldown
    // intentionally merges three into the postprocessing chunk because three is
    // only consumed by that lazy subtree (no duplication — verified). Raise the
    // ceiling so this expected size doesn't emit a cosmetic warning.
    chunkSizeWarningLimit: 1000,
  },
});
