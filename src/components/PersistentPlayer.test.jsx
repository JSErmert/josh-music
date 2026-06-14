import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import PersistentPlayer from './PersistentPlayer'
const track = { title: 'TODO — Untitled Track 1', instrument: 'TBD', catalogId: 'TODO-001' }
describe('PersistentPlayer', () => {
  it('renders the current track and toggles', async () => {
    const onToggle = vi.fn()
    render(<PersistentPlayer track={track} isPlaying onTogglePlay={onToggle} onPrev={() => {}} onNext={() => {}} />)
    expect(screen.getByText('TODO — Untitled Track 1')).toBeInTheDocument()
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
})
