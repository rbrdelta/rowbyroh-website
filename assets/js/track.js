// Visit tracking for rowbyroh.com. Sends small events to the analytics collector (analytics/).
// Identity is a random ID saved in this browser on first visit: no account, no cookie, no IP stored.
// ?ref=<tag> on a shared link is recorded (and remembered as the visitor's first tag), then removed from the URL.
// ?notrack=1 turns tracking off in this browser (use on your own devices); ?notrack=0 turns it back on.
(function () {
  var ENDPOINT = 'https://rowbyroh-analytics.daily-standard.workers.dev/e';
  var SESSION_GAP_MS = 30 * 60 * 1000;
  var cfg = window.__rbrTrack || {};
  var endpoint = cfg.endpoint || ENDPOINT;

  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (_) { return mem[k] || null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (_) { mem[k] = v; } }
  function del(k) { try { localStorage.removeItem(k); } catch (_) { delete mem[k]; } }
  function rid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }

  var params = new URLSearchParams(location.search);
  if (params.get('notrack') === '1') set('rbr_notrack', '1');
  if (params.get('notrack') === '0') del('rbr_notrack');
  var local = !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if (get('rbr_notrack') === '1' || (local && !cfg.force)) return;

  // Visitor: one random ID per browser, kept until storage is cleared.
  var visitor = get('rbr_vid');
  var isNew = !visitor;
  if (isNew) { visitor = rid(); set('rbr_vid', visitor); }

  // Tag from a shared link: record it, remember the first one, then strip it so copies of the URL stay clean.
  var ref = params.get('ref');
  if (ref && !get('rbr_first_ref')) set('rbr_first_ref', ref);
  if (ref || params.has('notrack')) {
    params.delete('ref'); params.delete('notrack');
    var qs = params.toString();
    try { history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (_) {}
  }

  var device = innerWidth < 700 ? 'mobile' : innerWidth < 1100 ? 'tablet' : 'desktop';
  var pv, maxDepth, sentDepth, activeMs, visibleSince;

  function send(type, extra) {
    var e = {
      type: type, visitor_id: visitor, session_id: pv.session, pageview_id: pv.id, seq: pv.seq,
      host: location.hostname, path: pv.path, device: device,
    };
    for (var k in extra) if (extra[k] != null) e[k] = extra[k];
    var body = JSON.stringify(e);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain' }))) return;
    } catch (_) {}
    try { fetch(endpoint, { method: 'POST', body: body, keepalive: true, headers: { 'content-type': 'text/plain' } }); } catch (_) {}
  }

  // A page view. Session = run of page views with no gap over 30 minutes; seq is the step number in it.
  function pageview(firstLoad) {
    var now = Date.now();
    var s; try { s = JSON.parse(get('rbr_sess') || 'null'); } catch (_) { s = null; }
    if (!s || now - s.last > SESSION_GAP_MS) s = { id: rid(), seq: 0, path: null };
    var prev = s.path;
    s.seq += 1; s.last = now; s.path = location.pathname;
    set('rbr_sess', JSON.stringify(s));

    pv = { id: rid(), session: s.id, seq: s.seq, path: location.pathname };
    maxDepth = 0; sentDepth = 0; activeMs = 0; visibleSince = document.visibilityState === 'visible' ? now : null;

    var referrer = null;
    if (document.referrer) {
      try {
        var r = new URL(document.referrer);
        if (r.hostname !== location.hostname) referrer = r.hostname + r.pathname;
      } catch (_) {}
    }
    send('pageview', {
      new_visitor: firstLoad && isNew ? 1 : 0, prev_path: prev,
      referrer: firstLoad ? referrer : null, ref: firstLoad ? ref : null, first_ref: get('rbr_first_ref'),
    });
    depth();
  }

  // Scroll depth milestones: 25 / 50 / 75 / 100 percent of the page seen.
  function depth() {
    var h = document.documentElement.scrollHeight;
    var seen = h ? Math.min(1, (scrollY + innerHeight) / h) : 1;
    var pct = seen >= 0.97 ? 100 : Math.floor(seen * 4) * 25;
    if (pct > maxDepth) maxDepth = pct;
    while (sentDepth < maxDepth) { sentDepth += 25; send('depth', { depth: sentDepth }); }
  }

  function leave() {
    if (visibleSince) { activeMs += Date.now() - visibleSince; visibleSince = null; }
    send('leave', { depth: maxDepth, active_ms: activeMs });
  }

  // Where on the page an element sits: nearest ancestor id or landmark, else the nearest block's class.
  function area(el) {
    var cls = null;
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      if (n.id) return n.id;
      if (/^(NAV|HEADER|FOOTER|ARTICLE|ASIDE)$/.test(n.tagName)) return n.tagName.toLowerCase();
      if (!cls && /^(DIV|SECTION|UL|OL)$/.test(n.tagName) && n.classList.length) cls = n.classList[0];
    }
    return cls;
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (a) {
      var href = a.getAttribute('href');
      var label;
      if (/^mailto:/i.test(href)) label = 'email';
      else {
        var u; try { u = new URL(a.href); } catch (_) { return; }
        if (u.hostname === location.hostname) { label = 'internal'; href = u.pathname + u.search + u.hash; }
        else if (/(^|\.)linkedin\.com$/.test(u.hostname)) label = 'linkedin';
        else if (/(^|\.)github\.com$/.test(u.hostname)) label = 'github';
        else label = 'outbound';
      }
      send('click', { label: label, target: href, area: area(a) });
      return;
    }
    var b = ev.target.closest && ev.target.closest('button, [role="button"]');
    if (b) {
      var name = b.getAttribute('data-track') || b.getAttribute('aria-label') || (b.textContent || '').trim();
      send('action', { label: 'button', target: name.replace(/\s+/g, ' ').slice(0, 80), area: area(b) });
    }
  }, true);

  // Audio / video plays (play events don't bubble, so listen in the capture phase).
  document.addEventListener('play', function (ev) {
    var src = ev.target.currentSrc || ev.target.src || '';
    send('action', { label: 'play', target: src.split('/').pop().split('?')[0], area: area(ev.target) });
  }, true);

  var ticking = false;
  addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    setTimeout(function () { ticking = false; depth(); }, 250);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') leave();
    else visibleSince = Date.now();
  });
  // Back/forward restores from the page cache don't rerun this script; count them as a new page view.
  addEventListener('pageshow', function (ev) { if (ev.persisted) pageview(false); });

  pageview(true);
})();
