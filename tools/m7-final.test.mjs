import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const fullPlayer = fs.readFileSync("src/app/components/full-player.js", "utf8");
const progressBar = fs.readFileSync("src/app/components/progress-bar.js", "utf8");
const visualization = fs.readFileSync("src/app/components/player-visualization.js", "utf8");
const audioService = fs.readFileSync("src/app/services/audio-service.js", "utf8");
const playerState = fs.readFileSync("src/app/state/player-state.js", "utf8");
const baseCss = fs.readFileSync("src/styles/base.css", "utf8");
const layoutCss = fs.readFileSync("src/styles/layout.css", "utf8");
const componentsCss = fs.readFileSync("src/styles/components.css", "utf8");
const responsiveCss = fs.readFileSync("src/styles/responsive.css", "utf8");

test("M7 core controls are all present with accessible labels", () => {
  assert.match(fullPlayer, /aria-label="הקטע הקודם"/);
  assert.match(fullPlayer, /aria-label="חזור 10 שניות"/);
  assert.match(fullPlayer, /aria-label=.*"השהה".*"נגן"/s);
  assert.match(fullPlayer, /aria-label="דלג 10 שניות קדימה"/);
  assert.match(fullPlayer, /aria-label="הקטע הבא"/);
  assert.match(fullPlayer, /aria-label="מהירות ניגון"/);
  assert.match(fullPlayer, /aria-label="חזור על הקטע"/);
  assert.match(progressBar, /aria-label="מיקום בקטע"/);
});

test("loading is busy and prevents repeated Play activation", () => {
  assert.match(fullPlayer, /const isLoading = status === "loading"/);
  assert.match(fullPlayer, /const isBusy = isLoading \|\| status === "buffering"/);
  assert.match(fullPlayer, /aria-busy=\$\{isBusy\}/);
  assert.match(fullPlayer, /disabled=\$\{isLoading\}/);
  assert.match(fullPlayer, /טוען…/);
});

test("buffering ended and error states remain visible and recoverable", () => {
  assert.match(fullPlayer, /status === "buffering"/);
  assert.match(fullPlayer, /status === "ended"/);
  assert.match(fullPlayer, /role="status"/);
  assert.match(fullPlayer, /role="alert"/);
  assert.match(fullPlayer, /נסה שוב/);
  assert.match(fullPlayer, /onClick=\$\{\(\) => loadTrack\(track\)\}/);
});

test("player control collections have semantic group labels", () => {
  assert.match(fullPlayer, /role="group"[\s\S]*aria-label="פקדי ניגון"/);
  assert.match(fullPlayer, /role="group"[\s\S]*aria-label="הגדרות נגן"/);
  assert.match(fullPlayer, /role="group"[\s\S]*aria-label="עוצמת שמע"/);
});

test("all FullPlayer buttons use semantic button elements", () => {
  const buttons = fullPlayer.match(/<button\b/g) ?? [];
  const typedButtons = fullPlayer.match(/<button[\s\S]*?type="button"/g) ?? [];

  assert.ok(buttons.length >= 7);
  assert.equal(typedButtons.length, buttons.length);
  assert.doesNotMatch(fullPlayer, /<div[^>]+onClick=/);
});

