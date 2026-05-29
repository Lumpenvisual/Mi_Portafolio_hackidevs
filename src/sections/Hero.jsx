import { useRef } from 'react'
import { LazyMotion, m, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { useApp } from '../lib/AppContext'

const loadMotionFeatures = () => import('../lib/motionFeatures').then((res) => res.default)

// Hand-drawn loop that rings the emphasized words — draws itself on load.
const Scribble = () => (
  <svg
    className="hero-scribble"
    viewBox="0 0 600 220"
    fill="none"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M40 120C70 40 240 26 400 34c145 8 190 58 158 104c-34 50-258 60-408 48c-80-6-132-36-84-90"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      pathLength="1"
    />
  </svg>
)

// 35mm film strip — audiovisual signature, used as a layered paper accent.
const FilmStrip = () => {
  const holes = [30, 75, 120, 165, 210, 255, 300, 345, 390, 435]
  const frames = [40, 180, 320]
  return (
    <svg className="hero-filmstrip" viewBox="0 0 120 480" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="112" height="472" rx="7" stroke="currentColor" strokeWidth="2" />
      <line x1="26" y1="4" x2="26" y2="476" stroke="currentColor" strokeWidth="1.5" />
      <line x1="94" y1="4" x2="94" y2="476" stroke="currentColor" strokeWidth="1.5" />
      {holes.map((y) => (
        <g key={y}>
          <rect x="9" y={y} width="8" height="22" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="103" y={y} width="8" height="22" rx="2" fill="currentColor" opacity="0.5" />
        </g>
      ))}
      {frames.map((y) => (
        <rect
          key={y}
          x="32"
          y={y}
          width="56"
          height="120"
          rx="3"
          fill="var(--accent-soft)"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

const copy = {
  es: {
    eyebrow: 'Portafolio — 2026',
    title: (
      <>
        Cuento
        <br />
        historias en
        <br />
        <span className="hero-emph">
          <em>imágenes</em> <em>&amp;</em> <em>código.</em>
          <Scribble />
        </span>
      </>
    ),
    lede: (
      <>
        Soy <strong>Jacky</strong> &mdash; comunicadora audiovisual narrando
        historias que importan. Hoy también construyo flujos con{' '}
        <strong>IA</strong> y estudio Análisis y Desarrollo de Software,
        porque las mejores narrativas del futuro se escriben con código.
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
        <span className="hero-emph">
          <em>images</em> <em>&amp;</em> <em>code.</em>
          <Scribble />
        </span>
      </>
    ),
    lede: (
      <>
        I&apos;m <strong>Jacky</strong> &mdash; an audiovisual storyteller
        telling stories that matter. I&apos;m also building{' '}
        <strong>AI</strong> workflows and studying Software Analysis &amp;
        Development, because the best narratives of the future will be
        written in code.
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

  const sectionRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const filmY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 130])
  const filmRotate = useTransform(scrollYProgress, [0, 1], reduce ? [-5, -5] : [-5, -11])

  return (
    <section className="hero" id="top" ref={sectionRef}>
      <div className="hero-deco" aria-hidden="true">
        <LazyMotion features={loadMotionFeatures} strict>
          <m.div className="hero-filmstrip-wrap" style={{ y: filmY, rotate: filmRotate }}>
            <span className="hero-tape" />
            <FilmStrip />
          </m.div>
        </LazyMotion>
      </div>

      <div className="hero-grid">
        <div className="hero-meta">
          <span className="hero-eyebrow">
            <span className="dot" />
            {t.eyebrow}
          </span>
        </div>

        <h1 className="hero-title">{t.title}</h1>

        <div className="hero-aside">
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
  )
}
