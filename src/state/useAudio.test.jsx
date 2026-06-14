import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudio } from './useAudio'
import { tracks } from '../data/tracks'

describe('useAudio', () => {
  it('starts with gate closed and nothing playing', () => {
    const { result } = renderHook(() => useAudio())
    expect(result.current.gateOpen).toBe(false)
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentTrackId).toBe(null)
  })
  it('begin() opens the gate and selects the signature track', () => {
    const { result } = renderHook(() => useAudio())
    act(() => result.current.begin())
    expect(result.current.gateOpen).toBe(true)
    expect(result.current.currentTrackId).toBe('me-and-you')
    expect(result.current.isPlaying).toBe(true)
  })
  it('selectTrack sets current track and plays', () => {
    const { result } = renderHook(() => useAudio())
    act(() => result.current.selectTrack('son'))
    expect(result.current.currentTrackId).toBe('son')
    expect(result.current.isPlaying).toBe(true)
  })
  it('togglePlay flips playing', () => {
    const { result } = renderHook(() => useAudio())
    act(() => result.current.selectTrack('son'))
    act(() => result.current.togglePlay())
    expect(result.current.isPlaying).toBe(false)
  })

  describe('next() / prev() — queue navigation', () => {
    it('next() advances to the next track and keeps playing', () => {
      const { result } = renderHook(() => useAudio())
      act(() => result.current.selectTrack(tracks[0].id))
      act(() => result.current.next())
      expect(result.current.currentTrackId).toBe(tracks[1].id)
      expect(result.current.isPlaying).toBe(true)
    })
    it('next() wraps from last track to first', () => {
      const { result } = renderHook(() => useAudio())
      act(() => result.current.selectTrack(tracks[tracks.length - 1].id))
      act(() => result.current.next())
      expect(result.current.currentTrackId).toBe(tracks[0].id)
    })
    it('prev() moves to the previous track', () => {
      const { result } = renderHook(() => useAudio())
      act(() => result.current.selectTrack(tracks[1].id))
      act(() => result.current.prev())
      expect(result.current.currentTrackId).toBe(tracks[0].id)
      expect(result.current.isPlaying).toBe(true)
    })
    it('prev() wraps from first track to last', () => {
      const { result } = renderHook(() => useAudio())
      act(() => result.current.selectTrack(tracks[0].id))
      act(() => result.current.prev())
      expect(result.current.currentTrackId).toBe(tracks[tracks.length - 1].id)
    })
  })
})
