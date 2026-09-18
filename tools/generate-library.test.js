const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const {
  buildLibraryModel,
  createDeterministicId,
  createLibraryDocument,
  scanDirectory,
  serializeLibraryDocument,
  sortEntriesNaturally,
  writeLibraryFile,
} = require("./generate-library.js");

async function withTempDirectory(run) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "audio-library-generator-"));

  try {
    return await run(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

async function writeFile(root, relativePath, content = "") {
  const fullPath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content);
}

function findFirstTrack(topic) {
  for (const child of topic.children) {
    if (child.type === "track") {
      return child;
    }

    if (child.type === "topic") {
      const nested = findFirstTrack(child);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

test("recursive scan supports nested Hebrew content and uppercase extensions", async () => {
  await withTempDirectory(async (root) => {
    await writeFile(root, "נושא/תת נושא/קטע.MP3", "audio");
    await writeFile(root, "נושא/תת נושא/קטע.txt", "טקסט");

    const items = await scanDirectory(root);
    const topic = items.find((item) => item.type === "directory" && item.name === "נושא");

    assert.ok(topic);
    const nested = topic.children.find(
      (item) => item.type === "directory" && item.name === "תת נושא"
    );
    assert.ok(nested);

    const audio = nested.children.find((item) => item.type === "audio");
    assert.equal(audio.name, "קטע.MP3");
    assert.equal(audio.extension, ".mp3");
  });
});

test("natural sort orders numeric names numerically", () => {
  const sorted = sortEntriesNaturally([
    { name: "10 - קטע" },
    { name: "2 - קטע" },
    { name: "1 - קטע" },
  ]);

  assert.deepEqual(
    sorted.map((entry) => entry.name),
    ["1 - קטע", "2 - קטע", "10 - קטע"]
  );
});

test("deterministic IDs are stable and path-sensitive", () => {
  const first = createDeterministicId("track", "נושא/קטע.mp3");
  const second = createDeterministicId("track", "נושא/קטע.mp3");
  const moved = createDeterministicId("track", "נושא אחר/קטע.mp3");

  assert.equal(first, second);
  assert.notEqual(first, moved);
  assert.match(first, /^track_[0-9a-f]{12}$/);
});

test("matching TXT is embedded and line endings are normalized", async () => {
  await withTempDirectory(async (root) => {
    await writeFile(root, "נושא/קטע.mp3", "audio");
    await writeFile(root, "נושא/קטע.txt", "שורה 1\r\nשורה 2\rשורה 3");

    const items = await scanDirectory(root);
    const { root: libraryRoot, diagnostics } = await buildLibraryModel(items);
    const track = findFirstTrack(libraryRoot);

    assert.ok(track);
    assert.equal(track.text, "שורה 1\nשורה 2\nשורה 3");
    assert.equal(track.audio, "content/נושא/קטע.mp3");
    assert.equal(diagnostics.warnings.length, 0);
    assert.equal(diagnostics.errors.length, 0);
  });
});

test("orphan TXT creates a warning and no Track", async () => {
  await withTempDirectory(async (root) => {
    await writeFile(root, "נושא/ללא שמע.txt", "טקסט");

    const items = await scanDirectory(root);
    const { root: libraryRoot, diagnostics } = await buildLibraryModel(items);

    assert.equal(findFirstTrack(libraryRoot), null);
    assert.equal(diagnostics.errors.length, 0);
    assert.equal(diagnostics.warnings.length, 1);
    assert.equal(diagnostics.warnings[0].code, "TEXT_WITHOUT_AUDIO");
  });
});

test("duplicate audio basename creates a local error and skips ambiguous Tracks", async () => {
  await withTempDirectory(async (root) => {
    await writeFile(root, "נושא/קטע.mp3", "audio");
    await writeFile(root, "נושא/קטע.m4a", "audio");

    const items = await scanDirectory(root);
    const { root: libraryRoot, diagnostics } = await buildLibraryModel(items);

    assert.equal(findFirstTrack(libraryRoot), null);
    assert.equal(diagnostics.errors.length, 1);
    assert.equal(diagnostics.errors[0].code, "DUPLICATE_AUDIO_BASENAME");
  });
});

test("atomic writer replaces valid output and preserves old output on validation failure", async () => {
  await withTempDirectory(async (root) => {
    const outputFile = path.join(root, "data", "library.json");
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, "previous-valid-content\n", "utf8");

    const validDocument = createLibraryDocument(
      {
        type: "topic",
        id: "root",
        name: "ספריית השמע",
        path: "",
        children: [],
      },
      "2026-09-18T12:00:00.000Z"
    );

    await writeLibraryFile(serializeLibraryDocument(validDocument), outputFile);

    const written = await fs.readFile(outputFile, "utf8");
    assert.deepEqual(JSON.parse(written), validDocument);

    await assert.rejects(
      writeLibraryFile('{"schemaVersion":1}', outputFile),
      /failed validation/
    );

    const afterFailure = await fs.readFile(outputFile, "utf8");
    assert.equal(afterFailure, written);

    const leftovers = (await fs.readdir(path.dirname(outputFile))).filter((name) =>
      name.endsWith(".tmp")
    );
    assert.deepEqual(leftovers, []);
  });
});
