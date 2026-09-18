# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M1 — Basic Generator

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
- M1.1 — Generator scanner foundation
- M1.2 — Topic/Track model builder and Audio/TXT matching
- M1.3 — deterministic IDs and library document envelope
- M1.4 — atomic library writer and final generator summary
- M1.5 — automated Generator test coverage and CI

## M1.5 result
- Added `tools/generate-library.test.js` using Node's built-in `node:test`
- Added `.github/workflows/test-generator.yml`
- Generator tests run automatically on relevant pushes and pull requests
- No external test framework or npm dependency was added
- `writeLibraryFile` now accepts an optional output path so atomic-write behavior can be tested safely outside runtime data

## Automated tests
GitHub Actions run completed successfully.

Coverage:
1. recursive nested scan with Hebrew names and uppercase audio extensions
2. natural numeric ordering (`1`, `2`, `10`)
3. stable path-derived deterministic IDs
4. Audio ↔ TXT matching and CRLF/CR → LF normalization
5. orphan TXT warning without Track creation
6. duplicate Audio basename error and ambiguous Track exclusion
7. atomic output replacement plus preservation of previous output after validation failure

Result:
- tests: 7
- pass: 7
- fail: 0

## Deployment
GitHub Pages workflow is configured and active.

## Next
M1.6 — run the complete Generator end-to-end against the repository's real `src/content/`, create/verify `src/data/library.json`, verify repeat-run stability of IDs and final CLI behavior, then close M1 if its Definition of Done is satisfied.

## Working rule
"Continue to the next stage" advances one logical unit of work, which may be a sub-stage of a milestone rather than the whole milestone.
GitHub is the source of truth.
