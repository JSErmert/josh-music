import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ContactSection from './ContactSection'

describe('ContactSection', () => {
  it('renders the contact email', () => {
    render(<ContactSection />)
    expect(screen.getByText(/add contact email/i)).toBeInTheDocument()
  })
  it('renders the booking note', () => {
    render(<ContactSection />)
    expect(screen.getByText(/bookings/i)).toBeInTheDocument()
  })
})
