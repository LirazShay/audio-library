import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import {
  currentTime,
  currentTrack,
  duration,
  isPlaying,
  playerError,
  playerStatus,
} from "../state/player-state.js";
import {
  loadTrack,
  pause,
  play,
  seek,
  skipBackward,
  skipForward,
} from "../services/audio-service.js";

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getStatusMessage(status) {
  if (status === "loading") {
    return "טוען את קובץ השמע…";
  }

  if (status === "buffering") {
    return "ממתין לנתוני שמע…";
  }

  if (status === "ended") {
    return "הקטע הסתיים.";
  }

  return null;
}

export function TrackPage({ track }) {
  useEffect(() => {
    if (currentTrack.value?.id !== track.id) {
      loadTrack(track);
    }
  }, [track.id]);

  const loadedTrackId = currentTrack.value?.id ?? null;
  const isCurrentTrack = loadedTrackId === track.id;
  const status = isCurrentTrack ? playerStatus.value : "idle";
  const playing = isCurrentTrack && isPlaying.value;
  const time = isCurrentTrack ? currentTime.value : 0;
  const totalDuration = isCurrentTrack ? duration.value : 0;
  const error = isCurrentTrack ? playerError.value : null;
  const seekMax = totalDuration > 0 ? totalDuration : 1;
  const seekValue = Math.min(Math.max(time, 0), seekMax);
  const canSeek = isCurrentTrack && totalDuration > 0;

  function handlePlayPause() {
    if (!isCurrentTrack) {
      loadTrack(track);
    }

    if (playing) {
      pause();
      return;
    }

    void play().catch(() => {});
  }

  function handleSeek(event) {
    seek(Number(event.currentTarget.value));
  }

  return html`
    <section class="library-page track-page" aria-labelledby="track-title">
      <p><a class="page-back-link" href="#/">← חזרה לדף הבית</a></p>

      <header class="library-page__header">
        <p class="eyebrow">Track</p>
        <h1 id="track-title">${track.title}</h1>
      </header>

      <section class="basic-player" aria-label="נגן שמע">
        <div class="basic-player__controls">
          <button
            type="button"
            class="player-button player-button--secondary"
            onClick=${() => skipBackward()}
            disabled=${!canSeek}
            aria-label="חזור 10 שניות"
          >
            10-
          </button>

          <button
            type="button"
            class="player-button player-button--primary"
            onClick=${handlePlayPause}
            aria-label=${playing ? "השהה" : "נגן"}
          >
            ${playing ? "השהה" : "נגן"}
          </button>

          <button
            type="button"
            class="player-button player-button--secondary"
            onClick=${() => skipForward()}
            disabled=${!canSeek}
            aria-label="דלג 10 שניות קדימה"
          >
            +10
          </button>
        </div>

        <div class="basic-player__progress">
          <span class="basic-player__time">${formatTime(time)}</span>
          <input
            class="basic-player__range"
            type="range"
            min="0"
            max=${seekMax}
            step="0.1"
            value=${seekValue}
            disabled=${!canSeek}
            onInput=${handleSeek}
            aria-label="מיקום בקטע"
          />
          <span class="basic-player__time">${formatTime(totalDuration)}</span>
        </div>

        ${getStatusMessage(status)
          ? html`
              <p class="player-status" role="status">
                ${getStatusMessage(status)}
              </p>
            `
          : null}

        ${error
          ? html`
              <p class="player-error" role="alert">${error}</p>
            `
          : null}
      </section>
    </section>
  `;
}

export { formatTime, getStatusMessage };
