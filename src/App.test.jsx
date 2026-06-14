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

it('renders the background field and begins listening', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.bgfield')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /begin listening/i }))
  expect(screen.getAllByText('Me and You').length).toBeGreaterThan(0)
})
