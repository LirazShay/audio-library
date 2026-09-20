const SUPPORTED_SCHEMA_VERSION = 1;
const LIBRARY_URL = new URL("../../data/library.json", import.meta.url);

let libraryPromise = null;
let loadedLibrary = null;

function assertObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
}

export function validateLibraryDocument(document) {
  assertObject(document, "Library document must be an object.");

  if (document.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported library schemaVersion: ${String(document.schemaVersion)}.`
    );
  }

  assertObject(document.site, "Library site metadata is missing.");

  if (typeof document.site.name !== "string" || document.site.name.trim() === "") {
    throw new Error("Library site.name must be a non-empty string.");
  }

  assertObject(document.root, "Library root is missing.");

  if (document.root.type !== "topic" || document.root.id !== "root") {
    throw new Error('Library root must be the topic with id "root".');
  }

  if (!Array.isArray(document.root.children)) {
    throw new Error("Library root.children must be an array.");
  }

  return document;
}

async function fetchLibrary() {
  let response;

  try {
    response = await fetch(LIBRARY_URL, {
      cache: "no-cache",
    });
  } catch (error) {
    throw new Error("Unable to load library.json: network request failed.", {
      cause: error,
    });
  }

  if (!response.ok) {
    throw new Error(
      `Unable to load library.json: HTTP ${response.status} ${response.statusText}`
    );
  }

  let document;

  try {
    document = await response.json();
  } catch (error) {
    throw new Error("Unable to load library.json: invalid JSON.", {
      cause: error,
    });
  }

  const validatedDocument = validateLibraryDocument(document);
  loadedLibrary = validatedDocument;
  return validatedDocument;
}

export function loadLibrary() {
  if (!libraryPromise) {
    libraryPromise = fetchLibrary();
  }

  return libraryPromise;
}

export function getLoadedLibrary() {
  return loadedLibrary;
}

export { LIBRARY_URL, SUPPORTED_SCHEMA_VERSION };
