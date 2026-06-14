import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRef } from 'react'
import { useAudioAnalyser } from './useAudioAnalyser'

describe('useAudioAnalyser', () => {
  it('returns getAmplitude that yields 0 when Web Audio is unavailable', () => {
    const { result } = renderHook(() => {
      const ref = useRef(null)            // no element, no AudioContext in jsdom
      return useAudioAnalyser(ref, false)
    })
    expect(typeof result.current.getAmplitude).toBe('function')
    expect(result.current.getAmplitude()).toBe(0)
  })
})
