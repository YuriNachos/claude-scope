# AI Configuration Guide for Claude Scope

> **For AI Assistants**: This document provides complete rules for modifying `~/.claude-scope/config.json`. When users ask you to add/remove widgets, change themes, or customize their claude-scope display, follow these rules.

---

## Quick Reference

- **Config location**: `~/.claude-scope/config.json`
- **Config version**: Check `"version"` field before making changes
- **Always preserve**: ANSI color codes in `"colors"` fields
- **Never break**: JSON structure or required fields

---

## How AI Should Modify Config

### Step 1: Read Current Config

When user asks to modify their claude-scope configuration, read the config file directly:

**Config location**: `~/.claude-scope/config.json`

Use the Read tool to get the current configuration before making changes.

### Step 2: Modify Using Edit Tool

Use the Edit tool to make changes directly to `~/.claude-scope/config.json`:
- Add/remove widgets from appropriate lines
- Change styles as requested
- Apply themes by updating color codes
- Preserve all ANSI escape sequences

**Important**: Always use the Edit tool for modifications. Never return the full config to the user — edit the file directly.

### Step 3: Verify Changes

After editing, the changes take effect immediately on the next claude-scope render cycle.

---

## Configuration Structure

```json
{
  "version": "1.0.0",
  "$aiDocs": "https://github.com/YuriNachos/claude-scope/blob/main/AI-CONFIG-GUIDE.md",
  "lines": {
    "0": [/* widgets for line 0 */],
    "1": [/* widgets for line 1 */],
    "2": [/* widgets for line 2 */],
    "3": [], "4": [], "5": []
  }
}
```

**Key rules**:
- Line numbers are strings (`"0"`, `"1"`, `"2"`)
- Each line contains an array of widget configurations
- Widgets are rendered left-to-right within each line
- Empty lines should be empty arrays `[]`

---

## All Available Widgets

### Widget Configuration Format

Each widget in the config follows this format:

```json
{
  "id": "widget-id",        // Required: widget identifier
  "style": "balanced",      // Required: display style
  "colors": { /* ... */ }   // Required: ANSI color codes
}
```

---

### Widget Catalog

| Widget ID | Name | Description | Default Line |
|-----------|------|-------------|--------------|
| `model` | Model Widget | Current Claude model name (e.g., "Claude Opus 4.5") | 0 |
| `context` | Context Widget | Context window usage with progress bar | 0 |
| `cost` | Cost Widget | Total session cost in USD | 0 |
| `duration` | Duration Widget | Elapsed session time | 0 |
| `lines` | Lines Widget | Lines added/removed during session | 0 |
| `git` | Git Widget | Current git branch and changes | 0 |
| `git-tag` | Git Tag Widget | Latest git tag | 1 |
| `config-count` | Config Count Widget | CLAUDE.md files, rules, MCPs, hooks counts | 1 |
| `cache-metrics` | Cache Metrics Widget | Cache hit rate and cost savings | 2 |
| `active-tools` | Active Tools Widget | Currently running and completed tools | 2 |
| `dev-server` | DevServer Widget | Running dev server status (Nuxt, Next, Vite, etc.) | 2 |
| `docker` | Docker Widget | Docker container count and status | 2 |
| `sysmon` | Sysmon Widget | System metrics: CPU, RAM, Disk, Network | 3 |
| `empty-line` | Empty Line Widget | Creates blank separator line | 5 |
| `poker` | Poker Widget | Random Texas Hold'em hands (easter egg) | 4 |

**Note**: `poker` and `empty-line` widgets exist but are rarely used in normal configs.

---

## Display Styles (WidgetStyle)

Every widget supports multiple display styles. Not all widgets support all styles.

### Style Reference

| Style | Description | Example Usage |
|-------|-------------|---------------|
| `balanced` | Default, clean formatting | Most widgets |
| `compact` | Condensed, minimal spacing | Space-constrained layouts |
| `playful` | With emojis | Fun, casual displays |
| `verbose` | Full text labels | Detailed information |
| `technical` | Raw values, no formatting | Debugging, technical contexts |
| `symbolic` | With symbols (◆, ●, etc.) | Symbolic indicators |
| `labeled` | Prefix labels (e.g., "Model:") | Explicit labeling |
| `indicator` | Bullet indicators (●) | Status indicators |
| `minimal` | Most compact, no labels | Minimalist displays |
| `compact-verbose` | Compact with abbreviations | Condensed details |
| `breakdown` | Multi-line breakdown | Cache metrics only |

