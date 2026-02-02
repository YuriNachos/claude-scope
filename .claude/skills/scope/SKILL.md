---
name: scope
description: Configure claude-scope status line widgets for Claude Code. Use when user wants to customize widgets, change theme, reorder elements, or modify display style.
user-invocable: true
allowed-tools: Read, Edit
argument-hint: [configuration change in natural language]
---

# Claude Scope Configuration Skill

Help users configure their claude-scope status line widgets.

## Configuration Path

**Config file:** `~/.claude-scope/config.json`

## Workflow

1. **Read** current config from `~/.claude-scope/config.json`
2. **Understand** what the user wants to change
3. **Edit** the config using the Edit tool
4. **Confirm** changes to the user

Changes apply automatically on the next status line render cycle.

## Quick Reference

### Config Structure

```json
{
  "version": "1.0.0",
  "theme": "monokai",
  "lines": {
    "0": [{ "id": "model", "style": "balanced", "colors": {...} }],
    "1": [{ "id": "git", "style": "balanced", "colors": {...} }]
  }
}
```

- `lines` is an object where keys are line numbers ("0", "1", "2", etc.)
- Each line contains an array of widget configurations
- Widgets render left-to-right within each line
- Empty lines should be empty arrays `[]`

### Available Widgets (16)

| Widget ID | Description | Typical Line |
|-----------|-------------|--------------|
| `cwd` | Current working directory | 0 |
| `model` | Claude model name (e.g., "Claude Opus 4.5") | 0 |
| `context` | Context window usage with progress bar | 0 |
| `cost` | Session cost in USD | 0 |
| `duration` | Session elapsed time | 0 |
| `lines` | Lines added/removed during session | 0 |
| `git` | Current git branch and changes | 1 |
| `git-tag` | Latest git tag | 1 |
| `config-count` | CLAUDE.md, rules, MCPs, hooks counts | 1 |
| `cache-metrics` | Cache hit rate and cost savings | 1 |
| `active-tools` | Running and completed Claude tools | 2 |
| `dev-server` | Dev server status (Nuxt, Next, Vite) | 2 |
| `docker` | Docker container count and status | 2 |
| `sysmon` | System metrics (CPU, RAM, Disk, Network) | 3 |
| `poker` | Random poker hand (easter egg) | 4 |
| `empty-line` | Blank separator line | any |

### Available Themes (17)

`monokai` (default), `nord`, `dracula`, `catppuccin-mocha`, `tokyo-night`,
`vscode-dark-plus`, `github-dark-dimmed`, `dusty-sage`, `muted-gray`,
`slate-blue`, `professional-blue`, `rose-pine`, `semantic-classic`,
`solarized-dark`, `one-dark-pro`, `cyberpunk-neon`, `gray`

### Available Styles

| Style | Description |
|-------|-------------|
| `balanced` | Clean, balanced with labels (default) |
| `compact` | Minimal, condensed |
| `playful` | Fun with emojis |
| `verbose` | Full text labels |
| `technical` | Raw values, no formatting |
| `labeled` | Explicit prefix labels |
| `minimal` | Most compact, no labels |

## Common Operations

### Swap widgets within a line

Read config, change the order of widget objects in the line's array.

**Example:** Swap model and context on line 0:
```json
// Before
"0": [{ "id": "model", ... }, { "id": "context", ... }]
// After
"0": [{ "id": "context", ... }, { "id": "model", ... }]
```

### Swap entire lines

Exchange the arrays between two line keys.

**Example:** Swap line 0 and line 1 contents.

### Add a widget

Add a widget object to the target line array. Use existing widgets in config as template for the `colors` field.

**Example:** Add docker widget to line 2:
```json
{ "id": "docker", "style": "balanced", "colors": { "label": "...", "count": "...", "running": "...", "stopped": "..." } }
```

### Remove a widget

Remove the widget object from the line array. Don't leave empty objects.

### Move widget to different line

1. Remove widget object from source line
2. Add widget object to target line

### Change theme

Update the `"theme"` field value.

**Important:** Changing theme also requires updating all `colors` fields in every widget.
**Recommendation:** For full theme changes, suggest user run:
```bash
npx claude-scope quick-config
```
This provides an interactive menu with live preview.

### Change widget style

Update the `"style"` field for the target widget.

### Change all styles at once

Update `"style"` field for every widget in config to the same value.

## Full Documentation

For detailed information about widgets, styles, colors, and themes, read the full documentation:

- **Main reference:** AI-CONFIG-GUIDE.md in claude-scope repository
- **All widgets with examples:** docs/WIDGETS.md
- **Theme system:** docs/THEME-SYSTEM.md
- **Architecture:** docs/ARCHITECTURE.md

## Important Rules

1. **Never break JSON structure** - validate before saving
2. **Preserve required fields** - keep `version` and `$aiDocs` fields
3. **Empty lines must be `[]`** - don't remove line keys, use empty arrays
4. **ANSI color format** - colors use `\u001b[38;2;R;G;Bm` escape codes
5. **Use existing colors as template** - when adding widgets, copy colors from similar existing widgets

## Example User Requests

| User says | Action |
|-----------|--------|
| "Swap first and second line" | Exchange lines "0" and "1" arrays |
| "Add docker widget" | Add docker widget to appropriate line |
| "Remove cost widget" | Remove cost widget from its line |
| "Make everything compact" | Change all widget styles to "compact" |
| "Use Dracula theme" | Update theme field (suggest quick-config for colors) |
| "Move git to first line" | Remove git from current line, add to line 0 |
| "Show current config" | Read and display the config file |
