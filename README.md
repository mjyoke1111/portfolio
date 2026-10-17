# mjyoke1111 — Portfolio

Source for [mjyoke1111.pages.dev](https://mjyoke1111.pages.dev): one page with the projects, games and videos.

- `src/site.json` holds the copy and links.
- `shoot.mjs` takes fresh desktop and mobile screenshots of each live site.
- `build.mjs` pulls the current game list and video feeds and writes a single static page to `dist/`.

GitHub Actions rebuilds and deploys it on every push and every six hours, so new games and episodes show up on their own.
