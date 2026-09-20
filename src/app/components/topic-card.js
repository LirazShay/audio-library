import { html } from "htm/preact";
import { buildRoute, ROUTE_NAMES } from "../services/router-service.js";

export function TopicCard({ topic }) {
  const href = buildRoute(ROUTE_NAMES.TOPIC, { id: topic.id });

  return html`
    <a class="topic-card" href=${href}>
      <span class="topic-card__name">${topic.name}</span>
      <span class="topic-card__action" aria-hidden="true">פתיחה ←</span>
    </a>
  `;
}
