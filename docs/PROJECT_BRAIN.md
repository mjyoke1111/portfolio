# Project brain: portfolio (www.mjyoke1111.biz.id)

Handoff note. Keep it short.

## What this repo is
- `site/` + `src/` + `scripts/` + `build.mjs`: the portfolio page (Cloudflare Pages project "mjyoke1111").
- `labs-hub/`: a different site (lab.mjyoke1111.biz.id). Do not touch it from portfolio work.

## Status
- v3 "contact sheet" redesign built: build-time data with snapshot fallback, prerendered stats and latest strip,
  WebGL hero, bento of six projects, raw-results section, OG card. `node build.mjs` and `node --test test/` green.
- FIX1 done: per-project GitHub source links removed (repos are private; profile + this page's source only).
  Latest-strip and latest-miss links are HEAD/GET-checked at build (8 s, fallback host when the custom domain
  gives no answer); non-200 items are skipped, unverifiable lists keep the snapshot. robots.txt + sitemap.xml added.

## Next step
- Owner review of the live page after the next deploy; refresh `site/media` captures when the project sites change.
- Owner decision: Model Reviewer publishes no run page for failed runs (all 404), so the "Latest miss" card is
  currently hidden and the raw-results copy "every one of them has a public page" is not true today.

## Gotchas
- Never output a pages.dev URL; fallback hosts are fetch-only (scripts/fetch-data.mjs).
- The CI content check bans the capitalised three-letter word for the keyboard key that moves focus; say "keyboard".
- Headless Playwright Chromium cannot play H.264, so the preview loops show a failed request there; real browsers play them.
- Model Reviewer failed runs (dnf/error/timeout) have no `/r/` page yet; ok runs do.
- This machine's DNS for the custom domains flakes intermittently; the link check retries the fallback host.
- `node --test test/` on Node 22 resolves the folder through `test/package.json` "main".

## Session log
- 2026-10-23 16:25Z Claude Code/claude-opus-5-5: v3 contact-sheet redesign (data fetch + snapshot, prerendered page, WebGL hero, OG card, tests, CI extras). Lighthouse mobile local 99/100/100/100. Next: owner review after deploy.
- 2026-10-23 16:40Z Claude Code/claude-opus-5-5: FIX1 (drop private-repo source links, verify latest links at build, allSettled fetch, robots.txt + sitemap.xml); 10 tests green. Next: owner call on the miss card / raw copy.
