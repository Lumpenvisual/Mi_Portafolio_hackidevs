import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'
import Fireflies from '../components/Fireflies'

// The 3D camera stage is lazy-loaded so three.js stays out of the initial
// bundle — it (and three) only download once the Hero mounts. Loads the
// optimized vintage SLR camera (/models/camera.glb, 1.17 MB).
const CameraStage = lazy(() => import('../components/CameraStage'))

// The Remotion intro <Player> is lazy-loaded too — @remotion/player + three only
// download (as a separate chunk) when the intro actually plays on the first
// visit. Skipped entirely under reduced-motion, so that chunk never loads there.
const HeroPlayer = lazy(() => import('../components/HeroPlayer'))

const skipCopy = { es: 'Saltar intro', en: 'Skip intro' }

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

export default function Hero({ modelUrl = '/models/camera.glb' }) {
  const { lang } = useApp()
  const t = copy[lang]

  // One-time Remotion intro: plays once per session, skippable (button/Esc),
  // skipped entirely under reduced-motion. Fades out to reveal the hero.
  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return false
    return !sessionStorage.getItem('introSeen')
  })
  const [leaving, setLeaving] = useState(false)

  const dismissIntro = useCallback(() => {
    setLeaving(true)
    setTimeout(() => setIntro(false), 600) // matches the CSS fade
  }, [])

  useEffect(() => {
    if (!intro) return
    sessionStorage.setItem('introSeen', '1')
    const onKey = (e) => {
      if (e.key === 'Escape') dismissIntro()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [intro, dismissIntro])

  // On scroll, the camera sinks and dissolves: as the first ~70% of the
  // viewport scrolls past, translate the stage down and fade it out. Skipped
  // under reduced-motion (the stage just stays put).
  const stageRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = stageRef.current
        if (!el) return
        const p = Math.min(1, window.scrollY / (window.innerHeight * 0.7))
        el.style.opacity = String(1 - p)
        el.style.transform = `translateY(${p * 140}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {intro && (
        <div
          className={`intro-overlay${leaving ? ' is-leaving' : ''}`}
          role="dialog"
          aria-label="Intro"
        >
          <Suspense fallback={null}>
            <div className="intro-player">
              <HeroPlayer modelUrl={modelUrl} onEnded={dismissIntro} />
            </div>
          </Suspense>
          <button type="button" className="intro-skip" onClick={dismissIntro}>
            {skipCopy[lang]} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
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
