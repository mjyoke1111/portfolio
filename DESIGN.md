# Design: the contact sheet

A photographer's contact sheet prints every frame on the roll; the picks get a china-marker loop, the misses get crossed
out, nothing is cut. That is the site's promise (every raw output published, failures included), so it is the page's world.

## Materials
- Ground: proof paper in light (`--paper #f2f3f1`, cool, never cream), darkroom in dark (`#121211`). System theme by default,
  toggle remembered in localStorage.
- Film: frames sit in black rebate (`--film`) with sprocket holes and edge print in film amber (`--edge #e7a43a`).
  The film is black in both themes; it is a physical object.
- China marker: `--mark` (`#c8261a` light / `#ff5e48` dark). Used only for the pick loop, the miss cross, the one accent
  word in the hero, hover and focus. Never decoration.
- Light leak: the hero's WebGL shader burns amber and red into the top right corner, with grain. CSS gradient fallback.

## Type
- Archivo variable, self-hosted, weight 100–900 and width 62–125. Display and numerals run condensed (`font-stretch` 64–80%),
  body runs at 100%.
- Monospace (system stack) only for edge print and raw error notes: data, not costume.
- No eyebrow labels above headings; headings carry themselves.

## Layout
- 12-column contact sheet at ≥1040px: Model Reviewer full width (frame + facts), then zigzag rows 7/5, 5/7, 7/5.
  2 columns at ≥700px, one column below.
- Latest is a horizontal film strip (scroll-snap) on every size, with nudge buttons on wide screens with a mouse.

## Motion
- One authored moment: frames develop as they arrive (a pale wash fades off the print while the frame settles in; opacity and
  transform only). Counts settle onto their values. Hover/focus draws the china-marker loop around a frame number.
- Everything is off under prefers-reduced-motion; loops never autoplay on phones or save-data.
