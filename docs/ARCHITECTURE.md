# Claude Scope Architecture Documentation

This document provides a comprehensive overview of the Claude Scope TypeScript CLI architecture, including design patterns, data flow, type system, and implementation details.

## Table of Contents

1. [Overview](#overview)
2. [Core Architecture Patterns](#core-architecture-patterns)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Provider Abstractions](#provider-abstractions)
5. [Type System Architecture](#type-system-architecture)
6. [Configuration System](#configuration-system)
7. [Widget Architecture](#widget-architecture)
8. [Theme System](#theme-system)
9. [Style System](#style-system)
10. [Error Handling](#error-handling)
11. [File Breakdown](#file-breakdown)
12. [Performance Considerations](#performance-considerations)
13. [Extension Points](#extension-points)

## Overview

Claude Scope is a modular, plugin-based CLI tool that displays real-time information about Claude Code sessions in the terminal. The architecture follows SOLID principles with heavy emphasis on dependency inversion, testability, and extensibility.

### Key Features

- **Modular Widget System**: Each piece of information is displayed as a separate widget
- **Plugin Architecture**: New widgets can be added without modifying core code
- **Multi-line Statusline**: Supports up to 6 lines of status information
- **Unified Theme System**: 17 built-in themes with consistent color management
- **Flexible Style System**: Multiple display styles per widget (minimal, balanced, compact, etc.)
- **Error Resilience**: Widget failures don't break the entire statusline
- **Configuration System**: JSON-based configuration with interactive setup
- **Caching System**: Intelligent caching for expensive operations

### Architecture Diagram

```
Claude Code Stdin
     │
     ▼
StdinProvider → StdinData Schema
     │
     ▼
WidgetRegistry ← WidgetFactory
     │
     ▼
Widget Instances
     │
     ▼
Renderer → Terminal Output
```

## Core Architecture Patterns

### 1. Widget Registry Pattern

The central `WidgetRegistry` manages all widget instances using the Registry Pattern.

```typescript
export class WidgetRegistry {
  private widgets: Map<string, IWidget> = new Map();

  async register(widget: IWidget, context?: WidgetContext): Promise<void>
  async unregister(id: string): Promise<void>
  get(id: string): IWidget | undefined
  getEnabledWidgets(): IWidget[]
  async clear(): Promise<void>
}
```

**Benefits:**
- Centralized widget management
- Dependency injection capabilities
- Easy widget lifecycle management

### 2. Dependency Inversion Principle (DIP)

The architecture strictly follows DIP with interface abstractions.

**Key Interfaces:**
- `IWidget` - Widget contract
- `IGit` - Git operations
- `ITranscriptProvider` - Transcript parsing
- `IConfigProvider` - Configuration scanning

### 3. Template Method Pattern

The `StdinDataWidget` base class implements the Template Method Pattern:

```typescript
export abstract class StdinDataWidget implements IWidget {
  // Template method - final implementation
  async render(context: RenderContext): Promise<string | null> {
    if (!this.data || !this.enabled) return null;
    return this.renderWithData(this.data, context);
  }

  // Hook method - subclasses implement
  protected abstract renderWithData(data: StdinData, context: RenderContext): string | null;
}
```

**Benefits:**
- Common logic is centralized (null checks, enabled state)
- Subclasses only need to implement specific rendering logic

### 4. Factory Pattern

The `WidgetFactory` centralizes widget instantiation:

```typescript
export class WidgetFactory {
  createWidget(widgetId: string): IWidget | null {
    switch (widgetId) {
      case "cwd": return new CwdWidget();
      case "model": return new ModelWidget();
      case "context": return new ContextWidget();
      case "cost": return new CostWidget();
      case "lines": return new LinesWidget();
      case "duration": return new DurationWidget();
      case "git": return new GitWidget();
      case "git-tag": return new GitTagWidget();
      case "config-count": return new ConfigCountWidget();
      case "cache-metrics": return new CacheMetricsWidget();
      case "active-tools": return new ActiveToolsWidget();
      case "dev-server": return new DevServerWidget();
      case "docker": return new DockerWidget();
      case "poker": return new PokerWidget();
      case "sysmon": return new SysmonWidget();
      case "empty-line": return new EmptyLineWidget();
      default: return null;
    }
  }

  getSupportedWidgetIds(): string[] {
    return ["cwd", "model", "context", "cost", "lines", "duration",
            "git", "git-tag", "config-count", "cache-metrics",
            "active-tools", "dev-server", "docker", "poker",
            "sysmon", "empty-line"];
  }
}
```

### 5. Strategy Pattern for Styles

Widgets implement multiple rendering strategies:

```typescript
export type StyleRendererFn<T, C = unknown> = (data: T, colors?: C) => string;

export const modelStyles: StyleMap<ModelRenderData> = {
  balanced: (data) => data.displayName,
  compact: (data) => data.displayName.replace("Claude ", ""),
  playful: (data) => `🤖 ${data.displayName}`,
};
```

## Data Flow Architecture

### Complete Data Flow Sequence

```
1. Claude Code → JSON via stdin
2. StdinProvider → Parse & Validate
3. WidgetRegistry → Data Update
4. WidgetFactory → Create Widgets
5. Widget Instances → Initialize & Update(data)
6. Renderer → Render Enabled Widgets
7. Terminal → Output String
```

### Step-by-Step Process

**1. Stdin Input**
```json
{
  "session_id": "session_20250106_123045",
  "cwd": "/Users/user/project",
  "model": { "id": "claude-opus-4-5-20251101", "display_name": "Claude Opus 4.5" },
  "workspace": { "current_dir": "/Users/user/project" },
  "cost": { "total_cost_usd": 0.42 },
  "context_window": { "total_input_tokens": 200000 }
}
```

**2. StdinProvider Processing**
```typescript
const provider = new StdinProvider();
const stdinData = await provider.parse(stdin);
// Validates against schema
```

**3. Widget Creation & Registration**
```typescript
const registry = new WidgetRegistry();
const factory = new WidgetFactory();

const widget = factory.createWidget("git");
await registry.register(widget);
```

**4. Data Update**
```typescript
for (const widget of registry.getAll()) {
  await widget.update(stdinData);
}
```

**5. Rendering**
```typescript
const renderer = new Renderer();
const lines = await renderer.render(registry.getEnabledWidgets(), {
  width: 80,
  timestamp: Date.now()
});
```

## Provider Abstractions

### 1. Git Provider (`IGit`)

```typescript
export interface IGit {
  status(): Promise<GitStatusResult>;
  diffSummary(options?: string[]): Promise<GitDiffSummary>;
  latestTag?(): Promise<string | null>;
}

export class NativeGit implements IGit {
  constructor(private cwd: string) {}

  async status(): Promise<GitStatusResult> {
    const { stdout } = await execFileAsync("git", ["status", "--branch", "--short"], {
      cwd: this.cwd,
    });
    // Parse output like: "## main" or "## feature-branch"
  }
}
```

**Features:**
- Uses native Node.js `child_process` (no external dependencies)
- Graceful handling of non-git repositories
- Proper error handling and fallbacks

### 2. Transcript Provider (`ITranscriptProvider`)

```typescript
export interface ITranscriptProvider {
  parseTools(path: string): Promise<ToolEntry[]>;
}

export class TranscriptProvider implements ITranscriptProvider {
  async parseTools(transcriptPath: string): Promise<ToolEntry[]> {
    // Reads JSONL transcript file
    // Maps tool_use blocks to tool_result blocks by ID
    return tools.slice(-this.MAX_TOOLS); // Limit to last 20
  }
}
```

**Features:**
- Parses Claude Code's JSONL transcript format
- Tracks tool lifecycle (running → completed/error)
- Limits to recent tools for performance

### 3. Config Provider (`IConfigProvider`)

```typescript
export interface IConfigProvider {
  getConfigs(options?: ConfigScanOptions): Promise<ConfigCounts>;
}

export class ConfigProvider implements IConfigProvider {
  private cachedCounts?: ConfigCounts;
  private readonly cacheInterval = 5000; // 5 seconds cache

  async getConfigs(): Promise<ConfigCounts> {
    if (this.cachedCounts && Date.now() - this.lastScan < this.cacheInterval) {
      return this.cachedCounts;
    }
    this.cachedCounts = await this.scanConfigs();
    return this.cachedCounts;
  }
}
```

**Features:**
- Hybrid caching (5-second invalidation)
- Scans both user and project scopes
- Handles multiple config locations

## Type System Architecture

### Core Types

**IWidget Interface**
```typescript
export interface IWidget {
  readonly id: string;
  readonly metadata: IWidgetMetadata;
  initialize(context: WidgetContext): Promise<void>;
  render(context: RenderContext): Promise<string | null>;
  update(data: StdinData): Promise<void>;
  isEnabled(): boolean;
  cleanup?(): Promise<void>;
  setStyle?(style: WidgetStyle): void;
  setLine?(line: number): void;
  getLine?(): number;
}
```

**Widget Metadata**
```typescript
export interface IWidgetMetadata {
  name: string;
  description: string;
  line?: number; // Which statusline line (0-indexed)
}
```

**Render Context**
```typescript
export interface RenderContext {
  width: number;       // Terminal width
  timestamp: number;   // For cache invalidation
}
```

### Style Types

```typescript
export type WidgetStyle =
  | "minimal" | "balanced" | "compact" | "playful"
  | "verbose" | "technical" | "symbolic"
  | "labeled" | "indicator" | "emoji"
  | "compact-verbose" | "breakdown";

export type StyleRendererFn<T, C = unknown> = (data: T, colors?: C) => string;
export type StyleMap<T, C = unknown> = Partial<Record<WidgetStyle, StyleRendererFn<T, C>>>;
```

### Theme Types

```typescript
export interface IThemeColors {
  base: IBaseColors;
  semantic: ISemanticColors;
  git: IGitColors;
  context: IContextColors;
  lines: ILinesColors;
  cost: ICostColors;
  duration: IDurationColors;
  model: IModelColors;
  poker: IPokerColors;
  cache: ICacheColors;
  tools: IToolsColors;
  devServer: IDevServerColors;
  docker: IDockerColors;
}
```

## Configuration System

### Configuration Architecture

The system has two separate configuration systems:

1. **Main CLI Configuration** (`~/.claude-scope/config.json`)
   - Controls widget styles and layout
   - Loaded via `config-loader.ts`

2. **Quick Configuration** (Interactive CLI)
   - Three-stage setup: layout → style → theme
   - Creates and saves the main config

### Main Configuration Structure

```json
{
  "version": "1.0.0",
  "lines": {
    "0": [
      {
        "id": "model",
        "style": "balanced",
        "colors": { "name": "#61afef" }
      }
    ]
  }
}
```

### Configuration Loading

```typescript
export async function loadWidgetConfig(): Promise<LoadedConfig | null> {
  const configPath = join(homedir(), ".claude-scope", "config.json");
  await ensureDefaultConfig();
  // Load and parse config
}
```

## Widget Architecture

### Widget Categories

**1. Data Widgets** (Inherit from StdinDataWidget):
- CwdWidget, ModelWidget, ContextWidget, CostWidget, LinesWidget, DurationWidget

**2. Complex Widgets** (Custom Implementation):
- GitWidget, GitTagWidget, ConfigCountWidget, ActiveToolsWidget, CacheMetricsWidget, DevServerWidget, DockerWidget

**3. Entertainment Widgets**:
- PokerWidget, EmptyLineWidget

**4. System Widgets**:
- SysmonWidget

### Widget Base Classes

**StdinDataWidget** (Template Method):
```typescript
export abstract class StdinDataWidget implements IWidget {
  protected data: StdinData | null = null;
  protected enabled = true;

  async render(context: RenderContext): Promise<string | null> {
    if (!this.data || !this.enabled) return null;
    return this.renderWithData(this.data, context);
  }

  protected abstract renderWithData(data: StdinData, context: RenderContext): string | null;
}
```

The theme system provides consistent color management across all widgets with 17 built-in themes.

### Theme Structure

```typescript
export interface ITheme {
  name: string;
  description: string;
  colors: IThemeColors;
}
```

### Theme Selection

```typescript
// Default theme (Monokai)
export const DEFAULT_THEME = MONOKAI_THEME.colors;

// Get theme by name
export function getThemeByName(name: string): ITheme {
  return AVAILABLE_THEMES.find((t) => t.name === name) ?? MONOKAI_THEME;
}
```

**Available Themes:** monokai, nord, dracula, catppuccin-mocha, tokyo-night, vscode-dark-plus, github-dark-dimmed, dusty-sage, gray, muted-gray, slate-blue, professional-blue, rose-pine, semantic-classic, solarized-dark, one-dark-pro, cyberpunk-neon.

## Style System

Each widget supports multiple display styles through functional renderers.

### Style Examples by Widget

**GitWidget:**
- balanced: `"main [+42 -18]"`
- compact: `"main +42/-18"`
- playful: `"🔀 main ⬆42 ⬇18"`
- verbose: `"branch: main [+42 insertions, -18 deletions]"`

**ModelWidget:**
- balanced: `"Claude Opus 4.5"`
- compact: `"Opus 4.5"`
- playful: `"🤖 Opus 4.5"`
- technical: `"claude-opus-4-5-20251101"`

**ContextWidget:**
- balanced: `"45% [████████░░░░░░░░░]"`
- compact: `"45%"`
- playful: `"📊 45% [████████░░░░░░░░░]"`

## Error Handling

### Error Boundaries

The Renderer implements error boundaries at multiple levels:

1. **Widget Level**: Individual widget failures don't break the statusline
2. **Line Level**: Failed widgets are skipped
3. **Application Level**: Fallback to basic git info

```typescript
export class Renderer {
  async render(widgets: IWidget[], context: RenderContext): Promise<string[]> {
    for (const widget of widgetsForLine) {
      try {
        const output = await widget.render(context);
        if (output !== null) outputs.push(output);
      } catch (error) {
        this.handleError(error as Error, widget);
      }
    }
    return lines;
  }
}
```

## File Breakdown

### Core Modules (`src/core/`)

| File | Purpose |
|------|---------|
| `types.ts` | Core widget interfaces, RenderContext, WidgetContext |
| `widget-registry.ts` | Central widget registry, lifecycle management |
| `widget-factory.ts` | Widget instantiation logic |
| `renderer.ts` | Multi-line rendering engine, error boundaries |
| `widget-types.ts` | Widget metadata helpers |
| `style-types.ts` | WidgetStyle type definitions |

### Data Modules (`src/data/`)

| File | Purpose |
|------|---------|
| `stdin-provider.ts` | JSON parsing from stdin, schema validation |

### Provider Modules (`src/providers/`)

| File | Purpose |
|------|---------|
| `git-provider.ts` | IGit interface, NativeGit implementation |
| `transcript-provider.ts` | ITranscriptProvider, JSONL parsing |
| `config-provider.ts` | IConfigProvider, filesystem scanning |

## Performance Considerations

### Caching Strategy

1. **Config Provider** - 5-second cache for filesystem scanning
2. **Git Operations** - Command execution caching
3. **Docker Widget** - 5-second cache for container queries
4. **Widget Rendering** - On-demand with timestamp invalidation

### Memory Management

1. **Widget Registry** - Cleanup resources on unregister
2. **Transcript Provider** - Limit to last 20 tool entries
3. **Style Functions** - Functional, no state preservation

## Extension Points

### Adding New Widgets

```typescript
// 1. Implement IWidget Interface
export class MyWidget implements IWidget {
  readonly id = "my-widget";
  readonly metadata = createWidgetMetadata("My Widget", "Description");

  async initialize(context: WidgetContext): Promise<void> { /* ... */ }
  async render(context: RenderContext): Promise<string | null> { /* ... */ }
  async update(data: StdinData): Promise<void> { /* ... */ }
  isEnabled(): boolean { return true; }
}

// 2. Add to WidgetFactory
case "my-widget": return new MyWidget();

// 3. Add to Quick Config layouts
```

### Adding New Themes

```typescript
export const MY_THEME: ITheme = {
  name: "My Theme",
  description: "Custom theme",
  colors: createThemeColors({
    branch: rgb(59, 130, 246),
    changes: rgb(239, 68, 68),
    // ... all required colors
  }),
};
```

## Key Files Reference

| File | Key Types/Exports |
|------|------------------|
| `src/core/types.ts` | IWidget, IWidgetMetadata, RenderContext, WidgetContext |
| `src/core/widget-registry.ts` | WidgetRegistry class |
| `src/core/widget-factory.ts` | WidgetFactory class |
| `src/core/renderer.ts` | Renderer class |
| `src/providers/git-provider.ts` | IGit interface, NativeGit class |
| `src/providers/transcript-provider.ts` | ITranscriptProvider interface |
| `src/providers/config-provider.ts` | IConfigProvider interface |
| `src/ui/theme/types.ts` | IThemeColors interface |
| `src/core/style-types.ts` | WidgetStyle type, StyleRendererFn, StyleMap |
