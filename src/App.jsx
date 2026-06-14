// App — root composition for Josh Ermert's music site (living-glow design).
// Owns global audio + UI state via useAudio().
// Renders: BackgroundField, HeroSection, main (sections), PersistentPlayer,
//          and the shared <audio> element.

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

  return (
    <>
      <NavigationBar />
      <BackgroundField />

      <HeroSection onBegin={begin} gateOpen={gateOpen} nowPlayingTitle={currentTrack?.title ?? null} getAmplitude={getAmplitude} hue={hue} />

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
      />

      {/* Shared audio element — src set by useAudio when a real file is available */}
      <audio ref={audioRef} hidden onEnded={next} />
    </>
  )
}
