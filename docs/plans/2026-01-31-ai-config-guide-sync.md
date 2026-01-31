# AI-CONFIG-GUIDE.md Synchronization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Synchronize AI-CONFIG-GUIDE.md with actual codebase implementation, fix color field documentation, add missing widgets, and update examples.

**Architecture:** Documentation-only changes to AI-CONFIG-GUIDE.md plus code fixes in default-config.ts to use correct color field names. Config color fields should match what widgets expect even though widgets use theme colors internally.

**Tech Stack:** TypeScript, Node.js test runner, Biome formatter

---

## Summary of Issues

| # | Issue | Fix Required |
|---|-------|--------------|
| 1 | Sysmon widget missing from documentation | Add to Widget Catalog, Color Fields, Examples |
| 2 | Git-tag color fields wrong (`base` → `branch`) | Fix in AI-CONFIG-GUIDE.md AND default-config.ts |
| 3 | Config-count color fields wrong (`base` → `label`, `separator`) | Fix in AI-CONFIG-GUIDE.md AND default-config.ts |
| 4 | Duration widget color fields missing | Add to Color Fields section |
| 5 | Rich Layout example shows 3 lines, should be 5 | Update example config |
| 6 | Document version not linked to app version | Add compatibility note |
| 7 | Tests for color field consistency missing | Add validation tests |

---

## Task 1: Fix Git-Tag Widget Color Fields

**Files:**
- Modify: `src/config/default-config.ts:87-91,197-201,323-327`
- Modify: `AI-CONFIG-GUIDE.md:91,475`
- Test: `tests/unit/config/default-config.test.ts`

**Step 1.1: Update default-config.ts for git-tag colors**

Change all occurrences of git-tag config from `base` to proper `branch` field.

In `generateConfigWithStyleAndTheme()` (lines 87-91):
```typescript
// FROM:
{
  id: "git-tag",
  style: style,
  colors: {
    base: theme.base.text,
  },
},

// TO:
{
  id: "git-tag",
  style: style,
  colors: {
    branch: theme.git.branch,
  },
},
```

In `generateBalancedLayout()` (lines 197-201):
```typescript
// FROM:
{
  id: "git-tag",
  style: style,
  colors: { base: theme.base.text },
},

// TO:
{
  id: "git-tag",
  style: style,
  colors: { branch: theme.git.branch },
},
```

In `generateRichLayout()` (lines 323-327):
```typescript
// FROM:
{
  id: "git-tag",
  style: style,
  colors: { base: theme.base.text },
},

// TO:
{
  id: "git-tag",
  style: style,
  colors: { branch: theme.git.branch },
},
```

**Step 1.2: Add test for git-tag color fields**

Add to `tests/unit/config/default-config.test.ts`:
```typescript
it("should have git-tag widget with branch color field", () => {
  const config = generateDefaultConfig();
  const gitTagWidget = config.lines["1"].find((w) => w.id === "git-tag")!;
  assert.ok("branch" in gitTagWidget.colors, "git-tag should have branch color");
});
```

**Step 1.3: Run tests**

Run: `npm test -- --test-name-pattern="git-tag"`

Expected: PASS

**Step 1.4: Run Biome**

Run: `npx @biomejs/biome check --write ./src/config/default-config.ts ./tests/unit/config/default-config.test.ts`

**Step 1.5: Commit**

```bash
git add src/config/default-config.ts tests/unit/config/default-config.test.ts
git commit -m "fix: use correct color field 'branch' for git-tag widget"
```

---

## Task 2: Fix Config-Count Widget Color Fields

**Files:**
- Modify: `src/config/default-config.ts:93-98,213-217,339-343`
- Test: `tests/unit/config/default-config.test.ts`

**Step 2.1: Update default-config.ts for config-count colors**

Change all occurrences from `base` to `label` and `separator`.

In `generateConfigWithStyleAndTheme()` (lines 93-98):
```typescript
// FROM:
{
  id: "config-count",
  style: style,
  colors: {
    base: theme.base.muted,
  },
},

// TO:
{
  id: "config-count",
  style: style,
  colors: {
    label: theme.configCount.label,
    separator: theme.configCount.separator,
  },
},
```

In `generateBalancedLayout()` (lines 213-217):
```typescript
// FROM:
{
  id: "config-count",
  style: style,
  colors: { base: theme.base.muted },
},

// TO:
{
  id: "config-count",
  style: style,
  colors: {
    label: theme.configCount.label,
    separator: theme.configCount.separator
  },
},
```

