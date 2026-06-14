// PLACEHOLDER track data — honest, obviously unfilled. Nothing here is a real
// release. Josh: replace title/instrument/duration/year/catalogId with your real
// songs, and drop audio files into public/audio/ then set `src` (currently null).
// The `id` fields are internal slugs (never shown in the UI) — leave them as-is.
export const tracks = [
  { id: 'nocturne-eflat', title: 'TODO — Untitled Track 1', instrument: 'TBD', duration: '—', year: '—', catalogId: 'TODO-001', src: null },
  { id: 'blue-reverie',   title: 'TODO — Untitled Track 2', instrument: 'TBD', duration: '—', year: '—', catalogId: 'TODO-002', src: null },
  { id: 'cafe-trois',     title: 'TODO — Untitled Track 3', instrument: 'TBD', duration: '—', year: '—', catalogId: 'TODO-003', src: null },
  { id: 'still-water',    title: 'TODO — Untitled Track 4', instrument: 'TBD', duration: '—', year: '—', catalogId: 'TODO-004', src: null },
]
export const SIGNATURE_TRACK_ID = 'nocturne-eflat'
export const getTrack = (id) => tracks.find((t) => t.id === id)
