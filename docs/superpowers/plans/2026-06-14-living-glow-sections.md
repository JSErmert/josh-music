# Living-Glow Section Reskins (Plan 2) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) tracking. These are **directive-based reskin tasks**: each applies the Plan-1 design system (`Glass`, `src/design/tokens.js`, the warm-dark palette, per-track hue) to an existing component. The implementer reads the current file, removes the listed Archive-skin motifs, applies the rules, and keeps the listed tests green. Two-stage review enforces correctness.

**Goal:** Reskin every post-hero section from the inherited "Archive Stage" (vinyl/wood/recital/turntable) look into the warm-dark "living glow" language established in Plan 1 — sections float as glass over the fixed `BackgroundField`, accents follow the per-track hue, all fabricated content becomes honest, and no vinyl/wood/turntable/recital motif or copy remains.

**Architecture:** The fixed `BackgroundField` is the single site-wide atmosphere (already mounted). Every section is transparent and floats over it; cards/panels/bars use the `Glass` recipe (`src/components/Glass.jsx`) or its values; per-track color uses `hueForIndex` from `src/design/tokens.js`. Decorative-only Archive components are deleted.

**Tech Stack:** Vite + React 19, Vitest + @testing-library/react (jsdom). No new dependencies. Existing inline-`<style>`/inline-style pattern preserved.

**Spec:** `docs/superpowers/specs/2026-06-13-living-glow-redesign/design.md`
**Plan-1 (foundation, merged):** `docs/superpowers/plans/2026-06-13-living-glow-foundation.md`

**Test conventions:** Tests mock `window.matchMedia` → `{ matches:true, ... }` (reduced motion) and `global.IntersectionObserver`. Keep components rendering correctly under those mocks. Run a single file with `npm test -- <path>`; full suite with `npm test`.

**Design rules (apply in every reskin task):**
1. **Surface = Glass.** Card/panel/bar surfaces use: `background: rgba(255,240,225,0.06)`, `backdrop-filter: blur(6px) saturate(1.15)`, `border: 1px solid rgba(255,236,214,0.18)`, `box-shadow: 0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.14)`, rounded. Prefer importing the `Glass` component where it's a simple wrapper.
2. **Sections are transparent** (no own opaque bg) so the fixed `BackgroundField` shows through.
3. **Per-track hue:** where a card represents a track, tint its border/accent with `hsla(${hueForIndex(index)}, 70%, 60%, …)`. Import `hueForIndex` from `../design/tokens`.
4. **Remove ALL** vinyl-disc motifs, wood-grain gradients/box-shadows, turntable/tonearm, proscenium, "Pressings/Archive/Liner Notes/Side A/programme/left on a sleeve" copy, and roman-numeral recital numbering.
5. **Honesty:** no fabricated venues/dates/songs/links. Hidden-until-real where there's no real data.
6. **Accessibility:** keep decorative elements `aria-hidden`; keep all interactive elements' accessible names; respect reduced motion.
7. **Text:** keep honest `TODO`/placeholder content already in place; don't invent.

---

### Task 1: Remove dead Archive scaffolding + clean global styles

**Files:**
- Delete: `src/components/BackgroundLayer.jsx`
- Delete: `src/components/Pillars.jsx`
- Modify: `src/App.jsx` (remove `Pillars` import + its `<Pillars />` render in `<main>`)
- Modify: `src/index.css` (remove the `body::after` aged-paper grain block and the amber scrollbar rule; set `body` background to the design base)

**Context:** `BackgroundLayer` is no longer imported (replaced by `BackgroundField` in Plan 1) — safe to delete. `Pillars` renders wooden proscenium rails inside `<main>` — pure Archive skin, delete and unmount. `index.css` carries an aged-paper grain (`body::after`) and amber scrollbar that belong to the old skin; the new grain lives in `BackgroundField`.

- [ ] **Step 1:** Run `npm test` to capture the green baseline (expect 48 passing).
- [ ] **Step 2:** Delete `src/components/BackgroundLayer.jsx` and `src/components/Pillars.jsx`.
- [ ] **Step 3:** In `src/App.jsx`: remove the line `import Pillars from './components/Pillars'` and remove the `<Pillars />` element from inside `<main>`. Leave everything else.
- [ ] **Step 4:** In `src/index.css`: remove the `body::after` aged-paper grain block and the custom amber scrollbar rules. Set `body { background: #050302; color: #f3e7d6; }` (design base/text). Keep the Tailwind directives.
- [ ] **Step 5:** Run `npm test` — expect still 48 passing (no test references Pillars/BackgroundLayer). Run `npm run build` — expect success.
- [ ] **Step 6:** Commit:
```bash
git add -A
git commit -m "refactor: remove dead Archive scaffolding (BackgroundLayer, Pillars, paper grain)"
```
End body with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

