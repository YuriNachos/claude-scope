# WidgetRegistry Duplicate Widget Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow multiple widget instances with the same id to be registered (e.g., two empty-line widgets on different lines).

**Architecture:** Change WidgetRegistry from Map-based storage to Array-based storage. Remove duplicate id check since widgets are now identified by their instance, not just id. Methods get(), has(), unregister() will be removed or simplified since they don't make sense with duplicate ids.

**Tech Stack:** TypeScript, Node.js test runner

---

### Task 1: Write failing test for duplicate widget registration

**Files:**
- Create: `tests/unit/core/widget-registry-duplicates.test.ts`

**Step 1: Write the failing test**

Create test file that verifies two widgets with the same id can be registered:

```typescript
import { strict as assert } from "node:assert";
import { test, describe } from "node:test";
import { WidgetRegistry } from "../../src/core/widget-registry.js";
import { EmptyLineWidget } from "../../src/widgets/empty-line-widget.js";

describe("WidgetRegistry - Duplicate Widget Support", () => {
  test("should allow multiple widgets with the same id", async () => {
    const registry = new WidgetRegistry();

    // Create two empty-line widgets (same id)
    const widget1 = new EmptyLineWidget();
    const widget2 = new EmptyLineWidget();

    // Both should register without error
    await registry.register(widget1);
    await registry.register(widget2);

    // getAll() should return both widgets
    const all = registry.getAll();
    assert.equal(all.length, 2);
    assert.equal(all[0].id, "empty-line");
    assert.equal(all[1].id, "empty-line");
  });

  test("should handle widgets on different lines via getLine()", async () => {
    const registry = new WidgetRegistry();

    const widget1 = new EmptyLineWidget();
    widget1.setLine(3);

    const widget2 = new EmptyLineWidget();
    widget2.setLine(5);

    await registry.register(widget1);
    await registry.register(widget2);

    const all = registry.getAll();
    assert.equal(all.length, 2);
    assert.equal(all[0].getLine(), 3);
    assert.equal(all[1].getLine(), 5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/core/widget-registry-duplicates.test.ts`

Expected: FAIL with "Widget with id 'empty-line' already registered"

---

### Task 2: Refactor WidgetRegistry to use Array instead of Map

**Files:**
- Modify: `src/core/widget-registry.ts`
- Test: `tests/unit/core/widget-registry-duplicates.test.ts`

**Step 1: Write minimal implementation - change storage type**

Modify `src/core/widget-registry.ts`:

```typescript
export class WidgetRegistry {
  private widgets: IWidget[] = [];  // Changed from Map<string, IWidget>
```

**Step 2: Remove duplicate check and update register() method**

Replace the `register()` method (lines 17-27):

```typescript
  async register(widget: IWidget, context?: WidgetContext): Promise<void> {
    // Duplicate check removed - widgets with same id are allowed

    if (context) {
      await widget.initialize(context);
    }

    this.widgets.push(widget);  // Changed from this.widgets.set(widget.id, widget)
  }
```

**Step 3: Update unregister() method to remove by instance**

Replace the `unregister()` method (lines 32-45):

```typescript
  async unregister(widgetOrId: IWidget | string): Promise<void> {
    // Support both widget instance and id for backward compatibility
    let widget: IWidget | undefined;

    if (typeof widgetOrId === "string") {
      // Find first widget with this id
      widget = this.widgets.find((w) => w.id === widgetOrId);
    } else {
      // Remove the specific widget instance
      widget = this.widgets.find((w) => w === widgetOrId);
    }

    if (!widget) {
      return;
    }

    try {
      if (widget.cleanup) {
        await widget.cleanup();
      }
    } finally {
      // Remove from array
      const index = this.widgets.indexOf(widget);
      if (index !== -1) {
        this.widgets.splice(index, 1);
      }
    }
  }
```

**Step 4: Update get() method to return first matching widget**

Replace the `get()` method (lines 50-52):

