import {
  PLAYER_STATUS,
  currentContext,
  currentTime,
  currentTrack,
  duration,
  isPlaying,
  playbackRate,
  playerError,
  playerStatus,
  volume,
} from "../state/player-state.js";

let audioElement = null;
let listenersAttached = false;

function resolveAudioUrl(audioPath) {
  if (typeof audioPath !== "string" || audioPath.trim() === "") {
    throw new Error("Track audio path must be a non-empty string.");
  }

  return new URL(`../../${audioPath}`, import.meta.url).href;
}

function setDurationFromAudio(audio) {
  duration.value = Number.isFinite(audio.duration) && audio.duration >= 0
    ? audio.duration
    : 0;
}

function attachAudioListeners(audio) {
  if (listenersAttached) {
    return;
  }

  audio.addEventListener("loadedmetadata", () => {
    setDurationFromAudio(audio);
    currentTime.value = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    playerStatus.value = PLAYER_STATUS.READY;
    playerError.value = null;
  });

  audio.addEventListener("durationchange", () => {
    setDurationFromAudio(audio);
  });

  audio.addEventListener("timeupdate", () => {
    currentTime.value = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
  });

  audio.addEventListener("play", () => {
    isPlaying.value = true;
    playerStatus.value = PLAYER_STATUS.PLAYING;
    playerError.value = null;
  });

  audio.addEventListener("pause", () => {
    isPlaying.value = false;

    if (
      playerStatus.value !== PLAYER_STATUS.LOADING &&
      playerStatus.value !== PLAYER_STATUS.ENDED &&
      playerStatus.value !== PLAYER_STATUS.ERROR
    ) {
      playerStatus.value = PLAYER_STATUS.PAUSED;
    }
  });

  audio.addEventListener("waiting", () => {
    playerStatus.value = PLAYER_STATUS.BUFFERING;
  });

  audio.addEventListener("playing", () => {
    isPlaying.value = true;
    playerStatus.value = PLAYER_STATUS.PLAYING;
    playerError.value = null;
  });

  audio.addEventListener("ended", () => {
    isPlaying.value = false;
    currentTime.value = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    playerStatus.value = PLAYER_STATUS.ENDED;
  });

  audio.addEventListener("error", () => {
    isPlaying.value = false;
    playerStatus.value = PLAYER_STATUS.ERROR;
    playerError.value = "לא ניתן לטעון את קובץ השמע.";
  });

  listenersAttached = true;
}

export function initializeAudioService(candidateAudio = null) {
  if (audioElement) {
    return audioElement;
  }

  if (candidateAudio) {
    audioElement = candidateAudio;
  } else {
    if (typeof Audio !== "function") {
      throw new Error("Audio API is not available in this environment.");
    }

    audioElement = new Audio();
  }

  audioElement.preload = "metadata";
  audioElement.playbackRate = playbackRate.value;
  audioElement.volume = volume.value;

  attachAudioListeners(audioElement);

  return audioElement;
}

export function getAudioElement() {
  return audioElement;
}

export function loadTrack(track, context = null) {
  if (!track || typeof track !== "object") {
    throw new Error("A valid Track is required.");
  }

  if (typeof track.id !== "string" || track.id.trim() === "") {
    throw new Error("Track id must be a non-empty string.");
  }

  const audio = initializeAudioService();
  const source = resolveAudioUrl(track.audio);

  if (typeof audio.pause === "function") {
    audio.pause();
  }

  currentTrack.value = track;
  currentContext.value = context;
  currentTime.value = 0;
  duration.value = 0;
  isPlaying.value = false;
  playerError.value = null;
  playerStatus.value = PLAYER_STATUS.LOADING;

  audio.src = source;

  if (typeof audio.load === "function") {
    audio.load();
  }

  return source;
}

export { resolveAudioUrl };
