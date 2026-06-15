// TrackTile — glass card for a single track, using the same frosted-glass
// texture as the "Begin Listening" button.
// Props: track, onPlay, currentTrackId, isPlaying, onTogglePlay, onOpenLyrics.
// Clicking the tile plays the track (or toggles play/pause if it's current).

const tileHoverStyles = `
  @media (hover: hover) {
    .track-tile:hover {
      transform: translateY(-4px);
      box-shadow:
        0 16px 40px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.18) !important;
    }
    .track-tile:hover .track-tile-inner {
      background: rgba(255,240,225,0.10) !important;
      border-color: rgba(255,200,150,0.4) !important;
    }
    .track-tile:hover .track-tile-title {
      color: #e8c080 !important;
    }
    .track-tile:hover .track-tile-play {
      background: rgba(255,235,200,0.08) !important;
    }
  }
  .track-tile:active {
    transform: translateY(-2px);
  }
  .track-tile-inner { transition: background 0.35s ease, border-color 0.3s ease; }
  .track-tile-title { transition: color 0.30s ease; }
  .track-tile-play  { transition: border-color 0.3s ease, background 0.3s ease; }
`

export default function TrackTile({ track, onPlay, currentTrackId, isPlaying, onTogglePlay, onOpenLyrics }) {
  const isCurrentAndPlaying = track.id === currentTrackId && isPlaying
  const handleClick = () => {
    if (track.id === currentTrackId) {
      onTogglePlay()
    } else {
      onPlay(track.id)
    }
  }
  return (
    <div
      className="track-tile"
      onClick={handleClick}
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        // same texture as the Begin Listening glass button
        boxShadow: '0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)',
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
      }}
    >
      <style>{tileHoverStyles}</style>

      {/* Frosted glass surface — Begin Listening recipe */}
      <div
        className="track-tile-inner"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,240,225,0.06)',
          backdropFilter: 'blur(6px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(6px) saturate(1.15)',
          border: '1px solid rgba(255,236,214,0.18)',
        }}
      />

      {/* Cover art — the title + Cover/Original are baked into the image */}
      {track.art && (
        <>
          <img
            src={track.art}
            alt={`${track.title} — ${track.kind} cover art`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
          />
          <div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to top, rgba(10,6,3,0.6), rgba(10,6,3,0) 45%)' }}
          />
          {/* Title kept in the DOM for screen readers (visually it lives in the art) */}
          <h3 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>
            {track.title}
          </h3>
        </>
      )}

      {/* Tile content — only when there is no cover art */}
      {!track.art && (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        padding: '22px 20px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <p style={{
          fontSize: '9px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,210,160,0.6)',
          fontWeight: 300,
          marginBottom: '6px',
        }}>
          {track.kind === 'Cover' && track.credit ? `${track.kind} · ${track.credit}` : track.kind}
        </p>
        <h3
          className="track-tile-title"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: '1.05rem',
            fontWeight: 400,
            color: '#f0e8dc',
            letterSpacing: '0.02em',
            lineHeight: 1.35,
          }}
        >
          {track.title}
        </h3>
        <p style={{
          fontSize: '10px',
          color: '#8a7a68',
          letterSpacing: '0.08em',
          marginTop: '4px',
        }}>
          {track.duration}
        </p>
      </div>
      )}

      {/* Play/Pause ring — bottom-right */}
      <div
        className="track-tile-play"
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '18px', right: '18px',
          zIndex: 4,
          width: '34px', height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(255,236,214,0.3)',
          background: 'rgba(255,235,210,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isCurrentAndPlaying ? (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
            <rect x="1"   y="1" width="3.5" height="12" rx="1.5" fill="#e8b060" opacity="0.90"/>
            <rect x="7.5" y="1" width="3.5" height="12" rx="1.5" fill="#e8b060" opacity="0.90"/>
          </svg>
        ) : (
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
            <path d="M1.5 1.2l7.2 4.4-7.2 4.4V1.2z" fill="#e8b060" opacity="0.85"/>
          </svg>
        )}
      </div>

      {onOpenLyrics && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpenLyrics(track) }}
          style={{
            position: 'absolute', bottom: '20px', left: '20px', zIndex: 5,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(255,236,214,0.6)',
          }}
        >
          Lyrics
        </button>
      )}
    </div>
  )
}
