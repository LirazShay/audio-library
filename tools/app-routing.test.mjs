import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const appSource = fs.readFileSync("src/app/app.js", "utf8");
const homeSource = fs.readFileSync("src/app/pages/home-page.js", "utf8");
const notFoundSource = fs.readFileSync("src/app/pages/not-found-page.js", "utf8");
const topicSource = fs.readFileSync("src/app/pages/topic-page.js", "utf8");
const trackSource = fs.readFileSync("src/app/pages/track-page.js", "utf8");

test("App renders from the reactive currentRoute Signal", () => {
  assert.match(appSource, /currentRoute\.value/);
  assert.match(appSource, /ROUTE_NAMES\.HOME/);
  assert.match(appSource, /ROUTE_NAMES\.TOPIC/);
  assert.match(appSource, /ROUTE_NAMES\.TRACK/);
});

test("App routes Home to HomePage and invalid routes to NotFoundPage", () => {
  assert.match(appSource, /<\$\{HomePage\}/);
  assert.match(appSource, /<\$\{NotFoundPage\}/);
});

test("Topic routes resolve through getTopic and render TopicPage only when found", () => {
  assert.match(appSource, /getTopic\(route\.params\.id\)/);
  assert.match(appSource, /<\$\{TopicPage\} topic=/);
  assert.match(appSource, /topic\s*\?[^:]+TopicPage/s);
  assert.match(appSource, /:\s*html`<\$\{NotFoundPage\}/s);
});

test("Track routes resolve through getTrack and render TrackPage only when found", () => {
  assert.match(appSource, /getTrack\(route\.params\.id\)/);
  assert.match(appSource, /<\$\{TrackPage\} track=/);
  assert.match(appSource, /track\s*\?[^:]+TrackPage/s);
});

test("HomePage preserves M2 total Topic and Track counts", () => {
  assert.match(homeSource, /getAllTopics\(\)\.length/);
  assert.match(homeSource, /getAllTracks\(\)\.length/);
});

test("NotFoundPage provides a Home hash link", () => {
  assert.match(notFoundSource, /href="#\/"/);
  assert.match(notFoundSource, /העמוד לא נמצא/);
});

test("Topic and Track pages display their resolved entity names", () => {
  assert.match(topicSource, /topic\.name/);
  assert.match(trackSource, /track\.title/);
  assert.match(trackSource, /בשלבים הבאים/);
});