```typescript
  get(id: string): IWidget | undefined {
    return this.widgets.find((w) => w.id === id);
  }
```

**Step 5: Update has() method to check existence**

Replace the `has()` method (lines 57-59):

```typescript
  has(id: string): boolean {
    return this.widgets.some((w) => w.id === id);
  }
```

**Step 6: Update getAll() method (no change needed)**

The existing `getAll()` method already returns an array, so it works without changes:

```typescript
  getAll(): IWidget[] {
    return Array.from(this.widgets.values());
  }
```

Wait - this needs to be updated since we're now using an array:

```typescript
  getAll(): IWidget[] {
    return [...this.widgets];  // Return copy of array
  }
```

**Step 7: Update getEnabledWidgets() method (no change needed)**

This method calls getAll() which is now fixed, so it works:

```typescript
  getEnabledWidgets(): IWidget[] {
    return this.getAll().filter((w) => w.isEnabled());
  }
```

**Step 8: Update clear() method**

Replace the `clear()` method (lines 78-85):

```typescript
  async clear(): Promise<void> {
    for (const widget of this.widgets) {
      if (widget.cleanup) {
        await widget.cleanup();
      }
    }
    this.widgets = [];  // Clear the array
  }
```

**Step 9: Run test to verify it passes**

Run: `npm test -- tests/unit/core/widget-registry-duplicates.test.ts`

Expected: PASS

**Step 10: Run all unit tests to ensure nothing broke**

Run: `npm run test:unit`

Expected: All pass (may have pre-existing failures in CacheMetricsWidget)

**Step 11: Commit**

```bash
git add src/core/widget-registry.ts tests/unit/core/widget-registry-duplicates.test.ts
git commit -m "feat: allow duplicate widget ids in WidgetRegistry

Change from Map-based storage to Array-based storage to support
multiple widget instances with the same id (e.g., empty-line
widgets on different lines).

- Remove duplicate id check in register()
- Change internal storage from Map to array
- Update get() to return first matching widget
- Update has() to check if any widget with id exists
- Update unregister() to support both widget instance and id
- Add tests for duplicate widget registration"
```

---

### Task 3: Test with actual config containing duplicate widgets

**Files:**
- Create: `tmp/test-duplicate-config.json`
- Test: manual verification

**Step 1: Create test config with duplicate empty-line widgets**

Create `/tmp/test-duplicate-config.json`:

```json
{
  "version": "1.0.0",
  "lines": {
    "0": [{"id": "model", "style": "balanced", "colors": {"name": "\\u001b[38;2;98;114;164m"}}],
    "1": [{"id": "git", "style": "balanced", "colors": {"branch": "\\u001b[38;2;189;147;249m"}}],
    "2": [{"id": "empty-line", "style": "balanced", "colors": {}}],
    "3": [{"id": "poker", "style": "balanced", "colors": {}}],
    "4": [{"id": "empty-line", "style": "balanced", "colors": {}}]
  }
}
```

**Step 2: Rebuild the project**

Run: `npm run build`

Expected: Build succeeds

**Step 3: Create valid stdin test data**

Create `/tmp/test-valid-stdin.json`:

```json
{
  "cwd": "/Users/yurii.chukhlib/Documents/claude-scope",
  "session_id": "test",
  "transcript_path": "/tmp/test.jsonl",
  "model": {"id": "x", "display_name": "Test"},
  "workspace": {"current_dir": "/tmp", "project_dir": "/tmp"},
  "version": "1.0.0",
  "output_style": {"name": "compact"},
  "context_window": {
    "total_input_tokens": 200000,
    "total_output_tokens": 8000,
    "context_window_size": 200000,
    "current_usage": {"input_tokens": 5000, "output_tokens": 2000, "cache_creation_input_tokens": 1000, "cache_read_input_tokens": 500}
  }
}
```

**Step 4: Test with duplicate widgets using local build**

