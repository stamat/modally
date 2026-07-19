// Flat ESLint config. Kept dependency-free (no shared preset) — a handful of
// rules catches the mistakes that matter here: undefined vars and dead code.
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  navigator: 'readonly',
  customElements: 'readonly',
  HTMLElement: 'readonly',
  Element: 'readonly',
  Node: 'readonly',
  NodeList: 'readonly',
  CustomEvent: 'readonly',
  DOMParser: 'readonly',
  getComputedStyle: 'readonly',
  requestAnimationFrame: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  jQuery: 'readonly',
  $: 'readonly',
}

const nodeGlobals = {
  process: 'readonly',
  globalThis: 'readonly',
  console: 'readonly',
}

export default [
  { ignores: ['dist/**', 'node_modules/**', 'package-lock.json'] },
  {
    files: ['modally.mjs', 'build/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: browserGlobals },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none' }],
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['test/**/*.mjs', 'eslint.config.mjs'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: { ...browserGlobals, ...nodeGlobals } },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none' }],
    },
  },
]
