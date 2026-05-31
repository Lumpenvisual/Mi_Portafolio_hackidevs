import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FaceParticles from './FaceParticles'
import './facePreview.css'

// Isolated preview for the FaceParticles piece — served at /face.html so we can
// iterate on the 3D portrait without touching the live portfolio.
/* eslint-disable react-refresh/only-export-components */
function Preview() {
  return (
    <main className="fp-stage">
      <FaceParticles src="/retrato.webp" />
      <div className="fp-caption">
        <span>imágenes</span>
        <em>&amp;</em>
        <span>código</span>
      </div>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>
)
