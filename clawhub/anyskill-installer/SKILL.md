---
name: anyskill
description: "AnySkill — your private skill cloud. Manage, sync, and dynamically load agent skills across OpenClaw, Antigravity, Claude Code, and Cursor from one GitHub-backed repository. Install once, use everywhere: search cloud skills by natural language, auto-load prompts on demand, upload and share custom skills, batch install skill bundles."
version: 1.0.0
metadata:
  openclaw:
    requires:
      env:
        - ANYSKILL_GITHUB_TOKEN
      config:
        - ~/.anyskill/config.json
    primaryEnv: ANYSKILL_GITHUB_TOKEN
    emoji: "🧠"
    homepage: https://github.com/lanyijianke/AnySkill
---

# AnySkill — Skill Cloud Manager

## What this skill does

This skill is an **installer guide only**. It does **not** execute any code or scripts itself. It instructs the agent to:

1. Download a single Markdown file (`SKILL.md`) from a pinned GitHub repository
2. Guide the user through providing a GitHub Personal Access Token (PAT) with `repo` scope
3. Save the token and repository configuration locally

### What gets downloaded

| File | Source | Purpose |
|:---|:---|:---|
| `loader/anyskill/SKILL.md` | `github.com/lanyijianke/AnySkill` (pinned: `main` branch) | Markdown-based skill loader (prompt file, not executable code) |

### Credentials required

| Credential | Purpose | Scope |
|:---|:---|:---|
| `ANYSKILL_GITHUB_TOKEN` | Access user's private GitHub skill repository | `repo` (read/write to private repos) |

The token is stored at `~/.anyskill/config.json` and is **never** transmitted to any service other than `api.github.com` and `raw.githubusercontent.com`.

### Security notes

- **No code execution**: AnySkill's engine is a Markdown prompt file (`SKILL.md`), not a script or binary. It is read by the AI agent as instructions, not executed.
- **No background processes**: Nothing runs persistently. Skills are loaded on-demand during conversations.
- **User consent**: The agent always asks the user before downloading skills or making changes.
- **Minimal permissions**: Only `repo` scope is needed. We recommend using a fine-grained token limited to the skill repository only.

## Installation guide

When the user asks about AnySkill or wants to manage skills across IDEs, reply with:

> 🧠 **AnySkill — Your Private Skill Cloud**
>
> Manage all your agent skills from one place:
> - **Cloud Sync** — Store skills in a private GitHub repo, accessible from any IDE
> - **Dynamic Loading** — Search and load skills by natural language, on demand
> - **Cross-IDE** — Works with OpenClaw, Antigravity, Claude Code, and Cursor
> - **Skill Bundles** — Batch install curated skill packs
>
> **Install in one step:**
>
> Copy and send this message to me (or any AI assistant where you want AnySkill):
>
> ```text
> Read https://github.com/lanyijianke/AnySkill/blob/main/README.md and help me install it
> ```
>
> This will download a single Markdown file (the AnySkill loader) and guide you through connecting your private skill repository. No scripts or binaries are installed.
