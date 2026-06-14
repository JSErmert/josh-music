// HeroSection — pillar-free hero with centered artist name, warm spotlight,
// discipline line, and "Begin listening" vinyl-icon CTA.
// Visual CSS ported from docs/superpowers/specs/variants/B3-archive-stage/mockup.html.
// NO pillars here — pillars live in the post-hero sections wrapper only.
//
// CTA layout: the TEXT is what sits dead-centered in the spotlight pool
// (viewport center). The vinyl-icon circle hangs off to its LEFT.
// Mechanism: the button is centered by the parent flexbox; its width
// animates between the two measured text widths. Both texts live INSIDE
// the button, positioned at left:50% with translateX(-50%), so they
// stay centered in the button (and therefore in the viewport) at every
// frame of the width transition. The circle is absolute-positioned with
// right: calc(100% + 12px), i.e. 12px to the LEFT of the button's left
// edge. As the button widens its left edge moves outward (leftward), so
// the circle slides leftward in sync — exactly the motion the operator
// described.

import { useState, useRef, useLayoutEffect } from 'react'

const styles = `
  @keyframes centerPulse {
    0%   { opacity: 0.55; transform: translate(-50%,-50%) scale(0.94); }
    100% { opacity: 1.0;  transform: translate(-50%,-50%) scale(1.07); }
  }
  @keyframes coneRise {
    0%   { opacity: 0; }
    30%  { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes poolRise {
    0%   { opacity: 0; }
    55%  { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes hintAppear { to { opacity: 0.28; } }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.20; }
    50%       { opacity: 0.60; }
  }

  .hero-name {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.6rem, 14vw, 7rem);
    font-weight: 400;
    letter-spacing: 0.36em;
    color: #f0e8dc;
    text-transform: uppercase;
    position: relative;
    z-index: 5;
    text-shadow: 0 0 60px rgba(232,176,96,0.36), 0 0 120px rgba(200,137,58,0.20), 0 0 200px rgba(160,104,40,0.10);
  }
  .hero-ambient-glow {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 720px; height: 640px;
    background: radial-gradient(ellipse at center, rgba(200,137,58,0.11) 0%, rgba(160,104,40,0.06) 42%, transparent 70%);
    border-radius: 50%;
    animation: centerPulse 7s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 1;
  }
  /* Pool is now a child of .hero-cta-wrap (the button's relatively-
     positioned container), so left/top 50% with translate(-50%,-50%)
     centers it on the button itself — no hard-coded viewport % needed.
     Peak of the radial gradient is at 50%/50% so the brightest point of
     the spotlight sits directly behind the button text on every viewport. */
  .hero-cta-wrap {
    position: relative;
    display: inline-block;
    margin-top: 20px;
    z-index: 5;
  }
  .hero-floor-pool {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 360px; height: 110px;
    background: radial-gradient(ellipse 100% 100% at 50% 50%, rgba(232,176,96,0.24) 0%, rgba(200,137,58,0.13) 32%, rgba(160,104,40,0.05) 64%, transparent 88%);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
    animation: poolRise 3.0s ease-out forwards;
    opacity: 0;
  }
  @media (max-width: 768px) {
    .hero-name {
      letter-spacing: 0.12em;
    }
    .hero-ambient-glow {
      width: 95vw; height: 85vw;
    }
    .hero-floor-pool {
      width: 78vw; height: 22vw;
    }
  }
`

