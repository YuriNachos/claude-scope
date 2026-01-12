# WIDGETS.md - Complete Widget Documentation

## Complete Widget Catalog

| Widget ID | Name | Status | Line | Description |
|-----------|------|--------|------|-------------|
| `model` | Model Widget | ✅ Implemented | 0 | Displays current Claude model name |
| `context` | Context Widget | ✅ Implemented | 0 | Displays context window usage with progress bar |
| `cost` | Cost Widget | ✅ Implemented | 0 | Displays total session cost in USD |
| `duration` | Duration Widget | ✅ Implemented | 0 | Displays elapsed session time |
| `lines` | Lines Widget | ✅ Implemented | 0 | Displays lines added/removed during session |
| `git` | Git Widget | ✅ Implemented | 0 | Displays current git branch and changes |
| `git-tag` | Git Tag Widget | ✅ Implemented | 1 | Displays the latest git tag |
| `config-count` | Config Count Widget | ✅ Implemented | 1 | Displays Claude Code configuration counts |
| `cache-metrics` | Cache Metrics Widget | ✅ Implemented | 2 | Displays cache hit rate and savings |
| `active-tools` | Active Tools Widget | ✅ Implemented | 2 | Displays currently running and completed tools |
| `dev-server` | DevServer Widget | ✅ Implemented | 0 | Detects and displays running dev server status |
| `docker` | Docker Widget | ✅ Implemented | 0 | Shows Docker container count and status |
| `poker` | Poker Widget | ✅ Implemented | 4 | Displays random Texas Hold'em hands |
| `empty-line` | Empty Line Widget | ✅ Implemented | 5 | Creates blank separator line |

---

## Widget Interface Documentation

### IWidget Interface

All widgets must implement the `IWidget` interface:

```typescript
interface IWidget {
  // Properties
  readonly id: string;                    // Unique widget identifier
  readonly metadata: IWidgetMetadata;     // Widget metadata

  // Required methods
  initialize(context: WidgetContext): Promise<void>;
  render(context: RenderContext): Promise<string | null>;
  update(data: StdinData): Promise<void>;
  isEnabled(): boolean;

  // Optional methods
  cleanup?(): Promise<void>;
  setStyle?(style: WidgetStyle): void;
  setLine?(line: number): void;
  getLine?(): number;
}
```

### IWidgetMetadata

```typescript
interface IWidgetMetadata {
  name: string;        // Widget display name
  description: string; // Widget description
  line?: number;      // Which statusline line (0-indexed)
}
```

### StdinDataWidget Base Class

For widgets that receive `StdinData`, use the `StdinDataWidget` base class:

```typescript
abstract class StdinDataWidget implements IWidget {
  protected data: StdinData | null = null;
  protected enabled = true;

  // Template method - handles null checks
  async render(context: RenderContext): Promise<string | null> {
    if (!this.data || !this.enabled) return null;
    return this.renderWithData(this.data, context);
  }

  // Hook for subclasses
  protected abstract renderWithData(data: StdinData, context: RenderContext): string | null;
}
```

---

## Individual Widget Documentation

### ModelWidget (`model`)

**What it displays**: Current Claude model name

**Line**: 0

**Base class**: `StdinDataWidget`

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `Claude Opus 4.5` |
| compact | `Opus 4.5` |
| playful | `🤖 Opus 4.5` |
| technical | `claude-opus-4-5-20251101` |
| symbolic | `◆ Opus 4.5` |
| labeled | `Model: Opus 4.5` |
| indicator | `● Opus 4.5` |

**File**: `src/widgets/model-widget.ts`

---

### ContextWidget (`context`)

**What it displays**: Context window usage with progress bar

**Line**: 0

**Base class**: `StdinDataWidget`

**Special features**:
- Uses `CacheManager` to cache values between updates
- Prevents flickering when `current_usage` is null
- Session change detection to avoid caching old data

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `45% [████████░░░░░░░░░]` |
| compact | `45%` |
| playful | `📊 45% [████████░░░░░░░░░]` |
| verbose | `45% used (90k/200k tokens)` |
| labeled | `Context: 45%` |
| indicator | `● 45%` |

**File**: `src/widgets/context-widget.ts`

---

### CostWidget (`cost`)

**What it displays**: Total session cost in USD

**Line**: 0

**Base class**: `StdinDataWidget`

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `$0.42` |
| playful | `💰 $0.42` |
| labeled | `Cost: $0.42` |
| indicator | `● $0.42` |

