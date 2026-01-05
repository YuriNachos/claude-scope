# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code CLI tool that displays status information in the terminal. Users working in Claude Code will see real-time information about their current session.

**Current version**: v0.1.0 - Minimal working version with git widget only.

**Planned features**: Context usage, active tools, running agents, todo progress, token/cost monitoring, session analytics.

## Architecture

### Widget Registry Pattern (Senior-Level Design)

This project uses a **modular widget architecture** with a central registry, following Dependency Inversion Principle and modern TypeScript plugin best practices.

**Current Implementation** (v0.1.0):
```
src/
├── core/
│   ├── types.ts              # Core types (IWidget, IWidgetMetadata, etc.)
│   ├── widget-registry.ts    # Central registry for widget management
│   └── renderer.ts           # Unified rendering engine
├── providers/
│   ├── stdin-provider.ts     # Stdin data parser
│   └── git-provider.ts       # Git operations wrapper
├── widgets/
│   └── git-widget.ts         # Git branch widget ✓
├── utils/
│   └── colors.ts             # ANSI color utilities
├── index.ts                  # CLI entry point
└── types.ts                  # Shared types
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
│   ├── transcript-provider.ts # TODO: Transcript parser
│   └── git-provider.ts
├── storage/                  # TODO: SQLite-based persistence
│   ├── session-store.ts      # PLANNED
│   └── analytics-store.ts    # PLANNED
├── widgets/
│   ├── git-widget.ts         # ✓ Implemented
│   ├── session-widget.ts     # PLANNED
│   ├── tools-widget.ts       # PLANNED
│   ├── agents-widget.ts      # PLANNED
│   ├── todos-widget.ts       # PLANNED
│   ├── context-widget.ts     # PLANNED
│   ├── cost-widget.ts        # PLANNED
│   └── analytics-widget.ts   # PLANNED
├── utils/
│   ├── colors.ts
│   └── formatters.ts         # PLANNED
├── config/                   # TODO: Configuration system
│   ├── default.config.json
│   └── presets/              # PLANNED: compact, detailed, minimal
├── index.ts
└── types.ts
```

### Widget Interface

All widgets must implement `IWidget`:

```typescript
interface IWidget {
  readonly id: string;
  readonly metadata: IWidgetMetadata;

  initialize(context: WidgetContext): Promise<void>;
  render(context: RenderContext): string | null;
  update(data: StdinData): Promise<void>;
  isEnabled(): boolean;
  cleanup?(): Promise<void>;
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
  "widgets": ["session", "context", "tools", "agents", "todos", "cost", "analytics"],
  "widgetConfig": {
    "cost": { "showEstimated": true, "currency": "USD" },
    "analytics": { "historyDays": 7 }
  }
}
```

### Presets (PLANNED)

Predefined configurations will be available in `config/presets/`:
- `compact.json` - Minimal display (session, context, todos)
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
├── unit/
│   ├── core/
│   │   ├── widget-registry.test.ts
│   │   └── renderer.test.ts
│   ├── providers/
│   │   ├── stdin-provider.test.ts
│   │   └── git-provider.test.ts
│   ├── widgets/
│   │   └── git-widget.test.ts
│   └── utils/
│       └── colors.test.ts
├── integration/
│   ├── cli-flow.integration.test.ts
│   └── entry-point.integration.test.ts
└── fixtures/
    ├── stdin-sample.json
    └── git-data.json
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
    session_id: 'session_20250105_123045',
    cwd: '/Users/user/project',
    model: { id: 'claude-opus-4-5-20251101', display_name: 'Claude Opus 4.5' },
    ...overrides
  };
};
```

### Key Architectural Principles

1. **Dependency Inversion** - Core depends on `IWidget` abstraction, not concrete implementations
2. **Single Responsibility** - Each module has one clear purpose
3. **Testability** - DI allows mocking all dependencies
4. **Extensibility** - Add new widgets without modifying core code
5. **Configuration-Driven** - Widget order and behavior controlled by JSON config (PLANNED)

## Development Rules

- **File Size Constraints**: Keep files <~500 LOC; split/refactor as needed
- **Type Safety**: Use proper TypeScript types, avoid `any` in production code
- **Test Quality**: Use helper functions to reduce duplication, flexible assertions for maintainability
- **Error Handling**: Widgets should handle errors gracefully and return `null` on failure

## GitHub CLI

This project uses **GitHub CLI (gh)** for Git operations instead of direct git commands.

### Why GitHub CLI?

- Better integration with GitHub (releases, PRs, actions)
- Consistent interface for GitHub-specific operations
- Pre-installed in the development environment

### Installation

```bash
# macOS
brew install gh

# Authenticate
gh auth login
```

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
- **NEVER create git tags without explicit user permission**
- Tags should only be created when the user explicitly requests them
- Tag format: `v` + semantic version (e.g., `v1.0.0`, `v0.1.0`)

### Documentation Commits
- **NEVER commit docs/ files without explicit user permission**
- Files in `docs/` directory (plans, research, issues, etc.) should remain untracked by default
- Exception: CLAUDE.md is part of the project and should be committed when updated

## License

MIT License (see LICENSE.md)
