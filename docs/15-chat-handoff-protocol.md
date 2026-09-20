# Chat Handoff Protocol

This document defines what must be true before substantial work is handed from one chat/session to another.

## Goal

A fresh chat with repository access should be able to answer:

- What is this project?
- What is implemented?
- What is the current stage?
- What is the exact next action?
- What is still uncertain?
- What tests currently pass?
- Which decisions must not be accidentally reversed?
- How do I run and debug it?

without reading old chat history.

## 1. Required handoff state

Before ending a substantial session, verify the repository contains:

### Current status
`CURRENT-STATUS.md` must state:

- current milestone/sub-stage
- completed work
- immediate next action
- pending manual verification
- known issues, if any
- latest relevant test/CI state

### Implementation orientation
`docs/11-current-implementation.md` must still describe reality.

### Decisions
Any new durable architecture/behavior decision must be in:

```text
docs/13-decisions-log.md
```

### Troubleshooting
Any recurring or non-obvious issue must be in:

```text
docs/14-testing-troubleshooting.md
```

## 2. End-of-session checklist

Use this checklist:

- [ ] Current code is committed
- [ ] Relevant automated tests pass, or failure is explicitly documented
- [ ] CI result is known
- [ ] CURRENT-STATUS has the exact next action
- [ ] Pending manual verification is explicit
- [ ] New architectural decisions are recorded
- [ ] New debugging knowledge is recorded
- [ ] Generated data is consistent with content source
- [ ] No important instruction exists only in chat
- [ ] New chat can continue without asking for a recap

## 3. Immediate Next Action format

The top of `CURRENT-STATUS.md` should make the next action concrete.

Good:

```text
Immediate next action:
- Re-run tools\update-and-preview.cmd
- User manually verifies live percentage/time progress on a 70-second fixture
- If still stale, add temporary runtime diagnostic values for audio.currentTime vs Signal currentTime
```

Bad:

```text
Continue development.
```

## 4. Pending verification format

When something is not yet manually confirmed:

```text
Manual verification: PENDING

Automated evidence:
- Audio Service 17/17 PASS
- Local media server 4/4 PASS

Still needed:
- user confirms visible current time and percentage move during playback
```

## 5. Decision handoff format

A decision entry should contain:

- ID
- date
- status
- decision
- reason
- consequences
- affected files/docs

Do not rely on prose hidden inside an old status paragraph.

## 6. Bug handoff format

For a significant bug, record:

- symptom
- confirmed facts
- root cause, if known
- attempted fixes
- final fix
- regression tests
- manual verification state

This is especially important for browser/audio behavior.

## 7. New session bootstrap

A fresh session should:

1. read `AI-START-HERE.md`
2. read top/current sections of `CURRENT-STATUS.md`
3. read current implementation snapshot
4. inspect files involved in the immediate next action
5. continue exactly one logical stage when requested

## 8. If documentation is stale

If the new chat detects stale documentation:

1. do not blindly follow it
2. inspect current code
3. reconcile the discrepancy
4. update the docs
5. then continue feature work

Documentation repair is valid project work when continuity depends on it.

## 9. Handoff is part of Definition of Done

A stage is not fully complete for cross-chat development if:

- code works
- tests pass
- but the next chat cannot determine what happened

Continuity documentation is part of completion, not optional cleanup.
