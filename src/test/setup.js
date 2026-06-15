import '@testing-library/jest-dom'

// Mock GSAP so components that lazily `import('gsap')` for entrance/scroll
// animations resolve instantly with a no-op stub. Without this, the real
// dynamic import resolves AFTER the jsdom environment is torn down, throwing
// "Cannot load ... after the environment was torn down" unhandled rejections.
vi.mock('gsap', () => {
  const tl = {
    from: () => tl,
    to: () => tl,
    fromTo: () => tl,
    set: () => tl,
    add: () => tl,
    play: () => tl,
    pause: () => tl,
    kill: () => tl,
  }
  const gsap = {
    timeline: () => tl,
    from: () => tl,
    to: () => tl,
    fromTo: () => tl,
    set: () => {},
    registerPlugin: () => {},
    context: (fn) => {
      try {
        if (typeof fn === 'function') fn()
      } catch {
        /* selectors resolve to nothing in jsdom — ignore */
      }
      return { revert: () => {}, kill: () => {} }
    },
    matchMedia: () => ({ add: () => {}, revert: () => {} }),
    utils: { toArray: (x) => (Array.isArray(x) ? x : x == null ? [] : [x]) },
  }
  return { gsap, default: gsap }
})

// IntersectionObserver not implemented in jsdom
global.IntersectionObserver = class {
  constructor(cb) {
    this._cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// matchMedia not implemented in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Default navigator.language to Spanish (matches app default)
Object.defineProperty(navigator, 'language', {
  get: () => 'es',
  configurable: true,
})

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('lang')
})
