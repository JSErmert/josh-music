// App — root composition for Josh Ermert's music site (living-glow design).
// Owns global audio + UI state via useAudio().
// Renders: BackgroundField, HeroSection, main (sections), PersistentPlayer,
//          and the shared <audio> element.

import { useEffect, useState } from 'react'
import { useAudio } from './state/useAudio'
import { tracks, getTrack as getTrackById } from './data/tracks'
import BackgroundField from './components/BackgroundField'
import { useAudioAnalyser } from './hooks/useAudioAnalyser'
import { hueForIndex } from './design/tokens'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import CollectionSection from './components/CollectionSection'
import LiveSection from './components/LiveSection'
import ContactSection from './components/ContactSection'
import PersistentPlayer from './components/PersistentPlayer'
import NavigationBar from './components/NavigationBar'

export default function App() {
  const {
    audioRef,
    gateOpen,
    currentTrackId,
    isPlaying,
    begin,
    selectTrack,
    togglePlay,
    next,
    prev,
  } = useAudio()

  const currentTrack = getTrackById(currentTrackId)

  const { getAmplitude } = useAudioAnalyser(audioRef, isPlaying)
  const trackIndex = tracks.findIndex((t) => t.id === currentTrackId)
  const hue = hueForIndex(trackIndex < 0 ? 0 : trackIndex)

  // Playback position from the real <audio> element, for the player's progress bar + time.
  const [progress, setProgress] = useState({ current: 0, duration: 0 })
  useEffect(() => {
    const el = audioRef.current
    if (!el) return undefined
    const sync = () => setProgress({ current: el.currentTime || 0, duration: el.duration || 0 })
    el.addEventListener('timeupdate', sync)
    el.addEventListener('loadedmetadata', sync)
    el.addEventListener('durationchange', sync)
    return () => {
      el.removeEventListener('timeupdate', sync)
      el.removeEventListener('loadedmetadata', sync)
      el.removeEventListener('durationchange', sync)
    }
  }, [audioRef])
  const seek = (frac) => {
    const el = audioRef.current
    if (el && progress.duration) el.currentTime = frac * progress.duration
  }

  return (
    <>
      <NavigationBar />
      <BackgroundField />

      <HeroSection onBegin={begin} gateOpen={gateOpen} nowPlayingTitle={currentTrack?.title ?? null} getAmplitude={getAmplitude} hue={hue} isPlaying={isPlaying} />

      <main style={{ position: 'relative' }}>
        <AboutSection />
        <CollectionSection onPlay={selectTrack} currentTrackId={currentTrackId} isPlaying={isPlaying} onTogglePlay={togglePlay} />
        <LiveSection />
        <ContactSection />
      </main>

      <PersistentPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onPrev={prev}
        onNext={next}
        hue={hue}
        currentTime={progress.current}
        duration={progress.duration}
        onSeek={seek}
      />

      {/* Shared audio element — src set by useAudio when a real file is available */}
      <audio ref={audioRef} hidden onEnded={next} />
    </>
  )
}
