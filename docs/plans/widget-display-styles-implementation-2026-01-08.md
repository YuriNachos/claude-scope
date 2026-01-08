# Widget Display Styles System — Implementation Plan

**Date:** 2026-01-08
**Status:** Ready for Implementation
**Design Document:** `widget-display-styles-design-2026-01-08.md`

---

## Overview

This plan implements the widget display style system using the Strategy Pattern. Each widget will support multiple display styles configured via per-widget settings.

---

## Phase 1: Foundation (Core Infrastructure)

### 1.1 Add core types for style system

**File:** `src/core/style-types.ts`

```typescript
export type WidgetStyle =
  | "balanced"
  | "compact"
  | "playful"
  | "verbose"
  | "technical"
  | "symbolic"
  | "monochrome"
  | "compact-verbose"
  | "labeled"
  | "indicator"
  | "fancy";

export interface WidgetStyleConfig {
  style: WidgetStyle;
}

export interface StyleConfig {
  [widgetId: string]: WidgetStyleConfig;
}
```

**Commit:** `feat: add core style types for widget display system`

---

### 1.2 Add StyleRenderer strategy interface

**File:** `src/core/style-renderer.ts`

```typescript
export interface StyleRenderer<T = any> {
  render(data: T): string;
}

export abstract class BaseStyleRenderer<T = any> implements StyleRenderer<T> {
  abstract render(data: T): string;
}
```

**Commit:** `feat: add StyleRenderer strategy interface`

---

### 1.3 Extend IWidget to support style configuration

**File:** `src/core/types.ts`

Add `setStyle(style: WidgetStyle)` method to `IWidget` interface:

```typescript
export interface IWidget {
  // ... existing methods
  setStyle?(style: WidgetStyle): void;
}
```

**Commit:** `feat: extend IWidget interface with setStyle method`

---

## Phase 2: Utility Functions

### 2.1 Add style utility functions

**File:** `src/ui/utils/style-utils.ts`

```typescript
export function withLabel(prefix: string, value: string): string;
export function withIndicator(value: string): string;
export function withFancy(value: string): string;
export function withBrackets(value: string): string;
export function withAngleBrackets(value: string): string;
```

**Commit:** `feat: add style utility functions for common patterns`

---

## Phase 3: Refactor formatCostUSD

### 3.1 Refactor formatCostUSD to always use 2 decimal places

**File:** `src/ui/utils/formatters.ts`

Change `formatCostUSD()` to always return 2 decimal places:

```typescript
export function formatCostUSD(usd: number): string {
  return `$${usd.toFixed(2)}`;
}
```

**Commit:** `refactor: formatCostUSD always use 2 decimal places`

---

### 3.2 Add tests for refactored formatCostUSD

**File:** `tests/unit/ui/utils/formatters.test.ts`

Add tests for new behavior:
- `$0.00` for 0
- `$0.42` for 0.42
- `$1.23` for 1.23
- Negative values

**Commit:** `test: add tests for formatCostUSD with 2 decimal places`

---

## Phase 4: Widget Implementations (Alphabetical Order)

### 4.1 ConfigCountWidget styles

**File:** `src/widgets/config-count-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/config-count/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(config-count): add style renderer infrastructure`
2. `feat(config-count): implement balanced style renderer`
3. `feat(config-count): implement compact style renderer`
4. `feat(config-count): implement playful style renderer`
5. `feat(config-count): implement verbose style renderer`
6. `test(config-count): add tests for all style renderers`

---

### 4.2 ContextWidget styles

**File:** `src/widgets/context-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/context/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(context): add style renderer infrastructure`
2. `feat(context): implement balanced style renderer`
3. `feat(context): implement compact style renderer`
4. `feat(context): implement playful style renderer`
5. `feat(context): implement verbose style renderer`
6. `feat(context): implement symbolic style renderer`
7. `feat(context): implement compact-verbose style renderer`
8. `feat(context): implement indicator style renderer`
9. `feat(context): implement fancy style renderer`
10. `test(context): add tests for all style renderers`

---

### 4.3 CostWidget styles

**File:** `src/widgets/cost-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/cost/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(cost): add style renderer infrastructure`
2. `feat(cost): implement balanced style renderer`
3. `feat(cost): implement compact style renderer`
4. `feat(cost): implement playful style renderer`
5. `feat(cost): implement labeled style renderer`
6. `feat(cost): implement indicator style renderer`
7. `feat(cost): implement fancy style renderer`
8. `test(cost): add tests for all style renderers`

---

### 4.4 DurationWidget styles

**File:** `src/widgets/duration-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/duration/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(duration): add style renderer infrastructure`
2. `feat(duration): implement balanced style renderer`
3. `feat(duration): implement compact style renderer`
4. `feat(duration): implement playful style renderer`
5. `feat(duration): implement technical style renderer`
6. `feat(duration): implement labeled style renderer`
7. `feat(duration): implement indicator style renderer`
8. `feat(duration): implement fancy style renderer`
9. `test(duration): add tests for all style renderers`

---

### 4.5 EmptyLineWidget styles (no-op)

**File:** `src/widgets/empty-line-widget.ts`

All styles are identical (empty separator). Add `setStyle()` as no-op.

**Commit:** `feat(empty-line): add setStyle method (no-op, all styles identical)`

---

### 4.6 GitChangesWidget styles

