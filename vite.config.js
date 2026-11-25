/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Oldest browsers the production build must still lay out correctly.
const BROWSERS = ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14']

export default defineConfig({
  plugins: [react()],
  server: {
    // Don't watch external folders (reference clones, agent skill dirs). They
    // contain other projects' files and trip the Windows file watcher (EBUSY).
    watch: {
      ignored: [
        '**/_repos/**',
        '**/.claude/**',
        '**/.agents/**',
        '**/allan-pinot/**',
      ],
    },
  },
  build: {
    // Support phones whose browser can't auto-update (e.g. Chrome on Huawei,
    // iPhones stuck on iOS 15). With 'esnext' the CSS minifier rewrote every
    // `@media (max-width: …)` into range syntax `(width<=…)`, which Chrome <104
    // and Safari <16.4 ignore — those phones got the whole desktop layout.
    target: BROWSERS,
    cssTarget: BROWSERS,
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
})
