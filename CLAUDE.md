# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code CLI tool that displays status information in the terminal. Users working in Claude Code will see real-time information about their current session.

**Current version**: v0.6.15

**Implemented features**:
- Git branch and changes display
- Multi-line statusline (config counts on second line)
- Model information display
- Context usage with progress bar
- Session duration tracking
- Cost estimation display
- Lines added/removed display
- Configuration counts (CLAUDE.md, rules, MCPs, hooks)
- Poker widget with participation-based formatting
- Parentheses for participating cards with bold
- All cards show suit color (red for ♥♦, gray for ♠♣)
- Update throttling (5 seconds minimum between hand regeneration)
- Empty line separator widget (4th line)

**Planned features**: Running agents, todo progress, session analytics, configuration system.

## Architecture

### Widget Registry Pattern (Senior-Level Design)

This project uses a **modular widget architecture** with a central registry, following Dependency Inversion Principle and modern TypeScript plugin best practices.

**Current Implementation** (v0.3.0):
```
src/
├── core/
│   ├── types.ts              # Core types (IWidget, IWidgetMetadata, etc.)
│   ├── widget-registry.ts    # Central registry for widget management
│   ├── widget-types.ts       # Helper utilities for widget metadata
│   └── renderer.ts           # Unified rendering engine with error boundaries
├── data/
│   └── stdin-provider.ts     # Stdin JSON parser and validation
├── providers/
│   ├── git-provider.ts       # Git operations wrapper (IGit interface)
│   └── config-provider.ts    # Claude Code config scanner with caching
├── widgets/
│   ├── core/
│   │   └── stdin-data-widget.ts  # Base class for widgets receiving StdinData
│   ├── git/
│   │   └── git-widget.ts         # Git branch with changes display
│   ├── poker-widget.ts        # Poker entertainment widget
│   ├── poker/
│   │   ├── types.ts           # Poker types (Card, Suit, Rank, HandRank)
│   │   ├── deck.ts            # Deck class with shuffle/deal
│   │   └── hand-evaluator.ts  # Hand combination evaluator
│   ├── context-widget.ts     # Context usage with progress bar
│   ├── cost-widget.ts        # Cost display widget
│   ├── lines-widget.ts       # Lines added/removed widget
│   ├── config-count-widget.ts # Configuration counts widget
│   ├── duration-widget.ts    # Session duration formatter
│   └── model-widget.ts       # Model display widget
│   ├── active-tools/         # Active tools from transcript
│   │   ├── types.ts          # Active tools types
│   │   ├── styles.ts         # Active tools styles
│   │   └── active-tools-widget.ts
│   └── cache-metrics/        # Cache metrics widget
│       ├── types.ts          # Cache metrics types
│       ├── styles.ts         # Cache metrics styles
│       └── cache-metrics-widget.ts
├── ui/
│   ├── theme/                # Theme system and color configuration
│   │   ├── index.ts          # Theme exports
│   │   ├── types.ts          # Color configuration interfaces
│   │   └── gray-theme.ts     # Gray theme (default)
│   └── utils/
│       ├── colors.ts         # ANSI color utilities
│       └── formatters.ts     # Human-readable formatters (duration, cost, progress)
├── validation/
│   ├── core.ts               # Result type and Validator interface
│   ├── validators.ts         # Type validators (string, number, literal, etc.)
│   ├── combinators.ts        # Validator composition utilities
│   ├── result.ts             # Error formatting helpers
│   └── index.ts              # Validation entry point
├── schemas/
│   └── stdin-schema.ts       # Zod-like schema definitions for stdin data
├── constants.ts              # Default values and constants
├── types.ts                  # Shared types (re-exports from schemas)
└── index.ts                  # CLI entry point
```

