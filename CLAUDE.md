# rowbyroh.com

Personal portfolio site. Static HTML/CSS on Vercel (auto-deploy from GitHub main).

## Design System — C2-Refined (Zoned Warmth + Raw Edge)

Converged from 28-version exploration (archived as `v2-exploration` tag). Full spec in `exploration/UI-KIT.md` (on the archived tag).

- **Shared foundation:** `assets/css/base.css` — CSS variables, zone colors, typography, warm concrete background (#faf9f6), red notebook margin lines. All content pages link this.
- **Fonts:** IBM Plex Sans (author voice — body text, orientation), IBM Plex Mono (system voice — titles, code, metadata)
- **Zone colors:** Portfolio = oxide red (#b84233), Writing = ochre (#8a7d3c), System = mono (#555)
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
- **Styles:** `assets/css/base.css` (shared) + page-specific CSS (`project.css`, `writing.css`)
- **Portfolio pages:** Standalone HTML files at root (`obsidian-mcp.html`, `deadweight.html`, etc.)
- **Blog posts:** In `blog/` directory
- **Writing pages:** Root level (`chair-roundtable.html`)
- **All breadcrumbs** point to `/` (homepage). No sub-section index pages — `/archive` is the only listing page.

### Data Files
| File | Purpose | Used by |
|------|---------|---------|
| `assets/data/content.json` | All content entries with `featured_for`, `events`, tags, descriptions | `stream.js` (homepage), `archive.js` (archive page), `writing.js` (blog post prev/next nav) |

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

| Page | Type | Status |
|------|------|--------|
| `index.html` | Homepage / Navigation | Live — aperture + logbook |
| `archive.html` | Archive / All Work | Live |
| `obsidian-mcp.html` | Portfolio | Live |
| `agentic-stack.html` | Portfolio | Live |
| `portfolio-analysis.html` | Portfolio | Live |
| `deadweight.html` | Portfolio | Live |
| `chair-roundtable.html` | Writing | Live |
| `blog/reverse-engineering-claude-api.html` | Essay | Live |
| `blog/vault-vs-memory.html` | Essay | Live |
| `blog/ai-pricing-market-maker.html` | Essay | Live |
| `about.html` | About | Live |

## Navigation Model

- **One listing page:** `/archive` — all published content, filterable by tag
- **`/writing` redirects to `/archive`** (301 in vercel.json)
- **All breadcrumbs** point to `/` (homepage) — no sub-section indexes
- **Blog post footers** link to `/archive` ("All work")
- **Homepage "all work"** links to `/archive`

## QA Verification

Run `./scripts/verify.sh` after every push. Checks: all pages 200, title fingerprints match source, deploy commit matches main, content.json URLs, external links, clean working tree.

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
- Take screenshots via PowerShell to verify visual changes (see reference_screenshot_workflow in memory)
- Every element must pass the Earned Placement Rubric (scannability, hierarchy, rhythm, identity)
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New
- Test at mobile widths before calling it done
- Commit before every sprint handoff (see Git Branching Model in global CLAUDE.md)
