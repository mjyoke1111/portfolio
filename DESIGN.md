# Design: daylight studio (plan of record)

Owner brief (FIX2, 2026-10-23): modern, bright and soothing; light first; the v2 portfolio's content back as the base;
no failures, staged work or internal labels on the page; works on every screen size and in Safari.
This file is the plan the build follows. If the page and this file disagree, one of them is a bug.

## Direction
- **Thesis:** a soft off-white room with pastel light pooling at the edges; the work itself, lifted on white, is the colour.
- **First viewport:** the promise in one sentence ("I hand AI models real briefs and publish what they make."), two actions,
  three live previews (Model Reviewer, a game, JevLab) floating over the aurora, then the five live counts.
- **Path:** Projects (what to open) → Fresh from the projects (newest finished work) → Channels → Elsewhere → footer.
- **Signature moment:** the hero settles in once (copy, then the three panes float up one after another, then the counts
  count up); the aurora drifts slowly behind it. Nothing else animates on its own.
- **Not this:** dark default, neon, gradient text, glass as decoration, serif display, film or grease-pencil markings,
  eyebrow labels above headings, section numbers.

## Palette
Light is the default (even when the OS is dark); dark is one tap away on the toggle and remembered in localStorage.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f7f7f4` | `#0f1318` | page ground |
| `--surface` | `#ffffff` | `#161b22` | cards, counts, buttons |
| `--ink` | `#16202b` | `#e9edf2` | headings, body emphasis, solid button |
| `--ink-2` | `#455060` | `#b9c2ce` | body copy |
| `--ink-3` | `#5b6676` | `#9aa5b3` | secondary text, second clause of the headline |
| `--accent` | `#0f766e` | `#7fe0c8` | focus ring, link arrows |
| `--line` | `rgba(22,32,43,.09)` | `rgba(233,237,242,.09)` | hairlines, card outlines |
| sky tint / dot | `#e1eefb` / `#8cc3f0` | `#172739` / `#7db8e8` | Model Reviewer |
| mint tint / dot | `#dcf3e9` / `#7fd3b4` | `#15302a` / `#6fd0ae` | AI Game Studio, selection |
| lilac tint / dot | `#ebe5fb` / `#b4a2ee` | `#231f3a` / `#a796ea` | Labs, Dil Mon Music |
| rose tint / dot | `#fbe6e0` / `#eea897` | `#34211f` / `#e59a88` | AI Coding Arena |
| aurora | mint `rgba(150,226,198,.68)`, sky `rgba(160,205,245,.72)`, lilac `rgba(204,190,246,.66)` | same hues at .28–.30 | hero light |

Contrast (AA, measured): `--ink-2` on `--bg` 7.6:1, `--ink-3` on `--bg` 5.4:1, `--ink-3` on white 5.8:1, `--ink-2` on the tints 6.7–7.0:1, `--accent` on `--bg` 5.1:1; dark `--ink-3` on `--bg` 7.5:1.
Gradients always fade a colour to the same colour at zero alpha (never to `transparent`), so no engine blends through grey.

