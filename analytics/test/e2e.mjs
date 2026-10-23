// End-to-end: a headless browser browses the local site with the tracker pointed at a local collector,
// then the local database is checked for the expected events. Run via analytics/verify.sh.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';

const SITE = process.env.SITE || 'http://localhost:4399';
const COLLECTOR = process.env.COLLECTOR || 'http://localhost:8798/e';
const PERSIST = process.env.PERSIST;
const ANALYTICS_DIR = new URL('..', import.meta.url).pathname;

let fails = 0;
const check = (ok, msg) => { console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${msg}`); if (!ok) fails++; };

function query(sql) {
  const out = execFileSync('npx', ['-y', 'wrangler@4', 'd1', 'execute', 'rowbyroh-analytics', '--local',
    '--persist-to', PERSIST, '--json', '--command', sql], { cwd: ANALYTICS_DIR, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return JSON.parse(out)[0].results;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function newContext(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript((endpoint) => { window.__rbrTrack = { endpoint, force: true }; }, COLLECTOR);
  return ctx;
}
async function hide(page) {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });

// Visitor A: arrives from a tagged link, reads, navigates, clicks email, comes back later.
const a = await newContext(browser);
const pa = await a.newPage();
await pa.goto(`${SITE}/about?ref=verify-tag`);
await sleep(300);
check(!pa.url().includes('ref='), 'ref tag removed from the address bar');
await pa.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
await sleep(600);
await pa.evaluate(() => {
  const m = document.querySelector('.contact-list a[href^="mailto:"]');
  m.addEventListener('click', (e) => e.preventDefault(), { once: true });
  m.click();
});
await hide(pa);
await pa.goto(`${SITE}/archive`);
await sleep(300);
await pa.goto(`${SITE}/research`);
await sleep(800);
const vid = await pa.evaluate(() => localStorage.getItem('rbr_vid'));

// Visitor B: separate browser, opts out with ?notrack=1, must send nothing.
const b = await newContext(browser);
const pb = await b.newPage();
await pb.goto(`${SITE}/?notrack=1`);
await pb.goto(`${SITE}/archive`);
await sleep(800);
const vidB = await pb.evaluate(() => localStorage.getItem('rbr_vid'));

// Visitor C: plain visit, must be a different visitor.
const c = await newContext(browser);
const pc = await c.newPage();
await pc.goto(`${SITE}/`);
await sleep(1000);
await browser.close();
await sleep(500);

const rows = query('SELECT * FROM events ORDER BY id');
const A = rows.filter((r) => r.visitor_id === vid);
const views = A.filter((r) => r.type === 'pageview');

console.log('\nVisitor and path');
check(views.length === 3, `visitor A has 3 page views (got ${views.length})`);
check(views.map((v) => v.path).join(' > ') === '/about > /archive > /research', `path in order: ${views.map((v) => v.path).join(' > ')}`);
check(views.map((v) => v.seq).join(',') === '1,2,3', 'step numbers 1,2,3');
check(new Set(views.map((v) => v.session_id)).size === 1, 'one session across the three pages');
check(views[0].new_visitor === 1 && views[1].new_visitor === 0, 'first page view marked new, later ones not');
check(views[1].prev_path === '/about' && views[2].prev_path === '/archive', 'previous page recorded');
check(views[0].ref === 'verify-tag' && views[2].first_ref === 'verify-tag', 'tag on arrival, remembered on later pages');
check(views[0].device === 'desktop' && views[0].host === 'localhost', 'device and host recorded');

console.log('\nReading and clicks');
const depths = A.filter((r) => r.type === 'depth' && r.path === '/about').map((r) => r.depth);
check([25, 50, 75, 100].every((d) => depths.includes(d)), `scroll milestones on /about: ${depths.join(',')}`);
const email = A.find((r) => r.type === 'click' && r.label === 'email');
check(!!email && email.target.startsWith('mailto:') && email.area === 'contact-list', `email click recorded (area: ${email && email.area})`);
const leave = A.find((r) => r.type === 'leave' && r.path === '/about');
check(!!leave && leave.depth === 100 && leave.active_ms > 0, `leave event with depth and active time (${leave && leave.active_ms} ms)`);

console.log('\nOther visitors');
check(!rows.some((r) => r.visitor_id === vidB) && vidB === null, 'opted-out browser sent nothing');
const C = rows.filter((r) => r.visitor_id !== vid && r.type === 'pageview');
check(C.length === 1 && C[0].new_visitor === 1 && C[0].path === '/', 'second browser counted as a separate new visitor');

console.log(fails ? `\nE2E FAILED (${fails})` : '\nE2E PASSED');
process.exit(fails ? 1 : 0);
