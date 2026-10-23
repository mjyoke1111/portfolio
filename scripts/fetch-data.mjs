// Build-time data for the portfolio page.
// Every source tries the custom domain first, then a fallback host; anything that still fails
// comes from site/data/snapshot.json, so the build never breaks. Fallback hosts are only ever
// fetched here: every URL that reaches the page is rebuilt on the custom domains.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';

const SNAPSHOT = 'site/data/snapshot.json';
const TIMEOUT = 20000;

export const SITES = {
  mr: 'https://mr.mjyoke1111.biz.id/',
  jev: 'https://jev.lab.mjyoke1111.biz.id/',
  labs: 'https://lab.mjyoke1111.biz.id/',
  games: 'https://games.mjyoke1111.biz.id/',
  aica: 'https://www.youtube.com/channel/UCAI_zEvJRJ4K48zl9YmZTUw',
  dil: 'https://www.youtube.com/@dilmonmusic',
};
const FALLBACK = {
  mr: 'https://model-review-3yp.pages.dev/',
  games: 'https://ai-game-studio-amz.pages.dev/',
  jev: 'https://lab.jev-labs.pages.dev/',
};
const CHANNELS = {
  aica: { id: 'UCAI_zEvJRJ4K48zl9YmZTUw', label: 'AI Coding Arena', urls: ['https://www.youtube.com/channel/UCAI_zEvJRJ4K48zl9YmZTUw/videos', 'https://www.youtube.com/channel/UCAI_zEvJRJ4K48zl9YmZTUw/shorts'] },
  dil: { id: 'UCNPuPtbwa4xZcC-EGqJd7CQ', label: 'Dil Mon Music', urls: ['https://www.youtube.com/@dilmonmusic/videos', 'https://www.youtube.com/@dilmonmusic/shorts'] },
};

async function get(url, as = 'json') {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), headers: { 'user-agent': 'mjyoke1111-portfolio-build' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === 'json' ? res.json() : res.text();
}
async function firstOf(paths, as) {
  let last;
  for (const url of paths) {
    try { return await get(url, as); } catch (e) { last = e; }
  }
  throw last;
}
const both = (key, path) => [SITES[key] + path, FALLBACK[key] + path];

// Latest-strip links are checked before they reach the page: a run that is listed but not published
// yet answers 404. HEAD first, GET when HEAD is not 200; when the custom domain gives no answer at all
// (does not resolve, times out), the same path is tried on the fallback host. 0 means no answer anywhere.
const CHECK_TIMEOUT = 8000;
async function linkStatus(href) {
  const k = Object.keys(FALLBACK).find((key) => href.startsWith(SITES[key]));
  const urls = k ? [href, FALLBACK[k] + href.slice(SITES[k].length)] : [href];
  for (const url of urls) {
    try {
      for (const method of ['HEAD', 'GET']) {
        const res = await fetch(url, { method, signal: AbortSignal.timeout(CHECK_TIMEOUT), headers: { 'user-agent': 'mjyoke1111-portfolio-build' } });
        await res.body?.cancel().catch(() => {});
        if (res.status === 200 || method === 'GET') return res.status;
      }
    } catch { /* no answer from this host */ }
  }
  return 0;
}
// The first `quota` candidates whose link answers 200, in order. null when the first batch got no answer
// at all (offline): verification is impossible and fetchData keeps the snapshot's items.
async function pickLive(candidates, quota, hrefOf = (x) => x.href) {
  const picked = [];
  let answered = false;
  for (let i = 0; picked.length < quota && i < candidates.length;) {
    const batch = candidates.slice(i, i + quota - picked.length);
    i += batch.length;
    const codes = await Promise.all(batch.map((x) => linkStatus(hrefOf(x))));
    batch.forEach((x, j) => {
      if (codes[j]) answered = true;
      if (codes[j] === 200) picked.push(x);
      else console.log(`data: latest skips ${hrefOf(x)} (${codes[j] || 'no answer'})`);
    });
    if (!answered) return null;
  }
  return picked;
}

