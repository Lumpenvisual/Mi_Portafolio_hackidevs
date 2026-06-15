import { useEffect, useRef } from 'react'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import { useSpotlight } from '../hooks/useSpotlight'

const data = {
  es: {
    sectionLabel: 'Servicios',
    title: (
      <>
        Maneras de <em>contar</em>, <em>conectar</em> y{' '}
        <em>automatizar</em>.
      </>
    ),
    services: [
      {
        num: '01',
        title: 'Producción & Edición de Video',
        description:
          'Corto, documental, reel o pieza institucional. Storytelling que conecta desde la preproducción hasta la entrega final.',
        tags: ['Producción', 'Edición', 'Motion graphics', 'Sonido'],
      },
      {
        num: '02',
        title: 'Imagen & Video Generativo con IA',
        description:
          'Conceptos visuales, assets y piezas audiovisuales generadas con herramientas de inteligencia artificial.',
        tags: ['Midjourney', 'ComfyUI', 'IA Generativa'],
      },
      {
        num: '03',
        title: 'Automatización de Procesos con IA',
        description:
          'Flujos de trabajo que ahorran horas: automatización de contenido, datos y tareas repetitivas.',
        tags: ['n8n', 'Make', 'Python', 'LLMs'],
      },
      {
        num: '04',
        title: 'Fotografía & Dirección de Arte',
        description:
          'Sesiones fotográficas con dirección visual coherente para marcas, eventos y proyectos editoriales.',
        tags: ['Retrato', 'Editorial', 'Arte', 'Marcas'],
      },
      {
        num: '05',
        title: 'Marketing Automatizado',
        description:
          'Campañas digitales conectadas con herramientas que trabajan las 24 horas.',
        tags: ['Email', 'Social', 'SEO', 'Analytics'],
      },
      {
        num: '06',
        title: 'Gestión Cultural & Proyectos',
        description:
          'Coordinación de proyectos culturales, festivales y residencias con enfoque en comunidad e impacto.',
        tags: ['Eventos', 'Cultura', 'Gestión', 'Medios'],
      },
    ],
  },
  en: {
    sectionLabel: 'Services',
    title: (
      <>
        Ways to <em>tell</em>, <em>connect</em> and <em>automate</em>.
      </>
    ),
    services: [
      {
        num: '01',
        title: 'Video Production & Editing',
        description:
          'Short film, documentary, reel or institutional piece. Storytelling that connects from pre-production to final delivery.',
        tags: ['Production', 'Editing', 'Motion graphics', 'Sound'],
      },
      {
        num: '02',
        title: 'AI-Generated Image & Video',
        description:
          'Visual concepts, assets and audiovisual pieces created with artificial intelligence tools.',
        tags: ['Midjourney', 'ComfyUI', 'Generative AI'],
      },
      {
        num: '03',
        title: 'AI Process Automation',
        description:
          'Workflows that save hours: content automation, data and repetitive tasks.',
        tags: ['n8n', 'Make', 'Python', 'LLMs'],
      },
      {
        num: '04',
        title: 'Photography & Art Direction',
        description:
          'Photo sessions with coherent visual direction for brands, events and editorial projects.',
        tags: ['Portrait', 'Editorial', 'Art', 'Brands'],
      },
      {
        num: '05',
        title: 'Marketing Automation',
        description:
          'Digital campaigns connected with tools that work around the clock.',
        tags: ['Email', 'Social', 'SEO', 'Analytics'],
      },
      {
        num: '06',
        title: 'Cultural Project Management',
        description:
          'Coordination of cultural projects, festivals and residencies focused on community and impact.',
        tags: ['Events', 'Culture', 'Management', 'Media'],
      },
    ],
  },
}

export default function Services() {
  const { lang } = useApp()
  const t = data[lang]
  const headRef = useReveal()
  const spot = useSpotlight()
  const gridRef = useRef(null)

  // Staggered card entrance with anime.js when the grid scrolls into view.
  // anime is lazy-imported (out of the initial bundle); skipped under reduced
  // motion, where the cards simply render in place. Runs once.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const grid = gridRef.current
    if (!grid) return
    const cards = Array.from(grid.querySelectorAll('.service'))
    if (!cards.length) return
    // hide first (grid sits below the fold, so no visible flash)
    cards.forEach((c) => {
      c.style.opacity = '0'
      c.style.transform = 'translateY(28px)'
    })
    let played = false
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || played) return
          played = true
          io.disconnect()
          import('animejs')
            .then(({ animate, stagger }) => {
              animate(cards, {
                opacity: [0, 1],
                translateY: [28, 0],
                delay: stagger(85),
                duration: 720,
                ease: 'outExpo',
              })
            })
            .catch(() => {
              cards.forEach((c) => {
                c.style.opacity = ''
                c.style.transform = ''
              })
            })
        })
      },
      { threshold: 0.18 },
    )
    io.observe(grid)
    return () => io.disconnect()
  }, [])

  return (
    <section className="section services" id="services">
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <div ref={gridRef} className="services-grid">
        {t.services.map((s) => (
          <article className="service card-spotlight" key={s.num} {...spot}>
            <span className="service-num">{s.num}</span>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.description}</p>
            <ul className="service-tags">
              {s.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
