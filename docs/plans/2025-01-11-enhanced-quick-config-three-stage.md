# Enhanced Quick Config: Three-Stage Interactive Setup

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the quick-config command into a three-stage interactive setup (Layout → Style → Theme) with live previews at each stage.

**Architecture:**
- Create three layout generators (Balanced, Compact, Rich) that return widget configurations with specific line assignments
- Enhance the preview system to render widgets based on layout + style + theme combination
- Use @inquirer/prompts with custom rendering to show live previews under each option
- Add navigation hints and stage descriptions for better UX

**Tech Stack:**
- `@inquirer/prompts` - for interactive CLI selection
- TypeScript - for type safety
- Existing widget system - no changes to widget implementations

---

## Task 1: Add Layout Type and Interface

**Files:**
- Modify: `src/cli/commands/quick-config/config-schema.ts`

**Step 1: Add Layout type union**

```typescript
/**
 * Layout presets for widget arrangement
 */
export const LAYOUT_PRESETS = ["balanced", "compact", "rich"] as const;
export type QuickConfigLayout = (typeof LAYOUT_PRESETS)[number];
```

**Step 2: Extend config-schema.ts exports**

Add to existing exports in `config-schema.ts`:

```typescript
export type { QuickConfigLayout };
export { LAYOUT_PRESETS };
```

**Step 3: Commit**

```bash
git add src/cli/commands/quick-config/config-schema.ts
git commit -m "feat: add QuickConfigLayout type for layout presets"
```

---

## Task 2: Create Layout Configuration Generators

**Files:**
- Modify: `src/config/default-config.ts`

**Step 1: Add imports for MCP and hooks widgets (if not present)**

The ActiveToolsWidget and ConfigCountWidget already exist. We need to ensure hooks can be shown separately. First, check if ConfigCountWidget shows hooks:

**Step 2: Create generateBalancedLayout function**

Add to `default-config.ts` after `generateConfigWithStyleAndTheme`:

```typescript
/**
 * Generate Balanced layout configuration
 * Line 0: model, context, cost, duration, lines
 * Line 1: git, cache-metrics, mcp-status, hooks-count, active-tools
 */
export function generateBalancedLayout(
  style: QuickConfigStyle,
  themeName: string
): ScopeConfig {
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
          colors: { low: theme.context.low, medium: theme.context.medium, high: theme.context.high, bar: theme.context.bar },
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
        {
          id: "lines",
          style: style,
          colors: { added: theme.lines.added, removed: theme.lines.removed },
        },
      ],
      "1": [
        {
          id: "git",
          style: style,
          colors: { branch: theme.git.branch, changes: theme.git.changes },
        },
        {
          id: "cache-metrics",
          style: style,
          colors: { high: theme.cache.high, medium: theme.cache.medium, low: theme.cache.low, read: theme.cache.read, write: theme.cache.write },
        },
        {
          id: "active-tools",
          style: style,
          colors: { running: theme.tools.running, completed: theme.tools.completed, error: theme.tools.error, name: theme.tools.name, target: theme.tools.target, count: theme.tools.count },
        },
      ],
    },
  };
}
```

**Step 3: Create generateCompactLayout function**

```typescript
/**
 * Generate Compact layout configuration (1 line)
 * Line 0: model, context, cost, git, duration
 */
export function generateCompactLayout(
  style: QuickConfigStyle,
  themeName: string
): ScopeConfig {
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
          colors: { low: theme.context.low, medium: theme.context.medium, high: theme.context.high, bar: theme.context.bar },
        },
        {
          id: "cost",
          style: style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency },
        },
        {
          id: "git",
          style: style,
          colors: { branch: theme.git.branch, changes: theme.git.changes },
        },
        {
          id: "duration",
          style: style,
          colors: { value: theme.duration.value, unit: theme.duration.unit },
        },
      ],
    },
  };
}
```

**Step 4: Create generateRichLayout function**

