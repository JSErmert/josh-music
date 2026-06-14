import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import AlbumOverlay from './AlbumOverlay'
import { albums } from '../data/albums'

describe('AlbumOverlay', () => {
  it('renders nothing when no album', () => {
    const { container } = render(<AlbumOverlay album={null} onClose={() => {}} onSelectTrack={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('shows album tracks and selects + closes', async () => {
    const onClose = vi.fn(), onSelectTrack = vi.fn()
    render(<AlbumOverlay album={albums[0]} onClose={onClose} onSelectTrack={onSelectTrack} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await userEvent.click(screen.getByText('TODO — Untitled Track 1'))
    expect(onSelectTrack).toHaveBeenCalledWith('nocturne-eflat')
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
