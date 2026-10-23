#!/usr/bin/env node
// Visit report from the live analytics database. Bots and preview/local hosts are excluded.
// Usage: node analytics/scripts/report.mjs [days=7] [--json]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

const days = Number(process.argv.find((a) => /^\d+$/.test(a)) || 7);
const asJson = process.argv.includes('--json');
const env = { ...process.env };
for (const line of readFileSync(`${homedir()}/.config/cloudflare/env`, 'utf8').split('\n')) {
  const m = line.match(/^(\w+)=(.*)$/); if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const since = Date.now() - days * 86400000;
const rows = JSON.parse(execFileSync('npx', ['-y', 'wrangler@4', 'd1', 'execute', 'rowbyroh-analytics', '--remote', '--json',
  '--command', `SELECT * FROM events WHERE ts >= ${since} AND is_bot = 0 AND host IN ('rowbyroh.com','www.rowbyroh.com') ORDER BY ts`],
  { cwd: new URL('..', import.meta.url).pathname, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))[0].results;

const views = rows.filter((r) => r.type === 'pageview');
const visitors = new Map();
for (const v of views) {
  const x = visitors.get(v.visitor_id) || { id: v.visitor_id.slice(0, 6), views: 0, sessions: new Set(), isNew: false, tag: null, country: v.country, device: v.device };
  x.views++; x.sessions.add(v.session_id); if (v.new_visitor) x.isNew = true; x.tag = x.tag || v.first_ref;
  visitors.set(v.visitor_id, x);
}
// Per page view: deepest scroll and visible time (leave can fire more than once; take the max).
const pv = new Map();
for (const r of rows) {
  const p = pv.get(r.pageview_id) || { depth: 0, ms: 0 };
  if (r.depth != null) p.depth = Math.max(p.depth, r.depth);
  if (r.active_ms != null) p.ms = Math.max(p.ms, r.active_ms);
  pv.set(r.pageview_id, p);
}
const sessions = new Map();
for (const r of rows) {
  if (!sessions.has(r.session_id)) sessions.set(r.session_id, { visitor: r.visitor_id.slice(0, 6), start: r.ts, steps: [] });
  const s = sessions.get(r.session_id);
  if (r.type === 'pageview') {
    const p = pv.get(r.pageview_id);
    s.steps.push(`${r.path} (${p.depth}%, ${Math.round(p.ms / 1000)}s)`);
  } else if (r.type === 'click' && r.label !== 'internal') s.steps.push(`[${r.label}${r.area ? ' @' + r.area : ''}]`);
  else if (r.type === 'action') s.steps.push(`[${r.label}: ${r.target}]`);
}
const pages = new Map();
for (const v of views) {
  const p = pages.get(v.path) || { views: 0, visitors: new Set(), depth: [], secs: [] };
  const d = pv.get(v.pageview_id);
  p.views++; p.visitors.add(v.visitor_id); p.depth.push(d.depth); p.secs.push(d.ms / 1000);
  pages.set(v.path, p);
}
const clicks = rows.filter((r) => r.type === 'click' && ['email', 'linkedin', 'github'].includes(r.label));
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };

const report = {
  days,
  visitors: { total: visitors.size, new: [...visitors.values()].filter((v) => v.isNew).length,
    returning: [...visitors.values()].filter((v) => v.sessions.size > 1 || !v.isNew).length },
  tags: Object.entries([...visitors.values()].reduce((a, v) => (v.tag && (a[v.tag] = (a[v.tag] || 0) + 1), a), {})),
  pages: [...pages].map(([path, p]) => ({ path, views: p.views, visitors: p.visitors.size, median_depth: med(p.depth), median_secs: Math.round(med(p.secs)) }))
    .sort((a, b) => b.visitors - a.visitors),
  contact_clicks: clicks.map((c) => ({ when: new Date(c.ts).toISOString().slice(0, 16), visitor: c.visitor_id.slice(0, 6), what: c.label, page: c.path, area: c.area })),
  sessions: [...sessions.values()].map((s) => ({ when: new Date(s.start).toISOString().slice(0, 16), visitor: s.visitor, path: s.steps.join(' > ') })),
};
if (asJson) { console.log(JSON.stringify(report, null, 2)); process.exit(0); }

console.log(`rowbyroh.com, last ${days} days\n`);
console.log(`Visitors: ${report.visitors.total} (${report.visitors.new} new, ${report.visitors.returning} returning)`);
console.log(`Tagged links: ${report.tags.length ? report.tags.map(([t, n]) => `${t} ${n}`).join(', ') : 'none'}\n`);
console.log('Pages (visitors, views, median scroll depth, median time):');
for (const p of report.pages) console.log(`  ${p.path.padEnd(42)} ${p.visitors} / ${p.views}   ${p.median_depth}%   ${p.median_secs}s`);
console.log(`\nContact clicks: ${clicks.length}`);
for (const c of report.contact_clicks) console.log(`  ${c.when}  ${c.visitor}  ${c.what} on ${c.page}${c.area ? ' (' + c.area + ')' : ''}`);
console.log('\nVisits, in order (page, scroll depth, time on page):');
for (const s of report.sessions) console.log(`  ${s.when}  ${s.visitor}  ${s.path}`);