In `generateRichLayout()` (lines 339-343):
```typescript
// FROM:
{
  id: "config-count",
  style: style,
  colors: { base: theme.base.muted },
},

// TO:
{
  id: "config-count",
  style: style,
  colors: {
    label: theme.configCount.label,
    separator: theme.configCount.separator
  },
},
```

**Step 2.2: Add test for config-count color fields**

Add to `tests/unit/config/default-config.test.ts`:
```typescript
it("should have config-count widget with label and separator color fields", () => {
  const config = generateDefaultConfig();
  const configCountWidget = config.lines["1"].find((w) => w.id === "config-count")!;
  assert.ok("label" in configCountWidget.colors, "config-count should have label color");
  assert.ok("separator" in configCountWidget.colors, "config-count should have separator color");
});
```

**Step 2.3: Run tests**

Run: `npm test -- --test-name-pattern="config-count"`

Expected: PASS

**Step 2.4: Run Biome**

Run: `npx @biomejs/biome check --write ./src/config/default-config.ts ./tests/unit/config/default-config.test.ts`

**Step 2.5: Commit**

```bash
git add src/config/default-config.ts tests/unit/config/default-config.test.ts
git commit -m "fix: use correct color fields 'label', 'separator' for config-count widget"
```

---

## Task 3: Add Sysmon Widget to AI-CONFIG-GUIDE.md

**Files:**
- Modify: `AI-CONFIG-GUIDE.md`

**Step 3.1: Add sysmon to Widget Catalog (after line 98)**

Insert after `| `docker` | Docker Widget |`:
```markdown
| `sysmon` | Sysmon Widget | System metrics: CPU, RAM, Disk, Network | 3 |
```

**Step 3.2: Add sysmon style examples (after Docker Widget section, ~line 217)**

Add new section:
```markdown
#### Sysmon Widget (`sysmon`)
| Style | Output |
|-------|--------|
| `balanced` | `CPU 45% │ RAM 8.2G │ Disk 65% │ Net ↑1.2M ↓3.4M` |
| `compact` | `CPU:45% RAM:8.2G` |
| `playful` | `🖥️ 45% │ 🧠 8.2G │ 💾 65% │ 🌐 ↑1.2M` |
| `verbose` | `CPU: 45% used │ RAM: 8.2GB/16GB │ Disk: 65% │ Network: ↑1.2MB/s ↓3.4MB/s` |
```

**Step 3.3: Add sysmon color fields documentation (after Docker Widget colors, ~line 403)**

Add new section:
```markdown
#### Sysmon Widget (`sysmon`)
```json
"colors": {
  "cpu": "\u001b[38;2;R;G;Bm",       // CPU usage color
  "ram": "\u001b[38;2;R;G;Bm",       // RAM usage color
  "disk": "\u001b[38;2;R;G;Bm",      // Disk usage color
  "network": "\u001b[38;2;R;G;Bm",   // Network usage color
  "separator": "\u001b[38;2;R;G;Bm"  // Separator (│) color
}
```
```

**Step 3.4: Commit**

```bash
git add AI-CONFIG-GUIDE.md
git commit -m "docs: add sysmon widget to AI-CONFIG-GUIDE.md"
```

---

## Task 4: Add Duration and Git-Tag Color Fields to AI-CONFIG-GUIDE.md

**Files:**
- Modify: `AI-CONFIG-GUIDE.md`

**Step 4.1: Add Duration widget color fields (after Cost Widget colors, ~line 354)**

Add new section:
```markdown
#### Duration Widget (`duration`)
```json
"colors": {
  "value": "\u001b[38;2;R;G;Bm",    // Time value color
  "unit": "\u001b[38;2;R;G;Bm"      // Time unit color (h, m, s)
}
```
```

**Step 4.2: Add Git-Tag widget color fields (after Git Widget colors, ~line 363)**

Add new section:
```markdown
#### Git Tag Widget (`git-tag`)
```json
"colors": {
  "branch": "\u001b[38;2;R;G;Bm"    // Tag name color (uses git branch color)
}
```
```

**Step 4.3: Fix Config-Count color fields documentation (update existing section)**

Find the config-count color section and update:
```markdown
#### Config Count Widget (`config-count`)
```json
"colors": {
  "label": "\u001b[38;2;R;G;Bm",     // Label color (CLAUDE.md, rules, MCPs, hooks)
  "separator": "\u001b[38;2;R;G;Bm"  // Separator (│) color
}
```
```

**Step 4.4: Commit**

