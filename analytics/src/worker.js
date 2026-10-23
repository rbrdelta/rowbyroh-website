// Collector for rowbyroh.com visit events. Write-only: POST /e stores one event.
// There is no read endpoint; reports run from the terminal (analytics/scripts/report.mjs).

const ALLOWED_ORIGIN = /^https:\/\/((www\.)?rowbyroh\.com|rowbyroh-website[a-z0-9-]*\.vercel\.app)$/;
const TYPES = new Set(['pageview', 'depth', 'leave', 'click', 'action']);
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python|axios|node-fetch/i;
const ID = /^[a-zA-Z0-9-]{8,64}$/;

const str = (v, max) => (typeof v === 'string' && v.length ? v.slice(0, max) : null);
const int = (v, max) => (Number.isFinite(v) ? Math.max(0, Math.min(Math.round(v), max)) : null);

export function clean(e) {
  if (!e || typeof e !== 'object' || !TYPES.has(e.type)) return null;
  if (![e.visitor_id, e.session_id, e.pageview_id].every((v) => typeof v === 'string' && ID.test(v))) return null;
  const path = str(e.path, 300);
  if (!path || !path.startsWith('/')) return null;
  return {
    type: e.type,
    visitor_id: e.visitor_id,
    session_id: e.session_id,
    pageview_id: e.pageview_id,
    seq: int(e.seq, 10000),
    new_visitor: e.new_visitor ? 1 : 0,
    host: str(e.host, 100),
    path,
    prev_path: str(e.prev_path, 300),
    referrer: str(e.referrer, 300),
    ref: str(e.ref, 80),
    first_ref: str(e.first_ref, 80),
    label: str(e.label, 80),
    target: str(e.target, 300),
    area: str(e.area, 80),
    depth: int(e.depth, 100),
    active_ms: int(e.active_ms, 24 * 3600 * 1000),
    device: ['mobile', 'tablet', 'desktop'].includes(e.device) ? e.device : null,
  };
}

const cors = (origin) => ({
  'access-control-allow-origin': origin,
  'access-control-allow-methods': 'POST',
  'access-control-allow-headers': 'content-type',
  vary: 'origin',
});

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const origin = req.headers.get('origin') || '';
    const allowed = ALLOWED_ORIGIN.test(origin) || (env.ALLOW_LOCAL === 'true' && /^http:\/\/localhost:\d+$/.test(origin));

    if (url.pathname !== '/e') return new Response('not found', { status: 404 });
    if (req.method === 'OPTIONS') return new Response(null, { status: allowed ? 204 : 403, headers: allowed ? cors(origin) : {} });
    if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
    if (!allowed) return new Response('forbidden', { status: 403 });

    const text = await req.text();
    if (text.length > 4000) return new Response('too large', { status: 413, headers: cors(origin) });
    let e;
    try { e = clean(JSON.parse(text)); } catch { e = null; }
    if (!e) return new Response('bad event', { status: 400, headers: cors(origin) });

    const ua = req.headers.get('user-agent') || '';
    const row = { ts: Date.now(), ...e, country: req.cf?.country || null, is_bot: BOT_UA.test(ua) ? 1 : 0 };
    const cols = Object.keys(row);
    await env.DB.prepare(`INSERT INTO events (${cols.join(',')}) VALUES (${cols.map(() => '?').join(',')})`)
      .bind(...cols.map((c) => row[c]))
      .run();
    return new Response(null, { status: 204, headers: cors(origin) });
  },
};
