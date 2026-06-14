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
