import '@testing-library/jest-dom'

// IntersectionObserver not implemented in jsdom
global.IntersectionObserver = class {
  constructor(cb) { this._cb = cb }
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
