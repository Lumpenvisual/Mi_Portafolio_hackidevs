import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Hero from '../sections/Hero'
import { AppProvider } from '../lib/AppContext'

describe('Hero', () => {
  beforeEach(() => {
    localStorage.setItem('lang', 'es')
  })

  it('renders the section with id="top"', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(document.getElementById('top')).toBeInTheDocument()
  })

  it('renders h1 title', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders location in Spanish', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByText('Medellín, Colombia')).toBeInTheDocument()
  })

  it('renders "Conóceme" CTA linking to #about', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByRole('link', { name: /conóceme/i })).toHaveAttribute('href', '#about')
  })

  it('renders contact CTA linking to #contact', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByRole('link', { name: /hablemos/i })).toHaveAttribute('href', '#contact')
  })

  it('renders English copy when lang is en', () => {
    localStorage.setItem('lang', 'en')
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByRole('link', { name: /get to know me/i })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: /let's talk/i })).toHaveAttribute('href', '#contact')
  })

  it('renders focus and status labels in Spanish', () => {
    render(<AppProvider><Hero /></AppProvider>)
    expect(screen.getByText('Foco')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
  })
})
