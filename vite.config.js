/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
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
