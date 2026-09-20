import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const trackPageSource = fs.readFileSync("src/app/pages/track-page.js", "utf8");
const fullPlayerSource = fs.readFileSync("src/app/components/full-player.js", "utf8");
const progressBarSource = fs.readFileSync("src/app/components/progress-bar.js", "utf8");

test("TrackPage delegates player UI to FullPlayer", () => {
  assert.match(trackPageSource, /import \{ FullPlayer \}/);
  assert.match(trackPageSource, /<\$\{FullPlayer\} track=\$\{track\}/);
  assert.doesNotMatch(trackPageSource, /skipBackward|skipForward|playerStatus|playerError|currentTime|duration/);
});

test("FullPlayer owns the proven M6 player controls", () => {
  assert.match(fullPlayerSource, /currentTrack\.value/);
  assert.match(fullPlayerSource, /isPlaying\.value/);
  assert.match(fullPlayerSource, /playerStatus\.value/);
  assert.match(fullPlayerSource, /playerError\.value/);
  assert.match(fullPlayerSource, /skipBackward\(\)/);
  assert.match(fullPlayerSource, /skipForward\(\)/);
  assert.match(fullPlayerSource, /\bplay\(\)/);
  assert.match(fullPlayerSource, /\bpause\(\)/);
});

test("FullPlayer delegates progress rendering and seeking to ProgressBar", () => {
  assert.match(fullPlayerSource, /import \{ ProgressBar \}/);
  assert.match(fullPlayerSource, /<\$\{ProgressBar\}/);
  assert.match(fullPlayerSource, /currentTime=\$\{time\}/);
  assert.match(fullPlayerSource, /duration=\$\{totalDuration\}/);
  assert.match(fullPlayerSource, /onSeek=\$\{seek\}/);
});

test("ProgressBar is presentation-only and does not access Player State or Audio Service", () => {
  assert.doesNotMatch(progressBarSource, /player-state|audio-service/);
  assert.doesNotMatch(progressBarSource, /currentTrack\.value|playerStatus\.value|Audio\(/);
  assert.match(progressBarSource, /export function ProgressBar/);
});

test("ProgressBar keeps seek clamping for its DOM value and time formatting", () => {
  assert.match(progressBarSource, /Math\.min\(Math\.max\(currentTime, 0\), seekMax\)/);
  assert.match(progressBarSource, /formatTime\(currentTime\)/);
  assert.match(progressBarSource, /formatTime\(duration\)/);
  assert.match(progressBarSource, /step="0\.1"/);
});

test("M7.1 is a behavior-preserving extraction only", () => {
  const combined = `${trackPageSource}\n${fullPlayerSource}\n${progressBarSource}`;

  assert.doesNotMatch(combined, /playbackRate|setRate|setVolume|repeatTrack|visualization|waveform/i);
  assert.doesNotMatch(combined, /playNext|playPrevious|Previous|Next|הקודם|הבא/);
});
