#!/usr/bin/env node
// Gate C — content bar + voice fingerprint audit (agentic, diff-scoped, ADVISORY).
//
// Finds content pages whose prose changed in the changeset, strips each to text,
// and asks headless `claude -p` to audit it against design/VOICE-FINGERPRINT.md.
// Verdicts are logged to tests/gate-c/runs.jsonl (the ground-truth signal for
// self-tuning) and printed. Exit code is 0 unless GATE_C_BLOCKING=1 is set AND a
// fail is confirmed — graduated autonomy starts advisory.
//
// Usage: node tests/gate-c/run-gate-c.mjs [baseRef]   (default baseRef: origin/main)

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const BASE = process.argv[2] || process.env.GATE_C_BASE || 'origin/main';
const BLOCKING = process.env.GATE_C_BLOCKING === '1';

const FINGERPRINT = readFileSync(join(ROOT, 'design/VOICE-FINGERPRINT.md'), 'utf8');
const PROMPT = readFileSync(join(HERE, 'audit-prompt.md'), 'utf8');

const isContentPage = (f) => /^(field-notes|blog|chair-roundtable)\/.+\.html$/.test(f) || f === 'index.html' || f === 'about.html';

function sh(cmd) { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim(); }

let changed = [];
try {
    const base = sh(`git merge-base ${BASE} HEAD`);
    changed = sh(`git diff --name-only ${base} HEAD`).split('\n').filter(Boolean).filter(isContentPage);
} catch {
    console.log('Gate C: could not compute diff base; auditing nothing. (advisory)');
}
if (!changed.length) {
    console.log('Gate C: no content-prose changes in this changeset. PASS (nothing to audit).');
    process.exit(0);
}

function pageText(file) {
    const html = readFileSync(join(ROOT, file), 'utf8');
    const article = (html.match(/<article[\s\S]*?<\/article>/i) || [html])[0];
    return article
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&mdash;/g, '—').replace(/&rsquo;/g, '’').replace(/&ldquo;|&rdquo;/g, '"')
        .replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ')
        .replace(/\s+/g, ' ').trim();
}

function hasClaude() {
    try { sh('command -v claude'); return true; } catch { return false; }
}

const results = [];
if (!hasClaude()) {
    console.log('Gate C: claude CLI not found. Skipping agentic audit (advisory).');
    for (const f of changed) results.push({ page: f, verdict: 'skipped', notes: 'no claude CLI' });
} else {
    for (const f of changed) {
        const text = pageText(f);
        if (text.length < 200) { results.push({ page: f, verdict: 'pass', notes: 'too little prose to audit' }); continue; }
        const input = `${PROMPT}\n\n===== VOICE FINGERPRINT =====\n${FINGERPRINT}\n\n===== PAGE: ${f} =====\n${text}\n`;
        const tmp = join(HERE, '.audit-input.txt');
        writeFileSync(tmp, input);
        try {
            const out = sh(`claude -p --output-format text < ${JSON.stringify(tmp)}`);
            const json = (out.match(/\{[\s\S]*\}/) || ['{}'])[0];
            const verdict = JSON.parse(json);
            results.push(verdict);
        } catch (e) {
            results.push({ page: f, verdict: 'error', notes: String(e.message).split('\n')[0] });
        }
    }
}

// Log ground truth for the self-tuning meta-review.
const logLine = JSON.stringify({ base: BASE, results }) + '\n';
appendFileSync(join(HERE, 'runs.jsonl'), logLine);

// Report
console.log('\n=== Gate C — voice/content audit (advisory) ===');
let fails = 0;
for (const r of results) {
    const mark = r.verdict === 'fail' ? 'FAIL' : r.verdict.toUpperCase();
    console.log(`  [${mark}] ${r.page} — ${r.notes || ''}`);
    for (const f of (r.fails || [])) console.log(`        ${f.dimension}: ${f.why}`);
    if (r.verdict === 'fail') fails++;
}
console.log(`\nGate C: ${results.length} page(s) audited, ${fails} confirmed fail(s).`);
if (fails > 0 && BLOCKING) { console.log('GATE C BLOCKING — failing.'); process.exit(1); }
console.log(fails > 0 ? 'Advisory only — not blocking.' : 'PASS.');
