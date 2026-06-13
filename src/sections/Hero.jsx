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
    // Title is split into lines so each can mask-reveal on load.
    titleLines: ['Cuento', 'historias en', { text: 'imágenes & código.', emph: true }],
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
    scroll: 'Desliza',
    labels: { based: 'Desde', focus: 'Foco', status: 'Estado' },
    based: 'Medellín, Colombia',
    focus: 'Audiovisual · IA · Código',
    status: 'Abierta a proyectos',
  },
  en: {
    eyebrow: 'Portfolio — 2026',
    titleLines: ['I tell', 'stories in', { text: 'images & code.', emph: true }],
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
    scroll: 'Scroll',
    labels: { based: 'Based in', focus: 'Focus', status: 'Status' },
    based: 'Medellín, Colombia',
    focus: 'Audiovisual · AI · Code',
    status: 'Open to projects',
  },
}

export default function Hero() {
  const { lang } = useApp()
  const t = copy[lang]
  const rootRef = useRef(null)
  const stageRef = useRef(null)

  // ── Cinematic intro (GSAP, lazy-loaded so it stays out of the initial
  // bundle). A staggered mask-reveal of the title lines + fades for the rest,
  // and a slow scale-in of the camera. Skipped entirely under reduced motion
  // (elements render in their final state). Runs once on mount. ──
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let ctx
    let killed = false
    import('gsap').then(({ gsap }) => {
      if (killed || !rootRef.current) return
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.hero-eyebrow', { y: 16, autoAlpha: 0, duration: 0.6 })
          .from(
            '.hero-line-inner',
            { yPercent: 115, duration: 0.95, stagger: 0.09 },
            '-=0.15',
          )
          .from('.hero-lede', { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.45')
          .from(
            '.hero-actions > *',
            { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.1 },
            '-=0.3',
          )
          .from('.hero-cine-foot > *', { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.08 }, '-=0.4')
          .from('.hero-stage', { autoAlpha: 0, scale: 0.9, duration: 1.3, ease: 'power2.out' }, 0.15)
      }, root)
    })
    return () => {
      killed = true
      if (ctx) ctx.revert()
    }
  }, [])

  // On scroll, the camera sinks and dissolves: as the first ~70% of the
  // viewport scrolls past, translate the stage down and fade it out. Desktop
  // only — on mobile the camera fades by its own viewport position. Skipped
  // under reduced motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const apply = () => {
      const el = stageRef.current
      if (!el) return
      if (window.innerWidth <= 900) {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight || 1
        const center = rect.top + rect.height / 2
        const start = vh * 0.5
        const end = vh * 0.3
        const p = Math.min(1, Math.max(0, (center - end) / (start - end)))
        el.style.opacity = String(p)
        el.style.transform = ''
        return
      }
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.7))
      el.style.opacity = String(1 - p)
      el.style.transform = `translateY(${p * 160}px) scale(${1 - p * 0.06})`
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
    <section className="hero hero--cinematic" id="top" ref={rootRef}>
      {/* Layered cinematic backdrop: vignette + centred glow */}
      <div className="hero-cine-bg" aria-hidden="true" />
      <Fireflies count={48} />

      <div className="hero-cine-inner">
        <span className="hero-eyebrow">
          <span className="dot" />
          {t.eyebrow}
        </span>

        <h1 className="hero-title hero-title--cine">
          {t.titleLines.map((line, i) => {
            const isObj = typeof line === 'object'
            const text = isObj ? line.text : line
            return (
              <span className="hero-line" key={i}>
                <span className={`hero-line-inner${isObj && line.emph ? ' hero-emph' : ''}`}>
                  {text}
                </span>
              </span>
            )
          })}
        </h1>

        <p className="hero-lede">{t.lede}</p>

        <div className="hero-actions">
          <a href="#about" className="btn btn-primary" data-magnetic="0.4">
            {t.primaryCta}
            <span className="btn-arrow">↓</span>
          </a>
          <a href="#contact" className="btn btn-link" data-magnetic="0.3">
            {t.linkCta}
          </a>
        </div>
      </div>

      {/* The 3D camera fills a large stage on the right (desktop), layered
          behind the copy via z-index; stacks below the copy on mobile. */}
      <div className="hero-stage" ref={stageRef}>
        <Suspense fallback={<div className="hero-stage-fallback" />}>
          <CameraStage />
        </Suspense>
      </div>

      <div className="hero-cine-foot">
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

        <a href="#about" className="hero-scroll" aria-label={t.scroll}>
          <span className="hero-scroll-label">{t.scroll}</span>
          <span className="hero-scroll-track" aria-hidden="true">
            <span className="hero-scroll-dot" />
          </span>
        </a>
      </div>
    </section>
  )
}
