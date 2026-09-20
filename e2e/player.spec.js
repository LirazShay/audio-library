const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const library = JSON.parse(
  fs.readFileSync(path.resolve("src/data/library.json"), "utf8")
);

function findTrackByTitle(title) {
  const stack = [library.root];

  while (stack.length > 0) {
    const node = stack.pop();

    for (const child of node.children ?? []) {
      if (child.type === "track" && child.title === title) {
        return child;
      }

      if (child.type === "topic") {
        stack.push(child);
      }
    }
  }

  throw new Error("Track not found: " + title);
}

function parseDisplayedTime(value) {
  const parts = String(value ?? "")
    .trim()
    .split(":")
    .map(Number);

  if (parts.some((part) => !Number.isFinite(part))) {
    return 0;
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

const longTrack = findTrackByTitle("02 - בדיקת Seek ומהירות");

async function openLongTrack(page) {
  await page.goto("/#/track/" + encodeURIComponent(longTrack.id));

  await expect(
    page.getByRole("heading", { name: longTrack.title })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "נגן" })
  ).toBeEnabled();
}

test("Home navigation reaches a real Track page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "ספריית השמע" })
  ).toBeVisible();

  await page.getByText("בדיקות נגן ארוכות", { exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "בדיקות נגן ארוכות" })
  ).toBeVisible();

  await page.getByText(longTrack.title, { exact: true }).click();

  await expect(
    page.getByRole("heading", { name: longTrack.title })
  ).toBeVisible();

  await expect(
    page.getByRole("region", { name: "נגן שמע" })
  ).toBeVisible();
});

test("real audio playback advances time seek and percentage in the browser", async ({ page }) => {
  await openLongTrack(page);

  const times = page.locator(".basic-player__time");
  const currentTime = times.first();
  const duration = times.last();
  const seek = page.getByRole("slider", { name: "מיקום בקטע" });
  const progress = page.getByRole("progressbar", {
    name: "התקדמות הקטע",
  });

  await expect
    .poll(
      async () => parseDisplayedTime(await duration.textContent()),
      { timeout: 10_000, message: "Expected real media metadata duration" }
    )
    .toBeGreaterThan(60);

  await page.getByRole("button", { name: "נגן" }).click();

  await expect(
    page.getByRole("button", { name: "השהה" })
  ).toBeVisible();

  await expect
    .poll(
      async () => parseDisplayedTime(await currentTime.textContent()),
      { timeout: 10_000, message: "Visible current time must advance" }
    )
    .toBeGreaterThan(0);

  await expect
    .poll(
      async () => Number(await seek.inputValue()),
      { timeout: 10_000, message: "Seek slider must follow playback" }
    )
    .toBeGreaterThan(0);

  await expect
    .poll(
      async () => Number(await progress.getAttribute("aria-valuenow")),
      { timeout: 10_000, message: "Visible progress percentage must exceed zero" }
    )
    .toBeGreaterThan(0);
});

test("seek speed repeat and mute controls work through the real UI", async ({ page }, testInfo) => {
  await openLongTrack(page);

  const seek = page.getByRole("slider", { name: "מיקום בקטע" });
  const currentTime = page.locator(".basic-player__time").first();

  await seek.evaluate((element) => {
    element.value = "20";
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });

  await expect
    .poll(async () => parseDisplayedTime(await currentTime.textContent()))
    .toBeGreaterThanOrEqual(19);

  const speed = page.getByRole("combobox", { name: "מהירות ניגון" });
  await speed.selectOption("2");
  await expect(speed).toHaveValue("2");

  const repeat = page.getByRole("button", { name: "חזור על הקטע" });
  await repeat.click();
  await expect(repeat).toHaveAttribute("aria-pressed", "true");

  const mute = page.getByRole("button", { name: "השתק" });

  if (testInfo.project.name === "desktop-chromium") {
    await expect(mute).toBeVisible();
    await mute.click();
    await expect(
      page.getByRole("button", { name: "בטל השתקה" })
    ).toHaveAttribute("aria-pressed", "true");
  } else {
    await expect(mute).toBeHidden();
  }
});

test("responsive player has no horizontal overflow", async ({ page }, testInfo) => {
  await openLongTrack(page);

  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(
    dimensions.viewport + 1
  );

  if (testInfo.project.name === "mobile-chromium") {
    const seekBox = await page
      .getByRole("slider", { name: "מיקום בקטע" })
      .boundingBox();

    expect(seekBox).not.toBeNull();
    expect(seekBox.width).toBeGreaterThan(250);
  }
});
