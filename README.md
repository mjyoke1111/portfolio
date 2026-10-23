# mjyoke1111 — portfolio

Source for [www.mjyoke1111.biz.id](https://www.mjyoke1111.biz.id/): one page for everything built with AI in public, with
real numbers and the newest finished work from every project. Light first, pastel and calm; the plan of record is
`DESIGN.md`, the reference sites are in `INSPIRATION.md`.

- [Model Reviewer](https://mr.mjyoke1111.biz.id/) · [JevLab](https://jev.lab.mjyoke1111.biz.id/) · [Labs hub](https://lab.mjyoke1111.biz.id/) · [AI Game Studio](https://games.mjyoke1111.biz.id/)
- YouTube: [AI Coding Arena](https://www.youtube.com/channel/UCAI_zEvJRJ4K48zl9YmZTUw) · [Dil Mon Music](https://www.youtube.com/@dilmonmusic)

## How it builds

`node build.mjs` does everything:

1. `scripts/fetch-data.mjs` pulls the Model Reviewer results, the game list (plus each newest game's META.json), the Jev
   catalogue and both YouTube feeds, and counts videos with `yt-dlp` when it is installed. Each request has a 20 s timeout;
   anything that fails comes from `site/data/snapshot.json`, which is refreshed whenever a fetch succeeds. The latest strip
   keeps only finished, public items (status ok / playable / published, no demo, sample, test, dnf, placeholder or wip in a
   title or id) and checks every link answers 200 before it goes on the page.
2. `site/` is copied to `dist/` (the snapshot stays out).
3. The latest thumbnails are cropped to 480x300 webp into `dist/latest/` with ffmpeg; without ffmpeg the page links them
   from the project domains instead.
4. `src/page.mjs` prerenders `dist/index.html` with `src/style.css` and `src/main.js` inlined, and `dist/data.json` holds
   the merged data.

Only the custom domains above ever appear in the output.

## Pieces

- `src/page.mjs`, `src/style.css`, `src/main.js`: the page. The hero aurora is three CSS gradient pools drifting slowly
  (transform only), off under reduced motion.
- `site/media/`: hand-captured preview posters (.webp, plus `-480` variants for small screens) and short muted loops (.mp4). Loops only play on wide screens with a
  mouse, when in view; phones, save-data and reduced motion get the poster.
- `site/fonts/onest.woff2`: Onest variable (weight 300–800, OFL), Latin subset.
- `src/og.html` + `scripts/og.mjs`: the 1200x630 share card. Run `node scripts/og.mjs` after a build to refresh
  `site/og.png` (set `PLAYWRIGHT_MODULE` if playwright is installed elsewhere).
- `shoot.mjs`: kept for the workflow; it leaves the committed media alone.
- `test/site.test.cjs`: `node --test test/` builds and checks the output (custom domains only, stats present, latest-strip
  content rules, clean visible text, share tags, banned strings, page weight). `test/package.json` points newer Node versions at the file when given the folder.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) runs `shoot.mjs`, `build.mjs` and a content check, then deploys `dist/` to
Cloudflare Pages on every push to `main` and every six hours, so new runs, games, experiments and videos show up on their own.

Design notes live in `DESIGN.md`; product facts in `PRODUCT.md`.
