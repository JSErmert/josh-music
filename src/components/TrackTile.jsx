// TrackTile — glass card for a single track.
// Props: track (object), onPlay (fn), hue (number, default 28).
// Clicking anywhere on the tile calls onPlay(track.id), or toggles
// play/pause when this tile is already the current track.

const tileHoverStyles = `
  @media (hover: hover) {
    .track-tile:hover {
      transform: translateY(-5px);
      box-shadow:
        0 0 0 1px rgba(255,236,214,0.10),
        0 20px 56px rgba(0,0,0,0.62) !important;
    }
    .track-tile:hover .track-tile-inner {
      background: rgba(255,240,225,0.09) !important;
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
  .track-tile-inner { transition: background 0.35s ease; }
  .track-tile-title { transition: color 0.30s ease; }
  .track-tile-play  { transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease; }
`

export default function TrackTile({ track, onPlay, currentTrackId, isPlaying, onTogglePlay, hue = 28 }) {
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
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: [
          `0 0 0 1px hsla(${hue},70%,62%,0.10)`,
          '0 16px 44px rgba(0,0,0,0.52)',
        ].join(', '),
        transition: 'box-shadow 0.35s ease, transform 0.35s ease',
      }}
    >
      <style>{tileHoverStyles}</style>

      {/* Frosted glass surface */}
      <div
        className="track-tile-inner"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,240,225,0.06)',
          backdropFilter: 'blur(6px) saturate(1.15)',
          WebkitBackdropFilter: 'blur(6px) saturate(1.15)',
          border: `1px solid hsla(${hue},70%,62%,0.22)`,
          boxShadow: [
            `inset 0 1px 0 rgba(255,255,255,0.14)`,
            `inset 0 0 40px hsla(${hue},60%,55%,0.04)`,
          ].join(', '),
        }}
      />

      {/* Ambient hue glow — top-left sheen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20px', left: '-20px',
          width: '140px', height: '140px',
          borderRadius: '50%',
          background: `radial-gradient(circle, hsla(${hue},70%,58%,0.10) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Tile content */}
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
          color: `hsla(${hue},60%,62%,0.55)`,
          fontWeight: 300,
          marginBottom: '6px',
        }}>
          {track.kind}
        </p>
        <h3
          className="track-tile-title"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: 'italic',
            fontSize: '1.0rem',
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
          border: `1px solid hsla(${hue},70%,62%,0.35)`,
          background: 'rgba(255,235,210,0.03)',
          boxShadow: `0 0 8px hsla(${hue},70%,55%,0.15)`,
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
    </div>
  )
}