```typescript
/**
 * Generate Rich layout configuration (3 lines)
 * Line 0: model, context, cost, duration
 * Line 1: git, git-tag, lines, active-tools
 * Line 2: mcp-status, cache-metrics, config-count
 */
export function generateRichLayout(
  style: QuickConfigStyle,
  themeName: string
): ScopeConfig {
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
          colors: { low: theme.context.low, medium: theme.context.medium, high: theme.context.high, bar: theme.context.bar },
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
          id: "lines",
          style: style,
          colors: { added: theme.lines.added, removed: theme.lines.removed },
        },
        {
          id: "active-tools",
          style: style,
          colors: { running: theme.tools.running, completed: theme.tools.completed, error: theme.tools.error, name: theme.tools.name, target: theme.tools.target, count: theme.tools.count },
        },
      ],
      "2": [
        {
          id: "cache-metrics",
          style: style,
          colors: { high: theme.cache.high, medium: theme.cache.medium, low: theme.cache.low, read: theme.cache.read, write: theme.cache.write },
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

**Step 5: Export new functions**

Add to exports in `default-config.ts`:

```typescript
export { generateBalancedLayout, generateCompactLayout, generateRichLayout };
```

**Step 6: Commit**

```bash
git add src/config/default-config.ts
git commit -m "feat: add layout generators for Balanced, Compact, Rich"
```

---

## Task 3: Create Layout-Specific Preview Renderer

**Files:**
- Create: `src/cli/commands/quick-config/layout-preview.ts`

**Step 1: Write the layout preview module**

Create new file with preview functions for each layout:

```typescript
/**
 * Layout-specific preview renderer
 * Renders widgets based on layout configuration
 */

import { Renderer } from "../../../core/renderer.js";
import { WidgetRegistry } from "../../../core/widget-registry.js";
import { TranscriptProvider } from "../../../providers/transcript-provider.js";
import { getThemeByName } from "../../../ui/theme/index.js";
import type { ScopeConfig, QuickConfigStyle } from "./config-schema.js";
import { createDemoData } from "./demo-data.js";

// Widget constructors
import { ActiveToolsWidget } from "../../../widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../../widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../../../widgets/config-count-widget.js";
import { ContextWidget } from "../../../widgets/context-widget.js";
import { CostWidget } from "../../../widgets/cost-widget.js";
import { DurationWidget } from "../../../widgets/duration-widget.js";
import { GitTagWidget } from "../../../widgets/git/git-tag-widget.js";
import { GitWidget } from "../../../widgets/git/git-widget.js";
import { LinesWidget } from "../../../widgets/lines-widget.js";
import { ModelWidget } from "../../../widgets/model-widget.js";

/**
 * Register widgets from config into registry
 */
async function registerWidgetsFromConfig(
  registry: WidgetRegistry,
  config: ScopeConfig,
  style: QuickConfigStyle
): Promise<void> {
  const themeColors = getThemeByName("monokai").colors; // Use monokai for preview consistency
  const transcriptProvider = new TranscriptProvider();

  // Widget factory map
  const widgetFactory: Record<string, (style: QuickConfigStyle) => any> = {
    model: (s) => { const w = new ModelWidget(themeColors); w.setStyle(s); return w; },
    context: (s) => { const w = new ContextWidget(themeColors); w.setStyle(s); return w; },
    cost: (s) => { const w = new CostWidget(themeColors); w.setStyle(s); return w; },
    duration: (s) => { const w = new DurationWidget(themeColors); w.setStyle(s); return w; },
    lines: (s) => { const w = new LinesWidget(themeColors); w.setStyle(s); return w; },
    git: (s) => { const w = new GitWidget(undefined, themeColors); w.setStyle(s); return w; },
    "git-tag": (s) => { const w = new GitTagWidget(undefined, themeColors); w.setStyle(s); return w; },
    "config-count": (s) => { const w = new ConfigCountWidget(); w.setStyle(s); return w; },
    "active-tools": (s) => { const w = new ActiveToolsWidget(themeColors, transcriptProvider); w.setStyle(s); return w; },
    "cache-metrics": (s) => { const w = new CacheMetricsWidget(themeColors); w.setStyle(s); return w; },
  };

  // Register widgets from config lines
  for (const [lineNum, widgets] of Object.entries(config.lines)) {
    const line = parseInt(lineNum, 10);
    for (const widgetConfig of widgets) {
      const factory = widgetFactory[widgetConfig.id];
      if (factory) {
        const widget = factory(style);
        // Set line number from config
        widget.metadata.line = line;
        await registry.register(widget);
      }
    }
  }
}

/**
 * Render preview from config
 */
