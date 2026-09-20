# Development Workflow

This document defines how implementation work is carried out so that any new chat can continue safely.

## 1. Core principle

The repository is the durable project memory.

A chat is temporary execution context.

Anything required for the next chat must be written into the repository before the current session ends.

## 2. Start-of-session protocol

Before implementing anything substantial:

1. Read `/AI-START-HERE.md`
2. Read `/CURRENT-STATUS.md`
3. Read `/docs/00-project-index.md`
4. Read `/docs/11-current-implementation.md`
5. Identify the exact current milestone/sub-stage
6. Read only the product/technical documents relevant to that stage
7. Inspect the actual current files that will be changed
8. Check whether there is an unresolved manual verification or known issue

Do not ask the user to repeat information that is already in these files.

## 3. One-stage rule

When the user says:

```text
תמשיך לשלב הבא
```

advance exactly one logical sub-stage.

A logical sub-stage should be:

- small enough to implement and verify completely
- large enough to deliver one coherent behavior or architecture improvement

Do not silently combine several roadmap milestones.

If a formal milestone is large, split it into Mx.1, Mx.2, Mx.3, etc.

## 4. Stage definition

Before editing code, state internally and, when useful, to the user:

- exact scope
- files likely affected
- what is explicitly out of scope
- success criteria

Example:

```text
M8.1:
- create MiniPlayer component
- read existing global Player State
- show title + play/pause + small progress
- do not implement listening context Previous/Next yet
```

## 5. Implementation lifecycle

For every logical implementation stage:

### A. Inspect
Read current code and specs.

### B. Implement
Make the smallest coherent change that fulfills the stage.

### C. Test
Add or update automated tests for:
- happy path
- relevant edge cases
- regression boundary

### D. Verify
Run the relevant GitHub Actions / CI.

If CI fails:
- do not mark the stage complete
- inspect the exact failure
- fix implementation or stale test
- rerun

### E. Document
Update durable project memory:
- `CURRENT-STATUS.md`
- decision log if needed
- troubleshooting if needed
- current implementation snapshot if architecture materially changed

### F. Commit
Commit the completed logical unit.

### G. Report
Tell the user:
- what was completed
- test/CI result
- what the next logical stage is

## 6. Documentation update rules

### Update CURRENT-STATUS.md when:
- a stage starts or completes
- the immediate next action changes
- a manual verification becomes pending/complete
- a known issue appears/disappears
- a major CI/runtime result changes

### Update docs/11-current-implementation.md when:
- architecture changes
- files/responsibilities move
- new runtime subsystem is added
- a documented implementation statement is no longer true

### Update docs/13-decisions-log.md when:
- choosing between meaningful architectural alternatives
- changing a previous architectural rule
- introducing a deliberate constraint
- deferring a feature in a way future chats need to understand

### Update docs/14-testing-troubleshooting.md when:
- a bug was difficult enough to recur
- local environment behavior differs from production
- a diagnostic sequence proved useful
- a tool/server/browser quirk matters

## 7. Source-of-truth rule

If documentation and code disagree:

1. inspect the code
2. determine whether code is correct or a regression
3. fix either code or documentation
4. never leave the contradiction unresolved

## 8. Generated files

`src/data/library.json` is generated from `src/content/`.

Normal content changes should be made in `src/content/`, followed by the Generator.

Do not treat a hand-edit of generated JSON as the long-term solution.

## 9. Audio architecture guardrails

These are current architectural rules:

- exactly one shared Audio instance
- Player State is centralized
- Audio Service owns Audio-element mutations
- UI components call service functions
- FullPlayer/MiniPlayer must control the same Audio
- navigation should not create a second Audio element

Any change to these rules requires an explicit decision-log entry.

## 10. Local verification

Preferred Windows flow:

```cmd
tools\update-and-preview.cmd
```

It should:

1. pull latest changes
2. run local checks
3. stop previous local preview server
4. start a fresh preview server
5. open the browser

Local URL:

```text
http://127.0.0.1:8080/
```

## 11. CI expectations

Do not infer success from code inspection alone.

Relevant workflows currently include:

- Test Generator
- Test App
- Deploy GitHub Pages

If a change affects documentation continuity, the Documentation Contract workflow must also pass once introduced.

## 12. Manual verification honesty

Automated tests and manual browser checks are different facts.

Use explicit language:

- `Automated: PASS`
- `Manual local verification: PENDING`
- `Manual local verification: CONFIRMED BY USER`

Do not convert automated confidence into a fictional manual confirmation.

## 13. Completion language

If the user has defined a multi-stage horizon and requested the word `סיימתי` only at total completion:

- do not use `סיימתי` after an intermediate sub-stage
- use it only when the full agreed horizon is implemented and verified

## 14. Git discipline

Prefer coherent commits.

Commit messages should describe the logical change, for example:

```text
feat: add M8.1 mini player shell
test: cover mini player shared audio state
docs: complete M8.1
fix: keep live audio progress synchronized
```

Do not create unrelated changes in the same commit when avoidable.

## 15. New-chat behavior

A new chat should be able to respond to:

```text
תמשיך לשלב הבא
```

without the user pasting an old conversation.

If the repository does not make the next stage unambiguous, fix the documentation first instead of guessing.
