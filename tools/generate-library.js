const fs = require("node:fs/promises");
const path = require("node:path");

const REPOSITORY_ROOT = path.resolve(__dirname, "..");
const CONTENT_DIRECTORY = path.join(REPOSITORY_ROOT, "src", "content");
const OUTPUT_FILE = path.join(REPOSITORY_ROOT, "src", "data", "library.json");

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

async function scanContent() {
  return scanDirectory(CONTENT_DIRECTORY);
}

async function main() {
  try {
    const items = await scanContent();
    const stats = collectStats(items);

    console.log("Audio Library Generator — scanner");
    console.log(`Content: ${toPortablePath(path.relative(REPOSITORY_ROOT, CONTENT_DIRECTORY))}`);
    console.log(`Future output: ${toPortablePath(path.relative(REPOSITORY_ROOT, OUTPUT_FILE))}`);
    console.log("");
    console.log(`Directories: ${stats.directories}`);
    console.log(`Audio files: ${stats.audioFiles}`);
    console.log(`Text files: ${stats.textFiles}`);
    console.log(`Ignored files: ${stats.ignoredFiles}`);
  } catch (error) {
    console.error("ERROR: unable to scan content directory.");
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
  OUTPUT_FILE,
  classifyFile,
  collectStats,
  scanDirectory,
  scanContent,
  sortEntriesNaturally,
  toPortablePath,
};
