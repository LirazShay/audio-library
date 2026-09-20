import { h, render } from "preact";
import { App } from "./app.js";
import { initializeApp } from "./state/app-state.js";
import { setCurrentRoute } from "./state/router-state.js";
import { startRouter } from "./services/router-service.js";
import { initializeAudioService } from "./services/audio-service.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error('Missing application root element "#app".');
}

initializeAudioService();
startRouter(setCurrentRoute);
render(h(App, null), root);

initializeApp().catch((error) => {
  console.error("Application initialization failed.", error);
});
