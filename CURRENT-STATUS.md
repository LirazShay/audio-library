# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M2 — Library Loader

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
- M2.1 — single-load Library fetch, validation, app state, and basic UI status

## M2.1 result
- Added `src/app/services/library-service.js`
- Library URL is resolved relative to the module and points to `src/data/library.json` at runtime
- `loadLibrary()` caches the same Promise so the library is loaded only once per page session
- Loaded document is retained in memory and exposed through `getLoadedLibrary()`
- Validates `schemaVersion === 1`
- Validates `site.name`
- Validates root object, root type/id, and `root.children`
- HTTP failures and invalid documents reject with controlled errors
- Added `src/app/state/app-state.js` with `loading`, `ready`, and `error` state
- Application initialization happens once from `main.js`
- App now shows loading, success, or error state
- Site title is read from `library.site.name` after load instead of remaining permanently hard-coded in the UI
- Success state currently shows the number of root-level items only; topic/track indexes are intentionally deferred

## M2.1 verification
- GitHub Pages deployment completed successfully after the M2.1 code changes
- Added `.github/workflows/test-app.yml`
- Browser ES-module syntax checks: PASS
- Current `src/data/library.json` validation: PASS
- Unsupported `schemaVersion` rejection test: PASS
- Test App workflow: PASS

## Next
M2.2 — build the in-memory indexes (`tracksById`, `topicsById`) and expose `getRoot()`, `getTopic(id)`, `getTrack(id)`, `getAllTracks()`, and `getAllTopics()` without adding routing or content pages yet.

## Working rule
"Continue to the next stage" advances one logical unit of work, which may be a sub-stage of a milestone rather than the whole milestone.
GitHub is the source of truth.