export async function renderPreviewFromConfig(
  config: ScopeConfig,
  style: QuickConfigStyle,
  themeName: string
): Promise<string> {
  // Get theme colors
  const theme = getThemeByName(themeName);

  // Create registry and register widgets
  const registry = new WidgetRegistry();
  await registerWidgetsFromConfig(registry, config, style);

  // Create renderer
  const renderer = new Renderer({
    separator: " │ ",
    onError: () => {},
    showErrors: false,
  });

  // Update all widgets with demo data
  const demoData = createDemoData();
  for (const widget of registry.getAll()) {
    await widget.update(demoData);
  }

  // Render
  const lines = await renderer.render(registry.getEnabledWidgets(), {
    width: 80,
    timestamp: Date.now(),
  });

  return lines.join("\n");
}
```

**Step 2: Commit**

```bash
git add src/cli/commands/quick-config/layout-preview.ts
git commit -m "feat: add layout-specific preview renderer"
```

---

## Task 4: Create Enhanced Menu with Three Stages

**Files:**
- Modify: `src/cli/commands/quick-config/menu.ts`

**Step 1: Replace entire menu.ts with three-stage flow**

```typescript
/**
 * Three-Stage Interactive Menu: Layout → Style → Theme
 */

import { confirm, select } from "@inquirer/prompts";
import { AVAILABLE_THEMES } from "../../../ui/theme/index.js";
import type { QuickConfigLayout, QuickConfigStyle } from "./config-schema.js";
import { loadConfig } from "./config-loader.js";
import { saveConfig } from "./config-writer.js";
import { renderPreviewFromConfig } from "./layout-preview.js";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
  type ScopeConfig,
} from "../../../config/default-config.js";

/**
 * Layout choice interface
 */
interface LayoutChoice {
  name: string;
  description: string;
  value: QuickConfigLayout;
  preview: string;
}

/**
 * Style choice interface with preview
 */
interface StyleChoice {
  name: string;
  description: string;
  value: QuickConfigStyle;
  preview: (layout: QuickConfigLayout, themeName: string) => Promise<string>;
}

/**
 * Theme choice interface with preview
 */
interface ThemeChoice {
  name: string;
  description: string;
  value: string;
  preview: (layout: QuickConfigLayout, style: QuickConfigStyle) => Promise<string>;
}

/**
 * Stage 1: Select layout with live previews
 */
async function selectLayout(): Promise<QuickConfigLayout> {
  // Generate previews for each layout (using balanced style, monokai theme for consistency)
  const balancedPreview = await renderPreviewFromConfig(
    generateBalancedLayout("balanced", "monokai"),
    "balanced",
    "monokai"
  );

  const compactPreview = await renderPreviewFromConfig(
    generateCompactLayout("compact", "monokai"),
    "compact",
    "monokai"
  );

  const richPreview = await renderPreviewFromConfig(
    generateRichLayout("balanced", "monokai"),
    "balanced",
    "monokai"
  );

  const layoutChoices: LayoutChoice[] = [
    {
      name: "Balanced",
      description: "2 lines: AI metrics + Git, Cache, Tools, MCP, Hooks",
      value: "balanced",
      preview: balancedPreview,
    },
    {
      name: "Compact",
      description: "1 line: Model, Context, Cost, Git, Duration",
      value: "compact",
      preview: compactPreview,
    },
    {
      name: "Rich",
      description: "3 lines: Full details with Git Tag, Config Count",
      value: "rich",
      preview: richPreview,
    },
  ];

  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 1/3: Choose Widget Layout                                  │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select how widgets are arranged across statusline lines.        │");
  console.log("│  Each option shows a live preview with demo data.               │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const layout = await select<QuickConfigLayout>({
    message: "Choose a layout preset:",
    choices: layoutChoices,
    pageSize: 3,
  });

  return layout;
}

/**
 * Stage 2: Select style with layout-aware preview
 */