### Style Examples by Widget

#### Model Widget (`model`)
| Style | Output |
|-------|--------|
| `balanced` | `Claude Opus 4.5` |
| `compact` | `Opus 4.5` |
| `playful` | `🤖 Opus 4.5` |
| `technical` | `claude-opus-4-5-20251101` |
| `symbolic` | `◆ Opus 4.5` |
| `labeled` | `Model: Opus 4.5` |
| `indicator` | `● Opus 4.5` |

#### Context Widget (`context`)
| Style | Output |
|-------|--------|
| `balanced` | `45% [████████░░░░░░░░░]` |
| `compact` | `45%` |
| `playful` | `📊 45% [████████░░░░░░░░░]` |
| `verbose` | `45% used (90k/200k tokens)` |
| `labeled` | `Context: 45%` |
| `indicator` | `● 45%` |

#### Git Widget (`git`)
| Style | Output |
|-------|--------|
| `minimal` | `main` |
| `balanced` | `main [+42 -18]` |
| `compact` | `main +42/-18` |
| `playful` | `🔀 main ⬆42 ⬇18` |
| `verbose` | `branch: main [+42 insertions, -18 deletions]` |
| `labeled` | `Git: main [3 files: +42/-18]` |
| `indicator` | `● main [+42 -18]` |

#### Lines Widget (`lines`)
| Style | Output |
|-------|--------|
| `balanced` | `+42/-18` |
| `compact` | `+42-18` |
| `playful` | `➕42 ➖27` |
| `verbose` | `+42 added, -27 removed` |
| `labeled` | `Lines: +42/-18` |
| `indicator` | `● +42/-18` |

#### Cost Widget (`cost`)
| Style | Output |
|-------|--------|
| `balanced` | `$0.42` |
| `playful` | `💰 $0.42` |
| `labeled` | `Cost: $0.42` |
| `indicator` | `● $0.42` |

#### Duration Widget (`duration`)
| Style | Output |
|-------|--------|
| `balanced` | `1h 1m 5s` |
| `compact` | `1h1m` |
| `playful` | `⌛ 1h 1m` |
| `technical` | `3665000ms` |
| `labeled` | `Time: 1h 1m 5s` |
| `indicator` | `● 1h 1m 5s` |

#### Active Tools Widget (`active-tools`)
| Style | Output |
|-------|--------|
| `balanced` | `Edits: 5 | Bash: 3 | Writes: 2` |
| `compact` | `[Read] [Edit] [Edit] [Edit] [Read] [Read]` |
| `playful` | `📖 Read, ✏️ Edit, 📖 Read` |
| `verbose` | `Running: Read: /src/example.ts | Completed: Edit (3x)` |
| `labeled` | `Tools: ◐ Read: /src/example.ts | ✓ Edit ×3` |

#### Cache Metrics Widget (`cache-metrics`)
| Style | Output |
|-------|--------|
| `balanced` | `💾 35.0k cache` |
| `playful` | `💾 35.0k cache` |
| `verbose` | `Cache: 35.0k | $0.03 saved` |
| `breakdown` | `💾 35.0k cache | Hit: 35.0k, Write: 5.0k | $0.03 saved` |

#### DevServer Widget (`dev-server`)
| Style | Output |
|-------|--------|
| `balanced` | `⚡ Nuxt (running)` |
| `compact` | `⚡ Nuxt 🚀` |
| `playful` | `🏃 Nuxt` |
| `labeled` | `Server: ⚡ Nuxt 🟢` |

#### Docker Widget (`docker`)
| Style | Output |
|-------|--------|
| `balanced` | `Docker: 3/5 🟢` |
| `compact` | `🐳 3/5` |
| `playful` | `🐳 Docker: 3/5 🟢` |
| `labeled` | `Docker: 3/5` |

#### Sysmon Widget (`sysmon`)
| Style | Output |
|-------|--------|
| `balanced` | `CPU 45% │ RAM 8.2G │ Disk 65% │ Net ↑1.2M ↓3.4M` |
| `compact` | `CPU:45% RAM:8.2G` |
| `playful` | `🖥️ 45% │ 🧠 8.2G │ 💾 65% │ 🌐 ↑1.2M` |
| `verbose` | `CPU: 45% used │ RAM: 8.2GB/16GB │ Disk: 65% │ Network: ↑1.2MB/s ↓3.4MB/s` |

