import { useState, useEffect } from 'react'
import { useApp } from '../lib/AppContext'

const navCopy = {
  es: {
    about: 'Sobre mí',
    services: 'Servicios',
    work: 'Videos',
    fotografia: 'Fotografía',
    design: 'Diseño',
    dev: 'Desarrollo',
    contact: 'Contacto',
    themeAria: (t) =>
      t === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
    langAria: 'Switch to English',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
  },
  en: {
    about: 'About',
    services: 'Services',
    work: 'Videos',
    fotografia: 'Photography',
    design: 'Design',
    dev: 'Development',
    contact: 'Contact',
    themeAria: (t) =>
      t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
    langAria: 'Cambiar a español',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
}

const NAV_IDS = [
  'about',
  'services',
  'work',
  'fotografia',
  'design',
  'dev',
  'contact',
]

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

const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="3" y1="7" x2="21" y2="7" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="17" x2="21" y2="17" />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

export default function Nav() {
  const { lang, theme, toggleLang, toggleTheme } = useApp()
  const t = navCopy[lang]
  const [activeSection, setActiveSection] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        }),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    )
    NAV_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { href: '#about', label: t.about, id: 'about' },
    { href: '#services', label: t.services, id: 'services' },
    { href: '#work', label: t.work, id: 'work' },
    { href: '#fotografia', label: t.fotografia, id: 'fotografia' },
    { href: '#design', label: t.design, id: 'design' },
    { href: '#dev', label: t.dev, id: 'dev' },
    { href: '#contact', label: t.contact, id: 'contact' },
  ]

  return (
    <header className={`nav${isOpen ? ' nav--open' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" onClick={closeMenu}>
          Jacky <em>Gutiérrez</em>
        </a>

        <nav className="nav-links" aria-label="Primary" id="nav-menu">
          {navLinks.map(({ href, label, id }) => (
            <a
              key={id}
              href={href}
              aria-current={activeSection === id ? 'location' : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
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
          <button
            className="icon-btn hamburger"
            type="button"
            aria-label={isOpen ? t.closeMenu : t.openMenu}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
