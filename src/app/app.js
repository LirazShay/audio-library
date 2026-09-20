import { html } from "htm/preact";
import { appStatus, library, libraryError } from "./state/app-state.js";
import { currentRoute } from "./state/router-state.js";
import { ROUTE_NAMES } from "./services/router-service.js";
import { getTopic, getTrack } from "./services/library-service.js";
import { HomePage } from "./pages/home-page.js";
import { NotFoundPage } from "./pages/not-found-page.js";
import { TopicPage } from "./pages/topic-page.js";
import { TrackPage } from "./pages/track-page.js";

function renderLibraryState() {
  if (appStatus.value === "loading") {
    return html`
      <section class="welcome-card" aria-labelledby="app-title">
        <p class="eyebrow">Audio Library</p>
        <h1 id="app-title">ספריית השמע</h1>
        <p class="welcome-status" role="status">טוען את הספרייה…</p>
      </section>
    `;
  }

  if (appStatus.value === "error") {
    return html`
      <section class="welcome-card" aria-labelledby="library-error-title">
        <p class="eyebrow">Audio Library</p>
        <h1 id="library-error-title">לא ניתן לטעון את הספרייה</h1>
        <div class="welcome-status" role="alert">
          <small>${libraryError.value?.message ?? "שגיאה לא ידועה"}</small>
        </div>
      </section>
    `;
  }

  return null;
}

function renderRoutePage() {
  const route = currentRoute.value;
  const siteName = library.value?.site?.name ?? "ספריית השמע";

  if (route.name === ROUTE_NAMES.HOME) {
    return html`<${HomePage} siteName=${siteName} />`;
  }

  if (route.name === ROUTE_NAMES.TOPIC) {
    const topic = getTopic(route.params.id);

    return topic
      ? html`<${TopicPage} topic=${topic} />`
      : html`<${NotFoundPage} />`;
  }

  if (route.name === ROUTE_NAMES.TRACK) {
    const track = getTrack(route.params.id);

    return track
      ? html`<${TrackPage} track=${track} />`
      : html`<${NotFoundPage} />`;
  }

  return html`<${NotFoundPage} />`;
}

export function App() {
  const libraryState = renderLibraryState();

  return html`
    <main class="app-shell">
      ${libraryState ?? renderRoutePage()}
    </main>
  `;
}
