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

// Reels — YouTube Shorts (45), grouped for the shelf:
//   ba   → Antes y después: white-background split-screen edits (before/after)
//   ai   → Avatares con IA: AI-generated avatar pieces
//   reel → everything else
// Each group renders sorted by its localized title (see REEL_GROUPS below).
// Some APEX shorts are unlisted on YouTube (they play from the link).
const reelsBase = [
  {
    videoId: '8Qel-m_Z7Do',
    group: 'ba',
    es: 'Video marketing · marca personal',
    en: 'Video marketing · personal brand',
  },
  {
    videoId: 'OyOpxs01_7I',
    group: 'ba',
    es: 'Video marketing · producto marca blanca',
    en: 'Video marketing · white-label product',
  },
  {
    videoId: 'tYXlG6ggERU',
    group: 'ba',
    es: 'Video marketing · odontología',
    en: 'Video marketing · dentistry',
  },
  {
    videoId: 'l_Fi1brDKB0',
    group: 'ba',
    es: 'Proceso de edición de un reel',
    en: 'Editing process of a reel',
  },
  { videoId: 'eotWJ5tufmQ', group: 'ba', es: 'Real estate', en: 'Real estate' },
  {
    videoId: '7DhxVtRFuYI',
    group: 'ai',
    es: 'Reel avatar',
    en: 'Avatar reel',
  },
  {
    videoId: 'Z-LG5UVXeso',
    group: 'ai',
    es: 'APEX IA',
    en: 'APEX AI',
  },
  {
    videoId: 'W-DJnFDVxJo',
    group: 'ai',
    es: 'APEX IA',
    en: 'APEX AI',
  },
  {
    videoId: 'ERlh3ZaOOuU',
    group: 'ai',
    es: 'APEX IA · Halloween',
    en: 'APEX AI · Halloween',
  },
  {
    videoId: 'NQ2Pc2QPlc0',
    group: 'ai',
    es: 'APEX IA · Halloween',
    en: 'APEX AI · Halloween',
  },
  {
    videoId: '3LTignHsNWY',
    group: 'ai',
    es: 'Reel avatar',
    en: 'Avatar reel',
  },
  {
    videoId: 'TXt6Z6YN7QM',
    group: 'ai',
    es: 'Reel avatar',
    en: 'Avatar reel',
  },
  {
    videoId: 'XGEJHvUsJQ0',
    group: 'ai',
    es: 'Generación de avatar',
    en: 'Avatar generation',
  },
  {
    videoId: 'QR-Ib_6ikIk',
    group: 'reel',
    es: 'Promo La Gilipolla',
    en: 'La Gilipolla promo',
  },
  {
    videoId: 'B48cL9SRmYE',
    group: 'reel',
    es: 'Real estate · edición',
    en: 'Real estate · editing',
  },
  {
    videoId: 'MD0NtElmNSQ',
    group: 'reel',
    es: 'Real estate · edición',
    en: 'Real estate · editing',
  },
  {
    videoId: 'uN9s4tyUeLM',
    group: 'reel',
    es: 'Reel real estate',
    en: 'Real estate reel',
  },
  {
    videoId: 'NtAlZCkbkh8',
    group: 'reel',
    es: 'Casa en venta Ricaurte',
    en: 'Casa en venta Ricaurte',
  },
  {
    videoId: 'rqbNBqjMtEA',
    group: 'reel',
    es: '¿Quiénes son los verdaderos millonarios?',
    en: 'Who are the real millionaires?',
  },
  {
    videoId: 'wrhCjN-KxBM',
    group: 'reel',
    es: 'Estilos de vida saludable',
    en: 'Healthy lifestyles',
  },
  {
    videoId: 'GAcKzQ28XI0',
    group: 'reel',
    es: 'Alquimia con tijeras',
    en: 'Alchemy with scissors',
  },
  {
    videoId: 'octP-msK8pY',
    group: 'reel',
    es: 'Blusa Mily Pink',
    en: 'Blusa Mily Pink',
  },
  {
    videoId: 'ilzk5sFPpFE',
    group: 'reel',
    es: 'Reel para redes sociales',
    en: 'Reel for social media',
  },
  {
    videoId: 'AovDubqG0wE',
    group: 'reel',
    es: 'ZONADENT',
    en: 'ZONADENT',
  },
  {
    videoId: '-TTzOwwXxKM',
    group: 'reel',
    es: 'ZONADENT',
    en: 'ZONADENT',
  },
  {
    videoId: '6wewrbanfxw',
    group: 'reel',
    es: 'Posada',
    en: 'Posada',
  },
  {
    videoId: 'kMnqQhTWnCw',
    group: 'reel',
    es: 'Posada',
    en: 'Posada',
  },
  { videoId: 'YL_9e7PdlmQ', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'urrgWz-EmLY', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 's2FjUSSAkKQ', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'ZLir5KBHMlE', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'oSBrAIi8Uaw', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: '5W1Sm4H6kl8', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'gqft_rl7AwU', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'RxlUKrFsijI', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'OxyAa3EwGzA', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'zNiadGHzNRE', group: 'reel', es: 'APEX', en: 'APEX' },
  { videoId: 'vGy8LnHbIsM', group: 'reel', es: 'APEX', en: 'APEX' },
  {
    videoId: 'AmB00CCM7NU',
    group: 'reel',
    es: 'Promo de evento',
    en: 'Event promo',
  },
  {
    videoId: 'j63P3BoVY7o',
    group: 'reel',
    es: 'Cadena',
    en: 'Cadena',
  },
  {
    videoId: 'xNiLXRx2YfU',
    group: 'reel',
    es: 'Cadena',
    en: 'Cadena',
  },
  {
    videoId: 'qPDYAeMalcU',
    group: 'reel',
    es: 'Auténticas · Oigan un momento',
    en: 'Auténticas · Listen up',
  },
  {
    videoId: 'CCRm2AbzW_c',
    group: 'reel',
    es: 'Auténticas · Hay una cárcel',
    en: 'Auténticas · There is a prison',
  },
  {
    videoId: 'L8X66ELxaSg',
    group: 'reel',
    es: 'Auténticas · ¿Controlas tus emociones?',
    en: 'Auténticas · Do you control your emotions?',
  },
  {
    videoId: 'caH4g6yz0IU',
    group: 'reel',
    es: 'Auténticas · Reel',
    en: 'Auténticas · Reel',
  },
]

