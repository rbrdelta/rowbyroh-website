# rowbyroh — UX/UI Kit

Baseline visual language for rowbyroh.com and any future web projects. Signed off 2026-04-01 after 28-version exploration.

## Foundation

### Typography
| Role | Face | Size (desktop) | Size (mobile) | Weight | Line-height |
|------|------|----------------|---------------|--------|-------------|
| Body / Author voice | IBM Plex Sans | 0.9rem (~14.4px) | 0.85rem | 400 | 1.72 |
| Structure / System voice | IBM Plex Mono | 0.78rem | 0.72rem | 400-500 | 1.55 |
| Page title | IBM Plex Mono | 1.3rem | 1.1rem | 700 | 1.3 |
| Section header | IBM Plex Mono | 0.95rem | 0.88rem | 600 | 1.4 |
| Labels / metadata | IBM Plex Mono | 0.65-0.72rem | 0.6-0.68rem | 500 | 1.4 |
| Stats (inline) | IBM Plex Mono | 0.78rem | 0.72rem | 500 | — |

**Rule:** Plex Sans = the author speaking. Plex Mono = the system speaking. This split maps to content type.

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#faf9f6` | Page background (warm off-white, reduces glare) |
| `--bg-light` | `#fefefe` | Quote blocks, highlight containers (lighter = contrast = weight) |
| `--text` | `#1a1a1a` | Primary text |
| `--muted` | `#888` | Labels, metadata, breadcrumbs |
| `--light` | `#d4d2cd` | Borders, dividers |
| `--zone-portfolio` | `#b84233` | Oxide red — portfolio content markers, underlines, chart strokes |
| `--zone-writing` | `#8a7d3c` | Ochre — writing/blog content markers |
| `--zone-mono` | `#555` | Monochrome — dialogue, neutral content |
| `--red-line` | `#e84040` | Notebook margin line / scroll indicator |

### Spacing
| Element | Value |
|---------|-------|
| Body max-width | 620px content inside 760px container |
| Section gap | 3rem |
| Major transition | 3.5-4rem |
| Body paragraph margin | 1rem bottom |
| Page padding | 3.5rem 4rem (desktop), 2rem 1.25rem (mobile) |

### Zone System
Content types carry a consistent color signature across all their elements:
- **Portfolio zone** (oxide red): section numbers, underlines, chart borders/strokes, stat labels, meta comments
- **Writing zone** (ochre): section numbers, underlines, blog date labels, entry borders
- **Dialogue zone** (monochrome): section numbers, underlines, speaker labels, left borders

The zone color appears everywhere the content type appears. Not just one accent hit — reinforced consistently.

## Components

### Quote Block (Single Moment of Impact)
- Background: `--bg-light` (#fefefe) — LIGHTER than page background
- Left border: 3px solid in zone color
- Padding: 1.25rem 1.5rem
- Font: Plex Mono, 1rem, 500 weight
- Attribution: Plex Sans, 0.72rem, muted
- **This is the one element per page that everything settles around.**

### Numbered Section Headers
- Number (01, 02, 03) in zone color, Plex Mono 0.72rem weight 300
- Title in Plex Mono 0.95rem weight 600
- 2px underline in zone color, 3rem wide, below header

### Chart / Diagram
- Bordered container: 1px solid zone color
- Label: Plex Mono 0.6rem uppercase, zone color
- Steps: bordered boxes with arrows
- Description: Plex Sans 0.75rem, muted
- **Charts should have MORE visual presence than quote blocks.**

### Dialogue
- Left border: 1px solid zone-mono
- Speaker: Plex Mono 0.68rem uppercase, tracked, zone-mono color
- Speech: body size

### Blog Entry
- Top border: 2px solid zone-writing
- Date: Plex Mono 0.7rem, zone-writing color
- Title: 0.88rem, weight 600

### Stats (Inline)
- Modest, never focal point
- Number in weight 500, label in zone color
- Flex layout with 1.5rem gap

### Meta Comment
- Plex Mono 0.72rem italic
- Zone color at 60% opacity
- Used sparingly for design commentary or context

### Rubric Bar
- Thin (3px) segmented horizontal bar
- Segments colored by zone
- Label: Plex Mono 0.65rem uppercase, muted

### Scroll Indicator (Red Notebook Line)
- Fixed position, left edge (48px desktop, 16px mobile)
- Double line: 2px + 1px gap 4px
- Ghost track: 8% and 6% opacity
- Active fill: 45% and 30% opacity, tracks scroll position
- Color: --red-line (#e84040)
- **One element, two functions: raw edge + reading progress**

## Principles

1. **Quiet tone wins** — calm, soothing, easy on the eyes. Never loud.
2. **One effective moment per page** — the quote block is the island. Everything settles around it.
3. **Structural clarity through placement, not size** — position and spacing create hierarchy. Not weight, not scale.
4. **Color reinforces content type** — zone colors echo across all elements of that type.
5. **Stats are never the star** — present but modest. The content earns attention, not the numbers.
6. **Every interaction must be functional** — if it doesn't clearly convey useful information, remove it.
7. **Rawness is authentic** — the red notebook line is visceral, rough-edged. It stays.
8. **Contrast gives weight** — a lighter element on a warm background commands attention through difference, not darkness.
9. **Warm background (#faf9f6)** over cool white — reduces glare, improves sustained reading, gives material quality.

## Anti-Patterns (What NOT to Do)

- Oversized stats or type
- Grid/table layouts for the sake of structure
- Interactive hover effects that add no information value
- Dark, heavy, or depressing color schemes
- Extreme scale differences between elements
- Contrived textures (fake paper, squiggly lines, notebook skins)
- Decorative elements that don't earn their place
- Cookie-cutter portfolio conventions without questioning them
