import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const library = JSON.parse(fs.readFileSync("src/data/library.json", "utf8"));
const homeSource = fs.readFileSync("src/app/pages/home-page.js", "utf8");
const topicPageSource = fs.readFileSync("src/app/pages/topic-page.js", "utf8");
const topicCardSource = fs.readFileSync("src/app/components/topic-card.js", "utf8");
const breadcrumbSource = fs.readFileSync("src/app/components/breadcrumb.js", "utf8");
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


test("real nested sample Topic exposes its child Topic", () => {
  const parent = library.root.children.find(
    (child) => child.type === "topic" && child.name === "נושא לדוגמה 1"
  );

  assert.ok(parent);

  const childTopics = parent.children.filter(
    (child) => child.type === "topic"
  );

  assert.equal(childTopics.length, 1);
  assert.equal(childTopics[0].name, "תת נושא");

  const hash = router.buildRoute(router.ROUTE_NAMES.TOPIC, {
    id: childTopics[0].id,
  });
  const parsed = router.parseRoute(hash);

  assert.equal(parsed.name, "topic");
  assert.equal(parsed.params.id, childTopics[0].id);
});

test("TopicPage renders only direct child Topics through reusable TopicCard", () => {
  assert.match(topicPageSource, /topic\.children\.filter/);
  assert.match(topicPageSource, /child\.type === "topic"/);
  assert.match(topicPageSource, /<\$\{TopicCard\}/);
  assert.match(topicPageSource, /childTopic\.id/);
  assert.doesNotMatch(topicPageSource, /TrackRow|track\.title|child\.type === "track"/);
});

test("TopicPage has distinct truly-empty and no-subtopics states", () => {
  assert.match(topicPageSource, /topic\.children\.length === 0/);
  assert.match(topicPageSource, /אין עדיין תוכן בנושא זה/);
  assert.match(topicPageSource, /אין תתי־נושאים בנושא זה/);
});

test("TopicPage structure is depth-independent", () => {
  assert.doesNotMatch(topicPageSource, /parentId|depth\s*[<=>]|level\s*[<=>]|slice\(0,/);
  assert.match(topicPageSource, /TopicCard/);
});


test("TopicPage builds Breadcrumb data from the indexed Topic trail", () => {
  assert.match(topicPageSource, /getTopicTrail\(topic\.id\)/);
  assert.match(topicPageSource, /<\$\{Breadcrumb\} topics=\$\{breadcrumbTopics\}/);
});

test("Breadcrumb links Home and ancestor Topics while marking the current Topic", () => {
  assert.match(breadcrumbSource, /href="#\/"/);
  assert.match(breadcrumbSource, /buildRoute\(ROUTE_NAMES\.TOPIC/);
  assert.match(breadcrumbSource, /aria-current="page"/);
  assert.match(breadcrumbSource, /topics\.map/);
});

test("Breadcrumb remains usable at deep hierarchy widths", () => {
  assert.match(componentsCss, /\.breadcrumb\s*\{/);
  assert.match(componentsCss, /overflow-x:\s*auto/);
  assert.match(componentsCss, /min-width:\s*max-content/);
});