### Task 2: NavigationBar — glass + "Collection"

**Files:**
- Modify: `src/components/NavigationBar.jsx`
- Modify: `src/components/NavigationBar.test.jsx`

**Directives:**
- Remove the `.nav-eyebrow` "Archive" eyebrow span entirely (the `<span className="nav-eyebrow">Archive</span>` and its CSS).
- Nav links become **three**: `Collection` (`#collection`), `About` (`#about`), `Contact` (`#contact`). **Remove the "Live" link** (the Live section is hidden in Task 7). Rename the old "Archive" link to "Collection" with href `#collection`.
- Scrolled-state bar surface → warm glass: `background: rgba(20,12,7,0.55)`, `backdrop-filter: blur(14px) saturate(1.2)`, hairline `border-bottom: 1px solid rgba(255,236,214,0.12)`. Transparent before scroll (keep existing scroll logic).
- Keep the "Josh Ermert" wordmark.
- Keep reduced-motion safe; no vinyl/wood.

- [ ] **Step 1:** Update `src/components/NavigationBar.test.jsx` so the link assertions match the new nav: it should assert the wordmark "Josh Ermert" renders, and that there are links named **Collection** (`href="#collection"`), **About** (`#about`), **Contact** (`#contact`). Remove any assertion about a "Live" or "Archive" link. (Keep the existing `beforeEach`/imports.)
- [ ] **Step 2:** Run `npm test -- src/components/NavigationBar.test.jsx` — expect FAIL.
- [ ] **Step 3:** Edit `NavigationBar.jsx` per the directives above.
- [ ] **Step 4:** Run `npm test -- src/components/NavigationBar.test.jsx` — expect PASS. Then full `npm test`.
- [ ] **Step 5:** Commit `feat(nav): glass nav, Archive→Collection, drop Live link`.

---

### Task 3: FrostPanel → glass primitive, and AboutSection reskin

**Files:**
- Modify: `src/components/FrostPanel.jsx`
- Modify: `src/components/AboutSection.jsx`

**Directives:**
- `FrostPanel`: retune its surface to the glass recipe (`background: rgba(255,240,225,0.06)`, `backdropFilter: blur(6px) saturate(1.15)`, hairline `border: 1px solid rgba(255,236,214,0.18)`, soft shadow + inset top sheen). Keep its `{ className, children, ...rest }` API and the existing `FrostPanel.test.jsx` (asserts children render) green.
- `AboutSection`: remove the decorative vinyl disc block (the `.about-disc` div + the `discBg` constant), and rename the "Liner Notes" eyebrow to "About". Keep the "The Artist" heading and the honest `TODO` bio text already in place. Section stays transparent over the field; the bio sits in the (now glass) `FrostPanel`. Keep `AboutSection.test.jsx` (asserts "The Artist") green.

- [ ] **Step 1:** Confirm `FrostPanel.test.jsx` and `AboutSection.test.jsx` current assertions, then edit `FrostPanel.jsx` to the glass recipe.
- [ ] **Step 2:** Edit `AboutSection.jsx`: delete `discBg` and the `.about-disc` block; "Liner Notes" → "About".
- [ ] **Step 3:** Run `npm test -- src/components/FrostPanel.test.jsx src/components/AboutSection.test.jsx` — expect PASS. Full `npm test`.
- [ ] **Step 4:** Commit `feat(about): glass FrostPanel, drop vinyl disc + Liner Notes`.

---

### Task 4: TrackTile + CollectionSection — glass cards with per-track hue

**Files:**
- Modify: `src/components/TrackTile.jsx`
- Modify: `src/components/CollectionSection.jsx`

