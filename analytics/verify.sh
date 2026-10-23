#!/usr/bin/env bash
# Visit analytics verification.
#   1. End to end, local: headless browser on the local site -> local collector -> local database.
#   2. Live collector: accepts rowbyroh.com, refuses other sites and malformed events (test row deleted after).
# Usage: analytics/verify.sh [--local-only]
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
export PERSIST="$(mktemp -d)"
cd "$DIR"

echo "=== 1. End to end (local) ==="
npx -y wrangler@4 d1 execute rowbyroh-analytics --local --persist-to "$PERSIST" --file schema.sql >/dev/null 2>&1
npx -y wrangler@4 dev --local --persist-to "$PERSIST" --port 8798 --var ALLOW_LOCAL:true >/tmp/rbr-analytics-dev.log 2>&1 &
DEV=$!
node "$ROOT/tests/gate-b/server.mjs" 4399 >/dev/null 2>&1 &
WEB=$!
trap 'kill $DEV $WEB 2>/dev/null; pkill -f "wrangler.*--port 8798" 2>/dev/null; rm -rf "$PERSIST"' EXIT
for i in $(seq 1 60); do curl -s -o /dev/null http://localhost:8798/ && curl -s -o /dev/null http://localhost:4399/ && break; sleep 0.5; done
(cd "$ROOT" && CHROMIUM="${CHROMIUM:-}" node analytics/test/e2e.mjs)

[[ "${1:-}" == "--local-only" ]] && exit 0

echo ""
echo "=== 2. Live collector ==="
set -a; . ~/.config/cloudflare/env; set +a
U=https://rowbyroh-analytics.daily-standard.workers.dev/e
ID="verify-live-$(date +%s)"
EV="{\"type\":\"pageview\",\"visitor_id\":\"$ID\",\"session_id\":\"$ID\",\"pageview_id\":\"$ID\",\"path\":\"/__verify\"}"
FAIL=0
code() { curl -s -o /dev/null -w '%{http_code}' -X POST "$@" "$U"; }
c=$(code -H 'origin: https://rowbyroh.com' --data "$EV");  [[ $c == 204 ]] && echo "  OK   rowbyroh.com accepted" || { echo "  FAIL rowbyroh.com got $c"; FAIL=1; }
c=$(code -H 'origin: https://evil.example' --data "$EV");   [[ $c == 403 ]] && echo "  OK   other site refused"   || { echo "  FAIL other site got $c"; FAIL=1; }
c=$(code -H 'origin: https://rowbyroh.com' --data '{"type":"x"}'); [[ $c == 400 ]] && echo "  OK   malformed event refused" || { echo "  FAIL malformed got $c"; FAIL=1; }
n=$(npx -y wrangler@4 d1 execute rowbyroh-analytics --remote --json --command "SELECT count(*) n FROM events WHERE visitor_id='$ID'; DELETE FROM events WHERE visitor_id='$ID';" 2>/dev/null \
  | node -e 'console.log(JSON.parse(require("fs").readFileSync(0))[0].results[0].n)')
[[ $n == 1 ]] && echo "  OK   event stored in live database (test row removed)" || { echo "  FAIL live row count $n"; FAIL=1; }
[[ $FAIL == 0 ]] && echo "LIVE PASSED" || { echo "LIVE FAILED"; exit 1; }