**Planned Architecture** (future versions):
```
src/
├── core/
│   ├── types.ts
│   ├── widget-registry.ts
│   ├── config-loader.ts      # TODO: JSON config parser & validator
│   └── renderer.ts
├── providers/
│   ├── stdin-provider.ts
│   └── git-provider.ts
├── storage/                  # TODO: SQLite-based persistence
│   ├── session-store.ts      # PLANNED
│   └── analytics-store.ts    # PLANNED
├── widgets/
│   ├── core/
│   │   └── stdin-data-widget.ts
│   ├── git/
│   │   └── git-widget.ts     # ✓ Implemented (branch + changes)
│   ├── context-widget.ts     # ✓ Implemented
│   ├── cost-widget.ts        # ✓ Implemented
│   ├── duration-widget.ts    # ✓ Implemented
│   ├── model-widget.ts       # ✓ Implemented
│   ├── empty-line-widget.ts  # ✓ Implemented (blank separator)
│   ├── active-tools/         # ✓ Implemented (transcript-based tool tracking)
│   │   └── active-tools-widget.ts
│   └── cache-metrics/        # ✓ Implemented (cache tokens & savings)
│       └── cache-metrics-widget.ts
│   ├── session-widget.ts     # PLANNED
│   ├── agents-widget.ts      # PLANNED
│   ├── todos-widget.ts       # PLANNED
│   └── analytics-widget.ts   # PLANNED
├── ui/utils/
├── validation/
├── schemas/
├── config/                   # TODO: Configuration system
│   ├── default.config.json
│   └── presets/              # PLANNED: compact, detailed, minimal
├── constants.ts
├── types.ts
└── index.ts
```

### Widget Interface

All widgets must implement `IWidget`:

```typescript
interface IWidget {
  readonly id: string;
  readonly metadata: IWidgetMetadata;

  initialize(context: WidgetContext): Promise<void>;
  render(context: RenderContext): Promise<string | null>;
  update(data: StdinData): Promise<void>;
  isEnabled(): boolean;
  cleanup?(): Promise<void>;
}
```

**Widget metadata** includes `line` property for multi-line support:

```typescript
interface IWidgetMetadata {
  name: string;
  description: string;
  line?: number;  // Which statusline line (0 = first, 1 = second, etc.)
}
```

### Theme System

The project uses a unified theme system for widget color configuration. All colors are managed through a single `IThemeColors` interface, allowing consistent theming across all widgets.

#### IThemeColors Interface

The unified theme contains color sections for all widgets:

```typescript
interface IThemeColors {
  base: IBaseColors;        // Base text, muted text
  semantic: ISemanticColors; // Info, warning, error, success
  git: IGitColors;          // Git branch and changes
  context: IContextColors;  // Context usage progress
  lines: ILinesColors;      // Lines added/removed
  cost: ICostColors;        // Cost display
  duration: IDurationColors;// Session duration
  model: IModelColors;      // Model name display
  poker: IPokerColors;      // Poker game display
  cache: ICacheColors;      // Cache metrics (hit rate, savings)
  tools: IToolsColors;      // Active tools (running, completed)
}
```

Each widget has a color section with widget-specific colors:

```typescript
// ContextWidget colors (progress bar states)
interface IContextColors {
  low: string;     // Color for < 50% usage
  medium: string;  // Color for 50-79% usage
  high: string;    // Color for >= 80% usage
}

// LinesWidget colors
interface ILinesColors {
  added: string;    // Color for added lines (+N)
  removed: string;  // Color for removed lines (-N)
}

// CacheMetricsWidget colors
interface ICacheColors {
  high: string;     // Color for high cache hit rate (>70%)
  medium: string;   // Color for medium cache hit rate (40-70%)
  low: string;      // Color for low cache hit rate (<40%)
  read: string;     // Color for cache read amount
  write: string;    // Color for cache write amount
}

// ActiveToolsWidget colors
interface IToolsColors {
  running: string;  // Color for running tool indicator
  completed: string;// Color for completed tool indicator
  error: string;    // Color for error tool indicator
  name: string;     // Color for tool name
  target: string;   // Color for tool target/path
  count: string;    // Color for tool count multiplier
}
```

#### Available Themes

**17 themes available:**