---

## All Available Themes

Themes control the **ANSI color codes** in the `"colors"` field of each widget.

### Theme List

| Theme Name | Style | Description |
|------------|-------|-------------|
| `monokai` | Vibrant | **DEFAULT** - Original Monokai with bright accents |
| `vscode-dark-plus` | Standard | VSCode's default dark theme |
| `catppuccin-mocha` | Pastel | Soft, dreamy pastel colors |
| `cyberpunk-neon` | Vibrant | Cyberpunk 2077 inspired neon |
| `dusty-sage` | Muted | Earthy muted greens |
| `dracula` | Popular | Purple/pink accent theme |
| `github-dark-dimmed` | Standard | GitHub's official dark theme |
| `gray` | Minimal | Neutral gray, minimal distraction |
| `muted-gray` | Muted | Very subtle grays |
| `nord` | Cool | Arctic, north-bluish palette |
| `one-dark-pro` | IDE | Atom's iconic theme |
| `professional-blue` | Professional | Business-oriented blue |
| `rose-pine` | Pastel | Rose/violet themed |
| `semantic-classic` | Intuitive | Industry-standard semantic colors |
| `slate-blue` | Muted | Calm blue-grays |
| `solarized-dark` | Classic | Precise CIELAB lightness |
| `tokyo-night` | Modern | Clean Tokyo-inspired |

### Theme Descriptions

#### `monokai` (Default)
Vibrant theme with bright accents. Classic choice for developers.

#### `dracula`
Purple/pink accent theme. Popular community theme from draculatheme.com.

#### `nord`
Arctic, north-bluish color palette. Cool, calming blues and grays.

#### `catppuccin-mocha`
Soft, dreamy pastel colors. Part of the Catppuccin theme family.

#### `tokyo-night`
Clean Tokyo-inspired. Modern dark theme with subtle colors.

#### `rose-pine`
Rose/violet themed. Pastel aesthetics with rose tones.

#### `github-dark-dimmed`
GitHub's official dark theme. Familiar GitHub colors.

#### `vscode-dark-plus`
VSCode's default dark theme. For those who love VSCode.

#### `one-dark-pro`
Atom's iconic theme. Popular IDE theme.

#### `solarized-dark`
Classic with precise CIELAB lightness. Carefully designed for readability.

#### `cyberpunk-neon`
Cyberpunk 2077 inspired neon. Vibrant, futuristic colors.

#### `professional-blue`
Business-oriented blue. Clean corporate aesthetic.

#### `gray`
Neutral gray, minimal distraction. Maximum focus mode.

#### `muted-gray`
Very subtle grays. Even more minimal than `gray`.

#### `slate-blue`
Calm blue-grays. Subtle, professional.

#### `dusty-sage`
Earthy muted greens. Natural, organic feel.

#### `semantic-classic`
Industry-standard semantic colors. Red/green/yellow conventions.

---

## Color Customization

### Understanding Color Fields

Each widget has a `"colors"` object containing ANSI escape codes:

```json
{
  "id": "model",
  "style": "balanced",
  "colors": {
    "name": "\u001b[38;2;98;114;164m"
  }
}
```

**Important**: These are 24-bit RGB ANSI codes in the format `\u001b[38;2;R;G;Bm`

### Widget-Specific Color Fields

#### Model Widget (`model`)
```json
"colors": {
  "name": "\u001b[38;2;R;G;Bm",     // Model name color
  "version": "\u001b[38;2;R;G;Bm"   // Version number color
}
```

#### Context Widget (`context`)
```json
"colors": {
  "low": "\u001b[38;2;R;G;Bm",      // <50% usage (green)
  "medium": "\u001b[38;2;R;G;Bm",   // 50-79% usage (yellow)
  "high": "\u001b[38;2;R;G;Bm",     // >=80% usage (red)
  "bar": "\u001b[38;2;R;G;Bm"       // Progress bar fill
}
```

#### Lines Widget (`lines`)
```json
"colors": {
  "added": "\u001b[38;2;R;G;Bm",    // Green (additions)
  "removed": "\u001b[38;2;R;G;Bm"   // Red (deletions)
}
```

#### Cost Widget (`cost`)
```json
"colors": {
  "amount": "\u001b[38;2;R;G;Bm",   // Dollar amount
  "currency": "\u001b[38;2;R;G;Bm"  // $ symbol
}
```

