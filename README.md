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

1. 在你的开发项目中，对 AI 说 **"帮我安装 AnySkill"**。
2. AI 自动安装破冰者，并通过对话引导你创建或绑定你的**私有**技能仓库。
3. 在你的私有仓库 `skills/` 下放入技能文件夹，push 后 GitHub Actions 自动生成 `index.json`。
4. AI 助手从**你自己的私有仓库**动态加载技能，你的 Skill 内容不会暴露。

## 快速上手

### 一句话搞定一切

打开你的 AI IDE，复制这段话发给 AI：

> 从 `https://github.com/lanyijianke/AnySkill` 下载 `loader/anyskill/SKILL.md` 到本项目的技能目录，然后阅读并执行里面的初始化引导流程

AI 会自动完成全部流程：
1. 下载破冰者文件并安装到正确的 IDE 目录
2. 通过对话引导你完成初始化配置：
   - **如果你已有私有技能仓库** → 输入仓库地址和 Token
   - **如果还没有** → 提供 GitHub Token，AI 自动帮你创建一个私有仓库

### 其他安装方式

**手动复制**：将 `loader/anyskill/SKILL.md` 放到对应 IDE 路径：

| AI IDE | 放置路径 |
|:---|:---|
| Gemini (Antigravity) | `.agent/skills/anyskill/SKILL.md` |
| Claude Code | `.claude/skills/anyskill/SKILL.md` |
| Cursor | `.cursor/rules/anyskill/SKILL.md` |
| OpenClaw | `~/.openclaw/skills/anyskill/SKILL.md` |

**命令行**：
```bash
curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
```

### 添加你自己的技能

在你的私有仓库中，删除示例文件夹 `skills/hello-world/`，创建你自己的技能文件夹：

## 四种模式

| 模式 | 触发方式 | 说明 |
|:---|:---|:---|
| **按需加载** | 给 AI 下达任务时自动触发 | 从云端读取 Skill 到内存，不落盘，一次性使用 |
| **按需下载** | "下载 XX 技能" / "安装 XX skill" | 下载指定 Skill 文件夹到本地 IDE 技能目录 |
| **全量下载** | "下载所有技能" / "同步云端技能" | 把所有 Skill 完整下载到本地 |
| **上传技能** | "上传技能" / "把技能推到云端" | 在本地仓库创建 Skill 文件夹并 git push |

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
