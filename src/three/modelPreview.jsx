import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Model3D from './Model3D'
import './modelPreview.css'

// Isolated preview for the 3D portrait viewer — served at /model.html so we can
// iterate on lighting, framing and the model swap without touching the live
// portfolio. Drop the generated asset at /public/models/jacky.glb to replace
// the placeholder (see scripts/image-to-3d.mjs).
/* eslint-disable react-refresh/only-export-components */
const LABEL = {
  loading: 'cargando…',
  model: 'modelo cargado',
  placeholder: 'placeholder — añade /models/jacky.glb',
  fallback: 'WebGL no disponible',
}

function Preview() {
  const [status, setStatus] = useState('loading')
  return (
    <main className="mp-stage">
      <Model3D onStatus={setStatus} />
      <div className="mp-caption">
        <span>imágenes</span>
        <em>&amp;</em>
        <span>código</span>
      </div>
      <p className="mp-status" data-status={status}>
        {LABEL[status] || status}
      </p>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
