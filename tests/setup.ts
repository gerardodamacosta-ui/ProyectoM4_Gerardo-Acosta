// tests/setup.ts
// Corre antes de cada suite. Importa los matchers de jest-dom para poder
// usar expect(element).toBeInTheDocument(), .toBeDisabled(), etc. en los tests.
import '@testing-library/jest-dom'

// jsdom no implementa window.matchMedia — necesario para react-hot-toast <Toaster />.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
