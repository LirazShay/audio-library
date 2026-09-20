import { html } from "htm/preact";
import { buildRoute, ROUTE_NAMES } from "../services/router-service.js";

function formatDuration(duration) {
  if (!Number.isFinite(duration) || duration < 0) {
    return null;
  }

  const totalSeconds = Math.floor(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function TrackRow({ track }) {
  const href = buildRoute(ROUTE_NAMES.TRACK, { id: track.id });
  const duration = formatDuration(track.duration);

  return html`
    <a class="track-row" href=${href}>
      <span class="track-row__main">
        <span class="track-row__title">${track.title}</span>
        ${duration
          ? html`<span class="track-row__meta">${duration}</span>`
          : null}
      </span>
      <span class="track-row__action" aria-hidden="true">פתיחה ←</span>
    </a>
  `;
}
