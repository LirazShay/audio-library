# AI Start Here

This file is the stable entry point for every new AI/ChatGPT session working on this repository.

## Purpose

The repository, not any previous chat, is the durable memory of the project.

A new chat must be able to continue the project without access to earlier conversation history.

## Mandatory read order

Before proposing or implementing project work, read these files in this order:

1. `AI-START-HERE.md`
2. `CURRENT-STATUS.md`
3. `docs/00-project-index.md`
4. `docs/11-current-implementation.md`
5. `docs/12-development-workflow.md`
6. The milestone/specification documents relevant to the requested work
7. `docs/13-decisions-log.md` when architecture or behavior may be affected
8. `docs/14-testing-troubleshooting.md` when testing, audio, local preview, CI, or debugging is involved
9. `docs/15-chat-handoff-protocol.md` before closing a substantial work session

## Source-of-truth precedence

When information conflicts, use this order:

1. Current repository code and current generated runtime data
2. `CURRENT-STATUS.md` for current stage, open verification, and immediate next action
3. Explicit accepted decisions in `docs/13-decisions-log.md`
4. Product/functional/architecture specifications under `docs/`
5. Historical notes and old chat summaries

Do not treat an old chat message as more authoritative than the current repository.

## Current project identity

- Repository: `LirazShay/audio-library`
- Default branch: `main`
- Application type: static client-side audio library
- Deployment: GitHub Pages
- Runtime source: `src/`
- Content source: `src/content/`
- Generated library index: `src/data/library.json`
- Frontend: Preact + HTM + @preact/signals + Browser ES Modules + plain CSS
- No backend in the current version

## Continuation rule

If the user says:

> תמשיך לשלב הבא

advance exactly one logical sub-stage from the current documented state.

Do not skip stages just because later work looks straightforward.

## Standard stage lifecycle

Every implementation stage should normally follow:

1. Read current status and relevant docs/code
2. Define the exact scope of this one stage
3. Implement
4. Add/update automated tests
5. Run/verify relevant CI
6. Update documentation and `CURRENT-STATUS.md`
7. Commit the completed logical unit
8. Report what changed and what the next stage is

See `docs/12-development-workflow.md` for the full contract.

## Critical continuity rule

At the end of substantial work, do not leave important reasoning only in the chat.

Record durable information in the repository:

- current stage / next action → `CURRENT-STATUS.md`
- architecture or behavioral decision → `docs/13-decisions-log.md`
- recurring bug / local testing issue → `docs/14-testing-troubleshooting.md`
- workflow/process change → `docs/12-development-workflow.md`

## Current handoff warning

The latest audio progress/local media-server fixes are automated-test verified, but the user's final local-browser confirmation may still be pending. Read the top of `CURRENT-STATUS.md` before assuming that issue is closed.

## Do not

- redesign the project from scratch in each chat
- ask the user to repeat information already documented in the repository
- edit `src/data/library.json` by hand when the Generator is the source
- create a second Audio element for player features
- make UI components manipulate the Audio element directly
- mark a stage complete before its relevant checks pass
- claim a manual/browser verification happened if only automated tests ran

## Useful commands

Local update + tests + preview on Windows:

```cmd
tools\update-and-preview.cmd
```

Local checks:

```cmd
tools\local-check.cmd
```

Manual local server:

```cmd
node tools\dev-server.js
```

Local URL:

```text
http://127.0.0.1:8080/
```
