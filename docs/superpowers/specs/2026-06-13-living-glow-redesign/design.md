# Josh Ermert — "Living Glow" redesign

**Date:** 2026-06-13
**Status:** Design locked (hero), spec for review
**Supersedes:** the inherited jacques "B3 Archive Stage" vinyl/recital aesthetic
**Hero reference:** `./hero-reference.html` (the approved, interactive mockup — open in a browser)

---

## 1. Intent

Reskin the inherited jacques portfolio into Josh Ermert's own music site. The music is **collage (layered found sounds) + solo piano**, intimate and raw, with a feeling of *unknown / uncertainty*, made in reaction to *the consequences of one's own actions*. Each song sounds different.

The design must therefore be **oblique, atmospheric, and immersive** — the visitor is *inside a warm dark space* — and must **get out of the way** so each song can be its own thing. It must feel **natural and real**: nothing fake, accessible by construction, honest placeholders (no fabricated songs, metrics, or links).

The old "Archive / Pressings / vinyl / recital" metaphor is **retired** — it's a genre costume that fights the music.

## 2. The visual language (locked from the hero)

### 2.1 Palette
- **Base:** near-black warm — `#080503`, radial wash `#0d0805 → #050302`.
- **Warm light (the "flicker"):** amber `rgba(255,150,70,…)`; star points `rgba(255,200,150,…)`; text-warm `#ffe6c8` / `#f3e7d6`.
- **Nebula (atmosphere):** deep **reddish ember** — `rgba(225,70,45)`, `rgba(205,50,38)`, `rgba(235,95,60)`, ~5% opacity, `screen` blend.
- **Per-song hue cycle:** `[28, 18, 40, 12]` (amber · rust · gold · deep) — each track owns one, so "every song sounds different" without changing the whole world.

### 2.2 Layer stack (back → front)
1. **Nebula** — 3 large blurred reddish clouds, `screen` blend, ~5% opacity, very slow drift (66–94s).
2. **Constellation** — ported **verbatim** from the portfolio `HeroCanvas`: depth field, pointer **+** scroll parallax, drift, wrap. Differences only: **warm palette** + per-point **flicker**, and the near "orb" points (`d > 0.66`) are **filtered out** — leaving a calm field of small flickering far-stars. No neighbour lines. No ping rings.
3. **Ripples** — faint warm rings echoing outward from the orb on audio swells (sparse: ≥1.7s apart; low opacity ~0.15).
4. **Living-glow orb** — soft warm radial `pulse` + bright `core`, centered on the "Begin Listening" button. **Breathes with the music.**
5. **Vignette** — radial darken at the edges for depth.
6. **Grain** — subtle film grain (`feTurbulence`), `overlay` blend, ~16%.
7. **Content** — eyebrow / wordmark / glass button / text, on top.

### 2.3 Motion engine
- **Living glow = audio-reactive.** In the real site the orb's scale/opacity is driven by a **Web Audio `AnalyserNode`** reading the *currently playing track's* amplitude envelope (the mockup uses a simulated sine envelope as a stand-in). When nothing plays, a low resting breath. The orb's hue = the current song's hue.
- **Ripples** spawn on upward swells of that same envelope.
- **Constellation** drifts + parallaxes to pointer and scroll exactly like the portfolio.
- **Nebula** drifts slowly and independently.

### 2.4 Glass (from the portfolio)
Reused recipe from the portfolio header **and** project cards: translucent fill + `backdrop-filter: blur()` + hairline border + inset top-sheen line + soft shadow, with a **lift-and-brighten on hover**. Adapted to the dark warm theme (warm-white hairline, low-alpha fill). Used for: **Begin Listening**, collection/track cards, about/contact panels, the nav bar on scroll.

### 2.5 Typography
- Georgia / serif (inherited), kept.
- Eyebrows & labels: small, uppercase, wide letter-spacing (`0.3em+`).
- Wordmark: large serif, warm, soft text-shadow.

