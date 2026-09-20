const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createServer,
  parseByteRange,
} = require("./dev-server.js");

test("parseByteRange supports normal open-ended and suffix ranges", () => {
  assert.deepEqual(parseByteRange("bytes=0-99", 1000), {
    start: 0,
    end: 99,
  });

  assert.deepEqual(parseByteRange("bytes=900-", 1000), {
    start: 900,
    end: 999,
  });

  assert.deepEqual(parseByteRange("bytes=-100", 1000), {
    start: 900,
    end: 999,
  });
});

test("parseByteRange rejects unsupported or invalid ranges", () => {
  assert.deepEqual(parseByteRange("bytes=1000-1001", 1000), {
    invalid: true,
  });

  assert.deepEqual(parseByteRange("bytes=20-10", 1000), {
    invalid: true,
  });

  assert.deepEqual(parseByteRange("bytes=0-10,20-30", 1000), {
    invalid: true,
  });

  assert.equal(parseByteRange(null, 1000), null);
});

test("local server serves WAV byte ranges as 206 Partial Content", async () => {
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const url =
    `http://127.0.0.1:${address.port}/content/` +
    encodeURIComponent("00 - פתיח לבדיקה מקומית.wav");

  try {
    const response = await fetch(url, {
      headers: {
        Range: "bytes=0-99",
      },
    });

    assert.equal(response.status, 206);
    assert.equal(response.headers.get("accept-ranges"), "bytes");
    assert.equal(response.headers.get("content-length"), "100");
    assert.match(
      response.headers.get("content-range") ?? "",
      /^bytes 0-99\/\d+$/
    );
    assert.equal((await response.arrayBuffer()).byteLength, 100);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("local server includes Content-Length on a complete WAV response", async () => {
  const server = createServer();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  const url =
    `http://127.0.0.1:${address.port}/content/` +
    encodeURIComponent("00 - פתיח לבדיקה מקומית.wav");

  try {
    const response = await fetch(url);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("accept-ranges"), "bytes");
    assert.equal(response.headers.get("cache-control"), "no-store");

    const declaredLength = Number(response.headers.get("content-length"));
    const actualLength = (await response.arrayBuffer()).byteLength;

    assert.ok(declaredLength > 1000);
    assert.equal(actualLength, declaredLength);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
