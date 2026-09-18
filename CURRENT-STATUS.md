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

## Current repository layout

```text
/
├── src/                         # deployed runtime site
│   ├── index.html
│   ├── 404.html
│   ├── app/
│   ├── styles/
│   ├── content/
│   ├── data/
│   └── config/
├── tools/                       # generator and development tools
├── docs/                        # project documentation
├── .github/workflows/
│   └── deploy-pages.yml
├── CURRENT-STATUS.md
├── README.md
└── .gitignore
```

## M0 result
- Static site entry point moved to `src/index.html`
- Preact + HTM + Signals loaded through pinned Import Map URLs
- Browser-native ES Modules
- Source code organized under `src/app/`
- Plain CSS organized under `src/styles/`
- Runtime content is under `src/content/`
- Generated runtime data is under `src/data/`
- Runtime configuration has a dedicated `src/config/` directory
- Generator/development tooling remains outside the deployed site under `tools/`
- GitHub Pages workflow publishes only `src/`
- No Backend
- No mandatory Build step

## Deployment
- Workflow exists at `.github/workflows/deploy-pages.yml`
- The workflow is triggered on pushes to `main`
- GitHub Pages itself still requires one-time repository enablement with source set to GitHub Actions
- Until that repository setting is enabled, the Pages workflow fails at the GitHub Pages configuration step

## Verification
- No root `index.html`
- No root `404.html`
- No root `content/`
- No root `data/`
- Runtime and deployment files are isolated under `src/`
- Technical documentation has been amended to reflect the `src/` deployment layout

## Next
1. Enable GitHub Pages once in repository Settings → Pages → Source: GitHub Actions.
2. Re-run or trigger the Pages workflow.
3. Continue with M1 — Basic Generator using `src/content/` as input and `src/data/library.json` as output.

## Working rule
GitHub is the source of truth. Each milestone should end with:
1. implementation complete,
2. milestone checks complete,
3. `CURRENT-STATUS.md` updated,
4. commit/PR state clear before moving to the next milestone.
