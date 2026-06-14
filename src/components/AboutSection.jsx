// AboutSection — "The Artist" frosted panel + bio.
// Uses FrostPanel + useScrollReveal.

import FrostPanel from './FrostPanel'
import { useScrollReveal } from '../hooks/useScrollReveal'

const aboutStyles = `
  .about-section { padding: 80px 64px 80px; }
  .about-panel-inner { padding: 52px 64px; }
  .about-bio-text { text-align: center; }
  @media (max-width: 768px) {
    .about-section { padding: 56px 16px 56px; }
    .about-panel-inner { padding: 28px 20px; }
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
          About
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

            {/* Genre label */}
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
              Alternative
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
              <p>
                By day I build systems, the governed, trustworthy kind where
                accuracy is the whole point. This is where the same person works
                without a blueprint: I play piano and record original songs from
                scratch, and I produce full-length songs from freely available
                audio that I sing on. When the tools did not do what I needed, I
                built my own, a small audio-ML pipeline just to pull a vocal
                cleanly out of a mix. The engineering and the music come from the
                same place: a pull to take something raw and shape it into
                something honest and worth hearing.
              </p>
              <p style={{ marginTop: '20px' }}>
                I would rather a song be true than perfect. Everything here I
                produced and sang myself, put here so it can simply be heard.
              </p>
            </div>
          </div>
        </FrostPanel>
      </div>
    </section>
  )
}
