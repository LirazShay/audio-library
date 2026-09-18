import { render } from "preact";
import { App } from "./app.js";
import { initializeApp } from "./state/app-state.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error('Missing application root element "#app".');
}

render(App(), root);

initializeApp().catch((error) => {
  console.error("Application initialization failed.", error);
});
