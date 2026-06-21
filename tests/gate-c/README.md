# Gate C — content bar + voice fingerprint

The agentic gate. Audits changed content prose against
`design/VOICE-FINGERPRINT.md` (the 8-dimension rubric + red lines). Generalizes
the one-off 2026-06-19 voice audit (22-agent workflow) into a standing,
diff-scoped check.

## Two entry points

| Entry | When | Command |
|-------|------|---------|
| **Runner** (`run-gate-c.mjs`) | CI / non-interactive / quick | `npm run gate:c` |
| **Workflow** (`ship-gate-c.workflow.js`) | Interactive, richer multi-agent (per-piece audit → adversarial judge → rewrite proposals) | `Workflow({ scriptPath: 'tests/gate-c/ship-gate-c.workflow.js' })` |

Both read the same fingerprint and only audit content pages whose prose changed
vs. `origin/main` (diff-scoped — no cost when prose didn't change).

## Why advisory first (graduated autonomy)

LLM judges produce false positives. The gate earns authority by being measured,
not asserted:

1. **Advisory** (now) — Gate C prints verdicts; never blocks. Daniel's
   review-to-push decision is the ground-truth label.
2. **Blocking** — flip `GATE_C_BLOCKING=1` once the agreement rate (gate verdict
   vs. Daniel's decision) clears threshold on the logged history.
3. **Auto-merge** — remove the human step last, by measured escaped-regression
   rate ≈ 0. Keep periodic spot-audits so the learning signal survives.

## Ground-truth log + self-tuning

Every run appends to `runs.jsonl`. Pair each run with the eventual push decision
(gate-passed-but-rejected / gate-flagged-but-shipped are the tuning signals). A
weekly meta-review computes false-pos/neg per dimension and proposes fingerprint
or threshold tweaks. This mirrors the "measure events, don't predict" principle:
show the distribution, tune on real disagreement, never hand-wave the threshold.

## Adversarial verify

The workflow runs an independent judge per confirmed FAIL, prompted to REFUTE it.
A FAIL survives only if the judge agrees. Default-to-not-a-fail under uncertainty.
This is what keeps the false-positive rate low enough to eventually go blocking.
