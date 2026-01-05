# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Code CLI tool that displays git branch information in the statusline. Users working in Claude Code will see the current git branch as part of their terminal status.

**Current version**: Minimal working version with git widget only.

## Architecture

### Widget Registry Pattern

This project uses a **modular widget architecture** with a central registry, following Dependency Inversion Principle and modern TypeScript plugin best practices.

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
│   └── git-widget.ts         # Git branch widget
├── utils/
│   └── colors.ts             # ANSI color utilities
├── index.ts                  # CLI entry point
└── types.ts                  # Shared types

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

### Testing

This project follows a **test-driven approach** with comprehensive coverage.

#### Test Structure

- **Unit tests** (`tests/unit/`) - Test individual modules in isolation
  - Mirror `src/` directory structure
  - Mock all external dependencies via DI
  - Use `node:test` framework with `chai/expect` assertions

- **Integration tests** (`tests/integration/`) - Test complete CLI flow
  - End-to-end scenarios from stdin to output

- **Fixtures** (`tests/fixtures/`) - Reusable test data
  - `stdin-sample.json` - Sample stdin payload
  - `git-data.json` - Sample git branch data

#### Test Guidelines

| Practice | Description |
|----------|-------------|
| **Test file naming** | `*.test.ts` suffix |
| **Coverage target** | >80% for core modules, >60% for widgets |
| **Mock external deps** | Use DI pattern with helper functions (`createMockGit`, `createStdinData`) |
| **Test isolation** | Each test should be independent, use `beforeEach`/`afterEach` |
| **Assertions** | Use flexible matchers (`expect().to.match()`) over hardcoded values |

#### Helper Functions

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

## Development Rules

- **File Size Constraints**: Keep files <~500 LOC; split/refactor as needed
- **Type Safety**: Use proper TypeScript types, avoid `any` in production code
- **Test Quality**: Use helper functions to reduce duplication, flexible assertions for maintainability
- **Error Handling**: Widgets should handle errors gracefully and return `null` on failure

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
