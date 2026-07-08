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
| **Research hub** | `/research` | research (oxide) | `archive.css` | `research.html` |
| **About** | `/about` | — | (inline) | `about.html` |
| **Colophon** | `/colophon` | system / mono | (inline) | `colophon.html` |
| **Field Note** | `/field-notes/<slug>` | writing (ochre) | `writing.css` | 4 live |
| **Essay** | `/blog/<slug>` | research (oxide) via `series` | `writing.css` | 2 live (model-behavior) |
| **Roundtable** | `/chair-roundtable/<slug>` | roundtable (walnut) | `writing.css` + `roundtable.css` | 3-part series |

**Content pages** = Field Note ∪ Essay ∪ Roundtable. These are the consumption
surfaces and share one chrome contract (§3). Home/Archive/Research/About/Colophon
are top-level pages with their own bespoke treatments (the Research hub is the
archive scoped to one body of work).

**Color follows the body of work.** Research (the `model-behavior` series)
carries the flagship oxide red (`--zone-research`); field notes stay ochre
(`--zone-writing`); roundtables carry walnut (`--zone-roundtable`); system pages
mono. Zone resolution is series-first (`series: "model-behavior"` → research
zone), then type — the `zoneClass` function mirrored across `stream.js` /
`archive.js` / `related.js`. On a content page the body class (`zone-research`,
`zone-roundtable`) re-points `--zone-writing`, so shared components (section
numbers, pull quotes, roster) inherit the page's zone without per-element edits.
Portfolio/analysis types still map to the portfolio token but have no live pages
(parked in `drafts/cancelled/`; they return as Demos, not static pages — and
since research now carries oxide red, returning Demos get their own accent,
decided when they return).

## 2. Data model — `assets/data/content.json`

Single source of truth for what exists and how it surfaces. One entry per live
content page. Required fields (enforced by `tests/content.test.mjs`):

`id, title, type, description, date, tags, url, published, status, events[]`
— optional `featured_for[]`, `highlights[]`, `series`.

Consumed by: `stream.js` (homepage aperture + logbook), `archive.js` (archive
list + tag filters), `related.js` (Keep Reading), `research.js` (`/research`
episode list). **Rule: a live content page that is not registered here is an
orphan — Gate A fails the build.**

### 2.1 Series conventions

Serialized content is marked identically everywhere; the number token style is
part of the series brand:

| `series` (data) | Title pattern | Routes to |
|---|---|---|
| `model-behavior` | `Model Behavior EPnn — <Title>` | `/research` |
| `field-notes` | `Field Note nn — <Title>` | `/archive?tag=field-notes` |
| `chair-roundtable` | `Chair Roundtable nn — <Title>` | `/archive?tag=roundtable` |

Slot rules for every series member:

1. `content.json` `title` = `<Series> <NN> — <Episode title>`. The `description`
   never carries series position ("Part two…" is banned — the number does that
   job).
2. On-page `post-meta` = `<Series NN> · <Month Year>`, series-first, **above**
   the `h1`, with the series label linking to its body of work (table above).
3. `h1` = episode title only. `post-subtitle` = the description.
4. Tab `<title>` = `<Series> <NN> — <Episode title> | rowbyroh` — series-first,
   never reversed.
5. Every member carries the `series` field — `related.js` ranks next-in-series
   from it.

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
  (recent activity, capped at 7 events) + tag filters (`field-notes`,
  `infrastructure`, `AI`, `design`). Filters reshape both sections. The logbook
  always ends with overflow links — `see all work →` (tag-aware) and
  `the research series →`.
- **Archive** (`/archive`) is the one listing page — every published item,
  filterable by `?tag=`.
- **Research hub** (`/research`) is the Model Behavior surface: the working
  thesis + the episode list in series order — the one URL that carries the
  research arc. Every content page's post-meta series label routes laterally to
  its body of work (`/research` or the archive tag routes).
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
2. Add a `content.json` entry (all required fields; an `events` publish date;
   `series` + the §2.1 slot rules if it belongs to a series).
3. `npm run gate:a` → `npm test` → `npm run gate:b:update` (new baseline) → `gate:c`.
4. `bash scripts/ship.sh` → review package → Vercel preview → merge to main.
