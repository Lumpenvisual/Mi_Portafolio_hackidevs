import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../components/Footer'
import { AppProvider } from '../lib/AppContext'

const renderFooter = () =>
  render(
    <AppProvider>
      <Footer />
    </AppProvider>,
  )

describe('Footer', () => {
  it('renders the current year', () => {
    renderFooter()
    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument()
  })

  it('renders Medellín, Colombia', () => {
    renderFooter()
    expect(screen.getByText('Medellín, Colombia')).toBeInTheDocument()
  })

  it('renders Jacky Gutiérrez', () => {
    renderFooter()
    expect(screen.getByText(/Jacky Gutiérrez/)).toBeInTheDocument()
  })

  it('renders a <footer> landmark', () => {
    renderFooter()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
