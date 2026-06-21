# Information Architecture — rowbyroh.com

Canonical IA spec. Every page conforms to a **page type**; every type has a
fixed chrome contract; navigation guarantees no dead ends and pulls readers
deeper over time. Gate A (`tests/gate-a.mjs`) enforces the mechanical parts of
this document on every change.

---

## 1. Page types

| Type | Route pattern | Zone color | Type CSS | Examples |
|------|---------------|------------|----------|----------|
| **Home** | `/` | navigation | `style.css` | `index.html` |
| **Archive** | `/archive` | — | `archive.css` | `archive.html` |
| **About** | `/about` | — | (inline) | `about.html` |
| **Colophon** | `/colophon` | system / mono | (inline) | `colophon.html` |
| **Field Note** | `/field-notes/<slug>` | writing (ochre) | `writing.css` | 4 live |
| **Essay** | `/blog/<slug>` | writing (ochre) | `writing.css` | ai-pricing |
| **Roundtable** | `/chair-roundtable/<slug>` | writing (ochre) | `writing.css` + `roundtable.css` | 3-part series |

**Content pages** = Field Note ∪ Essay ∪ Roundtable. These are the consumption
surfaces and share one chrome contract (§3). Home/Archive/About/Colophon are
top-level pages with their own bespoke treatments.

Field notes, essays, and roundtables all sit in the **writing zone (ochre)** —
the design system differentiates them by the **type label**, not color (mirrors
the homepage logbook and the Keep Reading module). Portfolio/analysis types map
to the oxide-red zone but have no live pages today (parked in `drafts/cancelled/`;
they return as Demos, not static pages).

## 2. Data model — `assets/data/content.json`

Single source of truth for what exists and how it surfaces. One entry per live
content page. Required fields (enforced by `tests/content.test.mjs`):

`id, title, type, description, date, tags, url, published, status, events[]`
— optional `featured_for[]`, `highlights[]`.

Consumed by: `stream.js` (homepage aperture + logbook), `archive.js` (archive
list + tag filters), `related.js` (Keep Reading). **Rule: a live content page
that is not registered here is an orphan — Gate A fails the build.**

## 3. Content-page chrome contract

Every content page has, in order:

1. `base.css` + `writing.css` (+ `roundtable.css` for roundtables). No orphan
   inline `<style>` (only About/Colophon may carry supplemental inline blocks).
2. Scroll progress indicator (`scroll.js`).
3. **Breadcrumb** — `rowbyroh / all work` (links `/` and `/archive`). Uniform.
4. `<article>` — the content.
5. **Keep Reading** (`#keep-reading`, `related.js`) — the deep-dive module (§4).
6. `post-footer` — "Built with Claude."
7. **Site footer** — email · discord · github · linkedin · colophon · © .
8. `related.js` + `scroll.js`.

## 4. Navigation model — no dead ends, deeper over time

- **Home** is the navigation surface: aperture (one featured item) + logbook
  (recent activity) + tag filters (`field-notes`, `infrastructure`, `AI`,
  `design`). Filters reshape both sections.
- **Archive** (`/archive`) is the one listing page — every published item,
  filterable by `?tag=`.
- **Up:** every content page's breadcrumb returns to home and archive.
- **Down / sideways:** every content page ends in **Keep Reading**, which always
  offers a path onward:
  1. *next in this series* (roundtable → next episode by date),
  2. related by shared specific tag (e.g. another AI piece),
  3. most recent other content,
  …and always a final **See all work →** link. A reader can never hit a leaf
  with nowhere to go.
- **Redirects** (`vercel.json`): `/writing → /archive`, `/chair-roundtable →`
  first episode, `/drafts/* → 404`.

## 5. What enforces this

| Concern | Enforced by |
|---------|-------------|
| base.css linkage, no orphan styles | Gate A §1 |
| Breadcrumb / Keep Reading / footer present | Gate A §2 |
| Every asset & internal link resolves (no dead ends) | Gate A §3–4 |
| content.json valid + every page registered | Gate A §5, `content.test.mjs` |
| Redirect targets exist | Gate A §6 |
| Keep Reading ranking (series/related/recent) | `related.test.mjs` |
| Rendered nav, filters, redirects, deep-dive click-through | Gate B `nav.spec.mjs` |
| Visual consistency desktop + mobile | Gate B `visual.spec.mjs` |
| Voice/content bar | Gate C + `design/VOICE-FINGERPRINT.md` |

## 6. Adding a content page (checklist)

1. Create the HTML under the right route; use the §3 chrome contract.
2. Add a `content.json` entry (all required fields; an `events` publish date).
3. `npm run gate:a` → `npm test` → `npm run gate:b:update` (new baseline) → `gate:c`.
4. `bash scripts/ship.sh` → review package → Vercel preview → merge to main.
