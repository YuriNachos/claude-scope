# Theme System for Widgets Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a parameterizable color theme system for widgets, allowing dynamic color changes without hard-coding.

**Architecture:**
- Create `src/ui/theme/` directory with type definitions and default theme
- Update `ContextWidget` and `LinesWidget` to accept color configuration via constructor
- Default theme uses neutral gray colors for all widget color needs

**Tech Stack:**
- TypeScript
- Node.js native modules (no runtime dependencies)
- Existing test framework: `node:test` + `chai`

---

## Task 1: Create Theme System Tests

**Files:**
- Create: `tests/unit/ui/theme/types.test.ts`
- Create: `tests/unit/ui/theme/default-theme.test.ts`

**Step 1: Create theme test directory structure**

Run: `mkdir -p tests/unit/ui/theme`

Expected: Directory created successfully

**Step 2: Write the failing test for IContextColors interface validation**

```typescript
// tests/unit/ui/theme/types.test.ts
import { describe, it } from 'node:test';
import { expect } from 'chai';

describe('IContextColors', () => {
  it('should accept valid color configuration', () => {
    const colors: IContextColors = {
      low: '\x1b[32m',
      medium: '\x1b[33m',
      high: '\x1b[31m'
    };
    expect(colors.low).to.be.a('string');
    expect(colors.medium).to.be.a('string');
    expect(colors.high).to.be.a('string');
  });

  it('should accept gray colors for all states', () => {
    const colors: IContextColors = {
      low: '\x1b[90m',
      medium: '\x1b[90m',
      high: '\x1b[90m'
    };
    expect(colors.low).to.equal('\x1b[90m');
    expect(colors.medium).to.equal('\x1b[90m');
    expect(colors.high).to.equal('\x1b[90m');
  });
});

describe('ILinesColors', () => {
  it('should accept valid color configuration', () => {
    const colors: ILinesColors = {
      added: '\x1b[32m',
      removed: '\x1b[31m'
    };
    expect(colors.added).to.be.a('string');
    expect(colors.removed).to.be.a('string');
  });

  it('should accept gray colors for added/removed', () => {
    const colors: ILinesColors = {
      added: '\x1b[90m',
      removed: '\x1b[90m'
    };
    expect(colors.added).to.equal('\x1b[90m');
    expect(colors.removed).to.equal('\x1b[90m');
  });
});

describe('ITheme', () => {
  it('should accept theme with context colors', () => {
    const theme: ITheme = {
      context: {
        low: '\x1b[90m',
        medium: '\x1b[90m',
        high: '\x1b[90m'
      }
    };
    expect(theme.context).to.exist;
    expect(theme.context?.low).to.equal('\x1b[90m');
  });

  it('should accept theme with lines colors', () => {
    const theme: ITheme = {
      lines: {
        added: '\x1b[90m',
        removed: '\x1b[90m'
      }
    };
    expect(theme.lines).to.exist;
    expect(theme.lines?.added).to.equal('\x1b[90m');
  });

  it('should accept empty theme', () => {
    const theme: ITheme = {};
    expect(theme).to.be.empty;
  });
});
```

**Step 3: Run test to verify it fails (types not defined yet)**

Run: `npm test -- tests/unit/ui/theme/types.test.ts`

Expected: FAIL with error about IContextColors, ILinesColors, ITheme not being defined

**Step 4: Write minimal implementation - types.ts**

```typescript
// src/ui/theme/types.ts
/**
 * Theme types for widget color configuration
 */

export interface IContextColors {
  low: string;
  medium: string;
  high: string;
}

export interface ILinesColors {
  added: string;
  removed: string;
}

export interface ITheme {
  context?: IContextColors;
  lines?: ILinesColors;
}
```

**Step 5: Run test to verify it passes**

Run: `npm test -- tests/unit/ui/theme/types.test.ts`

Expected: PASS

**Step 6: Write the failing test for DEFAULT_THEME**

```typescript
// tests/unit/ui/theme/default-theme.test.ts
import { describe, it } from 'node:test';
import { expect } from 'chai';
import { DEFAULT_THEME } from '../../../src/ui/theme/default-theme.js';

describe('DEFAULT_THEME', () => {
  it('should have context colors all set to gray', () => {
    expect(DEFAULT_THEME.context).to.exist;
    expect(DEFAULT_THEME.context?.low).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.context?.medium).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.context?.high).to.equal('\x1b[90m');
  });

  it('should have lines colors all set to gray', () => {
    expect(DEFAULT_THEME.lines).to.exist;
    expect(DEFAULT_THEME.lines?.added).to.equal('\x1b[90m');
    expect(DEFAULT_THEME.lines?.removed).to.equal('\x1b[90m');
  });

  it('should be immutable (frozen)', () => {
    // Attempting to modify should not affect the original
    const originalLow = DEFAULT_THEME.context?.low;
    expect(originalLow).to.equal('\x1b[90m');
  });
});
```