```bash
git add AI-CONFIG-GUIDE.md
git commit -m "docs: add duration, git-tag color fields to AI-CONFIG-GUIDE.md"
```

---

## Task 5: Update Rich Layout Example

**Files:**
- Modify: `AI-CONFIG-GUIDE.md:460-486`

**Step 5.1: Update Rich Layout heading and example**

Change line 460:
```markdown
// FROM:
### Rich Layout (3 lines, default)

// TO:
### Rich Layout (5 lines, default)
```

**Step 5.2: Update the example config to include all 5 lines**

Replace the entire Rich Layout example (lines 461-486) with:
```json
{
  "version": "1.0.0",
  "$aiDocs": "https://github.com/YuriNachos/claude-scope/blob/main/AI-CONFIG-GUIDE.md",
  "lines": {
    "0": [
      { "id": "model", "style": "balanced", "colors": { "name": "...", "version": "..." } },
      { "id": "context", "style": "balanced", "colors": { "low": "...", "medium": "...", "high": "...", "bar": "..." } },
      { "id": "lines", "style": "balanced", "colors": { "added": "...", "removed": "..." } },
      { "id": "cost", "style": "balanced", "colors": { "amount": "...", "currency": "..." } },
      { "id": "duration", "style": "balanced", "colors": { "value": "...", "unit": "..." } }
    ],
    "1": [
      { "id": "git", "style": "balanced", "colors": { "branch": "...", "changes": "..." } },
      { "id": "git-tag", "style": "balanced", "colors": { "branch": "..." } },
      { "id": "cache-metrics", "style": "balanced", "colors": { "high": "...", "medium": "...", "low": "...", "read": "...", "write": "..." } },
      { "id": "config-count", "style": "balanced", "colors": { "label": "...", "separator": "..." } }
    ],
    "2": [
      { "id": "dev-server", "style": "balanced", "colors": { "name": "...", "status": "...", "label": "..." } },
      { "id": "docker", "style": "balanced", "colors": { "label": "...", "count": "...", "running": "...", "stopped": "..." } },
      { "id": "active-tools", "style": "balanced", "colors": { "running": "...", "completed": "...", "error": "...", "name": "...", "target": "...", "count": "..." } }
    ],
    "3": [
      { "id": "sysmon", "style": "balanced", "colors": { "cpu": "...", "ram": "...", "disk": "...", "network": "...", "separator": "..." } }
    ],
    "4": [
      { "id": "empty-line" }
    ]
  }
}
```

**Step 5.3: Commit**

```bash
git add AI-CONFIG-GUIDE.md
git commit -m "docs: update Rich Layout example to show all 5 lines including sysmon"
```

---

## Task 6: Update Document Version and Widget Count

**Files:**
- Modify: `AI-CONFIG-GUIDE.md`

**Step 6.1: Update Widget Catalog count in document**

Find line with "14 widgets" mentions and update. The actual count is now 15 widgets.

**Step 6.2: Update document version footer (lines 551-553)**

```markdown
// FROM:
**Document Version**: 1.0.0
**Last Updated**: 2026-01-12
**Compatible with**: claude-scope >= 0.8.16

// TO:
**Document Version**: 1.1.0
**Last Updated**: 2026-01-31
**Compatible with**: claude-scope >= 0.8.46
```

**Step 6.3: Commit**

```bash
git add AI-CONFIG-GUIDE.md
git commit -m "docs: update AI-CONFIG-GUIDE.md version to 1.1.0"
```

---

## Task 7: Add Color Field Consistency Tests

**Files:**
- Create: `tests/unit/config/color-field-consistency.test.ts`

**Step 7.1: Create new test file**

