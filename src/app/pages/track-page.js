import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import { currentTrack } from "../state/player-state.js";
import { loadTrack } from "../services/audio-service.js";
import { FullPlayer } from "../components/full-player.js";

export function TrackPage({ track }) {
  useEffect(() => {
    if (currentTrack.value?.id !== track.id) {
      loadTrack(track);
    }
  }, [track.id]);

  return html`
    <section class="library-page track-page" aria-labelledby="track-title">
      <p><a class="page-back-link" href="#/">← חזרה לדף הבית</a></p>

      <header class="library-page__header">
        <p class="eyebrow">Track</p>
        <h1 id="track-title">${track.title}</h1>
      </header>

      <${FullPlayer} track=${track} />
    </section>
  `;
}
