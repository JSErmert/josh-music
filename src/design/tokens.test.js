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
