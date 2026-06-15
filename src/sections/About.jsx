import { useState } from 'react'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import Skills from './Skills'
import Career from './Career'

const copy = {
  es: {
    sectionLabel: 'Sobre mí',
    imgAlt: 'Retrato de Jacky Gutiérrez',
    title: (
      <>
        Comunicadora <em>narrando</em> historias que <em>importan</em>.
      </>
    ),
    body: (
      <>
        <p>
          Narrar es crear espacios donde otros pueden entrar, donde lo que
          dejamos sin decir permite que cada persona complete la historia.
        </p>
        <p>
          Cada herramienta que uso es una manera de reconocer que ninguna
          historia termina en quien la crea: termina en quien la recibe y{' '}
          <strong>la vuelve suya</strong>.
        </p>
      </>
    ),
    facts: [
      {
        label: 'Aprendiendo',
        value: 'HTML · CSS · JavaScript · Python · Git',
      },
      { label: 'Idiomas', value: 'ES nativo · EN - B1' },
    ],
    more: {
      skills: 'Habilidades',
      career: 'Trayectoria',
      open: 'Ver más',
      close: 'Cerrar',
    },
  },
  en: {
    sectionLabel: 'About',
    imgAlt: 'Portrait of Jacky Gutiérrez',
    title: (
      <>
        Storyteller <em>telling</em> stories that <em>matter</em>.
      </>
    ),
    body: (
      <>
        <p>
          To narrate is to create spaces others can enter — where what we leave
          unsaid lets each person complete the story.
        </p>
        <p>
          Every tool I use is a way of acknowledging that no story ends with
          whoever creates it: it ends with whoever receives it and{' '}
          <strong>makes it their own</strong>.
        </p>
      </>
    ),
    facts: [
      {
        label: 'Learning',
        value: 'HTML · CSS · JavaScript · Python · Git',
      },
      { label: 'Languages', value: 'Native ES · EN - B1' },
    ],
    more: {
      skills: 'Skills',
      career: 'Career',
      open: 'See more',
      close: 'Close',
    },
  },
}

export default function About() {
  const { lang } = useApp()
  const t = copy[lang]
  const headRef = useReveal()
  const bodyRef = useReveal({ delay: 150 })
  const [open, setOpen] = useState({ skills: false, career: false })
  const toggle = (key) => setOpen((s) => ({ ...s, [key]: !s[key] }))

  // Skills + Trayectoria now live inside About as click-to-expand panels.
  const panels = [
    { key: 'skills', label: t.more.skills, content: <Skills embedded /> },
    { key: 'career', label: t.more.career, content: <Career embedded /> },
  ]

  return (
    <section className="section about" id="about">
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <div ref={bodyRef} data-reveal className="about-layout">
        <figure className="about-mark about-photo-wrap">
          <img
            className="about-photo"
            src="/yo-retoque.webp"
            alt={t.imgAlt}
            width="900"
            height="900"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about-text">
          <h2 className="section-title about-title">{t.title}</h2>
          <div className="about-body">{t.body}</div>
        </div>

        <ul className="about-facts">
          {t.facts.map((f) => (
            <li key={f.label}>
              <span className="label">{f.label}</span>
              <span className="value">{f.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="about-more">
        {panels.map(({ key, label, content }) => (
          <div
            key={key}
            className={`about-panel${open[key] ? ' is-open' : ''}`}
          >
            <button
              type="button"
              className="about-panel-trigger"
              aria-expanded={open[key]}
              aria-controls={`about-panel-${key}`}
              onClick={() => toggle(key)}
            >
              <span className="about-panel-label">{label}</span>
              <span className="about-panel-hint">
                {open[key] ? t.more.close : t.more.open}
                <span className="about-panel-chevron" aria-hidden="true">
                  ↓
                </span>
              </span>
            </button>
            <div
              className="about-panel-body"
              id={`about-panel-${key}`}
              role="region"
              aria-label={label}
            >
              <div className="about-panel-inner">{content}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
