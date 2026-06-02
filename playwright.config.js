import { defineConfig, devices } from '@playwright/test'

// End-to-end tests for the portfolio SPA. Runs against the PRODUCTION build
// (vite preview on :4173) so it matches what deploys. Test files are named
// `*.e2e.js` so Vitest (which globs *.test/*.spec) ignores them.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.js',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
})
