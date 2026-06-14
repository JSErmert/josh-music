// AboutSection — "The Artist" frosted panel + vinyl-record graphic + bio.
// Uses FrostPanel + useScrollReveal.
// Visual CSS ported from docs/superpowers/specs/variants/B3-archive-stage/mockup.html
// (#about, .about-panel, .about-disc, .about-bio, .liner-label, .section-heading).
// Mobile: reduced padding, vinyl disc hidden, bio text left-aligned.

import FrostPanel from './FrostPanel'
import { useScrollReveal } from '../hooks/useScrollReveal'

// Vinyl disc rings background (ported from .about-disc in mockup)
const discBg = `radial-gradient(circle at 50% 50%,
  rgba(10,5,2,0.9) 0%,
  rgba(10,5,2,0.9) 16%,
  rgba(255,190,80,0.06) 17%,
  rgba(10,5,2,0.9) 19%,
  rgba(255,190,80,0.05) 24%,
  rgba(10,5,2,0.9) 26%,
  rgba(255,190,80,0.04) 31%,
  rgba(10,5,2,0.9) 34%,
  rgba(255,190,80,0.035) 38%,
  rgba(10,5,2,0.9) 41%,
  rgba(255,190,80,0.03) 45%,
  rgba(10,5,2,0.9) 48%
)`

const aboutStyles = `
  .about-section { padding: 80px 64px 80px; }
  .about-panel-inner { padding: 52px 64px; }
  .about-disc { display: block; }
  .about-bio-text { text-align: center; }
  @media (max-width: 768px) {
    .about-section { padding: 56px 16px 56px; }
    .about-panel-inner { padding: 28px 20px; }
    .about-disc { display: none; }
    .about-bio-text { text-align: left; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .about-section { padding: 64px 32px 64px; }
    .about-panel-inner { padding: 40px 36px; }
  }
`

export default function AboutSection() {
  const { ref: headRef, visible: headVisible } = useScrollReveal()
  const { ref: panelRef, visible: panelVisible } = useScrollReveal()

  return (
    <section
      id="about"
      className="about-section"
    >
      <style>{aboutStyles}</style>

      {/* Section heading block */}
      <div
        ref={headRef}
        style={{
          marginBottom: '44px',
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? 'none' : 'translateY(18px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}
      >
        <p style={{
          fontFamily: 'system-ui, Arial, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color: 'rgba(200,137,58,0.50)',
          fontWeight: 300,
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Liner Notes
        </p>
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: '1.80rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          color: '#f0e8dc',
          textAlign: 'center',
          marginBottom: '14px',
        }}>
          The Artist
        </h2>
        <div style={{
          width: '60px', height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(200,137,58,0.45), transparent)',
          margin: '0 auto',
        }} />
      </div>

      {/* About panel */}
      <div
        ref={panelRef}
        style={{
          opacity: panelVisible ? 1 : 0,
          transform: panelVisible ? 'none' : 'translateY(18px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}
      >
        <FrostPanel
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255,220,160,0.06), 0 16px 52px rgba(0,0,0,0.60)',
          }}
        >
          <div className="about-panel-inner">
            {/* Warm center top bloom */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-50px', left: '50%',
                transform: 'translateX(-50%)',
                width: '400px', height: '200px',
                background: 'radial-gradient(circle, rgba(200,137,58,0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            {/* Decorative vinyl disc — right side, partially clipped (desktop only) */}
            <div
              aria-hidden="true"
              className="about-disc"
              style={{
                position: 'absolute',
                right: '-70px', top: '50%',
                transform: 'translateY(-50%)',
                width: '200px', height: '200px',
                borderRadius: '50%',
                background: discBg,
                border: '1px solid rgba(200,137,58,0.10)',
                opacity: 0.50,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              {/* Label center */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '42px', height: '42px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,58,26,0.70) 0%, rgba(200,137,58,0.35) 55%, transparent 100%)',
              }} />
            </div>

            {/* Liner label */}
            <p style={{
              fontSize: '9px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(200,137,58,0.40)',
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '28px',
              position: 'relative',
              zIndex: 1,
            }}>
              Classical &nbsp;·&nbsp; Jazz &nbsp;·&nbsp; Composition
            </p>

            {/* Bio text */}
            <div
              className="about-bio-text"
              style={{
                fontSize: '14px',
                color: '#8a7a68',
                lineHeight: 2.0,
                maxWidth: '560px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* TODO — Josh: replace with your real bio. Placeholder copy below
                  makes no factual claims about you (instrument, training, venues). */}
              <p>
                TODO — Add a short artist bio here. A couple of sentences in your
                own words: who you are, the kind of music you make, and what you
                want listeners to know. Keep it honest — no invented credits.
              </p>
              <p style={{ marginTop: '20px' }}>
                TODO — Optional second paragraph (how to listen, what's here, a
                closing line).
              </p>
            </div>
          </div>
        </FrostPanel>
      </div>
    </section>
  )
}
