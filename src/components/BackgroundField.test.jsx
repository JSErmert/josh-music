import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BackgroundField from './BackgroundField'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('BackgroundField', () => {
  it('renders an aria-hidden canvas and does not throw under reduced motion / no 2d context', () => {
    const { container } = render(<BackgroundField />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.getAttribute('aria-hidden')).toBe('true')
  })
})
