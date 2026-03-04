---
name: frontend-design
description: 创建独特、生产级且具有高设计质量的前端界面。当用户要求构建 Web 组件、页面或应用程序时使用。致力于生成富有创意的代码，避免通用的 AI 审美。
---

# Frontend Design Assistant

创建独特、生产级的前端界面，严格避免通用的“AI 废话”审美。在实现真实、可运行的代码时，高度关注审美细节和创意选择。

## Description

本技能将前端需求转化为独特、令人难忘且打磨精细的界面。它强调清晰的审美方向——无论是大胆的极繁主义还是精致的极简主义——并确保执行力与愿景匹配，产出生产级代码。

## Trigger Conditions

**当用户提及以下内容时主动使用：**
- 构建前端组件、页面或应用程序
- UI/UX 设计需求
- 特定的视觉风格（赛博朋克、苹果风、复古未来主义等）
- 改进现有界面的外观和体验
- “让它好看点”或“设计一下这个”

## Workflow

### Step 1: Define Design Thinking
在编写代码前，确立一个**大胆**的审美方向：
1.  **Purpose (目的)**: 解决了什么问题？为谁而设计？
2.  **Tone (基调)**: 选择一个极端（极简主义、极繁主义、复古未来、粗野主义、新拟态等）。拒绝“安全”或“无聊”。
3.  **Differentiation (差异化)**: 什么让它**令人难忘**？人们会记住的那一个点是什么？
4.  **Constraints (约束)**: 技术要求（React, Vue, Tailwind, CSS-in-JS 等）。

### Step 2: Apply Aesthetic Guidelines
根据下方的 [Frontend Aesthetic Guide](#frontend-aesthetic-guide) 做出深思熟虑的选择：
- **Typography (排版)**: 独特、富由表现力的字体。除非刻意设计，否则不用通用的 Arial/Inter。
- **Color (色彩)**: 连贯的主题变量。渐变网格、噪点或强烈的对比。
- **Motion (动效)**: 编排入场动画、滚动触发和令人愉悦的微交互。

### Step 3: Implementation
编写代码（HTML/CSS/JS, React, Svelte 等），确保：
- **Production-Ready (生产级)**: 逻辑完整，错误处理，响应式。
- **Visually Stunning (视觉惊艳)**: 像素级还原设计愿景。
- **Polished (打磨)**: 恰当的间距、悬停状态、焦点状态和过渡效果。

## Frontend Aesthetic Guide

### Typography
- 选择美观、独特且有趣的字体。
- **Avoid**: Arial, Roboto 或未加样式的 Inter 等通用字体。
- **Do**: 标题使用独特的展示字体，正文搭配精致的衬线或几何无衬线字体。利用大字号和紧/宽字距制造张力。

### Color & Theme
- 致力于统一的审美。
- 使用 CSS 变量保持一致性。
- **Avoid**: 胆怯、平均分布的色板或默认的 "Bootstrap" 颜色。
- **Do**: 主导色搭配鲜明的强调色。有深度的暗黑模式（不仅仅是 #000）。

### Motion
- 用动画来传递冲击力和感觉，而不仅仅是为了动而动。
- **Prioritize**: CSS transitions/animations 用于性能。Framer Motion 用于复杂的 React 状态。
- **Techniques**: 交替入场 (animation-delay)，可拖拽的滚动效果，磁吸按钮。

### Spatial Composition
- 打破网格。
- 使用不对称、重叠和对角线流向。
- 奢华感用大量留白，仪表盘/技术感用受控的密度。

### Backgrounds & Visual Details
- 绝不要满足于平坦的纯色背景（除非有意为之）。
- **Add**: 渐变网格、噪点纹理、几何图案、玻璃拟态 (blur)、厚重的阴影或自定义光标。

## Usage Examples

### Example 1: Cyberpunk Dashboard
**User**: "做一个加密货币交易仪表盘。"
**Action**:
- *Tone*: 高对比度暗黑模式，霓虹绿/粉点缀，等宽字体 (JetBrains Mono)，悬停故障效果 (glitch)。
- *Code*: 具有“终端”美学的网格布局，发光边框 (`box-shadow`)，实时数据跳动模拟。

### Example 2: Luxury Portfolio
**User**: "为香水品牌做一个落地页。"
**Action**:
- *Tone*: 有机、柔和、高端。衬线字体 (Playfair Display)，莫兰迪色调，颗粒纹理叠加。
- *Code*: 平滑滚动 (Lenis)，视差图片，文字淡入，充裕的留白。

## Important Notes

1.  **No Generic AI Aesthetics**: 避免“企业孟菲斯 (Corporate Memphis)”风格或 AI 演示中常见的标准“白紫渐变”。
2.  **Match Complexity**: 极繁主义需要复杂的 CSS/Canvas。极简主义需要完美的间距和排版。
3.  **Creative Interpretation**: 不要刻板地遵循提示——用更好的设计选择给用户惊喜（并解释原因）。
4.  **Technical Excellence**: 代码必须能跑。设计再好，跑不起来也是垃圾。