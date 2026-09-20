import { html } from "htm/preact";

export function NotFoundPage() {
  return html`
    <section class="welcome-card" aria-labelledby="not-found-title">
      <p class="eyebrow">Audio Library</p>
      <h1 id="not-found-title">העמוד לא נמצא</h1>
      <p class="welcome-status">
        הכתובת שביקשת אינה קיימת בספרייה.
      </p>
      <p>
        <a href="#/">חזרה לדף הבית</a>
      </p>
    </section>
  `;
}