| Theme | Description | Style |
|-------|-------------|-------|
| vscode-dark-plus | VSCode default dark theme | Standard |
| catppuccin-mocha | Soothing pastel theme | Pastel |
| cyberpunk-neon | High-contrast neon aesthetic | Vibrant |
| dusty-sage | Earthy muted greens | Muted |
| dracula | Purple/pink accents | Popular |
| github-dark-dimmed | GitHub official dark | Standard |
| gray | Neutral gray | Minimal |
| monokai | Vibrant high-contrast | **DEFAULT** |
| muted-gray | Very subtle grays | Muted |
| nord | Arctic north-bluish | Cool |
| one-dark-pro | Atom's iconic theme | IDE |
| professional-blue | Business-oriented blue | Professional |
| rose-pine | Rose/violet themed | Pastel |
| semantic-classic | Industry-standard colors | Intuitive |
| slate-blue | Calm blue-grays | Muted |
| solarized-dark | Precise CIELAB lightness | Classic |
| tokyo-night | Clean Tokyo-inspired | Modern |

#### Using Themes

```typescript
import { getThemeByName, DEFAULT_THEME, AVAILABLE_THEMES } from './ui/theme/index.js';

// Get specific theme
const nordTheme = getThemeByName('nord');

// Use default (Monokai)
const defaultTheme = DEFAULT_THEME;

// List all themes
AVAILABLE_THEMES.forEach(t => console.log(t.name));
```

#### Theme Migration (v0.6.x)

All widgets have been migrated to use the unified `IThemeColors` interface. Previously, widgets accepted individual color sections (e.g., `IContextColors`), but now all widgets use a single theme object:

```typescript
// Before (individual color sections):
const widget = new ContextWidget({ low: '...', medium: '...', high: '...' });

// After (unified theme):
const widget = new ContextWidget(DEFAULT_THEME); // uses theme.context (Monokai)
```

This architecture allows for:
- Consistent theming across all widgets
- Easy addition of new themes in the future
- Partial theme customization via `IThemeColors` overrides
- 17 built-in themes for different preferences

All themes use ANSI RGB escape codes for 24-bit true color. Each theme is in a separate file for easy maintenance and customization.

#### Future: Theme Customization

The theme system is designed to support future customization options:
- Custom color themes via configuration
- Theme selection from config file
- Per-widget color overrides

### Widget Style System

Each widget supports multiple display styles through a functional renderer pattern. Styles are pure functions that transform widget data into formatted output strings.

#### Available Styles

| Style | Description | Example |
|-------|-------------|---------|
| `minimal` | Most compact, no labels | `main` |
| `balanced` | Default, clean formatting | `main [+42 -18]` |
| `compact` | Condensed, minimal spacing | `main +42/-18` |
| `playful` | With emojis | `🔀 main ⬆42 ⬇18` |
| `verbose` | Full text labels | `branch: main [+42 insertions, -18 deletions]` |
| `technical` | Raw values | `claude-opus-4-5-20251101` |
| `symbolic` | With symbols | `◆ Opus 4.5` |
| `labeled` | Prefix labels | `Git: main [3 files: +42/-18]` |
| `indicator` | Bullet indicators | `● main [+42 -18]` |
| `emoji` | Colorful emojis | `Hand: A♠️ K♠️ | Board: Q♥️ ...` |
| `compact-verbose` | Compact with abbreviations | `RF (Royal Flush)` |

#### Style Examples by Widget

**GitWidget** (shows branch and changes):
```
minimal:     main
balanced:    main [+42 -18]
compact:     main +42/-18
playful:     🔀 main ⬆42 ⬇18
verbose:     branch: main [+42 insertions, -18 deletions]
labeled:     Git: main [3 files: +42/-18]
indicator:   ● main [+42 -18]
```

**ModelWidget** (shows model name):
```
balanced:    Claude Opus 4.5
compact:     Opus 4.5
playful:     🤖 Opus 4.5
technical:   claude-opus-4-5-20251101
symbolic:    ◆ Opus 4.5
labeled:     Model: Opus 4.5
indicator:   ● Opus 4.5
```

**PokerWidget** (shows poker hand):
```
balanced:    Hand: A♠ K♠ | Board: Q♥ J♦ T♣ ... → One Pair! 👍
playful:     Hand: A♠️ K♠️ | Board: Q♥️ J♦️ T♣️ ... → One Pair! 👍 (emoji suits)
compact-verbose: AK| QJT10 → 1P (One Pair)
```

