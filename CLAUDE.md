# rowbyroh.com

Personal portfolio site. Static HTML/CSS on Vercel (auto-deploy from GitHub main).

## Design System — C2-Refined (Zoned Warmth + Raw Edge)

Converged from 28-version exploration (archived as `v2-exploration` tag). **Canonical spec lives in `design/`** — `design/DESIGN-SYSTEM.md` (overview), `design/UI-KIT.md` (full language), `design/screenshots/` (live page captures), `design/capture-screenshots.js` (refresh tool).

- **Shared foundation:** `assets/css/base.css` — CSS variables, zone colors, typography, warm concrete background (#faf9f6), red notebook margin lines. All content pages link this.
- **Fonts:** IBM Plex Sans (author voice — body text, orientation), IBM Plex Mono (system voice — titles, code, metadata)
- **Zone colors:** color follows the body of work — Research (model-behavior series) = oxide red (#b84233), Writing/field notes = ochre (#8a7d3c), Roundtable = walnut (#6e4523), Portfolio (parked, returns as Demos) = oxide red, System = mono (#555). Zone resolution is series-first, then type (`zoneClass` in stream/archive/related.js); content pages re-point `--zone-writing` via body class (`zone-research`, `zone-roundtable`).
- **Color:** All text in #1a1a1a. Labels/metadata in #555 or #888. Red (#e84040) as sole accent, used structurally (margin lines, section dashes, scroll indicator).
- **Aesthetic:** "Back of the napkin to real life." Organic, not over-designed. Raw edge (body border on homepage).
- **CSS:** Vanilla only. No frameworks, no Tailwind, no preprocessors.
- **Scroll indicator:** Red notebook double-line progress bar (`assets/js/scroll.js`). Used on content pages and homepage.

## Architecture

### Homepage (Navigation Surface)
- **Layout:** Aperture (one featured item) + Logbook (7 recent activity events) + closing gesture
- **Data:** `assets/data/content.json` — content entries with `featured_for` (tag-based featuring) and `events` (activity log)
- **Rendering:** `assets/js/stream.js` renders aperture + logbook from content.json
- **Filtering:** Tag buttons reshape both sections — swap aperture to best match, filter logbook, update "all work" link
- **Styles:** `assets/css/style.css` (homepage-specific) + `assets/css/base.css` (shared design system)
- **Zone differentiation:** Left border color (oxide red for projects, ochre for writing) + background tint for writing items
- **Archive page:** `archive.html` shows all published items, supports `?tag=` URL param filtering

### Content Pages (Consumption Surfaces)
- **Styles:** `assets/css/base.css` (shared) + `writing.css` (+ `roundtable.css` for roundtables)
- **Field Notes:** `field-notes/` directory · **Essays:** `blog/` · **Roundtables:** `chair-roundtable/` (serialized)
- **Chrome contract (every content page):** breadcrumb `rowbyroh / all work` → `<article>` → **Keep Reading** module → "Built with Claude" → site footer. Enforced by Gate A. Full spec in `design/IA-SCHEMA.md`.
- **No dead ends:** every content page ends in `#keep-reading` (`related.js`) — next-in-series + related + recent + "See all work". Breadcrumb goes up; Keep Reading goes deeper.

### Data Files
| File | Purpose | Used by |
|------|---------|---------|
| `assets/data/content.json` | All content entries with `featured_for`, `events`, `series`, tags, descriptions, highlights | `stream.js` (homepage), `archive.js` (archive page), `related.js` (Keep Reading deep-dive module), `research.js` (/research episode list) |

> `writing.js` is retired from live pages — the type-limited `#post-nav` prev/next was superseded by the unified `related.js` Keep Reading module (covers all content types).

## Site Design Rubric

Page-level evaluation. Every page and section should be checked against these before shipping.

### Proportionality Model

Seven signals determine how important a section *feels*:

| Signal | What it controls |
|--------|-----------------|
| **Space** | Vertical/horizontal footprint |
| **Style** | Background, borders, containers |
| **Contrast** | Font size, weight, color |
| **Interaction** | Hover states, filters, clickable elements |
| **Scannability** | Grid vs list vs paragraph; density |
| **Boundaries** | Whether the section breaks the content frame |
| **Furniture** | Metadata, colophons, labels, decorative elements |

**The test:** For any two sections at the same hierarchy level, compare across all seven signals. If one section dominates on 4+ signals, they are not proportional.

**Header budget:** 15-20% of visible page. Loud = weight + position, not size.

### Dimension Checklist

| Dimension | FAIL | MEETS |
|-----------|------|-------|
| **Hierarchy** | One section dominates on 4+ signals vs its peer. | Clear tier separation. Tertiary sections obviously lighter. |
| **Progression** | Page is flat — same density top to bottom. | Visual arc pulls you through. |
| **Anchors** | Undifferentiated text. Eyes have nowhere to land. | Key elements visually distinct where content earns it. |
| **Density** | Information spread thin or crammed. | Density matches purpose. |
| **Mobile Parity** | Desktop design breaks on mobile. | Mobile is intentional, not just smaller. |
| **Identity** | Could be any site. | Feels organic, prototyped-on-napkins. |
| **Break Convention** | Defaults to safe patterns. | Intentionally breaks conventions that earned their place. |

## Standalone Page Template

Shared vocabulary, composed per page:
- **Stat callouts** — key numbers in horizontal strip (weight 600)
- **Section markers** — red dash before h2s
- **Pull quotes** — key sentences in larger type
- **Flow diagrams** — ASCII or simple SVG
- **Code blocks** — already styled

## Pages

> **Canonical IA lives in `design/IA-SCHEMA.md`.** This table is the live-page index.

| Page | Type | Status |
|------|------|--------|
| `index.html` | Homepage / Navigation | Live — aperture + logbook |
| `archive.html` | Archive / All Work | Live |
| `research.html` | Research hub (Model Behavior) | Live — thesis + episode list |
| `about.html` | About | Live |
| `colophon.html` | Colophon / System | Live |
| `field-notes/conversation-sync.html` | Field Note 01 | Live |
| `field-notes/headless-parity.html` | Field Note 02 | Live |
| `field-notes/batch-approval.html` | Field Note 05 | Live |
| `field-notes/memory-and-the-live-channel.html` | Field Note 07 | Live |
| `blog/an-earned-null.html` | Essay (Model Behavior EP01) | Live |
| `blog/cost-of-verification.html` | Essay (Model Behavior EP02) | Live |
| `chair-roundtable/ergonomic-intent.html` | Chair Roundtable 01 | Live |
| `chair-roundtable/material-values.html` | Chair Roundtable 02 | Live |
| `chair-roundtable/build-process.html` | Chair Roundtable 03 | Live |

**Cancelled (in `drafts/cancelled/`, rewritten to `/404`, NOT live):** `obsidian-mcp`,
`agentic-stack`, `portfolio-analysis`, `deadweight` (portfolio — return as Demos),
`blog/reverse-engineering-claude-api`, `blog/vault-vs-memory` (essays), and
`blog/ai-pricing-market-maker` (parked for Daniel's rewrite — stays registered
in content.json as `published: false`; verify.sh asserts its URL stays dark).
The content model is About / Field Notes / Essays / Roundtables; portfolio
pieces return as interactive Demos, not static pages.

## Navigation Model

Full spec: `design/IA-SCHEMA.md`. Summary:
- **One listing page:** `/archive` — all published content, filterable by tag
- **Breadcrumb (every content page):** `rowbyroh / all work` → `/` and `/archive`
- **Keep Reading (every content page):** `#keep-reading` deep-dive module — next-in-series, related-by-tag, recent, and "See all work". No leaf is a dead end.
- **Redirects (`vercel.json`):** `/writing → /archive`, `/chair-roundtable →` first episode, `/drafts/* → 404`
- **Homepage tag filters:** `field-notes`, `infrastructure`, `AI`, `design`

## Testing — the Ship Gate

Run the full suite before any push: **`npm run ship`** (or `bash scripts/ship.sh`).
The only human step is the final review-to-push decision on the printed package.

| Gate | Command | Checks |
|------|---------|--------|
| **0 — Unit** | `npm test` | `related.js` ranking logic + `content.json` schema (`tests/*.test.mjs`) |
| **A — Structural** | `npm run gate:a` | base.css linkage, asset/link resolution, no dead ends, content.json reachability, redirects, titles (`tests/gate-a.mjs`) — pre-deploy, local |
| **B — Visual + e2e** | `npm run gate:b` | Playwright regression vs `tests/gate-b/__snapshots__` + nav/filter/redirect/deep-dive specs (desktop + mobile). Also runs in CI (`.github/workflows/ship-gate.yml`) |
| **C — Voice/content** | `npm run gate:c` | Diff-scoped voice-fingerprint audit (advisory). Fingerprint: `design/VOICE-FINGERPRINT.md`. Runner + Workflow in `tests/gate-c/` |

New baselines after intentional visual changes: `npm run gate:b:update`.

## QA Verification (post-deploy)

After the push lands, run `./scripts/verify.sh` (or `npm run verify`) — checks the
**live** site: all pages 200, title fingerprints, deploy commit matches main,
content.json URLs, external links, clean working tree. (Gates A/B/C are
pre-deploy; verify.sh is post-deploy.)

## Known Gaps

- **Phase D pending:** SVG diagram sprints (D1-D4). Sprint script at `~/.claude/hooks/sprint-d1.sh`. Full spec in vault note `rowbyroh — Homepage Redesign Plan (Aperture + Logbook)`.

## Versioning

Simple integer versions (v1, v2, v3...). Each version is a git tag on main.

**What triggers a new version:** Structural changes — navigation model, page architecture, data model, design system overhaul. If the site *works differently*, it's a new version.

**What does NOT trigger a new version:** Content additions, copy edits, CSS tweaks, mobile fixes, new blog posts. These are just commits on main.

**Before shipping a structural change to main:** Tag the current prod state as `vN` and push the tag. Then merge/commit the new work, which becomes the next version candidate.

| Tag | What | Date |
|-----|------|------|
| `v1.0` / `v1` branch | Original site — gallery frame + legal pad | 2026-03-28 |
| `v2-exploration` | Design exploration artifact (not a release) | 2026-04-02 |
| `v2` | C2-Refined design system + unified content stream | 2026-04-02 |

## Rules

- **Archive before overwrite:** Before any structural change ships to main, tag current prod as `vN` and push the tag
- **Refresh design screenshots after visible changes:** `node design/capture-screenshots.js` (or `BASE=http://localhost:3000 node ...` for local). Keeps `design/screenshots/` current as the visual reference.
- Take ad-hoc verification screenshots via Playwright headless (see `feedback_playwright_verification` memory)
- Every element must pass the Earned Placement Rubric (scannability, hierarchy, rhythm, identity)
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New
- Test at mobile widths before calling it done
- Commit before every sprint handoff (see Git Branching Model in global CLAUDE.md)
