import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './lib/AppContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Dev-only preview: visit ?preview=heroes to compare the cult-ui hero variants
// without touching the live site. Lazy-loaded so it stays out of the normal
// bundle. Remove this gate (and src/preview/HeroGallery.jsx) when done choosing.
const isHeroPreview =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('preview') === 'heroes'
const HeroGallery = lazy(() => import('./preview/HeroGallery.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isHeroPreview ? (
      <Suspense fallback={null}>
        <HeroGallery />
      </Suspense>
    ) : (
      <ErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </ErrorBoundary>
    )}
  </StrictMode>,
)
