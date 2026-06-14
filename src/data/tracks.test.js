import { describe, it, expect } from 'vitest'
import { tracks, getTrack, SIGNATURE_TRACK_ID } from './tracks'

describe('tracks', () => {
  it('has the two real songs with playable audio', () => {
    expect(tracks).toHaveLength(2)
    for (const t of tracks) {
      expect(t).toMatchObject({ id: expect.any(String), title: expect.any(String), kind: expect.any(String), duration: expect.any(String) })
      expect(t.src).toMatch(/^\/audio\/.+\.mp3$/)
    }
  })
  it('getTrack returns by id', () => { expect(getTrack(tracks[0].id).title).toBe(tracks[0].title) })
  it('signature track resolves', () => { expect(getTrack(SIGNATURE_TRACK_ID)).toBeTruthy() })
})
