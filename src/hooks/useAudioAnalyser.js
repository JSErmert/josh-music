// src/hooks/useAudioAnalyser.js
import { useEffect, useRef, useCallback } from 'react'

// Wraps the shared <audio> element in a Web Audio AnalyserNode and exposes a
// smoothed amplitude (0..1). Degrades to a constant 0 when Web Audio is missing
// (e.g. jsdom) or no real media is connected — callers fall back to the
// simulated breath in that case.
export function useAudioAnalyser(audioRef, isPlaying) {
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const dataRef = useRef(null)
  const smoothRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) return
    const el = audioRef.current
    const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
    if (!el || !AC || analyserRef.current) return
    try {
      const ctx = new AC()
      const src = ctx.createMediaElementSource(el)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyser.connect(ctx.destination)
      ctxRef.current = ctx
      analyserRef.current = analyser
      dataRef.current = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      analyserRef.current = null // wiring failed → stay silent (amplitude 0)
    }
  }, [audioRef, isPlaying])

  // Release the AudioContext only on unmount (not when isPlaying toggles, so the
  // analyser is reused across pause/resume).
  useEffect(() => () => { ctxRef.current?.close().catch(() => {}) }, [])

  const getAmplitude = useCallback(() => {
    const analyser = analyserRef.current
    const data = dataRef.current
    if (!analyser || !data) return 0
    analyser.getByteFrequencyData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) sum += data[i]
    const raw = sum / data.length / 255 // 0..1
    smoothRef.current += (raw - smoothRef.current) * 0.2 // ease for a musical feel
    return smoothRef.current
  }, [])

  return { getAmplitude }
}
