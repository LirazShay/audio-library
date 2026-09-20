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

function requireLoadedTrack() {
  if (!currentTrack.value) {
    throw new Error("No Track is currently loaded.");
  }

  return initializeAudioService();
}

function getSeekUpperBound(audio) {
  if (Number.isFinite(duration.value) && duration.value > 0) {
    return duration.value;
  }

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    return audio.duration;
  }

  return null;
}

export async function play() {
  const audio = requireLoadedTrack();

  playerError.value = null;

  try {
    const playResult = audio.play();

    if (playResult && typeof playResult.then === "function") {
      await playResult;
    }

    return true;
  } catch (error) {
    isPlaying.value = false;
    playerStatus.value = PLAYER_STATUS.ERROR;
    playerError.value = "לא ניתן להתחיל את הניגון.";
    throw error;
  }
}

export function pause() {
  const audio = requireLoadedTrack();

  audio.pause();
  isPlaying.value = false;

  if (
    playerStatus.value !== PLAYER_STATUS.LOADING &&
    playerStatus.value !== PLAYER_STATUS.ENDED &&
    playerStatus.value !== PLAYER_STATUS.ERROR
  ) {
    playerStatus.value = PLAYER_STATUS.PAUSED;
  }

  return true;
}

export function seek(targetTime) {
  if (!Number.isFinite(targetTime)) {
    throw new Error("Seek target must be a finite number.");
  }

  const audio = requireLoadedTrack();
  const upperBound = getSeekUpperBound(audio);
  const clampedTime = upperBound === null
    ? Math.max(0, targetTime)
    : Math.min(Math.max(0, targetTime), upperBound);

  audio.currentTime = clampedTime;
  currentTime.value = clampedTime;

  return clampedTime;
}

export function skipForward(seconds = 10) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error("Skip amount must be a non-negative finite number.");
  }

  return seek(currentTime.value + seconds);
}

export function skipBackward(seconds = 10) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error("Skip amount must be a non-negative finite number.");
  }

  return seek(currentTime.value - seconds);
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