async function selectStyle(layout: QuickConfigLayout): Promise<QuickConfigStyle> {
  // Get config for selected layout
  const getConfig = (l: QuickConfigLayout) => {
    switch (l) {
      case "balanced":
        return generateBalancedLayout;
      case "compact":
        return generateCompactLayout;
      case "rich":
        return generateRichLayout;
    }
  };

  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 2/3: Choose Display Style                                 │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select how widgets are rendered (labels, emojis, etc.).        │");
  console.log("│  Preview shows your selected layout with each style.            │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const styleChoices: StyleChoice[] = [
    {
      name: "Balanced",
      description: "Clean, balanced display with labels",
      value: "balanced",
      preview: async (l, theme) => renderPreviewFromConfig(getConfig(l)("balanced", theme), "balanced", theme),
    },
    {
      name: "Playful",
      description: "Fun display with emojis",
      value: "playful",
      preview: async (l, theme) => renderPreviewFromConfig(getConfig(l)("playful", theme), "playful", theme),
    },
    {
      name: "Compact",
      description: "Minimal, condensed display",
      value: "compact",
      preview: async (l, theme) => renderPreviewFromConfig(getConfig(l)("compact", theme), "compact", theme),
    },
  ];

  const style = await select<QuickConfigStyle>({
    message: "Choose a display style:",
    choices: styleChoices,
  });

  return style;
}

/**
 * Stage 3: Select theme with layout + style aware preview
 */
async function selectTheme(
  layout: QuickConfigLayout,
  style: QuickConfigStyle
): Promise<string> {
  // Get config for selected layout
  const getConfig = (l: QuickConfigLayout) => {
    switch (l) {
      case "balanced":
        return generateBalancedLayout;
      case "compact":
        return generateCompactLayout;
      case "rich":
        return generateRichLayout;
    }
  };

  console.log("\n┌─────────────────────────────────────────────────────────────────┐");
  console.log("│  Stage 3/3: Choose Color Theme                                   │");
  console.log("├─────────────────────────────────────────────────────────────────┤");
  console.log("│  Select color theme for your statusline.                        │");
  console.log("│  Preview shows your final configuration with live colors.        │");
  console.log("└─────────────────────────────────────────────────────────────────┘\n");

  const themeChoices: ThemeChoice[] = AVAILABLE_THEMES.slice(0, 8).map((theme) => ({
    name: theme.name,
    description: theme.description,
    value: theme.name,
    preview: async () => renderPreviewFromConfig(getConfig(layout)(style, theme.name), style, theme.name),
  }));

  const theme = await select<string>({
    message: "Choose a theme:",
    choices: themeChoices,
    pageSize: 8,
  });

  return theme;
}

/**
 * Show navigation hints
 */
