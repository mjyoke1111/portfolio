// Renders site/og.png (1200x630) from src/og.html with Playwright, using the numbers from the last build.
// Run after `node build.mjs`. Set PLAYWRIGHT_MODULE to a playwright install path if it is not resolvable here.
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const src = existsSync('dist/data.json') ? 'dist/data.json' : 'site/data/snapshot.json';
const d = JSON.parse(readFileSync(src, 'utf8'));
const fmt = (v) => new Intl.NumberFormat('en-US').format(v);
const html = readFileSync('src/og.html', 'utf8')
  .replace('{{models}}', fmt(d.mr.stats.models)).replace('{{runs}}', fmt(d.mr.stats.runs))
  .replace('{{games}}', fmt(d.games.stats.games)).replace('{{videos}}', fmt(d.videos));
const tmp = 'src/.og-render.html';
writeFileSync(tmp, html);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'site/og.png', type: 'png' });
  console.log('site/og.png written');
} finally {
  await browser.close();
  rmSync(tmp, { force: true });
}
