#!/bin/bash
# Debug statusline - logs what Claude Code sends

INPUT=$(cat)

# Log to file
echo "=== $(date) ===" >> /tmp/claude-statusline-debug.log
echo "$INPUT" | jq '.' >> /tmp/claude-statusline-debug.log 2>&1
echo "" >> /tmp/claude-statusline-debug.log

# Extract key info
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
CURRENT_USAGE=$(echo "$INPUT" | jq '.context_window.current_usage')

echo "transcript_path: $TRANSCRIPT_PATH" >> /tmp/claude-statusline-debug.log
echo "session_id: $SESSION_ID" >> /tmp/claude-statusline-debug.log
echo "current_usage: $CURRENT_USAGE" >> /tmp/claude-statusline-debug.log
echo "" >> /tmp/claude-statusline-debug.log

# Run actual statusline
echo "$INPUT" | node /Users/yurii.chukhlib/Documents/claude-scope/dist/claude-scope.cjs
