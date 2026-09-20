import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const trackPageSource = fs.readFileSync("src/app/pages/track-page.js", "utf8");
const fullPlayerSource = fs.readFileSync("src/app/components/full-player.js", "utf8");
const progressBarSource = fs.readFileSync("src/app/components/progress-bar.js", "utf8");
const visualizationSource = fs.readFileSync("src/app/components/player-visualization.js", "utf8");
const playerStateSource = fs.readFileSync("src/app/state/player-state.js", "utf8");
const audioServiceSource = fs.readFileSync("src/app/services/audio-service.js", "utf8");
const componentsCss = fs.readFileSync("src/styles/components.css", "utf8");
const responsiveCss = fs.readFileSync("src/styles/responsive.css", "utf8");

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

test("M7.2 exposes the exact specified playback speed choices", () => {
  assert.match(audioServiceSource, /\[0\.75, 1, 1\.25, 1\.5, 1\.75, 2\]/);
  assert.match(fullPlayerSource, /PLAYBACK_RATES\.map/);
  assert.match(fullPlayerSource, /setRate\(Number\(event\.currentTarget\.value\)\)/);
  assert.match(fullPlayerSource, /aria-label="מהירות ניגון"/);
});

test("M7.2 repeat-current is explicit accessible and backed by player state", () => {
  assert.match(playerStateSource, /repeatTrack = signal\(false\)/);
  assert.match(fullPlayerSource, /setRepeatTrack\(!repeatTrack\.value\)/);
  assert.match(fullPlayerSource, /aria-pressed=\$\{repeating\}/);
  assert.match(fullPlayerSource, /aria-label="חזור על הקטע"/);
  assert.match(componentsCss, /\.player-repeat\.is-active/);
});

test("M7.2 desktop volume and mute use Audio Service controls", () => {
  assert.match(playerStateSource, /muted = signal\(false\)/);
  assert.match(fullPlayerSource, /setVolume\(Number\(event\.currentTarget\.value\)\)/);
  assert.match(fullPlayerSource, /onClick=\$\{toggleMute\}/);
  assert.match(fullPlayerSource, /class="player-volume"/);
  assert.match(fullPlayerSource, /max="1"/);
  assert.match(fullPlayerSource, /step="0\.05"/);
  assert.match(componentsCss, /\.player-volume\s*\{[\s\S]*display:\s*none/);
  assert.match(responsiveCss, /\.player-volume\s*\{[\s\S]*display:\s*inline-flex/);
});

test("advanced FullPlayer controls still do not access the Audio element directly", () => {
  assert.doesNotMatch(fullPlayerSource, /getAudioElement|\.playbackRate\s*=|\.volume\s*=|\.muted\s*=|\.loop\s*=/);
  assert.match(fullPlayerSource, /setRate/);
  assert.match(fullPlayerSource, /setVolume/);
  assert.match(fullPlayerSource, /toggleMute/);
  assert.match(fullPlayerSource, /setRepeatTrack/);
});

test("M7.3 adds disabled Previous and Next placeholders without listening-context logic", () => {
  assert.match(fullPlayerSource, /aria-label="הקטע הקודם"/);
  assert.match(fullPlayerSource, /aria-label="הקטע הבא"/);
  assert.match(fullPlayerSource, /player-nav-placeholder/);

  const placeholderButtons = fullPlayerSource.match(/player-nav-placeholder/g) ?? [];
  assert.equal(placeholderButtons.length, 2);

  assert.doesNotMatch(fullPlayerSource, /playNext|playPrevious/);
});

test("M7.3 FullPlayer renders the lightweight PlayerVisualization", () => {
  assert.match(fullPlayerSource, /import \{ PlayerVisualization \}/);
  assert.match(fullPlayerSource, /<\$\{PlayerVisualization\}/);
  assert.match(fullPlayerSource, /currentTime=\$\{time\}/);
  assert.match(fullPlayerSource, /duration=\$\{totalDuration\}/);
  assert.match(fullPlayerSource, /status=\$\{status\}/);
});

test("PlayerVisualization derives a clamped percentage only from progress data", () => {
  assert.match(visualizationSource, /currentTime \/ duration/);
  assert.match(visualizationSource, /Math\.min\(Math\.max\(/);
  assert.match(visualizationSource, /aria-valuemin="0"/);
  assert.match(visualizationSource, /aria-valuemax="100"/);
  assert.match(visualizationSource, /aria-valuenow=\$\{roundedProgress\}/);
  assert.match(visualizationSource, /data-status=\$\{status\}/);
});

test("M7.3 visualization uses CSS progress only and no Web Audio API", () => {
  const combined = `${visualizationSource}\n${componentsCss}\n${fullPlayerSource}`;

  assert.match(componentsCss, /conic-gradient/);
  assert.match(componentsCss, /--player-progress-angle/);
  assert.doesNotMatch(combined, /AudioContext|webkitAudioContext|AnalyserNode|createAnalyser|getByteFrequencyData|waveform/i);
});
