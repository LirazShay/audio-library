import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const trackPageSource = fs.readFileSync("src/app/pages/track-page.js", "utf8");
const fullPlayerSource = fs.readFileSync("src/app/components/full-player.js", "utf8");
const progressBarSource = fs.readFileSync("src/app/components/progress-bar.js", "utf8");
const componentsCss = fs.readFileSync("src/styles/components.css", "utf8");

test("TrackPage loads a routed Track only when it is not already current", () => {
  assert.match(trackPageSource, /useEffect\(\(\) => \{/);
  assert.match(trackPageSource, /currentTrack\.value\?\.id !== track\.id/);
  assert.match(trackPageSource, /loadTrack\(track\)/);
  assert.match(trackPageSource, /\[track\.id\]/);
});

test("TrackPage does not autoplay from its route-loading effect", () => {
  const effectMatch = trackPageSource.match(
    /useEffect\(\(\) => \{([\s\S]*?)\}, \[track\.id\]\)/
  );

  assert.ok(effectMatch);
  assert.doesNotMatch(effectMatch[1], /\bplay\s*\(/);
});

test("FullPlayer preserves Play Pause and ten-second skip controls", () => {
  assert.match(fullPlayerSource, /handlePlayPause/);
  assert.match(fullPlayerSource, /\bplay\(\)\.catch/);
  assert.match(fullPlayerSource, /\bpause\(\)/);
  assert.match(fullPlayerSource, /skipBackward\(\)/);
  assert.match(fullPlayerSource, /skipForward\(\)/);
  assert.match(fullPlayerSource, /חזור 10 שניות/);
  assert.match(fullPlayerSource, /דלג 10 שניות קדימה/);
});

test("ProgressBar preserves seek behavior through the supplied callback", () => {
  assert.match(progressBarSource, /type="range"/);
  assert.match(progressBarSource, /onInput=\$\{handleInput\}/);
  assert.match(progressBarSource, /onSeek\(Number\(event\.currentTarget\.value\)\)/);
  assert.match(fullPlayerSource, /onSeek=\$\{seek\}/);
  assert.doesNotMatch(progressBarSource, /getAudioElement|audio\.currentTime/);
});

test("ProgressBar displays current and duration time", () => {
  assert.match(progressBarSource, /formatTime\(currentTime\)/);
  assert.match(progressBarSource, /formatTime\(duration\)/);
  assert.match(componentsCss, /font-variant-numeric:\s*tabular-nums/);
});

test("FullPlayer preserves loading buffering ended and controlled error states", () => {
  assert.match(fullPlayerSource, /status === "loading"/);
  assert.match(fullPlayerSource, /status === "buffering"/);
  assert.match(fullPlayerSource, /status === "ended"/);
  assert.match(fullPlayerSource, /playerError\.value/);
  assert.match(fullPlayerSource, /role="status"/);
  assert.match(fullPlayerSource, /role="alert"/);
});

test("basic M6 player controls remain touch-friendly and responsive", () => {
  assert.match(componentsCss, /\.basic-player\s*\{/);
  assert.match(componentsCss, /\.player-button\s*\{/);
  assert.match(componentsCss, /min-height:\s*3rem/);
  assert.match(componentsCss, /\.basic-player__progress\s*\{/);
  assert.match(componentsCss, /minmax\(0,\s*1fr\)/);
});

test("later player controls preserve the M6 service boundary", () => {
  const combined = `${fullPlayerSource}\n${progressBarSource}`;

  assert.doesNotMatch(combined, /getAudioElement|audio\.currentTime|audio\.playbackRate|audio\.volume/);
  assert.doesNotMatch(combined, /playNext|playPrevious/);
});
