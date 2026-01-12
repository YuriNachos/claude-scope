<div align="center">

  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="80" height="80"/>

  # claude-scope

  ### Beautiful, customizable statusline for Claude Code CLI

  [![npm version](https://badge.fury.io/js/claude-scope.svg)](https://www.npmjs.com/package/claude-scope)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
  [![Node.js Version](https://img.shields.io/node/v/claude-scope.svg)](https://github.com/YuriNachos/claude-scope)
  [![GitHub Stars](https://img.shields.io/github/stars/YuriNachos/claude-scope?style=social)](https://github.com/YuriNachos/claude-scope)
  [![codecov](https://codecov.io/gh/YuriNachos/claude-scope/branch/main/graph/badge.svg)](https://codecov.io/gh/YuriNachos/claude-scope)

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

**Dracula Theme** (default)
```
Claude Opus 4.5  |  67% [████████]  |  +127/-42  |  $1.24  |  2h 15m
main [+127 -42]  |  v0.8.16  |  💾 45.2k  |  📄 1 📜 2 🔌 3 🪝 2
⚡ Nuxt (running)  |  🐳 3/5 🟢  |  Edits: 8 | Bash: 3 | Read: 12
```

**Tokyo Night Theme**
```
Claude Opus 4.5  |  67% [████████]  |  +127/-42  |  $1.24  |  2h 15m
main [+127 -42]  |  v0.8.16  |  💾 45.2k  |  📄 1 📜 2 🔌 3 🪝 2
⚡ Nuxt (running)  |  🐳 3/5 🟢  |  Edits: 8 | Bash: 3 | Read: 12
```

**Nord Theme**
```
Claude Opus 4.5  |  67% [████████]  |  +127/-42  |  $1.24  |  2h 15m
main [+127 -42]  |  v0.8.16  |  💾 45.2k  |  📄 1 📜 2 🔌 3 🪝 2
⚡ Nuxt (running)  |  🐳 3/5 🟢  |  Edits: 8 | Bash: 3 | Read: 12
```

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

| Widget | Description | Balanced | Playful |
|--------|-------------|----------|---------|
| **model** | Current Claude model | `Claude Opus 4.5` | `🤖 Opus 4.5` |
| **context** | Context usage with progress bar | `45% [████████░░░░░░░░░]` | `📊 45% [████████░░░░░░░░░]` |
| **cost** | Session cost in USD | `$0.42` | `💰 $0.42` |
| **duration** | Session duration | `1h 15m 30s` | `⌛ 1h 15m` |
| **lines** | Lines added/removed | `+42/-18` | `➕42 ➖18` |
| **git** | Git branch and changes | `main [+42 -18]` | `🔀 main ⬆42 ⬇18` |
| **git-tag** | Latest git tag | `v0.8.16` | `🏷️ v0.8.16` |
| **config-count** | Config file counts | `📄 1 CLAUDE.md │ 📜 2 rules │ 🔌 3 MCPs` | — |
| **cache-metrics** | Cache statistics | `💾 35.0k cache` | `💾 35.0k cache` |
| **active-tools** | Active tools tracking | `Edits: 5 │ Bash: 3 │ Read: 2` | `✏️ Edit 📖 Read 🐚 Bash` |
| **dev-server** | Dev server status | `⚡ Nuxt (running)` | `🏃 Nuxt` |
| **docker** | Docker containers | `Docker: 3/5 🟢` | `🐳 Docker: 3/5 🟢` |
| **poker** | Poker hands (easter egg) | `Hand: A♠ K♠ │ One Pair!` | `🃏 A♠️ K♠️ │ One Pair!` |

### Layout Presets

| Preset | Lines | Widgets |
|--------|-------|---------|
| **Rich** (default) | 3 | Line 0: model, context, lines, cost, duration<br>Line 1: git, git-tag, cache-metrics, config-count<br>Line 2: dev-server, docker, active-tools |
| **Balanced** | 2 | Line 0: model, context, lines, cost, duration<br>Line 1: git, git-tag, cache-metrics, config-count |
| **Compact** | 1 | Line 0: model, context, cost, git, duration |

---

## Themes

**Built-in themes** — from classic to futuristic:

| Theme | Style | Colors |
|-------|-------|--------|
| `dracula` | Popular | Purple, pink, green |
| `tokyo-night` | Modern | Blue, yellow, green |
| `nord` | Cool | Arctic blues |
| `monokai` | Vibrant | **DEFAULT** — bright accents |
| `catppuccin-mocha` | Pastel | Soft dreamy colors |
| `github-dark-dimmed` | Standard | GitHub's official dark |
| `vscode-dark-plus` | Standard | VSCode's default |
| `one-dark-pro` | IDE | Atom's iconic theme |
| `solarized-dark` | Classic | Precise CIELAB lightness |
| `rose-pine` | Pastel | Rose/violet themed |
| `cyberpunk-neon` | Vibrant | Cyberpunk 2077 neon |
| `professional-blue` | Professional | Business-oriented blue |
| `gray` | Minimal | Neutral gray, minimal |
| `muted-gray` | Muted | Very subtle grays |
| `slate-blue` | Muted | Calm blue-grays |
| `dusty-sage` | Muted | Earthy greens |
| `semantic-classic` | Intuitive | Industry-standard colors |

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
