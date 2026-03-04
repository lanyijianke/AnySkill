# AnySkill 🧠

**一个 Skill，统治所有项目。**

AnySkill 是一个面向 AI 编程助手的云端技能分发系统。你只需维护一个私有技能仓库，在每个项目中部署一个破冰者文件，AI 助手就能按需从云端动态加载能力，也能通过自然语言将新技能发布到云端。

## 工作原理

```
┌─────────────────┐     ┌──────────────────────────────┐
│  你的项目         │     │  你的私有技能仓库 (GitHub)     │
│                  │     │                              │
│  .anyskill.json  │     │  index.json  ← 自动构建       │
│  + 破冰者 SKILL  │◀──▶│  skills/                     │
│                  │     │    opentwitter/SKILL.md      │
│  按需加载 ←──────│─────│    my-crawler/               │
│  全量下载 ←──────│─────│      SKILL.md                │
│  发布技能 ──────▶│─────│      scripts/run.py          │
└─────────────────┘     └──────────────────────────────┘
```

1. **用本仓库作为 GitHub Template**，创建你自己的**私有**技能仓库。
2. 在你的私有仓库 `skills/` 下放入你的技能文件夹，push 后 GitHub Actions 自动生成 `index.json`。
3. 在你的开发项目中放入破冰者 `SKILL.md`，AI 会通过对话引导你完成初始化配置。
4. AI 助手从**你自己的私有仓库**动态加载技能，你的 Skill 内容不会暴露。

## 快速上手

### 1. 安装破冰者（第一步必须从官方仓库安装）

在你的日常开发项目中，你需要先注入 AnySkill 引擎。

**方式 A：对 AI 说一句话（最懒 👑）**

打开你的 AI IDE，直接说这句固定口令：

> "帮我安装 AnySkill，仓库地址：`lanyijianke/AnySkill`"

AI 会自动从官方公开库下载破冰者文件并建好目录。你什么都不用做。
> ⚠️ **注意：这里必须使用官方地址 `lanyijianke/AnySkill`，绝对不要改成你自己的仓库名**，否则会报错 404！

**方式 B：手动复制**

将本仓库中的 `loader/anyskill/SKILL.md` 复制到你的开发项目中对应的路径：

| AI IDE | 放置路径 |
|:---|:---|
| Gemini (Antigravity) | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill/SKILL.md` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**方式 C：命令行**

```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

### 2. 创建你自己的私有技能仓库

破冰者安装好后，你需要一个独立的地方来存放你个人的技能代码。

1. 点击本页面上方的 **"Use this template"** → **"Create a new repository"**。
2. 选择 **Private** 创建为私有仓库（比如起名叫 `myname/my-skills`）。
3. 回到你的开发项目中，随便对 AI 说点什么，AI 会发现你是首次使用，**通过自然语言引导你绑定刚才创建的私有仓库地址和 Token**。

### 3. 给你的仓库添加技能

在你的私有仓库中，删除示例文件夹 `skills/hello-world/`，创建你自己的技能文件夹：

## 三种模式

| 模式 | 触发方式 | 说明 |
|:---|:---|:---|
| **按需加载** | 给 AI 下达任务时自动触发 | AI 从云端读取匹配的 Skill 到内存 |
| **全量下载** | "下载所有技能" / "同步云端技能" | 把所有 Skill 完整下载到本地（含子文件夹） |
| **发布技能** | "发布技能" / "把技能推到云端" | 在本地仓库创建 Skill 文件夹并 git push |

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
├── skills/                       # 你的技能文件夹放这里
│   └── hello-world/              # 示例，可删除
│       └── SKILL.md
├── index.json                    # 自动生成，勿手动编辑
├── README.md
└── .gitignore
```

## 许可证

MIT
