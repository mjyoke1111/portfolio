// node --test test/  (builds once, then checks the output)
const test = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const { readFileSync, readdirSync, existsSync, statSync } = require('node:fs');
const { join } = require('node:path');
const zlib = require('node:zlib');

const root = join(__dirname, '..');
execFileSync(process.execPath, ['build.mjs'], { cwd: root, stdio: 'pipe', timeout: 120000 });
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const data = JSON.parse(readFileSync(join(dist, 'data.json'), 'utf8'));

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const textFiles = walk(dist).filter((f) => /\.(html|json|css|js|svg|txt)$|_headers$/.test(f));

test('dist builds with the page and its assets', () => {
  for (const f of ['index.html', 'data.json', 'og.png', 'favicon.svg', 'fonts/archivo.woff2']) assert.ok(existsSync(join(dist, f)), f);
  assert.ok(!existsSync(join(dist, 'data', 'snapshot.json')), 'snapshot stays out of dist');
});

test('no pages.dev anywhere in dist', () => {
  for (const f of textFiles) assert.ok(!/pages\.dev/i.test(readFileSync(f, 'utf8')), f);
});

test('project links use the custom domains only', () => {
  const hrefs = [...html.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1]);
  const allowed = /^https:\/\/((www\.)?mjyoke1111\.biz\.id|mr\.mjyoke1111\.biz\.id|jev\.lab\.mjyoke1111\.biz\.id|lab\.mjyoke1111\.biz\.id|games\.mjyoke1111\.biz\.id|www\.youtube\.com|github\.com|x\.com|buymeacoffee\.com)\//;
  for (const h of hrefs) assert.match(h, allowed, h);
  for (const site of ['https://mr.mjyoke1111.biz.id/', 'https://jev.lab.mjyoke1111.biz.id/', 'https://lab.mjyoke1111.biz.id/', 'https://games.mjyoke1111.biz.id/',
    'https://www.youtube.com/channel/UCAI_zEvJRJ4K48zl9YmZTUw', 'https://www.youtube.com/@dilmonmusic',
    'https://github.com/mjyoke1111/ai-model-reviewer', 'https://github.com/mjyoke1111/jev-labs', 'https://github.com/mjyoke1111/ai-game-studios',
    'https://x.com/MjYoke1111', 'https://github.com/mjyoke1111']) {
    assert.ok(html.includes(`href="${site}"`), site);
  }
});

test('stats are prerendered from build data', () => {
  const fmt = (v) => new Intl.NumberFormat('en-US').format(v);
  const stats = [data.mr.stats.models, data.mr.stats.runs, data.games.stats.games, data.jev.stats.jev, data.videos];
  for (const v of stats) {
    assert.ok(Number.isInteger(v) && v > 0, `stat ${v}`);
    assert.ok(html.includes(`data-to="${v}">${fmt(v)}</b>`), `stat ${v} in html`);
  }
});

test('latest strip is filled from every project', () => {
  const shots = html.match(/<li class="shot">/g) || [];
  assert.ok(shots.length >= 10, `${shots.length} latest items`);
  for (const h of ['href="https://mr.mjyoke1111.biz.id/r/', 'href="https://games.mjyoke1111.biz.id/games/', 'href="https://jev.lab.mjyoke1111.biz.id/labs/', 'href="https://www.youtube.com/watch?v=']) {
    assert.ok(html.includes(h), h);
  }
});

test('meta, canonical and share tags are present', () => {
  for (const s of ['<meta name="description"', '<link rel="canonical" href="https://www.mjyoke1111.biz.id/">', 'property="og:title"', 'property="og:description"',
    '<meta property="og:image" content="https://www.mjyoke1111.biz.id/og.png">', '<meta property="og:url" content="https://www.mjyoke1111.biz.id/">',
    '<meta name="twitter:card" content="summary_large_image">', '<meta name="theme-color"', 'rel="icon"']) {
    assert.ok(html.includes(s), s);
  }
});

test('no banned strings in dist', () => {
  // Assembled from pieces so this file does not contain the strings it bans.
  const words = [['mu', 'hib'], ['ka', 'rim'], ['ai-dev-', '2024'], ['tab', '.bot'], ['/ho', 'me/'], ['AE', 'ST'], ['Austr', 'alia']].map((p) => p.join(''));
  for (const f of textFiles) {
    const text = readFileSync(f, 'utf8').toLowerCase();
    for (const w of words) assert.ok(!text.includes(w.toLowerCase()), `${f}: ${w.slice(0, 2)}…`);
    assert.ok(!/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text), `${f}: looks like an email`);
  }
  assert.ok(!/\bTab\b/.test(html), 'the T-word');
});

test('page weight stays small', () => {
  const gz = zlib.gzipSync(html).length;
  assert.ok(gz < 120 * 1024, `${gz} bytes gz`);
});
