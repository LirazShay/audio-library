import { html } from "htm/preact";
import { getAllTopics, getAllTracks } from "../services/library-service.js";

export function HomePage({ siteName }) {
  const topicCount = getAllTopics().length;
  const trackCount = getAllTracks().length;

  return html`
    <section class="welcome-card" aria-labelledby="app-title">
      <p class="eyebrow">Audio Library</p>
      <h1 id="app-title">${siteName}</h1>
      <p class="welcome-status" role="status">
        הספרייה נטענה בהצלחה · ${topicCount} נושאים · ${trackCount} קטעים
      </p>
    </section>
  `;
}