**Directives:**
- `TrackTile`: remove `woodBoxShadow` (and its hover repeat), `vinylBg`, and the `.track-tile-vinyl` disc-motif block. Make the tile a glass card (glass recipe surface, rounded). Keep the square aspect, the title, the meta (instrument · catalogId · duration · year), and the play/pause ring + click-to-play/toggle behaviour. Accept a new prop `hue` (number); tint the card's border and the play-ring with `hsla(${hue},70%,62%, …)` and a soft top-edge sheen in that hue. Default `hue = 28`.
- `CollectionSection`: remove the "Archive" eyebrow and the "Pressings, sessions…" stage-note paragraph. Keep the "The Collection" heading. When mapping tracks to `TrackTile`, pass `hue={hueForIndex(index)}` (import `hueForIndex` from `../design/tokens`). Section stays transparent. Keep `CollectionSection.test.jsx` green (asserts track titles render + clicking "TODO — Untitled Track 2" calls `onPlay('blue-reverie')`).

- [ ] **Step 1:** Edit `TrackTile.jsx` per directives (remove wood/vinyl, glass card, `hue` prop + hue-tinted border/ring).
- [ ] **Step 2:** Edit `CollectionSection.jsx`: drop Archive eyebrow + stage-note; pass `hue={hueForIndex(index)}` to each `TrackTile`.
- [ ] **Step 3:** Run `npm test -- src/components/CollectionSection.test.jsx` — expect PASS. Full `npm test`.
- [ ] **Step 4:** Commit `feat(collection): glass track cards with per-track hue`.

---

### Task 5: PressingsSection → "Albums" + AlbumTile reskin

**Files:**
- Modify: `src/components/PressingsSection.jsx`
- Modify: `src/components/AlbumTile.jsx`

**Directives:**
- `PressingsSection`: rename the `<h2>` "Pressings" → **"Albums"**; eyebrow "Library" → "Albums" (or remove); change the section anchor `id="archive"` → `id="albums"`. Remove the programme-header copy ("Works for Piano, Trio & Quartet") and the program-footer copy ("Offered as they were made — unguarded, unhurried."). Outer container → glass recipe; remove the amber `rgba(200,137,58,0.07)` divider fill (use a transparent/subtle gap). Keep `{ albums, onOpen }` and keep `PressingsSection.test.jsx` green (asserts "TODO — Collection One/Two" render and clicking "TODO — Collection One" calls `onOpen('reveries')` — these come from album data, unchanged).
- `AlbumTile`: remove the vinyl-disc motif block and the bottom amber hairline. Glass card surface; keep the title, year, and (if present) catalogId/meta and the play ring. Optional subtle hue tint is fine but not required.

- [ ] **Step 1:** Edit `PressingsSection.jsx` per directives.
- [ ] **Step 2:** Edit `AlbumTile.jsx` per directives.
- [ ] **Step 3:** Run `npm test -- src/components/PressingsSection.test.jsx` — expect PASS. Full `npm test`.
- [ ] **Step 4:** Commit `feat(albums): rename Pressings→Albums, glass tiles, drop vinyl motifs`.

> Note: nav link `#collection` targets `CollectionSection`. Albums section is `#albums` (not linked in the 3-item nav, reached by scroll). This is intentional.

---

### Task 6: AlbumOverlay reskin (remove recital "programme" motif)

**Files:**
- Modify: `src/components/AlbumOverlay.jsx`

**Directives:**
- Remove the `ROMAN` numeral constant and its use (track rows use plain numbering or none). Remove "programme" vocabulary: the word "programme" from the dialog `aria-label` (use `aria-label={album.title}` or `${album.title} tracks`), and rename the `.program-modal-*` recital framing in copy (CSS class names may stay or be renamed, but the visible eyebrow/title copy must not read as a recital programme). Remove the footer copy "Offered as they were made — unguarded, unhurried." Modal card + scrim → glass recipe (translucent warm card, blurred). Keep ALL behaviour and `AlbumOverlay.test.jsx` green: renders nothing when `album` null; renders `role="dialog"` and track titles when album present; clicking a track calls `onSelectTrack`; clicking close (name /close/i) calls `onClose`.

- [ ] **Step 1:** Edit `AlbumOverlay.jsx` per directives.
- [ ] **Step 2:** Run `npm test -- src/components/AlbumOverlay.test.jsx` — expect PASS. Full `npm test`.
- [ ] **Step 3:** Commit `feat(albums): glass album overlay, drop recital programme motif`.

---

### Task 7: Hide Live (remove fabricated shows) + Contact copy honesty

**Files:**
- Modify: `src/components/LiveSection.jsx`
- Modify: `src/components/LiveSection.test.jsx`
- Modify: `src/components/ContactSection.jsx`
- Modify: `src/components/ContactSection.test.jsx` (only if needed)

