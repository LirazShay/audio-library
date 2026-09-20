# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M5 — Track lists — COMPLETE

M6 — Audio Engine — IN PROGRESS

## Completed
- Product Requirements
- Functional Specification
- Content & Generator Specification
- UX/UI Specification
- Technical Architecture
- Project Structure
- Development Plan
- Test Plan
- Acceptance Criteria / Definition of Done
- Production / Release Checklist
- M0 — Project Skeleton
- M1 — Basic Generator
- M2 — Library Loader
- M3 — Router and basic navigation
- M4 — Topics and subtopics
- M5.1 — reusable TrackRow and Topic Track lists
- M5.2 — root Track lists and full M5 verification
- M6.1 — singleton Audio engine foundation and central player state

## M5 result
- Added reusable `src/app/components/track-row.js`
- `TrackRow` uses direct Track hash routes through the Router contract
- Topic pages display direct Track children under a dedicated `קטעי שמע` list
- Home supports Tracks that exist directly under the logical root
- Home and Topic pages reuse the same TrackRow component
- Topics and Tracks are shown in separate sections
- Topic sections appear before Track sections
- Track order is preserved exactly from generated JSON
- The browser does not re-sort Track lists
- Tracks without TXT remain visible and navigable
- Empty Track sections are omitted
- Long titles wrap safely
- Optional duration is shown only when valid duration data exists
- Track direct URLs continue to open the basic Track page
- No audio playback implementation was added; playback begins in M6

## M5 automated verification
GitHub Actions `Test App`: PASS

M5 Track tests:
- tests: 14
- pass: 14
- fail: 0

Regression:
- Library Service: 10/10 PASS
- Router: 12/12 PASS
- App routing: 7/7 PASS
- M3 integration: 4/4 PASS
- M4 Topic/Breadcrumb: 12/12 PASS

## M5 Definition of Done
- reusable TrackRow exists: PASS
- Track title is visible: PASS
- Track row opens direct Track route: PASS
- Topic with Tracks only is supported: PASS
- Topic with both child Topics and Tracks is supported: PASS
- nested Topic Tracks are supported: PASS
- Tracks directly under root are supported: PASS
- Topic UI places child Topics before Tracks: PASS
- Track list order matches JSON order: PASS
- no browser-side Track sorting: PASS
- Track without TXT remains visible: PASS
- empty Track list is not rendered unnecessarily: PASS
- long Track titles are supported: PASS
- optional duration is handled without invented data: PASS
- all current sample Tracks have valid direct URLs: PASS
- Track direct URL routing remains functional: PASS
- no Audio Engine/playback leaked into M5: PASS
- full automated regression suite passes: PASS

## M6.1 result
- Added `src/app/state/player-state.js`
- Added central Signals for:
  - `currentTrack`
  - `currentContext`
  - `isPlaying`
  - `playerStatus`
  - `currentTime`
  - `duration`
  - `playbackRate`
  - `volume`
  - `playerError`
- Added `PLAYER_STATUS` values: idle/loading/ready/playing/paused/buffering/ended/error
- Added `src/app/services/audio-service.js`
- Added exactly one shared Audio instance for the application
- Audio service is initialized once from `main.js`
- Added `loadTrack(track, context)`
- Track audio URLs are resolved relative to the deployed site structure
- Loading a Track updates current Track/context and resets time/duration/error state
- Loading a Track never autoplays
- Switching Tracks reuses the same Audio instance and replaces its source
- Media events are translated into central Player State:
  - `loadedmetadata`
  - `durationchange`
  - `timeupdate`
  - `play`
  - `pause`
  - `waiting`
  - `playing`
  - `ended`
  - `error`
- Audio error state is converted to a controlled Hebrew user-facing message
- No Full Player UI, Mini Player, play/pause buttons, seek controls, or M7 work was added

## M6.1 automated verification
GitHub Actions `Test App`: PASS

Audio Service tests:
- tests: 5
- pass: 5
- fail: 0

Coverage:
- one shared Audio instance: PASS
- repeated initialization reuses the same Audio: PASS
- `loadTrack()` updates central state: PASS
- no autoplay on load: PASS
- media events update Player State: PASS
- Track switching reuses the same Audio: PASS
- invalid Track input is rejected: PASS
- missing audio path is rejected: PASS
- startup wiring from `main.js`: PASS

Regression:
- Library Service: 10/10 PASS
- Router: 12/12 PASS
- App routing: 7/7 PASS
- M3 integration: 4/4 PASS
- M4 Topic/Breadcrumb: 12/12 PASS
- M5 Track lists: 14/14 PASS

## Sample content
- 2 top-level sample topics
- 1 nested subtopic
- 4 valid WAV files
- 3 matching TXT files
- 1 Audio file without TXT by design
- current sample has no root-level Track; root-level Track rendering is covered by implementation/contract tests

## Local testing
- Run `tools/update-and-preview.cmd`
- Local preview URL: `http://127.0.0.1:8080/`
- `נושא לדוגמה 1` shows one child Topic and two Tracks
- `תת נושא` shows one Track
- `נושא לדוגמה 2` shows one Track
- clicking a Track opens its basic Track page

## Deployment
GitHub Pages workflow remains configured and active.

## Next
M6.2 — add Audio Service control methods: `play()`, `pause()`, `seek()`, `skipForward(10)`, and `skipBackward(10)`, including clamping and play-promise failure handling. Do not build the M7 Full Player UI yet.


## Working rule
Each future "Continue to the next stage" command advances exactly one logical sub-stage.
Milestones M3 through M7 may be split into as many sub-stages as needed for quality.
Do not report final completion until M7 is fully complete and verified.
GitHub is the source of truth.
