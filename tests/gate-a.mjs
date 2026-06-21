#!/usr/bin/env node
// Gate A — deterministic structural checks against LOCAL files (pre-deploy).
// Complements scripts/verify.sh (which checks the live site post-deploy).
// Validates the master IA: design-system linkage, link integrity (no dead
// ends), asset resolution, content.json reachability, and required chrome.
//
// Run: node tests/gate-a.mjs   (exit 0 = pass, 1 = fail)

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let FAIL = 0, WARN = 0, PASS = 0;
const fail = (m) => { console.log(`  \x1b[31mFAIL\x1b[0m ${m}`); FAIL++; };
const warn = (m) => { console.log(`  \x1b[33mWARN\x1b[0m ${m}`); WARN++; };
const pass = (m) => { PASS++; if (process.env.VERBOSE) console.log(`  \x1b[32mok\x1b[0m   ${m}`); };
const head = (m) => console.log(`\n${m}`);

// ---- Site model ---------------------------------------------------------
// Pages that are live (exclude drafts, node_modules, .claude, design tooling).
function walk(dir, acc = []) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (['node_modules', '.git', '.claude', 'drafts', 'design', 'source-content'].includes(name)) continue;
        const st = statSync(p);
        if (st.isDirectory()) walk(p, acc);
        else if (name.endsWith('.html')) acc.push(p);
    }
    return acc;
}
const pages = walk(ROOT).map(p => relative(ROOT, p)).sort();

// Content pages = anything under field-notes/, blog/, chair-roundtable/.
const isContentPage = (rel) => /^(field-notes|blog|chair-roundtable)\//.test(rel);
// Top-level pages allowed to carry supplemental inline <style> blocks.
const INLINE_STYLE_OK = new Set(['about.html', 'colophon.html']);

const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
const redirects = (vercel.redirects || []).map(r => r.source.replace(/\/$/, ''));
const cleanUrls = vercel.cleanUrls === true;

// Resolve a site-absolute route ("/about", "/field-notes/x") to a local file.
function routeToFile(route) {
    let r = route.split('#')[0].split('?')[0].replace(/\/$/, '');
    if (r === '' ) return join(ROOT, 'index.html');
    // Direct file (asset or explicit .html)
    if (existsSync(join(ROOT, r))) return join(ROOT, r);
    if (r.endsWith('.html') && existsSync(join(ROOT, r))) return join(ROOT, r);
    // cleanUrls: /foo -> foo.html
    if (cleanUrls && existsSync(join(ROOT, r + '.html'))) return join(ROOT, r + '.html');
    // directory index
    if (existsSync(join(ROOT, r, 'index.html'))) return join(ROOT, r, 'index.html');
    return null;
}

function attrs(html, re) {
    const out = []; let m;
    while ((m = re.exec(html)) !== null) out.push(m[1]);
    return out;
}

// ---- 1. Design-system linkage ------------------------------------------
head('1. Design-system linkage (base.css + no orphan inline style)');
for (const rel of pages) {
    const html = readFileSync(join(ROOT, rel), 'utf8');
    if (/href="[^"]*assets\/css\/base\.css"/.test(html)) pass(`${rel} links base.css`);
    else fail(`${rel} does not link base.css (design-system orphan)`);
    const hasInline = /<style[\s>]/.test(html);
    if (hasInline && !INLINE_STYLE_OK.has(rel)) fail(`${rel} has orphan inline <style> (not on the supplemental whitelist)`);
}

// ---- 2. Content-page chrome (breadcrumb, keep-reading, footer) ----------
head('2. Content-page chrome (breadcrumb, Keep Reading, footer)');
for (const rel of pages.filter(isContentPage)) {
    const html = readFileSync(join(ROOT, rel), 'utf8');
    /<nav class="breadcrumb">.*all work.*<\/nav>/.test(html.replace(/\n/g, ' '))
        ? pass(`${rel} breadcrumb -> all work`) : fail(`${rel} missing 'all work' breadcrumb`);
    /id="keep-reading"/.test(html) ? pass(`${rel} has Keep Reading`) : fail(`${rel} missing #keep-reading (dead end)`);
    /assets\/js\/related\.js/.test(html) ? pass(`${rel} loads related.js`) : fail(`${rel} missing related.js`);
    /<footer>/.test(html) ? pass(`${rel} has site footer`) : fail(`${rel} missing site footer`);
}

