# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code plugin that displays detailed session status and analytics in the terminal. Users working in Claude Code will see real-time information about their current session, including context usage, active tools, running agents, todo progress, token/cost monitoring, and session analytics.

## Architecture

### Widget Registry Pattern (Senior-Level Design)

This project uses a **modular widget architecture** with a central registry, following Dependency Inversion Principle and modern TypeScript plugin best practices.

```
src/
├── core/
│   ├── types.ts              # Core types (IWidget, IWidgetMetadata, etc.)
│   ├── widget-registry.ts    # Central registry for widget management
│   ├── config-loader.ts      # JSON config parser & validator
│   └── renderer.ts           # Unified rendering engine
├── providers/
│   ├── stdin-provider.ts     # Stdin data source
│   ├── transcript-provider.ts # Transcript parser
│   └── git-provider.ts       # Git operations
├── storage/
│   ├── session-store.ts      # SQLite-based persistence
│   └── analytics-store.ts    # Session history & stats
├── widgets/
│   ├── base/
│   │   ├── session-widget.ts      # Session info widget
│   │   ├── tools-widget.ts        # Tools activity widget
│   │   ├── agents-widget.ts       # Agent tracking widget
│   │   ├── todos-widget.ts        # Todo progress widget
│   │   ├── context-widget.ts      # Context usage widget
│   │   ├── cost-widget.ts         # Token/cost monitoring widget
│   │   └── analytics-widget.ts    # Session analytics widget
│   └── widget-interface.ts        # IWidget interface
├── utils/
│   ├── colors.ts             # ANSI color utilities
│   └── formatters.ts         # Text formatting helpers
├── config/
│   ├── default.config.json   # Default configuration
│   └── presets/              # Predefined themes (compact, detailed, minimal)
├── index.ts                  # Entry point with DI
└── types.ts                  # Shared types

tests/
├── unit/
│   ├── core/
│   │   ├── widget-registry.test.ts
│   │   ├── config-loader.test.ts
│   │   └── renderer.test.ts
│   ├── providers/
│   │   ├── stdin-provider.test.ts
│   │   ├── transcript-provider.test.ts
│   │   └── git-provider.test.ts
│   ├── storage/
│   │   ├── session-store.test.ts
│   │   └── analytics-store.test.ts
│   ├── widgets/
│   │   ├── session-widget.test.ts
│   │   ├── tools-widget.test.ts
│   │   └── ...
│   └── utils/
│       ├── colors.test.ts
│       └── formatters.test.ts
├── integration/
│   └── widget-registry.integration.test.ts
├── fixtures/
│   ├── stdin-data.json
│   ├── transcript-data.jsonl
│   └── config-samples.json
└── setup.ts                  # Test setup & mocks
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

### Configuration

Widget behavior is configured via JSON (`~/.config/claude-scope/config.json`):

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

### Presets

Predefined configurations in `config/presets/`:
- `compact.json` - Minimal display (session, context, todos)
- `detailed.json` - Full display with all widgets
- `minimal.json` - Essential info only

### Storage

SQLite-based storage for session analytics:
- Session history (model, duration, tokens)
- Cost tracking per session
- Aggregate statistics

### Testing

This project follows a **test-driven approach** with comprehensive coverage across unit and integration tests.

#### Test Structure

- **Unit tests** (`tests/unit/`) - Test individual modules in isolation
  - Mirror `src/` directory structure
  - Mock all external dependencies via DI
  - Fast execution, no external I/O

- **Integration tests** (`tests/integration/`) - Test module interactions
  - Real filesystem for storage tests
  - Mock stdin/transcript for end-to-end scenarios

- **Fixtures** (`tests/fixtures/`) - Reusable test data
  - Sample stdin JSON payloads
  - Transcript snippets for parsing tests
  - Config variations for edge cases

#### Test Guidelines

| Practice | Description |
|----------|-------------|
| **Test file naming** | `*.test.ts` suffix, co-located with source in `tests/unit/` |
| **Coverage target** | >80% for core modules, >60% for widgets |
| **Mock external deps** | Use DI pattern to inject mocks for stdin, git, fs |
| **Test isolation** | Each test should be independent, cleanup after itself |

#### Example Test Structure

```typescript
// tests/unit/widgets/session-widget.test.ts
import { describe, it, expect, beforeEach } from 'node:test';
import { SessionWidget } from '../../../src/widgets/base/session-widget.js';

describe('SessionWidget', () => {
  const mockDeps = {
    // Injected via DI
  };

  it('should render session info correctly', async () => {
    const widget = new SessionWidget(mockDeps);
    // Act & Assert
  });
});
```

### Key Architectural Principles

1. **Dependency Inversion** - Core depends on `IWidget` abstraction, not concrete implementations
2. **Single Responsibility** - Each module has one clear purpose
3. **Testability** - DI allows mocking all dependencies
4. **Extensibility** - Add new widgets without modifying core code
5. **Configuration-Driven** - Widget order and behavior controlled by JSON config

## Development Rules

- **File Size Constraints**: Keep files <~500 LOC; split/refactor as needed.
- **Stick to Specifications**: When implementing from a plan/specification:
  - Follow the exact code structure specified
  - Do not "adapt" or "improve" without explicit approval
  - If you find a genuine issue with the spec, ask before changing
  - Test assertions must match what the spec specifies (e.g., use `expect` if spec says `expect`)
  - Deviations from the spec will be rejected

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
- Example: User says "create a tag for v1.0.0" → then create tag
- Do not create tags as part of automated implementation tasks
- Tag format: `v` + semantic version (e.g., `v1.0.0`, `v0.1.0`)

### Documentation Commits
- **NEVER commit docs/ files without explicit user permission**
- Files in `docs/` directory (plans, research, issues, etc.) should remain untracked by default
- Only commit docs/ when user explicitly requests it
- Exception: CLAUDE.md is part of the project and should be committed when updated

### Workflow
- Use `gh` CLI for GitHub operations (issues, PRs, etc.)

## License

MIT License (see LICENSE.md)
