/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Don't watch external folders (reference clones, agent skill dirs). They
    // contain other projects' files and trip the Windows file watcher (EBUSY).
    watch: {
      ignored: ['**/_repos/**', '**/.claude/**', '**/.agents/**', '**/allan-pinot/**'],
    },
  },
  build: {
    target: 'esnext',
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
