import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PressingsSection from './PressingsSection'
import { albums } from '../data/albums'

beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(function() {
    return { observe: vi.fn(), disconnect: vi.fn() }
  })
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('PressingsSection', () => {
  it('lists album titles', () => {
    render(<PressingsSection albums={albums} onOpen={() => {}} />)
    expect(screen.getByText('TODO — Collection One')).toBeInTheDocument()
    expect(screen.getByText('TODO — Collection Two')).toBeInTheDocument()
  })
  it('clicking an album tile calls onOpen with album id', async () => {
    const onOpen = vi.fn()
    render(<PressingsSection albums={albums} onOpen={onOpen} />)
    await userEvent.click(screen.getByText('TODO — Collection One'))
    expect(onOpen).toHaveBeenCalledWith('reveries')
  })
})
