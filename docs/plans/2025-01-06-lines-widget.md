# LinesWidget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a widget that displays total lines added/removed during the Claude Code session, with green/red color formatting.

**Architecture:** LinesWidget extends StdinDataWidget (Template Method Pattern) for data-driven rendering. Data comes from `cost.total_lines_added` and `cost.total_lines_removed` fields in stdin JSON.

**Tech Stack:** TypeScript, Node.js test runner, chai assertions

---

## Task 1: Create LinesWidget implementation

**Files:**
- Create: `src/widgets/lines-widget.ts`

**Step 1: Create the widget file**

Create `src/widgets/lines-widget.ts` with:

```typescript
/**
 * Lines Widget
 *
 * Displays total lines added/removed during the session
 * Data source: cost.total_lines_added / cost.total_lines_removed
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import { colorize } from '../ui/utils/formatters.js';
import { ANSI_COLORS } from '../constants.js';
import type { RenderContext, StdinData } from '../types.js';

/**
 * Widget displaying lines added/removed in session
 *
 * Shows green "+N" for lines added and red "-N" for lines removed.
 * Defaults to "+0/-0" when cost data is unavailable.
 */
export class LinesWidget extends StdinDataWidget {
  readonly id = 'lines';
  readonly metadata = createWidgetMetadata(
    'Lines',
    'Displays lines added/removed in session'
  );

  protected renderWithData(
    data: StdinData,
    context: RenderContext
  ): string | null {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;

    const addedStr = colorize(`+${added}`, ANSI_COLORS.GREEN);
    const removedStr = colorize(`-${removed}`, ANSI_COLORS.RED);

    return `${addedStr}/${removedStr}`;
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npm run build:tsc`
Expected: No errors, `dist/widgets/lines-widget.js` created

**Step 3: Commit**

```bash
git add src/widgets/lines-widget.ts
git commit -m "feat: add LinesWidget implementation

Displays lines added/removed during session with color formatting.
Extends StdinDataWidget for data-driven widget pattern."
```

---

## Task 2: Create unit tests for LinesWidget

**Files:**
- Create: `tests/unit/widgets/lines-widget.test.ts`

**Step 1: Create the test file**

Create `tests/unit/widgets/lines-widget.test.ts` with:

```typescript
/**
 * Unit tests for LinesWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { LinesWidget } from '../../../src/widgets/lines-widget.js';
import { createMockStdinData } from '../../fixtures/mock-data.js';

describe('LinesWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new LinesWidget();
    expect(widget.id).to.equal('lines');
    expect(widget.metadata.name).to.equal('Lines');
  });

  it('should display lines with colors when data exists', async () => {
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

    // Should contain the numbers (colors are ANSI codes)
    expect(result).to.include('+123');
    expect(result).to.include('-45');
    expect(result).to.include('/');
  });

  it('should show zeros when cost data is missing', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({ cost: undefined }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
    expect(result).to.include('/');
  });

  it('should show zeros when cost exists but lines are undefined', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
  });

  it('should handle large numbers without abbreviation', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 1234567,
        total_lines_removed: 987654
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+1234567');
    expect(result).to.include('-987654');
  });

  it('should handle zero values', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-0');
  });

  it('should handle only additions (no deletions)', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 100,
        total_lines_removed: 0
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+100');
    expect(result).to.include('-0');
  });

  it('should handle only deletions (no additions)', async () => {
    const widget = new LinesWidget();
    await widget.update(createMockStdinData({
      cost: {
        total_cost_usd: 0.01,
        total_duration_ms: 0,
        total_api_duration_ms: 0,
        total_lines_added: 0,
        total_lines_removed: 50
      }
    }));

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.include('+0');
    expect(result).to.include('-50');
  });
});
```

**Step 2: Run the tests**

Run: `npm test -- tests/unit/widgets/lines-widget.test.ts`
Expected: All 8 tests PASS

**Step 3: Commit**

```bash
git add tests/unit/widgets/lines-widget.test.ts
git commit -m "test: add LinesWidget unit tests

Comprehensive test coverage including:
- Normal display with colors
- Missing cost data (shows zeros)
- Large numbers without abbreviation
- Edge cases (zero values, additions only, deletions only)"
```

---

## Task 3: Integrate LinesWidget into main entry point

**Files:**
- Modify: `src/index.ts`

**Step 1: Add import statement**

Add after line 12 (after CostWidget import):

```typescript
import { LinesWidget } from './widgets/lines-widget.js';
```

**Step 2: Register widget**

After line 55 (after CostWidget registration), add:

```typescript
await registry.register(new LinesWidget());
```

The widget registration section should now look like:

