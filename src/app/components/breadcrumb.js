import { html } from "htm/preact";
import { buildRoute, ROUTE_NAMES } from "../services/router-service.js";

export function Breadcrumb({ topics }) {
  return html`
    <nav class="breadcrumb" aria-label="מיקום בספרייה">
      <ol class="breadcrumb__list">
        <li class="breadcrumb__item">
          <a href="#/">דף הבית</a>
        </li>

        ${topics.map((topic, index) => {
          const isCurrent = index === topics.length - 1;

          return html`
            <li class="breadcrumb__item" key=${topic.id}>
              <span class="breadcrumb__separator" aria-hidden="true">/</span>
              ${isCurrent
                ? html`<span aria-current="page">${topic.name}</span>`
                : html`
                    <a href=${buildRoute(ROUTE_NAMES.TOPIC, { id: topic.id })}>
                      ${topic.name}
                    </a>
                  `}
            </li>
          `;
        })}
      </ol>
    </nav>
  `;
}
