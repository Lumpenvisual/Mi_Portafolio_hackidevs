import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CameraHero from '../components/CameraHero'

// Isolated preview for CameraHero — served at /camera.html so we can iterate on
// the 3D camera hero without touching the live portfolio.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CameraHero />
  </StrictMode>,
)
