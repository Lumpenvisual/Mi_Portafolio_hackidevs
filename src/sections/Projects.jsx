import { useApp } from '../lib/AppContext'

const baseProjects = [
  { num: '01', videoId: 'ULrllSX12UQ', accent: '#c8553d' },
  { num: '02', videoId: '_-7ZI3wq4Q0', accent: '#5d6b4f' },
  { num: '03', videoId: 'LwCcRuVgFV4', accent: '#8a6a3f' },
  { num: '04', videoId: 'iI-uxTikYIY', accent: '#7a5577' },
  { num: '05', videoId: 'ig_583LphJU', accent: '#3f5d6b' },
  { num: '06', videoId: 'hmnJYny92L8', accent: '#4a3f5d' },
]

const localized = {
  es: {
    sectionLabel: 'Proyectos seleccionados',
    title: (
      <>
        Seis piezas de <em>cine</em>, <em>archivo</em> y{' '}
        <em>periodismo</em> visual.
      </>
    ),
    cta: 'Ver en YouTube',
    items: [
      {
        name: 'COMER',
        subtitle: 'Rigoberto, agricultor de San Sebastián de Palmitas',
        role: 'Documental',
        description:
          'Documental sobre soberanía alimentaria y vida campesina en las afueras de Medellín.',
        tags: ['Documental', 'Dirección', 'Edición'],
      },
      {
        name: 'Café Luthier',
        subtitle: 'Música y oficio',
        role: 'Pieza editorial',
        description:
          'Retrato de un lugar donde la música y el café se encuentran — y donde el oficio se vuelve atmósfera.',
        tags: ['Retrato', 'Editorial', 'Música'],
      },
      {
        name: 'Archivos en Peligro',
        subtitle: 'Patrimonio documental en riesgo',
        role: 'Divulgación científica',
        description:
          'Pieza de divulgación sobre el patrimonio documental en riesgo, en colaboración con la British Library.',
        tags: ['Divulgación', 'Archivo', 'Investigación'],
      },
      {
        name: 'Zenzual',
        subtitle: 'Exploración sensorial',
        role: 'Audiovisual experimental',
        description:
          'Pieza audiovisual de exploración sensorial y movimiento — cuerpo, ritmo y cámara.',
        tags: ['Experimental', 'Movimiento', 'Sensorial'],
      },
      {
        name: 'Campaña social',
        subtitle: 'Comunicación de impacto',
        role: 'Pieza institucional',
        description:
          'Comunicación de impacto para una causa de interés público — mensaje, claridad y emoción.',
        tags: ['Social', 'Campaña', 'Storytelling'],
      },
      {
        name: 'Mandrágora',
        subtitle: 'Cortometraje experimental',
        role: 'Cortometraje',
        description:
          'Cortometraje de atmósfera y narrativa visual experimental. Ritmo lento, textura densa.',
        tags: ['Cortometraje', 'Atmósfera', 'Narrativa'],
      },
    ],
  },
  en: {
    sectionLabel: 'Selected Work',
    title: (
      <>
        Six pieces of <em>cinema</em>, <em>archive</em> and visual{' '}
        <em>journalism</em>.
      </>
    ),
    cta: 'Watch on YouTube',
    items: [
      {
        name: 'COMER',
        subtitle: 'Rigoberto, farmer from San Sebastián de Palmitas',
        role: 'Documentary',
        description:
          'Documentary on food sovereignty and rural life on the outskirts of Medellín.',
        tags: ['Documentary', 'Direction', 'Editing'],
      },
      {
        name: 'Café Luthier',
        subtitle: 'Music & craft',
        role: 'Editorial piece',
        description:
          'A portrait of a place where music and coffee meet — and where craft turns into atmosphere.',
        tags: ['Portrait', 'Editorial', 'Music'],
      },
      {
        name: 'Archives at Risk',
        subtitle: 'Endangered documentary heritage',
        role: 'Scientific outreach',
        description:
          'Outreach piece on documentary heritage at risk, in collaboration with the British Library.',
        tags: ['Outreach', 'Archive', 'Research'],
      },
      {
        name: 'Zenzual',
        subtitle: 'Sensory exploration',
        role: 'Experimental audiovisual',
        description:
          'Audiovisual piece of sensory exploration and movement — body, rhythm and camera.',
        tags: ['Experimental', 'Movement', 'Sensory'],
      },
      {
        name: 'Social Campaign',
        subtitle: 'Impact communication',
        role: 'Institutional piece',
        description:
          'Impact communication for a public-interest cause — message, clarity and emotion.',
        tags: ['Social', 'Campaign', 'Storytelling'],
      },
      {
        name: 'Mandrágora',
        subtitle: 'Experimental short film',
        role: 'Short film',
        description:
          'Experimental short film with atmosphere and visual narrative. Slow rhythm, dense texture.',
        tags: ['Short film', 'Atmosphere', 'Narrative'],
      },
    ],
  },
}

const handleThumbError = (e, videoId) => {
  e.currentTarget.onerror = null
  e.currentTarget.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export default function Projects() {
  const { lang } = useApp()
  const t = localized[lang]
  const projects = baseProjects.map((p, i) => ({ ...p, ...t.items[i] }))

  return (
    <section className="section projects" id="work">
      <header className="section-head">
        <span className="section-num">03</span>
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <ul className="projects-list">
        {projects.map((p) => (
          <li key={p.num} className="project">
            <a
              href={`https://www.youtube.com/watch?v=${p.videoId}`}
              className="project-link"
              target="_blank"
              rel="noreferrer"
            >
              <div className="project-meta">
                <span className="project-num">{p.num}</span>
                <span className="project-year">{p.role}</span>
              </div>

              <div className="project-main">
                <h3 className="project-name">{p.name}</h3>
                <p className="project-role">{p.subtitle}</p>
                <p className="project-desc">{p.description}</p>
                <ul className="project-tags">
                  {p.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>

              <div
                className="project-thumb"
                style={{ '--thumb-accent': p.accent }}
              >
                <img
                  src={`https://i.ytimg.com/vi/${p.videoId}/maxresdefault.jpg`}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => handleThumbError(e, p.videoId)}
                />
                <span className="project-cta">
                  {t.cta} <span className="arr">↗</span>
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