**File**: `src/widgets/cost-widget.ts`

---

### DurationWidget (`duration`)

**What it displays**: Elapsed session time

**Line**: 0

**Base class**: `StdinDataWidget`

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `1h 1m 5s` |
| compact | `1h1m` |
| playful | `⌛ 1h 1m` |
| technical | `3665000ms` |
| labeled | `Time: 1h 1m 5s` |
| indicator | `● 1h 1m 5s` |

**File**: `src/widgets/duration-widget.ts`

---

### LinesWidget (`lines`)

**What it displays**: Lines added/removed during session

**Line**: 0

**Base class**: `StdinDataWidget`

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `+42/-18` |
| compact | `+42-18` |
| playful | `➕42 ➖27` |
| verbose | `+42 added, -27 removed` |
| labeled | `Lines: +42/-18` |
| indicator | `● +42/-18` |

**File**: `src/widgets/lines-widget.ts`

---

### GitWidget (`git`)

**What it displays**: Current git branch and changes

**Line**: 0

**Base class**: Implements `IWidget` directly (not extending `StdinDataWidget`)

**Special features**:
- Uses Dependency Injection with `IGit` interface
- Graceful degradation on git errors
- Shows branch name with optional changes in brackets

**Styles**:
| Style | Example |
|-------|---------|
| minimal | `main` |
| balanced | `main [+42 -18]` |
| compact | `main +42/-18` |
| playful | `🔀 main ⬆42 ⬇18` |
| verbose | `branch: main [+42 insertions, -18 deletions]` |
| labeled | `Git: main [3 files: +42/-18]` |
| indicator | `● main [+42 -18]` |

**File**: `src/widgets/git/git-widget.ts`

---

### GitTagWidget (`git-tag`)

**What it displays**: Latest git tag

**Line**: 1

**Base class**: Implements `IWidget` directly

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `v0.5.4` |
| compact | `0.5.4` |
| playful | `🏷️ v0.5.4` |
| labeled | `Tag: v0.5.4` |
| indicator | `● v0.5.4` |

**File**: `src/widgets/git/git-tag-widget.ts`

---

### ConfigCountWidget (`config-count`)

**What it displays**: Claude Code configuration counts

**Line**: 1

**Display format**: `📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks`

Only shows if at least one count > 0.

**File**: `src/widgets/config-count-widget.ts`

---

### ActiveToolsWidget (`active-tools`)

**What it displays**: Currently running and recently completed tools

**Line**: 2

**Base class**: `StdinDataWidget`

**Special features**:
- Parses Claude Code's JSONL transcript file
- Shows running tools with spinner indicator (◐)
- Aggregates completed tools by name with counts
- Sorts completed tools by usage count (descending)
- Alphabetical tie-breaker for equal counts
- Shows top-3 completed tools in balanced style
- Limits to last 20 tool entries

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `Edits: 5 | Bash: 3 | Writes: 2` |
| compact | `[Read] [Edit] [Edit] [Edit] [Read] [Read]` |
| playful | `📖 Read, ✏️ Edit, 📖 Read` |
| verbose | `Running: Read: /src/example.ts \| Completed: Edit (3x)` |
| labeled | `Tools: ◐ Read: /src/example.ts \| ✓ Edit ×3` |

**File**: `src/widgets/active-tools/active-tools-widget.ts`

---

### CacheMetricsWidget (`cache-metrics`)

**What it displays**: Cache hit rate and cost savings

**Line**: 2

**Base class**: `StdinDataWidget`

**Special features**:
- Uses `CacheManager` for caching
- Calculates cache hit rate correctly (fixed >100% bug)
- Multi-line `breakdown` style available
- Color coding: high (>70% green), medium (40-70% yellow), low (<40% red)

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `💾 35.0k cache` |
| playful | `💾 35.0k cache` |
| verbose | `Cache: 35.0k \| $0.03 saved` |
| breakdown | `💾 35.0k cache \| Hit: 35.0k, Write: 5.0k \| $0.03 saved` |

**File**: `src/widgets/cache-metrics/cache-metrics-widget.ts`

---

### DevServerWidget (`dev-server`)

**What it displays**: Running development server status

**Line**: 0

**Special features**:
- Hybrid detection using both process and port detection
- Supports: Nuxt, Next.js, Vite, Svelte, Astro, Remix
- Shows running/building/stopped status
- Caches detection results for 5 seconds

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `⚡ Nuxt (running)` |
| compact | `⚡ Nuxt 🚀` |
| playful | `🏃 Nuxt` |
| labeled | `Server: ⚡ Nuxt 🟢` |

