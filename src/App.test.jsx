import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { it, expect, vi, beforeEach } from 'vitest'
import App from './App'

beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(function() {
    return { observe: vi.fn(), disconnect: vi.fn() }
  })
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

it('begins listening then shows the player', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: /begin listening/i }))
  // player surfaced — text appears in both CollectionSection and PersistentPlayer
  expect(screen.getAllByText('TODO — Untitled Track 1').length).toBeGreaterThan(0)
})
