import { useRef } from 'react'
import { useApp } from '../lib/AppContext'
import Fireflies from '../components/Fireflies'

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
        <span className="hero-emph">images &amp; code.</span>
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

  return (
    <section className="hero" id="top" ref={sectionRef}>
      <Fireflies count={40} />

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
