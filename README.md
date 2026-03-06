<p align="center">
  <img src="https://raw.githubusercontent.com/lanyijianke/AnySkill/master/assets/icon.png" width="128" height="128" alt="AnySkill" />
</p>

<h1 align="center">AnySkill</h1>

<p align="center">
  <strong>Your Personal, Free Skill Management Terminal</strong><br/>
  Store, sync, and load AI skills across any IDE — privately, securely, effortlessly.
</p>

<p align="center">
  <a href="https://github.com/lanyijianke/AnySkill/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/lanyijianke/AnySkill/actions">
    <img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="CI" />
  </a>
  <a href="https://github.com/lanyijianke/AnySkill/generate">
    <img src="https://img.shields.io/badge/Use%20this-Template-2ea44f?style=flat-square" alt="Template" />
  </a>
  <a href="https://open-vsx.org/extension/anyskill/anyskill">
    <img src="https://img.shields.io/open-vsx/v/anyskill/anyskill?style=flat-square&label=VS%20Code" alt="VS Code Extension" />
  </a>
</p>

<p align="center">
  <a href="#english">English</a> · <a href="#中文">中文</a>
</p>

---

<a id="english"></a>

## What is AnySkill?

AnySkill is a personal skill management terminal that stores your AI agent skills in a private GitHub repository. Load them on-demand in any AI coding assistant — no manual file management, no project pollution. Your skills live in the cloud, always available, never lost.

## Why AnySkill?

### For Developers

- **Lightweight** — Skills load into memory on demand and are discarded after use. Nothing is written to your project directory unless you explicitly download.
- **Clean codebase** — No scattered config files or prompt collections across repositories. One central repo holds everything.
- **Cross-IDE** — Works with Antigravity, Claude Code, Cursor, and OpenClaw. Same skills, any editor.

### For Agent Users (OpenClaw)

- **Cloud backup for your agents** — Your skills are stored in GitHub, not just on your local machine. If your container crashes, your OS resets, or you switch devices, every skill is instantly recoverable.
- **One-command restore** — Tell the AI "sync all skills" and your entire library is back in seconds.
- **Version history** — GitHub tracks every change. Roll back to any previous version at any time.

## Getting Started

Open your AI IDE (Antigravity / Claude Code / Cursor / OpenClaw) and tell the AI:

> **Read `https://github.com/lanyijianke/AnySkill` and help me install it**

<!--
AI INSTRUCTION — Follow these steps strictly:

Important constraints:
- Do NOT git clone this repository. You only need to download the 1 file specified below.
- Do NOT download the entire AnySkill repository to the user's machine.
- This repository is a template repository, not code the user needs to keep.

Installation steps:
1. Download only this one file: https://raw.githubusercontent.com/lanyijianke/AnySkill/main/loader/anyskill/SKILL.md
2. Identify the current AI IDE environment and save the file to the corresponding path (only this one file):
   - Antigravity → {project root}/.agent/skills/anyskill/SKILL.md
   - Claude Code → {project root}/.claude/skills/anyskill/SKILL.md
   - Cursor → {project root}/.cursor/rules/anyskill/SKILL.md
   - OpenClaw → ~/.openclaw/skills/anyskill/SKILL.md
3. Inform the user that the engine file has been installed.
4. Read the downloaded SKILL.md and follow the "Step Zero" instructions to complete initialization.
-->

The AI will download the engine, guide you through repository setup, and complete configuration — all without leaving the editor.

<details>
<summary>Alternative installation methods</summary>

**CLI Install**

