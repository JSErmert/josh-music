import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HeroSection from './HeroSection'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('HeroSection', () => {
  it('shows the MUSIC COLLECTION eyebrow and the name, and triggers onBegin', async () => {
    const onBegin = vi.fn()
    render(<HeroSection onBegin={onBegin} gateOpen={false} getAmplitude={() => 0} hue={28} />)
    expect(screen.getByText(/music collection/i)).toBeInTheDocument()
    expect(screen.getByText(/josh ermert/i)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /begin listening/i }))
    expect(onBegin).toHaveBeenCalledOnce()
  })
  it('shows "Now Playing" with the track title after the gate opens', () => {
    render(<HeroSection onBegin={() => {}} gateOpen={true} nowPlayingTitle="TODO — Untitled Track 1" getAmplitude={() => 0} />)
    expect(screen.getByText(/now playing.*untitled track 1/i)).toBeInTheDocument()
  })
  it('does not show Now Playing text before the gate opens', () => {
    render(<HeroSection onBegin={() => {}} gateOpen={false} nowPlayingTitle="TODO — Untitled Track 1" getAmplitude={() => 0} />)
    expect(screen.queryByText(/now playing/i)).not.toBeInTheDocument()
  })
})
