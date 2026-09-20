# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M2 — Library Loader — IN PROGRESS

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
- M2.1 — single-load library fetch, envelope validation, and app loading state
- M2.2 — recursive in-memory Topic/Track indexes and lookup API

## M2.1 result
- `library.json` is fetched through `src/app/services/library-service.js`
- Library URL is resolved relative to the module so it works locally and on GitHub Pages
- `loadLibrary()` caches the same Promise and performs only one Fetch per page session
- Successfully loaded document is retained in memory via `getLoadedLibrary()`
- Validates `schemaVersion === 1`
- Validates `site.name`
- Validates root object, root type/id, and `root.children`
- Missing JSON / HTTP failures are converted to controlled loader errors
- Malformed JSON is converted to a controlled loader error
- Network failures are converted to a controlled loader error
- `app-state.js` exposes `loading`, `ready`, and `error` state
- Failure leaves the App mounted and renders an error state instead of crashing the page
- Existing local preview mounting fix keeps Signals reactive after async loading

## M2.1 automated verification
GitHub Actions `Test App` completed successfully.

Library Loader tests:
- valid document: PASS
- unsupported schemaVersion: PASS
- one Fetch / same Promise reuse: PASS
- missing library JSON / 404: PASS
- malformed JSON: PASS
- network failure: PASS

Result:
- tests: 6
- pass: 6
- fail: 0

## M2.2 result
- Added recursive in-memory `topicsById` and `tracksById` Maps
- Root topic is indexed under `root`
- Added `getRoot()`
- Added `getTopic(id)`
- Added `getTrack(id)`
- Added `getAllTopics()`
- Added `getAllTracks()`
- `getAllTopics()` excludes the logical root and preserves JSON traversal order
- `getAllTracks()` preserves JSON traversal order
- Unknown IDs return `null`
- Before library load, root/lookups return `null` and collection APIs return empty arrays
- Duplicate Topic IDs are rejected during index construction
- Unsupported node types are rejected during index construction
- Indexes are built once when the single library load succeeds

## M2.2 automated verification
GitHub Actions `Test App` completed successfully.

Library Service result:
- tests: 9
- pass: 9
- fail: 0

New M2.2 coverage:
- recursive Topic lookup: PASS
- recursive Track lookup: PASS
- root lookup: PASS
- unknown ID behavior: PASS
- ordered `getAllTopics()`: PASS
- ordered `getAllTracks()`: PASS
- duplicate Topic ID rejection: PASS
- unsupported node rejection: PASS

## Sample content
- 2 top-level sample topics
- 1 nested subtopic
- 4 valid WAV files
- 3 matching TXT files
- 1 Audio file without TXT by design

## Local testing
- `tools/update-and-preview.cmd` pulls, tests, generates data, starts localhost, and opens the browser
- local preview URL: `http://127.0.0.1:8080/`

## Deployment
GitHub Pages workflow is configured and active.

## Next
M2.3 — use the in-memory Library Service API to show total Topic and Track counts in the basic loaded-state UI, then run the full M2 Definition of Done/regression pass. No routing or content pages yet.


## Working rule
Each "Continue to the next stage" command advances exactly one M2 sub-stage.
When the full M2 Definition of Done is complete, stop before M3 and report completion for local verification.
GitHub is the source of truth.
