import { html } from "htm/preact";
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
import { ProgressBar } from "./progress-bar.js";

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

export function FullPlayer({ track }) {
  const loadedTrackId = currentTrack.value?.id ?? null;
  const isCurrentTrack = loadedTrackId === track.id;
  const status = isCurrentTrack ? playerStatus.value : "idle";
  const playing = isCurrentTrack && isPlaying.value;
  const time = isCurrentTrack ? currentTime.value : 0;
  const totalDuration = isCurrentTrack ? duration.value : 0;
  const error = isCurrentTrack ? playerError.value : null;
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

  return html`
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

      <${ProgressBar}
        currentTime=${time}
        duration=${totalDuration}
        disabled=${!isCurrentTrack}
        onSeek=${seek}
      />

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
  `;
}

export { getStatusMessage };
