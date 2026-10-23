# Inspiration (FIX2 redesign, 2026-10-23)

Looked at in headless Chromium at 1440x900, hero plus one scrolled section each. Values are computed styles read off the live pages.

| Site | Ground / ink | Type | Shape | What it does well |
|---|---|---|---|---|
| stripe.com | `#ffffff` / navy headline ink (as rendered), accents `#533afd` `#7f7dfc`, pale `#e5edf5` `#f8fafd` | Söhne 300 at 48px, -0.02em; one long sentence, second half in a softer ink | 4–8px radii, 1px hairline grid | A ribbon of soft colour on white; the headline does the work, colour stays at the edge |
| mia-ai.net | `#f8f4ef` / `#1d1a17`, surface `#fffdfa` | Geist body, Instrument Serif display ~107px | 999px pills, 14–22px cards | Calm off-white, soft glow behind the hero, one dark pill CTA |
| linear.app | `#08090a` / `#f7f8f8`, surface `#0f1011` | Inter Variable 510 at 64px, -0.022em | 8–12px, 9999px pills | Headline in two inks (bright lead, muted tail); generous gaps between sections |
| raycast.com | `#07080a` / `#ffffff`, `rgba(255,255,255,.05)` tiles | Inter 600 at 64px | 8–20px, lots of 11–12px | Soft inner borders on tiles instead of heavy shadows |
| framer.com | `#000` / `#fff`, accent `#0099ff` | GT Walsheim 500 at 54px, -0.04em | 8px and 15px, 100px pills | Big product previews carry the page; copy stays short |
| rauno.me | `#ededed` / `#171717`, white panels | system grotesk 500, 32px | 12px panels | A portfolio that is almost only type on a soft grey; quiet, confident |
| brittanychiang.com | `#0f172a` / `#94a3b8`, teal `rgba(45,212,191,.1)` chips | Inter 700 at 48px | 9999px chips | Clear project list: title, one line, chips |
| vercel.com | (headless Chromium crashed on load, three tries; not captured) | | | |

## What I borrow
- **Ground and depth:** a soft off-white ground (`#f7f7f4`), white surfaces lifted by long, low, cool shadows (Stripe, Mia), 1px inner hairlines instead of borders (Raycast).
- **Colour:** pastel only at the edges, like Stripe's ribbon: a slow, low-saturation aurora of mint `#bfeedd`, sky `#c4e2fb` and lavender `#ddd3fb` behind the hero. Text and controls stay ink. One deeper accent for links and focus (`#0f766e` light / `#7fe0c8` dark).
- **Type:** one modern variable grotesk (Onest, self-hosted, 300–800), headline set large with tight but not crushed tracking (-0.03em), second clause in a softer ink (Linear, Stripe). Fluid `clamp()` sizes throughout.
- **Shape:** 20–28px radius on project panels, 14px on media, pills for chips and the primary button (Mia, Framer).
- **Layout:** big live previews lead each project (Framer); short copy, numbers in a calm row; wide gaps between sections (Linear).

## What I leave
Dark-first grounds, neon accents, gradient text, glass as decoration, serif display faces, logo walls.