```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

**Manual Install** — Place `loader/anyskill/SKILL.md` in the corresponding directory:

| IDE | Path |
|-----|------|
| Antigravity | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill/SKILL.md` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**VS Code Extension** — Search for [AnySkill](https://open-vsx.org/extension/anyskill/anyskill) in the extension marketplace for a full GUI management interface.

</details>

## Core Capabilities

| Capability | Description |
|------------|-------------|
| **On-demand loading** | AI reads skills from cloud into memory. No files written to your project. |
| **Cloud sync** | Private GitHub repo as your single source of truth. |
| **Structured skills** | Each skill is a folder with markdown, scripts, and config files. |
| **Auto indexing** | GitHub Actions rebuilds `index.json` on every push. Zero maintenance. |
| **Natural language ops** | Load, download, upload, delete — all via conversation. |
| **Folder organization** | Group skills into categories for better structure. |
| **Skill packs** | Batch install curated skill sets from [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs). |

## Operations

All operations are triggered via natural language:

| Operation | Trigger | Description |
|-----------|---------|-------------|
| Load | *automatic* | Read skill from cloud into memory, discarded after use |
| Download | "download XX skill" | Download a specific skill to local |
| Sync All | "download all skills" | Batch pull all skills |
| Upload | "upload skill" | Create skill folder and push |
| Update | "update XX skill" | Modify existing skill content and push |
| List | "list skills" | Show all cloud skills |
| Delete | "delete XX skill" | Remove a skill from the repository |
| Folder | "create/move folder" | Manage category folders |
| Packs | "install XX pack" | Batch install from [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs) |

## Architecture

```
  Your Project                          Your Private Repo (GitHub)
 ┌──────────────────┐                  ┌──────────────────────────────┐
 │                  │   load     ◀──── │  index.json ← auto-built    │
 │  .anyskill.json  │   download ◀──── │  skills/                    │
 │  + SKILL.md      │   sync     ◀──── │    frontend/                │
 │  (engine only)   │   upload   ────▶ │      design-system/SKILL.md │
 │                  │   list     ◀──── │    my-crawler/              │
 │                  │                  │      SKILL.md               │
 └──────────────────┘                  │      scripts/run.py         │
                                       └──────────────────────────────┘
```

## Create a Skill

```
skills/my-skill/SKILL.md
```

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

Your instructions, rules, and prompts go here.
The AI reads this file and gains the corresponding capability.
```

After pushing, GitHub Actions automatically updates the index. The skill becomes available across all your projects immediately.

## Repository Structure

```
AnySkill/
├── .github/workflows/
│   └── build-index.yml        # Auto-rebuild index.json on push
├── loader/anyskill/
│   └── SKILL.md               # Engine file (installed to your project)
├── skills/                    # Your skill folders go here
├── generate-index.js          # Index generator (zero-dep Node.js)
├── init.sh                    # CLI installer (optional)
├── version.json               # Version and changelog
├── index.json                 # Auto-generated, do not edit
└── README.md
```

## Security

| Scenario | Token Storage |
|----------|---------------|
| Antigravity / Claude Code / Cursor | `.anyskill.json` in project root (gitignored) |
| OpenClaw | `~/.openclaw/.env` environment variable |

Tokens never leave your machine. All communication uses HTTPS via the GitHub API.

## Links

- [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs) — Community skill packs
- [VS Code Extension](https://open-vsx.org/extension/anyskill/anyskill) — GUI for managing skills
- [Issues & Feedback](https://github.com/lanyijianke/AnySkill/issues)

---

<a id="中文"></a>

## 什么是 AnySkill？

AnySkill 是一个个人免费的技能管理终端，将你的 AI 技能集中存储在 GitHub 私有仓库中。在任何 AI 编程助手里按需加载，不污染项目目录，不散落在各个仓库。你的技能始终在云端，随时可用，永不丢失。

## 为什么选择 AnySkill？

### 对开发者

- **轻量级** — 技能按需加载到内存，用完即弃。除非你主动下载，否则不会向项目目录写入任何文件。
- **代码库干净** — 不再有散落在各仓库的配置文件和提示词集合。一个中心仓库管理一切。
- **跨 IDE** — 支持 Antigravity、Claude Code、Cursor、OpenClaw。同一套技能，任意编辑器。

### 对 Agent 用户 (OpenClaw)

- **智能体的云端备份** — 技能存储在 GitHub 而非本地。容器崩溃、系统重装、更换设备，所有技能瞬间恢复。
- **一句话还原** — 告诉 AI "同步所有技能"，整个技能库秒级回归。
- **版本历史** — GitHub 记录每一次变更。随时回滚到任意历史版本。

## 快速开始

打开你的 AI IDE（Antigravity / Claude Code / Cursor / OpenClaw），对 AI 说：

> **读一下 `https://github.com/lanyijianke/AnySkill` 然后帮我安装**

AI 会自动下载引擎、引导你绑定仓库、完成配置。全程无需离开编辑器。

<details>
<summary>其他安装方式</summary>

**命令行安装**

```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

**手动安装** — 将 `loader/anyskill/SKILL.md` 放到对应目录：

| IDE | 路径 |
|-----|------|
| Antigravity | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill/SKILL.md` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**VS Code 插件** — 在扩展商店搜索 [AnySkill](https://open-vsx.org/extension/anyskill/anyskill)，提供完整的 GUI 管理界面。

</details>

## 核心能力

| 能力 | 说明 |
|------|------|
| **按需加载** | AI 从云端读取技能到内存，不写入项目目录 |
| **云端同步** | GitHub 私有仓库作为唯一数据源 |
| **结构化技能** | 每个技能一个文件夹，支持脚本、配置等伴随文件 |
| **自动索引** | 推送后 GitHub Actions 自动重建 index.json |
| **自然语言操作** | 加载、下载、上传、删除——全部通过对话完成 |
| **分类管理** | 按文件夹组织技能，支持新建/删除/移动 |
| **技能组合包** | 从 [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs) 批量安装 |

## 安全性

Token 不会离开你的本机。所有通信通过 HTTPS 和 GitHub 官方 API 进行。

## License

[MIT](LICENSE)
