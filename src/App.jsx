// App — root composition for Josh Ermert's music site (living-glow design).
// Owns global audio + UI state via useAudio().
// Renders: BackgroundField, HeroSection, main (Pillars + sections), PersistentPlayer,
//          AlbumOverlay, and the shared <audio> element.

import { useAudio } from './state/useAudio'
import { albums } from './data/albums'
import { tracks, getTrack as getTrackById } from './data/tracks'
import BackgroundField from './components/BackgroundField'
import { useAudioAnalyser } from './hooks/useAudioAnalyser'
import { hueForIndex } from './design/tokens'
import HeroSection from './components/HeroSection'
import Pillars from './components/Pillars'
import AboutSection from './components/AboutSection'
import CollectionSection from './components/CollectionSection'
import PressingsSection from './components/PressingsSection'
import AlbumOverlay from './components/AlbumOverlay'
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
    openAlbumId,
    begin,
    selectTrack,
    togglePlay,
    openAlbum,
    closeAlbum,
    next,
    prev,
  } = useAudio()

  const currentTrack = getTrackById(currentTrackId)
  const openAlbumObj = albums.find((a) => a.id === openAlbumId) || null

  const { getAmplitude } = useAudioAnalyser(audioRef, isPlaying)
  const trackIndex = tracks.findIndex((t) => t.id === currentTrackId)
  const hue = hueForIndex(trackIndex < 0 ? 0 : trackIndex)

  return (
    <>
      <NavigationBar />
      <BackgroundField />

      <HeroSection onBegin={begin} gateOpen={gateOpen} nowPlayingTitle={currentTrack?.title ?? null} getAmplitude={getAmplitude} hue={hue} />

      {/* Post-hero sections wrapper — Pillars live here, not in hero */}
      <main style={{ position: 'relative' }}>
        <Pillars />
        <AboutSection />
        <CollectionSection onPlay={selectTrack} currentTrackId={currentTrackId} isPlaying={isPlaying} onTogglePlay={togglePlay} />
        <PressingsSection albums={albums} onOpen={openAlbum} />
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

      <AlbumOverlay
        album={openAlbumObj}
        onClose={closeAlbum}
        onSelectTrack={(id) => { selectTrack(id); closeAlbum() }}
        currentTrackId={currentTrackId}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      {/* Shared audio element — src set by useAudio when a real file is available */}
      <audio ref={audioRef} hidden onEnded={next} />
    </>
  )
}
