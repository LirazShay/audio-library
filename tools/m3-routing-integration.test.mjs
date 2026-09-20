import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const routerUrl = pathToFileURL(
  path.resolve("src/app/services/router-service.js")
).href;

const router = await import(`${routerUrl}?m3-integration=${Date.now()}`);
const library = JSON.parse(fs.readFileSync("src/data/library.json", "utf8"));

function collectEntities(root) {
  const topics = new Map();
  const tracks = new Map();

  function visit(node) {
    if (node.type === "topic") {
      topics.set(node.id, node);
      for (const child of node.children) {
        visit(child);
      }
      return;
    }

    if (node.type === "track") {
      tracks.set(node.id, node);
    }
  }

  visit(root);
  return { topics, tracks };
}

function firstContentTopic(root) {
  return root.children.find((child) => child.type === "topic") ?? null;
}

function firstTrack(root) {
  let found = null;

  function visit(node) {
    if (found) {
      return;
    }

    if (node.type === "track") {
      found = node;
      return;
    }

    for (const child of node.children ?? []) {
      visit(child);
    }
  }

  visit(root);
  return found;
}

function createFakeWindow(initialHash) {
  const listeners = new Map();

  return {
    location: { hash: initialHash },
    addEventListener(type, handler) {
      const handlers = listeners.get(type) ?? new Set();
      handlers.add(handler);
      listeners.set(type, handlers);
    },
    removeEventListener(type, handler) {
      listeners.get(type)?.delete(handler);
    },
    dispatch(type) {
      for (const handler of listeners.get(type) ?? []) {
        handler();
      }
    },
  };
}

test("real library direct Topic URL resolves to an existing Topic", () => {
  const { topics } = collectEntities(library.root);
  const topic = firstContentTopic(library.root);

  assert.ok(topic);

  const hash = router.buildRoute("topic", { id: topic.id });
  const route = router.parseRoute(hash);

  assert.equal(route.name, "topic");
  assert.equal(route.params.id, topic.id);
  assert.equal(topics.get(route.params.id), topic);
});

test("real library direct Track URL resolves to an existing Track", () => {
  const { tracks } = collectEntities(library.root);
  const track = firstTrack(library.root);

  assert.ok(track);

  const hash = router.buildRoute("track", { id: track.id });
  const route = router.parseRoute(hash);

  assert.equal(route.name, "track");
  assert.equal(route.params.id, track.id);
  assert.equal(tracks.get(route.params.id), track);
});

test("unknown Topic and Track IDs parse but do not resolve in the library", () => {
  const { topics, tracks } = collectEntities(library.root);

  const topicRoute = router.parseRoute("#/topic/topic_missing");
  const trackRoute = router.parseRoute("#/track/track_missing");

  assert.equal(topicRoute.name, "topic");
  assert.equal(trackRoute.name, "track");
  assert.equal(topics.has(topicRoute.params.id), false);
  assert.equal(tracks.has(trackRoute.params.id), false);
});

test("refreshing a direct hash URL restores the same route", () => {
  const topic = firstContentTopic(library.root);
  assert.ok(topic);

  const hash = router.buildRoute("topic", { id: topic.id });
  const firstWindow = createFakeWindow(hash);
  const secondWindow = createFakeWindow(hash);

  let firstRoute = null;
  let refreshedRoute = null;

  router.startRouter((route) => {
    firstRoute = route;
  }, firstWindow);

  router.startRouter((route) => {
    refreshedRoute = route;
  }, secondWindow);

  assert.deepEqual(refreshedRoute, firstRoute);
  assert.deepEqual(refreshedRoute, {
    name: "topic",
    params: { id: topic.id },
  });
});
