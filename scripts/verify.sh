#!/usr/bin/env bash
# rowbyroh.com — post-deploy verification
# Run after pushing to main. Waits for Vercel deploy, then checks the live site.
# Usage: ./scripts/verify.sh [--skip-wait]

set -euo pipefail

SITE="https://rowbyroh.com"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0
WARN=0

red()    { printf '\033[0;31m%s\033[0m\n' "$1"; }
green()  { printf '\033[0;32m%s\033[0m\n' "$1"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$1"; }
dim()    { printf '\033[0;90m%s\033[0m\n' "$1"; }

fail() { red "  FAIL: $1"; FAIL=$((FAIL + 1)); }
pass() { green "  OK: $1"; }
warn() { yellow "  WARN: $1"; WARN=$((WARN + 1)); }

# --- Wait for deploy ---
if [[ "${1:-}" != "--skip-wait" ]]; then
    echo ""
    dim "Waiting 30s for Vercel deploy..."
    sleep 30
fi

echo ""
echo "=== rowbyroh.com verification ==="
echo ""

# --- 1. All pages return 200 ---
echo "1. Page status codes"

PAGES=(
    "/"
    "/about"
    "/obsidian-mcp"
    "/agentic-stack"
    "/deadweight"
    "/portfolio-analysis"
    "/chair-roundtable"
    "/archive"
    "/blog/reverse-engineering-claude-api"
    "/blog/vault-vs-memory"
    "/blog/ai-pricing-market-maker"
)

for page in "${PAGES[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${SITE}${page}")
    if [[ "$status" == "200" ]]; then
        pass "$page ($status)"
    else
        fail "$page ($status)"
    fi
done

# --- 2. Content fingerprints ---
echo ""
echo "2. Content fingerprints (title tags match source)"

# Extract expected titles from local HTML files
check_title() {
    local url="$1"
    local file="$2"
    local expected
    expected=$(grep -oP '(?<=<title>)[^<]+' "$REPO_ROOT/$file" | head -1)
    local actual
    actual=$(curl -s "${SITE}${url}" | grep -oP '(?<=<title>)[^<]+' | head -1)

    if [[ "$expected" == "$actual" ]]; then
        pass "$url title matches"
    else
        fail "$url title mismatch: expected '$expected', got '$actual'"
    fi
}

check_title "/obsidian-mcp" "obsidian-mcp.html"
check_title "/deadweight" "deadweight.html"
check_title "/agentic-stack" "agentic-stack.html"
check_title "/" "index.html"
check_title "/about" "about.html"

# --- 3. Deploy commit matches origin/main ---
echo ""
echo "3. Deploy commit"

local_head=$(cd "$REPO_ROOT" && git rev-parse --short=7 HEAD)
deploy_sha=$(cd "$REPO_ROOT" && gh api repos/rbrdelta/rowbyroh-website/deployments --jq '
    [.[] | select(.environment == "Production")] | .[0].sha[0:7]
' 2>/dev/null || echo "unknown")

if [[ "$local_head" == "$deploy_sha" ]]; then
    pass "Vercel production ($deploy_sha) matches origin/main ($local_head)"
else
    fail "Vercel production ($deploy_sha) does not match origin/main ($local_head)"
fi

# --- 4. Redirects ---
echo ""
echo "4. Redirects"

check_redirect() {
    local from="$1" expected="$2"
    local actual
    actual=$(curl -s -o /dev/null -w "%{redirect_url}" "${SITE}${from}")
    if [[ "$actual" == *"$expected"* ]]; then
        pass "$from -> $expected"
    else
        fail "$from should redirect to $expected, got $actual"
    fi
}

check_redirect "/writing" "/archive"
check_redirect "/blog/deadweight" "/deadweight"

# --- 5. Internal links (content.json) ---
echo ""
echo "5. content.json URLs"

urls=$(grep -oP '"url":\s*"[^"]*"' "$REPO_ROOT/assets/data/content.json" | grep -oP '"/[^"]*"' | tr -d '"')
for url in $urls; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "${SITE}${url}")
    if [[ "$status" == "200" ]]; then
        pass "$url ($status)"
    else
        fail "$url ($status)"
    fi
done

# --- 6. External links ---
echo ""
echo "6. External links"

ext_links=$(grep -rohP 'href="(https://[^"]+)"' "$REPO_ROOT"/*.html "$REPO_ROOT"/blog/*.html 2>/dev/null | \
    grep -oP 'https://[^"]+' | grep -v 'fonts.google\|fonts.gstatic' | sort -u)

for link in $ext_links; do
    status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$link" 2>/dev/null || echo "timeout")
    if [[ "$status" == "200" ]]; then
        pass "$link"
    elif [[ "$status" == "999" ]]; then
        # LinkedIn blocks automated requests
        warn "$link ($status — likely bot-blocked, manual check needed)"
    elif [[ "$status" == "timeout" ]]; then
        warn "$link (timeout)"
    else
        fail "$link ($status)"
    fi
done

# --- 7. Uncommitted changes ---
echo ""
echo "7. Working tree"

uncommitted=$(cd "$REPO_ROOT" && git status --porcelain)
if [[ -z "$uncommitted" ]]; then
    pass "Clean working tree"
else
    warn "Uncommitted changes:"
    echo "$uncommitted" | while read -r line; do
        yellow "    $line"
    done
fi

# --- Summary ---
echo ""
echo "==========================="
if [[ $FAIL -gt 0 ]]; then
    red "FAILED: $FAIL failures, $WARN warnings"
    exit 1
elif [[ $WARN -gt 0 ]]; then
    yellow "PASSED with $WARN warnings"
    exit 0
else
    green "ALL CHECKS PASSED"
    exit 0
fi
