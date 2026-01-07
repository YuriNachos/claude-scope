# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code CLI tool that displays status information in the terminal. Users working in Claude Code will see real-time information about their current session.

**Current version**: v0.3.3

**Implemented features**:
- Git branch and changes display
- Multi-line statusline (config counts on second line)
- Model information display
- Context usage with progress bar
- Session duration tracking
- Cost estimation display
- Lines added/removed display
- Configuration counts (CLAUDE.md, rules, MCPs, hooks)
- Poker entertainment widget with Texas Hold'em hands

**Planned features**: Active tools, running agents, todo progress, session analytics, configuration system.

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
│   │   ├── git-widget.ts         # Git branch widget
│   │   └── git-changes-widget.ts # Git diff statistics widget
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
├── ui/
│   ├── theme/                # Theme system and color configuration
│   │   ├── index.ts          # Theme exports
│   │   ├── types.ts          # Color configuration interfaces
│   │   └── default-theme.ts  # Default gray theme
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
│   │   ├── git-widget.ts     # ✓ Implemented
│   │   └── git-changes-widget.ts  # ✓ Implemented
│   ├── context-widget.ts     # ✓ Implemented
│   ├── cost-widget.ts        # ✓ Implemented
│   ├── duration-widget.ts    # ✓ Implemented
│   ├── model-widget.ts       # ✓ Implemented
│   ├── session-widget.ts     # PLANNED
│   ├── tools-widget.ts       # PLANNED
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

The project uses a theme system for widget color configuration. This allows colors to be parameterized instead of hard-coded.

#### Color Configuration Types

Each widget defines its own color configuration interface:

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
```

#### Default Theme

The `DEFAULT_THEME` provides neutral gray colors for all widgets:

```typescript
import { DEFAULT_THEME } from './ui/theme/index.js';

// DEFAULT_THEME.context.low === '\x1b[90m' (gray)
// DEFAULT_THEME.lines.added === '\x1b[90m' (gray)
```

#### Using Custom Colors

Widgets accept optional color configuration in their constructor:

```typescript
// Use default gray colors
const widget = new ContextWidget();

// Use custom colors
const customWidget = new ContextWidget({
  low: '\x1b[32m',    // green
  medium: '\x1b[33m', // yellow
  high: '\x1b[31m'    // red
});

const linesWidget = new LinesWidget({
  added: '\x1b[32m',   // green
  removed: '\x1b[31m'  // red
});
```

#### Future: Dynamic Themes

The theme system is designed to support future dynamic theme switching. Themes can be loaded from configuration files, allowing users to customize colors without code changes.

### Widget Base Class

For widgets that receive `StdinData`, use the `StdinDataWidget` base class (Template Method Pattern):

```typescript
abstract class StdinDataWidget implements IWidget {
  protected data?: StdinData;

  abstract render(context: RenderContext): Promise<string | null>;
  // update(), isEnabled(), initialize() provided
}
```

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
