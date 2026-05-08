import { useApp } from '../lib/AppContext'

const data = {
  es: {
    sectionLabel: 'Trayectoria',
    title: (
      <>
        Una década entre <em>cámaras</em>, <em>luces</em> e historias
        contadas con <em>sentido humano</em>.
      </>
    ),
    milestones: [
      {
        year: '2025',
        title: 'Premio TAL & Hackathon EAFIT',
        description:
          'Premio TAL a la Dirección de Fotografía. Participación en el Hackathon FindHub de la Universidad EAFIT.',
      },
      {
        year: '2024 — 25',
        title: 'Beca MinTIC & Tallerista BIAM',
        description:
          'Beca de formación en tecnología del Ministerio TIC de Colombia. Tallerista en el Bicentenario de las Artes de Medellín.',
      },
      {
        year: '2023 — 24',
        title: 'British Library & University of Edinburgh',
        description:
          'Investigación y producción audiovisual en colaboración con la British Library y la Universidad de Edimburgo.',
      },
      {
        year: '2022 — 23',
        title: 'FAO Naciones Unidas & publicación',
        description:
          'Producción audiovisual para la Organización de las Naciones Unidas para la Alimentación y la Agricultura. Publicación de libro.',
      },
      {
        year: '2013 — 21',
        title: 'Universo Centro, Medellín',
        description:
          'Ocho años de trabajo periodístico, editorial y audiovisual con el medio independiente Universo Centro.',
      },
    ],
  },
  en: {
    sectionLabel: 'Career',
    title: (
      <>
        A decade between <em>cameras</em>, <em>lights</em> and stories told
        with <em>human meaning</em>.
      </>
    ),
    milestones: [
      {
        year: '2025',
        title: 'TAL Award & EAFIT Hackathon',
        description:
          'TAL Award for Cinematography. Participated in EAFIT University’s FindHub Hackathon.',
      },
      {
        year: '2024 — 25',
        title: 'MinTIC Scholarship & BIAM Workshop',
        description:
          'Tech-training scholarship from Colombia’s Ministry of ICT. Workshop facilitator at the Medellín Arts Bicentennial (BIAM).',
      },
      {
        year: '2023 — 24',
        title: 'British Library & University of Edinburgh',
        description:
          'Audiovisual research and production in collaboration with the British Library and the University of Edinburgh.',
      },
      {
        year: '2022 — 23',
        title: 'FAO United Nations & book publication',
        description:
          'Audiovisual production for the UN Food and Agriculture Organization. Book publication.',
      },
      {
        year: '2013 — 21',
        title: 'Universo Centro, Medellín',
        description:
          'Eight years of journalism, editorial and audiovisual work with the independent outlet Universo Centro.',
      },
    ],
  },
}

export default function Career() {
  const { lang } = useApp()
  const t = data[lang]

  return (
    <section className="section career" id="career">
      <header className="section-head">
        <span className="section-num">04</span>
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="section-title">{t.title}</h2>

      <ol className="timeline">
        {t.milestones.map((m, i) => (
          <li className="timeline-row" key={i}>
            <span className="timeline-year">{m.year}</span>
            <div className="timeline-body">
              <h3 className="timeline-title">{m.title}</h3>
              <p className="timeline-desc">{m.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
