#!/usr/bin/env bash
# ship.sh — the rowbyroh Ship Gate. Runs the pre-push check suite in cost order
# (cheap/deterministic first) and only on all-pass prints the review package.
# The ONLY human step is the final review-to-push decision on the package.
#
#   Gate 0  unit tests          (node --test)        — pure logic + data schema
#   Gate A  structural          (tests/gate-a.mjs)   — links, assets, IA, no dead ends
#   Gate B  visual + e2e        (Playwright)         — regression vs baselines
#   Gate C  voice/content       (run-gate-c.mjs)     — advisory, diff-scoped
#
# Usage: bash scripts/ship.sh [--no-b]   (skip Gate B if Chromium unavailable)

set -uo pipefail
cd "$(dirname "$0")/.."
SKIP_B=0; [[ "${1:-}" == "--no-b" ]] && SKIP_B=1
FAIL=0
green(){ printf '\033[0;32m%s\033[0m\n' "$1"; }
red(){ printf '\033[0;31m%s\033[0m\n' "$1"; }
yellow(){ printf '\033[0;33m%s\033[0m\n' "$1"; }
step(){ printf '\n\033[1m=== %s ===\033[0m\n' "$1"; }

step "Gate 0 — unit tests (logic + content schema)"
if node --test tests/*.test.mjs >/tmp/ship-unit.log 2>&1; then green "  unit tests passed"; else red "  unit tests FAILED"; tail -20 /tmp/ship-unit.log; FAIL=1; fi

step "Gate A — structural / links / assets / reachability"
if node tests/gate-a.mjs; then :; else FAIL=1; fi

step "Gate B — visual regression + e2e (Playwright)"
if [[ $SKIP_B == 1 ]]; then
  yellow "  skipped (--no-b)"
elif npx playwright --version >/dev/null 2>&1 && [[ -d "$HOME/.cache/ms-playwright" ]]; then
  if npx playwright test --config tests/gate-b/playwright.config.mjs >/tmp/ship-b.log 2>&1; then
    green "  Playwright passed ($(grep -oE '[0-9]+ passed' /tmp/ship-b.log | tail -1))"
  else
    red "  Playwright FAILED"; tail -25 /tmp/ship-b.log; FAIL=1
  fi
else
  yellow "  Playwright/Chromium not installed — run: npm i -D @playwright/test && npx playwright install chromium"
  yellow "  (Gate B also runs in CI — see .github/workflows/ship-gate.yml)"
fi

step "Gate C — voice / content audit (advisory)"
node tests/gate-c/run-gate-c.mjs || true

step "Result"
if [[ $FAIL == 0 ]]; then
  green "ALL BLOCKING GATES PASSED"
  echo ""
  echo "Review package:"
  echo "  branch:  $(git rev-parse --abbrev-ref HEAD)"
  echo "  commit:  $(git rev-parse --short HEAD)  $(git log -1 --pretty=%s)"
  echo "  diff:    $(git diff --shortstat origin/main...HEAD 2>/dev/null || echo 'n/a')"
  echo "  changed pages:"
  git diff --name-only origin/main...HEAD 2>/dev/null | grep -E '\.html$' | sed 's/^/    /' || true
  echo ""
  echo "  -> Open the Vercel preview, eyeball, then merge to main to ship."
  exit 0
else
  red "SHIP GATE FAILED — do not push. Fix the red gate(s) above."
  exit 1
fi