```typescript
// Register all widgets (no constructor args needed)
await registry.register(new ModelWidget());
await registry.register(new ContextWidget());
await registry.register(new CostWidget());
await registry.register(new LinesWidget());
await registry.register(new DurationWidget());
await registry.register(new GitWidget());
await registry.register(new GitChangesWidget());
```

**Step 3: Verify build**

Run: `npm run build`
Expected: No errors, bundled file created successfully

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: integrate LinesWidget into statusline

Adds LinesWidget to main registry after CostWidget.
New order: Model │ Context │ Cost │ Lines │ Duration │ Git │ GitChanges"
```

---

## Task 4: Update integration tests

**Files:**
- Modify: `tests/integration/five-widgets.integration.test.ts`
- Modify: `tests/integration/cli-flow.integration.test.ts`

**Step 1: Update five-widgets integration test**

Open `tests/integration/five-widgets.integration.test.ts` and update:

1. Add import at top with other widget imports:
```typescript
import { LinesWidget } from '../../src/widgets/lines-widget.js';
```

2. Register the widget in the test setup:
```typescript
await registry.register(new LinesWidget());
```

3. Update expected output count to 6 widgets (was 5)

**Step 2: Update cli-flow integration test**

Open `tests/integration/cli-flow.integration.test.ts` and:

1. Add import:
```typescript
import { LinesWidget } from '../../src/widgets/lines-widget.js';
```

2. Register widget in test setup

3. Update any assertions about widget count or output format

**Step 3: Run integration tests**

Run: `npm run test:integration`
Expected: All integration tests PASS

**Step 4: Commit**

```bash
git add tests/integration/
git commit -m "test: update integration tests for LinesWidget"
```

---

## Task 5: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update version**

Change line 3 from:
```markdown
**Current version**: v0.2.4
```

To:
```markdown
**Current version**: v0.2.5
```

**Step 2: Add LinesWidget to implemented features list**

After the line `- Cost estimation display`, add:
```markdown
- Lines added/removed display
```

**Step 3: Add LinesWidget to file structure**

In the file structure section, after `- cost-widget.ts`, add:
```markdown
- lines-widget.ts
```

**Step 4: Verify documentation**

Run: `head -20 CLAUDE.md` to verify changes

**Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for v0.2.5 with LinesWidget"
```

---

## Task 6: Bump version to 0.2.5

**Files:**
- Modify: `package.json`

**Step 1: Update version**

Change line 3 from:
```json
"version": "0.2.4",
```

To:
```json
"version": "0.2.5",
```

**Step 2: Verify package.json is valid**

Run: `cat package.json | jq .version` (or just `grep version package.json`)
Expected: `"version": "0.2.5"`

**Step 3: Build to verify**

Run: `npm run build`
Expected: Clean build with no errors

**Step 4: Commit**

```bash
git add package.json
git commit -m "chore: bump version to 0.2.5"
```

---

## Task 7: Run full test suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests PASS (unit, integration, e2e)

**Step 2: Run with coverage**

Run: `npm run test:coverage`
Expected: Coverage report generated, check LinesWidget has good coverage

**Step 3: Build production bundle**

Run: `npm run build`
Expected: `dist/claude-scope.cjs` created successfully

---

## Task 8: Create git tag and push

**Step 1: Create annotated tag**

```bash
git tag -a v0.2.5 -m "v0.2.5: Add LinesWidget

- Display lines added/removed with color formatting
- Show +N/-M format (green/red)
- Integrated into statusline after Cost widget"
```

**Step 2: Push commits and tags**

```bash
git push origin main
git push origin v0.2.5
```

**Step 3: Verify on GitHub**

Check that the release was created and CI/CD pipeline is running

---

## Task 9: Local testing and verification

**Step 1: Install local version**

```bash
npm install -g .
```

**Step 2: Test in Claude Code**

Open Claude Code and verify the statusline shows the new LinesWidget

Expected output format:
```
Claude Opus 4.5 │ [████████████░░░░░░░░░░] 60% │ $0.0145 │ +123/-45 │ 2m 15s │ main
```

**Step 3: Verify color output**

The `+123` should be green, `-45` should be red

---

## Summary

After completing all tasks:
- ✅ LinesWidget created with proper TypeScript types
- ✅ Full test coverage (8 unit tests + integration tests)
- ✅ Integrated into statusline after CostWidget
- ✅ Documentation updated
- ✅ Version bumped to 0.2.5
- ✅ Git tag created and pushed
- ✅ Published to NPM (via CI/CD)
- ✅ Locally installed and verified

**Total commits:** 7 atomic commits
**Total tests:** 8 new unit tests + integration updates