**ContextWidget** (shows context usage):
```
balanced:    45% [████████░░░░░░░░░]
compact:     45%
playful:     📊 45% [████████░░░░░░░░░]
verbose:     45% used (90k/200k tokens)
labeled:     Context: 45%
indicator:   ● 45%
```

**CostWidget** (shows session cost):
```
balanced:    $0.42
compact:     $0.42
playful:     💰 $0.42
labeled:     Cost: $0.42
indicator:   ● $0.42
```

**DurationWidget** (shows session time):
```
balanced:    1h 1m 5s
compact:     1h1m
playful:     ⌛ 1h 1m
technical:   3665000ms
labeled:     Time: 1h 1m 5s
indicator:   ● 1h 1m 5s
```

**LinesWidget** (shows code changes):
```
balanced:    +142/-27
compact:     +142-27
playful:     ➕142 ➖27
verbose:     +142 added, -27 removed
labeled:     Lines: +142/-27
indicator:   ● +142/-27
```

**GitTagWidget** (shows git tag):
```
balanced:    v0.5.4
compact:     0.5.4
playful:     🏷️ v0.5.4
verbose:     version v0.5.4
labeled:     Tag: v0.5.4
indicator:   ● v0.5.4
```

**CacheMetricsWidget** (shows cache tokens):
```
balanced:    💾 35.0k cache
compact:     Cache: 35.0k
playful:     💾 35.0k cache
verbose:     Cache: 35.0k | $0.03 saved
labeled:     Cache: 35.0k | $0.03 saved
indicator:   ● 35.0k cache
breakdown:   💾 35.0k cache | Hit: 35.0k, Write: 5.0k | $0.03 saved
```

**ActiveToolsWidget** (shows active and completed tools):
```
balanced:    Edits: 5 | Bash: 3 | Writes: 2  (top-3 by usage, all running shown)
compact:     [Read] [Edit] [Edit] [Edit] [Read] [Read]
minimal:     [Read] [Edit] [Edit] [Edit] [Read] [Read]
playful:     📖 Read, ✏️ Edit, 📖 Read
verbose:     Running: Read: /src/example.ts | Completed: Edit (3x) | Completed: Read (2x)
labeled:     Tools: ◐ Read: /src/example.ts | ✓ Edit ×3 | ✓ Read ×2
indicator:   ● Read: /src/example.ts | ● Edit ×3 | ● Read ×2
```

#### Style Implementation

Styles are implemented as functional renderers in each widget's styles file:

```typescript
// src/widgets/model/styles.ts
import type { StyleMap } from "../../core/style-types.js";

export const modelStyles: StyleMap<ModelRenderData> = {
  balanced: (data: ModelRenderData) => data.display_name,
  compact: (data: ModelRenderData) => data.display_name.replace("Claude ", ""),
  playful: (data: ModelRenderData) => `🤖 ${data.display_name}`,
  // ... more styles
};
```

#### Setting Widget Style

Widgets use the default `balanced` style unless configured otherwise. Styles can be set dynamically:

```typescript
const widget = new ModelWidget();
widget.setStyle('playful');
const result = await widget.render({ width: 80, timestamp: 0 });
// Result: "🤖 Opus 4.5"
```

Invalid styles fall back to `balanced`:

```typescript
widget.setStyle('unknown' as any);
// Uses balanced style as fallback
```

#### Style Type Safety

The `WidgetStyle` type ensures only valid styles can be used:

```typescript
// src/core/style-types.ts
export type WidgetStyle =
  | "minimal"
  | "balanced"
  | "compact"
  | "playful"
  | "verbose"
  | "technical"
  | "symbolic"
  | "labeled"
  | "indicator"
  | "emoji"
  | "compact-verbose"
  | "breakdown";  // CacheMetricsWidget multi-line style
```

## UI Utilities

### Formatters (`src/ui/utils/formatters.ts`)

The project provides shared formatter utilities for consistent data display across widgets.

#### formatDuration(ms: number): string

