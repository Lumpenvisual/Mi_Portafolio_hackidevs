import { useApp } from '../lib/AppContext'

const baseProjects = [
  { num: '01', videoId: 'ULrllSX12UQ', accent: '#c8553d' },
  { num: '02', videoId: '_-7ZI3wq4Q0', accent: '#5d6b4f' },
  { num: '03', videoId: 'LwCcRuVgFV4', accent: '#8a6a3f' },
  { num: '04', videoId: '9dQOVCt28E8', accent: '#a87836' },
  { num: '05', videoId: 'ig_583LphJU', accent: '#3f5d6b' },
  { num: '06', videoId: 'hmnJYny92L8', accent: '#4a3f5d' },
]

// Reels — YouTube Shorts. Titles taken from each video's oEmbed metadata.
const reelsBase = [
  { videoId: 'B4mf6aw48FQ', platform: 'YT · Short' },
  { videoId: 'rqbNBqjMtEA', platform: 'YT · Short' },
  { videoId: 'wrhCjN-KxBM', platform: 'YT · Short' },
  { videoId: 'GAcKzQ28XI0', platform: 'YT · Short' },
  { videoId: 'octP-msK8pY', platform: 'YT · Short' },
  { videoId: 'ilzk5sFPpFE', platform: 'YT · Short' },
]

const localized = {
  es: {
    sectionLabel: 'Proyectos',
    title: (
      <>
        Seis piezas de <em>cine</em>, <em>archivo</em> y{' '}
        <em>periodismo</em> visual.
      </>
    ),
    cta: 'Ver en YouTube',
    reelsLabel: 'Reels',
    reelsHeadline: (
      <>
        Piezas en <em>vertical</em> &mdash; ritmo corto.
      </>
    ),
    reelTitles: [
      'Un Bitcoin x Un Café',
      '¿Quiénes son los verdaderos millonarios?',
      'Estilos de vida saludable',
      'Alquimia con tijeras',
      'Blusa Mily Pink',
      'Reel para redes sociales',
    ],
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
        name: 'Papá en París',
        subtitle: 'De −50.000 € a millonario',
        role: 'Producción & Edición',
        description:
          'Retrato en primera persona de una reinvención financiera: el camino desde la deuda hasta la libertad económica, contado con ritmo de entrevista íntima.',
        tags: ['Producción', 'Edición', 'Storytelling'],
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
    sectionLabel: 'Projects',
    title: (
      <>
        Six pieces of <em>cinema</em>, <em>archive</em> and visual{' '}
        <em>journalism</em>.
      </>
    ),
    cta: 'Watch on YouTube',
    reelsLabel: 'Reels',
    reelsHeadline: (
      <>
        Pieces in <em>vertical</em> &mdash; short rhythm.
      </>
    ),
    reelTitles: [
      'One Bitcoin × One Coffee',
      'Who are the real millionaires?',
      'Healthy lifestyles',
      'Alchemy with scissors',
      'Blusa Mily Pink',
      'Reel for social media',
    ],
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
        name: 'Papá en París',
        subtitle: 'From −€50,000 to millionaire',
        role: 'Production & Editing',
        description:
          'A first-person portrait of financial reinvention: the journey from debt to economic freedom, told with the rhythm of an intimate interview.',
        tags: ['Production', 'Editing', 'Storytelling'],
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
  const reels = reelsBase.map((r, i) => ({ ...r, title: t.reelTitles[i] }))

  return (
    <section className="section projects" id="work">
      <header className="section-head">
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

      <div className="reels-shelf">
        <header className="reels-head">
          <span className="section-label">{t.reelsLabel}</span>
          <h3 className="reels-title">{t.reelsHeadline}</h3>
        </header>

        <div className="reels-track" role="list">
          {reels.map((r, i) => (
            <a
              key={i}
              href={`https://www.youtube.com/watch?v=${r.videoId}`}
              className="reel-card"
              target="_blank"
              rel="noreferrer"
              role="listitem"
            >
              <div className="reel-thumb">
                <img
                  src={`https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`}
                  alt={r.title}
                  loading="lazy"
                />
                <span className="reel-overlay">
                  <span className="reel-play">▶</span>
                </span>
              </div>
              <div className="reel-meta">
                <span className="reel-title-text">{r.title}</span>
                <span className="reel-info">{r.platform}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
