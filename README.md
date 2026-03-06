<p align="center">
  <img src="https://raw.githubusercontent.com/lanyijianke/AnySkill/master/assets/icon.png" width="128" height="128" alt="AnySkill" />
</p>

<h1 align="center">AnySkill</h1>

<p align="center">
  <strong>One Skill to Rule Them All.</strong><br/>
  Your private AI skill space — secure, transparent, on-demand.
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

AnySkill stores your AI skills in a private GitHub repository. Load them on-demand in any AI coding assistant with a single sentence — no manual file management needed. Each skill is a `SKILL.md` — write once, use everywhere.

## Getting Started

Open your AI IDE (Antigravity / Claude Code / Cursor / OpenClaw), and tell the AI:

> **Read `https://github.com/lanyijianke/AnySkill` and help me install it**

<!--
AI INSTRUCTION — Follow these steps strictly:

⚠️ Important constraints:
- Do NOT git clone this repository! You only need to download the 1 file specified below.
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

The AI will automatically download the engine, guide you to bind your repository, and complete setup. All without leaving the editor.

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

## Features

- **🔒 Private Repository** — Skills are stored in your own GitHub private repo. Tokens are saved locally only, never in version control.
- **⚡ On-Demand Loading** — The AI automatically matches and loads required skills from the cloud into memory. Unloaded after use, keeping your project directory clean.
- **📂 Structured Skills** — Each skill has its own folder, supporting scripts, config files, and companion files — not just a single Markdown.
- **🤖 Auto Indexing** — GitHub Actions automatically rebuilds `index.json` on every push. Zero maintenance.
- **💬 Natural Language** — All operations are triggered through conversation. Load, download, upload, delete — no commands to memorize.
- **📁 Folder Organization** — Organize skills into category folders for better structure.

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
 │                  │   upload   ────▶ │      design-system/SKILL.md │
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

After pushing, GitHub Actions automatically updates the index and the skill is immediately available across all your projects.

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

AnySkill 将你的 AI 技能集中存储在一个 GitHub 私有仓库中。在任何 AI 编程助手里通过一句话按需加载，无需手动管理文件。每个技能就是一个 `SKILL.md`——写一次，到处用。

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

## 功能特性

- **🔒 私有仓库** — 技能存储在你自己的 GitHub 私有仓库，Token 仅保存在本地，不进入版本控制。
- **⚡ 按需加载** — AI 自动从云端匹配并加载所需技能到内存，用完即弃，项目目录保持干净。
- **📂 结构化技能** — 每个技能一个文件夹，支持脚本、配置等伴随文件，不只是单个 Markdown。
- **🤖 自动索引** — Push 后 GitHub Actions 自动重建 `index.json`，零运维。
- **💬 自然语言** — 所有操作通过对话完成。加载、下载、上传、删除——不需要记任何命令。
- **📁 分类管理** — 将技能按分类文件夹组织，支持新建/删除/移动。

## 操作方式

所有操作均通过自然语言触发：

| 操作 | 触发方式 | 说明 |
|------|---------|------|
| 加载 | *自动触发* | 从云端读取技能到内存，用完即弃 |
| 下载 | "下载 XX 技能" | 下载指定技能到本地 |
| 全量同步 | "下载所有技能" | 批量拉取全部技能 |
| 上传 | "上传技能" | 创建技能文件夹并 push |
| 更新 | "更新 XX 技能" | 修改已有技能内容并 push |
| 列举 | "列出技能" | 展示云端所有技能 |
| 删除 | "删除 XX 技能" | 从仓库中移除技能 |
| 文件夹 | "新建/移动文件夹" | 管理分类文件夹 |
| 组合包 | "安装 XX 组合包" | 从 [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs) 批量安装 |

## 安全性

Token 不会离开你的本机。所有通信通过 HTTPS 和 GitHub 官方 API 进行。

## License

[MIT](LICENSE)
