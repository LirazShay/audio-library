import { html } from "htm/preact";

export function TopicPage({ topic }) {
  return html`
    <section class="welcome-card" aria-labelledby="topic-route-title">
      <p class="eyebrow">Topic</p>
      <h1 id="topic-route-title">${topic.name}</h1>
      <p class="welcome-status">
        הנושא נמצא בספרייה. תצוגת תוכן הנושא תיבנה בשלב M4.
      </p>
      <p><a href="#/">חזרה לדף הבית</a></p>
    </section>
  `;
}
