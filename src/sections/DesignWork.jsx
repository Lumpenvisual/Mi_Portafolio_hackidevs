import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import ProjectList from '../components/ProjectList'

// ── Development projects. Add objects to grow the grid. ──
const devProjects = {
  es: [
    {
      num: '01',
      accent: '#4a6b8a',
      name: 'la Gilipolla',
      role: 'Desarrollo web',
      subtitle: 'Bar El Guanábano · Mundial 2026',
      description:
        'App web de la polla del Mundial 2026 para el Bar El Guanábano: predicciones de partidos y seguimiento del torneo. Desplegada en Vercel.',
      tags: ['Web', 'Frontend', 'Vercel'],
      thumb: '/projects/gilipolla.webp',
      href: 'https://lagilipolla-c373bc22.vercel.app/',
      cta: 'Ver sitio',
    },
  ],
  en: [
    {
      num: '01',
      accent: '#4a6b8a',
      name: 'la Gilipolla',
      role: 'Web development',
      subtitle: 'Bar El Guanábano · 2026 World Cup',
      description:
        '2026 World Cup betting-pool web app for Bar El Guanábano: match predictions and tournament tracking. Deployed on Vercel.',
      tags: ['Web', 'Frontend', 'Vercel'],
      thumb: '/projects/gilipolla.webp',
      href: 'https://lagilipolla-c373bc22.vercel.app/',
      cta: 'Visit site',
    },
  ],
}

const copy = {
  es: {
    dev: {
      label: 'Desarrollo',
      title: (
        <>
          Productos y experiencias en <em>código</em>.
        </>
      ),
    },
    empty: 'Pronto, más proyectos aquí.',
  },
  en: {
    dev: {
      label: 'Development',
      title: (
        <>
          Products and experiences in <em>code</em>.
        </>
      ),
    },
    empty: 'More projects coming soon.',
  },
}

// Desarrollo — same project-card structure as the Audiovisual section,
// placed as a standalone section below Fotografía. (The Diseño gráfico
// section was removed on 2026-11-24.)
export default function DesignWork() {
  const { lang } = useApp()
  const t = copy[lang]
  const devHead = useReveal()

  return (
    <>
      <section
        className="section design-work"
        id="dev"
        aria-label={t.dev.label}
      >
        <header ref={devHead} data-reveal className="section-head">
          <span className="section-label">{t.dev.label}</span>
        </header>
        <h2 className="section-title">{t.dev.title}</h2>
        <ProjectList items={devProjects[lang]} emptyLabel={t.empty} />
      </section>
    </>
  )
}
