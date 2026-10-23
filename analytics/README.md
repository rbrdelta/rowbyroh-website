# Visit analytics

Who visits rowbyroh.com, the order they move through pages, how far they read, and what they click.

- **In the page:** `assets/js/track.js`, loaded on every live page (Gate A fails a page without it).
- **Collector:** Cloudflare Worker `rowbyroh-analytics` (`src/worker.js`), write-only, accepts events only from rowbyroh.com and its Vercel previews.
- **Storage:** Cloudflare D1 database `rowbyroh-analytics` (`schema.sql`). No IP address stored.

## How a visitor is identified
No accounts. On the first page view the browser saves a random ID (`localStorage`, key `rbr_vid`); every later event carries it. Same ID = same browser. A new device, private window or cleared storage looks like a new visitor. A session is a run of page views with no gap over 30 minutes; `seq` is the step number, so a session reads as a path.

## Events
| type | when | key fields |
|---|---|---|
| pageview | each page load (and back/forward restores) | path, prev_path, seq, new_visitor, referrer, ref, first_ref, country, device |
| depth | 25 / 50 / 75 / 100 % of the page seen | depth |
| leave | tab hidden or page left | max depth, active_ms (visible time) |
| click | any link | label: email / linkedin / github / outbound / internal, target, area |
| action | button press, audio/video play | label: button / play, target, area |

## Tagged links
Share as `https://rowbyroh.com/?ref=<tag>` (any page works). The tag is stored on that visit and remembered as the visitor's first tag, then removed from the address bar.

## Your own visits
Open any page with `?notrack=1` once on each of your devices; `?notrack=0` undoes it.

## Commands
- Report: `node analytics/scripts/report.mjs [days]` (add `--json` for machine-readable)
- Verify: `bash analytics/verify.sh` (local end-to-end in a headless browser, then live collector checks)
- Deploy collector: `cd analytics && set -a && . ~/.config/cloudflare/env && set +a && npx -y wrangler@4 deploy`
