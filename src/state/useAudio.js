import { useCallback, useRef, useState } from 'react'
import { tracks, SIGNATURE_TRACK_ID, getTrack } from '../data/tracks'

// Single shared <audio>; guarded so real src plays when present, stub is a no-op.
export function useAudio() {
  const audioRef = useRef(null)
  const [gateOpen, setGateOpen] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback((id) => {
    setCurrentTrackId(id)
    setIsPlaying(true)
    const el = audioRef.current
    const src = getTrack(id)?.src
    if (el && src) { el.src = src; el.play()?.catch(() => {}) } // stub src=null -> no-op
  }, [])

  const begin = useCallback(() => { setGateOpen(true); play(SIGNATURE_TRACK_ID) }, [play])
  const selectTrack = useCallback((id) => play(id), [play])
  const togglePlay = useCallback(() => {
    setIsPlaying((p) => {
      const el = audioRef.current
      if (el && getTrack(currentTrackId)?.src) { p ? el.pause() : el.play()?.catch(() => {}) }
      return !p
    })
  }, [currentTrackId])

  // FIX 4 — queue navigation; wraps around the tracks array.
  const next = useCallback(() => {
    setCurrentTrackId((id) => {
      const idx = tracks.findIndex((t) => t.id === id)
      const nextId = tracks[(idx + 1) % tracks.length].id
      const el = audioRef.current
      const src = getTrack(nextId)?.src
      if (el && src) { el.src = src; el.play()?.catch(() => {}) }
      return nextId
    })
    setIsPlaying(true)
  }, [])

  const prev = useCallback(() => {
    setCurrentTrackId((id) => {
      const idx = tracks.findIndex((t) => t.id === id)
      const prevId = tracks[(idx - 1 + tracks.length) % tracks.length].id
      const el = audioRef.current
      const src = getTrack(prevId)?.src
      if (el && src) { el.src = src; el.play()?.catch(() => {}) }
      return prevId
    })
    setIsPlaying(true)
  }, [])

  return { audioRef, gateOpen, currentTrackId, isPlaying, begin, selectTrack, togglePlay, next, prev }
}
