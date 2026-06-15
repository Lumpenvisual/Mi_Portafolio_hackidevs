import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import ProjectList from '../components/ProjectList'

// The 12 brand-book pages (optimized WebP in /public/projects/tejidas/).
const TEJIDAS_IMAGES = Array.from(
  { length: 12 },
  (_, i) => `/projects/tejidas/${String(i + 1).padStart(2, '0')}.webp`,
)

// ── Graphic / editorial design projects. A project with an `images` array
// opens a lightbox gallery on click. Add objects to grow the grid. ──
const designProjects = {
  es: [
    {
      num: '01',
      accent: '#a8617f',
      name: 'tejidas.co',
      role: 'Manual de marca',
      subtitle: 'Identidad y sistema visual',
      description:
        'Manual de marca para tejidas.co: logotipo, paleta, tipografía y aplicaciones. Primer proyecto de la línea de diseño gráfico y editorial.',
      tags: ['Identidad', 'Editorial', 'Manual de marca'],
      images: TEJIDAS_IMAGES,
      cta: 'Ver manual',
    },
  ],
  en: [
    {
      num: '01',
      accent: '#a8617f',
      name: 'tejidas.co',
      role: 'Brand book',
      subtitle: 'Identity & visual system',
      description:
        'Brand book for tejidas.co: logo, palette, typography and applications. First piece in the graphic & editorial design line.',
      tags: ['Identity', 'Editorial', 'Brand book'],
      images: TEJIDAS_IMAGES,
      cta: 'View brand book',
    },
  ],
}

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
    design: {
      label: 'Diseño gráfico',
      title: (
        <>
          Identidad, <em>editorial</em> y sistemas de <em>marca</em>.
        </>
      ),
    },
    dev: {
      label: 'Desarrollo',
      title: (
        <>
          Productos y experiencias en <em>código</em>.
        </>
      ),
    },
    empty: 'Pronto, más proyectos aquí.',
    gallery: {
      close: 'Cerrar',
      prev: 'Anterior',
      next: 'Siguiente',
      alt: (n) => `Manual de marca tejidas.co — página ${n}`,
    },
  },
  en: {
    design: {
      label: 'Graphic design',
      title: (
        <>
          Identity, <em>editorial</em> and <em>brand</em> systems.
        </>
      ),
    },
    dev: {
      label: 'Development',
      title: (
        <>
          Products and experiences in <em>code</em>.
        </>
      ),
    },
    empty: 'More projects coming soon.',
    gallery: {
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      alt: (n) => `tejidas.co brand book — page ${n}`,
    },
  },
}

// Diseño gráfico + Desarrollo — same project-card structure as the
// Audiovisual section, lifted out of its tabs and placed as standalone
// sections below Fotografía.
export default function DesignWork() {
  const { lang } = useApp()
  const t = copy[lang]
  const designHead = useReveal()
  const devHead = useReveal()

  return (
    <>
      <section
        className="section design-work"
        id="design"
        aria-label={t.design.label}
      >
        <header ref={designHead} data-reveal className="section-head">
          <span className="section-label">{t.design.label}</span>
        </header>
        <h2 className="section-title">{t.design.title}</h2>
        <ProjectList
          items={designProjects[lang]}
          galleryLabels={t.gallery}
          emptyLabel={t.empty}
        />
      </section>

      <section
        className="section design-work"
        id="dev"
        aria-label={t.dev.label}
      >
        <header ref={devHead} data-reveal className="section-head">
          <span className="section-label">{t.dev.label}</span>
        </header>
        <h2 className="section-title">{t.dev.title}</h2>
        <ProjectList
          items={devProjects[lang]}
          galleryLabels={t.gallery}
          emptyLabel={t.empty}
        />
      </section>
    </>
  )
}