// Group order + per-language copy for the shelf sub-headings.
const REEL_GROUPS = ['ba', 'ai', 'reel']
const byTitle = new Intl.Collator('es', {
  sensitivity: 'base',
  ignorePunctuation: true,
  numeric: true,
})

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
    reelGroups: {
      ba: 'Antes y después · procesos de edición',
      ai: 'Avatares generados con IA',
      reel: 'Reels',
    },
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
    reelGroups: {
      ba: 'Before & after · editing process',
      ai: 'AI-generated avatars',
      reel: 'Reels',
    },
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

// One draggable row of reels. Drag-to-scroll with inertia (GSAP Draggable +
// InertiaPlugin, lazy-imported to stay out of the initial bundle). Touch
// devices already scroll natively, so only wire it up for fine pointers;
// skipped entirely under reduced motion.
function ReelTrack({ reels, label }) {
  const trackRef = useRef(null)

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
    <ul className="reels-track" ref={trackRef}>
      {reels.map((r) => (
        <li key={r.videoId} className="reel-item">
          <a
            href={`https://www.youtube.com/shorts/${r.videoId}`}
            className="reel-card"
            target="_blank"
            rel="noreferrer"
            aria-label={`${r.title} — YouTube (${label})`}
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
              <span className="reel-info">YT · Short</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  )
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
  const groups = REEL_GROUPS.map((g) => ({
    id: g,
    label: t.reelGroups[g],
    reels: reelsBase
      .filter((r) => r.group === g)
      .map((r) => ({ videoId: r.videoId, title: r[lang] }))
      .sort((a, b) => byTitle.compare(a.title, b.title)),
  }))
  const headRef = useReveal()
  const reelsRef = useReveal({ delay: 100 })

  return (
    <section className="section projects" id="work">
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <ProjectList
        items={projects}
        horizontal
        head={<h2 className="section-title">{t.title}</h2>}
      />

      <div ref={reelsRef} data-reveal className="reels-shelf">
        <header className="reels-head">
          <span className="section-label">{t.reelsLabel}</span>
          <h3 className="reels-title">{t.reelsHeadline}</h3>
        </header>

        {groups.map((g) => (
          <section key={g.id} className="reels-group" aria-label={g.label}>
            <h4 className="reels-group-title">{g.label}</h4>
            <ReelTrack reels={g.reels} label={g.label} />
          </section>
        ))}
      </div>
    </section>
  )
}