**Directives:**
- `LiveSection`: it currently hardcodes **fabricated** shows ("The Coyote", "Carlsbad Village, CA"). Per spec, **hide Live entirely until real dates exist.** Make `LiveSection` return `null` (and delete the fabricated show data). Leave `VenueRow.jsx` in place (unused for now) — it's honest and will be reused when real dates exist.
- `LiveSection.test.jsx`: rewrite to assert the section renders nothing, e.g. `const { container } = render(<LiveSection />); expect(container).toBeEmptyDOMElement()`. Keep the `beforeEach` mocks.
- `ContactSection`: change the booking blurb "For bookings, collaborations, and questions left on a sleeve." → an honest line WITHOUT record-sleeve vocabulary but still containing the word "bookings" (so `ContactSection.test.jsx`'s `/bookings/i` assertion stays green), e.g. "For bookings, collaborations, and anything else." Keep the honest `TODO — add contact email` placeholder.

- [ ] **Step 1:** Rewrite `LiveSection.jsx` to return `null`; rewrite `LiveSection.test.jsx` to assert empty render.
- [ ] **Step 2:** Edit `ContactSection.jsx` booking copy.
- [ ] **Step 3:** Run `npm test -- src/components/LiveSection.test.jsx src/components/ContactSection.test.jsx` — expect PASS. Full `npm test`.
- [ ] **Step 4:** Commit `feat(live,contact): hide Live until real dates (drop fabricated shows); honest contact copy`.

---

### Task 8: PersistentPlayer — minimal warm glass bar

**Files:**
- Modify: `src/components/PersistentPlayer.jsx`

**Directives:**
- Remove the entire turntable assembly: the spinning vinyl disc, the tonearm (stem/base/head), `@keyframes spinDisc`, the `woodGradientH` + "wood plinth accent" strip, and the "Side A · Track 1" groove label.
- Rebuild as a clean, fixed bottom **glass bar** (glass recipe surface, blurred, hairline top border): left = track title + meta (instrument · catalogId); center = transport controls (prev / play-pause / next — keep their accessible names exactly: "Previous", play/pause, "Next"); a slim progress bar (can stay static for now since `src` is null) and an optional subtle accent in the current track's hue. The waveform may stay as a minimal static bar set OR be replaced by a thin progress line — keep it tasteful and non-vinyl.
- Keep the component contract: props `{ track, isPlaying, onTogglePlay, onPrev, onNext }`, returns `null` when `track` is null. Keep `PersistentPlayer.test.jsx` green (title renders; play/pause button calls `onTogglePlay`; prev/next call handlers; null track → empty DOM).
- Optional: accept a `hue` prop (default 28) to tint the progress/accent; if added, App may pass it later (not required this task).

- [ ] **Step 1:** Edit `PersistentPlayer.jsx` per directives (remove all turntable/wood; clean glass bar).
- [ ] **Step 2:** Run `npm test -- src/components/PersistentPlayer.test.jsx` — expect PASS. Full `npm test` + `npm run build`.
- [ ] **Step 3:** Commit `feat(player): minimal warm glass player bar (drop turntable)`.

---

## Self-review notes
- **Spec coverage:** nav glass + Collection rename (T2); collection glass cards + hue (T4); retire Pressings→Albums (T5); About glass (T3); hide Live (T7); Contact glass/honesty (T7); player warm glass reskin (T8); delete BackgroundLayer/Pillars (T1); overlay de-recital (T6). All Plan-2 spec items covered.
- **Honesty:** removes fabricated LiveSection shows; no new fabricated content; track/album placeholders preserved.
- **Tests:** every task names the tests to keep green and the exact ones to rewrite (NavigationBar links, LiveSection empty). Full suite must stay green; `npm run build` green after T1 and T8.
- **Anchors:** nav `#collection`/`#about`/`#contact`; Albums section `#albums` reachable by scroll; `#live`/`#archive` retired.
- **Layering:** sections remain transparent over the fixed `BackgroundField`; glass surfaces float above it; player/overlay stay fixed with their existing high z-indexes.

## After Plan 2
Visual pass with the user (relaunch the brainstorm companion or run the dev server) to fine-tune per-section spacing/intensity, since section looks weren't individually mocked. Then: wire `hue` into the player from App if desired; real audio/bio/contact when Josh supplies them.