test("mobile player uses large touch targets and a full-width seek row", () => {
  assert.match(componentsCss, /\.player-button\s*\{[\s\S]*min-height:\s*3rem/);
  assert.match(componentsCss, /\.player-select\s*\{[\s\S]*min-height:\s*2\.75rem/);
  assert.match(componentsCss, /\.basic-player__range\s*\{[\s\S]*grid-column:\s*1 \/ -1/);
  assert.match(componentsCss, /\.basic-player__range\s*\{[\s\S]*min-height:\s*2\.75rem/);
  assert.match(componentsCss, /touch-action:\s*manipulation/);
});

test("desktop breakpoint restores compact progress layout and desktop volume", () => {
  assert.match(responsiveCss, /@media \(min-width:\s*48rem\)/);
  assert.match(responsiveCss, /\.basic-player__progress\s*\{[\s\S]*grid-template-columns:\s*auto minmax\(0, 1fr\) auto/);
  assert.match(responsiveCss, /\.basic-player__range\s*\{[\s\S]*grid-column:\s*2/);
  assert.match(responsiveCss, /\.player-volume\s*\{[\s\S]*display:\s*inline-flex/);
  assert.match(componentsCss, /\.player-volume\s*\{[\s\S]*display:\s*none/);
});

test("narrow viewport structure is protected from horizontal overflow", () => {
  assert.match(layoutCss, /width:\s*min\(100% - 2rem, var\(--page-max-width\)\)/);
  assert.match(componentsCss, /\.basic-player\s*\{[\s\S]*min-width:\s*0/);
  assert.match(componentsCss, /\.basic-player\s*\{[\s\S]*padding:\s*var\(--space-4\)/);
  assert.match(componentsCss, /\.basic-player__controls\s*\{[\s\S]*flex-wrap:\s*wrap/);
});

test("long Track titles and keyboard focus are protected", () => {
  assert.match(componentsCss, /\.library-page__header h1\s*\{[\s\S]*overflow-wrap:\s*anywhere/);
  assert.match(baseCss, /:focus-visible\s*\{[\s\S]*outline:/);
  assert.match(baseCss, /outline-offset:/);
});

test("reduced-motion preference has a global safeguard", () => {
  assert.match(baseCss, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(baseCss, /animation-duration:\s*0\.01ms !important/);
  assert.match(baseCss, /transition-duration:\s*0\.01ms !important/);
});

test("seek drag updates through the service boundary", () => {
  assert.match(progressBar, /onInput=\$\{handleInput\}/);
  assert.match(progressBar, /onSeek\(Number\(event\.currentTarget\.value\)\)/);
  assert.match(fullPlayer, /onSeek=\$\{seek\}/);
  assert.match(audioService, /export function seek\(targetTime\)/);
});

test("speed repeat mute and volume are backed by central state and Audio Service", () => {
  assert.match(playerState, /playbackRate = signal\(1\)/);
  assert.match(playerState, /volume = signal\(1\)/);
  assert.match(playerState, /muted = signal\(false\)/);
  assert.match(playerState, /repeatTrack = signal\(false\)/);
  assert.match(audioService, /export function setRate/);
  assert.match(audioService, /export function setVolume/);
  assert.match(audioService, /export function toggleMute/);
  assert.match(audioService, /export function setRepeatTrack/);
});

test("Previous and Next remain honest disabled placeholders", () => {
  const previousIndex = fullPlayer.indexOf('aria-label="הקטע הקודם"');
  const nextIndex = fullPlayer.indexOf('aria-label="הקטע הבא"');

  assert.ok(previousIndex > 0);
  assert.ok(nextIndex > previousIndex);

  const previousBlock = fullPlayer.slice(Math.max(0, previousIndex - 220), previousIndex + 180);
  const nextBlock = fullPlayer.slice(Math.max(0, nextIndex - 220), nextIndex + 180);

  assert.match(previousBlock, /disabled/);
  assert.match(nextBlock, /disabled/);
  assert.doesNotMatch(fullPlayer, /playNext|playPrevious/);
});

test("visualization is accessible progress-only UI with no Web Audio API", () => {
  const combined = `${visualization}\n${fullPlayer}\n${audioService}`;

  assert.match(visualization, /role="progressbar"/);
  assert.match(visualization, /aria-valuenow=\$\{roundedProgress\}/);
  assert.match(visualization, /Math\.min\(Math\.max\(/);
  assert.match(componentsCss, /conic-gradient/);
  assert.doesNotMatch(
    combined,
    /AudioContext|webkitAudioContext|AnalyserNode|createAnalyser|getByteFrequencyData/
  );
});

test("FullPlayer never manipulates the Audio element directly", () => {
  assert.doesNotMatch(
    fullPlayer,
    /getAudioElement|new Audio|\.currentTime\s*=|\.playbackRate\s*=|\.volume\s*=|\.muted\s*=|\.loop\s*=/
  );
});
