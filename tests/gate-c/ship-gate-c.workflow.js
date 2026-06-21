export const meta = {
    name: 'ship-gate-c',
    description: 'rowbyroh Gate C — diff-scoped voice/content audit with adversarial verify',
    phases: [
        { title: 'Audit', detail: 'score each changed content page vs the voice fingerprint' },
        { title: 'Verify', detail: 'independent judge refutes each confirmed FAIL' },
    ],
}

// Generalizes the 2026-06-19 voice audit (22 agents) into a standing, diff-scoped
// gate. Pass the changed content pages + their prose as args:
//   Workflow({ scriptPath: '.../ship-gate-c.workflow.js', args: { fingerprint, pages: [{file, text}] } })
// If args is absent the workflow reports nothing to do (the runner computes the
// diff; this script focuses on the agentic judgement so it stays deterministic).

const FINDING = {
    type: 'object',
    properties: {
        page: { type: 'string' },
        verdict: { type: 'string', enum: ['pass', 'fail'] },
        fails: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    dimension: { type: 'string' },
                    quote: { type: 'string' },
                    why: { type: 'string' },
                    fix: { type: 'string' },
                },
                required: ['dimension', 'quote', 'why', 'fix'],
            },
        },
        notes: { type: 'string' },
    },
    required: ['page', 'verdict', 'fails', 'notes'],
}

const VERDICT = {
    type: 'object',
    properties: { real: { type: 'boolean' }, reason: { type: 'string' } },
    required: ['real', 'reason'],
}

const fingerprint = (args && args.fingerprint) || ''
const pages = (args && args.pages) || []

if (!pages.length) {
    log('Gate C: no changed content pages supplied — nothing to audit.')
    return { audited: 0, confirmedFails: [] }
}

// Audit → (per confirmed fail) adversarial verify, pipelined so each page's
// fails get refuted as soon as that page's audit returns.
const results = await pipeline(
    pages,
    (p) => agent(
        `Audit this rowbyroh content page against the voice fingerprint. Daniel-verbatim prose is ground truth — only flag Claude-generated wrapper prose. Be conservative; under uncertainty, do not flag. Fixes must be subtractive.\n\n` +
        `===== VOICE FINGERPRINT =====\n${fingerprint}\n\n===== PAGE: ${p.file} =====\n${p.text}`,
        { label: `audit:${p.file}`, phase: 'Audit', schema: FINDING }
    ),
    async (finding, p) => {
        if (!finding || finding.verdict !== 'fail' || !finding.fails.length) return finding
        const judged = await parallel(finding.fails.map((f) => () =>
            agent(
                `Try to REFUTE this voice-audit finding on rowbyroh content. Default to real=false under any uncertainty.\n` +
                `Dimension: ${f.dimension}\nQuote: ${f.quote}\nClaim: ${f.why}\n\nFingerprint:\n${fingerprint}`,
                { label: `verify:${p.file}`, phase: 'Verify', schema: VERDICT }
            ).then((v) => ({ f, real: v && v.real }))
        ))
        const survivors = judged.filter((x) => x && x.real).map((x) => x.f)
        return { ...finding, verdict: survivors.length ? 'fail' : 'pass', fails: survivors }
    }
)

const confirmed = results.filter(Boolean).filter((r) => r.verdict === 'fail')
log(`Gate C: ${pages.length} audited, ${confirmed.length} confirmed fail(s) after adversarial verify.`)
return { audited: pages.length, confirmedFails: confirmed }
