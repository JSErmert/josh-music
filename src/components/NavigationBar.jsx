// NavigationBar — fixed top bar ported from B3 Archive Stage mockup.
// Left: artist-name wordmark with "ARCHIVE" eyebrow.
// Right: nav links anchoring to #archive / #about / #live / #contact.
// Mobile (<= 768px): condensed padding, smaller link gap, eyebrow hidden.
// At the very top the bar floats transparent; once scrolled it fades into a
// dark chocolate-tinted frosted glass so content no longer bleeds through it.

import { useState, useEffect } from 'react'

const navStyles = `
  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 90;
    padding: 30px 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background 0.4s ease, backdrop-filter 0.4s ease,
                border-color 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
  }
  .nav-bar.scrolled {
    background: rgba(28,16,8,0.74);
    backdrop-filter: blur(22px) saturate(1.3);
    -webkit-backdrop-filter: blur(22px) saturate(1.3);
    border-bottom: 1px solid rgba(200,137,58,0.14);
    box-shadow: 0 8px 30px rgba(0,0,0,0.45);
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-eyebrow {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(200,137,58,0.36);
    font-weight: 300;
    margin-left: 10px;
    font-family: system-ui, Arial, sans-serif;
  }
  @media (max-width: 768px) {
    .nav-bar {
      padding: 18px 20px;
    }
    .nav-bar.scrolled {
      padding-top: 14px;
      padding-bottom: 14px;
    }
    .nav-links {
      gap: 18px;
    }
    .nav-eyebrow {
      display: none;
    }
  }
`

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav aria-label="Site navigation" className={scrolled ? 'nav-bar scrolled' : 'nav-bar'}>
      <style>{navStyles}</style>

      {/* Left — wordmark + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '12px',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(240,232,220,0.45)',
          }}
        >
          Josh Ermert
        </span>
        <span className="nav-eyebrow">
          Archive
        </span>
      </div>

      {/* Right — nav links */}
      <ul className="nav-links">
        {[
          { label: 'Archive', href: '#archive' },
          { label: 'About',   href: '#about' },
          { label: 'Live',    href: '#live' },
          { label: 'Contact', href: '#contact' },
        ].map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              style={{
                fontSize: '9.5px',
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: '#8a7a68',
                textDecoration: 'none',
                fontWeight: 300,
                fontFamily: 'system-ui, Arial, sans-serif',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f0e8dc' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8a7a68' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
