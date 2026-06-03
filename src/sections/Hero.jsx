import { lazy, Suspense, useEffect, useRef } from 'react'
import { useApp } from '../lib/AppContext'
import Fireflies from '../components/Fireflies'

// The 3D camera stage is lazy-loaded so three.js stays out of the initial
// bundle — it (and three) only download once the Hero mounts. Loads the
// optimized vintage SLR camera (/models/camera.glb, 1.17 MB).
const CameraStage = lazy(() => import('../components/CameraStage'))

const copy = {
  es: {
    eyebrow: 'Portafolio — 2026',
    title: (
      <>
        Cuento
        <br />
        historias en
        <br />
        <span className="hero-emph">imágenes &amp; código.</span>
      </>
    ),
    lede: (
      <>
        Soy <strong>Jacky</strong> &mdash; comunicadora audiovisual narrando
        historias que importan. Hoy también construyo flujos con{' '}
        <strong>IA</strong> y estudio Análisis y Desarrollo de Software, porque
        las mejores narrativas del futuro se escriben con código.
      </>
    ),
    primaryCta: 'Conóceme',
    linkCta: 'Hablemos',
    labels: { based: 'Desde', focus: 'Foco', status: 'Estado' },
    based: 'Medellín, Colombia',
    focus: 'Audiovisual · IA · Código',
    status: 'Abierta a proyectos',
  },
  en: {
    eyebrow: 'Portfolio — 2026',
    title: (
      <>
        I tell
        <br />
        stories in
        <br />
        <span className="hero-emph">images &amp; code.</span>
      </>
    ),
    lede: (
      <>
        I&apos;m <strong>Jacky</strong> &mdash; an audiovisual storyteller
        telling stories that matter. I&apos;m also building <strong>AI</strong>{' '}
        workflows and studying Software Analysis &amp; Development, because the
        best narratives of the future will be written in code.
      </>
    ),
    primaryCta: 'Get to know me',
    linkCta: "Let's talk",
    labels: { based: 'Based in', focus: 'Focus', status: 'Status' },
    based: 'Medellín, Colombia',
    focus: 'Audiovisual · AI · Code',
    status: 'Open to projects',
  },
}

export default function Hero() {
  const { lang } = useApp()
  const t = copy[lang]

  // On scroll, the camera sinks and dissolves: as the first ~70% of the
  // viewport scrolls past, translate the stage down and fade it out. Desktop
  // only — on mobile the hero is stacked and the camera sits well below the
  // copy, so the raw-scroll fade would hide it before it's even in view; there
  // the stage renders normally. Skipped under reduced-motion too.
  const stageRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const apply = () => {
      const el = stageRef.current
      if (!el) return
      if (window.innerWidth <= 900) {
        // Mobile: the hero is stacked and the camera sits below the copy, so a
        // raw-scrollY fade would hide it before it's even in view. Instead fade
        // by OPACITY only (no sink), driven by the stage's own position in the
        // viewport: fully visible while its centre is low in the viewport, then
        // dissolving as it scrolls up toward the top.
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const center = rect.top + rect.height / 2
        const start = vh * 0.55 // opacity 1 at/below this line
        const end = vh * 0.08 // opacity 0 by this line (near the top)
        const p = Math.min(1, Math.max(0, (center - end) / (start - end)))
        el.style.opacity = String(p)
        el.style.transform = ''
        return
      }
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.7))
      el.style.opacity = String(1 - p)
      el.style.transform = `translateY(${p * 140}px)`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <section className="hero hero--3d" id="top">
        <Fireflies count={40} />

        <div className="hero-grid">
          <div className="hero-meta">
            <span className="hero-eyebrow">
              <span className="dot" />
              {t.eyebrow}
            </span>
          </div>

          <div className="hero-copy">
            <h1 className="hero-title">{t.title}</h1>
            <p className="hero-lede">{t.lede}</p>
            <div className="hero-actions">
              <a href="#about" className="btn btn-primary">
                {t.primaryCta}
                <span className="btn-arrow">↓</span>
              </a>
              <a href="#contact" className="btn btn-link">
                {t.linkCta}
              </a>
            </div>
          </div>

          <div className="hero-stage" ref={stageRef}>
            <Suspense fallback={<div className="hero-stage-fallback" />}>
              <CameraStage />
            </Suspense>
          </div>

          <div className="hero-foot">
            <div className="hero-foot-col">
              <span className="label">{t.labels.based}</span>
              <span className="value">{t.based}</span>
            </div>
            <div className="hero-foot-col">
              <span className="label">{t.labels.focus}</span>
              <span className="value">{t.focus}</span>
            </div>
            <div className="hero-foot-col">
              <span className="label">{t.labels.status}</span>
              <span className="value">
                <span className="dot dot-on" />
                {t.status}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