**Step 7: Run test to verify it fails**

Run: `npm test -- tests/unit/ui/theme/default-theme.test.ts`

Expected: FAIL with error about DEFAULT_THEME not being defined

**Step 8: Write minimal implementation - default-theme.ts**

```typescript
// src/ui/theme/default-theme.ts
import type { ITheme } from './types.js';
import { gray } from '../utils/colors.js';

export const DEFAULT_THEME: ITheme = {
  context: {
    low: gray,
    medium: gray,
    high: gray,
  },
  lines: {
    added: gray,
    removed: gray,
  },
};
```

**Step 9: Run test to verify it passes**

Run: `npm test -- tests/unit/ui/theme/default-theme.test.ts`

Expected: PASS

**Step 10: Create index.ts for clean exports**

```typescript
// src/ui/theme/index.ts
export type { ITheme, IContextColors, ILinesColors } from './types.js';
export { DEFAULT_THEME } from './default-theme.js';
```

**Step 11: Verify exports work correctly**

Run: `node -e "import { DEFAULT_THEME } from './src/ui/theme/index.js'; console.log('DEFAULT_THEME imported successfully');"`

Expected: No errors, successful import

**Step 12: Commit**

```bash
git add src/ui/theme/ tests/unit/ui/theme/
git commit -m "feat: add theme system with types and default gray theme"
```

---

## Task 2: Update ContextWidget to Accept Theme Config

**Files:**
- Modify: `src/widgets/context-widget.ts`

**Step 1: Write failing test for ContextWidget with custom colors**

```typescript
// tests/unit/widgets/context-widget.test.ts
// Add this test to existing file

describe('with custom colors', () => {
  it('should use custom low color when provided', async () => {
    const customColors = { low: '\x1b[36m', medium: '\x1b[33m', high: '\x1b[31m' };
    const widget = new ContextWidget(customColors);
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 40000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[36m'); // Cyan (custom low color)
  });

  it('should use default gray color when no colors provided', async () => {
    const widget = new ContextWidget();
    await widget.update(createMockStdinData({
      context_window: {
        total_input_tokens: 1000,
        total_output_tokens: 500,
        context_window_size: 200000,
        current_usage: {
          input_tokens: 40000,
          output_tokens: 10000,
          cache_creation_input_tokens: 5000,
          cache_read_input_tokens: 0
        }
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[90m'); // Gray (default)
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/context-widget.test.ts`

Expected: FAIL because ContextWidget constructor doesn't accept color parameter

**Step 3: Implement ContextWidget color support**

```typescript
// src/widgets/context-widget.ts
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { progressBar, colorize } from '../ui/utils/formatters.js';
import { DEFAULTS } from '../constants.js';
import type { IContextColors } from '../ui/theme/types.js';
import { DEFAULT_THEME } from '../ui/theme/default-theme.js';
import type { RenderContext, StdinData } from '../types.js';

export class ContextWidget extends StdinDataWidget {
  readonly id = 'context';
  readonly metadata = createWidgetMetadata(
    'Context',
    'Displays context window usage with progress bar',
    '1.0.0',
    'claude-scope',
    0
  );

  private colors: IContextColors;

  constructor(colors?: IContextColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.context!;
  }

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    const { current_usage, context_window_size } = data.context_window;

    if (!current_usage) return null;

    const used = current_usage.input_tokens +
                 current_usage.cache_creation_input_tokens +
                 current_usage.cache_read_input_tokens +
                 current_usage.output_tokens;

    const percent = Math.round((used / context_window_size) * 100);

    const bar = progressBar(percent, DEFAULTS.PROGRESS_BAR_WIDTH);
    const color = this.getContextColor(percent);

    return colorize(`[${bar}] ${percent}%`, color);
  }

  private getContextColor(percent: number): string {
    const clampedPercent = Math.max(0, Math.min(100, percent));

    if (clampedPercent < 50) {
      return this.colors.low;
    } else if (clampedPercent < 80) {
      return this.colors.medium;
    } else {
      return this.colors.high;
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/context-widget.test.ts`

Expected: PASS

