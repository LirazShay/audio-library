# Current Implementation Snapshot

This document describes the implemented system as it exists after M7 and the post-M7 runtime fixes.

It is a technical orientation document for a new development session. For the exact active task and unresolved manual verification, always read `/CURRENT-STATUS.md` first.

## 1. Runtime architecture

The application is a static client-side web app served from `src/`.

Main technologies:

- Preact
- HTM
- @preact/signals
- Browser ES Modules
- Import Maps
- plain CSS
- HTMLAudioElement
- GitHub Pages

There is no application backend, database, authentication system, or build pipeline in the current version.

## 2. Startup flow

Entry:

```text
src/index.html
  -> src/app/main.js
```

`main.js`:

1. finds `#app`
2. initializes the single global Audio service
3. starts the hash router
4. renders the Preact `App`
5. initializes the library data

## 3. Application routing

Router:

```text
src/app/services/router-service.js
src/app/state/router-state.js
```

Current routes:

```text
#/                  -> Home
#/topic/:id         -> Topic
#/track/:id         -> Track
unknown/malformed   -> Not Found
```

The App resolves Topic and Track IDs through Library Service rather than trusting route data directly.

## 4. Library model

Source content:

```text
src/content/
```

Generator:

```text
tools/generate-library.js
```

Generated runtime document:

```text
src/data/library.json
```

The Generator:

- scans arbitrary-depth directories
- maps directories to Topics
- maps supported audio files to Tracks
- pairs matching `.txt` files by basename
- supports Tracks without TXT
- creates deterministic IDs
- preserves deterministic/natural content ordering

Do not hand-edit `library.json` as the normal content workflow.

## 5. Library Service

File:

```text
src/app/services/library-service.js
```

Responsibilities include:

- load and validate `library.json`
- cache the load Promise
- build recursive Topic/Track indexes
- expose root, Topic, Track, all Topics, all Tracks
- maintain parent relationships for Topic breadcrumbs
- return ordered Topic trails

## 6. Topic and Track browsing

Pages:

```text
src/app/pages/home-page.js
src/app/pages/topic-page.js
src/app/pages/track-page.js
src/app/pages/not-found-page.js
```

Reusable browsing components:

```text
src/app/components/topic-card.js
src/app/components/track-row.js
src/app/components/breadcrumb.js
```

Home can show:

- root Topics
- Tracks directly under the logical root

Topic pages can show:

- direct child Topics
- direct Tracks

Track order follows generated JSON order.

## 7. Audio architecture

State:

```text
src/app/state/player-state.js
```

Service:

```text
src/app/services/audio-service.js
```

There is exactly one shared `Audio` / `HTMLAudioElement` instance.

Central player Signals include:

- current Track
- current context
- playing flag
- player status
- current time
- duration
- playback rate
- volume
- muted
- repeat-current
- player error

UI components must use Audio Service APIs. They must not directly set properties on the Audio element.

## 8. Audio controls implemented

Audio Service currently supports:

- load Track
- play
- pause
- seek
- skip forward
- skip backward
- playback rate
- volume
- mute
- repeat current Track

Supported playback-rate choices:

```text
0.75x
1x
1.25x
1.5x
1.75x
2x
```

Repeat-current maps to `audio.loop` and resets when a different Track is loaded.

## 9. Full Player

Components:

```text
src/app/components/full-player.js
src/app/components/progress-bar.js
src/app/components/player-visualization.js
```

Implemented behavior includes:

- Play/Pause
- +/-10 seconds
- Seek slider
- current time / duration
- playback rate
- repeat current
- desktop volume + mute
- loading/buffering/ended/error states
- Retry after audio error
- disabled Previous/Next placeholders
- lightweight CSS progress visualization
- responsive mobile/desktop layout
- accessible semantic controls

Previous/Next are placeholders only. Listening-context navigation has not been implemented yet.

## 10. Live progress synchronization

The Audio Service uses two progress sources:

