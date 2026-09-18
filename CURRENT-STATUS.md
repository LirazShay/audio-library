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

## M1.3 result
- Added deterministic path-derived IDs using SHA-256
- Track IDs use `track_` prefix
- Topic IDs use `topic_` prefix
- Root ID is fixed as `root`
- Relative paths are normalized to NFC before hashing
- Added `schemaVersion: 1`
- Added ISO `generatedAt`
- Added `site.name` to the library document so the UI can read the site name from JSON
- Added pretty JSON serialization with 2-space indentation
- Added parse validation of the serialized document
- Serialization remains deterministic when the same `generatedAt` value is supplied
- M1.3 intentionally does not write `src/data/library.json` yet

## M1.3 verification
Verified directly against the committed generator source:
- crypto-based deterministic ID generation is present
- Topic and Track IDs are generated from normalized relative paths
- root ID is stable
- schemaVersion/site/generatedAt envelope is present
- pretty serialization is present
- serialized output is parsed back for validation
- no `writeFile`/`rename` output step exists yet

Note: an additional local runtime test could not download the public GitHub file because the isolated container had no DNS access. This was an environment limitation, not a generator error.

## Deployment
GitHub Pages workflow is configured and has deployed successfully after Pages was enabled.

## Next
M1.4 — write `src/data/library.json` atomically (temporary file + replace), preserve the previous valid file on failure, and print the final generator summary/output path.

## Working rule
"Continue to the next stage" advances one logical unit of work, which may be a sub-stage of a milestone rather than the whole milestone.
GitHub is the source of truth.