Formats milliseconds to human-readable duration.

**Examples:**
- `formatDuration(45000)` → `"45s"`
- `formatDuration(60000)` → `"1m 0s"`
- `formatDuration(3600000)` → `"1h 0m 0s"`
- `formatDuration(3665000)` → `"1h 1m 5s"`

#### formatCostUSD(usd: number): string

Formats cost in USD with 2 decimal places.

**Examples:**
- `formatCostUSD(0.42)` → `"$0.42"`
- `formatCostUSD(1.5)` → `"$1.50"`

Always formats with 2 decimal places for consistency.

#### formatK(n: number): string

Formats numbers with K suffix for thousands.

**Examples:**
- `formatK(0)` → `"0"`
- `formatK(999)` → `"999"`
- `formatK(1000)` → `"1.0k"`
- `formatK(1500)` → `"1.5k"`
- `formatK(10000)` → `"10k"`
- `formatK(140000)` → `"140k"`
- `formatK(-1000)` → `"-1.0k"`

**Behavior:**
- Shows 1 decimal place for values < 10k
- Rounds to whole numbers for values >= 10k
- Handles negative numbers correctly

**Used by:** CacheMetricsWidget for compact token display.

#### progressBar(percent: number, width?: number): string

Creates a visual progress bar with Unicode block characters.

**Parameters:**
- `percent`: Percentage (0-100, automatically clamped)
- `width`: Bar width in characters (default: 15)

**Example:**
```typescript
progressBar(70, 15) → "██████████░░░░░"
```

#### getContextColor(percent: number): string

Returns ANSI color code based on context usage percentage.

**Thresholds:**
- < 50%: Green (low usage)
- 50-79%: Yellow (medium usage)
- >= 80%: Red (high usage)

#### colorize(text: string, color: string): string

Wraps text with ANSI color codes for terminal display.

**Example:**
```typescript
colorize("Hello", ANSI_COLORS.RED) → "\x1b[31mHello\x1b[0m"
```

### Widget Base Class

For widgets that receive `StdinData`, use the `StdinDataWidget` base class (Template Method Pattern):

```typescript
abstract class StdinDataWidget implements IWidget {
  protected data?: StdinData;

  abstract render(context: RenderContext): Promise<string | null>;
  // update(), isEnabled(), initialize() provided
}
```

### Active Widgets (Implemented)

#### 11. **CacheMetricsWidget** (`src/widgets/cache-metrics/cache-metrics-widget.ts`)
- **What it displays**: Cache read tokens and cost savings
- **Status**: ✅ **IMPLEMENTED**
- **Features**:
  - Shows cache read token amounts (e.g., "35.0k cache")
  - Calculates cost savings from caching (cache costs 10% of regular tokens)
  - Color coding based on cache hit rate (high >70%, medium 40-70%, low <40%)
  - Supports multi-line breakdown style showing read/write breakdown
  - Theme-integrated colors via `ICacheColors`

#### 12. **ActiveToolsWidget** (`src/widgets/active-tools/active-tools-widget.ts`)
- **What it displays**: Currently running and recently completed tools
- **Status**: ✅ **IMPLEMENTED**
- **Features**:
  - Parses Claude Code's transcript file for tool lifecycle tracking
  - Shows running tools with spinner indicator (◐)
  - Aggregates completed tools by name with counts (×3)
  - **Sorts completed tools by usage count (descending)** - most used tools appear first
  - **Alphabetical tie-breaker** - tools with equal counts are sorted alphabetically
  - **Balanced style shows top-3 completed tools** - most relevant tools at a glance
  - **All running tools are shown** - active tools never hidden
  - Displays tool targets (file paths, patterns, commands)
  - Supports multiple display styles (balanced, compact, playful, etc.)
  - Limits to last 20 tool entries
  - Theme-integrated colors via `IToolsColors`

## Bug Fixes

### v0.6.9 - Cache Percentage Calculation Fix
- **Fixed**: Cache hit rate showing >100% (e.g., 520059%)
- **Root Cause**: The `input_tokens` field in Claude Code's stdin data only contains NEW (non-cached) tokens, not total input tokens
- **Solution**: Corrected the cache percentage formula to account for all token types:
  ```
  cache_hit_rate = cache_read_tokens / (cache_read_tokens + cache_write_tokens + input_tokens) * 100
  ```
