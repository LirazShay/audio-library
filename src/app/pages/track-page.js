import { html } from "htm/preact";

export function TrackPage({ track }) {
  return html`
    <section class="welcome-card" aria-labelledby="track-route-title">
      <p class="eyebrow">Track</p>
      <h1 id="track-route-title">${track.title}</h1>
      <p class="welcome-status">
        הקטע נמצא בספרייה. תצוגת הקטע והנגן ייבנו בשלבים הבאים.
      </p>
      <p><a href="#/">חזרה לדף הבית</a></p>
    </section>
  `;
}
