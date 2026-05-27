import { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const SUPPORTED_LANGS = ['es', 'en']
const SUPPORTED_THEMES = ['light', 'dark']

const detectLang = () => {
  if (typeof window === 'undefined') return 'es'
  const saved = localStorage.getItem('lang')
  if (SUPPORTED_LANGS.includes(saved)) return saved
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase()
  return SUPPORTED_LANGS.includes(nav) ? nav : 'es'
}

const detectTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (SUPPORTED_THEMES.includes(saved)) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState(detectLang)
  const [theme, setTheme] = useState(detectTheme)

  useEffect(() => {
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (localStorage.getItem('theme')) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light')
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleLang = () => setLang((l) => (l === 'es' ? 'en' : 'es'))
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <AppContext.Provider
      value={{ lang, theme, toggleLang, toggleTheme, setLang, setTheme }}
    >
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
