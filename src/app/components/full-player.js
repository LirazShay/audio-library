import { html } from "htm/preact";
import {
  currentTime,
  currentTrack,
  duration,
  isPlaying,
  muted,
  playbackRate,
  playerError,
  playerStatus,
  repeatTrack,
  volume,
} from "../state/player-state.js";
import {
  PLAYBACK_RATES,
  loadTrack,
  pause,
  play,
  seek,
  setRate,
  setRepeatTrack,
  setVolume,
  skipBackward,
  skipForward,
  toggleMute,
} from "../services/audio-service.js";
import { ProgressBar } from "./progress-bar.js";
import { PlayerVisualization } from "./player-visualization.js";

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
  const rate = playbackRate.value;
  const currentVolume = volume.value;
  const isMuted = muted.value;
  const repeating = isCurrentTrack && repeatTrack.value;

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

  function handleRepeatToggle() {
    if (!isCurrentTrack) {
      loadTrack(track);
    }

    setRepeatTrack(!repeatTrack.value);
  }

  function handleRateChange(event) {
    setRate(Number(event.currentTarget.value));
  }

  function handleVolumeChange(event) {
    setVolume(Number(event.currentTarget.value));
  }

  return html`
    <section class="basic-player" aria-label="נגן שמע">
      <${PlayerVisualization}
        currentTime=${time}
        duration=${totalDuration}
        status=${status}
      />

      <div class="basic-player__controls">
        <button
          type="button"
          class="player-button player-button--secondary player-nav-placeholder"
          disabled
          aria-label="הקטע הקודם"
          title="יהיה זמין לאחר חיבור הקשר ההאזנה"
        >
          הקודם
        </button>

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

        <button
          type="button"
          class="player-button player-button--secondary player-nav-placeholder"
          disabled
          aria-label="הקטע הבא"
          title="יהיה זמין לאחר חיבור הקשר ההאזנה"
        >
          הבא
        </button>
      </div>

      <${ProgressBar}
        currentTime=${time}
        duration=${totalDuration}
        disabled=${!isCurrentTrack}
        onSeek=${seek}
      />

      <div class="player-advanced-controls">
        <label class="player-setting">
          <span>מהירות</span>
          <select
            class="player-select"
            value=${rate}
            onChange=${handleRateChange}
            aria-label="מהירות ניגון"
          >
            ${PLAYBACK_RATES.map(
              (option) => html`
                <option key=${option} value=${option}>${option}×</option>
              `
            )}
          </select>
        </label>

        <button
          type="button"
          class=${`player-button player-button--secondary player-repeat${repeating ? " is-active" : ""}`}
          onClick=${handleRepeatToggle}
          aria-pressed=${repeating}
          aria-label="חזור על הקטע"
        >
          חזור על הקטע
        </button>

        <div class="player-volume" aria-label="עוצמת שמע">
          <button
            type="button"
            class="player-button player-button--secondary player-mute"
            onClick=${toggleMute}
            aria-pressed=${isMuted}
            aria-label=${isMuted ? "בטל השתקה" : "השתק"}
          >
            ${isMuted ? "בטל השתקה" : "השתק"}
          </button>

          <input
            class="player-volume__range"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value=${currentVolume}
            onInput=${handleVolumeChange}
            aria-label="עוצמת שמע"
          />
        </div>
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
  `;
}

export { getStatusMessage };