export default function HeroSection({ onBegin, gateOpen, nowPlayingTitle }) {
  // Measure each text's rendered width so we can transition the wrapper
  // between them — the circle stays "right up to" the active text and
  // slides left when the text grows wider.
  const beginRef = useRef(null)
  const npRef = useRef(null)
  const [widths, setWidths] = useState({ begin: null, np: null })

  useLayoutEffect(() => {
    if (beginRef.current && npRef.current) {
      const b = beginRef.current.offsetWidth
      const n = npRef.current.offsetWidth
      if (b && n && (b !== widths.begin || n !== widths.np)) {
        setWidths({ begin: b, np: n })
      }
    }
  }, [nowPlayingTitle, widths.begin, widths.np])

  const ctaWidth = gateOpen && nowPlayingTitle
    ? (widths.np ?? 'auto')
    : (widths.begin ?? 'auto')

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px 80px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0f0805',
      }}
    >
      <style>{styles}</style>

      {/* Ambient center glow */}
      <div aria-hidden="true" className="hero-ambient-glow" />

      {/* Spotlight cone */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          background: [
            // Beam widths are CAPPED so the desktop cone never blows up
            // past mobile's natural absolute width. 17vw on 390px mobile
            // = 66px (the look the operator likes); same 66-70px on
            // tablet/desktop/wide — the beam stays absolutely thin and
            // reads as proportionally narrower on bigger screens.
            'radial-gradient(ellipse clamp(50px, 17vw, 70px) 56% at 50% 0%, rgba(232,176,96,0.22) 0%, rgba(200,137,58,0.13) 36%, transparent 76%)',
            'radial-gradient(ellipse clamp(140px, 44vw, 185px) 62% at 50% 0%, rgba(200,137,58,0.08) 0%, transparent 62%)',
          ].join(','),
          animation: 'coneRise 2.4s ease-out forwards',
          opacity: 0,
        }}
      />

      {/* Artist name */}
      <h1 className="hero-name">
        Josh Ermert
      </h1>

      {/* Stage apron hairline rule */}
      <div
        aria-hidden="true"
        style={{
          width: 'min(520px, 55vw)',
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(200,137,58,0.18) 8%, rgba(200,137,58,0.55) 28%, rgba(232,176,96,0.65) 50%, rgba(200,137,58,0.55) 72%, rgba(200,137,58,0.18) 92%, transparent 100%)',
          margin: '34px auto 0',
          position: 'relative',
          zIndex: 5,
        }}
      />

      {/* Discipline line */}
      <p
        style={{
          fontFamily: 'system-ui, Arial, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.40em',
          textTransform: 'uppercase',
          color: 'rgba(138,122,104,0.40)',
          fontWeight: 300,
          marginTop: '22px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        Classical &nbsp;&nbsp;·&nbsp;&nbsp; Jazz &nbsp;&nbsp;·&nbsp;&nbsp; Composition
      </p>

      {/* CTA: text centered in viewport, circle hangs off its left side.
          The button width matches the current text width (animated), and
          both texts are absolute-positioned at left:50% within the button
          so they stay perfectly centered as the button widens or narrows.
          The circle is absolute-positioned 12px to the LEFT of the button's
          left edge; as the button widens, its left edge moves outward and
          the circle slides leftward in sync.
          The wrapper carries the floor pool so the spotlight is always
          centered behind the button on every viewport. */}
      <div className="hero-cta-wrap">
        <div aria-hidden="true" className="hero-floor-pool" />
        <button
          onClick={!gateOpen ? onBegin : undefined}
          disabled={gateOpen}
          aria-label={!gateOpen ? 'Begin listening' : undefined}
          style={{
            fontFamily: 'system-ui, Arial, sans-serif',
            fontSize: '9.5px',
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: gateOpen ? 'rgba(240,232,220,0.55)' : 'rgba(240,232,220,0.38)',
            fontWeight: 300,
            background: 'none',
            border: 'none',
            cursor: gateOpen ? 'default' : 'pointer',
            position: 'relative',
            display: 'inline-block',
            zIndex: 5,
            padding: '12px 0',
            width: ctaWidth,
            minHeight: '20px',
            overflow: 'visible',
            transition: 'color 0.5s, width 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
        {/* Vinyl-icon circle — anchored 12px LEFT of the button's left edge.
            As the button widens, the left edge moves outward and the circle
            slides smoothly leftward with it. */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '1.5px solid rgba(200,137,58,0.55)',
            display: 'block',
          }}
        />

        {/* "Begin listening" — centered inside the button */}
        <span
          ref={beginRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            opacity: gateOpen ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          Begin listening
        </span>

        {/* "Now Playing: [Song]" — centered inside the button, crossfaded */}
        <span
          ref={npRef}
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
            opacity: gateOpen && nowPlayingTitle ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        >
          Now Playing: {nowPlayingTitle ?? 'Nocturne in E-flat'}
        </span>
        </button>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '44px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          opacity: 0,
          animation: 'hintAppear 1s ease-out 3.8s forwards',
          zIndex: 5,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '8.5px',
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: '#8a7a68',
            fontStyle: 'italic',
          }}
        >
          Archive
        </span>
        <div
          style={{
            width: '1px', height: '28px',
            background: 'linear-gradient(to bottom, rgba(200,137,58,0.28), transparent)',
            animation: 'scrollPulse 2.6s ease-in-out 3.8s infinite',
          }}
        />
      </div>
    </section>
  )
}
