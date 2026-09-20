# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M2 — Library Loader — COMPLETE

M3 — Router and basic navigation — NOT STARTED

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
- M2.3 — loaded-state Topic/Track totals and full M2 regression pass

## M2.3 result
- Basic loaded-state UI now uses the Library Service API instead of counting root children
- Displays the total number of Topics across all depths
- Displays the total number of Tracks across all depths
- No routing, Topic pages, Track pages, or M3 work was added

With the current sample content the loaded state represents:
- 3 Topics total (including the nested subtopic, excluding logical root)
- 4 Tracks total

## M2 automated verification
GitHub Actions `Test App` completed successfully after the final M2 changes.

Library Service:
- tests: 9
- pass: 9
- fail: 0

Final regression checks:
- browser module syntax: PASS
- reactive Preact App mounting guard: PASS
- valid current `library.json`: PASS
- unsupported schema rejection: PASS
- single Fetch / Promise reuse: PASS
- missing JSON handling: PASS
- malformed JSON handling: PASS
- network failure handling: PASS
- recursive Topic/Track indexes: PASS
- ID lookups: PASS
- unknown ID behavior: PASS
- M2 loaded-state UI totals wiring: PASS
- real repository `library.json` recursive index verification: PASS

## M2 Definition of Done
- `library.json` loads in the browser: PASS
- supported `schemaVersion` is validated: PASS
- library is loaded only once per page session: PASS
- no repeated Fetch on page/component use: PASS
- loaded library remains in memory: PASS
- `topicsById` Map is built: PASS
- `tracksById` Map is built: PASS
- `getRoot()` works: PASS
- `getTopic(id)` works: PASS
- `getTrack(id)` works: PASS
- `getAllTopics()` works: PASS
- `getAllTracks()` works: PASS
- recursive depth is supported: PASS
- Loading state is shown: PASS
- Ready state is shown: PASS
- Topic and Track totals are shown: PASS
- missing JSON is handled without unmounting the App: PASS
- malformed JSON is handled without unmounting the App: PASS
- unsupported schema is rejected clearly: PASS
- network failure is handled as controlled error state: PASS
- automated regression suite passes: PASS

## Sample content
- 2 top-level sample topics
- 1 nested subtopic
- 4 valid WAV files
- 3 matching TXT files
- 1 Audio file without TXT by design

## Local testing
- Run `tools/update-and-preview.cmd`
- Local preview URL: `http://127.0.0.1:8080/`
- Expected M2 loaded message with current sample content: 3 Topics and 4 Tracks

## Deployment
GitHub Pages workflow remains configured and active.

## Next
M3 — Router and basic navigation has not started. Do not begin it until the next explicit stage command after local M2 verification.

## Working rule
Each future "Continue to the next stage" command advances one logical sub-stage.
GitHub is the source of truth.
