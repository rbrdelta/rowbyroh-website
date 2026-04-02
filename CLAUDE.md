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
- **Layout:** Unified content stream — portfolio and writing items in a single chronological feed
- **Data:** `assets/data/content.json` — structured content entries with type, tags, descriptions, highlights
- **Rendering:** `assets/js/stream.js` generates stream items from content.json
- **Filtering:** Tag buttons filter across all content types (unified, not section-specific)
- **Styles:** `assets/css/style.css` (homepage-specific) + `assets/css/base.css` (shared design system)
- **Zone differentiation:** Left border color (oxide red for projects, ochre for writing) + background tint for writing items

### Content Pages (Consumption Surfaces)
- **Styles:** `assets/css/base.css` (shared) + page-specific CSS (`project.css`, `writing.css`)
- **Portfolio pages:** Standalone HTML files at root (`obsidian-mcp.html`, `deadweight.html`, etc.)
- **Blog posts:** In `blog/` directory
- **Writing pages:** Root level (`chair-roundtable.html`, `writing.html`)

### Data Files
| File | Purpose | Used by |
|------|---------|---------|
| `assets/data/content.json` | All content entries (projects, essays, roundtables, analyses) | `stream.js` (homepage), `writing.js` (writing index, blog post nav) |

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
| `index.html` | Homepage / Navigation | Live — unified content stream |
| `obsidian-mcp.html` | Portfolio | Live |
| `agentic-stack.html` | Portfolio | Live |
| `portfolio-analysis.html` | Portfolio | Live |
| `deadweight.html` | Portfolio | Live |
| `chair-roundtable.html` | Writing | Live |
| `blog/reverse-engineering-claude-api.html` | Essay | Live |
| `blog/vault-vs-memory.html` | Essay | Live |
| `blog/ai-pricing-market-maker.html` | Essay | Live |
| `about.html` | About | Live |
| `writing.html` | Writing index | Live |

## Known Gaps

- **Writing page navigation:** No route from homepage to writing.html. Unified stream removed the "all posts" link. Needs broader content routing discussion.
- **base.css / style.css overlap:** Homepage style.css overrides some base.css body styles (background, margin lines). May cause visual inconsistency between homepage and content pages. Needs review.

## Rules

- Take screenshots via PowerShell to verify visual changes (see reference_screenshot_workflow in memory)
- Every element must pass the Earned Placement Rubric (scannability, hierarchy, rhythm, identity)
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New
- Test at mobile widths before calling it done
- Commit before every sprint handoff (see Git Branching Model in global CLAUDE.md)
