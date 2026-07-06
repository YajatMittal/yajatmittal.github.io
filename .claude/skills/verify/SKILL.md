---
name: verify
description: Build/launch/drive recipe for verifying changes to this static portfolio site in a real browser.
---

# Verifying this site

Static site, no build step — JSX compiles in-browser via @babel/standalone, so `file://` won't work and there is nothing to typecheck.

## Launch

```bash
python3 -m http.server 8123   # from the repo root, then http://localhost:8123
```

## Drive (headless)

No playwright in the repo; install `playwright-core` in the scratchpad and launch system Chrome:

```js
const { chromium } = require('playwright-core');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
```

Gotchas:
- **Skip the intro splash** or every screenshot is the splash screen:
  `page.addInitScript(() => sessionStorage.setItem('ym_intro_seen', '1'))`
- Routing is hash-based: `/#projects`, `/#blog`, etc. Navigating between hashes on the same origin doesn't refire `goto` load events — use `page.goto` with the full URL each time.
- Wait ~1.5s after `networkidle` for Babel to compile the JSX and React to mount before querying the DOM.
- Project video covers lazy-load via IntersectionObserver (`ProjFileVideoCover` in src/sections.jsx): `src` is only set when the card scrolls near the viewport. To assert on network behavior, listen for `.mp4` requests before/after scrolling.

## Flows worth driving

- `/#projects` — video covers play/pause with scroll; still-image covers render.
- `/#blog` — cover thumbnails load (all .jpg under assets/blog/), card links correct.
- `/` — featured strip; check total bytes transferred if perf is the concern.
