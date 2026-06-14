# Living-Glow Foundation + Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable "living glow" design foundation (tokens, glass, reduced-motion + audio-analyser hooks, the site-wide background field, the audio-reactive glow) and rebuild the hero on top of it, replacing the inherited jacques "Archive Stage" hero.

**Architecture:** A fixed full-viewport `BackgroundField` (warm nebula + portfolio-ported constellation + grain + vignette) sits behind all content. A `LivingGlow` orb breathes with the music: it runs a simulated breathing envelope by default and blends toward the real `<audio>` amplitude (via a Web Audio `AnalyserNode`) when a real track is actually playing — so it matches the locked mockup today and "wakes up" to real songs later. The hero composes these with glass (the portfolio's recipe) for "Begin Listening".

**Tech Stack:** Vite + React 19, Vitest + @testing-library/react (jsdom), Canvas 2D, Web Audio API. No new dependencies. Inline styles + `<style>` blocks, matching the existing codebase.

**Spec:** `docs/superpowers/specs/2026-06-13-living-glow-redesign/design.md`
**Locked hero reference:** `docs/superpowers/specs/2026-06-13-living-glow-redesign/hero-reference.html`

**Test conventions (from this repo):** Tests mock `window.matchMedia` to `{ matches: true, addEventListener, removeEventListener }`, which makes `prefers-reduced-motion: reduce` evaluate **true** — so every animated component must take a static, rAF-free path under reduced motion. jsdom's `canvas.getContext('2d')` returns `null`; canvas code must guard on it.

---

## File structure

- Create `src/design/tokens.js` — palette, per-song hues, z-layer order. One source of truth for the look.
- Create `src/hooks/useReducedMotion.js` — boolean hook over `prefers-reduced-motion`.
- Create `src/hooks/useAudioAnalyser.js` — wraps a Web Audio `AnalyserNode` over the shared `<audio>`; exposes `getAmplitude()` (0–1), resilient to no-Web-Audio / no-src.
- Create `src/components/Glass.jsx` — the portfolio glass recipe as a wrapper.
- Create `src/components/BackgroundField.jsx` — fixed nebula + constellation + grain + vignette.
- Create `src/components/LivingGlow.jsx` — audio-reactive orb + ripples + subtle meter.
- Modify `src/components/HeroSection.jsx` — compose `LivingGlow` + glass "Begin Listening" + new copy.
- Modify `src/App.jsx` — swap `BackgroundLayer` → `BackgroundField`; pass `audioRef`/`isPlaying`/`currentTrack` hue into the hero.
- Tests alongside each new file.

> Plan 1 leaves the existing post-hero sections (`AboutSection`, `CollectionSection`, etc.) functionally intact; Plan 2 reskins them. The field renders behind them.

---

### Task 1: Design tokens

**Files:**
- Create: `src/design/tokens.js`
- Test: `src/design/tokens.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { PALETTE, SONG_HUES, Z } from './tokens'

describe('design tokens', () => {
  it('exposes the warm base + reddish nebula palette', () => {
    expect(PALETTE.base).toBe('#080503')
    expect(PALETTE.warm).toBe('rgba(255,150,70,1)')
    expect(PALETTE.nebula.length).toBe(3)
  })
  it('has four per-song hues (amber, rust, gold, deep)', () => {
    expect(SONG_HUES).toEqual([28, 18, 40, 12])
  })
  it('orders layers back-to-front', () => {
    expect(Z.nebula).toBeLessThan(Z.constellation)
    expect(Z.constellation).toBeLessThan(Z.glow)
    expect(Z.glow).toBeLessThan(Z.content)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/design/tokens.test.js`
Expected: FAIL — cannot resolve `./tokens`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/design/tokens.js — single source of truth for the "living glow" look.
export const PALETTE = {
  base: '#080503',
  bgWash: ['#0d0805', '#050302'],
  warm: 'rgba(255,150,70,1)',
  star: 'rgba(255,200,150,1)',
  textWarm: '#ffe6c8',
  textSoft: '#f3e7d6',
  nebula: ['rgba(225,70,45,0.55)', 'rgba(205,50,38,0.5)', 'rgba(235,95,60,0.48)'],
}
// amber · rust · gold · deep — each track owns one
export const SONG_HUES = [28, 18, 40, 12]
export const Z = { nebula: 0, constellation: 1, ripple: 2, glow: 3, vignette: 4, grain: 5, content: 6 }
export const hueForIndex = (i) => SONG_HUES[((i % SONG_HUES.length) + SONG_HUES.length) % SONG_HUES.length]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/design/tokens.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/design/tokens.js src/design/tokens.test.js
git commit -m "feat(design): add living-glow design tokens"
```

---

### Task 2: useReducedMotion hook

**Files:**
- Create: `src/hooks/useReducedMotion.js`
- Test: `src/hooks/useReducedMotion.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  it('returns true when the OS prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
  it('returns false when motion is allowed', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/useReducedMotion.test.jsx`
Expected: FAIL — cannot resolve `./useReducedMotion`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/hooks/useReducedMotion.js
import { useEffect, useState } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/hooks/useReducedMotion.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReducedMotion.js src/hooks/useReducedMotion.test.jsx
git commit -m "feat(hooks): add useReducedMotion"
```

---

### Task 3: useAudioAnalyser hook

**Files:**
- Create: `src/hooks/useAudioAnalyser.js`
- Test: `src/hooks/useAudioAnalyser.test.jsx`

**Behaviour:** Given the shared `<audio>` ref, lazily build an `AudioContext` + `AnalyserNode` on first play. Expose a stable `getAmplitude()` that returns a smoothed 0–1 loudness, or **0** when Web Audio is unavailable (jsdom) or nothing is wired. Never throws.

- [ ] **Step 1: Write the failing test**

```jsx
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useRef } from 'react'
import { useAudioAnalyser } from './useAudioAnalyser'

describe('useAudioAnalyser', () => {
  it('returns getAmplitude that yields 0 when Web Audio is unavailable', () => {
    const { result } = renderHook(() => {
      const ref = useRef(null)            // no element, no AudioContext in jsdom
      return useAudioAnalyser(ref, false)
    })
    expect(typeof result.current.getAmplitude).toBe('function')
    expect(result.current.getAmplitude()).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/hooks/useAudioAnalyser.test.jsx`
Expected: FAIL — cannot resolve `./useAudioAnalyser`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/hooks/useAudioAnalyser.js
import { useEffect, useRef, useCallback } from 'react'

// Wraps the shared <audio> element in a Web Audio AnalyserNode and exposes a
// smoothed amplitude (0..1). Degrades to a constant 0 when Web Audio is missing
// (e.g. jsdom) or no real media is connected — callers fall back to the
// simulated breath in that case.
export function useAudioAnalyser(audioRef, isPlaying) {
  const ctxRef = useRef(null)
  const analyserRef = useRef(null)
  const dataRef = useRef(null)
  const smoothRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) return
    const el = audioRef.current
    const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
    if (!el || !AC || analyserRef.current) return
    try {
      const ctx = new AC()
      const src = ctx.createMediaElementSource(el)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      src.connect(analyser)
      analyser.connect(ctx.destination)
      ctxRef.current = ctx
      analyserRef.current = analyser
      dataRef.current = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      analyserRef.current = null // wiring failed → stay silent (amplitude 0)
    }
  }, [audioRef, isPlaying])

  const getAmplitude = useCallback(() => {
    const analyser = analyserRef.current
    const data = dataRef.current
    if (!analyser || !data) return 0
    analyser.getByteFrequencyData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) sum += data[i]
    const raw = sum / data.length / 255 // 0..1
    smoothRef.current += (raw - smoothRef.current) * 0.2 // ease for a musical feel
    return smoothRef.current
  }, [])

  return { getAmplitude }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/hooks/useAudioAnalyser.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useAudioAnalyser.js src/hooks/useAudioAnalyser.test.jsx
