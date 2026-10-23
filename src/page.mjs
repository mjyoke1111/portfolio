// Renders the whole page from build-time data. CSS and JS are inlined, so the page is one request plus the font.
import { readFileSync } from 'node:fs';
import { SITES } from '../scripts/fetch-data.mjs';

export const SITE_URL = 'https://www.mjyoke1111.biz.id/';
const SOURCE = {
  mr: 'https://github.com/mjyoke1111/ai-model-reviewer',
  jev: 'https://github.com/mjyoke1111/jev-labs',
  games: 'https://github.com/mjyoke1111/ai-game-studios',
};
const SOCIAL = { x: 'https://x.com/MjYoke1111', github: 'https://github.com/mjyoke1111', coffee: 'https://buymeacoffee.com/mjyoke1111' };

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n = (v) => new Intl.NumberFormat('en-US').format(v);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const short = (iso) => { if (!iso) return ''; const [y, m, dd] = iso.slice(0, 10).split('-'); return `${+dd} ${MONTHS[m - 1]}`; };
const long = (iso) => `${short(iso)} ${iso.slice(0, 4)}`;
const host = (u) => u.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
const clean = (t) => t.replace(/\s*#shorts\b/gi, '').replace(/\bThreejs\b/g, 'Three.js').replace(/\bsvg\b/gi, 'SVG').trim();

const I = {
  ext: '<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M3.5 2.5h6v6M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  down: '<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v8.5M2.5 6.5 6 10l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  left: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  right: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  sun: '<svg class="sun" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 1.5v2.2M10 16.3v2.2M1.5 10h2.2M16.3 10h2.2M4 4l1.6 1.6M14.4 14.4 16 16M4 16l1.6-1.6M14.4 5.6 16 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  moon: '<svg class="moon" viewBox="0 0 20 20" aria-hidden="true"><path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>',
  gh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.3-.3-4.7-1.1-4.7-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.7 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.8 4.7 12 4.7 12 4.7s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-4.8ZM9.8 15.1V8.9l5.6 3.1-5.6 3.1Z"/></svg>',
  cup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V8Zm13 1.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5v2M10.5 3v2.5M14 3.5v2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
// A china-marker loop, drawn on hover around the frame number.
const LOOP = '<svg class="loop" viewBox="0 0 138 44" aria-hidden="true"><path pathLength="1" d="M20 30C6 26 4 12 26 7c26-6 74-5 96 1 16 5 14 21-8 26-30 7-78 6-98-2-9-4-6-11 5-15"/></svg>';
const CROSS = '<svg class="cross" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M6 8c30 26 58 52 88 84"/><path d="M92 6C64 36 36 62 8 94"/></svg>';

function shot(it, i) {
  const label = it.project === 'mr' ? 'MR' : it.project === 'jev' ? 'Jev' : it.project === 'games' ? 'Game' : it.project === 'dil' ? 'Dil Mon' : 'Arena';
  return `<li class="shot"><a href="${esc(it.href)}">
<span class="edge"><i>${i + 1}</i><span>${esc(label)}</span><span>${i + 1}A</span></span>
<span class="pic"><img src="${esc(it.thumb)}" width="480" height="300" alt="" loading="lazy" decoding="async"></span>
<span class="t">${esc(clean(it.title))}</span>
<span class="m">${esc(it.project === 'jev' || it.project === 'aica' || it.project === 'dil' ? it.label : it.sub)} · <time datetime="${esc(it.date)}">${short(it.date)}</time></span>
</a></li>`;
}

// Round-robin by project, freshest project first, so the first frames show a bit of everything.
function interleave(groups) {
  const gs = groups.filter((g) => g.length).sort((a, b) => String(b[0].date).localeCompare(String(a[0].date)));
  const out = [];
  for (let i = 0; gs.some((g) => g[i]); i++) for (const g of gs) if (g[i]) out.push(g[i]);
  return out;
}

function negative({ href, img, loop, alt, top, bottom, w = 960, h = 600 }) {
  return `<a class="neg" href="${esc(href)}" tabindex="-1" aria-hidden="true">
<span class="edge"><i>${esc(top[0])}</i><span>${esc(top[1])}</span></span>
<span class="pic"${loop ? ` data-loop="${esc(loop)}"` : ''}><img src="${esc(img)}" width="${w}" height="${h}" alt="${esc(alt)}" loading="lazy" decoding="async"></span>
<span class="edge b"><span>${esc(bottom[0])}</span><span>${esc(bottom[1])}</span></span>
</a>`;
}
function links(live, source, text) {
  return `<p class="go"><a href="${esc(live)}">${esc(text || host(live))}${I.ext}</a>${source ? `<a class="quiet" href="${esc(source)}">Source on GitHub${I.ext}</a>` : ''}</p>`;
}
function tags(list) { return `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`; }
function trip(items, chHref, chName) {
  return `<div class="neg" role="group" aria-label="Latest from ${esc(chName)}">
<span class="edge"><i>${esc(chName)}</i><span>Newest 3</span></span>
<div class="trip">${items.map((v) => `<a href="${esc(v.href)}"><span class="pic"><img src="${esc(v.thumb)}" width="480" height="300" alt="" loading="lazy" decoding="async"></span><span class="t">${esc(clean(v.title))}</span></a>`).join('')}</div>
<span class="edge b"><span>youtube.com</span><span>${esc(short(items[0] && items[0].date))}</span></span>
</div>`;
}

export function render(data) {
  const css = readFileSync(new URL('./style.css', import.meta.url), 'utf8');
  const js = readFileSync(new URL('./main.js', import.meta.url), 'utf8');
  const s = data.mr.stats, g = data.games, built = data.builtAt;
  const stats = { models: s.models, runs: s.runs, games: g.stats.games, jev: data.jev.stats.jev, videos: data.videos };
  const latest = interleave([data.mr.latest, data.games.latest, data.jev.latest, data.aica, data.dil]);
  const newestGame = g.latest[0];
  const bs = s.byStatus || {};
  const ours = (bs.harness_config_failure || 0) + (bs.harness_mismatch || 0) + (bs.infra_dnf || 0);
  const stopped = (bs.stopped_by_us || 0) + (bs.stopped_by_our_timeout || 0);
  const parts = [
    ['k-ok', 'Finished on their own', bs.ok || s.ok],
    ['k-dnf', 'Did not finish', bs.dnf || 0],
    ['k-err', 'Errored', bs.error || 0],
    ['k-stop', 'Stopped by a time cap', stopped],
    ['k-ours', 'Broken on my side', ours],
  ].filter((p) => p[2] > 0);
  const total = parts.reduce((a, p) => a + p[2], 0);
  const miss = data.mr.miss;
  const hr = data.mr.harnessRuns || [];
  const desc = `I test every new AI model in public: ${n(stats.models)} models, ${n(stats.runs)} runs, every raw output published, failures included. Then I build with the survivors: ${n(stats.games)} playable games, ${stats.jev} Jev experiments, ${n(stats.videos)} videos.`;
  const title = 'mjyoke1111 · AI models, tested in public';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f2f3f1">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#121211">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="mjyoke1111">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE_URL}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="mjyoke1111: every new AI model tested in public, then built with. ${n(stats.models)} models, ${n(stats.runs)} runs, ${n(stats.games)} games.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@MjYoke1111">
<meta name="twitter:creator" content="@MjYoke1111">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE_URL}og.png">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>
<script>try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')</script>
<style>${css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
<div class="wrap">
<a class="mark-word" href="${SITE_URL}" aria-label="mjyoke1111, home"><svg viewBox="0 0 26 26" aria-hidden="true"><rect x="1" y="1" width="24" height="24" fill="currentColor"/><rect x="6" y="7" width="14" height="12" style="fill:var(--paper)"/><path d="M4 3.2h2M9 3.2h2M14 3.2h2M19 3.2h2M4 22.8h2M9 22.8h2M14 22.8h2M19 22.8h2" style="stroke:var(--paper)" stroke-width="1.4"/></svg>mjyoke1111</a>
<nav aria-label="Sections"><a href="#latest">Latest</a><a href="#work">Work</a><a href="#raw">Raw results</a></nav>
<button class="theme" type="button" aria-label="Switch theme">${I.sun}${I.moon}</button>
</div>
</header>

<main id="main">
<section class="hero" aria-labelledby="hero-h">
<div class="hero-bg" aria-hidden="true"></div>
<canvas aria-hidden="true"></canvas>
<div class="wrap">
<h1 id="hero-h">I test every new AI model in public, then build with the <em>survivors</em>.</h1>
<div class="hero-foot">
<p class="lede">Same prompt to every model and coding harness, every raw output published, <b>failures included</b>. The ones that hold up make browser games, measured experiments and two YouTube channels.</p>
<div class="ctas">
<a class="btn solid" href="${SITES.mr}">Open the benchmark${I.ext}</a>
<a class="btn line" href="${SITES.games}">Play the games${I.ext}</a>
</div>
</div>
</div>
</section>

<section id="latest" class="sec strip-sec" aria-labelledby="latest-h">
<div class="wrap strip-head">
<h2 id="latest-h">Latest frames <span>· newest from every project</span></h2>
<div class="nudge"><button type="button" aria-label="Scroll back">${I.left}</button><button type="button" aria-label="Scroll forward">${I.right}</button></div>
</div>
<div class="rail" role="region" aria-label="Latest from every project" tabindex="0">
<ol class="track">${latest.map(shot).join('\n')}</ol>
</div>
</section>

<section class="sec" aria-labelledby="count-h">
<div class="wrap">
<div class="head"><h2 id="count-h">The count so far</h2><p>Pulled from the projects themselves at build time, ${esc(long(built))}.</p></div>
<ul class="counts">
<li><b class="num" data-to="${stats.models}">${n(stats.models)}</b><span>AI models benchmarked</span><small>${s.vendors ? `${s.vendors} vendors, ` : ''}${s.harnesses} coding harnesses</small></li>
<li><b class="num" data-to="${stats.runs}">${n(stats.runs)}</b><span>runs published</span><small>${n(s.notOk)} of them failed. Still published.</small></li>
<li><b class="num" data-to="${stats.games}">${n(stats.games)}</b><span>playable games</span><small>each credited to its model and harness</small></li>
<li><b class="num" data-to="${stats.jev}">${n(stats.jev)}</b><span>JevLab experiments</span><small>playable demos in the lab catalogue</small></li>
<li><b class="num" data-to="${stats.videos}">${n(stats.videos)}</b><span>videos</span><small>across two YouTube channels</small></li>
</ul>
</div>
</section>

<section id="work" class="sec" aria-labelledby="work-h">
<div class="wrap">
<div class="head"><h2 id="work-h">Six things, all live</h2><p>Every frame opens the live site. On a wide screen each one plays a short loop.</p></div>
<div class="sheet">

<article class="frame f-mr pick dev">
${negative({ href: SITES.mr, img: 'media/mr.webp', loop: 'media/mr.mp4', alt: 'Model Reviewer: a grid of results from different models for the same prompt', top: ['01', 'Model Reviewer'], bottom: [`${n(s.runs)} runs · ${s.models} models`, '01A'] })}
${LOOP}
<div class="cap">
<h3><a href="${SITES.mr}">Model Reviewer</a></h3>
${tags(['Benchmark', `${s.harnesses} harnesses`, `${n(s.prompts)} prompts`, 'failures kept'])}
<p>The same prompt goes to many AI models and coding harnesses: Claude Code, Codex, OpenCode, Cline, Pi and more. <b>Every raw output is published side by side</b>, including the ones that crashed, stalled or drew nonsense.</p>
${hr.length ? `<table class="runs"><caption class="vh">Runs per harness</caption><thead><tr><th scope="col">Harness</th><th scope="col">Runs</th></tr></thead><tbody>${hr.slice(0, 6).map((h) => `<tr><td>${esc(h.name)}</td><td class="num">${n(h.runs)}</td></tr>`).join('')}${hr.length > 6 ? `<tr><td>${hr.length - 6} more harnesses</td><td class="num">${n(hr.slice(6).reduce((a, h) => a + h.runs, 0))}</td></tr>` : ''}</tbody></table>` : ''}
${links(SITES.mr, SOURCE.mr)}
</div>
</article>

<article class="frame f-games dev">
${negative({ href: SITES.games, img: 'media/game1.webp', loop: 'media/game1.mp4', alt: 'VOIDLANCE gameplay: a 3D on-rails space shooter built by Claude Opus 5.5', top: ['02', 'AI Game Studio'], bottom: ['In the frame: VOIDLANCE', '02A'] })}
${LOOP}
<div class="cap">
<h3><a href="${SITES.games}">AI Game Studio</a></h3>
${tags(['Games', `${n(g.stats.games)} playable`, 'model credited'])}
<p>${n(g.stats.games)} browser games, each built by an AI model, with the model and harness named on every one.${newestGame ? ` Newest: <b>${esc(newestGame.title)}</b>, by ${esc(newestGame.sub.replace(' · ', ' in '))}.` : ''}</p>
${links(SITES.games, SOURCE.games)}
</div>
</article>

<article class="frame f-jev dev">
${negative({ href: SITES.jev, img: 'media/jev.webp', loop: 'media/jev.mp4', alt: 'JevLab: an experiment page showing Jev’s choice, probabilities and confidence', top: ['03', 'JevLab'], bottom: [`${data.jev.stats.jev} demos`, '03A'] })}
${LOOP}
<div class="cap">
<h3><a href="${SITES.jev}">JevLab</a></h3>
${tags(['Experiments', `${data.jev.stats.jev} demos`, 'measured'])}
<p>When does a typed model answer beat plain code? Measured experiments with the Jev decision model, each showing <b>the real choice, the probabilities and the confidence</b>.</p>
${links(SITES.jev, SOURCE.jev)}
</div>
</article>

<article class="frame f-labs dev">
${negative({ href: SITES.labs, img: 'media/labs.webp', loop: 'media/labs.mp4', alt: 'Labs hub: the index of lab projects, with JevLab first', top: ['04', 'Labs hub'], bottom: ['JevLab first', '04A'] })}
${LOOP}
<div class="cap">
<h3><a href="${SITES.labs}">Labs hub</a></h3>
${tags(['Index', 'more coming'])}
<p>The front door to every lab project. JevLab is first on the shelf; the next labs land here as they ship.</p>
${links(SITES.labs)}
</div>
</article>

<article class="frame f-aica dev">
${trip(data.aica, SITES.aica, 'AI Coding Arena')}
${LOOP}
<div class="cap">
<h3><a href="${SITES.aica}">AI Coding Arena</a></h3>
${tags(['YouTube', 'explainers', 'timelapses', 'shows'])}
<p>Plain-spoken AI explainers, coding timelapses and model showdowns: what coding agents actually ship, and where they fall over.</p>
${links(SITES.aica, null, 'Watch on YouTube')}
</div>
</article>

<article class="frame f-dil dev">
${trip(data.dil, SITES.dil, 'Dil Mon Music')}
${LOOP}
<div class="cap">
<h3><a href="${SITES.dil}">Dil Mon Music</a></h3>
${tags(['YouTube', 'original songs', 'instrumentals'])}
<p>Original AI-assisted songs and instrumentals, from Bengali-language songs to drum and bass.</p>
${links(SITES.dil, null, 'Listen on YouTube')}
</div>
</article>

<aside class="frame f-follow follow dev" aria-labelledby="follow-h">
<h3 id="follow-h">Follow the runs</h3>
<p>New runs, games and videos go out as they finish.</p>
<ul>
<li><a href="${SOCIAL.x}">${I.x}X<span>@MjYoke1111</span></a></li>
<li><a href="${SOCIAL.github}">${I.gh}GitHub<span>the source</span></a></li>
<li><a href="${SITES.aica}">${I.yt}YouTube<span>AI Coding Arena</span></a></li>
</ul>
</aside>

</div>
</div>
</section>

<section id="raw" class="sec" aria-labelledby="raw-h">
<div class="wrap">
<div class="head"><h2 id="raw-h">Nothing cherry-picked</h2></div>
<div class="raw">
<div class="raw-copy">
<p>Of <b>${n(s.runs)} runs</b>, ${n(bs.ok || s.ok)} finished on their own. ${n(bs.dnf || 0)} did not finish, ${n(bs.error || 0)} errored, and ${n(stopped + ours)} were stopped by a time cap or broken on my side. <b>Every one of them has a public page</b> with whatever it produced.</p>
<p>No rerunning until it looks good, no quiet deletions. When a model draws the D-pad as one joined cross after being asked for four separate buttons, the run page says so.</p>
<div class="bars">
<div class="stack" role="img" aria-label="${esc(parts.map((p) => `${p[1]}: ${n(p[2])}`).join(', '))}">${parts.map((p) => `<i class="${p[0]}" style="flex:${p[2]}"></i>`).join('')}</div>
<ul class="legend">${parts.map((p) => `<li><i class="${p[0]}"></i>${esc(p[1])}<b class="num">${n(p[2])}</b></li>`).join('')}</ul>
</div>
</div>
${miss ? `<article class="frame miss dev" aria-labelledby="miss-h">
<a class="neg" href="${esc(miss.href)}" tabindex="-1" aria-hidden="true">
<span class="edge"><i>Latest miss</i><span>${esc(miss.statusLabel)}</span></span>
<span class="pic"><img src="${esc(miss.thumb)}" width="480" height="300" alt="" loading="lazy" decoding="async">${CROSS}</span>
<span class="edge b"><span>${esc(short(miss.date))}</span><span>Published anyway</span></span>
</a>
<div class="cap">
<h3 id="miss-h"><a href="${esc(miss.href)}">${esc(clean(miss.title))}</a></h3>
${tags([miss.sub.split(' · ')[0], miss.sub.split(' · ')[1], miss.statusLabel].filter(Boolean))}
${miss.note ? `<p class="note">${esc(miss.note.length > 190 ? miss.note.slice(0, 187).replace(/\s+\S*$/, '') + '…' : miss.note)}</p>` : ''}
<p class="go"><a href="${esc(miss.href)}">Open the failed run${I.ext}</a></p>
</div>
</article>` : ''}
</div>
</div>
</section>
</main>

<footer class="foot">
<div class="wrap">
<div>
<p class="big" aria-hidden="true">mjyoke1111</p>
<p class="ethos">Built with AI, published raw.</p>
</div>
<nav aria-label="Elsewhere"><ul>
<li><a href="${SOCIAL.x}">${I.x}X</a></li>
<li><a href="${SOCIAL.github}">${I.gh}GitHub</a></li>
<li><a href="${SITES.aica}">${I.yt}AI Coding Arena</a></li>
<li><a href="${SITES.dil}">${I.yt}Dil Mon Music</a></li>
<li><a href="${SOCIAL.coffee}">${I.cup}Buy me a coffee</a></li>
</ul></nav>
<p class="fine">Built <time datetime="${esc(built)}">${esc(long(built))}, ${esc(built.slice(11, 16))} UTC</time>. Numbers and the latest frames refresh every six hours.</p>
</div>
</footer>
<script>${js}</script>
</body>
</html>
`;
}
