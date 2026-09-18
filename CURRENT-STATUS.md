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

## Current repository layout

```text
/
├── src/
│   ├── index.html
│   ├── 404.html
│   ├── app/
│   ├── styles/
│   ├── content/
│   ├── data/
│   └── config/
├── tools/
│   └── generate-library.js
├── docs/
├── .github/workflows/
│   └── deploy-pages.yml
├── CURRENT-STATUS.md
├── README.md
└── .gitignore
```

## M1.2 result
- Raw scanned folders are converted to logical Topic nodes
- Audio files are converted to logical Track nodes
- Audio ↔ TXT matching uses same normalized basename in the same directory
- TXT content is read as UTF-8
- CRLF/CR line endings are normalized to LF
- Audio without TXT remains a valid Track and produces a warning
- TXT without Audio produces a warning and does not create a Track
- Multiple Audio files with the same basename in one directory produce a local error and are skipped
- Multiple TXT files with the same basename in one directory also produce a local error rather than guessing
- The same basename in different directories remains valid
- Runtime audio paths are emitted as `content/...`, never as local filesystem paths or `src/content/...`
- Local validation errors set exit code 1 while allowing the rest of the library model to be built
- Critical scan errors still use exit code 2
- M1.2 intentionally does not write `library.json` yet

## M1.2 verification
Tested with temporary nested content containing:
- nested Hebrew topics
- Audio + matching TXT
- Audio without TXT
- TXT without Audio
- duplicate Audio basename with different extensions
- duplicate TXT basename
- uppercase extensions
- Windows CRLF text

Verified:
- matched text is attached to the correct Track
- line endings are normalized
- warnings are emitted for non-blocking content issues
- ambiguous duplicate basenames are skipped
- remaining valid content still builds
- runtime audio path is `content/...`
- no JSON file write occurs yet

## Deployment
GitHub Pages workflow is configured and has deployed successfully after Pages was enabled.

## Next
M1.3 — add deterministic path-derived IDs for Topics/Tracks, finalize the library document envelope (`schemaVersion`, `generatedAt`, root), and prepare deterministic serialization before file writing.

## Working rule
"Continue to the next stage" advances one logical unit of work, which may be a sub-stage of a milestone rather than the whole milestone.
GitHub is the source of truth.