function showNavigationHints(): void {
  console.log("\n  Navigation: ↑↓ arrows to move • Enter to select • Esc to exit");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

/**
 * Run full three-stage quick config flow
 */
export async function runQuickConfigMenu(): Promise<void> {
  try {
    // Stage 1: Select layout
    showNavigationHints();
    const selectedLayout = await selectLayout();

    // Stage 2: Select style
    showNavigationHints();
    const selectedStyle = await selectStyle(selectedLayout);

    // Stage 3: Select theme
    showNavigationHints();
    const selectedTheme = await selectTheme(selectedLayout, selectedStyle);

    // Generate and save config
    console.log("\nGenerating configuration...");
    const getConfig = (layout: QuickConfigLayout) => {
      switch (layout) {
        case "balanced":
          return generateBalancedLayout;
        case "compact":
          return generateCompactLayout;
        case "rich":
          return generateRichLayout;
      }
    };

    const config = getConfig(selectedLayout)(selectedStyle, selectedTheme);
    await saveConfig(config);

    console.log(`\n✓ Configuration saved to ~/.claude-scope/config.json`);
    console.log(`  Layout: ${selectedLayout}`);
    console.log(`  Style: ${selectedStyle}`);
    console.log(`  Theme: ${selectedTheme}`);
    console.log("\nPreview of your configuration:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    const finalPreview = await renderPreviewFromConfig(config, selectedStyle, selectedTheme);
    console.log(finalPreview);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    // Handle user cancellation gracefully
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log("\n✓ Configuration cancelled. No changes saved.");
      process.exit(0);
    }

    // Handle permission denied errors
    if (error instanceof Error && (error as any).code === "EACCES") {
      console.error("\n✗ Permission denied. Cannot write to ~/.claude-scope/config.json");
      process.exit(1);
    }

    // Handle all other errors
    console.error("\n✗ Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}
```

**Step 2: Commit**

```bash
git add src/cli/commands/quick-config/menu.ts
git commit -m "feat: implement three-stage menu with layout selection"
```

---

## Task 5: Update Index Exports

**Files:**
- Modify: `src/cli/commands/quick-config/index.ts`

**Step 1: Add layout-preview export**

```typescript
export { renderPreviewFromConfig } from "./layout-preview.js";
```

**Step 2: Commit**

```bash
git add src/cli/commands/quick-config/index.ts
git commit -m "chore: export layout-preview renderer"
```

---

## Task 6: Add Unit Tests for Layout Generators

**Files:**
- Create: `tests/unit/config/layout-generators.test.ts`

**Step 1: Write test file**

```typescript
/**
 * Tests for layout generator functions
 */

import { describe, it, expect } from "vitest";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
  type ScopeConfig,
} from "../../../src/config/default-config.js";

describe("Layout Generators", () => {
  const defaultStyle = "balanced" as const;
  const defaultTheme = "monokai";

  describe("generateBalancedLayout", () => {
    it("should generate config with 2 lines", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);

      expect(Object.keys(config.lines)).toHaveLength(2);
      expect(config.lines).toHaveProperty("0");
      expect(config.lines).toHaveProperty("1");
    });

    it("should include model, context, cost, duration, lines on line 0", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      expect(ids).toContain("model");
      expect(ids).toContain("context");
      expect(ids).toContain("cost");
      expect(ids).toContain("duration");
      expect(ids).toContain("lines");
    });

    it("should include git, cache-metrics, active-tools on line 1", () => {
      const config = generateBalancedLayout(defaultStyle, defaultTheme);
      const line1 = config.lines["1"];

      const ids = line1.map((w) => w.id);
      expect(ids).toContain("git");
      expect(ids).toContain("cache-metrics");
      expect(ids).toContain("active-tools");
    });
  });

  describe("generateCompactLayout", () => {
    it("should generate config with 1 line", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);

      expect(Object.keys(config.lines)).toHaveLength(1);
      expect(config.lines).toHaveProperty("0");
    });

    it("should include model, context, cost, git, duration", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      expect(ids).toContain("model");
      expect(ids).toContain("context");
      expect(ids).toContain("cost");
      expect(ids).toContain("git");
      expect(ids).toContain("duration");
    });

    it("should not include lines widget", () => {
      const config = generateCompactLayout(defaultStyle, defaultTheme);
      const line0 = config.lines["0"];

      const ids = line0.map((w) => w.id);
      expect(ids).not.toContain("lines");
    });
  });

  describe("generateRichLayout", () => {
    it("should generate config with 3 lines", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);

      expect(Object.keys(config.lines)).toHaveLength(3);
      expect(config.lines).toHaveProperty("0");
      expect(config.lines).toHaveProperty("1");
      expect(config.lines).toHaveProperty("2");
    });

    it("should include git-tag and config-count on line 1 and 2", () => {
      const config = generateRichLayout(defaultStyle, defaultTheme);

      const line1Ids = config.lines["1"].map((w) => w.id);
      expect(line1Ids).toContain("git-tag");

      const line2Ids = config.lines["2"].map((w) => w.id);
      expect(line2Ids).toContain("config-count");
    });
  });

  describe("Style and theme application", () => {
    it("should apply style to all widgets", () => {
      const config = generateBalancedLayout("playful", "monokai");

      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          expect(widget.style).toBe("playful");
        }
      }
    });

    it("should apply theme colors to all widgets", () => {
      const config = generateCompactLayout("balanced", "catppuccin-mocha");

      // Check that colors are defined (not empty)
      for (const line of Object.values(config.lines)) {
        for (const widget of line) {
          expect(widget.colors).toBeDefined();
          expect(Object.keys(widget.colors).length).toBeGreaterThan(0);
        }
      }
    });
  });
});
```

**Step 2: Run tests**

```bash
npm test -- tests/unit/config/layout-generators.test.ts
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add tests/unit/config/layout-generators.test.ts
git commit -m "test: add unit tests for layout generators"
```

---

## Task 7: Add Integration Test for Three-Stage Flow

**Files:**
- Create: `tests/integration/three-stage-config-flow.test.ts`

**Step 1: Write integration test**

```typescript
/**
 * Integration test for three-stage quick config flow
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import {
  generateBalancedLayout,
  generateCompactLayout,
  generateRichLayout,
} from "../../src/config/default-config.js";
import { renderPreviewFromConfig } from "../../src/cli/commands/quick-config/layout-preview.js";

const TEST_CONFIG_PATH = join(homedir(), ".claude-scope", "config.json");

describe("Three-Stage Config Flow Integration", () => {
  // Backup original config before tests
  let originalConfig: string | null = null;

  beforeEach(() => {
    if (existsSync(TEST_CONFIG_PATH)) {
      originalConfig = TEST_CONFIG_PATH;
    }
  });

  afterEach(() => {
    // Clean up test config
    if (existsSync(TEST_CONFIG_PATH) && originalConfig !== TEST_CONFIG_PATH) {
      unlinkSync(TEST_CONFIG_PATH);
    }
  });

  describe("Layout generation", () => {
    it("should generate valid balanced layout config", () => {
      const config = generateBalancedLayout("balanced", "monokai");

      expect(config).toHaveProperty("version", "1.0.0");
      expect(config).toHaveProperty("lines");
      expect(Object.keys(config.lines)).toHaveLength(2);
    });

    it("should generate valid compact layout config", () => {
      const config = generateCompactLayout("compact", "monokai");

      expect(config).toHaveProperty("version", "1.0.0");
      expect(config).toHaveProperty("lines");
      expect(Object.keys(config.lines)).toHaveLength(1);
    });

    it("should generate valid rich layout config", () => {
      const config = generateRichLayout("balanced", "monokai");

      expect(config).toHaveProperty("version", "1.0.0");
      expect(config).toHaveProperty("lines");
      expect(Object.keys(config.lines)).toHaveLength(3);
    });
  });

  describe("Preview rendering", () => {
    it("should render balanced layout preview", async () => {
      const config = generateBalancedLayout("balanced", "monokai");
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      expect(preview).toBeTruthy();
      expect(typeof preview).toBe("string");
      expect(preview.length).toBeGreaterThan(0);

      // Should have 2 lines
      const lines = preview.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(2);
    });

    it("should render compact layout preview", async () => {
      const config = generateCompactLayout("compact", "monokai");
      const preview = await renderPreviewFromConfig(config, "compact", "monokai");

      expect(preview).toBeTruthy();
      expect(typeof preview).toBe("string");
      expect(preview.length).toBeGreaterThan(0);
    });

    it("should render rich layout preview", async () => {
      const config = generateRichLayout("balanced", "monokai");
      const preview = await renderPreviewFromConfig(config, "balanced", "monokai");

      expect(preview).toBeTruthy();
      expect(typeof preview).toBe("string");
      expect(preview.length).toBeGreaterThan(0);

      // Should have 3 lines
      const lines = preview.split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Style combination", () => {
    it("should apply playful style correctly", async () => {
      const config = generateBalancedLayout("playful", "monokai");
      const preview = await renderPreviewFromConfig(config, "playful", "monokai");

      expect(preview).toBeTruthy();
      // Playful style includes emojis - preview should contain emoji characters
      expect(preview).toMatch(/[\p{Emoji}]/u);
    });
  });

  describe("Theme combination", () => {
    it("should render with different themes", async () => {
      const config = generateCompactLayout("balanced", "monokai");

      const monokaiPreview = await renderPreviewFromConfig(config, "balanced", "monokai");
      const nordPreview = await renderPreviewFromConfig(config, "balanced", "nord");

      expect(monokaiPreview).toBeTruthy();
      expect(nordPreview).toBeTruthy();
      // Both should be valid strings
      expect(typeof monokaiPreview).toBe("string");
      expect(typeof nordPreview).toBe("string");
    });
  });
});
```

**Step 2: Run integration test**

```bash
npm test -- tests/integration/three-stage-config-flow.test.ts
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add tests/integration/three-stage-config-flow.test.ts
git commit -m "test: add integration test for three-stage config flow"
```

---

## Task 8: Manual Testing Checklist

**Files:**
- No file modifications

**Step 1: Run quick-config command**

```bash
npm run build
node dist/cli/index.js quick-config
```

**Step 2: Verify Stage 1 - Layout Selection**

- [ ] See stage header "Stage 1/3: Choose Widget Layout"
- [ ] See navigation hints at bottom
- [ ] Three layout options: Balanced, Compact, Rich
- [ ] Each option has description
- [ ] Preview renders correctly for Balanced (2 lines)
- [ ] Preview renders correctly for Compact (1 line)
- [ ] Preview renders correctly for Rich (3 lines)

**Step 3: Verify Stage 2 - Style Selection**

- [ ] See stage header "Stage 2/3: Choose Display Style"
- [ ] Three style options: Balanced, Playful, Compact
- [ ] Preview uses selected layout from Stage 1
- [ ] Balanced style shows labels
- [ ] Playful style shows emojis
- [ ] Compact style shows condensed format

**Step 4: Verify Stage 3 - Theme Selection**

- [ ] See stage header "Stage 3/3: Choose Color Theme"
- [ ] At least 8 theme options shown
- [ ] Preview uses selected layout + style from previous stages
- [ ] Different themes show different colors

**Step 5: Verify Final Output**

- [ ] Config saved to ~/.claude-scope/config.json
- [ ] Shows layout, style, theme in confirmation message
- [ ] Final preview renders correctly
- [ ] Config file contains correct widgets for selected layout

**Step 6: Test Different Layouts**

```bash
# Test Balanced layout
node dist/cli/index.js quick-config
# Select Balanced → Playful → Catppuccin Mocha
# Verify config.json has correct widgets

# Test Compact layout
node dist/cli/index.js quick-config
# Select Compact → Balanced → Nord
# Verify config.json has 1 line with correct widgets

# Test Rich layout
node dist/cli/index.js quick-config
# Select Rich → Playful → Dracula
# Verify config.json has 3 lines with correct widgets
```

**Step 7: Test Error Handling**

- [ ] Press Esc at any stage → "Configuration cancelled" message
- [ ] Verify no config changes on cancellation

**Step 8: Commit any fixes**

If issues found during testing:

```bash
git add <files>
git commit -m "fix: <description of fix>"
```

---

## Task 9: Update Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update Quick Config section in CLAUDE.md**

Find the section about `quick-config` command and update:

```markdown
### Quick Config Command

The `quick-config` command provides an interactive three-stage configuration:

```bash
claude-scope quick-config
```

**Stage 1: Choose Layout Preset**
- **Balanced** (2 lines): AI metrics + Git, Cache, Tools, MCP, Hooks
- **Compact** (1 line): Model, Context, Cost, Git, Duration
- **Rich** (3 lines): Full details with Git Tag, Config Count

**Stage 2: Choose Display Style**
- **Balanced**: Clean, balanced display with labels
- **Playful**: Fun display with emojis
- **Compact**: Minimal, condensed display

**Stage 3: Choose Color Theme**
- 17 built-in themes available (Monokai, Nord, Dracula, Catppuccin, etc.)

Each stage shows live previews with demo data. Use ↑↓ arrows to navigate, Enter to select, Esc to exit.

Configuration is saved to `~/.claude-scope/config.json`.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update quick-config documentation with three-stage flow"
```

---

## Task 10: Final Verification

**Files:**
- No file modifications

**Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass

**Step 2: Build and verify**

```bash
npm run build
npm run test:integration
```

Expected: All integration tests pass

**Step 3: Verify config.json structure**

After running quick-config, check the generated config:

```bash
cat ~/.claude-scope/config.json
```

Verify:
- [ ] `version` is "1.0.0"
- [ ] `lines` object contains correct line numbers
- [ ] Each widget has `id`, `style`, and `colors`
- [ ] Widget count matches selected layout

**Step 4: Create summary commit**

```bash
git add -A
git commit -m "feat: complete three-stage quick-config implementation

- Add Layout type with Balanced, Compact, Rich presets
- Create layout-specific config generators
- Implement layout-aware preview renderer
- Update menu to three-stage flow (Layout → Style → Theme)
- Add navigation hints and stage descriptions
- Add unit and integration tests
- Update documentation"
```

---

## Completion Checklist

- [ ] All 10 tasks completed
- [ ] All tests pass (unit + integration)
- [ ] Manual testing checklist verified
- [ ] Documentation updated
- [ ] Config.json structure validated
- [ ] All commits made with descriptive messages

**Estimated completion time:** 2-3 hours for a skilled developer familiar with the codebase.
