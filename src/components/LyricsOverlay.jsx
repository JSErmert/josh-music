// LyricsOverlay — built-in lyrics viewer over a glass scrim.
// Originals embed their own lyrics; covers show a credit + a link to the source
// (we do not reproduce third-party copyrighted lyrics inline).
import { useEffect } from 'react'

export default function LyricsOverlay({ track, onClose }) {
  useEffect(() => {
    if (!track) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [track, onClose])

  if (!track) return null
  const subtitle = track.kind === 'Cover' && track.credit ? `Cover · ${track.credit}` : track.kind

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${track.title} lyrics`}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        background: 'rgba(8,4,2,0.78)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto',
          padding: '40px 36px', borderRadius: '18px',
          background: 'rgba(20,12,7,0.72)',
          border: '1px solid rgba(255,236,214,0.18)',
          backdropFilter: 'blur(14px) saturate(1.3)', WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.10)',
          fontFamily: "Georgia, 'Times New Roman', serif", color: '#f0e8dc',
        }}
      >
        <button
          type="button"
          aria-label="Close lyrics"
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '16px',
            background: 'none', border: 'none', color: 'rgba(243,231,214,0.6)',
            fontSize: '24px', lineHeight: 1, cursor: 'pointer',
          }}
        >
          ×
        </button>

        <p style={{ fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,180,110,0.72)', marginBottom: '8px' }}>
          {subtitle}
        </p>
        <h3 style={{ fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.02em', marginBottom: '22px' }}>
          {track.title}
        </h3>

        {track.lyrics ? (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.98rem', lineHeight: 1.9, color: 'rgba(240,232,220,0.86)', margin: 0 }}>
            {track.lyrics}
          </pre>
        ) : (
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(240,232,220,0.8)' }}>
            A cover of <em>{track.title}</em>{track.credit ? ` by ${track.credit}` : ''}.{' '}
            {track.lyricsUrl ? (
              <a href={track.lyricsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#e8b060' }}>
                Read the lyrics on Genius ↗
              </a>
            ) : null}
          </p>
        )}
      </div>
    </div>
  )
}
