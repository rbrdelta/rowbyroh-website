# Design System

Canonical design reference for rowbyroh.com. Live in the working tree so it's discoverable — not archived to a tag.

## Contents

| File / folder | What it is |
|---------------|------------|
| `DESIGN-SYSTEM.md` | High-level summary. Identity, type, color, zones, page rubric. **Start here.** |
| `UI-KIT.md` | Full design language spec. Signed off 2026-04-01 after the 28-version exploration. |
| `screenshots/v2/` | Current site captures — every published page, desktop (1440×900) + mobile (390×844), 2× DPR. |
| `screenshots/v1/` | Frozen snapshot of the v1 site (gallery frame + legal pad, Mar 2026). For evolution reference only — never re-captured. |
| `capture-screenshots.js` | Playwright script that regenerates `screenshots/v2/` against `https://rowbyroh.com` (or any `BASE` env override). |

## Refreshing screenshots

After any visible design change, refresh the captures:

```bash
node design/capture-screenshots.js
```

Or against a local dev server:

```bash
BASE=http://localhost:3000 node design/capture-screenshots.js
```

Requires Playwright (`npm install playwright && npx playwright install chromium`).

## Source of truth

The spec in `DESIGN-SYSTEM.md` and `UI-KIT.md` is what we *intend*. The CSS in `assets/css/` is what actually ships. If they disagree, fix the CSS or update the spec — don't let them drift.

## Version history

| Tag | Identity | Snapshot |
|-----|----------|----------|
| `v1.0` (Mar 28, 2026) | Gallery frame + legal pad — gray gallery container for portfolio, yellow legal-pad tint for writing, separate Portfolio/Writing sections. | `screenshots/v1/` |
| `v2` (Apr 2, 2026) | Zoned warmth + raw edge — aperture + logbook, oxide red / ochre / mono zones, red notebook margin lines. Current. | `screenshots/v2/` |

## Exploration archive

The 28-version exploration that produced this spec is preserved on the `v2-exploration` git tag. To browse:

```bash
git checkout v2-exploration
# explore exploration/ folder (gallery at exploration/index.html)
git checkout main
```

Or extract without checkout:

```bash
git archive v2-exploration exploration/ | tar -x -C /tmp/exploration-archive
```
