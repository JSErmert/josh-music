import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  it('returns true when the OS prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
  it('returns false when motion is allowed', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})
