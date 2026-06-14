// PersistentPlayer — fixed warm-glass bottom bar.
// Renders nothing when track is null.
// Props: track (object|null), isPlaying (bool), onTogglePlay (fn), onPrev (fn), onNext (fn)
// Optional: hue (number, default 28) — tints progress/accent colour.
// Track shape: { id, title, kind, credit, duration, src, lyrics, lyricsUrl }
// Mobile: compact padding; all layout adapts via CSS.

const styles = `
  .player-bar {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: rgba(20,12,7,0.72);
    border-top: 1px solid rgba(255,236,214,0.12);
    backdrop-filter: blur(14px) saturate(1.3);
    -webkit-backdrop-filter: blur(14px) saturate(1.3);
    box-shadow: 0 -2px 24px rgba(0,0,0,0.45);
    z-index: 100;
    display: flex;
    align-items: center;
    padding: 0 48px;
    gap: 32px;
    box-sizing: border-box;
    min-height: 72px;
  }

  .player-track-info {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    flex: 1;
  }

  .player-progress-wrap {
    flex: 1;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }

  @media (max-width: 768px) {
    .player-bar {
      padding: 10px 16px;
      gap: 14px;
    }
    .player-track-info {
      min-width: 0;
    }
    .player-progress-wrap {
      display: none;
    }
  }
`

export default function PersistentPlayer({ track, isPlaying, onTogglePlay, onPrev, onNext, hue = 28 }) {
  if (!track) return null

  // Build meta line from new schema fields (no instrument / catalogId)
  const metaLine =
    track.kind === 'Cover' && track.credit
      ? `Cover · ${track.credit}`
      : track.kind ?? ''

  const accent = `hsla(${hue},70%,60%,1)`
  const accentFaint = `hsla(${hue},70%,60%,0.28)`
  const accentTrack = `hsla(${hue},60%,40%,0.14)`

  return (
    <div className="player-bar">
      <style>{styles}</style>

      {/* Track info: title + meta */}
      <div className="player-track-info">
        <span style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: 'italic',
          fontSize: '14px',
          color: '#f0e8dc',
          letterSpacing: '0.03em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {track.title}
        </span>
        {metaLine ? (
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,236,214,0.38)',
            marginTop: '3px',
          }}>
            {metaLine}
          </span>
        ) : null}
      </div>

      {/* Transport controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
        <button
          onClick={onPrev}
          aria-label="Previous"
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 3v10M13 3.5L7 8l6 4.5V3.5z" stroke="#f0e8dc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            border: `1px solid ${accentFaint}`,
            background: 'rgba(255,240,225,0.04)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          {isPlaying ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <rect x="1"   y="1" width="3.5" height="12" rx="1.5" fill={accent} opacity="0.90"/>
              <rect x="7.5" y="1" width="3.5" height="12" rx="1.5" fill={accent} opacity="0.90"/>
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
              <path d="M1.5 1.2l7.2 4.4-7.2 4.4V1.2z" fill={accent} opacity="0.85"/>
            </svg>
          )}
        </button>

        <button
          onClick={onNext}
          aria-label="Next"
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 3v10M3 3.5L9 8l-6 4.5V3.5z" stroke="#f0e8dc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Slim progress bar — decorative, desktop only */}
      <div aria-hidden="true" className="player-progress-wrap">
        <div style={{
          height: '3px',
          background: accentTrack,
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: '0%',
            background: `linear-gradient(to right, hsla(${hue},55%,42%,1), ${accent})`,
            borderRadius: '2px',
          }} />
        </div>
        {track.duration ? (
          <div style={{
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: 'rgba(255,236,214,0.28)',
            textAlign: 'right',
          }}>
            {track.duration}
          </div>
        ) : null}
      </div>
    </div>
  )
}
