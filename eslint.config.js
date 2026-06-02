import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

const vitestGlobals = {
  vi: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  suite: 'readonly',
}

export default defineConfig([
  globalIgnores([
    'dist',
    'public',
    'node_modules',
    '_repos',
    'allan-pinot',
    '.claude',
    '.agents',
  ]),

  // Browser / React source files
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['src/test/**'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Test files — jsdom + Vitest globals
  {
    files: ['src/test/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...vitestGlobals },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Node.js config / script files
  {
    files: [
      'vite.config.js',
      'eslint.config.js',
      'playwright.config.js',
      'scripts/**/*.{js,mjs}',
    ],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // Playwright E2E specs — Node + browser globals (page.evaluate callbacks run
  // in the browser); `test`/`expect` come from @playwright/test imports.
  {
    files: ['tests/e2e/**/*.e2e.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // Disable stylistic rules that conflict with Prettier (must be last)
  eslintConfigPrettier,
])
