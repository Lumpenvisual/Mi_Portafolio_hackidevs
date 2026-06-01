import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useApp } from '../lib/AppContext'
import Fireflies from '../components/Fireflies'

// The 3D viewer is lazy-loaded so three.js stays out of the initial bundle —
// it (and three) only download once the Hero mounts. Until /models/jacky.glb
// exists the viewer shows a faceted placeholder.
const Model3D = lazy(() => import('../three/Model3D'))

// The Remotion intro <Player> is lazy-loaded too — @remotion/player + three only
// download (as a separate chunk) when the intro actually plays on the first
// visit. Skipped entirely under reduced-motion, so that chunk never loads there.
const HeroPlayer = lazy(() => import('../components/HeroPlayer'))

const skipCopy = { es: 'Saltar intro', en: 'Skip intro' }

// Quick-access nodes orbiting the model. ids match the real section ids
// (Projects is #work, Photography is #fotografia). Angles are spaced 72° and
// offset so the first node sits at the top of the ring.
const NAV_NODES = [
  { id: 'services', angle: 0 },
  { id: 'work', angle: 72 },
  { id: 'skills', angle: 144 },
  { id: 'fotografia', angle: 216 },
  { id: 'contact', angle: 288 },
]

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
    orbitAria: 'Acceso rápido',
    nodes: {
      services: 'Servicios',
      work: 'Proyectos',
      skills: 'Habilidades',
      fotografia: 'Fotografía',
      contact: 'Contacto',
    },
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
    orbitAria: 'Quick links',
    nodes: {
      services: 'Services',
      work: 'Work',
      skills: 'Skills',
      fotografia: 'Photography',
      contact: 'Contact',
    },
  },
}

export default function Hero({ modelUrl = '/models/jacky.glb' }) {
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

          <div className="hero-stage">
            <Suspense fallback={<div className="hero-stage-fallback" />}>
              <Model3D src={modelUrl} />
            </Suspense>

            <nav className="hero-orbit" aria-label={t.orbitAria}>
              {NAV_NODES.map(({ id, angle }) => {
                const rad = ((angle - 90) * Math.PI) / 180
                const x = 50 + Math.cos(rad) * 46
                const y = 50 + Math.sin(rad) * 46
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="orbit-node"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {t.nodes[id]}
                  </a>
                )
              })}
            </nav>
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