#### Duration Widget (`duration`)
```json
"colors": {
  "value": "\u001b[38;2;R;G;Bm",    // Time value color
  "unit": "\u001b[38;2;R;G;Bm"      // Time unit color (h, m, s)
}
```

#### Git Widget (`git`)
```json
"colors": {
  "branch": "\u001b[38;2;R;G;Bm",   // Branch name
  "changes": "\u001b[38;2;R;G;Bm"   // Changes indicator
}
```

#### Git Tag Widget (`git-tag`)
```json
"colors": {
  "branch": "\u001b[38;2;R;G;Bm",   // Tag name color
  "changes": "\u001b[38;2;R;G;Bm"   // Required by type (unused)
}
```

#### Config Count Widget (`config-count`)
```json
"colors": {
  "label": "\u001b[38;2;R;G;Bm",     // Label color (CLAUDE.md, rules, MCPs, hooks)
  "separator": "\u001b[38;2;R;G;Bm"  // Separator (│) color
}
```

#### Cache Metrics Widget (`cache-metrics`)
```json
"colors": {
  "high": "\u001b[38;2;R;G;Bm",     // >70% hit rate
  "medium": "\u001b[38;2;R;G;Bm",   // 40-70% hit rate
  "low": "\u001b[38;2;R;G;Bm",      // <40% hit rate
  "read": "\u001b[38;2;R;G;Bm",     // Cache read tokens
  "write": "\u001b[38;2;R;G;Bm"     // Cache write tokens
}
```

#### Active Tools Widget (`active-tools`)
```json
"colors": {
  "running": "\u001b[38;2;R;G;Bm",  // Running tool indicator
  "completed": "\u001b[38;2;R;G;Bm", // Completed tool indicator
  "error": "\u001b[38;2;R;G;Bm",    // Error indicator
  "name": "\u001b[38;2;R;G;Bm",     // Tool name
  "target": "\u001b[38;2;R;G;Bm",   // Tool target/path
  "count": "\u001b[38;2;R;G;Bm"     // Tool count multiplier
}
```

#### DevServer Widget (`dev-server`)
```json
"colors": {
  "name": "\u001b[38;2;R;G;Bm",     // Server name
  "status": "\u001b[38;2;R;G;Bm",   // Running/building/stopped
  "label": "\u001b[38;2;R;G;Bm"     // "⚡" icon
}
```

#### Docker Widget (`docker`)
```json
"colors": {
  "label": "\u001b[38;2;R;G;Bm",    // "Docker:" or "🐳"
  "count": "\u001b[38;2;R;G;Bm",    // Container count
  "running": "\u001b[38;2;R;G;Bm",  // Running containers
  "stopped": "\u001b[38;2;R;G;Bm"   // Stopped containers
}
```

#### Sysmon Widget (`sysmon`)
```json
"colors": {
  "cpu": "\u001b[38;2;R;G;Bm",       // CPU usage color
  "ram": "\u001b[38;2;R;G;Bm",       // RAM usage color
  "disk": "\u001b[38;2;R;G;Bm",      // Disk usage color
  "network": "\u001b[38;2;R;G;Bm",   // Network usage color
  "separator": "\u001b[38;2;R;G;Bm"  // Separator (│) color
}
```

### Converting RGB to ANSI

To create custom colors from RGB values:

```
Format: \u001b[38;2;R;G;Bm
Example (pure red): \u001b[38;2;255;0;0m
Example (blue): \u001b[38;2;59;130;246m
```

**JSON encoding**: Backslashes must be escaped as `\\u001b`

---

## Configuration Rules for AI

### When Adding Widgets

1. Choose an appropriate line (0, 1, or 2 typically)
2. Use exact widget ID from catalog
3. Set style to supported value
4. Include all required color fields for that widget
5. Preserve existing widgets unless asked to remove

### When Removing Widgets

1. Remove entire widget object from array
2. Don't leave empty objects `{}`
3. Update line to `[]` if removing all widgets

### When Changing Styles

1. Verify style is supported by the widget
2. Only change the `"style"` field
3. Keep color structure intact

### When Applying Themes

Themes affect **all color codes** across all widgets. Two approaches:

