# rowbyroh.com — Design System Overview

Extracted from `~/projects/active/web/rowbyroh-website/CLAUDE.md` (2026-04-28).
For full design language spec, see `UI-KIT.md` in this folder.

---

## Identity — C2-Refined (Zoned Warmth + Raw Edge)

Converged from a 28-version exploration (archived as `v2-exploration` tag in the website repo).

- **Aesthetic:** "Back of the napkin to real life." Organic, not over-designed. Raw edge (body border on homepage).
- **Foundation file:** `assets/css/base.css` — CSS variables, zone colors, typography, warm concrete background, red notebook margin lines.
- **Stack:** Vanilla CSS only. No frameworks, no Tailwind, no preprocessors.

## Type

- **IBM Plex Sans** — author voice. Body text, orientation.
- **IBM Plex Mono** — system voice. Titles, code, metadata, labels.
- **Rule:** IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New.

## Color

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#faf9f6` | Warm concrete page background |
| Body text | `#1a1a1a` | All primary text |
| Label / metadata | `#555` or `#888` | Secondary text |
| Accent red | `#e84040` | Sole accent — margin lines, section dashes, scroll indicator |

### Zone Colors

The site has three content zones, each with its own structural color:

| Zone | Color | Hex | Used on |
|------|-------|-----|---------|
| Portfolio | Oxide red | `#b84233` | Project pages, project cards |
| Writing | Ochre | `#8a7d3c` | Essays, blog posts |
| System | Mono grey | `#555` | About, infrastructure pages |

Zones surface as left border colors and (for writing) background tints.

## Structural Furniture

- **Red notebook margin lines** — left side of content pages
- **Red double-line scroll indicator** — top of viewport, progress bar
- **Section markers** — red dash before `h2`s
- **Stat callouts** — horizontal strip, weight 600
- **Pull quotes** — larger type for key sentences
- **Flow diagrams** — ASCII or simple SVG, no heavy graphics

## Architecture

### Homepage (Navigation Surface)
- **Aperture + Logbook + closing gesture** — one featured item up top, 7 recent activity events, sign-off line
- Tag filtering reshapes both sections (swaps aperture, filters logbook)
- Zone differentiation via left border color + writing background tint

### Content Pages (Consumption Surfaces)
- Standalone HTML files at root (`obsidian-mcp.html`, `deadweight.html`, etc.)
- Blog posts in `/blog/`
- All breadcrumbs point to `/` — no sub-section indexes
- `/archive` is the only listing page (filterable by tag)

## Site Design Rubric

Every page and section is evaluated before shipping.

### Proportionality Model — Seven Signals

How important a section *feels*:

| Signal | What it controls |
|--------|-----------------|
| Space | Vertical/horizontal footprint |
| Style | Background, borders, containers |
| Contrast | Font size, weight, color |
| Interaction | Hover states, filters, clickable elements |
| Scannability | Grid vs list vs paragraph; density |
| Boundaries | Whether the section breaks the content frame |
| Furniture | Metadata, colophons, labels, decorative elements |

**The test:** For any two sections at the same hierarchy level, compare across all seven signals. If one section dominates on 4+ signals, they are not proportional.

**Header budget:** 15-20% of visible page. Loud = weight + position, not size.

### Dimension Checklist

| Dimension | FAIL | MEETS |
|-----------|------|-------|
| Hierarchy | One section dominates on 4+ signals vs its peer | Clear tier separation. Tertiary sections obviously lighter |
| Progression | Page is flat — same density top to bottom | Visual arc pulls you through |
| Anchors | Undifferentiated text. Eyes have nowhere to land | Key elements visually distinct where content earns it |
| Density | Information spread thin or crammed | Density matches purpose |
| Mobile Parity | Desktop design breaks on mobile | Mobile is intentional, not just smaller |
| Identity | Could be any site | Feels organic, prototyped-on-napkins |
| Break Convention | Defaults to safe patterns | Intentionally breaks conventions that earned their place |

## Standalone Page Vocabulary

Composed per page:
- Stat callouts (key numbers, weight 600)
- Section markers (red dash before h2)
- Pull quotes (larger type for key sentences)
- Flow diagrams (ASCII or simple SVG)
- Code blocks (already styled)

## Versioning

| Tag | What | Date |
|-----|------|------|
| `v1.0` | Original site — gallery frame + legal pad | 2026-03-28 |
| `v2-exploration` | Design exploration artifact (28 versions, not a release) | 2026-04-02 |
| `v2` | C2-Refined design system + unified content stream | 2026-04-02 |

Structural changes (nav model, page architecture, design system overhaul) trigger a new version. Copy/CSS tweaks do not.
