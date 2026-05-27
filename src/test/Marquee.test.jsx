import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Marquee from '../components/Marquee'
import { AppProvider } from '../lib/AppContext'

describe('Marquee', () => {
  beforeEach(() => {
    localStorage.setItem('lang', 'es')
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<AppProvider><Marquee /></AppProvider>)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders Spanish items by default', () => {
    render(<AppProvider><Marquee /></AppProvider>)
    expect(screen.getAllByText('Comunicación').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Storytelling').length).toBeGreaterThan(0)
  })

  it('renders English items when lang is en', () => {
    localStorage.setItem('lang', 'en')
    render(<AppProvider><Marquee /></AppProvider>)
    expect(screen.getAllByText('Communication').length).toBeGreaterThan(0)
  })

  it('repeats items for continuous scroll effect', () => {
    render(<AppProvider><Marquee /></AppProvider>)
    // Items are repeated 4× (4 copies of 4 items = 16 total spans)
    const items = screen.getAllByText('Edición')
    expect(items.length).toBe(4)
  })
})
