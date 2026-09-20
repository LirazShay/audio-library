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

function parseByteRange(rangeHeader, size) {
  if (typeof rangeHeader !== "string" || !rangeHeader.startsWith("bytes=")) {
    return null;
  }

  const requested = rangeHeader.slice("bytes=".length).trim();

  if (requested.includes(",")) {
    return { invalid: true };
  }

  const match = /^(\d*)-(\d*)$/.exec(requested);

  if (!match || (match[1] === "" && match[2] === "")) {
    return { invalid: true };
  }

  let start;
  let end;

  if (match[1] === "") {
    const suffixLength = Number(match[2]);

    if (!Number.isInteger(suffixLength) || suffixLength <= 0) {
      return { invalid: true };
    }

    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === "" ? size - 1 : Number(match[2]);

    if (
      !Number.isInteger(start) ||
      !Number.isInteger(end) ||
      start < 0 ||
      end < start ||
      start >= size
    ) {
      return { invalid: true };
    }

    end = Math.min(end, size - 1);
  }

  return { start, end };
}

async function sendFile(response, filePath, rangeHeader = null) {
  const stat = await fs.stat(filePath);
  const finalPath = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
  const content = await fs.readFile(finalPath);
  const extension = path.extname(finalPath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const commonHeaders = {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
    "Accept-Ranges": "bytes",
  };

  if (rangeHeader) {
    const range = parseByteRange(rangeHeader, content.length);

    if (!range || range.invalid) {
      response.writeHead(416, {
        ...commonHeaders,
        "Content-Range": `bytes */${content.length}`,
        "Content-Length": "0",
      });
      response.end();
      return;
    }

    const partial = content.subarray(range.start, range.end + 1);

    response.writeHead(206, {
      ...commonHeaders,
      "Content-Range": `bytes ${range.start}-${range.end}/${content.length}`,
      "Content-Length": String(partial.length),
    });
    response.end(partial);
    return;
  }

  response.writeHead(200, {
    ...commonHeaders,
    "Content-Length": String(content.length),
  });
  response.end(content);
}

function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const filePath = safePathFromRequest(request.url || "/");

      if (!filePath) {
        response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Forbidden");
        return;
      }

      await sendFile(response, filePath, request.headers.range || null);
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
}

function startServer() {
  const server = createServer();

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

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  HOST,
  PORT,
  ROOT,
  createServer,
  parseByteRange,
  safePathFromRequest,
  sendFile,
  startServer,
};
