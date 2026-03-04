---
name: anyskill
description: "AnySkill — your private skill cloud. Manage, sync, and dynamically load agent skills across OpenClaw, Antigravity, Claude Code, and Cursor from one GitHub-backed repository. Search cloud skills by natural language, auto-load prompts on demand, upload and share custom skills, batch install skill bundles."
version: 1.2.0
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

This skill is an **installer guide only**. It provides instructions for setting up AnySkill. It does not execute any code, scripts, or binaries.

The setup process downloads a single Markdown file (`SKILL.md`) that acts as a prompt-based loader — the AI agent reads it as instructions, not as executable code.

### What gets downloaded

| File | Source | Type |
|:---|:---|:---|
| `loader/anyskill/SKILL.md` | `github.com/lanyijianke/AnySkill` (`main` branch) | Markdown prompt file (not executable) |

> ⚠️ **Supply chain note**: The loader is fetched from the `main` branch without commit pinning. Users concerned about supply chain integrity should manually download and review the file before use.

### Credentials

| Credential | Purpose | Recommended scope |
|:---|:---|:---|
| GitHub PAT | Read/write user's private skill repository | **Fine-grained token** scoped to a single repository with "Contents: Read and write" permission only |

> ⚠️ **Credential risks**:
> - The token is stored in **plain text** at `~/.anyskill/config.json`. No encryption or OS keychain integration is currently implemented.
> - Users who require stronger credential security should: (1) use a fine-grained PAT limited to a single repository, (2) rotate tokens regularly, (3) consider using environment variables (`ANYSKILL_GITHUB_TOKEN`) instead of the config file.
> - The classic `repo` scope grants broad access. We **strongly recommend** using a fine-grained token instead.

### Limitations

- This skill file cannot enforce runtime security policies. The security behavior depends on the AI agent's implementation.
- Token storage is plain text. OS keychain integration is not yet available.
- The loader file is fetched from a remote branch without checksum verification.

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
> **How to install:**
>
> 1. Review the AnySkill repository: https://github.com/lanyijianke/AnySkill
> 2. Read the README for setup instructions
> 3. Ask me to help you install it after you've reviewed the source
>
> The installation downloads one Markdown file (the loader) and guides you through connecting a private GitHub repository for skill storage. No scripts or binaries are installed.
>
> **Before installing**, please:
> - Review the [source repository](https://github.com/lanyijianke/AnySkill) and its recent commits
> - Prepare a **fine-grained GitHub PAT** scoped to a single repository with "Contents: Read and write" only
> - Do not reuse tokens that have broad account access
