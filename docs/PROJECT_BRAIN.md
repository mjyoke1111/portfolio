# Project brain: portfolio (www.mjyoke1111.biz.id)

Handoff note. Keep it short.

## What this repo is
- `site/` + `src/` + `scripts/` + `build.mjs`: the portfolio page (Cloudflare Pages project "mjyoke1111").
- `labs-hub/`: a different site (lab.mjyoke1111.biz.id). Do not touch it from portfolio work.

## Status
- v3 "contact sheet" redesign built: build-time data with snapshot fallback, prerendered stats and latest strip,
  WebGL hero, bento of six projects, raw-results section, OG card. `node build.mjs` and `node --test test/` green.

## Next step
- Owner review of the live page after the next deploy; refresh `site/media` captures when the project sites change.

## Gotchas
- Never output a pages.dev URL; fallback hosts are fetch-only (scripts/fetch-data.mjs).
- The CI content check bans the capitalised three-letter word for the keyboard key that moves focus; say "keyboard".
- Headless Playwright Chromium cannot play H.264, so the preview loops show a failed request there; real browsers play them.
- `node --test test/` on Node 22 resolves the folder through `test/package.json` "main".

## Session log
