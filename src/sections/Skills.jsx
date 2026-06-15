import { useApp } from '../lib/AppContext'
import { useReveal } from '../hooks/useReveal'
import { useSpotlight } from '../hooks/useSpotlight'

const data = {
  es: {
    sectionLabel: 'Habilidades',
    title: (
      <>
        Las <em>herramientas</em> del oficio.
      </>
    ),
    groups: [
      {
        label: 'Imagen',
        items: [
          'Fotografía documental',
          'Retrato',
          'Dirección de arte',
          'Luz natural y artificial',
        ],
      },
      {
        label: 'Edición',
        items: ['Lightroom', 'Adobe Suite', 'DaVinci Resolve', 'Color'],
      },
      {
        label: 'Narrativa',
        items: [
          'Storytelling visual',
          'Video documental',
          'Guion',
          'Composición de escena',
        ],
      },
    ],
  },
  en: {
    sectionLabel: 'Skills',
    title: (
      <>
        The <em>tools</em> of the craft.
      </>
    ),
    groups: [
      {
        label: 'Image',
        items: [
          'Documentary photography',
          'Portrait',
          'Art direction',
          'Natural & artificial light',
        ],
      },
      {
        label: 'Editing',
        items: ['Lightroom', 'Adobe Suite', 'DaVinci Resolve', 'Color'],
      },
      {
        label: 'Storytelling',
        items: [
          'Visual storytelling',
          'Documentary video',
          'Scriptwriting',
          'Scene composition',
        ],
      },
    ],
  },
}

// `embedded` renders just the content (no <section>/eyebrow/reveal) so it can
// live inside the About disclosure panels.
export default function Skills({ embedded = false }) {
  const { lang } = useApp()
  const t = data[lang]
  const headRef = useReveal()
  const bodyRef = useReveal({ delay: 150 })
  const spot = useSpotlight()

  const groups = (
    <ul className="skill-groups">
      {t.groups.map((g) => (
        <li key={g.label} className="skill-group card-spotlight" {...spot}>
          <span className="skill-group-label">{g.label}</span>
          <ul className="skill-tags">
            {g.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )

  if (embedded) {
    return (
      <div className="embed-block">
        <h3 className="section-title embed-title">{t.title}</h3>
        {groups}
      </div>
    )
  }

  return (
    <section className="section skills" id="skills" aria-label={t.sectionLabel}>
      <header ref={headRef} data-reveal className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <div ref={bodyRef} data-reveal>
        {groups}
      </div>
    </section>
  )
}
