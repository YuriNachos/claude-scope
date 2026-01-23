#!/bin/bash
# Debug script to see what Claude Code sends to statusline

while IFS= read -r line; do
  echo "=== STDIN RECEIVED ===" >&2
  echo "$line" >&2
  echo "=====================" >&2

  # Pretty print to a file for inspection
  echo "$line" | jq '.' >> /tmp/claude-scope-debug.jsonl 2>/dev/null || echo "$line" >> /tmp/claude-scope-debug.txt

  # Run claude-scope
  echo "$line" | node /Users/yurii.chukhlib/Documents/claude-scope/dist/claude-scope.cjs
done
