import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Glass from './Glass'

describe('Glass', () => {
  it('renders children inside a frosted surface', () => {
    render(<Glass><span>Begin Listening</span></Glass>)
    const el = screen.getByText('Begin Listening').parentElement
    expect(el).toBeInTheDocument()
    expect(el.style.backdropFilter || el.style.webkitBackdropFilter).toMatch(/blur/)
  })
})
