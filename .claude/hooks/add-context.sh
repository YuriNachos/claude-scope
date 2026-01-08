#!/bin/bash
set -e

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$PROJECT_ROOT" || exit 0

# Read JSON input
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // ""' | tr '[:upper:]' '[:lower:]')

CONTEXT=""

# Helper function to add section
add_section() {
  local title="$1"
  local content="$2"
  if [[ -n "$content" ]]; then
    CONTEXT+="${title}\n${content}\n\n"
  fi
}

# Check for release/publish keywords
if [[ "$PROMPT" =~ (release|version|publish|changelog) ]]; then
  VERSION=$(cat package.json 2>/dev/null | jq -r '.version // "unknown"')
  add_section "## Current Version" "v${VERSION}"

  if [[ -f "CHANGELOG.md" ]]; then
    CHANGELOG=$(head -30 CHANGELOG.md)
    add_section "## Recent CHANGELOG" "$CHANGELOG"
  fi
fi

# Check for widget keywords
if [[ "$PROMPT" =~ (widget|statusline) ]]; then
  WIDGET_STRUCTURE=$(find src/widgets -type f -name "*.ts" 2>/dev/null | head -20 | sed 's|^|  |')
  add_section "## Widget Files" "$WIDGET_STRUCTURE"
fi

# Check for git keywords
if [[ "$PROMPT" =~ (git|commit|push|pull|branch) ]]; then
  GIT_STATUS=$(git status --short 2>/dev/null || echo "Not a git repo")
  add_section "## Git Status" "$GIT_STATUS"

  BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  add_section "## Current Branch" "$BRANCH"

  RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "No git history")
  add_section "## Recent Commits" "$RECENT_COMMITS"
fi

# Check for config/settings keywords
if [[ "$PROMPT" =~ (config|setting|hook) ]]; then
  if [[ -f ".claude/settings.json" ]]; then
    HOOKS=$(jq '.hooks // {}' .claude/settings.json 2>/dev/null || echo "{}")
    add_section "## Current Hooks Configuration" "$HOOKS"
  fi
fi

# Check for test keywords (only add context, don't run tests)
if [[ "$PROMPT" =~ (test|coverage|spec) ]]; then
  if [[ -f "package.json" ]]; then
    TEST_SCRIPTS=$(jq '.scripts | to_entries | map(select(.key | contains("test"))) | from_entries' package.json 2>/dev/null || echo "{}")
    add_section "## Test Scripts" "$TEST_SCRIPTS"
  fi
fi

# Check for docs/documentation keywords
if [[ "$PROMPT" =~ (doc|readme|claude\.md) ]]; then
  if [[ -f "CLAUDE.md" ]]; then
    add_section "## CLAUDE.md exists" "Project instructions available in CLAUDE.md"
  fi
  if [[ -f "README.md" ]]; then
    add_section "## README.md exists" "Documentation available in README.md"
  fi
fi

# Output context as plain text (will be added to conversation)
if [[ -n "$CONTEXT" ]]; then
  echo -e "$CONTEXT"
fi

exit 0
