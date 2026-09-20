import { html } from "htm/preact";

export function formatTime(value) {
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

export function ProgressBar({
  currentTime,
  duration,
  disabled = false,
  onSeek,
}) {
  const seekMax = duration > 0 ? duration : 1;
  const seekValue = Math.min(Math.max(currentTime, 0), seekMax);
  const canSeek = !disabled && duration > 0;

  function handleInput(event) {
    onSeek(Number(event.currentTarget.value));
  }

  return html`
    <div class="basic-player__progress">
      <span class="basic-player__time">${formatTime(currentTime)}</span>

      <input
        class="basic-player__range"
        type="range"
        min="0"
        max=${seekMax}
        step="0.1"
        value=${seekValue}
        disabled=${!canSeek}
        onInput=${handleInput}
        aria-label="מיקום בקטע"
      />

      <span class="basic-player__time">${formatTime(duration)}</span>
    </div>
  `;
}
