# Voice Fingerprint — rowbyroh content

Canonical in-repo source of truth for the content bar. Gate C (the agentic
voice/content audit) and any CI job read **this file** — not a vault note — so
there is one source. Promoted from the `/draft` skill rubric + the 2026-06-19
voice audit findings + the standing content-feedback memories.

Scope: the writing on content pages (field notes, essays, roundtables) and the
homepage/about prose. Daniel-verbatim prose (his "Me" turns, his essays) is
**never** rewritten — it is the ground truth the fingerprint is derived from.
**Research episodes (type `research`) are governed by the Research-Episode
Register section below, which OVERRIDES "The voice in one paragraph" for those
pages.** Red lines and Criterion 0 apply to every content type.

---

## The voice in one paragraph (field notes / essays / roundtables — NOT research)

Declarative. States facts, doesn't justify them. Domain-fluent — uses business
and technical vocabulary without stopping to define it. Conversational: sounds
like thinking, not writing. Opens with the outcome, closes on a principle stated
flat. Trusts the reader. Not selling.

## Research-Episode Register (type `research` — overrides the paragraph above)

Set 2026-07-07 from the voice analysis Daniel confirmed during Shadow Ledger EP02
("Cost of Verification" — the exemplar). Research episodes are not field notes:
field notes are terse and trust the reader to unpack compression; research
episodes read like Daniel sharing findings with a colleague, with the reasoning
built in front of the reader. **Field-note terseness on a research page is a
FAIL** ("assumes the reader understands the intention behind short descriptors").

1. **Premise first.** The series thesis (human-model interaction; understand →
   influence → anticipate) stated in 1-2 sentences up front, then the episode's
   question and what happened. No withheld reveals, no in-media-res openings.
2. **Plain research headers** (The premise / The experiment design / What we ran /
   The primary learning / Limitations / Up next). Headers are navigation, not mood.
3. **Complete clauses, connectives spelled out** (so / because / which means). No
   fragments, no aphorisms, no engineered punchlines; emphasis comes from explicit
   markers ("the primary learning is…", "one thing to establish up front…").
4. **Confidence marked in-line** (I think / probably / likely / "as I understand
   it now"). Uniform assertion is a fail signal.
5. **Keep Daniel's enumerative doublets/triplets** ("anchors or starting points,"
   "drift or some variance") — triangulation is his precision habit, not padding.
   Keep his operational vocabulary: waterfall, gates, falloff, MECE, calibration,
   knee, sensitivity testing, cost of learning.
6. **Limitations section is mandatory** — state what was NOT established. Never
   overstate a result; a null is a finding.
7. **Endings: short teaser only** (2-3 sentences on what's next), then close flat.
   Do not re-state the thesis ladder as a closing segue — it lives in the premise.
8. **Voice source:** Daniel-verbatim harvest (EP0N-QUOTES.md in the research
   project) is the spine; Claude does structure and connective tissue only, in
   this register.

## Red lines (the audit's confirmed failure modes — all subtractive fixes)

1. **No throat-clearing entrances.** Cut "I want to add…", "I want to address…",
   "Let me give you…", "I am going to disagree…". Start on the point.
2. **No coined slogan-closers.** Don't drop a manufactured twin-slogan after the
   point already landed ("It's not a billing decision. It's a market design
   decision."). When promoting a line forward leaves a slot empty, leave it empty.
3. **No invented "three-of-anything" containers.** Don't repackage prose into a
   forced symmetric triplet (the "three economies" grid) when the real structure
   is a hierarchy. Let unequal things read as unequal.
4. **No repackaging into Claude-coined containers** (columns/buckets/lanes). Use
   Daniel's words verbatim; the contribution is already in the work.
5. **Close flat.** End on a principle, stated plainly — no flourish, no punch-y
   closer added to bump perceived value. Don't add a slogan to fill a beat.
6. **Anti-selling.** No marketing language, no luxury/scarcity framing, no
   stakes-raising. If a cut leaves a slot empty, leave it empty.
7. **Attribute honestly.** When Claude wrote code or built something, say so.
   No passive voice that hides who did what. "Built with Claude" stays.
8. **Criterion 0 (outside-audience pieces).** A stranger with no context can read
   the whole piece and follow it — jargon is framed in-text or cut.

## The 8-dimension rubric (PASS = MEETS or EXCEEDS on all)

| # | Dimension | FAIL signal |
|---|-----------|-------------|
| 1 | **Voice** | Reads like a blog post / talk; marketing language; robotic compression. |
| 2 | **Attribution** | Passive voice hides agency; Claude's work invisible; Daniel as solo builder. |
| 3 | **Values** | Infrastructure dismissed as "plumbing"; tenets absent. (NorthStar tenets.) |
| 4 | **Clarity** | Short but vague; compression cut meaning; reader re-reads. |
| 5 | **Integrity** | Oversimplifies; outcome overstated; caveats omitted. |
| 6 | **Highlight** | Generic; no specific texture; nothing a reader would quote. |
| 7 | **Originality** | Says what everyone already says; no new frame. |
| 8 | **Rhythm** | Monotone; every section same length/weight; reads flat. |

## How Gate C uses this

- Diff-scoped: audit only content pages whose prose changed in the changeset.
- Per piece: score against the 8 dimensions + red lines above.
- Adversarial verify: an independent judge confirms or overturns each FAIL
  (default to "not a real fail" under uncertainty to suppress LLM false positives).
- Advisory until trust is measured — see `tests/gate-c/README.md` for the
  graduated-autonomy plan (advisory → blocking → auto-merge).
