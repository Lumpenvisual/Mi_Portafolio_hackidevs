import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import Fotografia from '../sections/Fotografia'
import { AppProvider } from '../lib/AppContext'

const renderSection = () =>
  render(
    <AppProvider>
      <Fotografia />
    </AppProvider>,
  )

describe('Fotografia lightbox accessibility', () => {
  beforeEach(() => {
    localStorage.setItem('lang', 'es')
  })

  it('opens a modal dialog and moves focus to the close button', async () => {
    const user = userEvent.setup()
    renderSection()

    await user.click(screen.getByRole('button', { name: 'Ver fotografía 1' }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(document.activeElement).toHaveClass('lightbox-close')
  })

  it('closes on Escape and restores focus to the triggering thumbnail', async () => {
    const user = userEvent.setup()
    renderSection()

    const trigger = screen.getByRole('button', { name: 'Ver fotografía 1' })
    await user.click(trigger)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