- **Impact**: Cache percentage now accurately represents true cache hit rate (0-100%)
- **Affected Widget**: CacheMetricsWidget

### v0.6.9 - formatK Utility Added
- **Added**: Shared `formatK()` function in `src/ui/utils/formatters.ts`
- **Purpose**: Format numbers with K suffix for thousands (e.g., 140000 → "140.0k")
- **Used By**: CacheMetricsWidget for compact token display
- **Features**:
  - Shows 1 decimal place for values < 10k (e.g., "1.5k")
  - Rounds to whole numbers for values >= 10k (e.g., "140k")
  - Handles negative numbers correctly (e.g., "-1.5k")

### Line Distribution

Widgets are assigned to specific lines for multi-line statusline display:

- **Line 0** (first line): GitWidget, ContextWidget, CostWidget, DurationWidget, ModelWidget, LinesWidget
- **Line 1** (second line): ConfigCountWidget, GitTagWidget
- **Line 2** (third line): ActiveToolsWidget, CacheMetricsWidget
- **Line 4** (fifth line): PokerWidget (entertainment)
- **Line 5** (sixth line): EmptyLineWidget (separator)

### Stdin Data Format

Claude Code sends JSON via stdin with this structure:

```typescript
interface StdinData {
  session_id: string;
  cwd: string;
  model: {
    id: string;
    display_name: string;
  };
  workspace?: Workspace;          // Workspace info
  cost?: CostInfo;                // Token usage and cost
  context_window?: ContextWindow; // Context limits
  context_usage?: ContextUsage;   // Current context usage
  output_style?: OutputStyle;     // Output format preferences
}

interface Workspace {
  name: string;
  branch?: string;
  is_repo: boolean;
}

interface CostInfo {
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  total_cost: number;
}

interface ContextWindow {
  max_tokens: number;
  max_output_tokens: number;
}

interface ContextUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  total_tokens: number;
  percentage: number;
}
```

### Renderer

The `Renderer` class combines widget outputs into multiple statusline lines:

```typescript
const lines = await renderer.render(widgets, context);
// Returns: string[] (array of lines, one per line number)
```

Widgets are grouped by their `line` property and rendered separately.
Lines are joined with newlines in the main entry point.

### Git Provider Abstraction

Git operations use the `IGit` interface with dependency injection:

```typescript
interface IGit {
  checkIsRepo(): Promise<boolean>;
  branch(): Promise<{ current: string | null; all: string[] }>;
  changes?: () => Promise<{ insertions: number; deletions: number }>;
}
```

### Configuration (PLANNED)

Widget behavior will be configured via JSON (`~/.config/claude-scope/config.json`):

```json
{
  "updateIntervalMs": 300,
  "persistence": {
    "enabled": true,
    "path": "~/.config/claude-scope/sessions.db"
  },
  "widgets": ["session", "context", "git", "tools", "agents", "todos", "cost", "analytics"],
  "widgetConfig": {
    "cost": { "showEstimated": true, "currency": "USD" },
    "analytics": { "historyDays": 7 }
  }
}
```

### Presets (PLANNED)

Predefined configurations will be available in `config/presets/`:
- `compact.json` - Minimal display (session, context, git)
- `detailed.json` - Full display with all widgets
- `minimal.json` - Essential info only

### Storage (PLANNED)

SQLite-based storage for session analytics:
- Session history (model, duration, tokens)
- Cost tracking per session
- Aggregate statistics

## Testing

This project follows a **test-driven approach** with comprehensive coverage.

### Test Structure

