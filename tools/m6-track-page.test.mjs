import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const trackPageSource = fs.readFileSync("src/app/pages/track-page.js", "utf8");
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

test("TrackPage exposes Play Pause and ten-second skip controls", () => {
  assert.match(trackPageSource, /handlePlayPause/);
  assert.match(trackPageSource, /\bplay\(\)\.catch/);
  assert.match(trackPageSource, /\bpause\(\)/);
  assert.match(trackPageSource, /skipBackward\(\)/);
  assert.match(trackPageSource, /skipForward\(\)/);
  assert.match(trackPageSource, /חזור 10 שניות/);
  assert.match(trackPageSource, /דלג 10 שניות קדימה/);
});

test("TrackPage exposes a seek range wired only through Audio Service", () => {
  assert.match(trackPageSource, /type="range"/);
  assert.match(trackPageSource, /onInput=\$\{handleSeek\}/);
  assert.match(trackPageSource, /seek\(Number\(event\.currentTarget\.value\)\)/);
  assert.doesNotMatch(trackPageSource, /getAudioElement|audio\.currentTime/);
});

test("TrackPage displays current and duration time", () => {
  assert.match(trackPageSource, /formatTime\(time\)/);
  assert.match(trackPageSource, /formatTime\(totalDuration\)/);
  assert.match(trackPageSource, /font-variant-numeric:\s*tabular-nums/);
});

test("TrackPage renders loading buffering ended and controlled error states", () => {
  assert.match(trackPageSource, /status === "loading"/);
  assert.match(trackPageSource, /status === "buffering"/);
  assert.match(trackPageSource, /status === "ended"/);
  assert.match(trackPageSource, /playerError\.value/);
  assert.match(trackPageSource, /role="status"/);
  assert.match(trackPageSource, /role="alert"/);
});

test("basic M6 player controls are touch-friendly and responsive by construction", () => {
  assert.match(componentsCss, /\.basic-player\s*\{/);
  assert.match(componentsCss, /\.player-button\s*\{/);
  assert.match(componentsCss, /min-height:\s*3rem/);
  assert.match(componentsCss, /\.basic-player__progress\s*\{/);
  assert.match(componentsCss, /minmax\(0,\s*1fr\)/);
});

test("M6.3 does not add M7-only advanced controls", () => {
  assert.doesNotMatch(trackPageSource, /playbackRate|setRate|volume|repeat|visualization|waveform/i);
  assert.doesNotMatch(trackPageSource, /Previous|Next|הקודם|הבא/);
});
