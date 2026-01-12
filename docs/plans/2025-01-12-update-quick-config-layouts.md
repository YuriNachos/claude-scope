# Update Quick-Config Layouts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update quick-config command's three layout presets (balanced, compact, rich) to match the widget arrangements from the demo script preview.

**Architecture:** Modify layout generator functions in `src/config/default-config.ts` and update corresponding descriptions in `src/cli/commands/quick-config/menu.ts`. Tests need updates to reflect new widget arrangements.

**Tech Stack:** TypeScript, Node.js test framework, existing config schema

---

## Summary of Changes

| Layout | Current | New |
|--------|---------|-----|
| **balanced** | Line 0: model,context,cost,duration,lines,git<br>Line 1: git,cache-metrics,config-count,active-tools | Line 0: model,context,lines,cost,duration<br>Line 1: git,git-tag,cache-metrics,config-count |
| **compact** | Line 0: model,context,cost,git,duration | Line 0: model,context,cost,git,duration (same) |
| **rich** | Line 0: model,context,cost,lines,duration<br>Line 1: git,git-tag,active-tools<br>Line 2: cache-metrics,config-count | Line 0: model,context,lines,cost,duration<br>Line 1: git,git-tag,cache-metrics,config-count<br>Line 2: dev-server,docker,active-tools |

---

## Task 1: Update `generateBalancedLayout()` function

**Files:**
- Modify: `src/config/default-config.ts:134-211`

**Step 1: Write failing test for new balanced layout**

```typescript
// In tests/unit/config/layout-generators.test.ts
it("should have 5 widgets on line 0 in new order", () => {
  const config = generateBalancedLayout(defaultStyle, defaultTheme);
  const line0Ids = config.lines["0"].map((w) => w.id);

  assert.deepStrictEqual(line0Ids, [
    "model",
    "context",
    "lines",
    "cost",
    "duration",
  ]);
});

it("should have 4 widgets on line 1 in new order", () => {
  const config = generateBalancedLayout(defaultStyle, defaultTheme);
  const line1Ids = config.lines["1"].map((w) => w.id);

  assert.deepStrictEqual(line1Ids, [
    "git",
    "git-tag",
    "cache-metrics",
    "config-count",
  ]);
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/config/layout-generators.test.ts`

Expected: Tests fail with wrong widget order/counts

**Step 3: Update `generateBalancedLayout()` implementation**

In `src/config/default-config.ts`, replace the entire function (lines 134-211):

```typescript
/**
 * Generate Balanced layout configuration
 * Line 0: model, context, lines, cost, duration
 * Line 1: git, git-tag, cache-metrics, config-count
 */
export function generateBalancedLayout(style: QuickConfigStyle, themeName: string): ScopeConfig {
  const theme = getThemeByName(themeName).colors;

  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style: style,
          colors: { name: theme.model.name, version: theme.model.version },
        },
        {
          id: "context",
          style: style,
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar,
          },
        },
        {
          id: "lines",
          style: style,
          colors: { added: theme.lines.added, removed: theme.lines.removed },
        },
        {
          id: "cost",
          style: style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency },
        },
        {
          id: "duration",
          style: style,
          colors: { value: theme.duration.value, unit: theme.duration.unit },
        },
      ],
      "1": [
        {
          id: "git",
          style: style,
          colors: { branch: theme.git.branch, changes: theme.git.changes },
        },
        {
          id: "git-tag",
          style: style,
          colors: { base: theme.base.text },
        },
        {
          id: "cache-metrics",
          style: style,
          colors: {
            high: theme.cache.high,
            medium: theme.cache.medium,
            low: theme.cache.low,
            read: theme.cache.read,
            write: theme.cache.write,
          },
        },
        {
          id: "config-count",
          style: style,
          colors: { base: theme.base.muted },
        },
      ],
    },
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/config/layout-generators.test.ts`

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/config/default-config.ts tests/unit/config/layout-generators.test.ts
git commit -m "refactor: update balanced layout to match preview design"
```

---

## Task 2: Update `generateRichLayout()` function

**Files:**
- Modify: `src/config/default-config.ts:265-347`

**Step 1: Write failing test for new rich layout**

```typescript
// In tests/unit/config/layout-generators.test.ts
it("should have 5 widgets on line 0 in new order", () => {
  const config = generateRichLayout(defaultStyle, defaultTheme);
  const line0Ids = config.lines["0"].map((w) => w.id);

  assert.deepStrictEqual(line0Ids, [
    "model",
    "context",
    "lines",
    "cost",
    "duration",
  ]);
});

it("should have 4 widgets on line 1 with cache-metrics", () => {
  const config = generateRichLayout(defaultStyle, defaultTheme);
  const line1Ids = config.lines["1"].map((w) => w.id);

  assert.deepStrictEqual(line1Ids, [
    "git",
    "git-tag",
    "cache-metrics",
    "config-count",
  ]);
});

