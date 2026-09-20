import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const appSource = fs.readFileSync("src/app/app.js", "utf8");
const homeSource = fs.readFileSync("src/app/pages/home-page.js", "utf8");
const notFoundSource = fs.readFileSync("src/app/pages/not-found-page.js", "utf8");

test("App renders from the reactive currentRoute Signal", () => {
  assert.match(appSource, /currentRoute\.value/);
  assert.match(appSource, /ROUTE_NAMES\.HOME/);
  assert.match(appSource, /ROUTE_NAMES\.NOT_FOUND/);
});

test("App routes Home to HomePage and invalid routes to NotFoundPage", () => {
  assert.match(appSource, /<\$\{HomePage\}/);
  assert.match(appSource, /<\$\{NotFoundPage\}/);
});

test("Topic and Track routes remain explicit placeholders in M3.3", () => {
  assert.match(appSource, /ROUTE_NAMES\.TOPIC/);
  assert.match(appSource, /ROUTE_NAMES\.TRACK/);
  assert.match(appSource, /תצוגת התוכן תחובר בשלב הבא/);
});

test("HomePage preserves M2 total Topic and Track counts", () => {
  assert.match(homeSource, /getAllTopics\(\)\.length/);
  assert.match(homeSource, /getAllTracks\(\)\.length/);
});

test("NotFoundPage provides a Home hash link", () => {
  assert.match(notFoundSource, /href="#\/"/);
  assert.match(notFoundSource, /העמוד לא נמצא/);
});
