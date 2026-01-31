# Config & Preview Consistency Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all inconsistencies between default config, documentation, Live Preview system, and quick-config menu.

**Architecture:** Five independent fixes that address documentation-code mismatch (default theme), missing widgets in layout-preview factory (sysmon, empty-line), hardcoded theme array, and inaccurate Rich layout description.

**Tech Stack:** TypeScript, Node.js test runner, Biome formatter

---

## Summary of Issues

| # | Issue | Files Affected |
|---|-------|----------------|
| 1 | Default theme: docs say "monokai", code generates "dracula" | `default-config-generator.ts`, `CLAUDE.md`, test |
| 2 | SysmonWidget missing from layout-preview.ts factory | `layout-preview.ts`, test |
| 3 | empty-line widget missing from layout-preview.ts factory | `layout-preview.ts` |
| 4 | Hardcoded theme array in select-with-preview.ts | `select-with-preview.ts` |
| 5 | Rich layout description doesn't mention sysmon | `menu.ts` |

---

## Task 1: Fix Default Theme (dracula → monokai)

**Files:**
- Modify: `src/config/default-config-generator.ts:39`
- Modify: `tests/unit/config/default-config-generator.test.ts:29`

**Step 1: Update the generator to use monokai**

Change line 39 in `src/config/default-config-generator.ts`:

```typescript
// FROM:
const defaultConfig = generateRichLayout("balanced", "dracula");

// TO:
const defaultConfig = generateRichLayout("balanced", "monokai");
```

**Step 2: Update the test description and assertion**

The test at line 29 says "cyberpunk-neon theme" which is also wrong. Update `tests/unit/config/default-config-generator.test.ts`:

```typescript
// FROM (line 29):
test("ensureDefaultConfig creates config with balanced layout, balanced style, cyberpunk-neon theme", async () => {

// TO:
test("ensureDefaultConfig creates config with rich layout, balanced style, monokai theme", async () => {
```

**Step 3: Run tests to verify**

Run: `npm test -- --test-name-pattern="ensureDefaultConfig"`

Expected: PASS

**Step 4: Run Biome**

Run: `npx @biomejs/biome check --write ./src/config/default-config-generator.ts ./tests/unit/config/default-config-generator.test.ts`

**Step 5: Commit**

```bash
git add src/config/default-config-generator.ts tests/unit/config/default-config-generator.test.ts
git commit -m "fix: use monokai as default theme (matches docs and DEFAULT_THEME)"
```

---

## Task 2: Add SysmonWidget to layout-preview.ts

**Files:**
- Modify: `src/cli/commands/quick-config/layout-preview.ts:14,41-104`
- Modify: `tests/unit/cli/commands/quick-config/layout-preview.test.ts`

**Step 2.1: Write failing test for sysmon in preview**

Add to `tests/unit/cli/commands/quick-config/layout-preview.test.ts`:

```typescript
it("should render sysmon widget in rich layout preview", async () => {
  const { generateRichLayout } = await import("../../../../../src/config/default-config.js");
  const config = generateRichLayout("balanced", "monokai");

  // Rich layout has sysmon on line 3
  assert.ok(config.lines["3"], "Rich layout should have line 3");
  const sysmonWidget = config.lines["3"].find((w: any) => w.id === "sysmon");
  assert.ok(sysmonWidget, "Rich layout should have sysmon widget");

  // Preview should render without errors
  const preview = await renderPreviewFromConfig(config, "balanced", "monokai");
  assert.ok(preview.length > 0, "Preview should render");
  // Sysmon shows CPU/RAM metrics - check for typical output patterns
  assert.ok(
    preview.includes("CPU") || preview.includes("RAM") || preview.includes("%"),
    "Preview should contain sysmon metrics"
  );
});
```

**Step 2.2: Run test to verify it fails**

Run: `npm test -- --test-name-pattern="should render sysmon"`

