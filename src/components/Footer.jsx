import { useApp } from '../lib/AppContext'

const copy = {
  es: {
    sig: (year) => (
      <>
        © {year} &mdash; <em>Jacky Gutiérrez</em> · hackidevs
      </>
    ),
    location: 'Medellín, Colombia',
  },
  en: {
    sig: (year) => (
      <>
        © {year} &mdash; <em>Jacky Gutiérrez</em> · hackidevs
      </>
    ),
    location: 'Medellín, Colombia',
  },
}

export default function Footer() {
  const { lang } = useApp()
  const t = copy[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-meta">{t.sig(year)}</p>
        <p className="footer-meta">
          <span>{t.location}</span>
        </p>
      </div>
    </footer>
  )
}
