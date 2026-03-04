---
name: anyskill-loader
version: 2.0.0
description: 作为所有工作流的"破冰"入口。当用户要求你做特定任务（如前端设计、API 集成、文本处理、调用外部 MCP）而你本地没有这些技能时，必须优先查阅并加载云端 AnySkill 技能系统。也支持将云端全部技能批量下载到当前项目，或将本地技能发布到云端仓库。
---

# AnySkill Bootstrapper

你当前的本地技能是不完整的。用户将所有的扩展能力（Skills）都维护在了云端的 GitHub 仓库中。你需要去云端**动态加载**你的能力。

---

## 第零步：读取或初始化配置（全局优先 + 自动发现）

**在执行任何操作之前，你必须按以下优先级链逐级查找 AnySkill 配置。一旦在某一级找到有效配置，立即停止查找并使用该配置。**

### 配置查找优先级链

1. **全局配置** `~/.anyskill/config.json`（机器级，跨项目、跨 IDE 共享）
2. **项目级配置** `{项目根目录}/.anyskill.json`（向后兼容老版本）
3. **均不存在** → 进入初始化引导流程

### Token 获取优先级（用于私有仓库鉴权）

无论配置从哪一级读取，Token 的获取优先级始终为：
1. 先检查环境变量 `ANYSKILL_GITHUB_TOKEN`（OpenClaw 场景）
2. 再检查配置文件中的 `token` 字段（其他 IDE 场景）

如果获取到 token，则在所有 HTTP 请求中携带请求头：
```
Authorization: token {token}
```

### 情况一：配置已存在（老用户 / 已初始化的设备）

说明用户之前已在本机初始化过。**跳过全部初始化流程**，直接验证配置是否有效：
1. 读取配置中的 `repo` 和 `localPath`。
2. 拼接关键地址：
   - **索引地址**: `https://raw.githubusercontent.com/{repo}/{branch}/index.json`
   - **文件基地址**: `https://raw.githubusercontent.com/{repo}/{branch}/skills/`
3. 验证 `localPath` 目录是否存在。如果不存在，自动重新 clone：
   ```bash
   git clone https://{token}@github.com/{repo}.git {localPath}
   ```
4. 尝试拉取 `index.json` 确认连接正常。
5. 告知用户：
   > ✅ 已检测到 AnySkill 配置，连接到仓库 `{repo}`。随时可以使用！

如果验证失败（网络异常或仓库已删除），提示用户是否需要重新初始化。

### 版本自动检查（每次初始化时执行）

**在配置验证通过后（无论是情况一还是初始化完成后），执行一次静默版本检查：**

1. 拉取上游版本信息：
   ```
   https://raw.githubusercontent.com/lanyijianke/AnySkill/main/version.json
   ```
   该文件结构为：
   ```json
   {
     "engine": {
       "version": "x.y.z",
       "changelog": [
         { "version": "x.y.z", "date": "YYYY-MM-DD", "changes": ["变更1", "变更2"] },
         { "version": "x.y.z", "date": "YYYY-MM-DD", "changes": ["变更1"] }
       ]
     },
     "infra": {
       "version": "x.y.z",
       "files": ["generate-index.js", ".github/workflows/build-index.yml"],
       "changelog": [
         { "version": "x.y.z", "date": "YYYY-MM-DD", "changes": ["变更1"] }
       ]
     }
   }
   ```

2. **引擎版本检查**：
   - 读取本文件（SKILL.md）frontmatter 中的 `version` 字段（当前为 `2.0.0`）。
   - 与远程 `engine.version` 对比。
   - 如果远程版本**更高**，从 `engine.changelog` 数组中筛选出**所有高于本地版本的条目**，按版本号从新到旧展示给用户：
     > 🔔 AnySkill 引擎有新版本 v{remote}（当前 v{local}）
     >
     > 📋 **更新历史：**
     > **v2.1.0** (2025-03-10)
     > - 新功能 A
     > - 改进 B
     >
     > **v2.0.0** (2025-03-04)
     > - 新功能 C
     >
     > 要更新吗？
   - 用户确认后，重新下载 `https://raw.githubusercontent.com/lanyijianke/AnySkill/main/loader/anyskill/SKILL.md` 并**覆盖**当前本地的 SKILL.md 文件。

