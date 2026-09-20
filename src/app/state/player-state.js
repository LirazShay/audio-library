import { signal } from "@preact/signals";

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

export const currentTrack = signal(null);
export const currentContext = signal(null);
export const isPlaying = signal(false);
export const playerStatus = signal(PLAYER_STATUS.IDLE);
export const currentTime = signal(0);
export const duration = signal(0);
export const playbackRate = signal(1);
export const volume = signal(1);
export const muted = signal(false);
export const repeatTrack = signal(false);
export const playerError = signal(null);
