# rowbyroh.com

Personal portfolio site. Static HTML/CSS on Vercel (auto-deploy from GitHub main).

## Design System

- **Font:** IBM Plex Mono (body, content), IBM Plex Sans (structural labels only)
- **Weights:** 700 title, 600 project names, 500 labels, 400 body
- **Color:** All text in #1a1a1a. Labels/metadata in #555 or #888. Never use color for text differentiation — use weight, size, and spacing.
- **Aesthetic:** Legal pad — monospace, minimal, typographic. Red margin line, scattered decorative rules, slight rotations on elements.
- **CSS:** Vanilla only. No frameworks, no Tailwind, no preprocessors.

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
| classifier, research-agent, blog | Pending — "coming soon" |

## Project Data

Portfolio entries are defined in `assets/js/projects.js`, rendered by `assets/js/portfolio.js`.

## Rules

- Take screenshots via PowerShell to verify visual changes (see reference_screenshot_workflow in memory)
- Never add decorative complexity. Every element earns its place.
- IBM Plex Mono 500+ for anything that needs to read clearly — never Courier New.
- Test at mobile widths before calling it done.
