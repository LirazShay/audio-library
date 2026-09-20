# Testing and Troubleshooting

This document contains operational knowledge that should survive chat boundaries.

## 1. Standard local flow

Preferred Windows command:

```cmd
tools\update-and-preview.cmd
```

Expected high-level flow:

```text
git pull --ff-only
-> local checks
-> stop previous port 8080 listener
-> start fresh dev server
-> open http://127.0.0.1:8080/
```

Local checks:

```cmd
tools\local-check.cmd
```

## 2. Important local-server behavior

`tools/dev-server.js` is not a trivial static file server anymore.

It intentionally supports media byte ranges.

A valid range request should return:

```text
HTTP 206
Accept-Ranges: bytes
Content-Range: bytes ...
Content-Length: ...
```

Invalid ranges should return HTTP 416.

Automated coverage:

```text
tools/dev-server.test.js
```

## 3. Incident: player says Playing but visible progress stays at 0%

### Observed symptom

The browser UI showed:
- Play button changed to Pause
- audio was audible
- current-time label stayed around 0:00
- percentage visualization stayed 0%
- progress UI did not visibly advance

### Important observation

This is not the same as “audio cannot play.”

The playback engine and visible progress can fail independently.

### Fixes implemented

#### A. Live progress sync
Audio Service now updates central `currentTime` from:
- native `timeupdate`
- requestAnimationFrame while playback is active

The frame loop reads real `audio.currentTime`.

It stops on:
- pause
- ended
- error
- Track replacement

Regression test:
- advances fake `audio.currentTime`
- emits no `timeupdate`
- verifies central Player State still advances

#### B. Local HTTP Range support
Local server now supports byte-range media requests.

#### C. Fresh server restart
`update-and-preview.cmd` now terminates an old port-8080 listener before starting the new server.

### Automated verification

At documentation time:
- Audio Service live-progress suite: 17/17 PASS
- Local media server suite: 4/4 PASS
- M7 Player suite: 13/13 PASS
- M7 final DoD: 15/15 PASS
- full application regression: PASS

### Manual verification state

**PENDING USER CONFIRMATION**

The user reported the issue before the Range/restart corrections were manually confirmed in their browser.

Do not claim the incident is fully closed until the user confirms visible progress moves locally.

### Exact next diagnostic if still broken

If the user reruns the fresh local flow and visible progress still remains stale, do not guess again.

Add a temporary diagnostic panel showing live values for:

```text
audio.currentTime
audio.duration
audio.paused
audio.readyState
audio.networkState
Signal currentTime
Signal duration
Signal isPlaying
Signal playerStatus
current Track id
resolved audio src
```

Then compare:
- Audio value moves, Signal does not → Audio Service sync issue
- Signal moves, UI does not → Preact/Signals rendering issue
- neither moves but audio is audible → inspect media element/browser source state
- duration is wrong → inspect WAV metadata/network response

Remove or gate the diagnostic panel after root cause is confirmed.

## 4. Stale local server symptom

### Symptom
Changes to `tools/dev-server.js` appear to have no effect.

### Historical cause
A server was already listening on 8080.

The newly launched Node process exited due to EADDRINUSE, leaving the old server active.

### Current prevention
The standard update script kills the old listener first.

If testing manually, explicitly stop the old server before launching a new one.

## 5. Browser cache

The local server sends:

```text
Cache-Control: no-store
```

Therefore cache is less likely than a stale server process.

A hard refresh can still be useful after large browser-module changes, but do not use “cache” as the default explanation.

## 6. Media duration sanity check

Synthetic WAV fixtures currently include durations around:

- 30 sec
- 35 sec
- 45 sec
- 55 sec
- 70 sec
- 95 sec

If a known long fixture appears with an obviously different duration, investigate:

1. correct Track/source selected
2. generated library path
3. HTTP media response/range behavior
4. WAV metadata/header
5. browser media state

## 7. Generator troubleshooting

Source:

```text
src/content/
```

Output:

```text
src/data/library.json
```

If content is missing:

1. check extension is supported
2. check path/case
3. run Generator
4. read Generator warnings/errors
5. inspect generated JSON only after source/generator checks

Tracks without TXT are valid and should not disappear.

## 8. Routing troubleshooting

Direct routes are hash routes.

Examples:

```text
#/topic/<id>
#/track/<id>
```

Unknown IDs should resolve to Not Found at the application layer.

Do not fix route problems by hardcoding display names into URLs.

## 9. CI troubleshooting

When a CI test fails after a legitimate architecture change:

1. read the exact failing assertion
2. decide whether implementation regressed or the test encodes an obsolete constraint
3. update only the incorrect side
4. rerun the full relevant suite

Historical example:
A responsive test expected desktop `minmax(0, 1fr)` in the mobile stylesheet after the final mobile layout deliberately changed. The correct fix was to update the stale test while preserving the intended behavior.

## 10. Test categories

### Generator
`tools/generate-library.test.js`

### Library/router/app
- `tools/library-service.test.mjs`
- `tools/router-service.test.mjs`
- `tools/app-routing.test.mjs`
- `tools/m3-routing-integration.test.mjs`

### Topics/Tracks
- `tools/m4-topics.test.mjs`
- `tools/m5-tracks.test.mjs`

### Audio/player
- `tools/audio-service.test.mjs`
- `tools/m6-track-page.test.mjs`
- `tools/m7-player.test.mjs`
- `tools/m7-final.test.mjs`

### Local media server
- `tools/dev-server.test.js`

## 11. Production vs local

GitHub Pages and the local Node server are different HTTP environments.

A bug reproduced only locally may be:
- local server behavior
- stale local process
- local generated content

A bug reproduced only in production may be:
- deployment version
- path/base URL
- hosting behavior

Always record where the bug was reproduced.
