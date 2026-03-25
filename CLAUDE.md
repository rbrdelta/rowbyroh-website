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

| Dimension | FAIL | MEETS |
|-----------|------|-------|
| **Hierarchy** | Sections have no clear order of importance. Everything feels the same weight, or one section dominates while others are afterthoughts. | Clear hierarchy of impact and intention. Not equal — proportional. The most important thing reads as most important. |
| **Progression** | Page is flat — same density, same tone, top to bottom. | The page has a rhythm. Sections transition. There's a visual arc that pulls you through. |
| **Anchors** | Blocks of undifferentiated text. Eyes have nowhere to land. | Key numbers, terms, or concepts are visually distinct. But only where the content earns it — don't fabricate anchors for the sake of popping something up. Sometimes quiet is right. |
| **Density** | Information spread thin (one fact per screen) or crammed (wall of text). | Density matches purpose. Lists are tight. Narratives breathe. Content speaks for itself where it can. |
| **Mobile Parity** | Desktop design breaks on mobile. Elements disappear, overflow, or become invisible. | Mobile is intentional, not just smaller. Key information accessible. Red line visible. Nothing cut off. |
| **Identity** | Could be any site. Generic. | Feels like it was made by someone who prototypes with napkins. Organic, not over-designed. No single element defines it — the whole composition does. |

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

| Page | Status |
|------|--------|
| `index.html` | Live — portfolio hub |
| `chair-roundtable.html` | Live — full transcript |
| `obsidian-mcp.html` | Live — narrative + technical deep dive |
| `agentic-stack.html` | Live — system architecture diagram |
| `about.html` | Live — operating tenets, mission (placeholder) |
| `portfolio-analysis.html` | Live — quantitative finance case study |
| `writing.html` | Live — blog index page |
| `blog/reverse-engineering-claude-api.html` | Live — first blog post |
| classifier, research-agent | Pending — "coming soon" |

## Project Data

Portfolio entries are defined in `assets/js/projects.js`, rendered by `assets/js/portfolio.js`.

## Rules

- Take screenshots via PowerShell to verify visual changes (see reference_screenshot_workflow in memory)
- Every element must pass the Earned Placement Rubric (scannability, hierarchy, rhythm, identity). Don't add for decoration. Don't subtract when the problem is monotony.
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New.
- Test at mobile widths before calling it done.
