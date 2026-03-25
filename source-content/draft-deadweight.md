# Deadweight: A Decade of Freight Expertise in One Afternoon

> Draft for blog post #5. Source: Code session 6eb201b0, [[Freight Intel 1]], [[Freight Intel 2]]

## Lede

I spent ten years in global freight — ocean carrier, Fortune 500 negotiations, $100M+ in revenue, $350M in contracts. I know how carriers pad invoices. I know which accessorial charges are real and which are negotiating leverage. I know that the fuel surcharge threshold XPO Logistics uses is different from the one ODFL uses, and both are different from what's published.

I built a tool that does what I do — audits freight invoices for overcharges — in one afternoon, in one Claude Code session. It found $977-$1,352 in savings on 8 sample shipments. It's called Deadweight.

## The name

Deadweight tonnage (DWT) is the measure of how much weight a vessel can carry. It's the most fundamental metric in ocean freight. It's also, literally, dead weight — the thing you're paying to move but shouldn't be.

The tool cuts dead weight from freight spend. The name writes itself.

## What it does

Feed it a freight invoice (CSV or PDF). It parses every line item using Claude's API (Haiku — fast and cheap). Then six analyzers run:

1. **Fuel surcharge validation** — compares against DOE diesel benchmarks and carrier-specific thresholds
2. **Accessorial charge audit** — checks 30+ charge types against published maximums
3. **Rate benchmarking** — compares lane rates to market data
4. **Duplicate detection** — catches double-billed shipments
5. **Arithmetic verification** — recalculates totals, checks unit math
6. **Carrier intelligence** — fires carrier-specific rules (XPO's dim weight conversion, ODFL's cubic capacity charges, FedEx's address correction patterns)

Output: a branded 8-page PDF report with executive summary, findings ranked by savings, and shipment-level detail.

## The design decisions

**Python, not TypeScript.** My default stack is TypeScript. But this is data analysis — Pandas, PDF generation, Claude SDK. Python is the right tool.

**CLI-first, no UI.** The instinct is to build a web app. A dashboard. A client portal. I rejected all of it. The SaaS model is obsolete for this use case. Most of what a web UI would do can be solved agentically — auto-draft the client email, attach the report, schedule the follow-up. The tool is a pipeline, not a product.

**Extensible data model.** Pydantic models with `extra="allow"`. The initial version handles LTL and truckload. The data model accepts ocean, air, parcel — any freight mode — without code changes. I'm not prescribing the schema; I'm letting it grow as the use cases arrive.

**No benchmarks are static.** Fuel surcharges change weekly. Accessorial limits change quarterly. Lane rates shift with the market. The architecture separates benchmark data from analysis logic so the data can be updated — eventually automatically via DOE's API — without touching the code.

## Why this isn't "I used AI to code faster"

Anyone can prompt Claude to write a Python script. The tool works because of what went into the prompt: a decade of knowing which charges to check, which carriers use which tactics, which thresholds are real and which are bluffs.

The carrier intelligence rules in this tool aren't from research. They're from sitting across the table from XPO's pricing team. From running rate negotiations at a global ocean carrier. From managing $350M in freight contracts and knowing that the published tariff is never the real tariff.

Claude wrote the code. I wrote the knowledge.

## The numbers

- 22 findings on 8 sample shipments
- $977-$1,352 identified savings (4.9%-6.8% of total spend)
- 11 carriers in the intelligence database
- 30+ accessorial charge caps
- 8 NJ-origin lane benchmarks
- Built in 1 Claude Code session

## What's next

Real invoices. The sample data validates the pipeline. Now I need to run actual carrier invoices from actual shippers and see where the analysis holds up and where my benchmarks are off. The tool is the minimum viable version of a service — one that packages freight domain expertise into an automated audit that most shippers can't do themselves because they don't know what to look for.

## The principle

Domain expertise is the moat. AI is the amplifier. The combination of deep industry knowledge and AI tooling produces something neither can alone — a tool that knows *what* to look for (human expertise) and can look at *everything* simultaneously (AI scale). The question isn't whether AI will automate freight auditing. It's whether the people building the tools understand freight deeply enough to know which charges matter.
