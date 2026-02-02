#!/bin/bash
# Install claude-scope skill to user's Claude Code skills directory
# This script runs automatically via npm postinstall hook

set -e

SKILL_NAME="scope"
TARGET_DIR="$HOME/.claude/skills/$SKILL_NAME"

# Determine source directory (relative to this script's location)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/../.claude/skills/$SKILL_NAME"

# Gracefully skip if source doesn't exist (e.g., during development)
if [ ! -d "$SOURCE_DIR" ]; then
  echo "Note: Skill source not found at $SOURCE_DIR"
  echo "Skipping skill installation (this is normal during development)."
  exit 0
fi

# Check if SKILL.md exists in source
if [ ! -f "$SOURCE_DIR/SKILL.md" ]; then
  echo "Note: SKILL.md not found in $SOURCE_DIR"
  echo "Skipping skill installation."
  exit 0
fi

# Create target directory (overwrites existing if present)
echo "Installing claude-scope skill..."
mkdir -p "$TARGET_DIR"

# Copy all skill files
cp -r "$SOURCE_DIR"/* "$TARGET_DIR/"

echo "✓ Skill installed to $TARGET_DIR"
echo "  Use /scope in Claude Code to configure widgets"
echo "  Or just ask Claude about widget configuration - it will understand!"
