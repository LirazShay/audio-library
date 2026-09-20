import { html } from "htm/preact";
import { TopicCard } from "../components/topic-card.js";
import { TrackRow } from "../components/track-row.js";
import { Breadcrumb } from "../components/breadcrumb.js";
import { getTopicTrail } from "../services/library-service.js";

export function TopicPage({ topic }) {
  const childTopics = topic.children.filter(
    (child) => child.type === "topic"
  );
  const tracks = topic.children.filter(
    (child) => child.type === "track"
  );
  const isEmptyTopic = topic.children.length === 0;
  const breadcrumbTopics = getTopicTrail(topic.id);

  return html`
    <section class="library-page" aria-labelledby="topic-title">
      <${Breadcrumb} topics=${breadcrumbTopics} />

      <header class="library-page__header">
        <p class="eyebrow">Topic</p>
        <h1 id="topic-title">${topic.name}</h1>
      </header>

      ${childTopics.length > 0
        ? html`
            <section class="topic-section" aria-labelledby="child-topics-title">
              <h2 id="child-topics-title">תתי־נושאים</h2>
              <div class="topic-grid">
                ${childTopics.map(
                  (childTopic) => html`
                    <${TopicCard}
                      key=${childTopic.id}
                      topic=${childTopic}
                    />
                  `
                )}
              </div>
            </section>
          `
        : null}

      ${tracks.length > 0
        ? html`
            <section class="track-section" aria-labelledby="tracks-title">
              <h2 id="tracks-title">קטעי שמע</h2>
              <div class="track-list">
                ${tracks.map(
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

      ${isEmptyTopic
        ? html`<p class="empty-state">אין עדיין תוכן בנושא זה.</p>`
        : null}
    </section>
  `;
}
