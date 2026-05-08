import { useApp } from '../lib/AppContext'

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

  return (
    <section className="section services" id="services">
      <header className="section-head">
        <span className="section-num">02</span>
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <div className="services-grid">
        {t.services.map((s) => (
          <article className="service" key={s.num}>
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
