# Current Status

## Project
Audio Library

## Current phase
Implementation in progress.

## Current milestone
M3 — Router and basic navigation — COMPLETE

M4 — Topics and subtopics — NOT STARTED

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
- M3.1 — pure hash route parsing/building contract
- M3.2 — browser hash runtime and current route Signal
- M3.3 — route-aware Home and Not Found pages
- M3.4 — Topic/Track ID resolution, direct URL and refresh verification

## M3.4 result
- Added minimal `TopicPage` and `TrackPage` route targets
- Topic routes resolve their ID through `getTopic(id)`
- Track routes resolve their ID through `getTrack(id)`
- Existing Topic IDs render the resolved Topic name
- Existing Track IDs render the resolved Track title
- Unknown Topic IDs render `NotFoundPage`
- Unknown Track IDs render `NotFoundPage`
- Minimal Topic/Track pages intentionally defer real content UI to later milestones
- No M4 topic hierarchy UI, breadcrumbs, track lists, or player work was added

## M3 automated verification
GitHub Actions `Test App`: PASS

Library Service regression:
- tests: 9
- pass: 9
- fail: 0

Router tests:
- tests: 11
- pass: 11
- fail: 0

App routing tests:
- tests: 7
- pass: 7
- fail: 0

M3 real-library integration tests:
- tests: 4
- pass: 4
- fail: 0

Integration coverage:
- direct Topic hash URL resolves against real `library.json`: PASS
- direct Track hash URL resolves against real `library.json`: PASS
- unknown Topic ID does not resolve: PASS
- unknown Track ID does not resolve: PASS
- refresh of a direct hash URL restores the same route: PASS

## M3 Definition of Done
- custom Hash Router exists with no external Router dependency: PASS
- `#/` Home route works: PASS
- `#/topic/:id` parsing/building works: PASS
- `#/track/:id` parsing/building works: PASS
- malformed route becomes Not Found: PASS
- unknown Topic/Track ID becomes Not Found after library load: PASS
- current route is reactive via Signal: PASS
- router initializes from `window.location.hash`: PASS
- `hashchange` updates current route: PASS
- `navigate()` updates the Hash: PASS
- browser Back/Forward model is supported through native Hash history + `hashchange`: PASS
- direct hash URL works: PASS
- refresh preserves the direct hash route: PASS
- Home and Not Found pages render correctly: PASS
- valid Topic and Track routes reach dedicated minimal pages: PASS
- library loading/error state remains independent from route errors: PASS
- existing M2 behavior remains green: PASS
- automated M3 regression suite passes: PASS

## Sample content
- 2 top-level sample topics
- 1 nested subtopic
- 4 valid WAV files
- 3 matching TXT files
- 1 Audio file without TXT by design

## Local testing
- Run `tools/update-and-preview.cmd`
- Local preview URL: `http://127.0.0.1:8080/`
- Home should still show 3 Topics and 4 Tracks with current sample content
- Hash URLs now support Home, Topic, Track, and Not Found routing

## Deployment
GitHub Pages workflow remains configured and active.

## Next
M4 — Topics and subtopics has not started. The next explicit stage command should begin M4.1 with root Topic presentation and reusable Topic navigation UI, without adding Track-list behavior from M5.

## Working rule
Each future "Continue to the next stage" command advances exactly one logical sub-stage.
Milestones M3 through M7 may be split into as many sub-stages as needed for quality.
Do not report final completion until M7 is fully complete and verified.
GitHub is the source of truth.
