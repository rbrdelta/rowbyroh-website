# rowbyroh.com

Personal portfolio site. Static HTML/CSS on Vercel (auto-deploy from GitHub main).

## Design System

- **Font:** IBM Plex Mono (body, content), IBM Plex Sans (structural labels only)
- **Weights:** 700 title, 600 project names, 500 labels, 400 body
- **Color:** All text in #1a1a1a. Labels/metadata in #555 or #888. Red (#e84040) as sole accent, used structurally.
- **Aesthetic:** "Back of the napkin to real life." Prototype with anything, keep improving, don't be precious. The feeling is that things were scribbled on there or placed organically — not designed within an inch of their life.
- **CSS:** Vanilla only. No frameworks, no Tailwind, no preprocessors.

## Site Design Rubric

Page-level evaluation. Every page and section should be checked against these before shipping.

### Proportionality Model

Proportionality is not just sizing. Seven signals determine how important a section *feels*:

| Signal | What it controls | Example imbalance |
|--------|-----------------|-------------------|
| **Space** | Vertical/horizontal footprint | One section is 5x taller than its peer |
| **Style** | Background, borders, containers | One section has a gray box + border; its peer has nothing |
| **Contrast** | Font size, weight, color | 1.2rem bold vs 0.82rem regular — reads as parent/child, not peers |
| **Interaction** | Hover states, filters, clickable elements | One section has tag filters + tooltips + hover; its peer is static text |
| **Scannability** | Grid vs list vs paragraph; density | Grid of 7 items in 3 columns vs a single line |
| **Boundaries** | Whether the section breaks the content frame (e.g., extends past the red line) | Breaking the frame = "I'm primary." Staying within = "I'm secondary." Peer sections must share the same spatial claim. |
| **Furniture** | Metadata, colophons, labels, decorative elements inside the section | Extra elements add visual mass even when they're not content |

**The test:** For any two sections at the same hierarchy level, compare across all seven signals. If one section dominates on 4+ signals, they are not proportional — regardless of whether their heights are similar.

**Header budget:** The header (title + subtitle + nav) should be the loudest element on first load but occupy no more than 15-20% of the visible page. Loud = weight + position, not size. If the header dominates the viewport, shrink it.

**Section tiers:**
- **Primary** (Portfolio, Writing): Break the content frame. Comparable style weight. A visitor identifies both within 3 seconds of scrolling. Each has its own material identity (Portfolio = gallery frame on neutral, Writing = legal pad yellow).
- **Tertiary** (Connect, copyright): Contained within the frame. Clearly lighter. No competition with primary sections.

**Navigation controls** (tag filters, search): These are site-level tools, not section features. If a filter system exists, it should govern all primary content, not privilege one section. (Current: tags are Portfolio-only. Future: unified tag system above both sections.)

### Dimension Checklist

| Dimension | FAIL | MEETS | EXCEEDS |
|-----------|------|-------|---------|
| **Hierarchy** | One section dominates on 4+ proportionality signals vs its peer. Primary sections aren't identifiable within 3 seconds of scrolling. A section that should be tertiary competes visually with primary content. | Clear tier separation. Primary sections share comparable weight across all 7 signals — not identical treatment, but equivalent presence. Tertiary sections are obviously lighter. | — |
| **Progression** | Page is flat — same density, same tone, top to bottom. | The page has a rhythm. Sections transition. There's a visual arc that pulls you through. | — |
| **Anchors** | Blocks of undifferentiated text. Eyes have nowhere to land. | Key numbers, terms, or concepts are visually distinct. But only where the content earns it — don't fabricate anchors for the sake of popping something up. Sometimes quiet is right. When selecting content for pull quotes or callouts, defer to the /draft rubric's Highlight dimension — elevate what's specific and load-bearing, not what sounds good. | — |
| **Density** | Information spread thin (one fact per screen) or crammed (wall of text). | Density matches purpose. Lists are tight. Narratives breathe. Content speaks for itself where it can. | — |
| **Mobile Parity** | Desktop design breaks on mobile. Elements disappear, overflow, or become invisible. | Mobile is intentional, not just smaller. Key information accessible. Red line visible. Nothing cut off. | — |
| **Identity** | Could be any site. Generic. | Feels like it was made by someone who prototypes with napkins. Organic, not over-designed. No single element defines it — the whole composition does. | — |
| **Break Convention** | Follows UX best practices by default, even when it produces a generic result. Defaults to safe, predictable patterns. | Identifies and follows conventions that serve the goal. | Intentionally breaks a convention to achieve something the convention couldn't. The break is purposeful and earns its place — it's not random, it's a discovery. Test boundaries. If it accomplishes what we want in a way a cookie-cutter solution couldn't, it exceeds. |

## Standalone Page Template

One template, interchangeable elements. Every project page draws from the same vocabulary — composed per page based on what the content needs.

**Available elements:**
- **Stat callouts** — key numbers in a horizontal strip (weight 600, spaced). Use when the project has quantitative impact.
- **Section markers** — red dash before h2s (matches portfolio item pattern). Standard on all pages.
- **Pull quotes** — key sentences lifted into larger type. Use when a single line captures the insight.
- **Flow diagrams** — ASCII or simple SVG showing how a system works. Use when architecture matters.
- **Code blocks** — for technical projects. Already styled.

Not every page uses every element. A quantitative project leans on stat callouts. A narrative project leans on pull quotes. The toolkit is shared; the composition varies.

## Interaction Pattern

- Hover on portfolio item: shows annotation text
- Click: tooltip with 1-line about + 2-3 bullet highlights + link to standalone page
- Second click or "Read more": navigates to standalone page
- Mobile: tap goes straight to standalone page
- Every project gets the same treatment. No type-based routing.

## Pages

| Page | Section | Status |
|------|---------|--------|
| `index.html` | — | Live — portfolio hub |
| `obsidian-mcp.html` | Portfolio | Live — narrative + technical deep dive |
| `agentic-stack.html` | Portfolio | Live — system architecture diagram |
| `portfolio-analysis.html` | Portfolio | Live — quantitative finance case study |
| `deadweight.html` | Portfolio | Live — freight audit tool (moved from blog) |
| `chair-roundtable.html` | Writing | Live — Session 1 dialogue (moved from portfolio) |
| `blog/reverse-engineering-claude-api.html` | Writing | Live — rewrite planned (deeper AI collab) |
| `blog/vault-vs-memory.html` | Writing | Live |
| `blog/ai-pricing-market-maker.html` | Writing | Live |
| `blog/deadweight.html` | — | Redirect to /deadweight.html |
| `about.html` | — | Live — operating tenets, mission |
| `writing.html` | — | Live — blog index page |

## Project Data

Portfolio entries are defined in `assets/js/projects.js`, rendered by `assets/js/portfolio.js`.

## Rules

- Take screenshots via PowerShell to verify visual changes (see reference_screenshot_workflow in memory)
- Every element must pass the Earned Placement Rubric (scannability, hierarchy, rhythm, identity). Don't add for decoration. Don't subtract when the problem is monotony.
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New.
- Test at mobile widths before calling it done.
