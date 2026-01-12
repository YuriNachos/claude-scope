<div align="center">

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="80" height="80"/>

  # claude-scope

  ### Beautiful, customizable statusline for Claude Code CLI

  [![npm version](https://badge.fury.io/js/claude-scope.svg)](https://www.npmjs.com/package/claude-scope)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
  [![Node.js Version](https://img.shields.io/node/v/claude-scope.svg)](https://github.com/YuriNachos/claude-scope)
  [![GitHub Stars](https://img.shields.io/github/stars/YuriNachos/claude-scope?style=social)](https://github.com/YuriNachos/claude-scope)

  **Features** · [Installation](#-quick-start) · [Configuration](#-ai-powered-customization) · [Widgets](#-available-widgets) · [Themes](#-themes)

</div>

---

<p align="center">
  <i>Real-time session analytics in your terminal — zero runtime dependencies, 14 widgets, 17 themes</i>
</p>

---

## What is it?

**claude-scope** is a CLI plugin for [Claude Code](https://claude.ai/code) that displays real-time session information directly in your statusline. Track your context usage, session cost, git status, active tools, and more — all with beautiful customizable themes.

- **Zero runtime dependencies** — pure TypeScript, native Node.js only
- **14 customizable widgets** — model, context, cost, git, docker, and more
- **17 built-in themes** — from Dracula to Nord to Cyberpunk
- **12 display styles** — balanced, playful, compact, verbose, technical...
- **AI-friendly configuration** — just ask Claude to customize it!

---

## Preview

See how claude-scope looks with different themes:

<table>
<tr>
<td style="background-color: #282a36; padding: 16px; border-radius: 8px;">
<code style="color: #ff79c6; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; line-height: 1.6; white-space: pre;">
<span style="color: #ff79c6;">❯ Dracula Theme</span>
<span style="color: #bd93f9;">Claude Opus 4.5</span>  |  <span style="color: #f1fa8c;">67%</span> <span style="color: #6272a4;">[████████]</span>  |  <span style="color: #50fa7b;">+127</span><span style="color: #ff5555;">/-42</span>  |  <span style="color: #ffb86c;">$1.24</span>  |  <span style="color: #8be9fd;">2h 15m</span>
<span style="color: #50fa7b;">main</span> <span style="color: #f1fa8c;">[+127 -42]</span>  |  <span style="color: #bd93f9;">v0.8.16</span>  |  <span style="color: #8be9fd;">💾 45.2k</span>  |  <span style="color: #6272a4;">📄 1 📜 2 🔌 3 🪝 2</span>
</code>
</td>
</tr>
<tr><td style="height: 12px;"></td></tr>
<tr>
<td style="background-color: #1a1b26; padding: 16px; border-radius: 8px;">
<code style="color: #7aa2f7; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; line-height: 1.6; white-space: pre;">
<span style="color: #7dcfff;">❯ Tokyo Night Theme</span>
<span style="color: #7aa2f7;">Claude Opus 4.5</span>  |  <span style="color: #e0af68;">67%</span> <span style="color: #414868;">[████████]</span>  |  <span style="color: #9ece6a;">+127</span><span style="color: #f7768e;">/-42</span>  |  <span style="color: #ff9e64;">$1.24</span>  |  <span style="color: #7dcfff;">2h 15m</span>
<span style="color: #9ece6a;">main</span> <span style="color: #e0af68;">[+127 -42]</span>  |  <span style="color: #7aa2f7;">v0.8.16</span>  |  <span style="color: #7dcfff;">💾 45.2k</span>  |  <span style="color: #565f89;">📄 1 📜 2 🔌 3 🪝 2</span>
</code>
</td>
</tr>
<tr><td style="height: 12px;"></td></tr>
<tr>
<td style="background-color: #272e33; padding: 16px; border-radius: 8px;">
<code style="color: #88c0d0; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px; line-height: 1.6; white-space: pre;">
<span style="color: #81a1c1;">❯ Nord Theme</span>
<span style="color: #88c0d0;">Claude Opus 4.5</span>  |  <span style="color: #ebcb8b;">67%</span> <span style="color: #4c566a;">[████████]</span>  |  <span style="color: #a3be8c;">+127</span><span style="color: #bf616a;">/-42</span>  |  <span style="color: #d08770;">$1.24</span>  |  <span style="color: #81a1c1;">2h 15m</span>
<span style="color: #a3be8c;">main</span> <span style="color: #ebcb8b;">[+127 -42]</span>  |  <span style="color: #88c0d0;">v0.8.16</span>  |  <span style="color: #81a1c1;">💾 45.2k</span>  |  <span style="color: #4c566a;">📄 1 📜 2 🔌 3 🪝 2</span>
</code>
</td>
</tr>
</table>

---

## Quick Start

Get up and running in 30 seconds:

```bash
# 1. Install via npx (no installation required)
npx -y claude-scope@latest

# 2. Add to your ~/.claude/settings.json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y claude-scope@latest",
    "padding": 0
  }
}

# 3. Restart Claude Code — you're done! 🎉
```

After the first run, a default config is automatically created at `~/.claude-scope/config.json` with:
- **Layout**: `rich` (3 lines)
- **Style**: `balanced`
- **Theme**: `dracula`

---

## 🤖 AI-Powered Customization

**claude-scope is built to work with AI!** Simply ask Claude to customize it:

```
➕ "Add the docker widget to the third line"
🎨 "Switch theme to nord"
😄 "Make it more playful"
🎯 "Show only model and context"
```

**Example dialogue:**

> **User:** Add poker widget and make everything playful
>
> **Claude:** Sure! Adding poker widget and changing styles to playful...
>
> ✅ Done! Your statusline now shows poker hands with emojis.

Claude will automatically modify `~/.claude-scope/config.json` — changes take effect instantly.

**How it works:**
- Config contains `$aiDocs` field linking to [AI-CONFIG-GUIDE](AI-CONFIG-GUIDE.md)
- AI understands all 14 widgets, 12 styles, and 17 themes
- Just say what you want — no manual editing needed

---

## Available Widgets

| Widget | Description | Balanced | Compact | Playful |
|--------|-------------|----------|---------|---------|
| **model** | Current Claude model | `Claude Opus 4.5` | `Opus 4.5` | `🤖 Opus 4.5` |
| **context** | Context usage with progress bar | `45% [████████░░░░░░░░░]` | `45%` | `📊 45% [████████░░░░░░░░░]` |
| **cost** | Session cost in USD | `$0.42` | `$0.42` | `💰 $0.42` |
| **duration** | Session duration | `1h 15m 30s` | `1h15m` | `⌛ 1h 15m` |
| **lines** | Lines added/removed | `+42/-18` | `+42-18` | `➕42 ➖18` |
| **git** | Git branch and changes | `main [+42 -18]` | `main +42/-18` | `🔀 main ⬆42 ⬇18` |
| **git-tag** | Latest git tag | `v0.8.16` | `0.8.16` | `🏷️ v0.8.16` |
| **config-count** | Config file counts | `📄 1 CLAUDE.md │ 📜 2 rules │ 🔌 3 MCPs` | — | — |
| **cache-metrics** | Cache statistics | `💾 35.0k cache` | `35.0k` | `💾 35.0k cache` |
| **active-tools** | Active tools tracking | `Edits: 5 │ Bash: 3 │ Read: 2` | `[Edit] [Read] [Bash]` | `✏️ Edit 📖 Read 🐚 Bash` |
| **dev-server** | Dev server status | `⚡ Nuxt (running)` | `⚡ Nuxt 🚀` | `🏃 Nuxt` |
| **docker** | Docker containers | `Docker: 3/5 🟢` | `🐳 3/5` | `🐳 Docker: 3/5 🟢` |
| **poker** | Poker hands (easter egg) | `Hand: A♠ K♠ │ One Pair!` | `AK│1P` | `🃏 A♠️ K♠️ │ One Pair!` |

### Display Styles — All Variants (Context Widget)

Each widget supports multiple display styles:

| Style | Output |
|-------|--------|
| `balanced` | `45% [████████░░░░░░░░░]` |
| `compact` | `45%` |
| `playful` | `📊 45% [████████░░░░░░░░░]` |
| `verbose` | `45% used (90k/200k tokens)` |
| `technical` | `45% \| 90000/200000` |
| `symbolic` | `◆ 45% [████████░░░░░░░░░]` |
| `labeled` | `Context: 45%` |
| `indicator` | `● 45% [████████░░░░░░░░░]` |

### Layout Presets

| Preset | Lines | Widgets |
|--------|-------|---------|
| **Rich** (default) | 3 | Line 0: model, context, lines, cost, duration<br>Line 1: git, git-tag, cache-metrics, config-count<br>Line 2: dev-server, docker, active-tools |
| **Balanced** | 2 | Line 0: model, context, lines, cost, duration<br>Line 1: git, git-tag, cache-metrics, config-count |
| **Compact** | 1 | Line 0: model, context, cost, git, duration |

---

## Themes

**17 built-in themes** — from classic to futuristic:

| Theme | Description | Accent Colors |
|-------|-------------|---------------|
| `dracula` | Purple/pink accents | <span style="display:inline-block;width:16px;height:16px;background:#ff79c6;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#bd93f9;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#50fa7b;border-radius:3px;"></span> |
| `tokyo-night` | Clean, modern | <span style="display:inline-block;width:16px;height:16px;background:#7aa2f7;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#e0af68;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#9ece6a;border-radius:3px;"></span> |
| `nord` | Arctic blues | <span style="display:inline-block;width:16px;height:16px;background:#88c0d0;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#eceff4;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#a3be8c;border-radius:3px;"></span> |
| `monokai` | Vibrant **default** | <span style="display:inline-block;width:16px;height:16px;background:#ff79c6;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#bd93f9;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#f1fa8c;border-radius:3px;"></span> |
| `catppuccin-mocha` | Soft pastel | <span style="display:inline-block;width:16px;height:16px;background:#f5c2e7;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#fab387;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#89b4fa;border-radius:3px;"></span> |
| `github-dark-dimmed` | GitHub official | <span style="display:inline-block;width:16px;height:16px;background:#79c0ff;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#8b949e;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#3fb950;border-radius:3px;"></span> |
| `vscode-dark-plus` | VSCode default | <span style="display:inline-block;width:16px;height:16px;background:#569cd6;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#c586c0;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#dcdcaa;border-radius:3px;"></span> |
| `one-dark-pro` | Atom's iconic | <span style="display:inline-block;width:16px;height:16px;background:#61afef;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#c678dd;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#d19a66;border-radius:3px;"></span> |
| `solarized-dark` | Classic precise | <span style="display:inline-block;width:16px;height:16px;background:#2aa198;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#b58900;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#268bd2;border-radius:3px;"></span> |
| `rose-pine` | Rose/violet | <span style="display:inline-block;width:16px;height:16px;background:#ebbcba;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#c4a7e7;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#9ccfd8;border-radius:3px;"></span> |
| `cyberpunk-neon` | Cyberpunk 2077 | <span style="display:inline-block;width:16px;height:16px;background:#00f3ff;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#ffee00;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#ff00ff;border-radius:3px;"></span> |
| `professional-blue` | Business blue | <span style="display:inline-block;width:16px;height:16px;background:#0052cc;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#2684ff;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#36b37e;border-radius:3px;"></span> |
| `gray` | Minimal gray | <span style="display:inline-block;width:16px;height:16px;background:#6a6a6a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#8a8a8a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#aaaaaa;border-radius:3px;"></span> |
| `muted-gray` | Very subtle | <span style="display:inline-block;width:16px;height:16px;background:#4a4a4a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#5a5a5a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#6a6a6a;border-radius:3px;"></span> |
| `slate-blue` | Calm blue-grays | <span style="display:inline-block;width:16px;height:16px;background:#6c7a96;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#8b9bb4;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#aab2c0;border-radius:3px;"></span> |
| `dusty-sage` | Earthy greens | <span style="display:inline-block;width:16px;height:16px;background:#7a8c6a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#8a9c7a;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#9aac8a;border-radius:3px;"></span> |
| `semantic-classic` | Industry standard | <span style="display:inline-block;width:16px;height:16px;background:#28a745;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#ffc107;border-radius:3px;"></span> <span style="display:inline-block;width:16px;height:16px;background:#dc3545;border-radius:3px;"></span> |

---

## Configuration

### Quick Config

Interactive configuration menu:

```bash
claude-scope quick-config
```

Choose from:
- **Layout**: Rich (3 lines), Balanced (2 lines), Compact (1 line)
- **Theme**: 17 themes with live preview
- **Style**: balanced, playful, compact, verbose, technical...

### Manual Configuration

Edit `~/.claude-scope/config.json` directly:

```json
{
  "version": "1.0.0",
  "$aiDocs": "https://github.com/YuriNachos/claude-scope/blob/main/AI-CONFIG-GUIDE.md",
  "lines": {
    "0": [
      { "id": "model", "style": "balanced", "colors": { "name": "\\u001b[38;2;189;147;229m" } },
      { "id": "context", "style": "balanced", "colors": { "low": "...", "medium": "...", "high": "..." } }
    ]
  }
}
```

See [AI-CONFIG-GUIDE](AI-CONFIG-GUIDE.md) for complete configuration reference.

---

## Advanced Features

<details>
<summary><b>Zero Runtime Dependencies</b></summary>

claude-scope is written in pure TypeScript and uses only native Node.js modules. No external runtime dependencies — maximum performance and security.
</details>

<details>
<summary><b>Layout & Line System</b></summary>

- **Line 0**: Primary info (model, context, cost, duration, lines, git, dev-server, docker)
- **Line 1**: Extended (git-tag, config-count)
- **Line 2**: Activity (cache-metrics, active-tools)
- **Line 4**: Poker widget (easter egg)
- **Line 5**: Empty line widget
</details>

<details>
<summary><b>Widget System</b></summary>

Each widget implements the `IWidget` interface with lifecycle methods:
- `initialize()` — Set up the widget
- `render()` — Generate output
- `update()` — Handle new data
- `isEnabled()` — Check if active

Widgets gracefully degrade on errors — if something fails, it returns `null`.
</details>

---

## Documentation

| Topic | Link |
|-------|------|
| Architecture, data flow, providers | [ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| All widgets, styles, examples | [WIDGETS.md](docs/WIDGETS.md) |
| Theme system, customization | [THEME-SYSTEM.md](docs/THEME-SYSTEM.md) |
| Formatters, ANSI colors | [FORMATTERS.md](docs/FORMATTERS.md) |
| Version history, roadmap | [CHANGELOG.md](docs/CHANGELOG.md) |

---

## Requirements

- **Node.js** 18 or higher
- **Claude Code** CLI

---

## License

[MIT](LICENSE.md) — feel free to use this project in your own work!

---

<div align="center">

  **Made with ❤️ by [YuriNachos](https://github.com/YuriNachos)**

  [GitHub](https://github.com/YuriNachos/claude-scope) · [Issues](https://github.com/YuriNachos/claude-scope/issues) · [Contributing](CONTRIBUTING.md)

</div>
