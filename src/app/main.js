import { h, render } from "preact";
import { App } from "./app.js";
import { initializeApp } from "./state/app-state.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error('Missing application root element "#app".');
}

render(h(App, null), root);

initializeApp().catch((error) => {
  console.error("Application initialization failed.", error);
});