it("should have 3 widgets on line 2: dev-server, docker, active-tools", () => {
  const config = generateRichLayout(defaultStyle, defaultTheme);
  const line2Ids = config.lines["2"].map((w) => w.id);

  assert.deepStrictEqual(line2Ids, [
    "dev-server",
    "docker",
    "active-tools",
  ]);
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/config/layout-generators.test.ts`

Expected: Tests fail with wrong widget order/counts

**Step 3: Update `generateRichLayout()` implementation**

In `src/config/default-config.ts`, replace the entire function (lines 265-347):

```typescript
/**
 * Generate Rich layout configuration (3 lines)
 * Line 0: model, context, lines, cost, duration
 * Line 1: git, git-tag, cache-metrics, config-count
 * Line 2: dev-server, docker, active-tools
 */
export function generateRichLayout(style: QuickConfigStyle, themeName: string): ScopeConfig {
  const theme = getThemeByName(themeName).colors;

  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style: style,
          colors: { name: theme.model.name, version: theme.model.version },
        },
        {
          id: "context",
          style: style,
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar,
          },
        },
        {
          id: "lines",
          style: style,
          colors: { added: theme.lines.added, removed: theme.lines.removed },
        },
        {
          id: "cost",
          style: style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency },
        },
        {
          id: "duration",
          style: style,
          colors: { value: theme.duration.value, unit: theme.duration.unit },
        },
      ],
      "1": [
        {
          id: "git",
          style: style,
          colors: { branch: theme.git.branch, changes: theme.git.changes },
        },
        {
          id: "git-tag",
          style: style,
          colors: { base: theme.base.text },
        },
        {
          id: "cache-metrics",
          style: style,
          colors: {
            high: theme.cache.high,
            medium: theme.cache.medium,
            low: theme.cache.low,
            read: theme.cache.read,
            write: theme.cache.write,
          },
        },
        {
          id: "config-count",
          style: style,
          colors: { base: theme.base.muted },
        },
      ],
      "2": [
        {
          id: "dev-server",
          style: style,
          colors: {
            name: theme.devServer.name,
            status: theme.devServer.status,
            label: theme.devServer.label,
            icon: theme.devServer.icon,
          },
        },
        {
          id: "docker",
          style: style,
          colors: {
            label: theme.docker.label,
            count: theme.docker.count,
            running: theme.docker.running,
            stopped: theme.docker.stopped,
          },
        },
        {
          id: "active-tools",
          style: style,
          colors: {
            running: theme.tools.running,
            completed: theme.tools.completed,
            error: theme.tools.error,
            name: theme.tools.name,
            target: theme.tools.target,
            count: theme.tools.count,
          },
        },
      ],
    },
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/config/layout-generators.test.ts`

Expected: All tests pass

**Step 5: Commit**

```bash
git add src/config/default-config.ts tests/unit/config/layout-generators.test.ts
git commit -m "refactor: update rich layout with dev-server, docker, active-tools"
```

---

## Task 3: Update layout descriptions in menu.ts

**Files:**
- Modify: `src/cli/commands/quick-config/menu.ts:34-53`

**Step 1: Update layout choice descriptions**

Replace the `layoutChoices` array in `selectLayout()` function (lines 34-53):

```typescript
const layoutChoices: PreviewChoice<QuickConfigLayout>[] = [
  {
    name: "Balanced",
    description: "2 lines: Model|Context|Lines|Cost|Duration + Git|GitTag|Cache|Config",
    value: "balanced",
    getConfig: (s, t) => generateBalancedLayout(s, t),
  },
  {
    name: "Compact",
    description: "1 line: Model|Context|Cost|Git|Duration",
    value: "compact",
    getConfig: (s, t) => generateCompactLayout(s, t),
  },
  {
    name: "Rich",
    description: "3 lines: + Dev Server|Docker|Active Tools on line 3",
    value: "rich",
    getConfig: (s, t) => generateRichLayout(s, t),
  },
];
```

**Step 2: Update comment for generateBalancedLayout**

In `src/config/default-config.ts` at line 130, update the JSDoc comment:

```typescript
/**
 * Generate Balanced layout configuration
 * Line 0: model, context, lines, cost, duration
 * Line 1: git, git-tag, cache-metrics, config-count
 */
```

**Step 3: Update comment for generateRichLayout**

In `src/config/default-config.ts` at line 260, update the JSDoc comment:

```typescript
/**
 * Generate Rich layout configuration (3 lines)
 * Line 0: model, context, lines, cost, duration
 * Line 1: git, git-tag, cache-metrics, config-count
 * Line 2: dev-server, docker, active-tools
 */
