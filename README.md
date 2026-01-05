# claude-scope

Claude Code plugin for session status and analytics.

## Installation

### Via npx (recommended)

No installation required:

```bash
npx claude-scope@latest
```

### Via npm globally

```bash
npm install -g claude-scope
```

### Via bun

```bash
bunx claude-scope@latest
```

## Configuration

Add to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y claude-scope@latest",
    "padding": 0
  }
}
```

Or for global install:

```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-scope",
    "padding": 0
  }
}
```

## Usage

Once configured, claude-scope automatically displays:
- Current git branch
- Repository status
- Session information

The statusline updates in real-time as you work.
