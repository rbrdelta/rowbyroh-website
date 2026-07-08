# Posture 2 Gap Evaluation — 2026-07-08

Evaluation only — no changes shipped from this doc. Requested by Daniel after the
2026-07-08 schema re-map (`4bebb82`) shipped: how far is the live schema from
**Posture 2 ("Structural")** in the Claude Design exploration
(`rowbyroh Design System` → `stylistic-evolution-compare.html`, dated 01 Jul 2026)?

## What Posture 2 is

The exploration collapses the dial-memo moves into three shippable postures.
P2 = P1 (M1 cards + M2 dash) **plus** M3 density, M4 weight, M6 seams — "the
~55% back toward v1 state, fully realized inside the warm field. Zero new
colors or black blocks." Estimated there at ~3 days effort, medium risk. The
file's own verdict: *ship P2 as the baseline, adopt P3's figure register
(black blocks + forest green + FIG captions) as opt-in on technical pieces only.*

## Orthogonality note (read this first)

The exploration is dated **01 Jul 2026** and speaks the old zone vocabulary
(PORTFOLIO / WRITING / MONO). The 2026-07-08 schema re-map solved a different
axis: **which hue means what** (bodies of work: research oxide, roundtable
walnut, FN ochre) and **how readers move** (series links, /research hub).
P2 is about **object-ness, density, and weight** — how entries and headers are
built. The two compose; almost nothing conflicts. Current state ≈ *P1-adjacent
on structure, with the hue/navigation axis already ahead of anything the
postures considered.*

## Gap by move

| Move | P2 target | Live schema (post-`4bebb82`) | Gap |
|------|-----------|------------------------------|-----|
| **M1 cards** | Index entries as card objects: hairline frame + `bg-light` + 2px zone left border + label line + title | Archive items: 3px full-strength zone border + cream tint, but open rows (bottom hairline only, no frame). Aperture: card-like. **Logbook: flat rows — no cards at all** | **~half.** Archive close in spirit, logbook furthest |
| **M2 dash** | Red `—` prefix on card labels (the "label-gun") | Red dashes exist only as content-page section markers | **Mostly open** |
| **M3 density** | Tightened padding/rhythm on lists and data | Untouched — current spacing is the airy v2 scale | **Open** |
| **M4 weight** | Titles at 800 tight-tracked; standfirst light (300) with one bold lede phrase | Titles 600–700; subtitles uniform 400 muted | **Open** (half-step at best) |
| **M6 seams** | Margin annotations — small italic mono asides ("shipped on the bus home") | Nothing like it anywhere | **Open** |
| *(Specimen 02)* meta strip | Hairline-bracketed uppercase meta: bold date · read-time · tags | Flat one-line post-meta (now series-linked, which P2 didn't have) | **Open**, but ours is semantically richer |
| *(Specimen 03)* warm data block | Bordered block, oxide numerals, dashed row rules, caption strip | Stat strip / inline stats components; no data-block treatment | **Open** |

**Net distance: roughly the full P2 delta still stands — call it 2–3 days of
work — minus the archive-item progress made 2026-07-08.** Today's ship did not
move toward P2 so much as beside it.

## Reconciliations a future P2 adoption must decide

1. **Card label line vs the no-duplication rule.** P2's card label is
   `DATE · ZONE` ("04-19 · WRITING"). IA-SCHEMA §2.1 rule 6 (2026-07-08) bans
   labels that repeat what the title carries — and series titles now name their
   body of work. Resolution that preserves both: card label = **date (+ action)**
   only, zone carried by border/hue as today. Don't reintroduce the word.
2. **Zone vocabulary.** Map P2's three zones onto the five live tokens
   (research/roundtable joined the palette). Mechanical, not conceptual.
3. **Weight scale.** M4's 800-weight titles need checking against IBM Plex Mono
   rendering at card sizes (Plex Mono maxes at 700 — 800 would synthesize;
   either take 700-tight or switch card titles to Plex Sans 800).
4. **Logbook cards.** Biggest visual change of an adoption; also the biggest
   payoff — the exploration calls the index list "the single biggest driver of
   'v2 feels muted'." Today's border/date-color work treated the symptom
   within the flat structure.

## The P3 note worth keeping

P3's figure register (black stat blocks, forest green `#2d6a4f` deltas, FIG
captions) was recommended as an **opt-in register for technical pieces**. The
Model Behavior episodes are exactly that piece — waterfall gates, trial counts,
calibration numbers. If the series keeps growing, P3-as-register on EP pages is
the natural first experiment, and it slots into the bodies-of-work schema as a
*component register inside the research zone*, not a new zone.

## Provenance

- Source: Claude Design project `rowbyroh Design System`
  (`019dd75b-d23f-70e5-a41b-a541a0a5b79b`), file `stylistic-evolution-compare.html`;
  related: `stylistic-dial.html`, `stylistic-dial-v2.html` (the diagnosis memos).
- Compared against: live schema at merge `4bebb82` (IA-SCHEMA §1/§2.1,
  base/style/archive/writing.css, stream/archive/related/research.js).
