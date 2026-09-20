import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

const moduleUrl = pathToFileURL(
  path.resolve("src/app/services/router-service.js")
).href;

const router = await import(`${moduleUrl}?test=${Date.now()}`);

test("parseRoute maps empty/hash root values to home", () => {
  for (const hash of ["", "#", "#/"]) {
    assert.deepEqual(router.parseRoute(hash), {
      name: "home",
      params: {},
    });
  }
});

test("parseRoute maps Topic route and decodes the id", () => {
  assert.deepEqual(router.parseRoute("#/topic/topic_123"), {
    name: "topic",
    params: { id: "topic_123" },
  });

  assert.deepEqual(router.parseRoute("#/topic/%D7%A0%D7%95%D7%A9%D7%90%201"), {
    name: "topic",
    params: { id: "נושא 1" },
  });
});

test("parseRoute maps Track route and decodes the id", () => {
  assert.deepEqual(router.parseRoute("#/track/track_456"), {
    name: "track",
    params: { id: "track_456" },
  });
});

test("parseRoute returns not-found for unknown or malformed routes", () => {
  const invalidHashes = [
    "#/something/unknown",
    "#/topic",
    "#/track/",
    "#/topic/a/extra",
    "/topic/topic_1",
    "#/topic/%E0%A4%A",
  ];

  for (const hash of invalidHashes) {
    assert.deepEqual(router.parseRoute(hash), {
      name: "not-found",
      params: {},
    });
  }
});

test("buildRoute builds Home, Topic and Track hashes", () => {
  assert.equal(router.buildRoute("home"), "#/");
  assert.equal(router.buildRoute("topic", { id: "topic_123" }), "#/topic/topic_123");
  assert.equal(router.buildRoute("track", { id: "קטע 1" }), "#/track/%D7%A7%D7%98%D7%A2%201");
});

test("buildRoute rejects missing IDs and unsupported route names", () => {
  assert.throws(
    () => router.buildRoute("topic"),
    /requires a non-empty id/
  );

  assert.throws(
    () => router.buildRoute("track", { id: "   " }),
    /requires a non-empty id/
  );

  assert.throws(
    () => router.buildRoute("unknown"),
    /Unsupported route name/
  );
});

test("buildRoute and parseRoute round-trip encoded IDs", () => {
  const hash = router.buildRoute("topic", { id: "נושא מיוחד 10" });

  assert.deepEqual(router.parseRoute(hash), {
    name: "topic",
    params: { id: "נושא מיוחד 10" },
  });
});
