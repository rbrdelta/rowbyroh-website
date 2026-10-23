// Unit tests for the visit-analytics collector (analytics/src/worker.js).
// The Worker runs here in Node against a fake database binding, so every rule
// (which sites may send, what an event may hold, size limit, bot flag) is checked
// without touching the live Cloudflare database.
// Run: node --test tests/collector.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { clean } from '../analytics/src/worker.js';

const ID = 'abcdef12-3456';
const EVENT = { type: 'pageview', visitor_id: ID, session_id: ID, pageview_id: ID, path: '/about' };

// Fake D1 binding: records every INSERT instead of writing anywhere.
function fakeEnv(extra = {}) {
    const rows = [];
    return {
        rows,
        DB: {
            prepare(sql) {
                return {
                    bind(...vals) {
                        return {
                            async run() {
                                const cols = sql.match(/\(([^)]+)\) VALUES/)[1].split(',');
                                rows.push(Object.fromEntries(cols.map((c, i) => [c, vals[i]])));
                            },
                        };
                    },
                };
            },
        },
        ...extra,
    };
}

function post(body, { origin = 'https://rowbyroh.com', ua = 'Mozilla/5.0', cf } = {}) {
    const req = new Request('https://collector.example/e', {
        method: 'POST',
        headers: { origin, 'user-agent': ua, 'content-type': 'text/plain' },
        body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    if (cf) Object.defineProperty(req, 'cf', { value: cf });
    return req;
}

test('clean: refuses unknown event types, bad ids and paths that are not site paths', () => {
    assert.equal(clean({ ...EVENT, type: 'purchase' }), null);
    assert.equal(clean({ ...EVENT, visitor_id: 'short' }), null, 'id under 8 characters');
    assert.equal(clean({ ...EVENT, session_id: 'has spaces in it' }), null, 'id with characters outside letters, digits, -');
    assert.equal(clean({ ...EVENT, pageview_id: 'x'.repeat(65) }), null, 'id over 64 characters');
    assert.equal(clean({ ...EVENT, path: 'https://elsewhere.example/' }), null);
    assert.equal(clean({ ...EVENT, path: '' }), null);
    assert.equal(clean(null), null);
    assert.equal(clean('pageview'), null);
});

test('clean: accepts the five event types', () => {
    for (const type of ['pageview', 'depth', 'leave', 'click', 'action']) {
        assert.ok(clean({ ...EVENT, type }), type);
    }
});

test('clean: cuts long text, clamps numbers, keeps only known fields', () => {
    const e = clean({
        ...EVENT,
        path: '/' + 'p'.repeat(400), label: 'l'.repeat(200), ref: 'r'.repeat(200),
        depth: 250, seq: -3, active_ms: 9e12, new_visitor: 'yes', device: 'fridge',
        ip: '1.2.3.4', email: 'someone@example.com',
    });
    assert.equal(e.path.length, 300);
    assert.equal(e.label.length, 80);
    assert.equal(e.ref.length, 80);
    assert.equal(e.depth, 100);
    assert.equal(e.seq, 0);
    assert.equal(e.active_ms, 24 * 3600 * 1000);
    assert.equal(e.new_visitor, 1);
    assert.equal(e.device, null, 'device outside mobile/tablet/desktop is dropped');
    assert.ok(!('ip' in e) && !('email' in e), 'unknown fields never reach the database');
});

test('only POST /e is served; other paths 404, other methods 405', async () => {
    const env = fakeEnv();
    assert.equal((await worker.fetch(new Request('https://c.example/'), env)).status, 404);
    assert.equal((await worker.fetch(new Request('https://c.example/stats'), env)).status, 404);
    assert.equal((await worker.fetch(new Request('https://c.example/e'), env)).status, 405);
    assert.equal(env.rows.length, 0);
});

test('accepts rowbyroh.com, www and Vercel previews; refuses other sites', async () => {
    for (const origin of ['https://rowbyroh.com', 'https://www.rowbyroh.com', 'https://rowbyroh-website-git-x-rbrdelta.vercel.app']) {
        const env = fakeEnv();
        const res = await worker.fetch(post(EVENT, { origin }), env);
        assert.equal(res.status, 204, origin);
        assert.equal(res.headers.get('access-control-allow-origin'), origin);
        assert.equal(env.rows.length, 1);
    }
    for (const origin of ['https://evil.example', 'http://rowbyroh.com', 'https://rowbyroh.com.evil.example', 'http://localhost:4321', '']) {
        const env = fakeEnv();
        assert.equal((await worker.fetch(post(EVENT, { origin }), env)).status, 403, origin || '(no origin)');
        assert.equal(env.rows.length, 0, `${origin} must store nothing`);
    }
});

test('localhost is accepted only when ALLOW_LOCAL is "true" (local verify run)', async () => {
    const origin = 'http://localhost:4399';
    assert.equal((await worker.fetch(post(EVENT, { origin }), fakeEnv({ ALLOW_LOCAL: 'false' }))).status, 403);
    assert.equal((await worker.fetch(post(EVENT, { origin }), fakeEnv({ ALLOW_LOCAL: 'true' }))).status, 204);
});

test('preflight (OPTIONS) answers 204 with CORS for allowed sites, 403 otherwise', async () => {
    const opt = (origin) => new Request('https://c.example/e', { method: 'OPTIONS', headers: { origin } });
    const ok = await worker.fetch(opt('https://rowbyroh.com'), fakeEnv());
    assert.equal(ok.status, 204);
    assert.equal(ok.headers.get('access-control-allow-methods'), 'POST');
    const no = await worker.fetch(opt('https://evil.example'), fakeEnv());
    assert.equal(no.status, 403);
    assert.equal(no.headers.get('access-control-allow-origin'), null);
});

test('bodies over 4000 characters get 413; malformed events get 400; nothing stored', async () => {
    const env = fakeEnv();
    assert.equal((await worker.fetch(post({ ...EVENT, target: 'x'.repeat(4000) }), env)).status, 413);
    assert.equal((await worker.fetch(post('{not json'), env)).status, 400);
    assert.equal((await worker.fetch(post({ type: 'x' }), env)).status, 400);
    assert.equal(env.rows.length, 0);
});

test('a stored row gets server time, country from Cloudflare, a bot flag, and no IP', async () => {
    const env = fakeEnv();
    const before = Date.now();
    await worker.fetch(post(EVENT, { cf: { country: 'US' } }), env);
    await worker.fetch(post(EVENT, { ua: 'curl/8.0' }), env);
    await worker.fetch(post(EVENT, { ua: 'Mozilla/5.0 HeadlessChrome/120' }), env);
    const [human, curl, headless] = env.rows;
    assert.ok(human.ts >= before);
    assert.equal(human.country, 'US');
    assert.equal(human.is_bot, 0);
    assert.equal(curl.is_bot, 1);
    assert.equal(curl.country, null);
    assert.equal(headless.is_bot, 1, 'headless browsers are flagged as bots, not dropped');
    assert.ok(!Object.keys(human).some((k) => /ip|addr/i.test(k)), 'no IP column');
});
