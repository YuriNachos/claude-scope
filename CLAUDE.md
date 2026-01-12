# CLAUDE.md

Claude Code CLI tool that displays status information in the terminal.

**Version**: v0.8.14

---

## Quick Commands

```bash
npm run build          # Build the project
npm test               # Run all tests
npx @biomejs/biome check --write ./src   # Format & lint
npm version patch      # Bump version (patch/minor/major)
```

---

## Tech Stack

- **Language**: TypeScript (Node.js)
- **Zero runtime dependencies** - native Node.js modules only
- **Formatter**: [Biome](https://biomejs.dev/) for linting and formatting
- **Package manager**: npm

---

## Architecture (Overview)

This project uses a **widget registry pattern** with Dependency Inversion:

- `IWidget` interface - all widgets implement this
- `WidgetRegistry` - central widget lifecycle manager
- `WidgetFactory` - centralized widget creation
- `Renderer` - multi-line rendering with error boundaries

**Key files**: `src/core/types.ts`, `src/core/widget-registry.ts`, `src/core/widget-factory.ts`

**Detailed architecture**: See `docs/ARCHITECTURE.md`

---

## Widget Development

To add a new widget:

1. Implement `IWidget` interface (or extend `StdinDataWidget`)
2. Add to `WidgetFactory` in `src/core/widget-factory.ts`
3. Create styles in `styles.ts` using `StyleMap` pattern
4. Use `DEFAULT_THEME` (Monokai) for colors

**Widget documentation**: See `docs/WIDGETS.md` for all widgets, styles, and examples

---

## Code Conventions

- **File size**: Keep <~500 LOC; split/refactor as needed
- **Types**: Avoid `any`; use proper TypeScript types
- **Imports**: ES modules (`import/export`), organized alphabetically
- **Error handling**: Widgets should return `null` on failure
- **Testing**: >80% coverage for core, >60% for widgets

---

## Git Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`)
- **First line**: <50 characters, imperative mood
- **Tags**: Created via `npm version` (NEVER manually)
- **GitHub CLI**: Use `gh` for releases, PRs, workflow checks

**Release process**: See `docs/RELEASE-PROCESS.md`

---

## Testing

```bash
npm test                              # Run all tests
npx @biomejs/biome check ./src       # Lint only
```

- Test files: `*.test.ts` suffix
- Use helper functions in `tests/helpers/`
- Mock external deps via DI pattern

---

## Progressive Disclosure

For detailed information on specific topics, see:

| Topic | File |
|-------|------|
| Architecture patterns, data flow, providers | `docs/ARCHITECTURE.md` |
| All widgets, styles, examples | `docs/WIDGETS.md` |
| Theme system, 17 themes, customization | `docs/THEME-SYSTEM.md` |
| Formatters, UI utilities, ANSI colors | `docs/FORMATTERS.md` |
| CI/CD workflows, versioning, publishing | `docs/RELEASE-PROCESS.md` |
| Version history, bug fixes, roadmap | `docs/CHANGELOG.md` |
