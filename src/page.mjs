// Renders the whole page from build-time data. CSS and JS are inlined, so the page is one request plus the font.
import { readFileSync } from 'node:fs';
import { SITES } from '../scripts/fetch-data.mjs';

export const SITE_URL = 'https://www.mjyoke1111.biz.id/';
const SOCIAL = { x: 'https://x.com/MjYoke1111', github: 'https://github.com/mjyoke1111', coffee: 'https://buymeacoffee.com/mjyoke1111' };
// The project repos are private; only this page's own source is public.
const PAGE_SOURCE = 'https://github.com/mjyoke1111/portfolio';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v) => new Intl.NumberFormat('en-US').format(v);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const short = (iso) => { if (!iso) return ''; const [, m, dd] = iso.slice(0, 10).split('-'); return `${+dd} ${MONTHS[m - 1]}`; };
const long = (iso) => `${short(iso)} ${iso.slice(0, 4)}`;
const host = (u) => u.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
const clean = (t) => t.replace(/\s*#shorts\b/gi, '').replace(/\bThreejs\b/g, 'Three.js').replace(/\bsvg\b/gi, 'SVG').trim();

const I = {
  arrow: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5l7-7M5.5 4.5h6v6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  left: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12 4.5 6.5 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  right: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 4.5 5.5 5.5L8 15.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 1.5v2.2M10 16.3v2.2M1.5 10h2.2M16.3 10h2.2M4 4l1.6 1.6M14.4 14.4 16 16M4 16l1.6-1.6M14.4 5.6 16 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
  gh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.3-.3-4.7-1.1-4.7-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.6 3.1-5.6 3.1Z"/></svg>',
  cup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V8Zm13 1.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5v2M10.5 3v2.5M14 3.5v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
const KIND = { mr: ['sky', 'Model Reviewer'], games: ['mint', 'AI Game Studio'], aica: ['rose', 'AI Coding Arena'], dil: ['lilac', 'Dil Mon Music'] };

function shot(it) {
  const [tone, name] = KIND[it.project] || ['sky', it.label];
  return `<li class="shot t-${tone}"><a href="${esc(it.href)}">
<span class="pic"><img src="${esc(it.thumb)}" width="480" height="300" alt="" loading="lazy" decoding="async"></span>
<span class="who"><i aria-hidden="true"></i>${esc(name)}</span>
<span class="t">${esc(clean(it.title))}</span>
<span class="m">${it.project === 'aica' || it.project === 'dil' ? 'Video' : esc(it.sub)} · <time datetime="${esc(it.date)}">${short(it.date)}</time></span>
</a></li>`;
}

// Round-robin by project, freshest project first, so the first cards show a bit of everything.
function interleave(groups) {
  const gs = groups.filter((g) => g.length).sort((a, b) => String(b[0].date).localeCompare(String(a[0].date)));
  const out = [];
  for (let i = 0; gs.some((g) => g[i]); i++) for (const g of gs) if (g[i]) out.push(g[i]);
  return out;
}

function preview({ href, img, loop, alt, eager, sizes = '(min-width: 760px) 46vw, 92vw' }) {
  return `<a class="preview" href="${esc(href)}" tabindex="-1" aria-hidden="true">
<span class="pic"${loop ? ` data-loop="${esc(loop)}"` : ''}><img src="${esc(img)}" srcset="${srcset(img)}" sizes="${sizes}" width="960" height="600" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>
</a>`;
}
// 480w and 960w posters; `sizes` says how wide the slot is at each layout.
const srcset = (img) => `${img.replace(/\.webp$/, '-480.webp')} 480w, ${img} 960w`;
const facts = (list) => `<ul class="facts">${list.map((t) => `<li>${t}</li>`).join('')}</ul>`;
const go = (href, text) => `<a class="go" href="${esc(href)}">${esc(text || host(href))}${I.arrow}</a>`;
function channel(items, href, name, copy, tone) {
  return `<article class="card ch t-${tone} reveal">
<div class="body">
<h3><a href="${esc(href)}">${esc(name)}</a></h3>
<p>${copy}</p>
${go(href, 'youtube.com')}
</div>
<ul class="vids" aria-label="Newest from ${esc(name)}">${items.map((v) => `<li><a href="${esc(v.href)}"><span class="pic"><img src="${esc(v.thumb)}" width="480" height="300" alt="" loading="lazy" decoding="async"></span><span class="t">${esc(clean(v.title))}</span></a></li>`).join('')}</ul>
</article>`;
}

export function render(data) {
  const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,])\s*/g, '$1').trim();
  const js = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  const s = data.mr.stats, g = data.games, built = data.builtAt;
  const stats = { runs: s.runs, models: s.models, games: g.stats.games, jev: data.jev.stats.jev, videos: data.videos };
  const latest = interleave([data.mr.latest, data.games.latest, data.aica, data.dil]);
  const desc = 'Everything I build with AI models, in one place: Model Reviewer, JevLab, AI Game Studio, and the AI Coding Arena and Dil Mon Music channels.';
  const share = `AI model benchmarks, Jev experiments, ${n(stats.games)} AI-made browser games and two YouTube channels, all live.`;
  const title = 'mjyoke1111 · AI builder';
  const counts = [
    [stats.runs, 'model runs'], [stats.models, 'models tested'], [stats.games, 'playable games'],
    [stats.jev, 'lab experiments'], [stats.videos, 'videos'],
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}">
<meta name="theme-color" content="#f7f7f4">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="mjyoke1111">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(share)}">
<meta property="og:image" content="${SITE_URL}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="mjyoke1111, AI builder: Model Reviewer, JevLab, AI Game Studio and two YouTube channels.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MjYoke1111">
<meta name="twitter:creator" content="@MjYoke1111">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(share)}">
<meta name="twitter:image" content="${SITE_URL}og.png">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/onest.woff2" as="font" type="font/woff2" crossorigin>
<script>try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}document.documentElement.classList.add('js')</script>
<style>${css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
<div class="wrap">
<a class="brand" href="${SITE_URL}" aria-label="mjyoke1111, home"><svg viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" class="b1"/><circle cx="10" cy="11" r="6.5" class="b2"/><circle cx="18.5" cy="17" r="6.5" class="b3"/></svg>mjyoke1111</a>
<nav aria-label="Sections"><a href="#work">Projects</a><a href="#latest">Latest</a><a href="#channels">Channels</a></nav>
<button class="theme" type="button" aria-label="Switch to dark theme">${I.sun}${I.moon}</button>
</div>
</header>

<main id="main">
<section class="hero" aria-labelledby="hero-h">
<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="wrap hero-grid">
<div class="hero-copy">
<h1 id="hero-h">I hand AI models real briefs and <span>publish what they make.</span></h1>
<p class="lede">Benchmarks you can open, experiments you can poke, games you can play, all live on the web.</p>
<div class="ctas">
<a class="btn solid" href="${SITES.mr}">Open Model Reviewer${I.arrow}</a>
<a class="btn soft" href="${SITES.games}">Play the games${I.arrow}</a>
</div>
</div>
<div class="stack" aria-hidden="true">
<a class="pane p1" href="${SITES.mr}" tabindex="-1"><img src="media/mr.webp" srcset="${srcset('media/mr.webp')}" sizes="(min-width: 1100px) 34vw, 76vw" width="960" height="600" alt="" fetchpriority="high" decoding="async"></a>
<a class="pane p2" href="${SITES.games}" tabindex="-1"><img src="media/game1.webp" srcset="${srcset('media/game1.webp')}" sizes="(min-width: 1100px) 27vw, 60vw" width="960" height="600" alt="" decoding="async"></a>
<a class="pane p3" href="${SITES.jev}" tabindex="-1"><img src="media/jev.webp" srcset="${srcset('media/jev.webp')}" sizes="(min-width: 1100px) 21vw, 46vw" width="960" height="600" alt="" decoding="async"></a>
</div>
<ul class="counts" aria-label="Headline numbers">
${counts.map(([v, l]) => `<li><b class="num" data-to="${v}">${n(v)}</b><span>${l}</span></li>`).join('\n')}
</ul>
</div>
</section>

<section id="work" class="sec" aria-labelledby="work-h">
<div class="wrap">
<div class="head"><h2 id="work-h">Projects</h2><p>Each one is live. Open it and look around.</p></div>
<div class="projects">

<article class="card proj big t-sky reveal">
${preview({ href: SITES.mr, img: 'media/mr.webp', loop: 'media/mr.mp4', alt: 'Model Reviewer: one prompt, results from many AI models side by side', sizes: '(min-width: 1000px) 52vw, 92vw' })}
<div class="body">
<h3><a href="${SITES.mr}">Model Reviewer</a></h3>
<p>The same prompt, many AI models and coding harnesses, every result published side by side so you can judge for yourself.</p>
${facts([`${n(s.runs)} runs`, `${n(s.models)} models`, `${n(s.harnesses)} harnesses`, `${n(s.prompts)} prompts`])}
${go(SITES.mr)}
</div>
</article>

<article class="card proj t-lilac reveal">
${preview({ href: SITES.labs, img: 'media/labs.webp', loop: 'media/labs.mp4', alt: 'Labs: the index of lab projects, JevLab first' })}
<div class="body">
<h3><a href="${SITES.labs}">Labs</a></h3>
<p>Measured experiments with small models, one lab per idea. First up, JevLab: playgrounds where real Jev picks, ranks and guards, with the results shown.</p>
${facts([`${n(stats.jev)} experiments`, 'runs offline'])}
<div class="gos">${go(SITES.labs)}${go(SITES.jev, 'JevLab')}</div>
</div>
</article>

<article class="card proj t-mint reveal">
${preview({ href: SITES.games, img: 'media/games.webp', loop: 'media/games.mp4', alt: 'AI Game Studio: a shelf of browser games made by AI models' })}
<div class="body">
<h3><a href="${SITES.games}">AI Game Studio</a></h3>
<p>A shelf of browser games, each one made by an AI model from a single prompt. Every one is playable on your phone.</p>
${facts([`${n(g.stats.games)} games`, `${n(g.stats.tiers)} tiers`])}
${go(SITES.games)}
</div>
</article>

</div>
</div>
</section>

<section id="latest" class="sec strip-sec" aria-labelledby="latest-h">
<div class="wrap head">
<h2 id="latest-h">Fresh from the projects</h2>
<p>New games, model comparisons and videos as they go live.</p>
<div class="nudge"><button type="button" aria-label="Scroll back">${I.left}</button><button type="button" aria-label="Scroll forward">${I.right}</button></div>
</div>
<div class="rail" role="region" aria-label="Latest from every project" tabindex="0">
<ol class="track">${latest.map(shot).join('\n')}</ol>
</div>
</section>

<section id="channels" class="sec" aria-labelledby="channels-h">
<div class="wrap">
<div class="head"><h2 id="channels-h">Channels</h2><p>Two YouTube channels, both updated often.</p></div>
<div class="channels">
${channel(data.aica, SITES.aica, 'AI Coding Arena', 'Model face-offs, build timelapses and explainers on what AI coding agents can actually ship.', 'rose')}
${channel(data.dil, SITES.dil, 'Dil Mon Music', 'Original instrumentals and songs made with AI music tools, new uploads every day.', 'lilac')}
</div>
</div>
</section>

<section class="sec elsewhere" aria-labelledby="else-h">
<div class="wrap">
<div class="head"><h2 id="else-h">Elsewhere</h2></div>
<ul class="links">
<li><a href="${SOCIAL.x}">${I.x}<b>X</b><span>@MjYoke1111 · daily builds and results</span></a></li>
<li><a href="${SOCIAL.github}">${I.gh}<b>GitHub</b><span>github.com/mjyoke1111</span></a></li>
<li><a href="${SOCIAL.coffee}">${I.cup}<b>Buy me a coffee</b><span>keeps the model runs going</span></a></li>
</ul>
</div>
</section>
</main>

<footer class="foot">
<div class="wrap">
<p class="sign"><span class="brand-t">mjyoke1111</span> AI builder. Everything here is live.</p>
<nav aria-label="Elsewhere"><ul>
<li><a href="${SOCIAL.x}" aria-label="X">${I.x}</a></li>
<li><a href="${SOCIAL.github}" aria-label="GitHub">${I.gh}</a></li>
<li><a href="${SITES.aica}" aria-label="AI Coding Arena on YouTube">${I.yt}</a></li>
<li><a href="${SOCIAL.coffee}" aria-label="Buy me a coffee">${I.cup}</a></li>
</ul></nav>
<p class="fine">Numbers as of <time datetime="${esc(built)}">${esc(long(built))}</time>, refreshed every six hours. <a href="${PAGE_SOURCE}">Source of this page</a></p>
</div>
</footer>
<script>${js}</script>
</body>
</html>
`;
}
