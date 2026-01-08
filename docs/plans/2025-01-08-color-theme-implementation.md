# Color Theme System - Implementation Plan

## Overview

Atomic commit plan for migrating to unified color theme system.

**Total estimated commits**: ~30-35

---

## Phase 1: Theme System Foundation

### Commit 1: Create theme types
**File**: `src/ui/theme/types.ts` (update existing)

Create `IThemeColors` interface with all widget color sections.

```typescript
interface IThemeColors {
  base: { text: string; muted: string; accent: string; border: string; };
  semantic: { success: string; warning: string; error: string; info: string; };
  git: { branch: string; changes: string; };
  context: { low: string; medium: string; high: string; bar: string; };
  lines: { added: string; removed: string; };
  cost: { amount: string; currency: string; };
  duration: { value: string; unit: string; };
  model: { name: string; version: string; };
  poker: { participating: string; nonParticipating: string; result: string; };
}

interface ITheme {
  name: string;
  description: string;
  colors: IThemeColors;
}
```

---

### Commit 2: Update StyleRendererFn signature
**File**: `src/core/style-types.ts`

Add color parameter to style functions:

```typescript
export type StyleRendererFn<T, C = any> = (data: T, colors: C) => string;
export type StyleMap<T, C = any> = Record<string, StyleRendererFn<T, C>>;
```

---

### Commit 3: Create gray theme (current default)
**File**: `src/ui/theme/gray-theme.ts`

Convert current `DEFAULT_THEME` to new structure with all sections.

---

### Commit 4: Create dark theme
**File**: `src/ui/theme/dark-theme.ts`

New dark theme with vibrant colors on dark background.

---

### Commit 5: Create light theme
**File**: `src/ui/theme/light-theme.ts`

New light theme for terminal with light backgrounds.

---

### Commit 6: Create theme registry
**File**: `src/ui/theme/index.ts`

Export theme system:

```typescript
export { AVAILABLE_THEMES, DEFAULT_THEME, getThemeByName };
export type { ITheme, IThemeColors };
export * from './types.js';
```

---

## Phase 2: Migrate Simple Widgets

### Commit 7: Migrate CostWidget
**Files**: `src/widgets/cost-widget.ts`, `src/widgets/cost/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass `colors.cost` to style functions
- Update style signatures to accept colors

---

### Commit 8: Update CostWidget tests
**Files**: `tests/unit/widgets/cost-widget.test.ts`

Update tests to pass `IThemeColors` to constructor.

---

### Commit 9: Migrate DurationWidget
**Files**: `src/widgets/duration-widget.ts`, `src/widgets/duration/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass `colors.duration` to style functions
- Update style signatures

---

### Commit 10: Update DurationWidget tests
**Files**: `tests/unit/widgets/duration-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 11: Migrate ModelWidget
**Files**: `src/widgets/model-widget.ts`, `src/widgets/model/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass `colors.model` to style functions
- Update style signatures

---

### Commit 12: Update ModelWidget tests
**Files**: `tests/unit/widgets/model-widget.test.ts`

Update tests for `IThemeColors`.

---

## Phase 3: Migrate State-Based Widgets

### Commit 13: Migrate LinesWidget
**Files**: `src/widgets/lines-widget.ts`, `src/widgets/lines/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass `colors.lines` to style functions
- Style functions use `colors.added` and `colors.removed`

---

### Commit 14: Update LinesWidget tests
**Files**: `tests/unit/widgets/lines-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 15: Migrate ContextWidget (remove post-render coloring)
**Files**: `src/widgets/context-widget.ts`, `src/widgets/context/styles.ts`

- Update constructor to accept `IThemeColors`
- **Change**: Style functions now receive colors and apply them
- Remove `getContextColor()` method (colors now in style)
- Pass `colors.context` to style functions

---

### Commit 16: Update ContextWidget tests
**Files**: `tests/unit/widgets/context-widget.test.ts`

Update tests for new color behavior.

---

## Phase 4: Migrate Complex Widgets

### Commit 17: Migrate GitWidget
**Files**: `src/widgets/git-widget.ts`, `src/widgets/git/styles.ts`

- Update constructor to accept `IThemeColors`
- Create `IGitColors` section interface
- Pass `colors.git` to style functions
- Add color support to GitWidget styles (currently plain text)

---

### Commit 18: Update GitWidget tests
**Files**: `tests/unit/widgets/git-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 19: Migrate GitTagWidget
**Files**: `src/widgets/git/git-tag-widget.ts`, `src/widgets/git/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass colors to style functions

---

### Commit 20: Update GitTagWidget tests
**Files**: `tests/unit/widgets/git/git-tag-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 21: Migrate PokerWidget (partial - theme colors only)
**Files**: `src/widgets/poker-widget.ts`, `src/widgets/poker/styles.ts`

- Update constructor to accept `IThemeColors`
- Pass `colors.poker` for: participating, nonParticipating, result
- **Keep**: Card suit colors as semantic (red/gray - not theme)

---

### Commit 22: Update PokerWidget tests
**Files**: `tests/unit/widgets/poker-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 23: Migrate ConfigCountWidget
**Files**: `src/widgets/config-count-widget.ts`, `src/widgets/config/styles.ts`

- Update constructor to accept `IThemeColors`
- Add `config` section to `IThemeColors` if needed
- Update style functions

---

### Commit 24: Update ConfigCountWidget tests
**Files**: `tests/unit/widgets/config-count-widget.test.ts`

Update tests for `IThemeColors`.

---

### Commit 25: Migrate EmptyLineWidget
**Files**: `src/widgets/empty-line-widget.ts`

- Update constructor to accept `IThemeColors` (for consistency, even if unused)

---

### Commit 26: Update EmptyLineWidget tests
**Files**: `tests/unit/widgets/empty-line-widget.test.ts`

Update tests for `IThemeColors`.

---

## Phase 5: Update Entry Point

### Commit 27: Update CLI entry point
**File**: `src/index.ts`

- Import theme system
- Load theme from config (or use default)
- Pass `theme.colors` to all widget constructors

---

### Commit 28: Remove old DEFAULT_THEME exports
**File**: `src/ui/theme/default-theme.ts`

Delete or mark as deprecated (consolidate into new theme system).

---

## Phase 6: Integration Tests

### Commit 29: Update CLI flow integration test
**File**: `tests/integration/cli-flow.integration.test.ts`

Update for new theme system.

---

### Commit 30: Update five-widgets integration test
**File**: `tests/integration/five-widgets.integration.test.ts`

Update for new theme system.

---

### Commit 31: Update stdin-flow e2e test
**File**: `tests/e2e/stdin-flow.test.ts`

Update for new theme system.

---

## Phase 7: Documentation

### Commit 32: Update CLAUDE.md
**File**: `CLAUDE.md`

Update theme system documentation with new architecture.

---

### Commit 33: Add theme examples to docs
**File**: `docs/themes.md` (new)

Document how to create custom themes.

---

### Commit 34: Update type exports
**File**: `src/types.ts`

Re-export new theme types if needed.

---

## Summary

**Total commits**: ~34

**Files modified**:
- Core: 2 files (types, style-types)
- Theme: 5 files (types, gray, dark, light, index)
- Widgets: ~15 widget files + ~15 style files
- Tests: ~15 test files
- Integration: 3 files
- Entry: 2 files
- Docs: 2 files

**Key changes**:
1. `IThemeColors` unifies all widget colors
2. Style functions receive colors as parameter
3. All widgets accept `IThemeColors` in constructor
4. Theme-controlled colors vs semantic colors clearly separated