git commit -m "feat(hooks): add useAudioAnalyser with silent fallback"
```

---

### Task 4: Glass component

**Files:**
- Create: `src/components/Glass.jsx`
- Test: `src/components/Glass.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Glass from './Glass'

describe('Glass', () => {
  it('renders children inside a frosted surface', () => {
    render(<Glass><span>Begin Listening</span></Glass>)
    const el = screen.getByText('Begin Listening').parentElement
    expect(el).toBeInTheDocument()
    expect(el.style.backdropFilter || el.style.webkitBackdropFilter).toMatch(/blur/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/Glass.test.jsx`
Expected: FAIL — cannot resolve `./Glass`.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/Glass.jsx — portfolio glass recipe (header + card), warm-dark tuned.
export default function Glass({ children, as: Tag = 'div', radius = 40, style = {}, ...rest }) {
  return (
    <Tag
      style={{
        borderRadius: radius,
        border: '1px solid rgba(255,236,214,0.18)',
        background: 'rgba(255,240,225,0.06)',
        backdropFilter: 'blur(6px) saturate(1.15)',
        WebkitBackdropFilter: 'blur(6px) saturate(1.15)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/Glass.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Glass.jsx src/components/Glass.test.jsx
git commit -m "feat(ui): add Glass wrapper (portfolio recipe)"
```

---

### Task 5: BackgroundField (nebula + constellation + grain + vignette)

**Files:**
- Create: `src/components/BackgroundField.jsx`
- Test: `src/components/BackgroundField.test.jsx`

**Note:** The constellation canvas logic is ported verbatim from the portfolio `HeroCanvas` (depth field, pointer + scroll parallax, drift, wrap), recolored warm, with per-point flicker, and with the near "orb" points filtered out (`d > 0.66`). Under reduced motion (and in jsdom, where `getContext` is null), no animation loop runs.

- [ ] **Step 1: Write the failing test**

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BackgroundField from './BackgroundField'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('BackgroundField', () => {
  it('renders an aria-hidden canvas and does not throw under reduced motion / no 2d context', () => {
    const { container } = render(<BackgroundField />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.getAttribute('aria-hidden')).toBe('true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/BackgroundField.test.jsx`
Expected: FAIL — cannot resolve `./BackgroundField`.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/BackgroundField.jsx — fixed, site-wide warm atmosphere.
// Constellation motion is the portfolio HeroCanvas, verbatim: depth field, pointer +
// scroll parallax, drift, wrap. Differences only: warm palette, per-point flicker, and
// the near "orb" points (d > 0.66) are filtered out — small flickering far-stars only.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const grainUrl =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const styles = `
  .bgfield { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;
    background:radial-gradient(120% 120% at 50% 50%, #0d0805 0%, #080503 60%, #050302 100%); }
  .bgfield-cloud { position:absolute; border-radius:50%; filter:blur(72px); mix-blend-mode:screen; opacity:0.05; }
  .bgfield-c1 { width:70vmax; height:55vmax; left:-12vmax; top:-8vmax;
    background:radial-gradient(circle, rgba(225,70,45,0.55), transparent 65%); animation:bgfd1 66s ease-in-out infinite alternate; }
  .bgfield-c2 { width:60vmax; height:60vmax; right:-14vmax; top:6vmax;
    background:radial-gradient(circle, rgba(205,50,38,0.5), transparent 64%); animation:bgfd2 82s ease-in-out infinite alternate; }
  .bgfield-c3 { width:56vmax; height:46vmax; left:16vmax; bottom:-14vmax;
    background:radial-gradient(circle, rgba(235,95,60,0.48), transparent 66%); animation:bgfd3 94s ease-in-out infinite alternate; }
  @keyframes bgfd1 { from{transform:translate(0,0) scale(1);} to{transform:translate(8vmax,4vmax) scale(1.12);} }
  @keyframes bgfd2 { from{transform:translate(0,0) scale(1.05);} to{transform:translate(-7vmax,6vmax) scale(0.95);} }
  @keyframes bgfd3 { from{transform:translate(0,0) scale(1);} to{transform:translate(5vmax,-5vmax) scale(1.1);} }
  .bgfield-canvas { position:absolute; inset:0; width:100%; height:100%; }
  .bgfield-vignette { position:absolute; inset:0; background:radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%); }
  .bgfield-grain { position:absolute; inset:0; opacity:0.16; mix-blend-mode:overlay; background-image:${grainUrl}; }
  @media (prefers-reduced-motion: reduce) { .bgfield-cloud { animation:none !important; } }
`

export default function BackgroundField() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const g = cv.getContext('2d')
    if (!g) return // jsdom / unsupported → no animation
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0, tt = 0
    const ptr = { x: 0, y: 0 }, par = { x: 0, y: 0 }
    let pts = []
    const rand = (a, b) => a + Math.random() * (b - a)

    function resize() {
      const rect = cv.getBoundingClientRect()
      w = rect.width; h = rect.height
      cv.width = Math.max(1, Math.floor(w * dpr)); cv.height = Math.max(1, Math.floor(h * dpr))
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(40, Math.min(120, Math.floor((w * h) / 11000)))
      pts = Array.from({ length: count }, () => {
        const d = Math.pow(Math.random(), 2.4)
        const speed = 0.03 + d * 0.16
        return { x: rand(0, w), y: rand(0, h), vx: rand(-speed, speed), vy: rand(-speed, speed),
          d, r: 0.4 + d * 1.7, a: 0.1 + d * 0.7, tw: rand(0.6, 2.0), ph: rand(0, 6.283) }
      }).filter((p) => p.d <= 0.66)
      pts.sort((p1, p2) => p1.d - p2.d)
    }
    function frame() {
      tt += 0.016
      par.x += (ptr.x - par.x) * 0.02; par.y += (ptr.y - par.y) * 0.02
      g.clearRect(0, 0, w, h)
      const n = pts.length, sx = new Array(n), sy = new Array(n)
      const scroll = reduced ? 0 : window.scrollY
      const spanY = h + 80
      for (let i = 0; i < n; i++) {
        const p = pts[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < -40) p.x = w + 40; else if (p.x > w + 40) p.x = -40
        if (p.y < -40) p.y = h + 40; else if (p.y > h + 40) p.y = -40
        const shift = 2.7 + p.d * 13.3
        sx[i] = p.x + par.x * shift
        const yRaw = p.y + par.y * shift - scroll * (0.08 + p.d * 0.42)
        sy[i] = (((yRaw + 40) % spanY) + spanY) % spanY - 40
      }
      for (let i = 0; i < n; i++) {
        const p = pts[i]
        const tw = 0.55 + 0.45 * Math.sin(tt * p.tw + p.ph)
        g.fillStyle = `rgba(255,200,150,${p.a * tw})`
        g.beginPath(); g.arc(sx[i], sy[i], p.r, 0, Math.PI * 2); g.fill()
      }
      raf = requestAnimationFrame(frame)
    }
    function onMove(e) {
      const rect = cv.getBoundingClientRect()
      ptr.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      ptr.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    function onLeave() { ptr.x = 0; ptr.y = 0 }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseout', onLeave)
      raf = requestAnimationFrame(frame)
    } else {
      frame() // one static frame
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [reduced])

  return (
    <div className="bgfield" aria-hidden="true">
      <style>{styles}</style>
      <div className="bgfield-cloud bgfield-c1" />
      <div className="bgfield-cloud bgfield-c2" />
      <div className="bgfield-cloud bgfield-c3" />
      <canvas ref={ref} className="bgfield-canvas" aria-hidden="true" />
      <div className="bgfield-vignette" />
      <div className="bgfield-grain" />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/BackgroundField.test.jsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/BackgroundField.jsx src/components/BackgroundField.test.jsx
git commit -m "feat(ui): add fixed BackgroundField (nebula + warm constellation)"
```

---

### Task 6: LivingGlow (audio-reactive orb + ripples + meter)

**Files:**
- Create: `src/components/LivingGlow.jsx`
- Test: `src/components/LivingGlow.test.jsx`

**Props:** `getAmplitude` (fn → 0..1, from `useAudioAnalyser`), `hue` (number, current song hue; default `28`). It runs a simulated breathing envelope and uses `Math.max(simEnv, realAmplitude)` so it breathes with no audio and reacts to real audio. Under reduced motion it renders a single static frame (no rAF).

- [ ] **Step 1: Write the failing test**

```jsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LivingGlow from './LivingGlow'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('LivingGlow', () => {
  it('renders the orb pulse + core under reduced motion without throwing', () => {
    const { container } = render(<LivingGlow getAmplitude={() => 0} hue={28} />)
    expect(container.querySelector('.lg-pulse')).toBeInTheDocument()
    expect(container.querySelector('.lg-core')).toBeInTheDocument()
  })
  it('does not require getAmplitude (defaults safely)', () => {
    const { container } = render(<LivingGlow />)
    expect(container.querySelector('.lg-pulse')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/LivingGlow.test.jsx`
Expected: FAIL — cannot resolve `./LivingGlow`.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/LivingGlow.jsx — the orb that breathes with the music.
// Default: a simulated breathing envelope (matches the locked mockup). When a real
// track plays, getAmplitude() > sim and the orb reacts to the actual audio.
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const styles = `
  .lg-ringwrap { position:absolute; inset:0; z-index:2; }
  .lg-ring { position:absolute; left:50%; bottom:calc(18vh + 16px); width:13.44px; height:13.44px; margin:-6.72px;
    border-radius:50%; border:1px solid rgba(255,150,70,0.0645); transform:scale(0); opacity:0.147; animation:lg-ring 5.4s ease-out forwards; }
  @keyframes lg-ring { 0%{ transform:scale(0.2); opacity:0.147; } 100%{ transform:scale(42); opacity:0; } }
  .lg-pulse { position:absolute; bottom:calc(18vh + 16px - 12.43vmin); left:calc(50% - 12.43vmin); width:24.86vmin; height:24.86vmin;
    border-radius:50%; z-index:3; filter:blur(5px); }
  .lg-core { position:absolute; bottom:calc(18vh + 16px - 2.352vmin); left:calc(50% - 2.352vmin); width:4.703vmin; height:4.703vmin;
    border-radius:50%; z-index:3; filter:blur(2.5px); background:radial-gradient(circle, rgba(255,200,140,0.55), transparent 70%); }
  .lg-bars { position:absolute; bottom:9vh; left:0; right:0; height:34px; z-index:5; display:flex; align-items:flex-end; justify-content:center; gap:5px; opacity:0.5; }
  .lg-bar { width:3px; background:rgba(255,170,90,0.7); border-radius:2px; height:4px; }
`

export default function LivingGlow({ getAmplitude = () => 0, hue = 28 }) {
  const pulseRef = useRef(null)
  const coreRef = useRef(null)
  const wrapRef = useRef(null)
  const barsRef = useRef(null)
  const reduced = useReducedMotion()

  // build the meter bars once
  useEffect(() => {
    const bars = barsRef.current
    if (!bars || bars.childElementCount) return
    for (let i = 0; i < 24; i++) {
      const b = document.createElement('div'); b.className = 'lg-bar'; bars.appendChild(b)
    }
  }, [])

  useEffect(() => {
    const pulse = pulseRef.current, core = coreRef.current, wrap = wrapRef.current, bars = barsRef.current
    if (!pulse || !core) return
    const simEnv = (t) => Math.max(0, 0.45 + 0.35 * Math.sin(t * 1.6) + 0.22 * Math.sin(t * 3.7 + 1) + 0.12 * Math.sin(t * 7.1))
    const paint = (env) => {
      pulse.style.transform = `scale(${0.82 + env * 0.5})`
      pulse.style.opacity = `${0.4 + env * 0.5}`
      pulse.style.background = `radial-gradient(circle, hsla(${hue},95%,60%,0.5) 0%, hsla(${hue - 8},90%,45%,0.16) 42%, transparent 68%)`
      core.style.transform = `scale(${0.85 + env * 0.45})`
      core.style.opacity = `${0.45 + env * 0.5}`
    }
    if (reduced) { paint(0.6); return } // single static frame

    let raf = 0, t = 0, prev = 0, cooldown = 0
    const barEls = bars ? Array.from(bars.children) : []
    const spawnRing = () => {
      if (!wrap) return
      const r = document.createElement('div'); r.className = 'lg-ring'
      r.style.borderColor = `hsla(${hue},92%,62%,0.0588)`
      wrap.appendChild(r)
      r.addEventListener('animationend', () => r.remove())
    }
    const loop = () => {
      t += 0.016; cooldown -= 0.016
      const env = Math.max(simEnv(t), getAmplitude()) // real audio overrides the breath
      paint(env)
      if (env > 0.72 && env > prev && cooldown <= 0) { spawnRing(); cooldown = 1.7 }
      prev = env
      for (let i = 0; i < barEls.length; i++) {
        const v = Math.max(0.04, env * Math.abs(Math.sin(t * 2 + i * 0.5)))
        barEls[i].style.height = `${4 + v * 26}px`; barEls[i].style.opacity = `${0.3 + v * 0.5}`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, hue, getAmplitude])

  return (
    <div aria-hidden="true">
      <style>{styles}</style>
      <div className="lg-ringwrap" ref={wrapRef} />
      <div className="lg-pulse" ref={pulseRef} />
      <div className="lg-core" ref={coreRef} />
      <div className="lg-bars" ref={barsRef} />
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/LivingGlow.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/LivingGlow.jsx src/components/LivingGlow.test.jsx
git commit -m "feat(ui): add audio-reactive LivingGlow orb"
```

---

### Task 7: Rebuild HeroSection on the new foundation

**Files:**
- Modify: `src/components/HeroSection.jsx` (replace the body; keep the `onBegin`/`gateOpen`/`nowPlayingTitle` prop contract, add `getAmplitude` + `hue`)
- Modify: `src/components/HeroSection.test.jsx`

The hero keeps its existing props so `App` and the gate logic keep working. It now renders `LivingGlow` + the eyebrow **MUSIC COLLECTION**, the **Josh Ermert** wordmark, and a glass **Begin Listening** button.

- [ ] **Step 1: Update the test to the new copy + behaviour**

Replace `src/components/HeroSection.test.jsx` with:

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HeroSection from './HeroSection'

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
})

describe('HeroSection', () => {
  it('shows the MUSIC COLLECTION eyebrow and the name, and triggers onBegin', async () => {
    const onBegin = vi.fn()
    render(<HeroSection onBegin={onBegin} gateOpen={false} getAmplitude={() => 0} hue={28} />)
    expect(screen.getByText(/music collection/i)).toBeInTheDocument()
    expect(screen.getByText(/josh ermert/i)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /begin listening/i }))
    expect(onBegin).toHaveBeenCalledOnce()
  })
  it('shows "Now Playing" with the track title after the gate opens', () => {
    render(<HeroSection onBegin={() => {}} gateOpen={true} nowPlayingTitle="TODO — Untitled Track 1" getAmplitude={() => 0} />)
    expect(screen.getByText(/now playing.*untitled track 1/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/components/HeroSection.test.jsx`
Expected: FAIL — eyebrow text/structure don't match yet.

- [ ] **Step 3: Rewrite HeroSection**

Replace the contents of `src/components/HeroSection.jsx` with:

```jsx
// HeroSection — living-glow hero. Eyebrow "MUSIC COLLECTION", wordmark "Josh Ermert",
// glass "Begin Listening" (starts audio → the orb breathes with the music).
import LivingGlow from './LivingGlow'
import Glass from './Glass'

const styles = `
  .hero { position:relative; height:100vh; width:100vw; overflow:hidden; display:flex; align-items:center; justify-content:center;
    font-family:Georgia,'Times New Roman',serif; }
  .hero-eyebrow { position:absolute; top:8vh; left:0; right:0; text-align:center; font-size:10px; letter-spacing:0.34em;
    text-transform:uppercase; color:rgba(243,231,214,0.45); z-index:6; }
  .hero-name { font-size:clamp(42px,9.5vw,108px); letter-spacing:0.05em; z-index:6; text-align:center; color:#ffe6c8;
    text-shadow:0 0 50px rgba(255,140,70,0.25); }
  .hero-begin { position:absolute; bottom:18vh; left:0; right:0; text-align:center; z-index:6;
    font-size:11px; letter-spacing:0.32em; text-transform:uppercase; color:rgba(255,236,216,0.9); animation:hero-fade 1.3s ease 0.5s both; }
  .hero-begin button { font:inherit; letter-spacing:inherit; text-transform:inherit; color:inherit; cursor:pointer;
    display:inline-block; padding:13px 30px; }
  .hero-begin button:hover { background:rgba(255,240,225,0.11); border-color:rgba(255,200,150,0.4); transform:translateY(-1px); }
  @keyframes hero-fade { from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:translateY(0); } }
  .hero-nowplaying { position:absolute; bottom:30vh; left:0; right:0; text-align:center; z-index:6; font-size:11px;
    letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,180,110,0.7); }
`

export default function HeroSection({ onBegin, gateOpen, nowPlayingTitle = null, getAmplitude = () => 0, hue = 28 }) {
  return (
    <section className="hero">
      <style>{styles}</style>
      <LivingGlow getAmplitude={getAmplitude} hue={hue} />

      <div className="hero-eyebrow">Music Collection</div>
      <h1 className="hero-name">Josh Ermert</h1>

      <p className="hero-nowplaying" style={{ visibility: gateOpen && nowPlayingTitle ? 'visible' : 'hidden' }}>
        Now Playing — {nowPlayingTitle}
      </p>

      <div className="hero-begin">
        <Glass as="button" type="button" onClick={onBegin}>Begin Listening</Glass>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- src/components/HeroSection.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.jsx src/components/HeroSection.test.jsx
git commit -m "feat(hero): rebuild hero on living-glow foundation"
```

---

### Task 8: Wire the foundation into App

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

Swap `BackgroundLayer` for `BackgroundField`, build the analyser from the shared audio, compute the current track's hue, and pass `getAmplitude` + `hue` into the hero. (Post-hero sections are untouched in this plan.)

- [ ] **Step 1: Update App.test for the new hero copy**

In `src/App.test.jsx`, the existing test clicks "Begin Listening" then asserts a track title appears. Keep it, but the begin button is now glass; the role/name is unchanged. Replace the assertion line that references the old data title if needed — it already uses `TODO — Untitled Track 1`. Add a check that the background field mounted:

```jsx
it('renders the background field and begins listening', async () => {
  const { container } = render(<App />)
  expect(container.querySelector('.bgfield')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: /begin listening/i }))
  expect(screen.getAllByText('TODO — Untitled Track 1').length).toBeGreaterThan(0)
})
```

(Replace the existing single `it(...)` block with this one; keep the `beforeEach` mocks.)

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/App.test.jsx`
Expected: FAIL — `.bgfield` not found (still using BackgroundLayer).

- [ ] **Step 3: Update App.jsx**

In `src/App.jsx`: replace the `BackgroundLayer` import with `BackgroundField`, import the analyser hook + hue helper, and pass props to the hero. Apply these edits:

Imports — replace:
```jsx
import BackgroundLayer from './components/BackgroundLayer'
```
with:
```jsx
import BackgroundField from './components/BackgroundField'
import { useAudioAnalyser } from './hooks/useAudioAnalyser'
import { tracks } from './data/tracks'
import { hueForIndex } from './design/tokens'
```

Inside `App()`, after the `useAudio()` destructure and `currentTrack` line, add:
```jsx
  const { getAmplitude } = useAudioAnalyser(audioRef, isPlaying)
  const trackIndex = tracks.findIndex((t) => t.id === currentTrackId)
  const hue = hueForIndex(trackIndex < 0 ? 0 : trackIndex)
```

Replace the render line:
```jsx
      <BackgroundLayer />
```
with:
```jsx
      <BackgroundField />
```

Replace the hero line:
```jsx
      <HeroSection onBegin={begin} gateOpen={gateOpen} nowPlayingTitle={currentTrack?.title ?? null} />
```
with:
```jsx
      <HeroSection onBegin={begin} gateOpen={gateOpen} nowPlayingTitle={currentTrack?.title ?? null} getAmplitude={getAmplitude} hue={hue} />
```

- [ ] **Step 4: Run the full suite**

Run: `npm test`
Expected: PASS — all suites green (App + every component).

- [ ] **Step 5: Run the production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat(app): mount BackgroundField + audio-reactive hero"
```

---

## Self-review notes

- **Spec coverage:** palette/hues/layers (Task 1), reduced-motion (Task 2), audio-reactive engine (Tasks 3+6), glass (Task 4), nebula+constellation field (Task 5), hero copy + glass button (Task 7), site-wide field mount (Task 8). Section reskins (nav/collection/about/contact/player, retire Pressings/Live) are **Plan 2** — authored after this lands against the real `Glass`/`BackgroundField`/token interfaces.
- **Honesty:** no fabricated content introduced; track data untouched (still honest `TODO`). Glow uses simulated breath until real audio exists.
- **`BackgroundLayer.jsx` / `Pillars.jsx`:** left on disk but unused after Task 8; Plan 2 deletes them (and their tests) once sections are reskinned, to avoid breaking their current tests mid-stream.
- **Reduced motion:** every animated unit (BackgroundField, LivingGlow, nebula CSS) has a static path; tests run under `matches:true`.

## Plan 2 preview (not yet authored)
Nav glass + "Collection" rename · CollectionSection glass cards with per-track hue · retire PressingsSection → Collections · AboutSection glass panel · hide LiveSection until real dates · ContactSection glass · PersistentPlayer warm/glass reskin · delete `BackgroundLayer`/`Pillars`. Authored once Plan 1's interfaces are concrete.
