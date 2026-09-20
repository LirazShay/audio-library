import { html } from "htm/preact";
import { appStatus, library, libraryError } from "./state/app-state.js";
import { currentRoute } from "./state/router-state.js";
import { ROUTE_NAMES } from "./services/router-service.js";
import { HomePage } from "./pages/home-page.js";
import { NotFoundPage } from "./pages/not-found-page.js";

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

  if (route.name === ROUTE_NAMES.NOT_FOUND) {
    return html`<${NotFoundPage} />`;
  }

  if (route.name === ROUTE_NAMES.TOPIC || route.name === ROUTE_NAMES.TRACK) {
    return html`
      <section class="welcome-card" aria-labelledby="route-placeholder-title">
        <p class="eyebrow">Audio Library</p>
        <h1 id="route-placeholder-title">${siteName}</h1>
        <p class="welcome-status">
          הנתיב נטען בהצלחה. תצוגת התוכן תחובר בשלב הבא.
        </p>
      </section>
    `;
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