**File**: `src/widgets/dev-server/dev-server-widget.ts`

---

### DockerWidget (`docker`)

**What it displays**: Docker container count and status

**Line**: 0

**Special features**:
- Shows running/total container count
- Caches query results for 5 seconds
- Gracefully handles Docker unavailable

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `Docker: 3/5 🟢` |
| compact | `🐳 3/5` |
| playful | `🐳 Docker: 3/5 🟢` |
| labeled | `Docker: 3/5` |

**File**: `src/widgets/docker/docker-widget.ts`

---

### PokerWidget (`poker`)

**What it displays**: Random Texas Hold'em hands

**Line**: 4

**Base class**: `StdinDataWidget`

**Special features**:
- Throttled to 5 seconds between hand regeneration
- Evaluates hand strength
- Color coding for suits (red for ♥♦, gray for ♠♣)
- Participating cards in bold/brackets

**Styles**:
| Style | Example |
|-------|---------|
| balanced | `Hand: A♠ K♠ \| Board: Q♥ J♦ T♣ ... → One Pair!` |
| playful | `Hand: A♠️ K♠️ \| Board: Q♥️ J♦️ T♣️ ... → One Pair!` |
| compact-verbose | `AK\| QJT10 → 1P (One Pair)` |

**File**: `src/widgets/poker-widget.ts`

---

### EmptyLineWidget (`empty-line`)

**What it displays**: Creates blank separator line

**Line**: 5

**Special features**:
- Uses Braille Pattern Blank (U+2800)
- Ensures line renders properly even when empty

**File**: `src/widgets/empty-line-widget.ts`

---

## Style System Deep Dive

### StyleMap Pattern

```typescript
type StyleMap<T, C = unknown> = Partial<Record<WidgetStyle, StyleRendererFn<T, C>>>;

type StyleRendererFn<T, C> = (data: T, colors?: C) => string;
```

Each widget exports a `styles` object:

```typescript
export const modelStyles: StyleMap<ModelRenderData, IModelColors> = {
  balanced: (data, colors) => data.displayName,
  compact: (data, colors) => getShortName(data.displayName),
  playful: (data, colors) => `🤖 ${data.displayName}`,
};
```

### All Available WidgetStyles

1. `minimal` - Most compact, no labels
2. `balanced` - Default, clean formatting
3. `compact` - Condensed, minimal spacing
4. `playful` - With emojis
5. `verbose` - Full text labels
6. `technical` - Raw values
7. `symbolic` - With symbols
8. `labeled` - Prefix labels
9. `indicator` - Bullet indicators
10. `emoji` - Colorful emojis
11. `compact-verbose` - Compact with abbreviations
12. `breakdown` - Multi-line breakdown (CacheMetricsWidget only)

---

## Widget Creation and Registration

### WidgetFactory

```typescript
export class WidgetFactory {
  createWidget(widgetId: string): IWidget | null {
    switch (widgetId) {
      case "model": return new ModelWidget();
      case "context": return new ContextWidget();
      case "git": return new GitWidget();
      // ... etc
    }
  }
}
```

### Supported Widget IDs

`model`, `context`, `cost`, `lines`, `duration`, `git`, `git-tag`, `config-count`, `cache-metrics`, `active-tools`, `dev-server`, `docker`

Note: `poker` widget exists but is NOT in the factory (not in default config).

---

## Line Distribution

**Line 0**: ModelWidget, ContextWidget, CostWidget, DurationWidget, LinesWidget, GitWidget, DevServerWidget, DockerWidget

**Line 1**: GitTagWidget, ConfigCountWidget

**Line 2**: ActiveToolsWidget, CacheMetricsWidget

**Line 4**: PokerWidget

**Line 5**: EmptyLineWidget

---

## Special Features and Behaviors

### Caching Features
- **ContextWidget**: Caches context usage between updates
- **CacheMetricsWidget**: Caches metrics between updates
- **DevServerWidget**: 5-second cache
- **DockerWidget**: 5-second cache

### Dependency Injection
- **GitWidget**, **GitTagWidget**: Use `IGit` interface
- **ConfigCountWidget**: Uses `IConfigProvider` interface
- **ActiveToolsWidget**: Uses `ITranscriptProvider` interface

### Error Handling
All widgets return `null` on failure (graceful degradation).

### Color System
All widgets use the unified `IThemeColors` interface with widget-specific color sections.