// "claude-opus-5-5 (effort max)" -> "Claude Opus 5.5"; labels that are already pretty pass through.
export function prettyModel(s = '') {
  s = String(s).split(/ \(| \+ /)[0].trim();
  if (/[A-Z ]/.test(s)) return s;
  const out = [];
  for (const t of s.split('-')) {
    const prev = out[out.length - 1];
    if (/^\d+$/.test(t) && prev && /\d$/.test(prev)) out[out.length - 1] = prev + '.' + t;
    else if (/^\d+$/.test(t) && prev === 'GPT') out[out.length - 1] = 'GPT-' + t;
    else if (t === 'gpt') out.push('GPT');
    else out.push(t[0].toUpperCase() + t.slice(1));
  }
  return out.join(' ');
}
// Only finished, public work reaches the strip: nothing unfinished, staged or internal by its title or id.
// (YouTube ids are random, so videos are judged by title alone.)
const JUNK = /demo|sample|test|dnf|placeholder|wip/i;
const LIVE = ['ok', 'playable', 'published'];
export const keep = (x) => !!x && LIVE.includes(x.status) && !JUNK.test(x.title || '') && !JUNK.test(x.key || '');
const humanize = (id) => { const s = String(id).replace(/[_-]+/g, ' ').trim(); return s[0].toUpperCase() + s.slice(1); };
const day = (s) => (s ? String(s).slice(0, 10) : '');

async function modelReviewer() {
  const r = await firstOf(both('mr', 'data/results.json'));
  const c = r.counts;
  const prompts = r.prompts || {};
  const title = (x) => {
    const p = prompts[x.prompt_id];
    const t = (p && (p.short_title || p.title)) || x.prompt_title || x.prompt_id;
    return t === x.prompt_id ? humanize(t) : t;
  };
  const when = (x) => x.started_utc || x.run_date || '';
  const item = (x) => ({
    project: 'mr', label: 'Model Reviewer', title: title(x), sub: prettyModel(x.model), key: x.id || x.url,
    date: day(when(x)), href: SITES.mr + x.url, thumbSrc: SITES.mr + x.artifacts.thumb, status: x.status,
  });
  const sorted = r.results.filter((x) => x.artifacts && x.artifacts.thumb).sort((a, b) => String(when(b)).localeCompare(String(when(a))));
  const latest = await pickLive(sorted.map(item).filter((it, i) => keep(it) && !JUNK.test(sorted[i].prompt_id || '')), 5);
  return {
    stats: { models: c.models, runs: c.results, harnesses: c.harnesses, prompts: c.prompts, vendors: c.vendors },
    latest,
  };
}

async function games() {
  const g = await firstOf(both('games', 'games.json'));
  const list = g.games || [];
  const pathOf = (x) => (x.path ? x.path.replace(/index\.html$/, '') : `games/${x.slug}/`);
  const newest = await pickLive(list.filter((x) => keep({ ...x, key: x.slug })).reverse(), 5, (x) => SITES.games + pathOf(x));
  if (!newest) return { stats: { games: list.length, tiers: (g.tiers || []).length }, latest: null };
  const metas = await Promise.all(newest.map((x) => firstOf(both('games', `games/${x.slug}/META.json`)).catch(() => null)));
  const latest = newest.map((x, i) => {
    const m = metas[i] || {};
    const path = pathOf(x);
    return {
      project: 'games', label: 'AI Game Studio', title: x.title, key: x.slug, status: x.status,
      sub: m.model_label || prettyModel(x.model),
      date: day(m.date || m.build_ended_utc), href: SITES.games + path,
      thumbSrc: x.poster ? SITES.games + x.poster : '', genre: x.genre,
    };
  });
  return { stats: { games: list.length, tiers: (g.tiers || []).length }, latest };
}

async function jev() {
  const cat = await firstOf(both('jev', 'labs/catalogue.json'));
  return { stats: { jev: cat.length } };
}

const unxml = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
async function feed(key) {
  const ch = CHANNELS[key];
  const xml = await get(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`, 'text');
  return pickLive([...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const id = (e.match(/<yt:videoId>([^<]+)/) || [])[1];
    return {
      project: key, label: ch.label, title: unxml((e.match(/<title>([^<]*)/) || [])[1] || ''), status: 'published',
      sub: ch.label, date: day((e.match(/<published>([^<]+)/) || [])[1]),
      href: `https://www.youtube.com/watch?v=${id}`, thumbSrc: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
    };
  }).filter(keep), 3);
}

// Long-form + Shorts for both channels, via yt-dlp when it is installed. Optional, capped at ~45 s.
function countIds(url) {
  return new Promise((resolve) => {
    execFile('yt-dlp', ['--flat-playlist', '--print', 'id', url], { timeout: 45000, maxBuffer: 1 << 22 }, (err, out) => {
      const n = String(out || '').split('\n').filter((l) => /^[\w-]{11}$/.test(l.trim())).length;
      resolve(err && !n ? null : n);
    });
  });
}
async function videoCount() {
  const urls = Object.values(CHANNELS).flatMap((c) => c.urls);
  const counts = await Promise.all(urls.map(countIds));
  if (counts.some((n) => !n)) throw new Error('yt-dlp unavailable or incomplete');
  return counts.reduce((a, b) => a + b, 0);
}

export async function fetchData() {
  const snap = existsSync(SNAPSHOT) ? JSON.parse(readFileSync(SNAPSHOT, 'utf8')) : {};
  const jobs = {
    mr: modelReviewer(), games: games(), jev: jev(), aica: feed('aica'), dil: feed('dil'),
    videos: videoCount(),
  };
  const out = {}; const sources = {};
  // Settled together, so a job that fails early is never an unhandled rejection while a slow one runs.
  const settled = await Promise.allSettled(Object.values(jobs));
  for (const [i, k] of Object.keys(jobs).entries()) {
    const { status, value, reason: e } = settled[i];
    if (status === 'fulfilled') { out[k] = value; sources[k] = 'live'; } else {
      if (snap[k] === undefined) throw new Error(`${k}: fetch failed and no snapshot (${e.message})`);
      out[k] = snap[k]; sources[k] = 'snapshot';
      console.log(`data: ${k} from snapshot (${String(e.message).slice(0, 100)})`);
    }
  }
  // Latest-strip lists whose links could not be checked at all keep the snapshot's items. Whatever the
  // source, the same filter runs last, so an older snapshot cannot bring back unfinished work.
  for (const k of ['mr', 'games', 'aica', 'dil']) {
    const list = k === 'aica' || k === 'dil';
    let items = list ? out[k] : out[k].latest;
    if (items === null) {
      items = (list ? snap[k] : snap[k] && snap[k].latest) || [];
      console.log(`data: ${k} latest from snapshot (links could not be checked)`);
    }
    items = items.filter(keep);
    if (list) out[k] = items; else out[k].latest = items;
  }
  if (Object.values(sources).includes('live')) {
    const { builtAt, sources: _s, ...prev } = snap;
    writeFileSync(SNAPSHOT, JSON.stringify({ ...prev, ...out, savedAt: new Date().toISOString() }, null, 1) + '\n');
  }
  console.log('data:', Object.entries(sources).map(([k, v]) => `${k}=${v}`).join(' '));
  return { ...out, sources, builtAt: new Date().toISOString() };
}