```

**Step 4: Run quick-config to verify UI**

Run: `npm run build && node dist/cli/index.js quick-config`

Navigate through options and verify descriptions are correct.

**Step 5: Commit**

```bash
git add src/config/default-config.ts src/cli/commands/quick-config/menu.ts
git commit -m "docs: update layout descriptions to match new arrangements"
```

---

## Task 4: Update widget color structure tests

**Files:**
- Modify: `tests/unit/config/layout-generators.test.ts:290-360`

**Step 1: Add test for dev-server widget color structure**

```typescript
it("should have correct color structure for dev-server widget", () => {
  const config = generateRichLayout("balanced", "monokai");
  const devServerWidget = config.lines["2"].find((w) => w.id === "dev-server");

  assert.ok(devServerWidget);
  assert.ok("name" in devServerWidget.colors);
  assert.ok("status" in devServerWidget.colors);
  assert.ok("label" in devServerWidget.colors);
  assert.ok("icon" in devServerWidget.colors);
});
```

**Step 2: Add test for docker widget color structure**

```typescript
it("should have correct color structure for docker widget", () => {
  const config = generateRichLayout("balanced", "monokai");
  const dockerWidget = config.lines["2"].find((w) => w.id === "docker");

  assert.ok(dockerWidget);
  assert.ok("label" in dockerWidget.colors);
  assert.ok("count" in dockerWidget.colors);
  assert.ok("running" in dockerWidget.colors);
  assert.ok("stopped" in dockerWidget.colors);
});
```

**Step 3: Update existing git-tag widget test location**

The git-tag widget is now on line 1 (not line 1 with different widgets). Update:

```typescript
// Changed from line 1 to line 1, but verify location
it("should have correct color structure for git-tag widget", () => {
  const config = generateRichLayout("balanced", "monokai");
  // git-tag is now on line 1
  const gitTagWidget = config.lines["1"].find((w) => w.id === "git-tag");

  assert.ok(gitTagWidget);
  assert.ok("base" in gitTagWidget.colors);
});
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/config/layout-generators.test.ts`

Expected: All tests pass

**Step 5: Commit**

```bash
git add tests/unit/config/layout-generators.test.ts
git commit -m "test: add color structure tests for dev-server and docker widgets"
```

---

## Task 5: Update integration test for rich layout

**Files:**
- Modify: `tests/integration/rich-layout-structure.test.ts`

**Step 1: Update line 0 expectations**

```typescript
it("should have lines widget on line 0 after context widget", () => {
  const config = generateRichLayout("balanced", "monokai");

  const line0WidgetIds = config.lines["0"].map((w) => w.id);

  // New order: model, context, lines, cost, duration
  expect(line0WidgetIds).to.deep.equal([
    "model",
    "context",
    "lines",
    "cost",
    "duration",
  ]);
});
```

**Step 2: Update line 1 expectations**

```typescript
it("should have git, git-tag, cache-metrics, config-count on line 1", () => {
  const config = generateRichLayout("balanced", "monokai");

  const line1WidgetIds = config.lines["1"].map((w) => w.id);

  // New line 1: git, git-tag, cache-metrics, config-count
  expect(line1WidgetIds).to.deep.equal([
    "git",
    "git-tag",
    "cache-metrics",
    "config-count",
  ]);
});
```

**Step 3: Update line 2 expectations**

```typescript
it("should have dev-server, docker, active-tools on line 2", () => {
  const config = generateRichLayout("balanced", "monokai");

  const line2WidgetIds = config.lines["2"].map((w) => w.id);

  // New line 2: dev-server, docker, active-tools
  expect(line2WidgetIds).to.deep.equal([
    "dev-server",
    "docker",
    "active-tools",
  ]);
});
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/integration/rich-layout-structure.test.ts`

Expected: All tests pass

**Step 5: Commit**

```bash
git add tests/integration/rich-layout-structure.test.ts
git commit -m "test: update integration tests for new rich layout structure"
```

---

## Task 6: Run full test suite and verify

**Step 1: Run all tests**

Run: `npm test`

Expected: All tests pass

**Step 2: Run quick-config manually**

Run: `npm run build && node dist/cli/index.js quick-config`

Navigate through all layout options and verify:
- Balanced shows 2 lines with correct widgets
- Compact shows 1 line (unchanged)
- Rich shows 3 lines with dev-server, docker, active-tools on line 3

**Step 3: Verify generated config file**

Check `~/.claude-scope/config.json` matches expected layout.

**Step 4: Final commit**

```bash
git add .
git commit -m "test: verify all tests pass for updated quick-config layouts"
```

---

## Verification Checklist

After completing all tasks:

- [ ] `generateBalancedLayout()` produces: Line 0 (model,context,lines,cost,duration), Line 1 (git,git-tag,cache-metrics,config-count)
- [ ] `generateCompactLayout()` produces: Line 0 (model,context,cost,git,duration) - unchanged
- [ ] `generateRichLayout()` produces: Line 0 (model,context,lines,cost,duration), Line 1 (git,git-tag,cache-metrics,config-count), Line 2 (dev-server,docker,active-tools)
- [ ] Menu descriptions match new layouts
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual quick-config flow works correctly
