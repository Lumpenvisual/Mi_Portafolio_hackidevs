import CameraStage from './CameraStage'
import './CameraHero.css'

// CameraHero — standalone hero section with a vintage SLR camera GLTF on the
// right (mouse/scroll parallax, accent lighting, starfield) and copy on the
// left. The 3D scene lives in <CameraStage> so it's shared with the real Hero;
// this component is the section shell + copy, served at /camera.html for
// isolated iteration.
export default function CameraHero() {
  return (
    <section className="camera-hero" id="top">
      {/* LEFT — copy */}
      <div className="ch-copy">
        <span className="ch-badge">
          <span className="ch-dot" />
          PORTAFOLIO — 2026
        </span>
        <h1 className="ch-title">
          Cuento historias en
          <br />
          <span className="ch-accent">imágenes &amp; código.</span>
        </h1>
        <p className="ch-lede">
          Desarrolladora &amp; fotógrafa. Construyo experiencias digitales con
          código limpio y visión creativa.
        </p>
        <div className="ch-actions">
          <a href="#work" className="ch-btn">
            Ver proyectos <span aria-hidden="true">→</span>
          </a>
          <a href="#contact" className="ch-btn">
            Contacto
          </a>
        </div>
      </div>

      {/* RIGHT — shared 3D stage (canvas is appended here) */}
      <CameraStage className="ch-stage" />
    </section>
  )
}