**File:** `src/widgets/git/git-changes-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/git/git-changes/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(git-changes): add style renderer infrastructure`
2. `feat(git-changes): implement balanced style renderer`
3. `feat(git-changes): implement compact style renderer`
4. `feat(git-changes): implement playful style renderer`
5. `feat(git-changes): implement verbose style renderer`
6. `feat(git-changes): implement technical style renderer`
7. `feat(git-changes): implement symbolic style renderer`
8. `feat(git-changes): implement labeled style renderer`
9. `feat(git-changes): implement indicator style renderer`
10. `feat(git-changes): implement fancy style renderer`
11. `test(git-changes): add tests for all style renderers`

---

### 4.7 GitTagWidget styles

**File:** `src/widgets/git/git-tag-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/git/git-tag/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(git-tag): add style renderer infrastructure`
2. `feat(git-tag): implement balanced style renderer`
3. `feat(git-tag): implement compact style renderer`
4. `feat(git-tag): implement playful style renderer`
5. `feat(git-tag): implement verbose style renderer`
6. `feat(git-tag): implement labeled style renderer`
7. `feat(git-tag): implement indicator style renderer`
8. `feat(git-tag): implement fancy style renderer`
9. `test(git-tag): add tests for all style renderers`

---

### 4.8 GitWidget (branch) styles

**File:** `src/widgets/git/git-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/git/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(git): add style renderer infrastructure`
2. `feat(git): implement balanced style renderer`
3. `feat(git): implement compact style renderer`
4. `feat(git): implement playful style renderer`
5. `feat(git): implement verbose style renderer`
6. `feat(git): implement indicator style renderer`
7. `feat(git): implement labeled style renderer`
8. `feat(git): implement fancy style renderer`
9. `test(git): add tests for all style renderers`

---

### 4.9 LinesWidget styles

**File:** `src/widgets/lines-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/lines/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(lines): add style renderer infrastructure`
2. `feat(lines): implement balanced style renderer`
3. `feat(lines): implement compact style renderer`
4. `feat(lines): implement playful style renderer`
5. `feat(lines): implement verbose style renderer`
6. `feat(lines): implement labeled style renderer`
7. `feat(lines): implement indicator style renderer`
8. `feat(lines): implement fancy style renderer`
9. `test(lines): add tests for all style renderers`

---

### 4.10 ModelWidget styles

**File:** `src/widgets/model-widget.ts`

- Add `setStyle()` method
- Create renderer classes in `src/widgets/model/renderers/`
- Wire up style selection
- Add tests

**Commits:**
1. `feat(model): add style renderer infrastructure`
2. `feat(model): implement balanced style renderer`
3. `feat(model): implement compact style renderer`
4. `feat(model): implement playful style renderer`
5. `feat(model): implement technical style renderer`
6. `feat(model): implement symbolic style renderer`
7. `feat(model): implement labeled style renderer`
8. `feat(model): implement indicator style renderer`
9. `feat(model): implement fancy style renderer`
10. `test(model): add tests for all style renderers`

---

### 4.11 PokerWidget styles

**File:** `src/widgets/poker-widget.ts`

- Add `setStyle()` method
- Create renderer class in `src/widgets/poker/renderers/`
- Wire up style selection (all 3 mandatory styles use same renderer)
- Add compact-verbose renderer
- Add tests

**Commits:**
1. `feat(poker): add style renderer infrastructure`
2. `feat(poker): implement default style renderer (used by balanced/compact/playful)`
3. `feat(poker): implement compact-verbose style renderer`
4. `test(poker): add tests for all style renderers`

---

## Phase 5: Integration

### 5.1 Wire style configuration into widget initialization

**File:** `src/index.ts` or new `src/config/widget-config.ts`

- Load style configuration from config
- Apply styles to widgets during initialization
- Default to `balanced` if not specified

**Commit:** `feat: wire widget style configuration into initialization`

---

### 5.2 Update main entry to pass style config

**File:** `src/index.ts`

Pass style configuration when creating widgets.

**Commit:** `feat: pass style config to widgets on initialization`

---

## Phase 6: Documentation

### 6.1 Update CLAUDE.md with style system documentation

**File:** `CLAUDE.md`

Add section about display style system, configuration, and available styles.

**Commit:** `docs: add display style system documentation to CLAUDE.md`

---

### 6.2 Add README section for style configuration

**File:** `README.md`

Add user-facing documentation for configuring widget styles.

**Commit:** `docs: add style configuration guide to README`

---

## Phase 7: Final Polish

### 7.1 Run all tests and fix issues

**Commit:** `test: fix any failing tests after style system implementation`

---

### 7.2 Format code with Biome

**Commit:** `style: format code with Biome`

---

### 7.3 Update package.json version

**Commit:** `chore: bump version to 0.6.0`

---

## Summary

**Total Commits:** ~100 atomic commits

**Breakdown:**
- Phase 1 (Foundation): 3 commits
- Phase 2 (Utilities): 1 commit
- Phase 3 (Cost refactor): 2 commits
- Phase 4 (Widgets): ~75 commits
- Phase 5 (Integration): 2 commits
- Phase 6 (Documentation): 2 commits
- Phase 7 (Polish): 3 commits

**Testing Strategy:**
- Each widget renderer gets its own test file
- Tests cover all style variants
- Integration tests verify style configuration loading

**Default Behavior:**
- All widgets default to `balanced` style
- Configuration is optional (system works with no config)
