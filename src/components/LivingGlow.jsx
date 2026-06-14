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

export default function LivingGlow({ getAmplitude = () => 0, hue = 28, isPlaying = false }) {
  const pulseRef = useRef(null)
  const coreRef = useRef(null)
  const wrapRef = useRef(null)
  const barsRef = useRef(null)
  const levelRef = useRef(0)
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
      // Drive the motion from the real audio while playing; settle to still when not.
      // A gentle floor keeps it visibly alive through quiet passages of a playing track.
      const target = isPlaying ? Math.max(getAmplitude(), 0.22 + 0.16 * Math.abs(Math.sin(t * 1.7))) : 0
      levelRef.current += (target - levelRef.current) * 0.12
      const env = levelRef.current
      paint(env)
      if (isPlaying && env > 0.5 && env > prev && cooldown <= 0) { spawnRing(); cooldown = 1.7 }
      prev = env
      for (let i = 0; i < barEls.length; i++) {
        const v = Math.max(0, env * Math.abs(Math.sin(t * 2 + i * 0.5)))
        barEls[i].style.height = `${4 + v * 26}px`; barEls[i].style.opacity = `${0.25 + v * 0.55}`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, hue, getAmplitude, isPlaying])

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
