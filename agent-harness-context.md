# Agent Harness Architecture — Context Sync

**Date:** 2026-04-03
**Session:** Claude Code Web (rowbyroh-website repo)
**Branch:** `claude/improve-agent-harness-tests-kBHGC`

---

## The Question

> How do I create better tests in our agent harness so that we can measure the performance of all jobs that should be functioning?

Clarified: This isn't about the website specifically. It's about the **entire Claude Code setup across all projects** — skills, hooks, MCP servers, Obsidian integration — and being able to verify everything is working.

## Terminology Clarification

- **"Agent harness"** = the full collection of Claude Code hooks, skills, MCP servers, and settings that together enable Claude to work across multiple projects as a coherent workflow
- **"Test harness"** (traditional) = a framework that runs automated tests against code
- The user's usage is valid — it's the rigging that makes the agent operational. The gap is: **there's no way to know if the rigging is intact.**

---

## Current Harness Audit

### What Exists

| Layer | What's There | Status |
|-------|-------------|--------|
| **Stop Hook** | `~/.claude/stop-hook-git-check.sh` — prevents session end with uncommitted/unpushed work | Working, solid |
| **SessionStart Hook** | Skill installed (`~/.claude/skills/session-start-hook/SKILL.md`) but **not registered** in settings.json — never fires | Dead weight |
| **Skills** | `session-start-hook` installed. System skills available (update-config, loop, schedule, simplify, etc.) | Underutilized |
| **MCP Servers** | **None configured** in global settings.json | Major gap |
| **Hooks** | Only Stop. No PreToolUse, PostToolUse, SessionStart, or Notification hooks | Minimal |
| **Cross-project config** | Only rowbyroh-website has a CLAUDE.md. No shared conventions across projects | Siloed |
| **/sync skill** | Not found in this environment — likely existed in another session but didn't persist | Lost |

### Key Files

**`~/.claude/settings.json`**
```json
{
    "$schema": "https://json.schemastore.org/claude-code-settings.json",
    "hooks": {
        "Stop": [
            {
                "matcher": "",
                "hooks": [
                    {
                        "type": "command",
                        "command": "~/.claude/stop-hook-git-check.sh"
                    }
                ]
            }
        ]
    },
    "permissions": {
        "allow": ["Skill"]
    }
}
```

**`~/.claude/stop-hook-git-check.sh`** (working)
- Reads JSON from stdin, checks for recursion
- Validates: uncommitted changes, untracked files, unpushed commits
- Compares current branch against origin or default branch
- Exits 2 if issues found, 0 if clean

**`~/.claude/skills/session-start-hook/SKILL.md`** (installed, never registered)
- Template for creating SessionStart hooks
- Supports async mode with timeout
- Env vars: `$CLAUDE_PROJECT_DIR`, `$CLAUDE_ENV_FILE`, `$CLAUDE_CODE_REMOTE`

---

## Diagnosis: The Larger Problem

There is no harness. There is **one guardrail** (the stop hook) and disconnected capabilities. Specifically, there's no way to:

1. **Verify** that skills, hooks, and MCP servers are all functioning
2. **Smoke-test** a session — "can I reach Obsidian? Can I push to GitHub? Do my hooks fire?"
3. **Know what broke** when something stops working (like /sync disappearing)
4. **Onboard a new project** with consistent tooling
5. **Maintain state** across sessions — what was configured last time?

---

## Proposed Architecture: Three Layers

### Layer 1: Session Boot (SessionStart Hook)

A hook registered in settings.json that **validates the environment** at session start:

- Confirm git is configured and can reach origin
- Ping each MCP server (Obsidian, GitHub) and report status
- Write `HARNESS_STATUS` env var into `$CLAUDE_ENV_FILE`
- Log failures but don't block — degrade gracefully

### Layer 2: Capability Registry (settings.json as source of truth)

settings.json should declare everything the harness provides:

```
hooks:
  SessionStart → boot check + environment setup
  Stop         → git check (already exists)
  PreToolUse   → validation gates (optional)
  Notification → alerts when things break

mcpServers:
  obsidian-mcp → knowledge system
  github       → (platform-provided in web sessions)

permissions:
  explicit allow-list per tool category
```

### Layer 3: Health Check Skill (`/harness-check` or `/status`)

An on-demand skill that:

1. Lists all registered hooks → tests each fires without error
2. Lists all MCP servers → tests each responds
3. Lists all skills → verifies each can be loaded
4. Checks cross-project state (uncommitted work, CLAUDE.md consistency)
5. Outputs a simple pass/fail dashboard

---

## Open Questions (Need User Input)

1. **What was /sync supposed to do?** Sync Obsidian? Sync config across projects? Needs to be rebuilt properly as a persistent skill.
2. **What MCP servers are normally connected?** Obsidian MCP? Others? None are in global settings.json currently.
3. **Which projects should the harness span?** Just rowbyroh-website, or a defined list of repos?

---

## Next Steps (Proposed)

1. Register SessionStart hook in settings.json with a boot check script
2. Create a `/status` or `/check` health check skill
3. Rebuild /sync as a proper persistent skill
4. Configure MCP servers in global settings.json
5. Establish cross-project CLAUDE.md conventions