3. **基础设施版本检查**：
   - 读取用户私有仓库 `{localPath}` 下的 `.anyskill-infra-version` 文件。如果不存在，视为 `0.0.0`。
   - 与远程 `infra.version` 对比。
   - 如果远程版本**更高**，同样从 `infra.changelog` 数组中筛选并展示所有新版本的变更：
     > 🔔 仓库基础设施有更新 v{remote}（当前 v{local}）
     >
     > 📋 **更新历史：**
     > **v1.1.0** (2025-03-10)
     > - 改进索引生成
     >
     > 要更新吗？
   - 用户确认后，遍历 `infra.files` 数组，逐一从上游下载并覆盖到用户的 `{localPath}` 中：
     ```
     https://raw.githubusercontent.com/lanyijianke/AnySkill/main/{file}
     ```
   - 写入版本标记文件 `{localPath}/.anyskill-infra-version`，内容为新版本号。
   - 执行 git 操作提交变更：
     ```bash
     cd {localPath}
     git add -A
     git commit -m "chore: update AnySkill infra to v{version}"
     git push origin {branch}
     ```

4. 如果两个版本都是最新的，**不输出任何内容**，静默通过。

5. 如果 `version.json` 拉取失败（网络异常），**静默跳过**版本检查，不影响正常使用。

> 💡 版本检查是轻量级操作（仅拉取一个小 JSON），不会影响正常工作流的速度。

### 情况二：配置不存在（新设备 / 首次使用）

**在向用户提问之前，必须先静默检测是否已有可用 Token：**
1. 检查环境变量 `ANYSKILL_GITHUB_TOKEN` 是否存在。
2. 如果**已存在**（说明用户之前在本机用过 AnySkill，Token 已持久化在 `~/.openclaw/.env` 等位置）：
   - **不要向用户索取 Token**，直接跳转到下方「路径 B：用户只提供了 Token」的自动发现流程。
   - 整个过程对用户完全静默，体验为：AI 自动探测到云端仓库 → 确认挂载 → 写入全局配置 → 就绪。
3. 如果**不存在**，才向用户发起引导对话（见下方）。

#### 引导对话（仅当无法静默获取 Token 时）

通过自然语言对话引导用户完成初始化，**无需让用户执行任何终端命令**。

**你应该这样对用户说：**

