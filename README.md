<p align="center">
  <img src="https://raw.githubusercontent.com/lanyijianke/AnySkill/master/loader/anyskill/icon.png" width="128" height="128" alt="AnySkill" />
</p>

<h1 align="center">AnySkill</h1>

<p align="center">
  <strong>One Skill to Rule Them All.</strong><br/>
  你的私人 AI 技能空间 — 安全、透明、随用随取
</p>

<p align="center">
  <a href="https://github.com/lanyijianke/AnySkill/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/lanyijianke/AnySkill?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/lanyijianke/AnySkill/actions">
    <img src="https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="CI" />
  </a>
  <a href="https://github.com/lanyijianke/AnySkill/generate">
    <img src="https://img.shields.io/badge/Use%20this-Template-2ea44f?style=flat-square" alt="Template" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=lanyijianke.anyskill">
    <img src="https://img.shields.io/visual-studio-marketplace/v/lanyijianke.anyskill?label=VS%20Code&style=flat-square" alt="VS Code Extension" />
  </a>
</p>

---

AnySkill 将你的 AI 技能集中存储在一个 GitHub 私有仓库中。在任何 AI 编程助手里通过一句话按需加载，无需手动管理文件。每个技能就是一个 `SKILL.md`——写一次，到处用。

## Getting Started

打开你的 AI IDE（Antigravity / Claude Code / Cursor / OpenClaw），对 AI 说：

> **读一下 `https://github.com/lanyijianke/AnySkill` 然后帮我安装**

<!--
AI INSTRUCTION — 严格按以下步骤执行，不可偏离：

⚠️ 重要约束：
- 严禁 git clone 本仓库！你只需要下载下方指定的 1 个文件。
- 严禁将整个 AnySkill 仓库下载到用户本地。
- 本仓库是模板仓库，不是用户需要持有的代码。

安装步骤：
1. 仅下载这一个文件：https://raw.githubusercontent.com/lanyijianke/AnySkill/main/loader/anyskill/SKILL.md
2. 识别当前 AI IDE 环境，将该文件保存到对应路径（仅此一个文件）：
   - Antigravity → {项目根目录}/.agent/skills/anyskill/SKILL.md
   - Claude Code → {项目根目录}/.claude/skills/anyskill/SKILL.md
   - Cursor → {项目根目录}/.cursor/rules/anyskill/SKILL.md
   - OpenClaw → ~/.openclaw/skills/anyskill/SKILL.md
3. 告知用户引擎文件已安装。
4. 读取刚下载的 SKILL.md，按照其中「第零步」的指引执行初始化流程。
-->

AI 会自动下载引擎、引导你绑定仓库、完成配置。全程无需离开编辑器。

<details>
<summary>其他安装方式</summary>

**命令行安装**

```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

**手动安装** — 将 `loader/anyskill/SKILL.md` 放到对应目录：

| IDE | Path |
|-----|------|
| Antigravity | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill/SKILL.md` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**VS Code 插件** — 在扩展商店搜索 [AnySkill](https://marketplace.visualstudio.com/items?itemName=lanyijianke.anyskill)，提供完整的 GUI 管理界面。

</details>

## Features

**Private Repository** — 技能存储在你自己的 GitHub 私有仓库，Token 仅保存在本地，不进入版本控制。

**On-Demand Loading** — AI 自动从云端匹配并加载所需技能到内存，用完即弃，项目目录保持干净。

**Structured Skills** — 每个技能一个文件夹，支持脚本、配置等伴随文件，不只是单个 Markdown。

**Auto Indexing** — Push 后 GitHub Actions 自动重建 `index.json`，零运维。

**Natural Language** — 所有操作通过对话完成。加载、下载、上传、删除——不需要记任何命令。

## Operations

所有操作均通过自然语言触发：

| Operation | Trigger | Description |
|-----------|---------|-------------|
| Load | *自动触发* | 从云端读取技能到内存，用完即弃 |
| Download | "下载 XX 技能" | 下载指定技能到本地 |
| Sync All | "下载所有技能" | 批量拉取全部技能 |
| Upload | "上传技能" | 创建技能文件夹并 push |
| Update | "更新 XX 技能" | 修改已有技能内容并 push |
| List | "列出技能" | 展示云端所有技能 |
| Delete | "删除 XX 技能" | 从仓库中移除技能 |
| Destroy | "删除整个仓库" | 需人工操作，AI 仅提供指引 |
| Packs | "安装 XX 组合包" | 从 [AnySkill-Packs](https://github.com/lanyijianke/AnySkill-Packs) 批量安装 |

## Architecture

```
  Your Project                          Your Private Repo (GitHub)
 ┌──────────────────┐                  ┌──────────────────────────────┐
 │                  │   load     ◀──── │  index.json ← auto-built    │
 │  .anyskill.json  │   download ◀──── │  skills/                    │
 │  + SKILL.md      │   sync     ◀──── │    frontend-design/SKILL.md │
 │                  │   upload   ────▶ │    my-crawler/              │
 │                  │   list     ◀──── │      SKILL.md               │
 │                  │                  │      scripts/run.py         │
 └──────────────────┘                  └──────────────────────────────┘
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

Push 后 GitHub Actions 自动更新索引，所有项目立即可用。

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
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=lanyijianke.anyskill) — GUI for managing skills
- [Issues & Feedback](https://github.com/lanyijianke/AnySkill/issues)

## License

[MIT](LICENSE)
