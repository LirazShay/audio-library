const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT || 8080);
const ROOT = path.resolve(__dirname, "..", "src");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".oga": "audio/ogg",
  ".opus": "audio/ogg",
  ".webm": "audio/webm",
  ".wav": "audio/wav",
  ".flac": "audio/flac",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function safePathFromRequest(url) {
  const parsed = new URL(url, `http://${HOST}:${PORT}`);
  let pathname = decodeURIComponent(parsed.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const requestedPath = path.resolve(ROOT, `.${pathname}`);

  if (requestedPath !== ROOT && !requestedPath.startsWith(`${ROOT}${path.sep}`)) {
    return null;
  }

  return requestedPath;
}

async function sendFile(response, filePath) {
  const stat = await fs.stat(filePath);
  const finalPath = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
  const content = await fs.readFile(finalPath);
  const extension = path.extname(finalPath).toLowerCase();

  response.writeHead(200, {
    "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    "Cache-Control": "no-store",
  });
  response.end(content);
}

const server = http.createServer(async (request, response) => {
  try {
    const filePath = safePathFromRequest(request.url || "/");

    if (!filePath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    await sendFile(response, filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      try {
        await sendFile(response, path.join(ROOT, "404.html"));
      } catch {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
      }
      return;
    }

    console.error(error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal server error");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Local preview server is already running on http://${HOST}:${PORT}/`);
    process.exit(0);
  }

  console.error(error);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Audio Library local preview: http://${HOST}:${PORT}/`);
  console.log("Press Ctrl+C to stop the server.");
});
