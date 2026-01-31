# THEME-SYSTEM.md - Theme System Documentation

## Overview

The Claude Scope project implements a sophisticated, unified theme system that provides consistent color management across all widgets. The system uses 24-bit true color ANSI escape codes and supports 17 built-in themes.

### Architecture Overview

- **Unified color interface**: `IThemeColors` consolidates all widget-specific colors
- **17 built-in themes**: From community favorites (Nord, Dracula) to custom designs
- **Helper functions**: For creating and managing theme colors
- **Widget integration**: Style functions accept optional color parameters
- **WidgetFactory support**: Custom themes can be passed to WidgetFactory

---

## IThemeColors Interface

The central interface that organizes all widget colors:

```typescript
interface IThemeColors {
  base: IBaseColors;           // Base text, muted text, accent, border
  semantic: ISemanticColors;   // Success, warning, error, info
  git: IGitColors;             // Git branch and changes
  context: IContextColors;     // Context usage progress
  lines: ILinesColors;         // Lines added/removed
  cost: ICostColors;           // Cost display
  duration: IDurationColors;   // Session duration
  model: IModelColors;         // Model name display
  poker: IPokerColors;         // Poker game display
  cache: ICacheColors;         // Cache metrics
  tools: IToolsColors;         // Active tools
  devServer: IDevServerColors; // Dev server status
  docker: IDockerColors;       // Docker container status
  sysmon: ISysmonColors;       // System monitoring
  configCount: IConfigCountColors; // Config count display
}
```

---

## All 17 Built-in Themes

| Theme | Style | Description |
|-------|-------|-------------|
| **monokai** (DEFAULT) | Vibrant | Original Monokai with bright accents |
| **vscode-dark-plus** | Standard | VSCode's default dark theme |
| **catppuccin-mocha** | Pastel | Soft, dreamy pastel colors |
| **cyberpunk-neon** | Vibrant | Cyberpunk 2077 inspired neon |
| **dusty-sage** | Muted | Earthy muted greens |
| **dracula** | Popular | Purple/pink accent theme |
| **github-dark-dimmed** | Standard | GitHub's official dark theme |
| **gray** | Minimal | Neutral gray, minimal distraction |
| **muted-gray** | Muted | Very subtle grays |
| **nord** | Cool | Arctic north-bluish palette |
| **one-dark-pro** | IDE | Atom's iconic theme |
| **professional-blue** | Professional | Business-oriented blue |
| **rose-pine** | Pastel | Rose/violet themed |
| **semantic-classic** | Intuitive | Industry-standard semantic colors |
| **slate-blue** | Muted | Calm blue-grays |
| **solarized-dark** | Classic | Precise CIELAB lightness |
| **tokyo-night** | Modern | Clean Tokyo-inspired |

---

## Color Section Reference

### IBaseColors
```typescript
interface IBaseColors {
  text: string;      // Primary text (from model color)
  muted: string;     // Secondary text (from duration)
  accent: string;    // Accent color
  border: string;    // Border color
}
```

### ISemanticColors
```typescript
interface ISemanticColors {
  success: string;   // Success state (green)
  warning: string;   // Warning state (yellow)
  error: string;     // Error state (red)
  info: string;      // Info state (blue)
}
```

### IGitColors
```typescript
interface IGitColors {
  branch: string;    // Git branch name color
  changes: string;   // Git changes color
}
```

### IContextColors
```typescript
interface IContextColors {
  low: string;       // <50% usage (green)
  medium: string;    // 50-79% usage (yellow)
  high: string;      // >=80% usage (red)
  bar: string;       // Progress bar fill
}
```

### ILinesColors
```typescript
interface ILinesColors {
  added: string;     // Lines added color
  removed: string;   // Lines removed color
}
```

### ICostColors
```typescript
interface ICostColors {
  amount: string;    // Cost amount color
  currency: string;  // Currency symbol color
}
```

### IDurationColors
```typescript
interface IDurationColors {
  value: string;     // Duration value color
  unit: string;      // Duration unit color
}
```

### IModelColors
```typescript
interface IModelColors {
  name: string;      // Model name color
  version: string;   // Model version color
}
```

### IPokerColors
```typescript
interface IPokerColors {
  participating: string;    // Participating state color
  nonParticipating: string; // Non-participating state color
  result: string;           // Result color
}
```

### ICacheColors
```typescript
interface ICacheColors {
  high: string;      // >70% hit rate (green)
  medium: string;    // 40-70% hit rate (yellow)
  low: string;       // <40% hit rate (red)
  read: string;      // Cache read tokens
  write: string;     // Cache write tokens
}
```

### IToolsColors
```typescript
interface IToolsColors {
  running: string;     // Running tool indicator
  completed: string;   // Completed tool indicator
  error: string;       // Error tool indicator
  name: string;        // Tool name
  target: string;      // Tool target/path
  count: string;       // Tool count multiplier
}
```

### IDevServerColors
```typescript
interface IDevServerColors {
  name: string;      // Server name (e.g., "Nuxt", "Vite")
  status: string;    // Status text (e.g., "running", "building")
  label: string;     // Label "Server:" or "Dev Server:"
}
```

### IDockerColors
```typescript
interface IDockerColors {
  label: string;     // "Docker:" label
  count: string;     // Container count
  running: string;   // Running indicator
  stopped: string;   // Stopped indicator
}
```

