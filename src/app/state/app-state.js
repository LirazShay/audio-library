import { signal } from "@preact/signals";
import { loadLibrary } from "../services/library-service.js";

export const appStatus = signal("loading");
export const library = signal(null);
export const libraryError = signal(null);

let initializationPromise = null;

export function initializeApp() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = loadLibrary()
    .then((loadedLibrary) => {
      library.value = loadedLibrary;
      libraryError.value = null;
      appStatus.value = "ready";
      return loadedLibrary;
    })
    .catch((error) => {
      library.value = null;
      libraryError.value = error;
      appStatus.value = "error";
      throw error;
    });

  return initializationPromise;
}
