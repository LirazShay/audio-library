import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const sourceFile = path.resolve("src/app/services/library-service.js");

async function importFreshService(label) {
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "audio-library-service-"));
  const tempFile = path.join(tempDirectory, "library-service.mjs");
  await fs.copyFile(sourceFile, tempFile);

  const module = await import(
    `${pathToFileURL(tempFile).href}?test=${encodeURIComponent(label)}-${Date.now()}`
  );

  return {
    module,
    async cleanup() {
      await fs.rm(tempDirectory, { recursive: true, force: true });
    },
  };
}

function createValidDocument() {
  return {
    schemaVersion: 1,
    generatedAt: "2026-09-20T08:00:00.000Z",
    site: {
      name: "ספריית השמע",
    },
    root: {
      type: "topic",
      id: "root",
      name: "ספריית השמע",
      path: "",
      children: [],
    },
  };
}

function responseWithJson(document) {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    async json() {
      return document;
    },
  };
}

test("valid library document is accepted", async () => {
  const { module, cleanup } = await importFreshService("valid-document");

  try {
    const document = createValidDocument();
    assert.equal(module.validateLibraryDocument(document), document);
  } finally {
    await cleanup();
  }
});

test("unsupported schemaVersion is rejected", async () => {
  const { module, cleanup } = await importFreshService("schema-version");

  try {
    const document = createValidDocument();
    document.schemaVersion = 999;

    assert.throws(
      () => module.validateLibraryDocument(document),
      /Unsupported library schemaVersion/
    );
  } finally {
    await cleanup();
  }
});

test("loadLibrary performs one fetch and reuses the same Promise", async () => {
  const originalFetch = globalThis.fetch;
  const { module, cleanup } = await importFreshService("single-fetch");
  const document = createValidDocument();
  let fetchCount = 0;

  globalThis.fetch = async () => {
    fetchCount += 1;
    return responseWithJson(document);
  };

  try {
    const firstPromise = module.loadLibrary();
    const secondPromise = module.loadLibrary();

    assert.equal(firstPromise, secondPromise);

    const loaded = await firstPromise;
    const thirdPromise = module.loadLibrary();

    assert.equal(thirdPromise, firstPromise);
    assert.equal(fetchCount, 1);
    assert.equal(loaded, document);
    assert.equal(module.getLoadedLibrary(), document);
  } finally {
    globalThis.fetch = originalFetch;
    await cleanup();
  }
});

test("missing library JSON rejects without storing a library", async () => {
  const originalFetch = globalThis.fetch;
  const { module, cleanup } = await importFreshService("missing-json");

  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
    statusText: "Not Found",
  });

  try {
    await assert.rejects(module.loadLibrary(), /HTTP 404 Not Found/);
    assert.equal(module.getLoadedLibrary(), null);
  } finally {
    globalThis.fetch = originalFetch;
    await cleanup();
  }
});

test("malformed JSON is converted to a controlled load error", async () => {
  const originalFetch = globalThis.fetch;
  const { module, cleanup } = await importFreshService("malformed-json");

  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    statusText: "OK",
    async json() {
      throw new SyntaxError("Unexpected token");
    },
  });

  try {
    await assert.rejects(module.loadLibrary(), /invalid JSON/);
    assert.equal(module.getLoadedLibrary(), null);
  } finally {
    globalThis.fetch = originalFetch;
    await cleanup();
  }
});

test("network failure is converted to a controlled load error", async () => {
  const originalFetch = globalThis.fetch;
  const { module, cleanup } = await importFreshService("network-failure");

  globalThis.fetch = async () => {
    throw new TypeError("fetch failed");
  };

  try {
    await assert.rejects(module.loadLibrary(), /network request failed/);
    assert.equal(module.getLoadedLibrary(), null);
  } finally {
    globalThis.fetch = originalFetch;
    await cleanup();
  }
});
