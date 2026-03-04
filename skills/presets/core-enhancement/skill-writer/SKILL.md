---
name: skill-writer
description: 指导用户为 Claude Code 创建 Agent Skills。当用户想要创建、编写、创作或设计新的 Skill，或者在 SKILL.md 文件、Frontmatter 或 Skill 结构方面需要帮助时使用。
---

# 技能写手 (Skill Writer)

此技能通过遵循最佳实践和验证要求，帮助你为 Claude Code 创建结构良好的 Agent Skills。

## 何时使用此技能

当遇到以下情况时使用此技能：
- 创建新的 Agent Skill
- 编写或更新 SKILL.md 文件
- 设计 Skill 的结构和 Frontmatter
- 排查 Skill 发现问题
- 将现有的提示词或工作流转换为 Skills

## 说明

### 第 1 步：确定 Skill 范围

首先，了解 Skill 应该做什么：

1. **提出澄清问题**：
   - 此 Skill 应提供什么具体能力？
   - Claude 何时应该使用此 Skill？
   - 它需要什么工具或资源？
   - 这是供个人使用还是团队共享？

2. **保持专注**：一个 Skill = 一个能力
   - 好：“PDF 表单填写”、“Excel 数据分析”
   - 此范围太广：“文档处理”、“数据工具”

### 第 2 步：选择 Skill 位置

确定在哪里创建 Skill：

**个人 Skills** (`~/.gemini/antigravity/skills`):
- 个人工作流和偏好
- 实验性 Skills
- 个人生产力工具

**项目 Skills** (`.agent/skills/`):
- 团队工作流和约定
- 项目特定的专业知识
- 共享实用程序（提交到 git）

### 第 3 步：创建 Skill 结构

# 个人
mkdir -p ~/.gemini/antigravity/skills/skill-name

# 项目
mkdir -p /.agent/skills

对于多文件 Skills：
```
skill-name/
├── SKILL.md (必须)
├── reference.md (可选)
├── examples.md (可选)
├── scripts/
│   └── helper.py (可选)
└── templates/
    └── template.txt (可选)
```

### 第 4 步：编写 SKILL.md Frontmatter

使用必填字段创建 YAML Frontmatter：

```yaml
---
name: skill-name
description: 简要描述它的功能以及何时使用它
---
```

**字段要求**：

- **name**:
  - 仅限小写字母、数字、连字符
  - 最多 64 个字符
  - 必须与目录名称匹配
  - 好：`pdf-processor`, `git-commit-helper`
  - 坏：`PDF_Processor`, `Git Commits!`

- **description**:
  - 最多 1024 个字符
  - 同时包含它**做什么**以及**何时使用**
  - 使用用户会说的特定触发词
  - 提及文件类型、操作和上下文

**可选 Frontmatter 字段**：

- **allowed-tools**: 限制工具访问（逗号分隔列表）
  ```yaml
  allowed-tools: Read, Grep, Glob
  ```
  用于：
  - 只读 Skills
  - 安全敏感工作流
  - 范围受限的操作

### 第 5 步：编写有效的描述

描述对于 Claude 发现你的 Skill 至关重要。

**公式**: `[它做什么] + [何时使用] + [关键触发词]`

**示例**:

✅ **好**:
```yaml
description: 从 PDF 文件中提取文本和表格，填写表单，合并文档。当处理 PDF 文件或当用户提及 PDF、表单或文档提取时使用。
```

✅ **好**:
```yaml
description: 分析 Excel 电子表格，创建数据透视表，并生成图表。当处理 Excel 文件、电子表格或分析 .xlsx 格式的表格数据时使用。
```

❌ **太模糊**:
```yaml
description: 帮助处理文档
description: 用于数据分析
```

**提示**:
- 包含具体的文件扩展名 (.pdf, .xlsx, .json)
- 提及常见的用户短语（“分析”、“提取”、“生成”）
- 列出具体的操作（而不是通用的动词）
- 添加上下文线索（“当...时使用”、“用于...”）

### 第 6 步：构建 Skill 内容

使用清晰的 Markdown 章节：

```markdown
# Skill 名称

简要概述此 Skill 做什么。

## 快速开始

提供一个简单的示例以便立即开始。

## 说明

为 Claude 提供的分步指导：
1. 第一步，包含清晰的动作
2. 第二步，包含预期的结果
3. 处理边缘情况

## 示例

展示具体的用法示例，包含代码或命令。

## 最佳实践

- 要遵循的关键约定
- 要避免的常见陷阱
- 何时使用 vs 何时不使用

## 要求

列出任何依赖项或先决条件：
```bash
pip install package-name
```

## 高级用法

对于复杂场景，请参阅 [reference.md](reference.md)。
```

### 第 7 步：添加支持文件（可选）

为渐进式披露创建额外文件：

