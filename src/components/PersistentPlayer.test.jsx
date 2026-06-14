import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import PersistentPlayer from './PersistentPlayer'

const track = { id: 'me-and-you', title: 'Me and You', kind: 'Original', duration: '—', src: '/audio/me-and-you.mp3' }

describe('PersistentPlayer', () => {
  it('renders the current track and toggles', async () => {
    const onToggle = vi.fn()
    render(<PersistentPlayer track={track} isPlaying onTogglePlay={onToggle} onPrev={() => {}} onNext={() => {}} />)
    expect(screen.getByText('Me and You')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /pause|play/i }))
    expect(onToggle).toHaveBeenCalledOnce()
  })
  it('renders nothing without a track', () => {
    const { container } = render(<PersistentPlayer track={null} isPlaying={false} onTogglePlay={() => {}} onPrev={() => {}} onNext={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('calls onPrev and onNext when prev/next are clicked', async () => {
    const onPrev = vi.fn(), onNext = vi.fn()
    render(<PersistentPlayer track={track} isPlaying onTogglePlay={() => {}} onPrev={onPrev} onNext={onNext} />)
    await userEvent.click(screen.getByRole('button', { name: /previous/i }))
    expect(onPrev).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onNext).toHaveBeenCalledOnce()
  })
  it('shows the track kind as meta text', () => {
    render(<PersistentPlayer track={track} isPlaying={false} onTogglePlay={() => {}} onPrev={() => {}} onNext={() => {}} />)
    expect(screen.getByText(/original/i)).toBeInTheDocument()
  })
})
