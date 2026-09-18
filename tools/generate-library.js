const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIRECTORY = path.join(REPOSITORY_ROOT, "src", "content");
const OUTPUT_FILE = path.join(REPOSITORY_ROOT, "src", "data", "library.json");

const SCHEMA_VERSION = 1;
const DEFAULT_SITE_NAME = "ספריית השמע";

const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".m4a",
  ".aac",
  ".ogg",
  ".oga",
  ".opus",
  ".webm",
  ".wav",
  ".flac",
]);

const TEXT_EXTENSION = ".txt";
const IGNORED_FILE_NAMES = new Set([
  ".DS_Store",
  "Thumbs.db",
  "desktop.ini",
  ".gitkeep",
]);

const naturalCollator = new Intl.Collator("he", {
  numeric: true,
  sensitivity: "base",
});

function toPortablePath(value) {
  return value.split(path.sep).join("/");
}

function normalizePathForId(value) {
  return toPortablePath(value).normalize("NFC");
}

function normalizeBasename(fileName) {
  return path.basename(fileName, path.extname(fileName)).normalize("NFC");
}

function createDeterministicId(type, relativePath) {
  const normalizedPath = normalizePathForId(relativePath);
  const hash = crypto
    .createHash("sha256")
    .update(`${type}:${normalizedPath}`, "utf8")
    .digest("hex")
    .slice(0, 12);

  return `${type}_${hash}`;
}

function sortEntriesNaturally(entries) {
  return [...entries].sort((left, right) => naturalCollator.compare(left.name, right.name));
}

function classifyFile(fileName) {
  if (IGNORED_FILE_NAMES.has(fileName)) {
    return "ignored";
  }

  const extension = path.extname(fileName).toLowerCase();

  if (AUDIO_EXTENSIONS.has(extension)) {
    return "audio";
  }

  if (extension === TEXT_EXTENSION) {
    return "text";
  }

  return "ignored";
}

async function scanDirectory(directory, relativeDirectory = "") {
  const entries = sortEntriesNaturally(await fs.readdir(directory, { withFileTypes: true }));
  const items = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = toPortablePath(path.join(relativeDirectory, entry.name));

    if (entry.isDirectory()) {
      const children = await scanDirectory(absolutePath, relativePath);
      items.push({
        type: "directory",
        name: entry.name,
        relativePath,
        children,
      });
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    items.push({
      type: classifyFile(entry.name),
      name: entry.name,
      relativePath,
      absolutePath,
      extension: path.extname(entry.name).toLowerCase(),
    });
  }

  return items;
}

function collectStats(items) {
  const stats = {
    directories: 0,
    audioFiles: 0,
    textFiles: 0,
    ignoredFiles: 0,
  };

  function visit(currentItems) {
    for (const item of currentItems) {
      if (item.type === "directory") {
        stats.directories += 1;
        visit(item.children);
      } else if (item.type === "audio") {
        stats.audioFiles += 1;
      } else if (item.type === "text") {
        stats.textFiles += 1;
      } else if (item.type === "ignored") {
        stats.ignoredFiles += 1;
      }
    }
  }

  visit(items);
  return stats;
}

function createDiagnostics() {
  return {
    warnings: [],
    errors: [],
  };
}

function addWarning(diagnostics, code, relativePath, message) {
  diagnostics.warnings.push({ code, relativePath, message });
}

function addError(diagnostics, code, relativePath, message) {
  diagnostics.errors.push({ code, relativePath, message });
}

function groupFilesByBasename(items) {
  const groups = new Map();

  for (const item of items) {
    if (item.type !== "audio" && item.type !== "text") {
      continue;
    }

    const basename = normalizeBasename(item.name);
    const group = groups.get(basename) ?? { basename, audio: [], text: [] };
    group[item.type].push(item);
    groups.set(basename, group);
  }

  return groups;
}

function toRuntimeContentPath(relativePath) {
  return toPortablePath(path.posix.join("content", toPortablePath(relativePath)));
}

