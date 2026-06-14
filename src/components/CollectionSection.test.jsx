import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { it, expect, vi, beforeEach } from 'vitest'
import CollectionSection from './CollectionSection'

beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(function() {
    return { observe: vi.fn(), disconnect: vi.fn() }
  })
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

it('lists tracks and plays on click', async () => {
  const onPlay = vi.fn()
  render(<CollectionSection onPlay={onPlay} />)
  expect(screen.getByText('Me and You')).toBeInTheDocument()
  await userEvent.click(screen.getByText('Son'))
  expect(onPlay).toHaveBeenCalledWith('son')
})