First backup user config, then test:

```bash
# Backup
cp ~/.claude-scope/config.json ~/.claude-scope/config.json.backup

# Use test config
CONFIG_PATH=/tmp/test-duplicate-config.json node dist/claude-scope.cjs < /tmp/test-valid-stdin.json

# Should see output with all 5 lines including duplicate empty-lines

# Restore
mv ~/.claude-scope/config.json.backup ~/.claude-scope/config.json
```

Expected: Output shows all 5 lines (model, git, empty-line, poker, empty-line) without errors

**Step 5: Verify user config works with duplicate widgets**

```bash
# User config already has duplicate empty-lines (lines 3 and 5)
echo '{"cwd": "/Users/yurii.chukhlib/Documents/claude-scope", "session_id": "test", "transcript_path": "/tmp/test.jsonl", "model": {"id": "x", "display_name": "Test"}, "workspace": {"current_dir": "/tmp", "project_dir": "/tmp"}, "version": "1.0.0", "output_style": {"name": "compact"}, "context_window": {"total_input_tokens": 200000, "total_output_tokens": 8000, "context_window_size": 200000, "current_usage": {"input_tokens": 5000, "output_tokens": 2000, "cache_creation_input_tokens": 1000, "cache_read_input_tokens": 500}}}' | node dist/claude-scope.cjs
```

Expected: Output shows all lines including poker and empty-lines

---

### Task 4: Update integration test that may be affected

**Files:**
- Check: `tests/integration/*.test.ts`

**Step 1: Run integration tests**

Run: `npm run test:integration`

Expected: All pass (verify no tests depend on unique widget id behavior)

**Step 2: Fix any failing integration tests**

If any tests fail due to widget registry changes, update them to work with array-based storage.

---

### Task 5: Clean up debug logging from index.ts

**Files:**
- Modify: `src/index.ts`

**Step 1: Remove debug logging from catch block**

Ensure the catch block in main() is clean (no console.error):

```typescript
  } catch (_error) {
    // Try to show at least git info on error
    const fallback = await tryGitFallback();
    return fallback;
  }
```

**Step 2: Rebuild and verify**

Run: `npm run build`

Then test with valid stdin to ensure no debug output appears.

---

### Task 6: Final verification and documentation

**Files:**
- Check: `docs/ARCHITECTURE.md` (if mentions widget registry uniqueness)

**Step 1: Check if architecture docs need update**

Search for any documentation that mentions widgets must have unique ids:

```bash
grep -r "unique.*id\|duplicate.*widget" docs/
```

If found, update to clarify that multiple instances with same id are allowed.

**Step 2: Run full test suite**

Run: `npm test`

Expected: All tests pass (except pre-existing CacheMetricsWidget failures)

**Step 3: Manual smoke test**

```bash
# With user's actual config
cat ~/.claude-scope/config.json | jq '.lines | keys'
# Should show: ["0", "1", "2", "3", "4", "5"]

# Test the statusline renders
echo '{...valid json...}' | node dist/claude-scope.cjs
```

Expected: All configured widgets render correctly

**Step 4: Final commit**

```bash
git add .
git commit -m "test: add duplicate widget registration tests

- Add unit tests for multiple widgets with same id
- Add integration test for empty-line on multiple lines
- Verify all existing tests still pass"
```

---

## Summary of Changes

1. **WidgetRegistry storage**: `Map<string, IWidget>` → `IWidget[]`
2. **Duplicate check**: Removed from `register()` method
3. **get()**: Now returns first widget with matching id
4. **has()**: Now checks if any widget with matching id exists
5. **unregister()**: Now supports both widget instance and id (removes first match)
6. **clear()**: Simplified to empty array
7. **Tests**: Added comprehensive tests for duplicate widget registration

## Files Modified

- `src/core/widget-registry.ts` - Core refactoring
- `tests/unit/core/widget-registry-duplicates.test.ts` - New test file