function normalizeTextLineEndings(text) {
  return text.replace(/\r\n?/g, "\n");
}

async function readMatchedText(textItem, diagnostics) {
  if (!textItem) {
    return null;
  }

  try {
    const text = await fs.readFile(textItem.absolutePath, "utf8");
    return normalizeTextLineEndings(text);
  } catch (error) {
    addWarning(
      diagnostics,
      "TEXT_READ_FAILED",
      textItem.relativePath,
      `Unable to read text file: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

async function buildTrack(audioItem, textItem, diagnostics) {
  const title = normalizeBasename(audioItem.name);
  const text = await readMatchedText(textItem, diagnostics);

  if (!textItem) {
    addWarning(
      diagnostics,
      "AUDIO_WITHOUT_TEXT",
      audioItem.relativePath,
      "Audio file has no matching TXT file."
    );
  }

  return {
    type: "track",
    id: createDeterministicId("track", audioItem.relativePath),
    title,
    audio: toRuntimeContentPath(audioItem.relativePath),
    format: audioItem.extension.slice(1),
    text,
  };
}

async function buildTopic(name, relativePath, items, diagnostics) {
  const children = [];
  const directories = items.filter((item) => item.type === "directory");
  const groups = groupFilesByBasename(items);

  for (const directory of directories) {
    children.push(
      await buildTopic(directory.name, directory.relativePath, directory.children, diagnostics)
    );
  }

  for (const group of groups.values()) {
    if (group.audio.length > 1) {
      const paths = group.audio.map((item) => item.relativePath).join(", ");
      addError(
        diagnostics,
        "DUPLICATE_AUDIO_BASENAME",
        relativePath,
        `Multiple audio files share basename "${group.basename}": ${paths}`
      );
      continue;
    }

    if (group.audio.length === 0) {
      for (const textItem of group.text) {
        addWarning(
          diagnostics,
          "TEXT_WITHOUT_AUDIO",
          textItem.relativePath,
          "TXT file has no matching audio file."
        );
      }
      continue;
    }

    if (group.text.length > 1) {
      const paths = group.text.map((item) => item.relativePath).join(", ");
      addError(
        diagnostics,
        "DUPLICATE_TEXT_BASENAME",
        relativePath,
        `Multiple TXT files share basename "${group.basename}": ${paths}`
      );
      continue;
    }

    const audioItem = group.audio[0];
    const matchingText = group.text.length === 1 ? group.text[0] : null;
    children.push(await buildTrack(audioItem, matchingText, diagnostics));
  }

  return {
    type: "topic",
    id: relativePath === "" ? "root" : createDeterministicId("topic", relativePath),
    name,
    path: toPortablePath(relativePath),
    children,
  };
}

async function buildLibraryModel(items) {
  const diagnostics = createDiagnostics();
  const root = await buildTopic(DEFAULT_SITE_NAME, "", items, diagnostics);

  return {
    root,
    diagnostics,
  };
}

function createLibraryDocument(root, generatedAt = new Date().toISOString()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    generatedAt,
    site: {
      name: DEFAULT_SITE_NAME,
    },
    root,
  };
}

function serializeLibraryDocument(document) {
  return `${JSON.stringify(document, null, 2)}\n`;
}

async function writeLibraryFile(serialized, outputFile = OUTPUT_FILE) {
  const outputDirectory = path.dirname(outputFile);
  const temporaryFile = path.join(
    outputDirectory,
    `.${path.basename(outputFile)}.${process.pid}.${crypto.randomUUID()}.tmp`
  );

  await fs.mkdir(outputDirectory, { recursive: true });

  try {
    await fs.writeFile(temporaryFile, serialized, "utf8");

    const writtenContent = await fs.readFile(temporaryFile, "utf8");
    const parsed = JSON.parse(writtenContent);

    if (parsed.schemaVersion !== SCHEMA_VERSION || !parsed.root) {
      throw new Error("Generated library document failed validation.");
    }

    await fs.rename(temporaryFile, outputFile);
  } finally {
    await fs.rm(temporaryFile, { force: true });
  }
}

function collectModelStats(root) {
  const stats = {
    topics: 0,
    tracks: 0,
    textsMatched: 0,
    tracksWithoutText: 0,
  };

  function visit(node, isRoot = false) {
    if (node.type === "topic") {
      if (!isRoot) {
        stats.topics += 1;
      }

      for (const child of node.children) {
        visit(child, false);
      }
      return;
    }

    if (node.type === "track") {
      stats.tracks += 1;
      if (node.text === null) {
        stats.tracksWithoutText += 1;
      } else {
        stats.textsMatched += 1;
      }
    }
  }

  visit(root, true);
  return stats;
}

async function scanContent() {
  return scanDirectory(CONTENT_DIRECTORY);
}

function printDiagnostics(diagnostics) {
  for (const warning of diagnostics.warnings) {
    console.warn(`WARNING [${warning.code}]: ${warning.relativePath || "content"}`);
    console.warn(`  ${warning.message}`);
  }

  for (const error of diagnostics.errors) {
    console.error(`ERROR [${error.code}]: ${error.relativePath || "content"}`);
    console.error(`  ${error.message}`);
  }
}

async function main() {
  try {
    const items = await scanContent();
    const scanStats = collectStats(items);
    const { root, diagnostics } = await buildLibraryModel(items);
    const document = createLibraryDocument(root);
    const serialized = serializeLibraryDocument(document);
    const modelStats = collectModelStats(root);

    JSON.parse(serialized);
    await writeLibraryFile(serialized);

    console.log("Audio Library Generator — generation complete");
    console.log(`Content: ${toPortablePath(path.relative(REPOSITORY_ROOT, CONTENT_DIRECTORY))}`);
    console.log(`Future output: ${toPortablePath(path.relative(REPOSITORY_ROOT, OUTPUT_FILE))}`);
    console.log(`Schema version: ${document.schemaVersion}`);
    console.log(`Generated at: ${document.generatedAt}`);
    console.log(`Site: ${document.site.name}`);
    console.log("");
    console.log(`Directories scanned: ${scanStats.directories}`);
    console.log(`Audio files scanned: ${scanStats.audioFiles}`);
    console.log(`Text files scanned: ${scanStats.textFiles}`);
    console.log(`Ignored files: ${scanStats.ignoredFiles}`);
    console.log("");
    console.log(`Topics: ${modelStats.topics}`);
    console.log(`Tracks: ${modelStats.tracks}`);
    console.log(`Texts matched: ${modelStats.textsMatched}`);
    console.log(`Tracks without text: ${modelStats.tracksWithoutText}`);
    console.log(`Warnings: ${diagnostics.warnings.length}`);
    console.log(`Errors: ${diagnostics.errors.length}`);
    console.log("");
    console.log(
      `Output: ${toPortablePath(path.relative(REPOSITORY_ROOT, OUTPUT_FILE))}`
    );

    if (diagnostics.warnings.length > 0 || diagnostics.errors.length > 0) {
      console.log("");
      printDiagnostics(diagnostics);
    }

    if (diagnostics.errors.length > 0) {
      console.log("");
      console.log("Generation completed with content errors.");
      process.exitCode = 1;
    } else {
      console.log("");
      console.log("Library generation complete.");
    }
  } catch (error) {
    console.error("ERROR: unable to generate library.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  AUDIO_EXTENSIONS,
  CONTENT_DIRECTORY,
  DEFAULT_SITE_NAME,
  OUTPUT_FILE,
  SCHEMA_VERSION,
  addError,
  addWarning,
  buildLibraryModel,
  buildTopic,
  classifyFile,
  collectModelStats,
  collectStats,
  createDeterministicId,
  createDiagnostics,
  createLibraryDocument,
  groupFilesByBasename,
  normalizeBasename,
  normalizePathForId,
  normalizeTextLineEndings,
  scanContent,
  scanDirectory,
  serializeLibraryDocument,
  sortEntriesNaturally,
  toPortablePath,
  toRuntimeContentPath,
  writeLibraryFile,
};
