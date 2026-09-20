import { html } from "htm/preact";
import {
  getAllTopics,
  getAllTracks,
  getRoot,
} from "../services/library-service.js";
import { TopicCard } from "../components/topic-card.js";
import { TrackRow } from "../components/track-row.js";

export function HomePage({ siteName }) {
  const topicCount = getAllTopics().length;
  const trackCount = getAllTracks().length;
  const rootChildren = getRoot()?.children ?? [];
  const rootTopics = rootChildren.filter(
    (child) => child.type === "topic"
  );
  const rootTracks = rootChildren.filter(
    (child) => child.type === "track"
  );

  return html`
    <section class="library-page" aria-labelledby="app-title">
      <header class="library-page__header">
        <p class="eyebrow">Audio Library</p>
        <h1 id="app-title">${siteName}</h1>
        <p class="welcome-status" role="status">
          הספרייה נטענה בהצלחה · ${topicCount} נושאים · ${trackCount} קטעים
        </p>
      </header>

      <section class="topic-section" aria-labelledby="root-topics-title">
        <h2 id="root-topics-title">נושאים</h2>

        ${rootTopics.length > 0
          ? html`
              <div class="topic-grid">
                ${rootTopics.map(
                  (topic) => html`
                    <${TopicCard} key=${topic.id} topic=${topic} />
                  `
                )}
              </div>
            `
          : html`
              <p class="empty-state">אין עדיין נושאים בספרייה.</p>
            `}
      </section>

      ${rootTracks.length > 0
        ? html`
            <section class="track-section" aria-labelledby="root-tracks-title">
              <h2 id="root-tracks-title">קטעי שמע</h2>
              <div class="track-list">
                ${rootTracks.map(
                  (track) => html`
                    <${TrackRow}
                      key=${track.id}
                      track=${track}
                    />
                  `
                )}
              </div>
            </section>
          `
        : null}
    </section>
  `;
}
