import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import Nav from '../components/Nav'
import { AppProvider } from '../lib/AppContext'

const renderNav = () => render(<AppProvider><Nav /></AppProvider>)

describe('Nav', () => {
  beforeEach(() => {
    localStorage.setItem('lang', 'es')
  })

  it('renders all nav links in Spanish', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Servicios' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Videos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Fotografía' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Diseño' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Desarrollo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contacto' })).toBeInTheDocument()
  })

  it('nav links point to correct section anchors', () => {
    renderNav()
    expect(screen.getByRole('link', { name: 'Sobre mí' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Servicios' })).toHaveAttribute('href', '#services')
    expect(screen.getByRole('link', { name: 'Videos' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'Diseño' })).toHaveAttribute('href', '#design')
    expect(screen.getByRole('link', { name: 'Desarrollo' })).toHaveAttribute('href', '#dev')
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '#contact')
  })

  it('theme button has accessible aria-label', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /modo/i })).toBeInTheDocument()
  })

  it('lang button shows EN when in Spanish', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument()
  })

  it('switches to English on lang button click', async () => {
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /switch to english/i }))
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Videos' })).toBeInTheDocument()
  })

  it('lang button shows ES when in English', async () => {
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /switch to english/i }))
    expect(screen.getByRole('button', { name: /cambiar a español/i })).toBeInTheDocument()
  })

  it('logo link points to #top', () => {
    renderNav()
    expect(screen.getByRole('link', { name: /jacky/i })).toHaveAttribute('href', '#top')
  })
})
