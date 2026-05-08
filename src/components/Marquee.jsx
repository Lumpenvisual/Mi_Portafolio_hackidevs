import { useApp } from '../lib/AppContext'

const itemsByLang = {
  es: ['Comunicación', 'Storytelling', 'Edición', 'Vibe Coding'],
  en: ['Communication', 'Storytelling', 'Editing', 'Vibe Coding'],
}

export default function Marquee() {
  const { lang } = useApp()
  const items = itemsByLang[lang]
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-text">{item}</span>
            <span className="marquee-bullet">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
