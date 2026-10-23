-- One row per event sent by assets/js/track.js.
-- visitor_id: random ID saved in the visitor's browser on first visit (no account, no personal data).
-- session_id: new after 30 minutes of inactivity; seq orders events within a session (the navigation path).
-- pageview_id: random per page load; ties scroll/leave/click events to the page view they happened on.
-- No IP address is stored. Country comes from Cloudflare.
CREATE TABLE IF NOT EXISTS events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ts            INTEGER NOT NULL,          -- server receive time, ms since epoch
  type          TEXT NOT NULL,             -- pageview | depth | leave | click | action
  visitor_id    TEXT NOT NULL,
  session_id    TEXT NOT NULL,
  pageview_id   TEXT NOT NULL,
  seq           INTEGER,                   -- step number of this page view within the session
  new_visitor   INTEGER,                   -- 1 on the visitor's first ever page view
  host          TEXT,                      -- rowbyroh.com, or a preview host
  path          TEXT NOT NULL,
  prev_path     TEXT,                      -- previous page in the same session
  referrer      TEXT,                      -- external referrer (host + path), pageview only
  ref           TEXT,                      -- ?ref= tag on this page load
  first_ref     TEXT,                      -- first ?ref= tag this visitor ever arrived with
  label         TEXT,                      -- click: email | linkedin | github | outbound | internal; action: what was done
  target        TEXT,                      -- click destination / action detail
  area          TEXT,                      -- click/action: where on the page (nearest id, or nav/header/footer/article)
  depth         INTEGER,                   -- depth: 25/50/75/100; leave: max depth reached
  active_ms     INTEGER,                   -- leave: visible time on the page
  device        TEXT,                      -- mobile | tablet | desktop (by viewport width)
  country       TEXT,
  is_bot        INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS events_visitor ON events (visitor_id, ts);
CREATE INDEX IF NOT EXISTS events_session ON events (session_id, ts);
CREATE INDEX IF NOT EXISTS events_ts ON events (ts);
