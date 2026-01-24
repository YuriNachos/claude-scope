#!/bin/bash
INPUT=$(cat)

# Log full input to file (with timestamp)
echo "=== $(date -u +"%Y-%m-%d %H:%M:%S UTC") ===" >> /tmp/claude-statusline-debug.log
echo "TRANSCRIPT_PATH: $(echo "$INPUT" | jq -r '.transcript_path // "null"')" >> /tmp/claude-statusline-debug.log
echo "SESSION_ID: $(echo "$INPUT" | jq -r '.session_id // "null"')" >> /tmp/claude-statusline-debug.log
echo "CONTEXT_WINDOW:" >> /tmp/claude-statusline-debug.log
echo "$INPUT" | jq -r '.context_window | {current_usage, total_input_tokens, total_output_tokens, context_window_size}' >> /tmp/claude-statusline-debug.log
echo "" >> /tmp/claude-statusline-debug.log

# Run actual statusline
echo "$INPUT" | node /Users/yurii.chukhlib/Documents/claude-scope/dist/claude-scope.cjs
