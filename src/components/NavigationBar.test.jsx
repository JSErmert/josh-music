import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NavigationBar from './NavigationBar'

describe('NavigationBar', () => {
  it('renders the artist-name wordmark', () => {
    render(<NavigationBar />)
    expect(screen.getByText(/josh ermert/i)).toBeInTheDocument()
  })

  it('renders exactly three nav links: Collection, About, Contact', () => {
    render(<NavigationBar />)
    const collectionLink = screen.getByRole('link', { name: /collection/i })
    const aboutLink      = screen.getByRole('link', { name: /about/i })
    const contactLink    = screen.getByRole('link', { name: /contact/i })

    expect(collectionLink).toHaveAttribute('href', '#collection')
    expect(aboutLink).toHaveAttribute('href', '#about')
    expect(contactLink).toHaveAttribute('href', '#contact')
  })

  it('does not render a Live or Archive link', () => {
    render(<NavigationBar />)
    expect(screen.queryByRole('link', { name: /live/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /archive/i })).not.toBeInTheDocument()
  })
})
