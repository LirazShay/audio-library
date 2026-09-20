const SUPPORTED_SCHEMA_VERSION = 1;
const LIBRARY_URL = new URL("../../data/library.json", import.meta.url);

let libraryPromise = null;
let loadedLibrary = null;
let rootTopic = null;
let topicsById = new Map();
let tracksById = new Map();
let parentTopicIdById = new Map();
let allTopics = [];
let allTracks = [];

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

function addUniqueItem(map, item, kind) {
  if (typeof item.id !== "string" || item.id.trim() === "") {
    throw new Error(`Library ${kind} is missing a valid id.`);
  }

  if (map.has(item.id)) {
    throw new Error(`Duplicate library id: ${item.id}.`);
  }

  map.set(item.id, item);
}

export function buildLibraryIndexes(root) {
  const nextTopicsById = new Map();
  const nextTracksById = new Map();
  const nextParentTopicIdById = new Map();
  const nextAllTopics = [];
  const nextAllTracks = [];

  function visit(node, isRoot = false, parentTopicId = null) {
    assertObject(node, "Library node must be an object.");

    if (node.type === "topic") {
      addUniqueItem(nextTopicsById, node, "topic");

      if (!Array.isArray(node.children)) {
        throw new Error(`Library topic ${node.id} must have a children array.`);
      }

      if (!isRoot) {
        nextAllTopics.push(node);

        if (parentTopicId) {
          nextParentTopicIdById.set(node.id, parentTopicId);
        }
      }

      for (const child of node.children) {
        visit(child, false, node.id);
      }

      return;
    }

    if (node.type === "track") {
      addUniqueItem(nextTracksById, node, "track");
      nextAllTracks.push(node);
      return;
    }

    throw new Error(`Unsupported library node type: ${String(node.type)}.`);
  }

  visit(root, true);

  return {
    topicsById: nextTopicsById,
    tracksById: nextTracksById,
    parentTopicIdById: nextParentTopicIdById,
    allTopics: nextAllTopics,
    allTracks: nextAllTracks,
  };
}

function storeLibrary(document) {
  const indexes = buildLibraryIndexes(document.root);

  loadedLibrary = document;
  rootTopic = document.root;
  topicsById = indexes.topicsById;
  tracksById = indexes.tracksById;
  parentTopicIdById = indexes.parentTopicIdById;
  allTopics = indexes.allTopics;
  allTracks = indexes.allTracks;

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
  return storeLibrary(validatedDocument);
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

export function getRoot() {
  return rootTopic;
}

export function getTopic(id) {
  return topicsById.get(id) ?? null;
}

export function getTrack(id) {
  return tracksById.get(id) ?? null;
}

export function getAllTopics() {
  return allTopics;
}

export function getTopicTrail(id) {
  const topic = getTopic(id);

  if (!topic || topic.id === "root") {
    return [];
  }

  const trail = [];
  const visited = new Set();
  let current = topic;

  while (current && current.id !== "root") {
    if (visited.has(current.id)) {
      throw new Error(`Circular Topic parent relationship detected at ${current.id}.`);
    }

    visited.add(current.id);
    trail.push(current);

    const parentId = parentTopicIdById.get(current.id);
    current = parentId ? getTopic(parentId) : null;
  }

  return trail.reverse();
}

export function getAllTracks() {
  return allTracks;
}

export { LIBRARY_URL, SUPPORTED_SCHEMA_VERSION };
