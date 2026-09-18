import { html } from "htm/preact";
import { appStatus, library, libraryError } from "./state/app-state.js";

function renderStatus() {
  if (appStatus.value === "loading") {
    return html`<p class="welcome-status" role="status">טוען את הספרייה…</p>`;
  }

  if (appStatus.value === "error") {
    return html`
      <div class="welcome-status" role="alert">
        <p>לא ניתן לטעון את הספרייה.</p>
        <small>${libraryError.value?.message ?? "שגיאה לא ידועה"}</small>
      </div>
    `;
  }

  const loadedLibrary = library.value;
  const rootItems = loadedLibrary?.root?.children?.length ?? 0;

  return html`
    <p class="welcome-status" role="status">
      הספרייה נטענה בהצלחה · ${rootItems} פריטים ברמה הראשית
    </p>
  `;
}

export function App() {
  const siteName = library.value?.site?.name ?? "ספריית השמע";

  return html`
    <main class="app-shell">
      <section class="welcome-card" aria-labelledby="app-title">
        <p class="eyebrow">Audio Library</p>
        <h1 id="app-title">${siteName}</h1>
        ${renderStatus()}
      </section>
    </main>
  `;
}
