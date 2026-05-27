import { useApp } from '../lib/AppContext'

const copy = {
  es: {
    sectionLabel: 'Contacto',
    title: (
      <>
        ¿Tienes algo
        <br />
        <em>que contar</em>?
      </>
    ),
    email: 'lumpenvisual@gmail.com',
    findMe: 'Encuéntrame en',
    availability: 'Disponibilidad',
    availabilityCopy: (
      <>
        Abierta a colaboraciones, proyectos y conversaciones interesantes.
        <br />
        Tel <em className="contact-phone">+57&nbsp;323&nbsp;437&nbsp;42&nbsp;00</em>.
      </>
    ),
  },
  en: {
    sectionLabel: 'Contact',
    title: (
      <>
        Got something
        <br />
        <em>to tell</em>?
      </>
    ),
    email: 'lumpenvisual@gmail.com',
    findMe: 'Find me at',
    availability: 'Availability',
    availabilityCopy: (
      <>
        Open to collaborations, projects and interesting conversations.
        <br />
        Phone <em className="contact-phone">+57&nbsp;323&nbsp;437&nbsp;42&nbsp;00</em>.
      </>
    ),
  },
}

const links = [
  { label: 'Instagram', href: 'https://www.instagram.com/jacky.visual/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jackygutierrez/' },
  { label: 'GitHub', href: 'https://github.com/Lumpenvisual' },
  { label: 'YouTube', href: 'https://www.youtube.com/@Jackie.visual' },
]

const newTabLabel = { es: 'abre en nueva pestaña', en: 'opens in new tab' }

export default function Contact() {
  const { lang } = useApp()
  const t = copy[lang]

  return (
    <section className="section contact" id="contact">
      <header className="section-head">
        <span className="section-label">{t.sectionLabel}</span>
      </header>

      <h2 className="contact-title">{t.title}</h2>

      <a className="contact-mail" href={`mailto:${t.email}`}>
        {t.email}
        <span className="arr">↗</span>
      </a>

      <div className="contact-grid">
        <div className="contact-col">
          <span className="label">{t.findMe}</span>
          <ul className="contact-links">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${l.label} (${newTabLabel[lang]})`}
                >
                  {l.label}
                  <span className="arr" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="contact-col">
          <span className="label">{t.availability}</span>
          <p>{t.availabilityCopy}</p>
        </div>
      </div>
    </section>
  )
}