```
tests/
├── e2e/                         # End-to-end CLI flow tests
│   └── stdin-flow.test.ts
├── integration/                 # Cross-widget integration tests
│   ├── cli-flow.integration.test.ts
│   └── five-widgets.integration.test.ts
├── unit/                        # Unit tests by module
│   ├── cli.test.ts
│   ├── types.test.ts
│   ├── core/
│   │   ├── widget-registry.test.ts
│   │   └── renderer.test.ts
│   ├── data/
│   │   └── stdin-provider.test.ts
│   ├── utils/
│   │   ├── colors.test.ts
│   │   └── formatters.test.ts
│   └── widgets/
│       ├── git-widget.test.ts
│       ├── context-widget.test.ts
│       └── ...
├── fixtures/                    # Reusable test data
│   ├── stdin-sample.json
│   └── git-data.json
├── helpers/                     # Test utility functions
├── snapshots/                   # Widget output snapshots
└── setup.ts                     # Test configuration
```

### Test Guidelines

| Practice | Description |
|----------|-------------|
| **Test file naming** | `*.test.ts` suffix |
| **Coverage target** | >80% for core modules, >60% for widgets |
| **Mock external deps** | Use DI pattern with helper functions |
| **Test isolation** | Each test should be independent, use `beforeEach`/`afterEach` |
| **Assertions** | Use flexible matchers over hardcoded values |

### Helper Functions

Tests use helper functions to reduce duplication:

```typescript
// Create mock git provider with optional overrides
function createMockGit(overrides?: Partial<IGit>): IGit {
  return {
    checkIsRepo: async () => true,
    branch: async () => ({ current: 'main', all: ['main'] }),
    ...overrides
  };
}

// Create stdin data with optional overrides
function createStdinData(overrides?: Partial<StdinData>): StdinData {
  return {
    session_id: 'session_20250106_123045',
    cwd: '/Users/user/project',
    model: { id: 'claude-opus-4-5-20251101', display_name: 'Claude Opus 4.5' },
    ...overrides
  };
};
```

### Snapshot Testing

Widget outputs use snapshot testing for visual regression:

```typescript
// Update snapshots: SNAPSHOT_UPDATE=true npm test
// Verify snapshots: npm test
```

### Key Architectural Principles

1. **Dependency Inversion** - Core depends on `IWidget` abstraction, not concrete implementations
2. **Single Responsibility** - Each module has one clear purpose
3. **Testability** - DI allows mocking all dependencies
4. **Extensibility** - Add new widgets without modifying core code
5. **Error Resilience** - Renderer uses error boundaries; widget failures don't break the statusline
6. **Configuration-Driven** - Widget order and behavior controlled by JSON config (PLANNED)

## Development Rules

- **File Size Constraints**: Keep files <~500 LOC; split/refactor as needed
- **Type Safety**: Use proper TypeScript types, avoid `any` in production code
- **Test Quality**: Use helper functions to reduce duplication, flexible assertions for maintainability
- **Error Handling**: Widgets should handle errors gracefully and return `null` on failure
- **Zero Runtime Dependencies**: No external runtime dependencies - use native Node.js modules only

## Code Quality

### Biome Formatter & Linter

