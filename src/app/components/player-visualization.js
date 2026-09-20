import { html } from "htm/preact";

export function getProgressPercent(currentTime, duration) {
  if (
    !Number.isFinite(currentTime) ||
    !Number.isFinite(duration) ||
    duration <= 0
  ) {
    return 0;
  }

  return Math.min(Math.max((currentTime / duration) * 100, 0), 100);
}

export function PlayerVisualization({
  currentTime,
  duration,
  status = "idle",
}) {
  const progress = getProgressPercent(currentTime, duration);
  const roundedProgress = Math.round(progress);
  const progressAngle = progress * 3.6;

  return html`
    <div
      class="player-visualization"
      role="progressbar"
      aria-label="התקדמות הקטע"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${roundedProgress}
      data-status=${status}
    >
      <div
        class="player-visualization__ring"
        style=${`--player-progress-angle: ${progressAngle}deg;`}
        aria-hidden="true"
      >
        <span class="player-visualization__value">${roundedProgress}%</span>
      </div>
    </div>
  `;
}
