import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const library = JSON.parse(fs.readFileSync("src/data/library.json", "utf8"));
const topicPageSource = fs.readFileSync("src/app/pages/topic-page.js", "utf8");
const trackRowSource = fs.readFileSync("src/app/components/track-row.js", "utf8");
const componentsCss = fs.readFileSync("src/styles/components.css", "utf8");

const routerUrl = pathToFileURL(
  path.resolve("src/app/services/router-service.js")
).href;
const router = await import(`${routerUrl}?m5-tracks=${Date.now()}`);

function findTopicByName(name) {
  const stack = [library.root];

  while (stack.length > 0) {
    const topic = stack.pop();

    if (topic.name === name) {
      return topic;
    }

    for (const child of topic.children ?? []) {
      if (child.type === "topic") {
        stack.push(child);
      }
    }
  }

  return null;
}

test("real sample Topic preserves Track order from JSON", () => {
  const topic = findTopicByName("נושא לדוגמה 1");
  assert.ok(topic);

  const tracks = topic.children.filter((child) => child.type === "track");

  assert.deepEqual(
    tracks.map((track) => track.title),
    ["01 - פתיחה", "02 - קטע בלי טקסט"]
  );
});

test("nested Topic exposes its Track without reordering", () => {
  const topic = findTopicByName("תת נושא");
  assert.ok(topic);

  const tracks = topic.children.filter((child) => child.type === "track");

  assert.deepEqual(
    tracks.map((track) => track.title),
    ["01 - קטע פנימי"]
  );
});

test("Track without TXT remains a visible Track candidate", () => {
  const topic = findTopicByName("נושא לדוגמה 1");
  assert.ok(topic);

  const track = topic.children.find(
    (child) => child.type === "track" && child.text === null
  );

  assert.ok(track);
  assert.equal(track.title, "02 - קטע בלי טקסט");
});

test("TopicPage renders Track rows from direct Track children in JSON order", () => {
  assert.match(topicPageSource, /child\.type === "track"/);
  assert.match(topicPageSource, /tracks\.map/);
  assert.match(topicPageSource, /<\$\{TrackRow\}/);
  assert.doesNotMatch(topicPageSource, /tracks\.sort|sort\(.*track/s);
});

test("TopicPage omits an empty Track section", () => {
  assert.match(topicPageSource, /tracks\.length > 0/);
  assert.match(topicPageSource, /קטעי שמע/);
});

test("TrackRow uses the Track route contract and displays the title", () => {
  assert.match(trackRowSource, /buildRoute\(ROUTE_NAMES\.TRACK/);
  assert.match(trackRowSource, /track\.title/);
  assert.match(trackRowSource, /href=\$\{href\}/);
});

test("every real sample Track builds a direct Track URL", () => {
  const stack = [library.root];
  const tracks = [];

  while (stack.length > 0) {
    const node = stack.pop();

    for (const child of node.children ?? []) {
      if (child.type === "topic") {
        stack.push(child);
      } else if (child.type === "track") {
        tracks.push(child);
      }
    }
  }

  assert.equal(tracks.length, 4);

  for (const track of tracks) {
    const hash = router.buildRoute(router.ROUTE_NAMES.TRACK, { id: track.id });
    const parsed = router.parseRoute(hash);

    assert.equal(parsed.name, "track");
    assert.equal(parsed.params.id, track.id);
  }
});

test("TrackRow supports optional duration without inventing missing values", () => {
  assert.match(trackRowSource, /Number\.isFinite\(duration\)/);
  assert.match(trackRowSource, /const duration = formatDuration\(track\.duration\)/);
  assert.match(trackRowSource, /duration\s*\?/);
});

test("Track list styling supports long titles and list presentation", () => {
  assert.match(componentsCss, /\.track-list\s*\{/);
  assert.match(componentsCss, /\.track-row\s*\{/);
  assert.match(componentsCss, /\.track-row__title\s*\{/);
  assert.match(componentsCss, /overflow-wrap:\s*anywhere/);
});

test("M5.1 does not add audio playback implementation", () => {
  assert.doesNotMatch(trackRowSource, /<audio|\.play\(|Audio\(/);
  assert.doesNotMatch(topicPageSource, /<audio|\.play\(|Audio\(/);
});