Expected: FAIL (sysmon not rendered because it's not in widgetFactory)

**Step 2.3: Add SysmonWidget import and factory entry**

In `src/cli/commands/quick-config/layout-preview.ts`:

Add import (after line 24):
```typescript
import { SysmonWidget } from "../../../widgets/sysmon-widget.js";
import { createMockSystemProvider } from "./demo-data.js";
```

Add to widgetFactory (after `docker:` entry, around line 103):
```typescript
    sysmon: (s) => {
      const w = new SysmonWidget(themeColors, createMockSystemProvider());
      w.setStyle(s);
      return w;
    },
```

**Step 2.4: Run test to verify it passes**

Run: `npm test -- --test-name-pattern="should render sysmon"`

Expected: PASS

**Step 2.5: Run all layout-preview tests**

Run: `npm test -- --test-name-pattern="layout-preview"`

Expected: All PASS

**Step 2.6: Run Biome**

Run: `npx @biomejs/biome check --write ./src/cli/commands/quick-config/layout-preview.ts ./tests/unit/cli/commands/quick-config/layout-preview.test.ts`

**Step 2.7: Commit**

```bash
git add src/cli/commands/quick-config/layout-preview.ts tests/unit/cli/commands/quick-config/layout-preview.test.ts
git commit -m "fix: add SysmonWidget to layout-preview factory"
```

---

## Task 3: Add empty-line Widget to layout-preview.ts

**Files:**
- Modify: `src/cli/commands/quick-config/layout-preview.ts`

**Step 3.1: Add EmptyLineWidget import and factory entry**

In `src/cli/commands/quick-config/layout-preview.ts`:

Add import:
```typescript
import { EmptyLineWidget } from "../../../widgets/empty-line-widget.js";
```

Add to widgetFactory (after `sysmon:` entry):
```typescript
    "empty-line": () => {
      return new EmptyLineWidget();
    },
```

Note: EmptyLineWidget doesn't need style or colors.

**Step 3.2: Run all layout-preview tests**

Run: `npm test -- --test-name-pattern="layout-preview"`

Expected: All PASS

**Step 3.3: Run Biome**

Run: `npx @biomejs/biome check --write ./src/cli/commands/quick-config/layout-preview.ts`

**Step 3.4: Commit**

```bash
git add src/cli/commands/quick-config/layout-preview.ts
git commit -m "fix: add EmptyLineWidget to layout-preview factory"
```

---

## Task 4: Replace Hardcoded Theme Array with Dynamic Generation

**Files:**
- Modify: `src/cli/commands/quick-config/select-with-preview.ts:59-68`

**Step 4.1: Update select-with-preview.ts to use dynamic theme list**

Replace the hardcoded array (lines 59-68) with:

```typescript
// FROM:
const availableThemes = [
  "catppuccin-mocha", // AVAILABLE_THEMES[0]
  "cyberpunk-neon",   // AVAILABLE_THEMES[1]
  "dracula",          // AVAILABLE_THEMES[2]
  "dusty-sage",       // AVAILABLE_THEMES[3]
  "github-dark-dimmed", // AVAILABLE_THEMES[4]
  "gray",             // AVAILABLE_THEMES[5] - was missing!
  "monokai",          // AVAILABLE_THEMES[6]
  "muted-gray",       // AVAILABLE_THEMES[7] - was missing!
];

// TO:
// Import AVAILABLE_THEMES at the top of the file
import { AVAILABLE_THEMES } from "../../../ui/theme/index.js";

// Then in generatePreviews function:
// Generate theme list dynamically from AVAILABLE_THEMES (first 8)
const availableThemes = AVAILABLE_THEMES.slice(0, 8).map((t) => t.name);
```

**Step 4.2: Run select-with-preview tests**

Run: `npm test -- --test-name-pattern="selectWithPreview"`

Expected: All PASS (existing tests verify the first 8 themes order)

**Step 4.3: Run Biome**

Run: `npx @biomejs/biome check --write ./src/cli/commands/quick-config/select-with-preview.ts`

**Step 4.4: Commit**

```bash
git add src/cli/commands/quick-config/select-with-preview.ts
git commit -m "refactor: generate theme list dynamically from AVAILABLE_THEMES"
```

---

## Task 5: Update Rich Layout Description in menu.ts

**Files:**
- Modify: `src/cli/commands/quick-config/menu.ts:49`

**Step 5.1: Update the Rich layout description**

Change line 49 in `src/cli/commands/quick-config/menu.ts`:

```typescript
// FROM:
description: "3 lines: + Dev Server|Docker|Active Tools on line 3",

// TO:
description: "5 lines: Core metrics + Git/Cache + Dev/Docker/Tools + Sysmon",
```

**Step 5.2: Run Biome**

Run: `npx @biomejs/biome check --write ./src/cli/commands/quick-config/menu.ts`

**Step 5.3: Commit**

```bash
git add src/cli/commands/quick-config/menu.ts
git commit -m "docs: update Rich layout description to reflect actual structure"
```

---

## Task 6: Final Verification

**Step 6.1: Run all tests**

Run: `npm test`

Expected: All PASS

**Step 6.2: Run Biome on entire src**

Run: `npx @biomejs/biome check --write ./src`

**Step 6.3: Manual verification**

Run: `npm run build && npx claude-scope config`

Verify:
1. Rich layout preview shows sysmon widget
2. Theme previews work correctly
3. No errors in preview rendering

**Step 6.4: Final commit (if any uncommitted changes)**

```bash
git status
# If clean, skip. Otherwise:
git add .
git commit -m "chore: final cleanup after consistency fixes"
```

---

## Files Changed Summary

| File | Change Type |
|------|-------------|
| `src/config/default-config-generator.ts` | Fix: monokai theme |
| `src/cli/commands/quick-config/layout-preview.ts` | Add: SysmonWidget, EmptyLineWidget |
| `src/cli/commands/quick-config/select-with-preview.ts` | Refactor: dynamic theme array |
| `src/cli/commands/quick-config/menu.ts` | Docs: Rich layout description |
| `tests/unit/config/default-config-generator.test.ts` | Fix: test description |
| `tests/unit/cli/commands/quick-config/layout-preview.test.ts` | Add: sysmon test |

---

## Rollback Plan

If issues arise, each task has an independent commit that can be reverted:

```bash
# Revert specific fix (example):
git revert <commit-hash>
```

All changes are backwards compatible - no breaking changes to public API or config format.