// ---- 3. Asset references resolve ---------------------------------------
head('3. Asset references resolve on disk');
for (const rel of pages) {
    const dir = dirname(join(ROOT, rel));
    const html = readFileSync(join(ROOT, rel), 'utf8');
    const refs = [
        ...attrs(html, /<link[^>]+href="([^"]+)"/g),
        ...attrs(html, /<script[^>]+src="([^"]+)"/g),
        ...attrs(html, /<img[^>]+src="([^"]+)"/g),
    ].filter(u => !/^https?:|^mailto:|^data:|^#/.test(u));
    for (const u of refs) {
        const target = u.startsWith('/') ? join(ROOT, u) : resolve(dir, u);
        existsSync(target) ? pass(`${rel} -> ${u}`) : fail(`${rel} references missing asset: ${u}`);
    }
}

// ---- 4. Internal links resolve (no dead ends) --------------------------
head('4. Internal links resolve (no dead ends)');
for (const rel of pages) {
    const html = readFileSync(join(ROOT, rel), 'utf8');
    const links = attrs(html, /<a[^>]+href="([^"]+)"/g)
        .filter(h => h.startsWith('/'))      // site-absolute internal links only
        .filter(h => !/^\/assets\//.test(h)); // assets checked in section 3
    for (const href of new Set(links)) {
        const norm = href.split('#')[0].split('?')[0].replace(/\/$/, '');
        if (redirects.includes(norm)) { pass(`${rel} -> ${href} (redirect)`); continue; }
        routeToFile(href) ? pass(`${rel} -> ${href}`) : fail(`${rel} dead link: ${href}`);
    }
}

// ---- 5. content.json reachability + url resolution ---------------------
head('5. content.json entries resolve and are reachable');
const content = JSON.parse(readFileSync(join(ROOT, 'assets/data/content.json'), 'utf8'));
const homeLinks = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const e of content.filter(e => e.published)) {
    routeToFile(e.url) ? pass(`content url ${e.url}`) : fail(`content.json url does not resolve: ${e.url}`);
}
// Every published content page on disk should be registered in content.json
const registered = new Set(content.map(e => e.url.replace(/\/$/, '')));
for (const rel of pages.filter(isContentPage)) {
    const route = '/' + rel.replace(/\.html$/, '');
    registered.has(route)
        ? pass(`${route} registered`)
        : fail(`${route} is a live content page but is NOT in content.json (orphaned from stream/archive)`);
}

// ---- 6. Redirect targets exist -----------------------------------------
head('6. Redirect / rewrite targets');
for (const r of (vercel.redirects || [])) {
    const dest = r.destination;
    if (dest === '/404' || /^https?:/.test(dest)) { pass(`${r.source} -> ${dest}`); continue; }
    routeToFile(dest) ? pass(`${r.source} -> ${dest}`) : fail(`redirect target missing: ${r.source} -> ${dest}`);
}

// ---- 7. Every page has a <title> ---------------------------------------
head('7. Title tags present');
for (const rel of pages) {
    /<title>[^<]+<\/title>/.test(readFileSync(join(ROOT, rel), 'utf8'))
        ? pass(`${rel} has <title>`) : fail(`${rel} missing <title>`);
}

// ---- Summary -----------------------------------------------------------
console.log(`\n${'='.repeat(40)}`);
console.log(`Gate A: ${PASS} ok, ${WARN} warn, ${FAIL} fail   (${pages.length} pages)`);
if (FAIL > 0) { console.log('\x1b[31mGATE A FAILED\x1b[0m'); process.exit(1); }
console.log('\x1b[32mGATE A PASSED\x1b[0m');
