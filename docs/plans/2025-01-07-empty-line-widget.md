# Empty Line Widget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create an Empty Line widget that serves as a visual separator for the 4th statusline line (line index 3).

**Architecture:** A simple widget that renders an empty string to create a blank separator line between content sections. It will extend `StdinDataWidget` for consistency with other widgets but will not use the stdin data.

**Tech Stack:** TypeScript, Node.js native modules, Node.js test runner with chai assertions

---

## Task 1: Create the EmptyLineWidget class

**Files:**
- Create: `src/widgets/empty-line-widget.ts`

**Step 1: Write the failing test**

Create test file: `tests/unit/widgets/empty-line-widget.test.ts`

```typescript
/**
 * Unit tests for EmptyLineWidget
 */

import { describe, it } from 'node:test';
import { expect } from 'chai';
import { EmptyLineWidget } from '../../../src/widgets/empty-line-widget.js';

describe('EmptyLineWidget', () => {
  it('should have correct id and metadata', () => {
    const widget = new EmptyLineWidget();
    expect(widget.id).to.equal('empty-line');
    expect(widget.metadata.name).to.equal('Empty Line');
    expect(widget.metadata.description).to.equal('Empty line separator');
    expect(widget.metadata.line).to.equal(3);
  });

  it('should render empty string', async () => {
    const widget = new EmptyLineWidget();
    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.equal('');
  });

  it('should be enabled by default', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: {} });

    expect(widget.isEnabled()).to.be.true;
  });

  it('should respect enabled config', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: { enabled: false } });

    expect(widget.isEnabled()).to.be.false;
  });

  it('should return null when disabled', async () => {
    const widget = new EmptyLineWidget();
    await widget.initialize({ config: { enabled: false } });

    const result = await widget.render({ width: 80, timestamp: 0 });

    expect(result).to.be.null;
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/widgets/empty-line-widget.test.ts`

Expected: FAIL with "Cannot find module '../../../src/widgets/empty-line-widget.js'"

**Step 3: Write minimal implementation**

Create: `src/widgets/empty-line-widget.ts`

```typescript
/**
 * Empty Line Widget
 *
 * Renders an empty string to create a blank separator line
 */

import { StdinDataWidget } from './core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { RenderContext, StdinData } from '../types.js';

export class EmptyLineWidget extends StdinDataWidget {
  readonly id = 'empty-line';
  readonly metadata = createWidgetMetadata(
    'Empty Line',
    'Empty line separator',
    '1.0.0',
    'claude-scope',
    3  // Fourth line (0-indexed)
  );

  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
    // Return empty string to create blank line
    return '';
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/widgets/empty-line-widget.test.ts`

Expected: PASS (all 5 tests pass)

**Step 5: Commit**

```bash
git add src/widgets/empty-line-widget.ts tests/unit/widgets/empty-line-widget.test.ts
git commit -m "feat: add EmptyLineWidget as blank separator"
```

---

## Task 2: Register EmptyLineWidget in main index

**Files:**
- Modify: `src/index.ts:18-19`

**Step 1: Add import**

Add import after line 18 (after PokerWidget import):

```typescript
import { EmptyLineWidget } from './widgets/empty-line-widget.js';
```

**Step 2: Register widget in main()**

Add registration after line 66 (after PokerWidget registration):

```typescript
await registry.register(new EmptyLineWidget());
```

**Step 3: Run full test suite**

Run: `npm test`

Expected: All existing tests still pass

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: register EmptyLineWidget in main"
```

---

## Task 3: Verify integration with end-to-end test

**Files:**
- Test: `tests/e2e/stdin-flow.test.ts`

**Step 1: Run existing e2e test**

Run: `npm test -- tests/e2e/stdin-flow.test.ts`

Expected: PASS - verify empty line appears as 4th line in output

**Step 2: Manual verification**

Build and test locally:

```bash
npm run build
npm link
```

Then trigger claude-scope in a project and verify the 4th line appears as empty.

**Step 3: Commit (no changes needed)**

If e2e passes, no commit needed. If test needs update, commit those changes.

---

## Task 4: Update CLAUDE.md documentation

**Files:**
- Modify: `docs/CLAUDE.md`

**Step 1: Update implemented features list**

Add to the "Implemented features" section after "Update throttling":

```markdown
- Empty line separator widget (4th line)
```

**Step 2: Update architecture section**

Add to the widgets list in architecture section:

```markdown
│   ├── empty-line-widget.ts  # Empty line separator widget
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add EmptyLineWidget to CLAUDE.md"
```

---

## Release Process

After all tasks complete:

### Step 1: Version Bump

```bash
npm version patch
```

This updates package.json and creates a git tag.

### Step 2: Push to GitHub

```bash
git push
git push --tags
```

### Step 3: Monitor CI/CD

```bash
gh run watch
```

### Step 4: Verify Release

After successful CI/CD:

```bash
gh release view
npm view claude-scope version
```

### Step 5: Update Local Installation

```bash
npm install -g claude-scope@latest
claude-scope --version
```
