import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { AppProvider, useApp } from '../lib/AppContext'

function ContextReader() {
  const { lang, theme, toggleLang, toggleTheme } = useApp()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleLang}>toggle lang</button>
      <button onClick={toggleTheme}>toggle theme</button>
    </div>
  )
}

describe('AppContext', () => {
  it('defaults to "es" when no saved preference', () => {
    render(<AppProvider><ContextReader /></AppProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('restores saved lang from localStorage', () => {
    localStorage.setItem('lang', 'en')
    render(<AppProvider><ContextReader /></AppProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('toggleLang switches es → en → es', async () => {
    const user = userEvent.setup()
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle lang'))
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    await user.click(screen.getByText('toggle lang'))
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('persists lang to localStorage', async () => {
    const user = userEvent.setup()
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle lang'))
    expect(localStorage.getItem('lang')).toBe('en')
  })

  it('defaults to "light" theme when system prefers light', () => {
    render(<AppProvider><ContextReader /></AppProvider>)
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('restores saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    render(<AppProvider><ContextReader /></AppProvider>)
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('toggleTheme switches light → dark → light', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle theme'))
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    await user.click(screen.getByText('toggle theme'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('persists theme to localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle theme'))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('sets document.documentElement.lang on change', async () => {
    const user = userEvent.setup()
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle lang'))
    expect(document.documentElement.lang).toBe('en')
  })

  it('sets document data-theme attribute on change', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    render(<AppProvider><ContextReader /></AppProvider>)
    await user.click(screen.getByText('toggle theme'))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('throws when useApp is used outside AppProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<ContextReader />)).toThrow('useApp must be used inside AppProvider')
    spy.mockRestore()
  })
})