#### Approach 1: Quick Theme Switch
Replace all color codes with theme's palette. Theme colors follow semantic patterns:
- Green tones: added, low, high, running, completed, devServerName, dockerRunning
- Red tones: removed, high, low, error, dockerStopped
- Yellow tones: medium, medium, toolsRunning, devServerStatus
- Blue/purple tones: branch, cacheWrite, toolsCount, accent

#### Approach 2: Use CLI Command
Tell user to run: `claude-scope config` and select theme interactively.

---

## Example Configurations

### Rich Layout (5 lines, default)
```json
{
  "version": "1.0.0",
  "$aiDocs": "https://github.com/YuriNachos/claude-scope/blob/main/AI-CONFIG-GUIDE.md",
  "lines": {
    "0": [
      { "id": "model", "style": "balanced", "colors": { "name": "...", "version": "..." } },
      { "id": "context", "style": "balanced", "colors": { "low": "...", "medium": "...", "high": "...", "bar": "..." } },
      { "id": "lines", "style": "balanced", "colors": { "added": "...", "removed": "..." } },
      { "id": "cost", "style": "balanced", "colors": { "amount": "...", "currency": "..." } },
      { "id": "duration", "style": "balanced", "colors": { "value": "...", "unit": "..." } }
    ],
    "1": [
      { "id": "git", "style": "balanced", "colors": { "branch": "...", "changes": "..." } },
      { "id": "git-tag", "style": "balanced", "colors": { "branch": "...", "changes": "..." } },
      { "id": "cache-metrics", "style": "balanced", "colors": { "high": "...", "medium": "...", "low": "...", "read": "...", "write": "..." } },
      { "id": "config-count", "style": "balanced", "colors": { "label": "...", "separator": "..." } }
    ],
    "2": [
      { "id": "dev-server", "style": "balanced", "colors": { "name": "...", "status": "...", "label": "..." } },
      { "id": "docker", "style": "balanced", "colors": { "label": "...", "count": "...", "running": "...", "stopped": "..." } },
      { "id": "active-tools", "style": "balanced", "colors": { "running": "...", "completed": "...", "error": "...", "name": "...", "target": "...", "count": "..." } }
    ],
    "3": [
      { "id": "sysmon", "style": "balanced", "colors": { "cpu": "...", "ram": "...", "disk": "...", "network": "...", "separator": "..." } }
    ],
    "4": [
      { "id": "empty-line" }
    ]
  }
}
```

### Compact Layout (1 line)
```json
{
  "version": "1.0.0",
  "$aiDocs": "https://github.com/YuriNachos/claude-scope/blob/main/AI-CONFIG-GUIDE.md",
  "lines": {
    "0": [
      { "id": "model", "style": "compact", "colors": { ... } },
      { "id": "context", "style": "compact", "colors": { ... } },
      { "id": "cost", "style": "compact", "colors": { ... } },
      { "id": "git", "style": "compact", "colors": { ... } },
      { "id": "duration", "style": "compact", "colors": { ... } }
    ],
    "1": [], "2": [], "3": [], "4": [], "5": []
  }
}
```

### Playful Layout (emojis everywhere)
Change all `"style"` fields to `"playful"` for emoji-rich display.

---

## Common User Requests & AI Actions

| User Request | AI Action |
|--------------|-----------|
| "Add poker widget" | Add poker widget to line 4 |
| "Remove git widget" | Remove git widget from its line |
| "Make it compact" | Change all styles to "compact" |
| "Use Dracula theme" | Replace all colors with Dracula palette |
| "Show me docker status" | Add docker widget if not present |
| "More playful!" | Change all styles to "playful" |
| "I want minimal" | Use minimal styles, reduce widgets |
| "Add dev server widget" | Add dev-server widget to line 2 |

---

## Validation Checklist

Before completing the edit:

- [ ] JSON is valid (no syntax errors)
- [ ] `"version"` field preserved
- [ ] `"$aiDocs"` field preserved
- [ ] All widget IDs are from catalog
- [ ] All styles are supported
- [ ] All color fields present for each widget
- [ ] ANSI codes properly escaped (`\\u001b`)
- [ ] Empty lines are `[]`, not missing

---

## Getting Help

If configuration seems invalid:
1. Run `claude-scope config` for interactive setup
2. Check this document for widget/style compatibility
3. Restore from backup if needed
4. File issue at: https://github.com/YuriNachos/claude-scope/issues

---

**Document Version**: 1.1.0
**Last Updated**: 2026-01-31
**Compatible with**: claude-scope >= 0.8.46
