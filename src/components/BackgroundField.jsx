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
