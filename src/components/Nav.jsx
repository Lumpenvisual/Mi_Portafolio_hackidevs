import { useApp } from '../lib/AppContext'

const navCopy = {
  es: {
    about: 'Sobre mí',
    services: 'Servicios',
    work: 'Proyectos',
    career: 'Trayectoria',
    contact: 'Contacto',
    themeAria: (t) => (t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'),
    langAria: 'Switch to English',
  },
  en: {
    about: 'About',
    services: 'Services',
    work: 'Work',
    career: 'Career',
    contact: 'Contact',
    themeAria: (t) => (t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'),
    langAria: 'Cambiar a español',
  },
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.9" y1="4.9" x2="7" y2="7" />
    <line x1="17" y1="17" x2="19.1" y2="19.1" />
    <line x1="4.9" y1="19.1" x2="7" y2="17" />
    <line x1="17" y1="7" x2="19.1" y2="4.9" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export default function Nav() {
  const { lang, theme, toggleLang, toggleTheme } = useApp()
  const t = navCopy[lang]

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo">
          Jacky <em>Gutiérrez</em>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#about">{t.about}</a>
          <a href="#services">{t.services}</a>
          <a href="#work">{t.work}</a>
          <a href="#career">{t.career}</a>
          <a href="#contact">{t.contact}</a>
        </nav>
        <div className="nav-tools">
          <button
            className="icon-btn theme"
            type="button"
            onClick={toggleTheme}
            aria-label={t.themeAria(theme)}
            title={t.themeAria(theme)}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="icon-btn lang"
            type="button"
            onClick={toggleLang}
            aria-label={t.langAria}
            title={t.langAria}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </div>
    </header>
  )
}