### ISysmonColors
```typescript
interface ISysmonColors {
  cpu: string;       // CPU usage color
  ram: string;       // RAM usage color
  disk: string;      // Disk usage color
  network: string;   // Network usage color
  separator: string; // Separator between metrics
}
```

### IConfigCountColors
```typescript
interface IConfigCountColors {
  label: string;     // Labels (CLAUDE.md, rules, MCPs, hooks)
  separator: string; // Separator between items
}
```

---

## How to Use Themes

### Basic Theme Selection

```typescript
import { getThemeByName, DEFAULT_THEME, AVAILABLE_THEMES } from './ui/theme/index.js';

// Get specific theme
const nordTheme = getThemeByName('nord');

// Use default (Monokai)
const defaultTheme = DEFAULT_THEME;

// List all themes
AVAILABLE_THEMES.forEach(t => console.log(`${t.name}: ${t.description}`));
```

### Using WidgetFactory with Custom Theme

```typescript
import { WidgetFactory } from './core/widget-factory.js';
import { getThemeByName } from './ui/theme/index.js';

// Create factory with custom theme
const nordTheme = getThemeByName('nord');
const factory = new WidgetFactory(nordTheme.colors);

// All widgets created will use Nord theme
const modelWidget = factory.createWidget('model');
const contextWidget = factory.createWidget('context');
```

### Widget Theme Integration

Widgets receive themes through their constructor:

```typescript
// With theme colors
const widget = new ContextWidget(themeColors);

// Default (Monokai)
const widget = new ContextWidget();
```

### Style Functions with Colors

```typescript
// Style functions work with or without colors
const text = styleFunction(data, theme.colors.context);
```

---

## Creating Custom Themes

### Using the Helper Function

```typescript
import { createThemeColors, rgb } from './ui/theme/helpers.js';

const customTheme: IThemeColors = createThemeColors({
  // Git colors
  branch: rgb(59, 130, 246),     // Blue
  changes: rgb(239, 68, 68),     // Red

  // Context colors (green → yellow → red)
  contextLow: rgb(34, 197, 94),     // Green
  contextMedium: rgb(234, 179, 8),  // Yellow
  contextHigh: rgb(239, 68, 68),    // Red

  // Lines colors
  linesAdded: rgb(34, 197, 94),    // Green
  linesRemoved: rgb(239, 68, 68),  // Red

  // Other widget colors
  cost: rgb(249, 115, 22),         // Orange
  model: rgb(99, 102, 241),        // Indigo
  duration: rgb(107, 114, 128),    // Gray
  accent: rgb(59, 130, 246),       // Blue

  // Cache colors
  cacheHigh: rgb(34, 197, 94),
  cacheMedium: rgb(234, 179, 8),
  cacheLow: rgb(239, 68, 68),
  cacheRead: rgb(59, 130, 246),
  cacheWrite: rgb(139, 92, 246),

  // Tools colors
  toolsRunning: rgb(234, 179, 8),
  toolsCompleted: rgb(34, 197, 94),
  toolsError: rgb(239, 68, 68),
  toolsName: rgb(59, 130, 246),
  toolsTarget: rgb(107, 114, 128),
  toolsCount: rgb(249, 115, 22),

  // Sysmon colors
  sysmonCpu: rgb(239, 68, 68),
  sysmonRam: rgb(59, 130, 246),
  sysmonDisk: rgb(234, 179, 8),
  sysmonNetwork: rgb(34, 197, 94),
  sysmonSeparator: rgb(107, 114, 128),

  // Optional: devServer, docker, configCount (have defaults)
});
```

### Creating Complete Theme Objects

```typescript
import type { ITheme } from './ui/theme/types.js';

export const CUSTOM_THEME: ITheme = {
  name: "custom",
  description: "My custom theme",
  colors: createThemeColors({ /* ... */ }),
};
```

Then add to `AVAILABLE_THEMES` in `src/ui/theme/index.ts`.

---

## ANSI Color System Reference

### 24-bit True Color

```typescript
function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

// Example: Pure red
const pureRed = rgb(255, 0, 0); // "\x1b[38;2;255;0;0m"
```

### Basic ANSI Colors

```typescript
export const reset = "\x1b[0m";
export const red = "\x1b[31m";
export const green = "\x1b[32m";
export const yellow = "\x1b[33m";
export const blue = "\x1b[34m";
export const cyan = "\x1b[36m";
export const white = "\x1b[37m";
export const gray = "\x1b[90m";
```

### Colorize Function

```typescript
function colorize(text: string, color: string): string {
  return `${color}${text}${reset}`;
}
```

---

## Widget Theme Integration Patterns

### Base Widget Pattern

```typescript
import { DEFAULT_THEME } from '../ui/theme/index.js';

export class Widget extends StdinDataWidget {
  private colors: IThemeColors;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  render(data: RenderData): string {
    const textColor = this.colors.widgetSpecific.color;
    return colorize(text, textColor);
  }
}
```

### Style Function Pattern

```typescript
export const widgetStyles: StyleMap<RenderData, WidgetColors> = {
  balanced: (data, colors) => {
    if (!colors) return data.text;
    return colorize(data.text, colors.text);
  },
};
```

---

## Future: Theme Customization

The theme system is designed to support:
- Custom color themes via configuration
- Theme selection from config file
- Per-widget color overrides

Example (planned):
```json
// ~/.claude-scope/config.json
{
  "theme": "nord",
  "widgetColors": {
    "git": { "branch": "#61afef" }
  }
}
```