This project uses [Biome](https://biomejs.dev/) for code formatting and linting.

**Configuration**: `biome.json`

**Usage**:
```bash
# Format files
npx @biomejs/biome format --write ./src

# Check and fix all issues
npx @biomejs/biome check --write ./src

# Check only (no fixes)
npx @biomejs/biome check ./src
```

**Style Guide**:
- 2 spaces indentation
- Double quotes
- 100 characters line width
- Semicolons required
- Organized imports (alphabetically by import path)

### Claude Code Hooks

This project uses Claude Code hooks for automation. Hooks are configured in `.claude/settings.json`.

**Available Hooks**:

| Hook | Event | Purpose |
|------|-------|---------|
| `PostToolUse` | After Edit/Write | Auto-format TypeScript files |
| `UserPromptSubmit` | Before processing prompt | Add smart context (git status, widgets, version) |
| `SessionStart` | On session start/resume | Show Git status and recent commits |

**Hook Scripts**:
- `.claude/hooks/format-ts.sh` - Biome formatting
- `.claude/hooks/add-context.sh` - Context injection
- `.claude/hooks/load-context.sh` - Git status loading

**Usage**: Hooks run automatically in Claude Code. No manual invocation needed.

## GitHub CLI

This project uses **GitHub CLI (gh)** for Git operations instead of direct git commands.

### Why GitHub CLI?

- Better integration with GitHub (releases, PRs, actions)
- Consistent interface for GitHub-specific operations
- Pre-installed in the development environment

### Common Operations

| Operation | GitHub CLI | Direct Git |
|-----------|-----------|------------|
| View status | `gh repo view` | `git status` |
| Create release | `gh release create v1.0.0` | Manual web UI |
| List releases | `gh release list` | N/A |
| View workflow runs | `gh run list` | N/A |
| Monitor workflow | `gh run watch` | N/A |
| Clone with auth | `gh repo clone owner/repo` | `git clone https://...` |

### When to Use What

**Use GitHub CLI (gh)** for:
- Creating releases and tags
- Checking GitHub Actions status
- Creating/viewing pull requests
- Cloning repositories (authenticated)

**Use direct git** for:
- Local commits (`git commit`)
- Branch operations (`git checkout`, `git branch`)
- Local staging (`git add`, `git status`)
- Push/pull when not GitHub-specific

## Git Conventions

### Commit Messages
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `<type>[optional scope]: <description>`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Keep first line under 50 characters
- Use imperative mood ("add" not "added")
- Do not include AI attribution in messages

### Git Tags
- Git tags are created automatically by `npm version` command during release process
- **NEVER create git tags manually without following the Release Process**
- Tag format: `v` + semantic version (e.g., `v1.0.0`, `v0.1.0`)
- See "Release Process" section for complete workflow

### Documentation Commits
- **NEVER commit docs/ files without explicit user permission**
- Files in `docs/` directory (plans, research, issues, etc.) should remain untracked by default
- Exception: CLAUDE.md is part of the project and should be committed when updated

## Release Process

When feature development is complete and all tests pass, follow this process to release a new version.

### Prerequisites

Before releasing, ensure:
- All tasks from the implementation plan are complete
- All tests pass (`npm test`)
- Code is committed to the main branch
- Working directory is clean (`git status`)

### Step 1: Version Bump

**Default: Patch version increment** (e.g., 0.4.0 → 0.4.1)

Unless user explicitly requests a different version:
- **Patch** (0.4.0 → 0.4.1): Bug fixes only (default)
- **Minor** (0.4.0 → 0.5.0): New features, backward compatible
- **Major** (0.4.0 → 1.0.0): Breaking changes

Bump version:
```bash
npm version patch  # or minor/major as requested
```

This updates `package.json` and creates a git tag automatically.

### Step 2: Push to GitHub

```bash
git push
git push --tags
```

**Important**: Do NOT build locally. The CI/CD pipeline will build `dist/` files.

### Step 3: Monitor CI/CD

The GitHub Actions workflow (`.github/workflows/release.yml`) will:
1. Run all tests
2. Build `dist/` files
3. Commit `dist/` to the main branch
4. Publish to npm
5. Create GitHub release

Monitor the workflow:
```bash
gh run watch
```

### Step 4: Handle Failures

If CI/CD fails:

1. Check the workflow logs for errors:
   ```bash
   gh run view --log-failed
   ```

2. Common issues:
   - **Test failures**: Fix tests, commit, start release process over
   - **Build errors**: Fix build issues, commit, start release process over
   - **npm publish errors** (e.g., version already exists):
     - Delete the failed tag: `git tag -d v0.3.1 && git push --delete origin v0.3.1`
     - Reset to before version bump: `git reset --hard HEAD~1`
     - Bump to different version: `npm version 0.3.2`
     - Push again: `git push --force && git push --force --tags`

3. After fixing, repeat from Step 1.

### Step 5: Verify Release

After successful CI/CD:

1. Check GitHub release:
   ```bash
   gh release view
   ```

2. Check npm package:
   ```bash
   npm view claude-scope version
   ```

3. Install locally to verify:
   ```bash
   npm install -g claude-scope@latest
   ```

### Step 6: Update Local Installation

After successful release, update the local environment:

```bash
npm install -g claude-scope@latest
```

Verify the installation:
```bash
claude-scope --version  # Should show the new version
```

## License

MIT License (see LICENSE.md)