```typescript
/**
 * Tests for config color field consistency
 * Ensures generated configs use correct color field names for each widget
 */
import assert from "node:assert";
import { describe, it } from "node:test";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateConfigWithStyleAndTheme,
  generateRichLayout,
} from "../../../src/config/default-config.js";

describe("ColorFieldConsistency", () => {
  const layouts = [
    { name: "default", fn: () => generateConfigWithStyleAndTheme("balanced", "monokai") },
    { name: "balanced", fn: () => generateBalancedLayout("balanced", "monokai") },
    { name: "compact", fn: () => generateCompactLayout("balanced", "monokai") },
    { name: "rich", fn: () => generateRichLayout("balanced", "monokai") },
  ];

  for (const { name, fn } of layouts) {
    describe(`${name} layout`, () => {
      it("model widget has name and version colors", () => {
        const config = fn();
        const widget = config.lines["0"]?.find((w) => w.id === "model");
        if (widget) {
          assert.ok("name" in widget.colors!, `${name}: model should have name color`);
          assert.ok("version" in widget.colors!, `${name}: model should have version color`);
        }
      });

      it("context widget has low, medium, high, bar colors", () => {
        const config = fn();
        const widget = config.lines["0"]?.find((w) => w.id === "context");
        if (widget) {
          assert.ok("low" in widget.colors!, `${name}: context should have low color`);
          assert.ok("medium" in widget.colors!, `${name}: context should have medium color`);
          assert.ok("high" in widget.colors!, `${name}: context should have high color`);
          assert.ok("bar" in widget.colors!, `${name}: context should have bar color`);
        }
      });

      it("git widget has branch and changes colors", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "git");
        if (widget) {
          assert.ok("branch" in widget.colors!, `${name}: git should have branch color`);
          assert.ok("changes" in widget.colors!, `${name}: git should have changes color`);
        }
      });

      it("git-tag widget has branch color (not base)", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "git-tag");
        if (widget) {
          assert.ok("branch" in widget.colors!, `${name}: git-tag should have branch color`);
          assert.ok(!("base" in widget.colors!), `${name}: git-tag should NOT have base color`);
        }
      });

      it("config-count widget has label and separator colors (not base)", () => {
        const config = fn();
        const allWidgets = Object.values(config.lines).flat();
        const widget = allWidgets.find((w) => w.id === "config-count");
        if (widget) {
          assert.ok("label" in widget.colors!, `${name}: config-count should have label color`);
          assert.ok("separator" in widget.colors!, `${name}: config-count should have separator color`);
          assert.ok(!("base" in widget.colors!), `${name}: config-count should NOT have base color`);
        }
      });

      it("sysmon widget has cpu, ram, disk, network, separator colors", () => {
        const config = fn();
        const widget = config.lines["3"]?.find((w) => w.id === "sysmon");
        if (widget) {
          assert.ok("cpu" in widget.colors!, `${name}: sysmon should have cpu color`);
          assert.ok("ram" in widget.colors!, `${name}: sysmon should have ram color`);
          assert.ok("disk" in widget.colors!, `${name}: sysmon should have disk color`);
          assert.ok("network" in widget.colors!, `${name}: sysmon should have network color`);
          assert.ok("separator" in widget.colors!, `${name}: sysmon should have separator color`);
        }
      });
    });
  }
});
```

**Step 7.2: Run tests to verify they fail (TDD)**

Run: `npm test -- --test-name-pattern="ColorFieldConsistency"`

Expected: FAIL for git-tag and config-count (they currently have `base` field)

**Step 7.3: After Task 1 and 2 are complete, run tests again**

Run: `npm test -- --test-name-pattern="ColorFieldConsistency"`

Expected: PASS

**Step 7.4: Run Biome**

Run: `npx @biomejs/biome check --write ./tests/unit/config/color-field-consistency.test.ts`

**Step 7.5: Commit**

```bash
git add tests/unit/config/color-field-consistency.test.ts
git commit -m "test: add color field consistency tests for all layouts"
```

---

## Task 8: Final Verification

**Step 8.1: Run all tests**

Run: `npm test`

Expected: All PASS

**Step 8.2: Run Biome on all changed files**

Run: `npx @biomejs/biome check --write ./src ./tests ./AI-CONFIG-GUIDE.md`

**Step 8.3: Manual verification**

1. Read `~/.claude-scope/config.json` and verify git-tag has `branch` field
2. Read `~/.claude-scope/config.json` and verify config-count has `label`, `separator` fields
3. Verify AI-CONFIG-GUIDE.md has sysmon widget documented

**Step 8.4: Final commit (if any uncommitted changes)**

```bash
git status
# If clean, skip. Otherwise:
git add .
git commit -m "chore: final cleanup after AI-CONFIG-GUIDE sync"
```

---

## Files Changed Summary

| File | Change Type |
|------|-------------|
| `src/config/default-config.ts` | Fix: git-tag and config-count color fields |
| `AI-CONFIG-GUIDE.md` | Docs: add sysmon, fix color fields, update examples |
| `tests/unit/config/default-config.test.ts` | Test: add color field assertions |
| `tests/unit/config/color-field-consistency.test.ts` | Test: new comprehensive tests |

---

## Rollback Plan

If issues arise, each task has an independent commit that can be reverted:

```bash
# Revert specific fix (example):
git revert <commit-hash>
```

All changes are backwards compatible - no breaking changes to public API or config format.
