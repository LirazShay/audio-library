# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M4 — Topics and subtopics — COMPLETE

M5 — Track lists — IN PROGRESS

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
- M4.1 — root Topic presentation and reusable TopicCard
- M4.2 — nested child Topics on TopicPage and empty states
- M4.3 — arbitrary-depth Breadcrumb and parent navigation
- M5.1 — reusable TrackRow and Topic Track lists

## M4.3 result
- Added `src/app/components/breadcrumb.js`
- Added indexed parent Topic relationships to the Library Service
- Added `getTopicTrail(id)`
- Breadcrumb renders Home, every ancestor Topic, and the current Topic
- Ancestor Topic links use the Router `buildRoute()` contract
- Current Topic is marked with `aria-current="page"`
- Topic trails are built from indexed parent relationships rather than parsing display paths
- Breadcrumb supports arbitrary hierarchy depth
- Breadcrumb remains usable on narrow screens through horizontal overflow
- Added explicit parent-route Back-style hashchange coverage
- No Track lists or M5 work was added

## M4 automated verification
GitHub Actions `Test App`: PASS

Library Service:
- tests: 10
- pass: 10
- fail: 0

Router:
- tests: 12
- pass: 12
- fail: 0

App routing:
- tests: 7
- pass: 7
- fail: 0

M3 integration:
- tests: 4
- pass: 4
- fail: 0

M4 Topic/Breadcrumb:
- tests: 12
- pass: 12
- fail: 0

## M4 Definition of Done
- Home displays root Topics: PASS
- reusable TopicCard exists: PASS
- Topic Page displays child Topics: PASS
- arbitrary recursive depth is supported: PASS
- 10-level Topic trail works: PASS
- Breadcrumb order is correct: PASS
- Breadcrumb ancestor links use valid Topic routes: PASS
- current Breadcrumb item is marked correctly: PASS
- empty Topic state exists: PASS
- Topic with content but no subtopics has a distinct state: PASS
- browser Back-style parent navigation remains functional: PASS
- Topic UI is mobile-first and responsive: PASS
- narrow deep Breadcrumb remains usable: PASS
- Track lists remain outside M4: PASS
- automated regression suite passes: PASS

## M5.1 result
- Added reusable `src/app/components/track-row.js`
- `TrackRow` builds direct Track URLs through `buildRoute(ROUTE_NAMES.TRACK, ...)`
- Track rows display the Track title
- Optional numeric duration is formatted only when present; missing duration is not invented
- `TopicPage` now renders direct Track children under a dedicated `קטעי שמע` list
- Track order is preserved exactly from the Topic's JSON children order
- No Track sorting is performed in the browser
- Topics remain above Tracks as separate sections
- Empty Track sections are omitted
- Tracks with `text: null` remain visible and navigable
- Long Track titles wrap safely
- No audio element, playback call, Audio Engine, or M6 work was added
- M4 regression assertions were updated to stop enforcing the now-obsolete pre-M5 “no Track UI” boundary

## M5.1 automated verification
GitHub Actions `Test App`: PASS

M5 Track tests:
- tests: 10
- pass: 10
- fail: 0

Coverage:
- real sample Track order: PASS
- nested Topic Track order: PASS
- Track without TXT remains visible: PASS
- TopicPage Track rows: PASS
- empty Track section omitted: PASS
- TrackRow uses Router contract: PASS
- all 4 sample Tracks build direct URLs: PASS
- optional duration behavior: PASS
- long title/list styling: PASS
- no playback implementation in M5.1: PASS

Regression:
- Library Service: 10/10 PASS
- Router: 12/12 PASS
- App routing: 7/7 PASS
- M3 integration: 4/4 PASS
- M4 Topic/Breadcrumb: 12/12 PASS

## Sample content
- 2 top-level sample topics
- 1 nested subtopic
- 4 valid WAV files
- 3 matching TXT files
- 1 Audio file without TXT by design

## Local testing
- Run `tools/update-and-preview.cmd`
- Local preview URL: `http://127.0.0.1:8080/`
- Home shows the 2 root Topics
- `נושא לדוגמה 1` shows the nested `תת נושא`
- Nested Topic pages show Breadcrumb navigation back through their ancestors

## Deployment
GitHub Pages workflow remains configured and active.

## Next
M5.2 — render Tracks that exist directly under the logical root on Home using the same `TrackRow`, then run the complete M5 regression/Definition of Done pass. Do not add playback yet.


## Working rule
Each future "Continue to the next stage" command advances exactly one logical sub-stage.
Milestones M3 through M7 may be split into as many sub-stages as needed for quality.
Do not report final completion until M7 is fully complete and verified.
GitHub is the source of truth.