**reference.md**: 详细的 API 文档，高级选项
**examples.md**: 扩展的示例和用例
**scripts/**: 辅助脚本和实用程序
**templates/**: 文件模板或样板

但在 SKILL.md 中引用它们：
```markdown
有关高级用法，请参阅 [reference.md](reference.md)。

运行辅助脚本：
\`\`\`bash
python scripts/helper.py input.txt
\`\`\`
```

### 第 8 步：验证 Skill

检查这些要求：

✅ **文件结构**:
- [ ] SKILL.md 存在于正确的位置
- [ ] 目录名称与 frontmatter 中的 `name` 匹配

✅ **YAML Frontmatter**:
- [ ] 第 1 行以此开头 `---`
- [ ] 内容前以此关闭 `---`
- [ ] 有效的 YAML（无制表符，正确的缩进）
- [ ] `name` 遵循命名规则
- [ ] `description` 具体且 < 1024 个字符

✅ **内容质量**:
- [ ] 为 Claude 提供清晰的说明
- [ ] 提供具体的示例
- [ ] 处理边缘情况
- [ ] 列出依赖项（如果有）

✅ **测试**:
- [ ] 描述与用户的问题匹配
- [ ] Skill 在相关查询时激活
- [ ] 说明清晰且可操作

### 第 9 步：测试 Skill

1. **重启 Claude Code**（如果正在运行）以加载 Skill

2. **提出相关问题**以匹配描述：
   ```
   Can you help me extract text from this PDF?
   ```

3. **验证激活**：Claude 应该自动使用该 Skill

4. **检查行为**：确认 Claude 正确遵循了说明

### 第 10 步：如果需要，进行调试

如果 Claude 不使用该 Skill：

1. **使描述更具体**：
   - 添加触发词
   - 包含文件类型
   - 提及常见的用户短语

2. **检查文件位置**：
   ```bash
   ls ~/.claude/skills/skill-name/SKILL.md
   ls .claude/skills/skill-name/SKILL.md
   ```

3. **验证 YAML**：
   ```bash
   cat SKILL.md | head -n 10
   ```

4. **运行调试模式**：
   ```bash
   claude --debug
   ```

## 常见模式

### 只读 Skill

```yaml
---
name: code-reader
description: 阅读并分析代码而不进行更改。用于代码审查、理解代码库或文档。
allowed-tools: Read, Grep, Glob
---
```

### 基于脚本的 Skill

```yaml
---
name: data-processor
description: 使用 Python 脚本处理 CSV 和 JSON 数据文件。当分析数据文件或转换数据集时使用。
---

# 数据处理器 (Data Processor)

## 说明

1. 使用处理脚本：
\`\`\`bash
python scripts/process.py input.csv --output results.json
\`\`\`

2. 验证输出：
\`\`\`bash
python scripts/validate.py results.json
\`\`\`
```

### 具有渐进式披露的多文件 Skill

```yaml
---
name: api-designer
description: 遵循最佳实践设计 REST API。当创建 API 端点、设计路由或规划 API 架构时使用。
---

# API 设计师 (API Designer)

快速开始：参阅 [examples.md](examples.md)

详细参考：参阅 [reference.md](reference.md)

## 说明

1. 收集需求
2. 设计端点（见 examples.md）
3. 使用 OpenAPI 规范进行记录
4. 根据最佳实践进行审查（见 reference.md）
```

## Skill 作者的最佳实践

1. **一个 Skill，一个目的**：不要创建巨型 Skills
2. **具体的描述**：包含用户会说的触发词
3. **清晰的说明**：为 Claude 编写，而不是为人类
4. **具体的示例**：展示真实的代码，而不是伪代码
5. **列出依赖项**：在描述中提及所需的包
6. **与队友一起测试**：验证激活和清晰度
7. **版本化你的 Skills**：在内容中记录更改
8. **使用渐进式披露**：将高级细节放在单独的文件中

## 验证清单

在最终确定 Skill 之前，请验证：

- [ ] 名称仅限小写、连字符，最多 64 个字符
- [ ] 描述具体且 < 1024 个字符
- [ ] 描述包含“做什么”和“何时”
- [ ] YAML Frontmatter 有效
- [ ] 说明是分步的
- [ ] 示例具体且真实
- [ ] 依赖项已记录
- [ ] 文件路径使用正斜杠
- [ ] Skill 在相关查询时激活
- [ ] Claude 正确遵循说明

## 故障排除

**Skill 不激活**:
- 通过触发词使描述更具体
- 在描述中包含文件类型和操作
- 添加带有用户短语的“何时使用...”子句

**多个 Skills 冲突**:
- 使描述更独特
- 使用不同的触发词
- 缩小每个 Skill 的范围

**Skill 有错误**:
- 检查 YAML 语法（无制表符，适当的缩进）
- 验证文件路径（使用正斜杠）
- 确保脚本具有执行权限
- 列出所有依赖项

## 示例

查看完整示例的文档：
- 简单的单文件 Skill (commit-helper)
- 具有工具权限的 Skill (code-reviewer)
- 多文件 Skill (pdf-processing)

## 输出格式

当创建 Skill 时，我将：

1. 询问有关范围和需求的澄清问题
2. 建议 Skill 名称和位置
3. 使用正确的 Frontmatter 创建 SKILL.md 文件
4. 包含清晰的说明和示例
5. 如果需要，添加支持文件
6. 提供测试说明
7. 针对所有要求进行验证

结果将是一个不仅遵循所有最佳实践和验证规则，而且完整、可工作的 Skill。