## Type
Onest, variable 300–800, self-hosted (`site/fonts/onest.woff2`, Latin, OFL), preloaded. One family; weight and size carry
the hierarchy. Counts use proportional figures (Onest's tabular `1` is set wide).

| Role | CSS | 360 | 390 | 768 | 1024 | ≥1280 |
|---|---|---|---|---|---|---|
| h1 | `clamp(2.375rem, 1.5rem + 3.9vw, 4.5rem)`, 620, -0.035em, lh 1.03 | 38px | 39px | 54px | 64px | 72px |
| h2 | `clamp(1.75rem, 1.3rem + 1.8vw, 2.625rem)`, 620, -0.03em | 28px | 28px | 35px | 39px | 42px |
| h3 | `clamp(1.3125rem, 1.15rem + .7vw, 1.75rem)`, 620, -0.02em | 21px | 21px | 24px | 25.6px | 27–28px |
| lede | `clamp(1.0625rem, .98rem + .45vw, 1.3125rem)` | 17px | 17.4px | 19.1px | 20.3px | 21px |
| counts | `clamp(1.625rem, 1.2rem + 1.4vw, 2.25rem)`, 600 | 26px | 26px | 30px | 33.5px | 36px |
| body | `clamp(1rem, .96rem + .2vw, 1.0625rem)`, lh 1.6 | 16px | 16px | 16.9px | 17px | 17px |
| small | `.9375rem` labels, `.875rem` chips and meta, `.8125rem` strip project names | | | | | |

## Shape, depth, spacing
- Radii: cards `clamp(20px, 2.4vw, 28px)`, previews 12–14px, strip cards 20px, chips and buttons 999px.
- Depth: long, low, cool shadows with an offset (`0 10px 28px -14px` + `0 30px 60px -36px`), a 1px inner hairline outline;
  hover lifts 3px to the larger shadow. No hard offset shadows, no zero-offset glows.
- Gutter `clamp(16px, 4vw, 40px)`, never less than the safe-area inset; content max 1200px.
- Section rhythm `clamp(56px, 8vw, 112px)` above each section; heading block to content `clamp(22px, 3vw, 36px)`.

## Layout per breakpoint
| Width | Bar | Hero | Projects | Latest strip | Channels | Elsewhere |
|---|---|---|---|---|---|---|
| 360 | brand + theme (nav hidden < 560) | one column: copy, buttons stacked, preview stack (aspect 1.32), counts 2×2 + 1 full row | one column, preview on top | cards 259px (72vw), swipe, snap | one column, 3 thumbs without titles (< 480) | one column |
| 390 | same | same | same | cards 281px | same | same |
| 430 | same | same, headline 3 lines | same | cards 300px | same | same |
| 768 | brand, nav, theme | one column; buttons side by side; stack max 560px centred; counts 3 + 2 (6-col grid, ≥ 600) | 2 columns, Model Reviewer full width with preview on top | 300px cards, nudge buttons with a fine pointer (≥ 760) | one column, thumbs with titles | 2 + 1 |
| 1024 | same | still one column (two columns start at 1100) | Model Reviewer as a row: preview 1.35 : text 1 (≥ 1000); Labs and Games 2 columns | same | 2 columns (≥ 900) | 3 across |
| 1280 | same | two columns 1.08fr : 1fr, copy left, stack right; counts 5 across | same | rail starts at the content edge, bleeds right | same | same |
| 1440 | same | same, content 1200px centred | same | same | same | same |
| 1920 | same | same; aurora scales with the viewport (vmax) | same | same | same | same |

No horizontal page scroll at any width (the strip scrolls inside its own rail). Every link and button is at least 44px
tall (heading links and the inline footer link get padding with a matching negative margin).

## Motion
- Hero entrance: `rise` (opacity, 22px lift, 6px blur → clear), 1.1s `cubic-bezier(.16,1,.3,1)`, staggered 0–0.5s.
- Aurora: three CSS radial pools drift on 26–32s alternate loops, transform only. (A WebGL version rendered grey in
  WebKit, so it is CSS everywhere.)
- Cards ease in once on first view (opacity + 18px). Counts count up once, critically damped.
- Preview loops (`site/media/*.mp4`) play only on wide screens with a mouse, never on save-data.
- `prefers-reduced-motion: reduce` turns all of it off; content is visible without JavaScript. Hover effects sit inside
  `@media (hover: hover)`.

## Content (base: v2 portfolio, commit 862ebe6)
| v2 (862ebe6) | Now |
|---|---|
| Title "MJ Yoke · AI builder" | "mjyoke1111 · AI builder" (handle only, no personal name on the page) |
| Meta description "Everything I build with AI models, in one place: …" | same, verbatim |
| OG text "AI model benchmarks, Jev experiments, 151 AI-made browser games and two YouTube channels, all live." | same, game count from live data |
| Kicker "Building in public" | dropped (no eyebrow labels) |
| h1 "MJ Yoke / AI builder" | brand in the bar; "AI builder" in the title and footer |
| Lede "I hand AI models real briefs and publish what they make. Benchmarks you can open, experiments you can poke, games you can play, all live on the web." | first sentence is the h1, second is the lede, verbatim |
| Stats: 3,122 model runs, 30 models tested, 151 playable games, 15 lab experiments | same four, live at build time, plus videos |
| Hero profile links (X, GitHub, YouTube, Buy me a coffee) | footer icons and the Elsewhere row |
| Projects: Model Reviewer (benchmark copy + runs/models/harnesses/prompts) | same copy and facts, preview + loop |
| Labs (copy, "15 experiments", "runs offline", JevLab sublink) | same copy and facts (live count), links to Labs and JevLab |
| AI Game Studio (copy, "151 games", "3 tiers") | same copy and facts (live) |
| Channels: AI Coding Arena, Dil Mon Music (copy) | same copy, each with its newest 3 videos |
| Elsewhere: X "@MjYoke1111 · daily builds and results", GitHub, Buy me a coffee "keeps the model runs going" | same; GitHub shows the profile (project repos are private) |
| Footer "Numbers as of …" | "Numbers as of …, refreshed every six hours." + link to this page's public source |

Kept from v3: hero counts, preview panels with loops, the latest strip, light/dark toggle, build-time data with snapshot
fallback and link checks. Removed from v3: the raw-results section, the latest-miss card, failure counts, the harness table,
contact-sheet markings, the WebGL light leak.

### Latest strip rules
Only finished, public work: Model Reviewer runs with status `ok` whose run page answers 200 (newest 5), games with status
`playable` (newest 5), published videos (newest 3 per channel). Any item whose title or id matches
`demo|sample|test|dnf|placeholder|wip` (case-insensitive) is dropped; YouTube ids are random, so videos are judged by title.
Model Reviewer items show the prompt title and the model name only; games show the title and model. The same filter runs on
snapshot items, so an older snapshot cannot bring anything back.

## Inspiration
Full notes with measured values: `INSPIRATION.md` (stripe.com, mia-ai.net, linear.app, raycast.com, framer.com, rauno.me,
brittanychiang.com; vercel.com crashed headless Chromium). Borrowed: Stripe's colour-at-the-edge and two-ink headline,
Mia's calm off-white and dark pill action, Raycast's hairline outlines, Framer's large product previews, Linear's spacing.

## Checks before shipping
`node build.mjs`, `node --test test/` (content rules, links, banned strings, weight), the FIX2 visible-text grep, screenshots
at all eight widths in Chromium and WebKit with zero console errors, Lighthouse mobile ≥ 90.
