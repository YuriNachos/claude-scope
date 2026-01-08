#!/bin/bash
set -e

# Read JSON input
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty')

# Skip if no file path
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Only process TypeScript/JavaScript files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|json)$ ]]; then
  exit 0
fi

# Skip if file doesn't exist or is in ignored directories
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

if [[ "$FILE_PATH" =~ (node_modules|dist/|\.git) ]]; then
  exit 0
fi

# Get the project root from CLAUDE_PROJECT_DIR or default to script location
PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
cd "$PROJECT_ROOT" || exit 0

# Run biome formatter and linter (includes organizeImports)
npx @biomejs/biome check --write "$FILE_PATH" 2>/dev/null || true

exit 0
