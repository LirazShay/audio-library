import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const library = JSON.parse(fs.readFileSync("src/data/library.json", "utf8"));
const homeSource = fs.readFileSync("src/app/pages/home-page.js", "utf8");
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

  assert.ok(tracks.length >= 10);

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


test("Home supports Tracks directly under the logical root without sorting", () => {
  assert.match(homeSource, /const rootChildren = getRoot\(\)\?\.children \?\? \[\]/);
  assert.match(homeSource, /child\.type === "track"/);
  assert.match(homeSource, /rootTracks\.length > 0/);
  assert.match(homeSource, /rootTracks\.map/);
  assert.match(homeSource, /<\$\{TrackRow\}/);
  assert.doesNotMatch(homeSource, /rootTracks\.sort|sort\(.*rootTracks/s);
});

test("real sample covers a Topic with Tracks only", () => {
  const topic = findTopicByName("נושא לדוגמה 2");
  assert.ok(topic);

  assert.equal(
    topic.children.some((child) => child.type === "topic"),
    false
  );

  assert.deepEqual(
    topic.children
      .filter((child) => child.type === "track")
      .map((track) => track.title),
    ["01 - בדיקה"]
  );
});

test("real sample covers a Topic with both child Topics and Tracks", () => {
  const topic = findTopicByName("נושא לדוגמה 1");
  assert.ok(topic);

  assert.equal(
    topic.children.some((child) => child.type === "topic"),
    true
  );

  assert.deepEqual(
    topic.children
      .filter((child) => child.type === "track")
      .map((track) => track.title),
    ["01 - פתיחה", "02 - קטע בלי טקסט"]
  );
});

test("Home and Topic pages both reuse the same TrackRow component", () => {
  assert.match(homeSource, /import \{ TrackRow \}/);
  assert.match(topicPageSource, /import \{ TrackRow \}/);
  assert.match(homeSource, /<\$\{TrackRow\}/);
  assert.match(topicPageSource, /<\$\{TrackRow\}/);
});


test("current demo includes a real root-level Track for Home testing", () => {
  const rootTracks = library.root.children.filter(
    (child) => child.type === "track"
  );

  assert.ok(rootTracks.length >= 1);
  assert.ok(
    rootTracks.some((track) => track.title === "00 - פתיח לבדיקה מקומית")
  );
});

test("current demo includes longer-player and long-title fixtures", () => {
  const longPlayerTopic = findTopicByName("בדיקות נגן ארוכות");
  assert.ok(longPlayerTopic);

  const titles = longPlayerTopic.children
    .filter((child) => child.type === "track")
    .map((track) => track.title);

  assert.deepEqual(titles, [
    "01 - מסלול רגוע לבדיקת ניגון",
    "02 - בדיקת Seek ומהירות",
    "03 - קטע ארוך ללא טקסט",
  ]);

  const longNameTopic = findTopicByName(
    "תת נושא עם שם ארוך במיוחד לבדיקת מובייל"
  );
  assert.ok(longNameTopic);
  assert.ok(
    longNameTopic.children.some(
      (child) =>
        child.type === "track" &&
        child.title === "01 - כותרת ארוכה במיוחד לבדיקת גלישה ושבירת שורות"
    )
  );
});
