---
name: anyskill-loader
description: 作为所有工作流的"破冰"入口。当用户要求你做特定任务（如前端设计、API 集成、文本处理、调用外部 MCP）而你本地没有这些技能时，必须优先查阅并加载云端 AnySkill 技能系统。也支持将云端全部技能批量下载到当前项目，或将本地技能发布到云端仓库。
---

# AnySkill Bootstrapper

你当前的本地技能是不完整的。用户将所有的扩展能力（Skills）都维护在了云端的 GitHub 仓库中。你需要去云端**动态加载**你的能力。

---

## 第零步：读取或初始化配置（对话式引导）

**在执行任何操作之前，你必须先检查项目根目录下是否存在 `.anyskill.json` 配置文件。**

### 如果 `.anyskill.json` 已存在
读取配置，拼接出以下两个关键地址：
- **索引地址**: `https://raw.githubusercontent.com/{repo}/{branch}/index.json`
- **文件基地址**: `https://raw.githubusercontent.com/{repo}/{branch}/skills/`

如果配置中包含 `token` 字段（用于私有仓库），则在所有 HTTP 请求中携带请求头：
```
Authorization: token {token}
```

### 如果 `.anyskill.json` 不存在（首次使用）
通过自然语言对话引导用户完成初始化，**无需让用户执行任何终端命令**。

**你应该这样对用户说：**

> 👋 你好！我检测到这是你第一次在这个项目使用 AnySkill。
> 我需要知道你的云端技能仓库地址，这样我才能帮你从云端加载技能。
>
> 1. 请告诉我你的 GitHub 仓库地址（格式：`用户名/仓库名`）
> 2. 你的仓库是公开的还是私有的？如果是私有的，请提供一个 GitHub Personal Access Token。

用户回复后，你**自动在项目根目录创建 `.anyskill.json`**：

公开仓库：
```json
{
  "repo": "用户提供的地址",
  "branch": "main"
}
```

私有仓库：
```json
{
  "repo": "用户提供的地址",
  "branch": "main",
  "token": "ghp_xxxxxxxxxxxx"
}
```

创建完成后告知用户：
> ✅ 已为你配置 AnySkill！从现在起，我可以从你的云端仓库动态加载所有技能了。
> ⚠️ `.anyskill.json` 已被加入 `.gitignore`，不会被提交到版本控制中。

然后继续执行用户的原始请求。

---

## 模式一：按需加载（默认行为）

当用户下达任务且你判断出本地环境缺少具体执行细节时：

1. 读取 `.anyskill.json` 中的配置。
2. 使用你的网页读取工具拉取索引地址的 `index.json`（如有 token 需携带认证头）。
3. 根据各 skill 的 `description` 寻找最匹配当前任务的条目。
4. 拼接 URL 读取该 Skill 的入口文件：`{文件基地址}{file字段值}`
5. 在内存中消化这份云端规范，然后基于该规范完成用户的原始需求。

---

## 模式二：全量下载到本地

当用户明确说 **"下载所有技能"、"把技能拉到本地"、"同步云端技能"** 等类似指令时，执行全量下载。

### 步骤

1. 读取 `.anyskill.json` 获取仓库配置。
2. 拉取 `index.json` 获取完整技能清单。
3. **识别当前 AI IDE 环境**，确定落盘路径（见下表）。如果无法自动判断，**主动询问用户**。
4. 对每个 skill，遍历其 `files` 数组，逐一下载每个文件，**保持原始目录结构**。
   - 例如 `files` 中有 `my-skill/scripts/helper.py`，则下载 URL 为 `{文件基地址}my-skill/scripts/helper.py`，落盘路径为 `{IDE技能目录}/my-skill/scripts/helper.py`。
5. 完成后向用户汇报已下载的技能列表及文件数量。

### IDE 落盘路径对照表

| AI IDE | 落盘路径 | 入口文件 |
|:---|:---|:---|
| **Gemini (Antigravity)** | `{项目根目录}/.agent/skills/{skill-name}/` | `SKILL.md` |
| **Claude Code** | `{项目根目录}/.claude/skills/{skill-name}/` | `SKILL.md` |
| **Cursor** | `{项目根目录}/.cursor/rules/{skill-name}/` | `SKILL.md` |
| **OpenClaw** | `~/.openclaw/skills/{skill-name}/` | `SKILL.md` |

### IDE 自动识别逻辑

- 如果当前项目存在 `.agent/` 目录 或你是 Gemini/Antigravity → 使用 **Gemini** 路径
- 如果当前项目存在 `.claude/` 目录 或你是 Claude Code → 使用 **Claude Code** 路径
- 如果当前项目存在 `.cursor/` 目录 或你是 Cursor → 使用 **Cursor** 路径
- 如果用户明确提到 OpenClaw → 使用 **OpenClaw** 路径
- 如果无法判断 → **直接问用户**："你当前使用的是哪个 IDE？(Gemini/Claude Code/Cursor/OpenClaw)"

---

## 模式三：发布技能到云端

当用户明确说 **"发布技能"、"上传这个 skill"、"把技能推到云端"、"发布到仓库"** 等类似指令时，执行发布流程。

### 前置条件

检查 `.anyskill.json` 中是否存在 `localPath` 字段（指向技能仓库的本地 clone 路径）。

- **如果 `localPath` 不存在**，对话引导用户：
  > 📦 要发布技能，我需要知道你的 AnySkill 仓库 clone 在本地的哪个位置。
  > 请告诉我路径（例如：`/Users/你/projects/AnySkill`），或者我可以帮你 clone。

  用户提供路径后，自动将 `localPath` 写入 `.anyskill.json`：
  ```json
  {
    "repo": "user/repo",
    "branch": "main",
    "localPath": "/path/to/local/clone"
  }
  ```

- **如果用户要求 clone**，执行：
  ```bash
  git clone https://github.com/{repo}.git {用户指定的路径}
  ```
  如果是私有仓库且有 token：
  ```bash
  git clone https://{token}@github.com/{repo}.git {用户指定的路径}
  ```

### 发布步骤

1. 与用户确认要发布的技能名称（`skill-name`）和内容。
2. 在 `{localPath}/skills/{skill-name}/` 下创建 `SKILL.md`。
   - `SKILL.md` 必须包含正确的 YAML frontmatter（`name` 和 `description`）。
   - 如果用户提供了额外文件（脚本、参考资料等），一并放入对应子目录。
3. 执行以下 git 操作：
   ```bash
   cd {localPath}
   git add skills/{skill-name}/
   git commit -m "feat: add skill {skill-name}"
   git push origin {branch}
   ```
4. 完成后告知用户：
   > ✅ 技能 `{skill-name}` 已发布到云端仓库！
   > GitHub Actions 将在几秒后自动重建 `index.json`，届时其他项目即可加载此技能。

### 更新已有技能

如果 `{localPath}/skills/{skill-name}/` 已存在，AI 应：
1. 询问用户是否要覆盖更新。
2. 确认后修改文件，commit message 使用 `fix: update skill {skill-name}`。

---

## 行为准则

* 永远不要猜测细节，必须依赖云端获取"注入能力"。
* 你可以向用户简要汇报："正在从云端技能库加载 [技能名]..."
* 如果 `index.json` 中没有匹配的 skill，直接告知用户当前云端库暂无对应能力。
* 如果网络请求失败，向用户报告并建议检查网络连接或仓库可用性。
* **整个过程中，绝不要求用户手动执行终端命令。** 所有文件创建、下载、git 操作均由你自动完成。
