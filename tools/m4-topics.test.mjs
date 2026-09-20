import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const library = JSON.parse(fs.readFileSync("src/data/library.json", "utf8"));
const homeSource = fs.readFileSync("src/app/pages/home-page.js", "utf8");
const topicCardSource = fs.readFileSync("src/app/components/topic-card.js", "utf8");
const componentsCss = fs.readFileSync("src/styles/components.css", "utf8");
const responsiveCss = fs.readFileSync("src/styles/responsive.css", "utf8");

const routerUrl = pathToFileURL(
  path.resolve("src/app/services/router-service.js")
).href;
const router = await import(`${routerUrl}?m4-topics=${Date.now()}`);

test("real sample library exposes exactly two root Topics", () => {
  const rootTopics = library.root.children.filter(
    (child) => child.type === "topic"
  );

  assert.equal(rootTopics.length, 2);
  assert.deepEqual(
    rootTopics.map((topic) => topic.name),
    ["נושא לדוגמה 1", "נושא לדוגמה 2"]
  );
});

test("every real root Topic builds a valid Topic hash route", () => {
  const rootTopics = library.root.children.filter(
    (child) => child.type === "topic"
  );

  for (const topic of rootTopics) {
    const hash = router.buildRoute(router.ROUTE_NAMES.TOPIC, { id: topic.id });
    const parsed = router.parseRoute(hash);

    assert.equal(parsed.name, "topic");
    assert.equal(parsed.params.id, topic.id);
  }
});

test("HomePage reads only root Topic children and renders TopicCard", () => {
  assert.match(homeSource, /getRoot\(\)/);
  assert.match(homeSource, /child\.type === "topic"/);
  assert.match(homeSource, /<\$\{TopicCard\}/);
  assert.doesNotMatch(homeSource, /TrackRow|TrackPage/);
});

test("TopicCard uses the Router contract instead of hand-building hashes", () => {
  assert.match(topicCardSource, /buildRoute\(ROUTE_NAMES\.TOPIC/);
  assert.match(topicCardSource, /href=\$\{href\}/);
  assert.match(topicCardSource, /topic\.name/);
});

test("Topic presentation has mobile-first and desktop grid styles", () => {
  assert.match(componentsCss, /\.topic-grid\s*\{/);
  assert.match(componentsCss, /grid-template-columns:\s*1fr/);
  assert.match(componentsCss, /\.topic-card\s*\{/);
  assert.match(responsiveCss, /\.topic-grid\s*\{/);
  assert.match(responsiveCss, /repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
});
