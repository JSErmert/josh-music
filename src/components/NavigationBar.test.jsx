import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NavigationBar from './NavigationBar'

describe('NavigationBar', () => {
  it('renders the artist-name wordmark', () => {
    render(<NavigationBar />)
    expect(screen.getByText(/josh ermert/i)).toBeInTheDocument()
  })

  it('renders all four nav links with correct hrefs', () => {
    render(<NavigationBar />)
    const archiveLink = screen.getByRole('link', { name: /archive/i })
    const aboutLink   = screen.getByRole('link', { name: /about/i })
    const liveLink    = screen.getByRole('link', { name: /live/i })
    const contactLink = screen.getByRole('link', { name: /contact/i })

    expect(archiveLink).toHaveAttribute('href', '#archive')
    expect(aboutLink).toHaveAttribute('href', '#about')
    expect(liveLink).toHaveAttribute('href', '#live')
    expect(contactLink).toHaveAttribute('href', '#contact')
  })
})
