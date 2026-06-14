import { getTrack } from './tracks'
export const albums = [
  // PLACEHOLDER collections — rename `title`/`year` and add a `cover` image later.
  { id: 'reveries', title: 'TODO — Collection One', year: '—', cover: null, trackIds: ['nocturne-eflat', 'still-water'] },
  { id: 'after-hours', title: 'TODO — Collection Two', year: '—', cover: null, trackIds: ['blue-reverie', 'cafe-trois'] },
]
export const albumTracks = (album) => album.trackIds.map(getTrack).filter(Boolean)
