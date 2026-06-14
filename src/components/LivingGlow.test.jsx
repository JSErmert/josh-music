import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LivingGlow from './LivingGlow'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('LivingGlow', () => {
  it('renders the orb pulse + core under reduced motion without throwing', () => {
    const { container } = render(<LivingGlow getAmplitude={() => 0} hue={28} />)
    expect(container.querySelector('.lg-pulse')).toBeInTheDocument()
    expect(container.querySelector('.lg-core')).toBeInTheDocument()
  })
  it('does not require getAmplitude (defaults safely)', () => {
    const { container } = render(<LivingGlow />)
    expect(container.querySelector('.lg-pulse')).toBeInTheDocument()
  })
})
