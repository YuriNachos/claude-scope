# claude-scope

Claude Code plugin for session status and analytics.

**Requirements:**
- Node.js 18 or higher

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

Once configured, claude-scope displays real-time session information in your statusline including:
- Git branch and changes
- Model information
- Context usage with progress bar
- Session duration
- Cost estimation
- Lines added/removed
- Configuration counts
- Poker hand (entertainment)

### Widget Display Styles

Each widget supports multiple display styles for customization:

| Style | Description |
|-------|-------------|
| `balanced` | Default balanced style (minimalism + informativeness) |
| `compact` | Maximally compact display |
| `playful` | Fun style with informative emojis |
| `verbose` | Detailed text descriptions |
| `technical` | Technical details (model IDs, milliseconds, etc.) |
| `symbolic` | Symbol-based representation |
| `labeled` | Prefix labels for clarity |
| `indicator` | Bullet indicator prefix |
| `fancy` | Decorative formatting (brackets, quotes) |
| `compact-verbose` | Compact with K-formatted numbers |

**Note:** This is an early release with basic functionality. Additional features (repository status, session analytics, etc.) are planned for future releases.

## Releasing

To create a new release:

1. Update version in `package.json`
2. Commit changes
3. Create and push tag:

```bash
git tag v0.1.0
git push origin main
git push origin v0.1.0
```

The GitHub Actions workflow will:
- Run all tests
- Build the project
- Generate coverage report
- Commit `dist/` to repository
- Create GitHub Release with auto-generated notes

**Note:** If tests fail, the release will not be created.
