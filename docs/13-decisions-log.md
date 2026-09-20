# Decisions Log

This log records durable project decisions that future chats must not casually reverse.

Dates below are documentation dates unless explicitly stated otherwise. Several decisions were established earlier during implementation and are being consolidated here for continuity.

---

## D-001 — Static client-side deployment

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
The current product is a static client-side web application deployed through GitHub Pages.

### Consequences
- no application backend in the current version
- no database/authentication dependency
- only `src/` is deployed
- browser-compatible static assets are required

### References
- `docs/05-technical-architecture.md`
- `.github/workflows/deploy-pages.yml`

---

## D-002 — Filesystem content is the editorial source

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Audio/TXT content under `src/content/` is the source. `src/data/library.json` is generated.

### Reason
The product is intentionally file-driven and should not require manually maintaining duplicate content metadata.

### Consequences
- normal content edits happen under `src/content/`
- Generator rebuilds `library.json`
- hand-editing generated JSON is not the normal workflow

### References
- `tools/generate-library.js`
- `docs/03-content-generator-spec.md`

---

## D-003 — Deterministic content IDs

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Topic/Track IDs are generated deterministically from normalized relative paths.

### Reason
Direct URLs must remain stable while content ordering changes.

### Consequences
Renaming/moving a content path may intentionally change its generated ID.

---

## D-004 — Hash-based client router

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Navigation uses hash routes.

### Current routes
- `#/`
- `#/topic/:id`
- `#/track/:id`

### Reason
This fits static GitHub Pages hosting and supports direct client-side navigation without server rewrite infrastructure.

### References
- `src/app/services/router-service.js`
- `src/app/state/router-state.js`

---

## D-005 — Preact Signals for central reactive state

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Application/router/player reactive state uses `@preact/signals`.

### Consequences
Components should consume Signals through the established state modules rather than creating competing global state systems.

---

## D-006 — Exactly one shared Audio element

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
The whole application uses one shared Audio / HTMLAudioElement instance.

### Reason
Continuous player state, predictable Track switching, and future Mini Player/Full Player coexistence require one playback engine.

### Consequences
- do not create one Audio per page/component
- M8 Mini Player must control the same Audio instance
- route changes must not implicitly create competing playback

### References
- `src/app/services/audio-service.js`
- `docs/05-technical-architecture.md`

---

## D-007 — Audio Service owns Audio-element mutation

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
UI components must not directly manipulate the Audio element.

### Reason
A service boundary keeps Full Player, future Mini Player, tests, and global state consistent.

### Consequences
UI calls functions such as:
- play
- pause
- seek
- setRate
- setVolume
- toggleMute
- setRepeatTrack

Direct assignments such as `audio.currentTime = ...` belong inside Audio Service only.

---

## D-008 — Full Player progress is state-driven

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Visible time, seek position, and percentage visualization derive from central Player State.

### Progress synchronization
Player State receives progress from:
- native `timeupdate`
- a requestAnimationFrame sync while playback is active

### Reason
A local-browser issue showed that relying only on visible play state/native cadence was not sufficiently robust.

### Consequences
Any future progress UI should consume the same central state instead of polling independently.

---

## D-009 — Lightweight visualization, no Web Audio API

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
The current M7 visualization is a CSS progress visualization, not waveform/frequency analysis.

### Reason
The visualization requirement was satisfied without adding AudioContext/AnalyserNode complexity.

### Consequences
Do not introduce Web Audio API merely to animate the current progress ring.

If future requirements explicitly need waveform/spectrum analysis, treat that as a new architectural decision.

---

## D-010 — Previous/Next remain placeholders until listening context exists

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Previous/Next buttons are intentionally disabled placeholders in M7.

### Reason
Correct previous/next behavior requires an explicit listening context/order, which was not part of M7.

### Consequences
Do not wire them to arbitrary global Track order.

Implement listening context deliberately in a later milestone.

---

## D-011 — Volume control is desktop-only in the current Full Player

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Volume slider/mute UI is shown at the desktop breakpoint and intentionally hidden on mobile.

### Reason
Avoid unnecessary mobile control density.

### Consequences
Changing mobile volume UX is a deliberate UX change, not a bug fix.

---

## D-012 — Local development server must support media byte ranges

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
`tools/dev-server.js` supports HTTP byte ranges.

### Required behavior
- `206 Partial Content`
- `Accept-Ranges: bytes`
- `Content-Range`
- accurate `Content-Length`
- `416` for invalid ranges

### Reason
Browser media timeline/seek behavior should be tested against a server that behaves like a real media origin.

### Consequences
Do not simplify the local server back to unconditional full-file 200 responses.

---

## D-013 — Local preview script restarts the server

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
`tools/update-and-preview.cmd` stops an existing listener on port 8080 before starting the fresh local server.

### Reason
Previously, the new server process could exit with EADDRINUSE while the old process continued serving stale code.

### Consequences
Server changes must take effect after running the standard preview script.

---

## D-014 — GitHub repository is the cross-chat source of truth

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
Long-term project memory lives in the repository, not in a specific ChatGPT conversation.

### Consequences
- every new chat reads `AI-START-HERE.md`
- current task state lives in `CURRENT-STATUS.md`
- architectural changes go into this decision log
- recurring debugging knowledge goes into troubleshooting docs
- substantial sessions must leave a repository handoff

---

## D-015 — One logical sub-stage per “continue” command

**Status:** Accepted  
**Documented:** 2026-09-20

### Decision
When the user says `תמשיך לשלב הבא`, advance exactly one logical sub-stage.

### Reason
This keeps implementation, tests, documentation, and review bounded and recoverable across separate chats.

### Consequences
Formal milestones may be split into Mx.1, Mx.2, etc.