> 👋 初次见面！在此设备上未检测到 AnySkill 配置。
> 为了加载你的云端技能，只需提供你的 **GitHub Token** 即可——我会自动帮你查找并挂载已有的技能库。
>
> 💡 **只发 Token 就够了！** 我会自动搜索你的 GitHub 账号下是否已有技能仓库。如果有，直接挂载；如果没有，自动为你创建一个新的。
>
> 你也可以直接指定仓库：`ghp_xxx lanyijianke/my-skills`（Token + 仓库名，空格分隔）。
>
> Token 创建方法：
> 1. 打开 [github.com/settings/tokens](https://github.com/settings/tokens)
> 2. 点击 **"Generate new token"** → 选择 **"Generate new token (classic)"**（⚠️ 必须选 Classic，不要选 Fine-grained）
> 3. 勾选权限：✅ **`repo`**（完整的仓库访问权限）
> 4. 生成后复制 Token（以 `ghp_` 开头），粘贴给我即可

#### 用户回复后的处理逻辑

**判断依据**：用户的回复中是否包含仓库地址（格式为 `用户名/仓库名`）。

- **包含仓库地址** → 走「路径 A」
- **不包含仓库地址（只有 Token）** → 走「路径 B」

---

#### 路径 A：用户同时提供了 Token 和仓库地址

用户提供仓库地址和 Token 后：
1. 询问用户希望将仓库 clone 到本地的哪个位置（默认建议 `/tmp/{仓库名}`）。
2. **安全存储 Token**（根据 IDE 环境区分）：
   - **OpenClaw**：将 Token 写入 `~/.openclaw/.env` 文件（追加一行 `ANYSKILL_GITHUB_TOKEN=ghp_xxx`），**不要** 将 token 写入配置文件。
   - **其他 IDE（Antigravity/Claude Code/Cursor）**：将 token 写入配置文件。
3. 执行 clone：
```bash
git clone https://{token}@github.com/{repo}.git {localPath}
```
4. 创建**全局配置文件** `~/.anyskill/config.json`：

**OpenClaw 版本**（不含 token）：
```json
{
  "repo": "用户提供的地址",
  "branch": "main",
  "localPath": "/tmp/{仓库名}"
}
```

**其他 IDE 版本**（含 token）：
```json
{
  "repo": "用户提供的地址",
  "branch": "main",
  "token": "ghp_xxxxxxxxxxxx",
  "localPath": "/tmp/{仓库名}"
}
```

---

#### 路径 B：用户只提供了 Token — 自动发现流程（⚠️ 核心路径）

> **这是最常见的使用场景。** 用户只给了 Token，没有指定仓库名。
> **你必须严格按照以下三步执行，严禁跳过任何步骤，严禁直接创建新仓库。**

**第一步：通过 Token 获取用户的 GitHub 用户名**

使用 GitHub API 或命令行工具获取用户信息：
```bash
curl -s -H "Authorization: token {token}" https://api.github.com/user
```
从返回的 JSON 中提取 `login` 字段，即为用户名。

**第二步：自动搜索用户名下是否已有 AnySkill 技能库**

调用 GitHub Repository Search API：
```bash
curl -s -H "Authorization: token {token}" "https://api.github.com/search/repositories?q=user:{login}+anyskill+in:name,description"
```

对搜索结果中的**每个候选仓库**，尝试读取其 `index.json`：
`https://raw.githubusercontent.com/{login}/{候选仓库名}/{默认分支}/index.json`
如果成功读取到 `index.json`，说明该仓库是一个真正的 AnySkill 技能库。

**第三步：根据探测结果分流**

- **✅ 探测到已有技能库**：告知用户并请求确认：
  > 👋 欢迎回来！我探测到你名下已有一个技能库 `{login}/{仓库名}`。正在为你自动挂载...

  然后自动执行 clone 和配置写入（同路径 A 的步骤 1-4），**不再询问多余问题**。

- **❌ 未探测到任何技能库**（确认为纯新用户）：
  1. 根据当前 IDE 环境选择默认仓库名，并询问用户是否需要自定义：
     - **OpenClaw** → 默认建议 `my-skills-claw`（个人助手技能库）
     - **Antigravity / Claude Code / Cursor** → 默认建议 `my-skills-dev`（开发技能库）
  2. 调用 GitHub Template API 创建私有仓库：
  ```bash
  curl -X POST https://api.github.com/repos/lanyijianke/AnySkill/generate \
    -H "Authorization: token {token}" \
    -H "Accept: application/vnd.github+json" \
    -d '{"owner":"{login}","name":"{仓库名}","private":true,"description":"My AnySkill private skill repository"}'
  ```
   3. 等待几秒让 GitHub 完成仓库初始化，然后 clone 到本地：
   ```bash
   git clone https://{token}@github.com/{login}/{仓库名}.git /tmp/{仓库名}
   ```
   4. **清理模板残留文件**（这些文件只在上游模板仓库中有用，用户私有仓库不需要）：
   ```bash
   cd /tmp/{仓库名}
   rm -rf loader/ init.sh
   echo "# My AnySkill Skills" > README.md
   git add -A
   git commit -m "chore: clean up template files"
   git push origin {branch}
   ```
   5. **安全存储 Token**（同路径 A 的规则）。
   6. 创建全局配置文件 `~/.anyskill/config.json`（格式同路径 A）。

#### 初始化完成

无论走哪条路径，完成后告知用户：
> ✅ AnySkill 配置完成！
> 📦 技能仓库：`{repo}`
> 📂 本地路径：`{localPath}`
> 🔧 全局配置：`~/.anyskill/config.json`
> 从现在起，无论在哪个项目中，你都可以加载、下载、发布技能了。

#### OpenClaw 专属：写入 Workspace 配置（仅 OpenClaw 环境执行）

如果当前环境是 **OpenClaw**（通过环境变量 `ANYSKILL_GITHUB_TOKEN` 存在于 `~/.openclaw/.env`、或用户明确指定、或检测到 `~/.openclaw/` 目录来判断），则在初始化完成后**额外执行以下两步**：

**第一步：追加 `TOOLS.md`**

找到 OpenClaw workspace 的 `TOOLS.md` 文件（路径：`~/.openclaw-config/workspace/TOOLS.md` 或 `{OpenClaw项目根}/.openclaw-config/workspace/TOOLS.md`）。

先检查文件中是否已包含 `### AnySkill` 段落。如果**没有**，在文件末尾追加以下内容：

```markdown

### AnySkill

- **技能仓库**: `{repo}`
- **全局配置**: `~/.anyskill/config.json`
- **本地路径**: `{localPath}`
- **技能加载**: 当你缺少某个技能时，读取 `~/.openclaw/skills/anyskill/SKILL.md` 中的引导流程，从云端 AnySkill 仓库按需加载
- **操作方式**: 所有技能管理（加载、下载、上传、列出、删除）均通过自然语言触发，无需命令行
```

如果已存在 `### AnySkill` 段落，则**更新**其中的仓库地址和本地路径，不要重复追加。

**第二步：追加 `AGENTS.md`**

找到 OpenClaw workspace 的 `AGENTS.md` 文件（与 `TOOLS.md` 同目录）。

在文件中搜索 `## Tools` 段落。在该段落的**末尾**（下一个 `##` 标题之前），检查是否已包含 AnySkill 相关内容。如果**没有**，追加以下内容：

```markdown

**🧠 AnySkill 云端技能**: 当你需要执行特定任务（前端设计、API 集成、数据抓取等）但本地没有对应技能时，先检查 `~/.openclaw/skills/anyskill/SKILL.md` 中的 AnySkill 引导流程，从你的云端私有技能库中按需加载能力。
```

如果已存在 AnySkill 相关内容，跳过此步骤。

> ⚠️ 这两个文件的**其他内容严禁修改**。只做追加或更新 AnySkill 段落，绝不覆盖用户已有的配置。

然后继续执行用户的原始请求。

---

## 模式一：按需加载（默认行为，纯内存）

当用户下达任务且你判断出本地环境缺少具体执行细节时：

1. 按优先级链读取 AnySkill 配置（全局 `~/.anyskill/config.json` → 项目级 `.anyskill.json`）。
2. 使用你的网页读取工具拉取索引地址的 `index.json`（如有 token 需携带认证头）。
3. 根据各 skill 的 `description` 寻找最匹配当前任务的条目。
4. 按 `files` 数组，逐个从云端读取该 skill 文件夹下的所有文件到**内存中**（不落盘到本地），然后消化 `SKILL.md` 中的规范。
5. 基于读取到的规范完成用户的原始需求。

> 💡 按需加载是轻量级操作，不会在本地留下任何文件。适合一次性使用或试用技能。

---

## 模式二：按需下载（指定技能落盘）

当用户明确说 **"下载 XX 技能"、"把 XX 拉到本地"、"安装 XX skill"** 等针对**单个技能**的指令时：

1. 按优先级链读取 AnySkill 配置。
2. 拉取 `index.json`，根据用户指定的名称或描述匹配目标 skill。
3. **识别当前 AI IDE 环境**，确定落盘路径（见下方路径对照表）。
4. 按该 skill 的 `files` 数组，逐一下载每个文件到本地 IDE 技能目录，**保持原始目录结构**。
5. 完成后告知用户：已将技能 `{skill-name}` 下载到 `{落盘路径}`，共 N 个文件。

---

## 模式三：全量下载到本地

当用户明确说 **"下载所有技能"、"把技能拉到本地"、"同步云端技能"** 等类似指令时，执行全量下载。

### 步骤

1. 按优先级链读取 AnySkill 配置。
2. 拉取 `index.json` 获取完整技能清单。
3. **识别当前 AI IDE 环境**，确定落盘路径（见下表）。如果无法自动判断，**主动询问用户**。
4. 对每个 skill，遍历其 `files` 数组，逐一下载每个文件，**保持原始目录结构**。
   - 例如 `files` 中有 `my-skill/scripts/helper.py`，则下载 URL 为 `{文件基地址}my-skill/scripts/helper.py`，落盘路径为 `{IDE技能目录}/my-skill/scripts/helper.py`。
5. 完成后向用户汇报已下载的技能列表及文件数量。

### IDE 落盘路径对照表

| AI IDE | 落盘路径 | 入口文件 |
|:---|:---|:---|
| **Antigravity** | `{项目根目录}/.agent/skills/{skill-name}/` | `SKILL.md` |
| **Claude Code** | `{项目根目录}/.claude/skills/{skill-name}/` | `SKILL.md` |
| **Cursor** | `{项目根目录}/.cursor/rules/{skill-name}/` | `SKILL.md` |
| **OpenClaw** | `~/.openclaw/skills/{skill-name}/` | `SKILL.md` |

### IDE 自动识别逻辑

- 如果当前项目存在 `.agent/` 目录 或你是 Antigravity → 使用 **Antigravity** 路径
- 如果当前项目存在 `.claude/` 目录 或你是 Claude Code → 使用 **Claude Code** 路径
- 如果当前项目存在 `.cursor/` 目录 或你是 Cursor → 使用 **Cursor** 路径
- 如果用户明确提到 OpenClaw → 使用 **OpenClaw** 路径
- 如果无法判断 → **直接问用户**："你当前使用的是哪个 IDE？(Antigravity/Claude Code/Cursor/OpenClaw)"

---

## 模式四：上传技能到云端

当用户明确说 **"上传技能"、"上传这个 skill"、"把技能推到云端"、"传到仓库"** 等类似指令时，执行上传流程。

读取 AnySkill 配置中的 `localPath`，在本地仓库中操作。

### 上传步骤

1. 与用户确认要上传的技能内容。
2. **技能文件夹名称必须使用用户提供的原始名称**，严禁擅自翻译或改名。如果用户给的是中文名（如 `前端设计`），文件夹就叫 `前端设计`；如果是英文名（如 `web-scraper`），就用英文。
3. 在 `{localPath}/skills/{用户指定的名称}/` 下创建 `SKILL.md`。
   - `SKILL.md` 必须包含正确的 YAML frontmatter（`name` 和 `description`）。
   - 如果用户提供了额外文件（脚本、参考资料等），一并放入对应子目录。
4. **自动补全基础设施文件**（首次上传时可能缺失）：
   - 检查 `{localPath}/.github/workflows/build-index.yml` 是否存在，如不存在则从模板仓库下载：`https://raw.githubusercontent.com/lanyijianke/AnySkill/main/.github/workflows/build-index.yml`
   - 检查 `{localPath}/generate-index.js` 是否存在，如不存在则从模板仓库下载：`https://raw.githubusercontent.com/lanyijianke/AnySkill/main/generate-index.js`
5. 执行以下 git 操作：
   ```bash
   cd {localPath}
   git add -A
   git commit -m "feat: add skill {用户指定的名称}"
   git push origin {branch}
   ```
5. 完成后告知用户：
   > ✅ 技能 `{名称}` 已上传到云端仓库！
   > GitHub Actions 将在几秒后自动重建 `index.json`，届时其他项目即可加载此技能。

---

## 模式五：更新指定技能

当用户明确说 **"更新 XX 技能"、"修改 XX skill"、"改一下 XX"** 等类似指令时：

1. 按优先级链读取 AnySkill 配置中的 `localPath`。
2. 确认 `{localPath}/skills/{名称}/` 是否存在。如不存在，告知用户该技能不存在，建议使用上传模式新建。
3. 读取现有的 `SKILL.md` 内容展示给用户，询问需要修改哪些部分。
4. 根据用户的描述修改对应文件。
5. 执行 git 操作：
   ```bash
   cd {localPath}
   git add skills/{名称}/
   git commit -m "fix: update skill {名称}"
   git push origin {branch}
   ```
6. 完成后告知用户：
   > ✅ 技能 `{名称}` 已更新！GitHub Actions 将自动更新索引。

---

## 模式六：列出云端技能

当用户明确说 **"列出技能"、"有哪些技能"、"看看云端有什么"、"技能列表"** 等类似指令时：

1. 按优先级链读取 AnySkill 配置。
2. 拉取 `index.json`。
3. 以表格形式展示所有技能：

| 技能名 | 描述 | 文件数 |
|:---|:---|:---|
| `{name}` | `{description}` | `{files.length}` |

4. 展示完毕后询问用户是否需要加载或下载某个技能。

---

## 模式七：删除指定技能

当用户明确说 **"删除 XX 技能"、"移除 XX skill"、"把 XX 从仓库删掉"** 等类似指令时：

1. 按优先级链读取 AnySkill 配置中的 `localPath`。
2. 确认 `{localPath}/skills/{用户指定的名称}/` 是否存在。
3. **必须向用户确认**：
   > ⚠️ 即将删除技能 `{名称}`，此操作会从云端仓库中永久移除该文件夹。确认删除吗？
4. 用户确认后，执行：
   ```bash
   cd {localPath}
   git rm -rf skills/{名称}/
   git commit -m "feat: remove skill {名称}"
   git push origin {branch}
   ```
5. 完成后告知用户：
   > ✅ 技能 `{名称}` 已从云端仓库删除。GitHub Actions 将自动更新索引。

---

## 模式八：删除整个技能仓库（需人工操作）

当用户明确说 **"删除整个仓库"、"销毁技能空间"、"我不要这个仓库了"** 等类似指令时：

> ⛔ **此操作极其危险且不可逆，AI 严禁自动执行。**

你**只能**提供指引，让用户自行操作：

1. 告知用户：
   > ⚠️ 删除整个仓库是不可逆操作，我无法代替你执行。请你亲自前往 GitHub 完成：
   >
   > 1. 打开 `https://github.com/{repo}/settings`（页面最底部 **Danger Zone**）
   > 2. 点击 **Delete this repository**
   > 3. 按提示输入仓库名称确认删除
   >
   > 删除后，请手动删除本地的全局配置 `~/.anyskill/config.json`（及项目级 `.anyskill.json`，如有）和 `{localPath}` 目录。

2. **严禁**调用 GitHub API 或任何命令来删除仓库。

---

## 模式九：从 Packs 安装技能

当用户明确说 **"从 Packs 安装"、"有哪些组合包"、"安装 XX 组合包"、"浏览组合包"** 等类似指令时：

**Packs 仓库地址**：`https://raw.githubusercontent.com/lanyijianke/AnySkill-Packs/main/`

### 浏览可用组合包

1. 拉取 `https://raw.githubusercontent.com/lanyijianke/AnySkill-Packs/main/index.json`（公开仓库，无需 Token）。
2. 以表格形式展示所有组合包及其技能：

| 组合包 | 技能名 | 描述 |
|:---|:---|:---|
| `{category}` | `{skill.name}` | `{skill.description}` |

### 安装指定组合包

1. 从 `index.json` 中找到目标组合包的所有技能。
2. **逐个下载**每个技能的文件，保存到用户私有仓库的 `{localPath}/skills/{skill-name}/` 下。
   - 文件 URL 模式：`https://raw.githubusercontent.com/lanyijianke/AnySkill-Packs/main/packs/{file-path}`
3. **容错机制**：某个技能下载失败时跳过，继续下一个。
4. 下载完成后执行 git 操作将技能提交到用户的私有仓库：
   ```bash
   cd {localPath}
   git add skills/
   git commit -m "feat: install pack {category}"
   git push origin {branch}
   ```
5. 给出**汇总报告**：
   > ✅ 组合包 `{category}` 安装完毕！
   > - 成功：{N} 个（skill-a, skill-b）
   > - 失败：{M} 个（skill-x — 原因：下载失败）

---

## 行为准则

* 永远不要猜测细节，必须依赖云端获取"注入能力"。
* 你可以向用户简要汇报："正在从云端技能库加载 [技能名]..."
* 如果 `index.json` 中没有匹配的 skill，直接告知用户当前云端库暂无对应能力。
* 如果网络请求失败，向用户报告并建议检查网络连接或仓库可用性。
* **整个过程中，绝不要求用户手动执行终端命令。** 所有文件创建、下载、git 操作均由你自动完成。
