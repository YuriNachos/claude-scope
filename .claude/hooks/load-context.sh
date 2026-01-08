#!/bin/bash
set -e

PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$PROJECT_ROOT" || exit 0

CONTEXT=""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  exit 0
fi

# Fetch latest from remote (non-blocking, don't merge)
git fetch --quiet --no-tags 2>/dev/null || true

# Get current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Check if local branch is behind remote
BEHIND=0
AHEAD=0

if git rev-parse --verify origin/"$BRANCH" >/dev/null 2>&1; then
  BEHIND=$(git rev-list --count HEAD..origin/"$BRANCH" 2>/dev/null || echo 0)
  AHEAD=$(git rev-list --count origin/"$BRANCH"..HEAD 2>/dev/null || echo 0)
fi

CONTEXT+="## Git Repository Status\n"
CONTEXT+="Current branch: \`${BRANCH}\`\n\n"

if [[ $BEHIND -gt 0 ]]; then
  CONTEXT+="⚠️ Your branch is **behind** origin/${BRANCH} by ${BEHIND} commit(s).\n"
  CONTEXT+="Consider running \`git pull\` to get latest changes.\n\n"
fi

if [[ $AHEAD -gt 0 ]]; then
  CONTEXT+="📤 Your branch is **ahead** of origin/${BRANCH} by ${AHEAD} commit(s).\n"
  CONTEXT+="You have unpushed changes.\n\n"
fi

if [[ $BEHIND -eq 0 && $AHEAD -eq 0 ]]; then
  CONTEXT+="✅ Your branch is up to date with origin/${BRANCH}.\n\n"
fi

# Get recent commits
CONTEXT+="## Recent Activity\n"
RECENT=$(git log --oneline -5 --decorate 2>/dev/null || echo "No recent activity")
CONTEXT+="$RECENT\n\n"

# Get current version
if [[ -f "package.json" ]]; then
  VERSION=$(cat package.json | jq -r '.version // "unknown"')
  CONTEXT+="## Project Version\n"
  CONTEXT+="Current: v${VERSION}\n\n"
fi

# Check for uncommitted changes
CHANGES=$(git status --short 2>/dev/null || "")
if [[ -n "$CHANGES" ]]; then
  CONTEXT+="## Uncommitted Changes\n"
  CONTEXT+="\`\`\`\n${CHANGES}\n\`\`\`\n"
fi

# Output context to be added to session
echo -e "$CONTEXT"

exit 0
