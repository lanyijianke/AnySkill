#!/bin/bash
#
# AnySkill One-line Installer
# Usage: curl -sSL https://raw.githubusercontent.com/lanyijianke/AnySkill/main/init.sh | bash
#
# 1. Asks for YOUR GitHub skill repo (so everyone uses their own fork)
# 2. Detects your AI IDE
# 3. Installs the AnySkill bootstrapper + config into the correct location
#

set -e

LOADER_URL="https://raw.githubusercontent.com/lanyijianke/AnySkill/main/loader/anyskill/SKILL.md"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🧠 AnySkill Installer${NC}"
echo -e "${CYAN}One Skill to Rule Them All.${NC}"
echo ""

# Step 1: Ask for the user's OWN repo
if [ -f ".anyskill.json" ]; then
  echo -e "${GREEN}✅ Found existing .anyskill.json${NC}"
else
  echo "请输入你的 AnySkill GitHub 仓库地址"
  echo -e "(格式: ${CYAN}用户名/仓库名${NC}, 例如: lanyijianke/AnySkill)"
  echo ""
  read -p "仓库地址: " REPO

  if [ -z "$REPO" ]; then
    echo -e "${YELLOW}未输入仓库地址，退出。${NC}"
    exit 1
  fi

  read -p "分支名 [main]: " BRANCH
  BRANCH=${BRANCH:-main}

  cat > .anyskill.json << EOF
{
  "repo": "${REPO}",
  "branch": "${BRANCH}"
}
EOF
  echo -e "${GREEN}✅ 已创建 .anyskill.json${NC}"
fi

echo ""

# Step 2: Choose IDE
echo "选择你要安装破冰者 Skill 的 AI IDE:"
echo ""
echo "  1) Gemini / Antigravity  (.agent/skills/anyskill/)"
echo "  2) Claude Code           (.claude/skills/anyskill/)"
echo "  3) Cursor                (.cursor/rules/)"
echo "  4) OpenClaw              (~/.openclaw/skills/anyskill/)"
echo "  5) 全部安装"
echo ""
read -p "选择 [1-5]: " choice

install_gemini() {
  local dir=".agent/skills/anyskill"
  mkdir -p "$dir"
  curl -sSL "$LOADER_URL" -o "$dir/SKILL.md"
  echo -e "${GREEN}✅ 已安装到 $dir/SKILL.md${NC}"
}

install_claude() {
  local dir=".claude/skills/anyskill"
  mkdir -p "$dir"
  curl -sSL "$LOADER_URL" -o "$dir/SKILL.md"
  echo -e "${GREEN}✅ 已安装到 $dir/SKILL.md${NC}"
}

install_cursor() {
  local dir=".cursor/rules"
  mkdir -p "$dir"
  curl -sSL "$LOADER_URL" -o "$dir/anyskill-loader.mdc"
  echo -e "${GREEN}✅ 已安装到 $dir/anyskill-loader.mdc${NC}"
}

install_openclaw() {
  local dir="$HOME/.openclaw/skills/anyskill"
  mkdir -p "$dir"
  curl -sSL "$LOADER_URL" -o "$dir/SKILL.md"
  echo -e "${GREEN}✅ 已安装到 $dir/SKILL.md${NC}"
}

case $choice in
  1) install_gemini ;;
  2) install_claude ;;
  3) install_cursor ;;
  4) install_openclaw ;;
  5) install_gemini; install_claude; install_cursor; install_openclaw ;;
  *) echo -e "${YELLOW}无效选择，退出。${NC}"; exit 1 ;;
esac

echo ""
echo -e "${GREEN}🎉 AnySkill 安装完成！${NC}"
echo -e "你的 AI 助手现在可以从 ${CYAN}你自己的${NC} 云端仓库动态加载技能了。"
echo ""
