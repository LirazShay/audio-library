const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

function read(filePath) {
  assert.equal(
    fs.existsSync(filePath),
    true,
    "Required continuity file is missing: " + filePath
  );
  return fs.readFileSync(filePath, "utf8");
}

function includesAll(text, values) {
  for (const value of values) {
    assert.equal(
      text.includes(value),
      true,
      "Expected documentation to include: " + value
    );
  }
}

const start = read("AI-START-HERE.md");
const status = read("CURRENT-STATUS.md");
const readme = read("README.md");
const index = read("docs/00-project-index.md");
const implementation = read("docs/11-current-implementation.md");
const workflow = read("docs/12-development-workflow.md");
const decisions = read("docs/13-decisions-log.md");
const troubleshooting = read("docs/14-testing-troubleshooting.md");
const handoff = read("docs/15-chat-handoff-protocol.md");

test("stable AI entry point links the mandatory continuity chain", () => {
  includesAll(start, [
    "CURRENT-STATUS.md",
    "docs/00-project-index.md",
    "docs/11-current-implementation.md",
    "docs/12-development-workflow.md",
    "docs/13-decisions-log.md",
    "docs/14-testing-troubleshooting.md",
    "docs/15-chat-handoff-protocol.md",
    "תמשיך לשלב הבא",
  ]);

  assert.match(start, /repository, not any previous chat/i);
});

test("CURRENT-STATUS exposes cross-chat current state and manual verification honesty", () => {
  includesAll(status, [
    "## Continuation snapshot",
    "### Immediate next action",
    "### Manual verification still pending",
    "AI-START-HERE.md",
    "M8 Mini/global player: NOT STARTED",
  ]);
});

test("documentation index includes product docs and continuity docs", () => {
  for (let number = 1; number <= 10; number += 1) {
    assert.equal(
      index.includes(String(number).padStart(2, "0") + "-"),
      true
    );
  }

  includesAll(index, [
    "11-current-implementation.md",
    "12-development-workflow.md",
    "13-decisions-log.md",
    "14-testing-troubleshooting.md",
    "15-chat-handoff-protocol.md",
    "16-project-instructions.md",
  ]);
});

test("README makes cross-chat bootstrap discoverable", () => {
  includesAll(readme, [
    "AI-START-HERE.md",
    "CURRENT-STATUS.md",
    "docs/13-decisions-log.md",
    "docs/15-chat-handoff-protocol.md",
  ]);
});

test("implementation snapshot captures critical architecture invariants", () => {
  assert.match(implementation, /exactly one shared/i);
  includesAll(implementation, [
    "UI components must use Audio Service APIs",
    "must not directly set properties on the Audio element",
    "requestAnimationFrame",
    "HTTP byte ranges",
    "M8 Mini/global player",
  ]);
});

test("development workflow defines one-stage lifecycle and durable documentation updates", () => {
  includesAll(workflow, [
    "One-stage rule",
    "תמשיך לשלב הבא",
    "CURRENT-STATUS.md",
    "docs/13-decisions-log.md",
    "Manual verification honesty",
    "Automated: PASS",
  ]);
});

test("decision log preserves core architectural decisions", () => {
  includesAll(decisions, [
    "D-001",
    "D-006",
    "D-007",
    "D-012",
    "D-014",
    "D-015",
    "Exactly one shared Audio element",
    "GitHub repository is the cross-chat source of truth",
  ]);
});

test("troubleshooting keeps the unresolved progress incident and exact next diagnostic", () => {
  includesAll(troubleshooting, [
    "player says Playing but visible progress stays at 0%",
    "PENDING USER CONFIRMATION",
    "audio.currentTime",
    "Signal currentTime",
    "206 Partial Content",
  ]);
});

test("handoff protocol makes repository handoff part of completion", () => {
  includesAll(handoff, [
    "End-of-session checklist",
    "Immediate Next Action format",
    "Handoff is part of Definition of Done",
    "No important instruction exists only in chat",
  ]);
});

test("canonical Project Instructions file exists and references repository bootstrap", () => {
  const instructions = read("docs/16-project-instructions.md");

  includesAll(instructions, [
    "AI-START-HERE.md",
    "CURRENT-STATUS.md",
    "תמשיך לשלב הבא",
    "GitHub",
  ]);
});
