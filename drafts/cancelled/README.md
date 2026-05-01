# Cancelled

Pages cut from production on 2026-04-30 as part of the Site Refactor & Field Notes Launch sprint. Kept here as record — git history alone is fine for retrieval, but this folder makes the cut visible without spelunking.

The content model collapsed to: About / Field Notes / (Essays + Case Studies deferred). Pages below didn't fit the new model and are not currently linked from any nav, homepage, or featured surface.

Vercel `vercel.json` rewrites `/drafts/:path*` to `/404` — these files exist on disk but do not serve.

## Files

| Path | Type | Why cut |
|------|------|---------|
| `obsidian-mcp.html` | Portfolio | Tooling-as-portfolio piece; show-don't-tell will return as a Demo, not as static page |
| `agentic-stack.html` | Portfolio | Same — system narrative belongs in Field Notes / Demos, not a fixed page |
| `deadweight.html` | Portfolio | Deadweight venture killed 2026-04-22 (stale domain, IP risk) |
| `portfolio-analysis.html` | Portfolio | Inward-facing, no thesis for outside reader |
| `blog/reverse-engineering-claude-api.html` | Essay | Subsumed by Field Note 01 — Conversation Sync |
| `blog/vault-vs-memory.html` | Essay | Reads like Claude, not Daniel; voice rewrite parked |

## Retained but unlinked

These remain at their original paths but were dropped from `content.json`:

- `blog/ai-pricing-market-maker.html` — strongest idea, weakest execution; Daniel-rewrite session deferred
- `chair-roundtable.html` — reframe deferred to a separate session
