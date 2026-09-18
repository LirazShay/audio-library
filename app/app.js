import { html } from "htm/preact";
import { signal } from "@preact/signals";

const bootStatus = signal("שלד הפרויקט מוכן");

export function App() {
  return html`
    <main class="app-shell">
      <section class="welcome-card" aria-labelledby="app-title">
        <p class="eyebrow">Audio Library</p>
        <h1 id="app-title">ספריית השמע</h1>
        <p class="welcome-status">${bootStatus.value}</p>
      </section>
    </main>
  `;
}