1. native `timeupdate`
2. a lightweight `requestAnimationFrame` clock while playback is active

The frame clock reads the actual `audio.currentTime` and updates central Player State.

It stops on:

- pause
- ended
- error
- Track replacement

This exists because a real local-browser case showed Play/Pause changing while visible time/progress remained stale.

## 11. Local media server

File:

```text
tools/dev-server.js
```

The local server supports HTTP byte ranges for media:

- `Accept-Ranges: bytes`
- `206 Partial Content`
- `Content-Range`
- accurate `Content-Length`
- `416` for invalid ranges

This is important for reliable browser media timeline and seek behavior.

`tools/update-and-preview.cmd` kills the previous listener on port 8080 before starting a new server so server-code changes actually take effect.

## 12. Current demo fixtures

The repository contains synthetic local WAV fixtures for UI/player testing.

Coverage includes approximately:

- 30 seconds
- 35 seconds
- 45 seconds
- 55 seconds
- 70 seconds
- 95 seconds

Fixtures also cover:

- root-level Track
- Track without TXT
- nested Topic
- long Topic name
- long Track title
- mobile wrapping

They are test/demo media generated for this repository, not external media.

## 13. CSS structure

```text
src/styles/variables.css
src/styles/base.css
src/styles/layout.css
src/styles/components.css
src/styles/responsive.css
```

Design principles already implemented:

- RTL
- mobile-first
- keyboard focus visibility
- safe long-title wrapping
- touch-friendly controls
- reduced-motion safeguard
- desktop-only volume control

## 14. Automated test structure

Generator:

```text
tools/generate-library.test.js
```

Application/service tests include:

```text
tools/library-service.test.mjs
tools/router-service.test.mjs
tools/app-routing.test.mjs
tools/m3-routing-integration.test.mjs
tools/m4-topics.test.mjs
tools/m5-tracks.test.mjs
tools/audio-service.test.mjs
tools/m6-track-page.test.mjs
tools/m7-player.test.mjs
tools/m7-final.test.mjs
tools/dev-server.test.js
```

GitHub Actions:

```text
.github/workflows/test-generator.yml
.github/workflows/test-app.yml
.github/workflows/deploy-pages.yml
```

## 15. Completed product milestones

Completed:

- M0 Skeleton
- M1 Generator
- M2 Library Loader
- M3 Router
- M4 Topics
- M5 Tracks
- M6 Audio Engine
- M7 Full Player

Not started as a formal product milestone:

- M8 Mini/global player

M8's documented goal is continuous playback while navigating away from Track Page, with a Mini Player controlling the same global Audio engine.

## 16. Important distinction

The Audio engine is already global and survives route rendering.

However, M8 is still needed to expose a Mini Player in the App shell and make continuous-playback UX explicit outside Track Page.

## 17. Deployment

Production:

```text
https://lirazshay.github.io/audio-library/
```

Only `src/` is deployed to GitHub Pages.

Development documentation and tools remain repository-only.


## 18. Headless browser E2E

Browser-level behavior is now verified with Playwright.

Files:

```text
package.json
playwright.config.cjs
e2e/player.spec.js
.github/workflows/test-e2e.yml
```

GitHub Actions runs real Chromium in headless mode against the real local Node server.

Projects:

- desktop Chromium: 1440x1000
- mobile Chromium: 390x844 with touch/mobile emulation

Current browser E2E coverage includes:

- Home -> Topic -> Track navigation
- real WAV metadata loading
- real audio playback
- visible current-time advancement
- seek slider advancement
- progress percentage advancement above 0%
- seek interaction
- playback speed selection
- repeat-current
- desktop mute
- mobile volume-hidden behavior
- no horizontal overflow
- mobile seek width

Failure diagnostics retain:

- screenshot
- Playwright trace
- video

These artifacts are uploaded by GitHub Actions when E2E fails.

The E2E suite complements, rather than replaces, the existing unit/service/contract tests.
