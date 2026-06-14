import { describe, it, expect } from 'vitest'
import { PALETTE, SONG_HUES, Z, hueForIndex } from './tokens'

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
  it('hueForIndex wraps around the hue set, including negative indices', () => {
    expect(hueForIndex(0)).toBe(28)
    expect(hueForIndex(3)).toBe(12)
    expect(hueForIndex(4)).toBe(28) // wraps forward
    expect(hueForIndex(-1)).toBe(12) // wraps backward to last
  })
})
