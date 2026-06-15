// Josh Ermert's catalogue — two songs. Audio lives in public/audio/ (served at /audio/...).
export const tracks = [
  {
    id: 'son',
    title: 'Son',
    kind: 'Cover',
    credit: 'Palace',          // cover of "Son" by Palace
    duration: '—',
    src: '/audio/son.mp3',
    art: '/art/son.webp',
    lyrics: null,              // Palace's lyrics are copyrighted — link out, do not embed
    lyricsUrl: 'https://genius.com/Palace-son-lyrics',
  },
  {
    id: 'me-and-you',
    title: 'Me and You',
    kind: 'Original',
    credit: null,
    duration: '—',
    src: '/audio/me-and-you.mp3',
    art: '/art/me-and-you.webp',
    lyrics: `me and you
what am i to do?
so much love for you
baby, i'm not through until it's me and you
what am i to say?
you take my breath away
i feel this everyday
baby, come with me
i love it most when we see us in our dreams
baby, we're the dream
babe, we're everything
me and you
me and you
me and you
me and you
what am i to do?
so much love for you
baby, i'm not through until it's me and you
what am i to say?
you take my breath away
i feel this everyday
baby, come with me
me and you
me and you
me and you
me and you`,
    lyricsUrl: null,
  },
]
export const SIGNATURE_TRACK_ID = 'son'
export const getTrack = (id) => tracks.find((t) => t.id === id)
