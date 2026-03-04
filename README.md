# AnySkill 🧠

**一个 Skill，统治所有项目。**

AnySkill 是一个面向 AI 编程助手的云端技能分发系统。你只需维护一个私有技能仓库，在每个项目中部署一个破冰者文件，AI 助手就能按需从云端动态加载能力。

## 工作原理

```
┌─────────────────┐     ┌──────────────────────────────┐
│  你的项目         │     │  你的私有技能仓库 (GitHub)     │
│                  │     │                              │
│  .anyskill.json  │     │  index.json  ← 自动构建       │
│  + 破冰者 SKILL  │────▶│  skills/                     │
│                  │     │    frontend-design.md        │
│                  │     │    opentwitter/SKILL.md      │
│                  │     │    ...                       │
└─────────────────┘     └──────────────────────────────┘
```

1. **用本仓库作为 GitHub Template**，创建你自己的**私有**技能仓库。
2. 在你的私有仓库 `skills/` 下放入你的技能文件，push 后 GitHub Actions 自动生成 `index.json`。
3. 在你的开发项目中放入破冰者 `SKILL.md`，AI 会通过对话引导你完成初始化配置。
4. AI 助手从**你自己的私有仓库**动态加载技能，你的 Skill 内容不会暴露。

## 快速上手

### 1. 创建你的私有技能仓库

点击 GitHub 页面上的 **"Use this template"** → **"Create a new repository"** → 选择 **Private**。

### 2. 添加你的技能

在你的新仓库中，删除示例文件 `skills/hello-world.md`，放入你自己的 Skill 文件。

支持两种结构：

**单文件模式：**
```
skills/my-skill.md
```

**文件夹模式（含脚本/参考资料）：**
```
skills/my-skill/
├── SKILL.md          # 主文件（必须）
├── reference.md      # 可选
└── scripts/          # 可选
```

每个 Skill 必须包含 YAML frontmatter：
```yaml
---
name: my-skill
description: 这个 Skill 做什么、什么时候触发。
---
```

Push 后 GitHub Actions 自动更新 `index.json`。

### 3. 在项目中安装破冰者

**方式 A：对 AI 说一句话（最懒 👑）**

打开你的 AI IDE，直接说：

> "帮我安装 AnySkill，从 https://raw.githubusercontent.com/lanyijianke/AnySkill/main/loader/anyskill/SKILL.md 下载破冰者到本项目"

AI 会自动判断 IDE 类型、创建目录、下载文件。你什么都不用做。

**方式 B：手动复制**

将 `loader/anyskill/SKILL.md` 复制到你的开发项目中对应的路径：

| AI IDE | 放置路径 |
|:---|:---|
| Gemini (Antigravity) | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill-loader.mdc` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**方式 C：命令行**

```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

首次使用时，AI 会自动通过对话引导你完成配置（输入仓库地址和 token）。

## 私有仓库鉴权

如果你的技能仓库是私有的，初始化时 AI 会引导你提供 GitHub Personal Access Token。配置文件 `.anyskill.json` 已在 `.gitignore` 中，**不会被提交到版本控制**。

## 仓库结构说明

```
AnySkill/                         # ← 你看到的这个公开模板仓库
├── .github/workflows/
│   └── build-index.yml           # GitHub Actions: 自动重建 index.json
├── generate-index.js             # 索引生成脚本 (零依赖 Node.js)
├── init.sh                       # 命令行安装脚本 (可选)
├── loader/anyskill/
│   └── SKILL.md                  # 破冰者 (放到你的项目里的那个文件)
├── skills/                       # 你的技能文件放这里
│   └── hello-world.md            # 示例，可删除
├── README.md
└── .gitignore
```

## 许可证

MIT
