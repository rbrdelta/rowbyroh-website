# Voice Fingerprint — rowbyroh content

Canonical in-repo source of truth for the content bar. Gate C (the agentic
voice/content audit) and any CI job read **this file** — not a vault note — so
there is one source. Promoted from the `/draft` skill rubric + the 2026-06-19
voice audit findings + the standing content-feedback memories.

Scope: the writing on content pages (field notes, essays, roundtables) and the
homepage/about prose. Daniel-verbatim prose (his "Me" turns, his essays) is
**never** rewritten — it is the ground truth the fingerprint is derived from.

---

## The voice in one paragraph

Declarative. States facts, doesn't justify them. Domain-fluent — uses business
and technical vocabulary without stopping to define it. Conversational: sounds
like thinking, not writing. Opens with the outcome, closes on a principle stated
flat. Trusts the reader. Not selling.

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
