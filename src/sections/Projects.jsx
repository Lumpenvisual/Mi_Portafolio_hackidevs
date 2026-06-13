import { useEffect, useRef } from 'react'
import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import ProjectList from '../components/ProjectList'

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
  { videoId: 'NtAlZCkbkh8', platform: 'YT · Short' },
  { videoId: 'rqbNBqjMtEA', platform: 'YT · Short' },
  { videoId: 'wrhCjN-KxBM', platform: 'YT · Short' },
  { videoId: 'GAcKzQ28XI0', platform: 'YT · Short' },
  { videoId: 'octP-msK8pY', platform: 'YT · Short' },
  { videoId: 'ilzk5sFPpFE', platform: 'YT · Short' },
]

const localized = {
  es: {
    sectionLabel: 'Videos',
    title: (
      <>
        <em>cine</em>, <em>archivo</em> y <em>periodismo</em> visual.
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
      'Casa en venta Ricaurte',
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
        name: 'Fausto Murillo',
        subtitle: 'Podcast del referente fitness en español',
        role: 'Edición de podcast',
        description:
          'Edición y postproducción del podcast de Fausto Murillo, una de las voces más reconocidas del fitness en habla hispana. Ritmo conversacional, cortes limpios y entrega lista para YouTube y plataformas de audio.',
        tags: ['Podcast', 'Edición', 'Postproducción'],
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
        subtitle: 'Proyecto cultural — collage y música en vivo',
        role: 'Registro de evento',
        description:
          'Registro audiovisual de Mandrágora, proyecto cultural que cruza collage y música en vivo. Atmósfera, ritmo y memoria de una noche irrepetible.',
        tags: ['Registro', 'Cultura', 'Música'],
      },
    ],
  },
  en: {
    sectionLabel: 'Videos',
    title: (
      <>
        <em>cinema</em>, <em>archive</em> and visual <em>journalism</em>.
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
      'Casa en venta Ricaurte',
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
        name: 'Fausto Murillo',
        subtitle: 'Podcast by the Spanish-speaking fitness icon',
        role: 'Podcast editing',
        description:
          'Editing and post-production for Fausto Murillo’s podcast — one of the leading voices in Spanish-language fitness. Conversational pacing, clean cuts and delivery ready for YouTube and audio platforms.',
        tags: ['Podcast', 'Editing', 'Post-production'],
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
        subtitle: 'Cultural project — collage & live music',
        role: 'Event documentation',
        description:
          'Audiovisual documentation of Mandrágora, a cultural project where collage meets live music. Atmosphere, rhythm and the memory of a one-of-a-kind night.',
        tags: ['Documentation', 'Culture', 'Music'],
      },
    ],
  },
}

export default function Projects() {
  const { lang } = useApp()
  const t = localized[lang]
  const projects = baseProjects.map((p, i) => ({
    ...p,
    ...t.items[i],
    href: `https://www.youtube.com/watch?v=${p.videoId}`,
    cta: t.cta,
  }))
  const reels = reelsBase.map((r, i) => ({ ...r, title: t.reelTitles[i] }))
  const headRef = useReveal()
  const reelsRef = useReveal({ delay: 100 })
  const trackRef = useRef(null)

  // Drag-to-scroll the reels shelf with inertia (GSAP Draggable + InertiaPlugin,
  // lazy-imported to stay out of the initial bundle, like the Career timeline).
  // Touch devices already scroll natively, so only wire it up for fine pointers;
  // skipped entirely under reduced motion. Snaps to the 220px card step.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let draggable = null
    let cancelled = false
    let gsapRef = null

    Promise.all([
      import('gsap'),
      import('gsap/Draggable'),
      import('gsap/InertiaPlugin'),
    ]).then(([{ gsap }, { Draggable }, { InertiaPlugin }]) => {
      if (cancelled) return
      gsap.registerPlugin(Draggable, InertiaPlugin)
      gsapRef = gsap
      el.style.scrollSnapType = 'none'
      const proxy = document.createElement('div')
      let startScroll = 0
      const applyScroll = function () {
        el.scrollLeft = startScroll - this.x // browser clamps to [0, maxScroll]
      }
      ;[draggable] = Draggable.create(proxy, {
        type: 'x',
        trigger: el,
        inertia: true,
        dragClickables: true, // keep reel links clickable; real drags suppress click
        onPressInit() {
          gsap.killTweensOf(proxy)
          startScroll = el.scrollLeft
          gsap.set(proxy, { x: 0 })
        },
        onDrag: applyScroll,
        onThrowUpdate: applyScroll,
      })
    })

    return () => {
      cancelled = true
      if (draggable) draggable.kill()
      if (gsapRef) gsapRef.killTweensOf?.(draggable?.target)
      if (el) el.style.scrollSnapType = ''
    }
  }, [])

  return (
    <section className="section projects" id="work">
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <ProjectList items={projects} horizontal />

      <div ref={reelsRef} data-reveal className="reels-shelf">
        <header className="reels-head">
          <span className="section-label">{t.reelsLabel}</span>
          <h3 className="reels-title">{t.reelsHeadline}</h3>
        </header>

        <ul className="reels-track" ref={trackRef}>
          {reels.map((r, i) => (
            <li key={i} className="reel-item">
              <a
                href={`https://www.youtube.com/watch?v=${r.videoId}`}
                className="reel-card"
                target="_blank"
                rel="noreferrer"
                aria-label={`${r.title} — YouTube (${t.reelsLabel})`}
              >
                <div className="reel-thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${r.videoId}/hqdefault.jpg`}
                    alt={r.title}
                    width="480"
                    height="360"
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => e.currentTarget.classList.add('loaded')}
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
