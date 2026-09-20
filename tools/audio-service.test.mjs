import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sourceFile = path.resolve("src/app/services/audio-service.js");

class FakeAudio {
  constructor() {
    this.listeners = new Map();
    this.preload = "";
    this.playbackRate = 1;
    this.volume = 1;
    this.duration = Number.NaN;
    this.currentTime = 0;
    this.src = "";
    this.pauseCount = 0;
    this.loadCount = 0;
    this.playCount = 0;
  }

  addEventListener(type, handler) {
    const handlers = this.listeners.get(type) ?? [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  pause() {
    this.pauseCount += 1;
    this.emit("pause");
  }

  load() {
    this.loadCount += 1;
  }

  play() {
    this.playCount += 1;
    this.emit("play");
    return Promise.resolve();
  }

  emit(type) {
    for (const handler of this.listeners.get(type) ?? []) {
      handler();
    }
  }
}

async function importFreshAudioService(label) {
  const tempDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "audio-library-audio-service-")
  );
  const serviceFile = path.join(tempDirectory, "audio-service.mjs");
  const stateFile = path.join(tempDirectory, "player-state-stub.mjs");

  let source = await fs.readFile(sourceFile, "utf8");
  source = source.replace(
    '"../state/player-state.js"',
    '"./player-state-stub.mjs"'
  );

  const stateSource = `
export const PLAYER_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  PLAYING: "playing",
  PAUSED: "paused",
  BUFFERING: "buffering",
  ENDED: "ended",
  ERROR: "error",
});
export const currentTrack = { value: null };
export const currentContext = { value: null };
export const isPlaying = { value: false };
export const playerStatus = { value: PLAYER_STATUS.IDLE };
export const currentTime = { value: 0 };
export const duration = { value: 0 };
export const playbackRate = { value: 1 };
export const volume = { value: 1 };
export const playerError = { value: null };
`;

  await fs.writeFile(serviceFile, source);
  await fs.writeFile(stateFile, stateSource);

  const service = await import(
    `${pathToFileURL(serviceFile).href}?test=${encodeURIComponent(label)}-${Date.now()}`
  );
  const state = await import(pathToFileURL(stateFile).href);

  return {
    service,
    state,
    async cleanup() {
      await fs.rm(tempDirectory, { recursive: true, force: true });
    },
  };
}

function createTrack(id = "track_1", audio = "content/נושא/קטע.wav") {
  return {
    type: "track",
    id,
    title: `קטע ${id}`,
    audio,
    format: "wav",
    text: null,
  };
}

test("initializeAudioService creates one shared Audio instance", async () => {
  const { service, cleanup } = await importFreshAudioService("singleton");
  const firstAudio = new FakeAudio();
  const secondAudio = new FakeAudio();

  try {
    assert.equal(service.initializeAudioService(firstAudio), firstAudio);
    assert.equal(service.initializeAudioService(secondAudio), firstAudio);
    assert.equal(service.getAudioElement(), firstAudio);
    assert.equal(firstAudio.preload, "metadata");
    assert.equal(firstAudio.playbackRate, 1);
    assert.equal(firstAudio.volume, 1);
    assert.equal(secondAudio.listeners.size, 0);
  } finally {
    await cleanup();
  }
});

test("loadTrack loads a Track into the shared Audio without autoplay", async () => {
  const { service, state, cleanup } = await importFreshAudioService("load-track");
  const audio = new FakeAudio();
  const track = createTrack();
  const context = {
    topicId: "topic_1",
    trackIds: ["track_1"],
  };

  try {
    service.initializeAudioService(audio);
    const source = service.loadTrack(track, context);

    assert.equal(service.getAudioElement(), audio);
    assert.equal(state.currentTrack.value, track);
    assert.equal(state.currentContext.value, context);
    assert.equal(state.playerStatus.value, "loading");
    assert.equal(state.currentTime.value, 0);
    assert.equal(state.duration.value, 0);
    assert.equal(state.isPlaying.value, false);
    assert.equal(state.playerError.value, null);
    assert.equal(audio.src, source);
    assert.match(source, /content\/.*\.wav$/);
    assert.equal(audio.pauseCount, 1);
    assert.equal(audio.loadCount, 1);
    assert.equal(audio.playCount, 0);
  } finally {
    await cleanup();
  }
});

test("Audio media events update the central player state", async () => {
  const { service, state, cleanup } = await importFreshAudioService("events");
  const audio = new FakeAudio();

  try {
    service.initializeAudioService(audio);
    service.loadTrack(createTrack());

    audio.duration = 125.5;
    audio.currentTime = 3;
    audio.emit("loadedmetadata");

    assert.equal(state.duration.value, 125.5);
    assert.equal(state.currentTime.value, 3);
    assert.equal(state.playerStatus.value, "ready");

    audio.currentTime = 12.25;
    audio.emit("timeupdate");
    assert.equal(state.currentTime.value, 12.25);

    audio.emit("play");
    assert.equal(state.isPlaying.value, true);
    assert.equal(state.playerStatus.value, "playing");

    audio.emit("waiting");
    assert.equal(state.playerStatus.value, "buffering");

    audio.emit("playing");
    assert.equal(state.isPlaying.value, true);
    assert.equal(state.playerStatus.value, "playing");

    audio.emit("pause");
    assert.equal(state.isPlaying.value, false);
    assert.equal(state.playerStatus.value, "paused");

    audio.currentTime = 125.5;
    audio.emit("ended");
    assert.equal(state.isPlaying.value, false);
    assert.equal(state.currentTime.value, 125.5);
    assert.equal(state.playerStatus.value, "ended");

    audio.emit("error");
    assert.equal(state.isPlaying.value, false);
    assert.equal(state.playerStatus.value, "error");
    assert.equal(state.playerError.value, "לא ניתן לטעון את קובץ השמע.");
  } finally {
    await cleanup();
  }
});

test("switching Tracks reuses the same Audio instance and replaces its source", async () => {
  const { service, state, cleanup } = await importFreshAudioService("switch-track");
  const audio = new FakeAudio();
  const firstTrack = createTrack("track_1", "content/א/ראשון.wav");
  const secondTrack = createTrack("track_2", "content/ב/שני.wav");

  try {
    service.initializeAudioService(audio);

    const firstSource = service.loadTrack(firstTrack);
    audio.emit("play");
    const secondSource = service.loadTrack(secondTrack);

    assert.notEqual(firstSource, secondSource);
    assert.equal(service.getAudioElement(), audio);
    assert.equal(state.currentTrack.value, secondTrack);
    assert.equal(state.playerStatus.value, "loading");
    assert.equal(state.isPlaying.value, false);
    assert.equal(audio.src, secondSource);
    assert.equal(audio.loadCount, 2);
    assert.equal(audio.playCount, 0);
  } finally {
    await cleanup();
  }
});

test("loadTrack rejects invalid Track input and missing audio paths", async () => {
  const { service, cleanup } = await importFreshAudioService("invalid-track");
  const audio = new FakeAudio();

  try {
    service.initializeAudioService(audio);

    assert.throws(() => service.loadTrack(null), /valid Track/);
    assert.throws(
      () => service.loadTrack({ id: "", audio: "content/a.wav" }),
      /Track id/
    );
    assert.throws(
      () => service.loadTrack({ id: "track_1", audio: "" }),
      /audio path/
    );
  } finally {
    await cleanup();
  }
});
