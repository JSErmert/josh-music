import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FrostPanel from './FrostPanel'
describe('FrostPanel', () => {
  it('renders children', () => { render(<FrostPanel>hi</FrostPanel>); expect(screen.getByText('hi')).toBeInTheDocument() })
  it('keeps the glass background when a caller passes style', () => {
    render(<FrostPanel style={{ maxWidth: '860px' }}>hi</FrostPanel>)
    const el = screen.getByText('hi')
    expect(el.style.background).toMatch(/255,\s*240,\s*225/) // glass recipe not wiped by caller style
    expect(el.style.maxWidth).toBe('860px') // caller style still applied
  })
})
