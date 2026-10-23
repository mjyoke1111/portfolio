# Project brain: portfolio (www.mjyoke1111.biz.id)

Handoff note. Keep it short.

## What this repo is
- `site/` + `src/` + `scripts/` + `build.mjs`: the portfolio page (Cloudflare Pages project "mjyoke1111").
- `labs-hub/`: a different site (lab.mjyoke1111.biz.id). Do not touch it from portfolio work.

## Status
- 2026-10-23 phone pass: fact chips stay one line (nowrap+ellipsis), card bodies min-width:0 (d222779). labs-hub moved to the light theme (Onest, same tokens, 44px back link; 70fe716, deployed to Pages labs-hub by hand: it is not in this repo's workflow).
- FIX2 owner redesign built ("daylight studio"): light-first pastel look (Onest, mint/sky/lilac/rose tints, CSS aurora),
  v2 content (862ebe6) restored as the base, raw-results/miss section gone, latest strip = finished public work only
  (ok + 200 / playable / published, junk-word filter, friendly titles). DESIGN.md is the plan of record; INSPIRATION.md
  holds the reference sites. Checked at 8 widths in Chromium and WebKit, light and dark; Lighthouse mobile local 99/100/100/100.
- Earlier: per-project source links removed, latest links verified at build, robots.txt + sitemap.xml.

## Next step
- Owner review of the light build after the next deploy (not deployed from here).
- Model Reviewer run hrefs still carry run ids (its only URL form); visible text is clean.

## Gotchas
- Never output a pages.dev URL; fallback hosts are fetch-only (scripts/fetch-data.mjs).
- The CI content check bans the capitalised three-letter word for the keyboard key that moves focus; say "keyboard".
- WebKit (Playwright, Linux) composites a premultiplied WebGL canvas and gradients to `transparent` through grey: keep the
  aurora in CSS and fade colours to their own zero-alpha value.
- Playwright needs PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright here (chromium-1140, webkit-2083 installed).
- Headless Playwright Chromium cannot play H.264, so the preview loops show a failed request there; real browsers play them.
- Model Reviewer failed runs (dnf/error/timeout) have no `/r/` page yet; ok runs do.
- This machine's DNS for the custom domains flakes intermittently; the link check retries the fallback host.
- `node --test test/` on Node 22 resolves the folder through `test/package.json` "main".

## Session log
- 2026-10-23 16:25Z Claude Code/claude-opus-5-5: v3 contact-sheet redesign (data fetch + snapshot, prerendered page, WebGL hero, OG card, tests, CI extras). Lighthouse mobile local 99/100/100/100. Next: owner review after deploy.
- 2026-10-23 16:40Z Claude Code/claude-opus-5-5: FIX1 (drop private-repo source links, verify latest links at build, allSettled fetch, robots.txt + sitemap.xml); 10 tests green. Next: owner call on the miss card / raw copy.
- 2026-10-23 17:12Z Claude Code/claude-opus-5-5: FIX2 light redesign (content from 862ebe6, strict latest filter, CSS aurora, Onest, new og.png, DESIGN.md plan of record, INSPIRATION.md); Chromium + WebKit at 8 widths. Next: owner review.
- 2026-10-23 21:15Z Claude Code/claude-opus-5-5: phone audit 360/390: portfolio clean (blank cards in full-page shots are a capture artefact), chip hardening; labs-hub light theme + 44px back link. Next: none for mobile.