### 2.6 Accessibility / honesty (non-negotiable)
- Every animated layer respects `prefers-reduced-motion` (static, legible fallback).
- Canvas/decor is `aria-hidden` + `pointer-events:none`; never traps interaction or screen readers.
- No fabricated content. Tracks/albums stay honest `TODO` placeholders until Josh supplies real audio + metadata. No fake play counts, dates, venues, or links.

## 3. Architecture — applying the language to the jacques baseline

The atmospheric background (nebula + constellation + grain + vignette) becomes a **single fixed, site-wide layer** behind everything, so the whole page feels like one continuous *space*. Sections are **glass panels floating over it** and scroll past; the constellation's scroll-parallax makes it feel like moving *through* the field.

### 3.1 New shared components
- `BackgroundField` — fixed full-viewport layer: nebula + constellation + grain + vignette. Replaces `BackgroundLayer` + `Pillars`. Reduced-motion aware.
- `LivingGlow` — the audio-reactive orb + ripples; consumes playing state + amplitude from the audio layer; positioned in the hero.
- `Glass` — a small wrapper applying the glass recipe (used by cards/panels/nav/button).
- `useAudioAnalyser` — hook wrapping a Web Audio `AnalyserNode` over the `<audio>` element in `useAudio`, exposing a smoothed amplitude (0–1) for `LivingGlow`. Resting breath when paused.

### 3.2 Section-by-section transformation (from jacques)
| jacques component | Becomes |
|---|---|
| `NavigationBar` ("JACQUES" + "Archive") | Wordmark **Josh Ermert**; eyebrow **Collection**; gains **glass** on scroll (portfolio header recipe). Links: Collection / About / Live / Contact. |
| `HeroSection` | The **locked living-glow hero**: eyebrow **MUSIC COLLECTION**, wordmark **Josh Ermert**, glass **Begin Listening** (starts audio → unlocks the breathing glow). |
| `CollectionSection` + `TrackTile` | Track list as **glass cards** on the field; vinyl-disc motif dropped; each card tinted by its track hue. Honest `TODO` tracks. |
| `PressingsSection` + `AlbumTile` + `AlbumOverlay` | "Pressings" (a vinyl term) **retired** → folded into **Collections** (grouped tracks) as glass cards/overlay. |
| `AboutSection` + `FrostPanel` | Glass panel over the field; honest `TODO` bio (no fabricated backstory). |
| `LiveSection` + `VenueRow` | **Hidden entirely** until real dates exist (no empty state rendered). |
| `ContactSection` | Glass; honest `TODO` contact (no fake email). |
| `PersistentPlayer` | Reskinned warm/glass; **it is the audio source that drives `LivingGlow`** (playing state + amplitude). Byline "Josh Ermert". |
| `BackgroundLayer`, `Pillars` | Removed → replaced by `BackgroundField`. |

### 3.3 Data / audio (unchanged honesty path)
- `tracks.js` / `albums.js` stay honest `TODO` placeholders; `src: null` until Josh drops files in `public/audio/` and fills metadata. Each track gains a `hue` (from the cycle) for its card + the glow.
- `useAudio` extended with the analyser hook; the **Begin Listening** gate is retained (a user gesture is required to start Web Audio).

## 4. Testing
- Keep the project green: adapt existing content/honesty tests to the new copy (as already done for branding), don't delete them.
- New units: `BackgroundField` (renders, reduced-motion path, aria-hidden), `LivingGlow` (rest vs. playing amplitude → scale mapping), `useAudioAnalyser` (amplitude 0–1, resting value when paused), `Glass` (renders children).
- Reduced-motion: assert static fallbacks render without the rAF loops.

## 5. Out of scope (for this pass)
- Real audio, real bio, real contact, real dates — Josh supplies later.
- Deployment (no deploy; that's a separate, confirmed step).

## 6. Resolved decisions (review gate, 2026-06-13)
1. **Background:** site-wide **fixed** nebula/constellation field; sections are glass over it. ✅
2. **Naming:** retire "Pressings"/"Archive" → **Collection(s)**. ✅
3. **Hero meter:** keep the **subtle** equalizer bars as a quiet "the glow is the music" cue. ✅
4. **Live section:** **hidden entirely** until real dates exist. ✅
