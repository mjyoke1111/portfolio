// Portfolio: fetch build-time data, copy site/ into dist/, localise the latest thumbnails, prerender index.html.
import { cpSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fetchData } from './scripts/fetch-data.mjs';
import { render } from './src/page.mjs';

const data = await fetchData();

rmSync('dist', { recursive: true, force: true });
cpSync('site', 'dist', { recursive: true, filter: (src) => !/[\\/]data([\\/]|$)/.test(src.replace(/^site/, '')) });
mkdirSync('dist/latest', { recursive: true });

// Thumbnails are fetched once and cropped to 480x300 webp with ffmpeg when it is available,
// so the page serves small same-origin images. Without ffmpeg, the custom-domain URL is used as is.
const run = (cmd, args) => new Promise((ok) => execFile(cmd, args, { timeout: 20000 }, (e) => ok(!e)));
const hasFfmpeg = await run('ffmpeg', ['-version']);
async function localise(item, name) {
  item.thumb = item.thumbSrc;
  if (!hasFfmpeg || !item.thumbSrc) return;
  try {
    let res;
    for (let i = 0; i < 3 && !(res && res.ok); i++) {
      if (i) await new Promise((r) => setTimeout(r, 800 * i));
      res = await fetch(item.thumbSrc, { signal: AbortSignal.timeout(20000) }).catch((e) => ({ ok: false, status: e.name }));
    }
    if (!res.ok) return console.log(`thumb ${name}: ${res.status}, using the remote URL`);
    const tmp = join(tmpdir(), `pf-${process.pid}-${name}`);
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
    // YouTube's mq thumbnails are 16:9 already; everything is centre-cropped to 16:10.
    const vf = 'scale=480:300:force_original_aspect_ratio=increase:flags=lanczos,crop=480:300';
    if (await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, '-vf', vf, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '74', `dist/latest/${name}.webp`])) {
      item.thumb = `latest/${name}.webp`;
    } else console.log(`thumb ${name}: ffmpeg failed, using the remote URL`);
    rmSync(tmp, { force: true });
  } catch { /* keep the remote URL */ }
}
const jobs = [];
for (const k of ['mr', 'games']) data[k].latest.forEach((it, i) => jobs.push([it, `${k}-${i + 1}`]));
for (const k of ['aica', 'dil']) data[k].forEach((it, i) => jobs.push([it, `${k}-${i + 1}`]));
// Four at a time, so no host sees a burst.
await Promise.all([0, 1, 2, 3].map(async () => { for (let j; (j = jobs.shift());) await localise(...j); }));

writeFileSync('dist/index.html', render(data));
writeFileSync('dist/data.json', JSON.stringify(data, null, 1));
console.log(`dist ready (${data.builtAt}; thumbs ${hasFfmpeg ? 'localised' : 'remote'})`);
