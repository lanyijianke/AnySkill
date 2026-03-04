---
name: project-update
description: 通用的文档与代码同步框架。当代码库发生变更（重构、新功能、升级）时使用，以标准化 Agent Skills 和项目文档的更新流程。
---

# Project Update Assistant

一个通用的、基于规则的“文档即代码 (Docs as Code)”同步生态框架。确保文档永远忠实地反映代码库的现状。

## Description

本技能自动化了从代码变更（事实来源）到文档（Agent Skills/Docs）的传导过程。它通过强制执行闭环更新流程，防止文档随着代码修改而过时。

## Trigger Conditions

**在以下情况使用本技能：**
- 代码库发生了变更 (Git diff > 0)
- 发生了重构 (类重命名、文件移动)
- 添加了新功能
- 技术栈升级
- 配置或环境变量发生了变化

## Workflow

### Step 1: Change Analysis (Source of Truth)
识别代码里发生了什么：
1.  **Files**: 哪些文件变了？(`git diff --name-only`)
2.  **Type**: 配置？架构？逻辑？环境？

### Step 2: Skill Mapping
将变更映射到文档：
- **Scan**: 扫描 `.agent/skills/` wide 和 `docs/`。
- **Associate**: “哪个文档描述了这个被修改的逻辑？”
- **Decision**: 更新现有文档 vs 创建新技能。

### Step 3: Iterative Update
对每个目标文档：
1.  **Extract Context**: 读取现有的 frontmatter 和结构。
2.  **Align with Code**: 用新的代码现状替换旧参数/路径/逻辑。
3.  **Consistency**: 验证版本号、库名称和命名的一致性。

### Step 4: Verification
1.  **Links**: 检查 `file:///` 引用是否有效。
2.  **Triggers**: 更新 `description` 中的关键词以匹配新术语。
3.  **Preview**: 确保 Markdown 语法有效。

### Step 5: Exception Handling
- **No Doc Found**: 提议创建一个新 Skill。
- **Conflict**: 代码为准。更新文档以匹配代码，并备注冲突点。

## Generic Trigger Matrix

| 代码变更特征 | 建议更新的文档/技能 |
| :--- | :--- |
| `Makefile`, `Taskfile`, `.sh` | 部署、自动化、运维技能 |
| `package.json`, `.csproj`, `go.mod` | 技术栈、架构、环境 |
| `README.md`, `ARCHITECTURE.md` | 主入口、高层设计 |
| 核心算法 / 内部逻辑 | 逻辑规范、计算指南 |
| API 定义 (Swagger/Proto) | API 规范、接口协议 |

## Usage Examples

### Example 1: Modified Deployment Script
**Context**: 用户修改 `start.sh`，将端口从 3000 改为 8080。
**Action**:
1.  **Detect**: `start.sh` 变动。
2.  **Map**: 找到 `deployment.md` 或 `ops-skill.md`。
3.  **Update**: 将文档中的 "Port 3000" 替换为 "Port 8080"。

### Example 2: Renamed a Core Class
**Context**: 将 `UserHandler` 重命名为 `AccountManager`。
**Action**:
1.  **Detect**: `UserHandler.cs` -> `AccountManager.cs`.
2.  **Map**: 在所有 skill 中搜索 `UserHandler` 的严格引用。
3.  **Update**: 批量替换引用以保留上下文。

## Important Notes

1.  **Code is Truth**: 永远不要相信注释或旧文档，只相信代码本身。
2.  **Closed Loop**: 文档没更新，通过就不算完成。
3.  **Minimal Diff**: 如果只变了一行，不要重写整个文档（除非结构需要）。