**Step 5: Update existing color tests to expect gray**

The existing tests in `context-widget.test.ts` check for specific colors (green, yellow, red). These tests now need to expect gray since that's the default.

Update the test expectations:
- Change `expect(result).to.include('\x1b[32m')` to `expect(result).to.include('\x1b[90m')`
- Change `expect(result).to.include('\x1b[33m')` to `expect(result).to.include('\x1b[90m')`
- Change `expect(result).to.include('\x1b[31m')` to `expect(result).to.include('\x1b[90m')`

**Step 6: Run all tests to verify**

Run: `npm test -- tests/unit/widgets/context-widget.test.ts`

Expected: All tests PASS

**Step 7: Commit**

```bash
git add src/widgets/context-widget.ts tests/unit/widgets/context-widget.test.ts
git commit -m "refactor: context-widget to accept color config via constructor"
```

---

## Task 3: Update LinesWidget to Accept Theme Config

**Files:**
- Modify: `src/widgets/lines-widget.ts`
- Modify: `tests/unit/widgets/lines-widget.test.ts`

**Step 1: Write failing test for LinesWidget with custom colors**

```typescript
// tests/unit/widgets/lines-widget.test.ts
// Add this describe block to existing file

describe('with custom colors', () => {
  it('should use custom colors when provided', async () => {
    const customColors = { added: '\x1b[36m', removed: '\x1b[35m' };
    const widget = new LinesWidget(customColors);
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 123,
        total_lines_removed: 45
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[36m'); // Cyan (custom added color)
    expect(result).to.include('\x1b[35m'); // Magenta (custom removed color)
  });

  it('should use default gray color when no colors provided', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 123,
        total_lines_removed: 45
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('\x1b[90m'); // Gray (default)
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/lines-widget.test.ts`

Expected: FAIL because LinesWidget constructor doesn't accept color parameter

**Step 3: Implement LinesWidget color support**

```typescript
// src/widgets/lines-widget.ts
import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { colorize } from '../ui/utils/formatters.js';
import type { ILinesColors } from '../ui/theme/types.js';
import { DEFAULT_THEME } from '../ui/theme/default-theme.js';
import type { RenderContext, StdinData } from '../types.js';

export class LinesWidget extends StdinDataWidget {
  readonly id = 'lines';
  readonly metadata = createWidgetMetadata(
    'Lines',
    'Displays lines added/removed in session',
    '1.0.0',
    'claude-scope',
    0
  );

  private colors: ILinesColors;

  constructor(colors?: ILinesColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.lines!;
  }

  protected renderWithData(
    data: StdinData,
    context: RenderContext
  ): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const addedStr = colorize(`+${added}`, this.colors.added);
    const removedStr = colorize(`-${removed}`, this.colors.removed);

    return `${addedStr}/${removedStr}`;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/lines-widget.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/widgets/lines-widget.ts tests/unit/widgets/lines-widget.test.ts
git commit -m "refactor: lines-widget to accept color config via constructor"
```

---

## Task 4: Update Integration Tests

**Files:**
- Check: `tests/integration/five-widgets.integration.test.ts`
- Check: `tests/integration/cli-flow.integration.test.ts`

**Step 1: Run integration tests to check for issues**

Run: `npm test -- tests/integration/`

Expected: May have snapshot issues due to color changes

**Step 2: Update snapshots if needed**

If snapshots have hardcoded ANSI codes, update them to expect gray (`\x1b[90m`).

**Step 3: Run integration tests again**

Run: `npm test -- tests/integration/`

Expected: All PASS

**Step 4: Commit if changes were needed**

```bash
git add tests/integration/
git commit -m "test: update integration tests for gray default colors"
```

---

## Task 5: Update CLAUDE.md Documentation

**Files:**
- Modify: `docs/CLAUDE.md`

**Step 1: Add theme system documentation to CLAUDE.md**

Add after the "Widget Interface" section:

```markdown
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
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add theme system documentation to CLAUDE.md"
```

---

## Summary

This implementation creates a foundation for dynamic theming by:

1. **Type-safe color configuration** - Each widget defines its color needs as interfaces
2. **Constructor injection** - Colors are passed via constructor, not hard-coded
3. **Default gray theme** - Neutral baseline for all widgets
4. **Test-driven** - All changes verified with tests
5. **Atomic commits** - Each logical change is a separate commit

**Future work** (not in this plan):
- Load theme from configuration file
- Create theme presets (light, dark, high-contrast)
- Add colors to GitChangesWidget
- Dynamic theme switching at runtime
