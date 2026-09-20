import { html } from "htm/preact";
import { TopicCard } from "../components/topic-card.js";

export function TopicPage({ topic }) {
  const childTopics = topic.children.filter(
    (child) => child.type === "topic"
  );
  const isEmptyTopic = topic.children.length === 0;

  return html`
    <section class="library-page" aria-labelledby="topic-title">
      <header class="library-page__header">
        <p><a class="page-back-link" href="#/">← חזרה לדף הבית</a></p>
        <p class="eyebrow">Topic</p>
        <h1 id="topic-title">${topic.name}</h1>
      </header>

      <section class="topic-section" aria-labelledby="child-topics-title">
        <h2 id="child-topics-title">תתי־נושאים</h2>

        ${childTopics.length > 0
          ? html`
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
            `
          : isEmptyTopic
            ? html`
                <p class="empty-state">אין עדיין תוכן בנושא זה.</p>
              `
            : html`
                <p class="empty-state">אין תתי־נושאים בנושא זה.</p>
              `}
      </section>
    </section>
  `;
}
