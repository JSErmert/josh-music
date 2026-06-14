// CollectionSection — "The Collection" heading + 4-up glass-card tile grid.
// Maps tracks -> TrackTile. Clicking a tile calls onPlay(track.id).
// Mobile: 1-col; tablet: 2-col; desktop: 4-col.

import { useState } from 'react'
import { tracks } from '../data/tracks'
import { useScrollReveal } from '../hooks/useScrollReveal'
import TrackTile from './TrackTile'
import LyricsOverlay from './LyricsOverlay'

const collectionStyles = `
  .collection-section { padding: 96px 64px 100px; }
  .collection-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    width: 100%;
  }
  .collection-grid .track-tile { width: 300px; max-width: 82vw; }
  @media (max-width: 768px) {
    .collection-section { padding: 64px 24px 72px; }
    .collection-grid { gap: 24px; }
    .collection-grid .track-tile { width: 100%; max-width: 360px; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .collection-section { padding: 72px 32px 80px; }
  }
`

export default function CollectionSection({ onPlay, currentTrackId, isPlaying, onTogglePlay }) {
  const { ref: headRef, visible: headVisible } = useScrollReveal()
  const { ref: gridRef, visible: gridVisible } = useScrollReveal()
  const [lyricsTrack, setLyricsTrack] = useState(null)

  return (
    <section
      id="collection"
      className="collection-section"
    >
      <style>{collectionStyles}</style>
      {/* Section heading */}
      <div
        ref={headRef}
        style={{
          marginBottom: '44px',
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? 'none' : 'translateY(18px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}
      >
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '1.80rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          color: '#f0e8dc',
          textAlign: 'center',
          marginBottom: '14px',
        }}>
          Featured Collection
        </h2>
        <div style={{
          width: '60px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(200,137,58,0.45), transparent)',
          margin: '0 auto 44px',
        }} />
      </div>

      {/* 4-column tile grid */}
      <div
        ref={gridRef}
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          opacity: gridVisible ? 1 : 0,
          transform: gridVisible ? 'none' : 'translateY(18px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}
      >
        <div className="collection-grid">
          {tracks.map((track) => (
            <TrackTile
              key={track.id}
              track={track}
              onPlay={onPlay}
              currentTrackId={currentTrackId}
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onOpenLyrics={setLyricsTrack}
            />
          ))}
        </div>
      </div>

      <LyricsOverlay track={lyricsTrack} onClose={() => setLyricsTrack(null)} />
    </section>
  )
}
