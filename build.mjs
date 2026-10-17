// Builds dist/ from src/site.json plus live data (game list, video feeds) and the screenshots shoot.mjs took.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';

const cfg = JSON.parse(readFileSync('src/site.json', 'utf8'));
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const host = (u) => new URL(u).host;
const get = async (url, kind = 'text') => {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 portfolio-builder' } });
      if (r.ok) return kind === 'json' ? r.json() : r.text();
    } catch {}
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  return null;
};
const unent = (s) => s?.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const feed = (xml) => xml ? [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
  id: (e.match(/<yt:videoId>([^<]+)/) || [])[1],
  title: unent((e.match(/<title>([^<]+)/) || [])[1]),
  date: (e.match(/<published>([^<]+)/) || [])[1] || '',
})).filter((v) => v.id) : [];

mkdirSync('dist/shots', { recursive: true });
const games = (await get(cfg.games_json, 'json'))?.games?.filter((g) => g.status !== 'hidden' && g.path) ?? [];
const shows = [];
for (const s of cfg.shows) {
  let vids = feed(await get(s.feed));
  if (s.id !== 'velvet') vids = vids.sort((a, b) => b.date.localeCompare(a.date)); // series start at episode one; the rest newest first
  shows.push({ ...s, vids: vids.slice(0, 3) });
}

const shot = (name) => {
  if (!existsSync(`shots/${name}`)) return '';
  copyFileSync(`shots/${name}`, `dist/shots/${name}`);
  return `shots/${name}`;
};

const project = (p, i) => {
  const d = shot(`${p.id}-d.jpg`), m = shot(`${p.id}-m.jpg`);
  const line = p.line.replace('{games}', games.length || 'Dozens');
  const load = i === 0 ? 'fetchpriority="high"' : 'loading="lazy"';
  return `
<article class="project">
  <figure class="shots">${d ? `<a href="${esc(p.url)}" tabindex="-1" aria-hidden="true"><img src="${d}" width="1440" height="900" alt="" ${load} decoding="async"></a>` : ''}${m ? `<img class="phone" src="${m}" width="390" height="844" alt="" loading="lazy" decoding="async">` : ''}</figure>
  <div>
    <p class="kind">${esc(p.kind)}</p>
    <h3><a href="${esc(p.url)}">${esc(p.title)}</a></h3>
    <p>${esc(line)}</p>
    <p class="tech">${esc(p.tech)}</p>
    <a class="visit" href="${esc(p.url)}">${esc(host(p.url))} ↗</a>
  </div>
</article>`;
};

const pitch = (g) => (g.pitch || '').split(/(?<=[.!?])\s/)[0].slice(0, 110);
const picks = games.filter((g) => g.poster).slice(0, 8);
const game = (g) => `
<li><a href="${esc(cfg.games_base + g.path)}"><img src="${esc(cfg.games_base + g.poster)}" width="400" height="250" alt="" loading="lazy" decoding="async"><h3>${esc(g.title)}</h3><p>${esc(pitch(g))}</p></a></li>`;

const vid = (v, short) => `
<li><a href="https://www.youtube.com/${short ? 'shorts/' : 'watch?v='}${esc(v.id)}"><img src="https://i.ytimg.com/vi/${esc(v.id)}/mqdefault.jpg" width="320" height="180" alt="" loading="lazy" decoding="async"><span>${esc(v.title)}</span></a></li>`;
const show = (s) => `
<div class="show">
  <div class="show-head"><h3>${esc(s.title)}</h3><a href="${esc(s.url)}">${esc(s.cta)} ↗</a></div>
  <p>${esc(s.line)}</p>
  ${s.vids.length ? `<ul class="vids">${s.vids.map((v) => vid(v, s.short)).join('')}</ul>` : ''}
</div>`;

const og = existsSync('shots/og.png') ? (copyFileSync('shots/og.png', 'dist/og.png'), cfg.url + 'og.png') : '';
const L = cfg.links;
const updated = new Date().toUTCString().split(' ').slice(1, 4).join(' ');
const css = readFileSync('src/style.css', 'utf8');

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(cfg.title)}</title>
<meta name="description" content="${esc(cfg.description)}">
<link rel="canonical" href="${esc(cfg.url)}">
<meta name="theme-color" content="#faf9f6" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#121211" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website"><meta property="og:url" content="${esc(cfg.url)}">
<meta property="og:title" content="${esc(cfg.title)}"><meta property="og:description" content="${esc(cfg.description)}">
${og ? `<meta property="og:image" content="${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@MjYoke1111">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231b1b19'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='17' fill='%23faf9f6' text-anchor='middle'%3Emj%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://i.ytimg.com">
<style>${css}</style>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<div class="wrap">
<header class="site">
  <a class="name" href="./">${esc(cfg.name)}</a>
  <nav aria-label="Sections"><a href="#work">Work</a><a href="#games">Games</a><a href="#videos">Videos</a><a href="#about">About</a></nav>
</header>
<main id="main">
<section class="intro">
  <h1>I build things with AI models and put them online, where you can try them.</h1>
  <p>Most of it comes back to one question: what can these models actually make when you hand them a real brief? Benchmarks, games, small experiments and a couple of shows, all live.</p>
  <ul class="inline-links"><li><a href="${esc(L.x)}">X</a></li><li><a href="${esc(L.github)}">GitHub</a></li><li><a href="${esc(L.youtube)}">YouTube</a></li></ul>
</section>

<section id="work" aria-labelledby="work-h">
  <div class="section-head"><h2 id="work-h">Work</h2></div>
  ${cfg.work.map(project).join('')}
</section>

<section id="games" aria-labelledby="games-h">
  <div class="section-head"><h2 id="games-h">Games</h2><a href="${esc(cfg.games_base)}">All ${games.length || ''} games ↗</a></div>
  <p class="lead">Every one of these was made by an AI model from a single prompt. A few worth starting with:</p>
  <ul class="games">${picks.map(game).join('')}</ul>
</section>

<section id="videos" aria-labelledby="videos-h">
  <div class="section-head"><h2 id="videos-h">Videos</h2></div>
  ${shows.map(show).join('')}
</section>

<section id="about" aria-labelledby="about-h">
  <div class="section-head"><h2 id="about-h">About</h2></div>
  <div class="about">
    <p>I like building with new AI models the week they come out, and putting the results somewhere anyone can try them. Everything here is made in public and keeps changing. The quickest way to reach me is on X.</p>
    <ul class="contact">
      <li><span>X</span><a href="${esc(L.x)}">@MjYoke1111</a></li>
      <li><span>GitHub</span><a href="${esc(L.github)}">mjyoke1111</a></li>
      <li><span>YouTube</span><a href="${esc(L.youtube)}">AI Coding Arena</a></li>
    </ul>
  </div>
</section>
</main>
<footer><span>Updated ${esc(updated)}</span><a href="${esc(L.github)}/portfolio">Source</a></footer>
</div>
</body></html>
`;
writeFileSync('dist/index.html', html);
writeFileSync('dist/_headers', '/shots/*\n  Cache-Control: public, max-age=86400\n/og.png\n  Cache-Control: public, max-age=86400\n');
console.log('built', { games: games.length, shows: shows.map((s) => s.vids.length), og: !!og, bytes: html.length });
