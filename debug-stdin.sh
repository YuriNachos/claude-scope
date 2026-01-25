#!/bin/bash
# Debug script to see what Claude Code sends to statusline

INPUT=$(cat)

echo "=== STDIN ===" >&2
echo "$INPUT" | jq '.' >&2 2>/dev/null || echo "$INPUT" >&2
echo "==========" >&2

# Save to file
echo "$INPUT" >> /tmp/claude-scope-stdin-log.jsonl

# Run claude-scope
echo "$INPUT" | node /Users/yurii.chukhlib/Documents/claude-scope/dist/claude-scope.cjs
