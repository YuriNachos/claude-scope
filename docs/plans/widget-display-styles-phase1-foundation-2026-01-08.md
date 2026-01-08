# Widget Display Styles System — Phase 1: Foundation (Detailed)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement core infrastructure for the widget display style system using Strategy Pattern

**Architecture:**
- Create `WidgetStyle` type union with 11 style variants
- Create `StyleRenderer<T>` strategy interface for pluggable renderers
- Extend `IWidget` interface with optional `setStyle()` method
- All changes are additive, no breaking changes to existing widgets

**Tech Stack:** TypeScript, Node.js native modules (no runtime dependencies), TAP tests

**Reference Documents:**
- Design: `docs/plans/widget-display-styles-design-2026-01-08.md`
- Style Reference: `docs/plans/widget-styles-reference-2026-01-08.md`

---

## Task 1: Create WidgetStyle type and related types

**Files:**
- Create: `src/core/style-types.ts`
- Test: `tests/unit/core/style-types.test.ts`

### Step 1: Write the failing test

Create `tests/unit/core/style-types.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert";
import {
  type WidgetStyle,
  DEFAULT_WIDGET_STYLE,
  getDefaultStyleConfig,
  isValidWidgetStyle,
  type WidgetStyleConfig,
  type StyleConfig,
} from "../../../src/core/style-types.js";

describe("style-types", () => {
  describe("WidgetStyle type", () => {
    it("should accept valid style strings", () => {
      const validStyles: WidgetStyle[] = [
        "balanced",
        "compact",
        "playful",
        "verbose",
        "technical",
        "symbolic",
        "monochrome",
        "compact-verbose",
        "labeled",
        "indicator",
        "fancy",
      ];
      assert.equal(validStyles.length, 11);
    });

    it("should have balanced as default style", () => {
      assert.equal(DEFAULT_WIDGET_STYLE, "balanced");
    });
  });

  describe("getDefaultStyleConfig", () => {
    it("should return config with default style when no argument", () => {
      const config = getDefaultStyleConfig();
      assert.deepEqual(config, { style: "balanced" });
    });

    it("should return config with specified style", () => {
      const config = getDefaultStyleConfig("compact");
      assert.deepEqual(config, { style: "compact" });
    });
  });

  describe("isValidWidgetStyle", () => {
    it("should return true for valid styles", () => {
      assert.equal(isValidWidgetStyle("balanced"), true);
      assert.equal(isValidWidgetStyle("compact"), true);
      assert.equal(isValidWidgetStyle("fancy"), true);
    });

    it("should return false for invalid styles", () => {
      assert.equal(isValidWidgetStyle("invalid"), false);
      assert.equal(isValidWidgetStyle("BALANCED"), false); // case sensitive
      assert.equal(isValidWidgetStyle(""), false);
    });

    it("should type-narrow correctly", () => {
      const value = "compact" as string;
      if (isValidWidgetStyle(value)) {
        // value is now typed as WidgetStyle
        assert.equal(value, "compact");
      }
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/core/style-types.test.ts
```

Expected: FAIL with "Cannot find package '../../../src/core/style-types.js'"

---

### Step 3: Write minimal implementation

Create `src/core/style-types.ts`:

```typescript
/**
 * Core types for the widget display style system
 *
 * Defines the style type union and configuration interfaces
 * for the widget display style system.
 */

/**
 * Available widget display styles
 *
 * - balanced: Balance between minimalism and informativeness, no emojis
 * - compact: Maximally compact, minimal text
 * - playful: With informative emojis
 * - verbose: Maximum information, detailed format
 * - technical: Raw data, technical format
 * - symbolic: Unicode symbols instead of emojis
 * - monochrome: No color codes (same output as balanced, no colors)
 * - compact-verbose: Hybrid: compact format with additional info in parentheses
 * - labeled: With text prefix/label
 * - indicator: With status indicator (●)
 * - fancy: Decorative elements: frames, brackets, separators
 */
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

/**
 * Default style for all widgets
 */
export const DEFAULT_WIDGET_STYLE: WidgetStyle = "balanced";

/**
 * Widget style configuration
 */
export interface WidgetStyleConfig {
  style: WidgetStyle;
}

/**
 * Map of widget IDs to their style configurations
 */
export interface StyleConfig {
  [widgetId: string]: WidgetStyleConfig;
}

/**
 * Get the default style configuration for a widget
 */
export function getDefaultStyleConfig(
  style: WidgetStyle = DEFAULT_WIDGET_STYLE
): WidgetStyleConfig {
  return { style };
}

/**
 * Validate if a string is a valid WidgetStyle
 */
export function isValidWidgetStyle(value: string): value is WidgetStyle {
  return [
    "balanced",
    "compact",
    "playful",
    "verbose",
    "technical",
    "symbolic",
    "monochrome",
    "compact-verbose",
    "labeled",
    "indicator",
    "fancy",
  ].includes(value);
}
```

---

### Step 4: Run test to verify it passes

```bash
npm test -- tests/unit/core/style-types.test.ts
```

Expected: PASS (all 9 tests pass)

---

### Step 5: Format code with Biome

```bash
npx @biomejs/biome format --write ./src/core/style-types.ts ./tests/unit/core/style-types.test.ts
```

Expected: "Formatted 2 files in Xms"

---

### Step 6: Commit

```bash
git add src/core/style-types.ts tests/unit/core/style-types.test.ts
git commit -m "feat: add core style types for widget display system"
```

---

## Task 2: Create StyleRenderer strategy interface

**Files:**
- Create: `src/core/style-renderer.ts`
- Test: `tests/unit/core/style-renderer.test.ts`

### Step 1: Write the failing test

Create `tests/unit/core/style-renderer.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert";
import {
  type StyleRenderer,
  BaseStyleRenderer,
  type RenderData,
} from "../../../src/core/style-renderer.js";

describe("style-renderer", () => {
  describe("StyleRenderer interface", () => {
    it("should define render method signature", () => {
      // Type check - this should compile
      const renderer: StyleRenderer<string> = {
        render: (data: string) => data.toUpperCase(),
      };
      assert.equal(renderer.render("hello"), "HELLO");
    });

    it("should work with generic types", () => {
      interface TestData {
        value: number;
      }
      const renderer: StyleRenderer<TestData> = {
        render: (data: TestData) => `Value: ${data.value}`,
      };
      assert.equal(renderer.render({ value: 42 }), "Value: 42");
    });
  });

  describe("BaseStyleRenderer abstract class", () => {
    it("should require render implementation", () => {
      // This should compile - concrete implementation
      class ConcreteRenderer extends BaseStyleRenderer<string> {
        render(data: string): string {
          return data;
        }
      }

      const renderer = new ConcreteRenderer();
      assert.equal(renderer.render("test"), "test");
    });

    it("should allow custom render logic", () => {
      class UppercaseRenderer extends BaseStyleRenderer<string> {
        render(data: string): string {
          return data.toUpperCase();
        }
      }

      const renderer = new UppercaseRenderer();
      assert.equal(renderer.render("hello"), "HELLO");
    });
  });

  describe("RenderData type", () => {
    it("should accept any data type", () => {
      const data: RenderData = { any: "data" };
      assert.equal(data.any, "data");
    });
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/core/style-renderer.test.ts
```

Expected: FAIL with "Cannot find package '../../../src/core/style-renderer.js'"

---

### Step 3: Write minimal implementation

Create `src/core/style-renderer.ts`:

```typescript
/**
 * StyleRenderer Strategy Interface
 *
 * Implements the Strategy Pattern for widget display styles.
 * Each style implementation provides a render() method that
 * formats widget data according to its style rules.
 */

/**
 * Base interface for all style renderers
 *
 * @template T - The type of data this renderer processes
 */
export interface StyleRenderer<T = any> {
  /**
   * Render the given data according to this style
   *
   * @param data - The data to render (widget-specific)
   * @returns Formatted string for display
   */
  render(data: T): string;
}

/**
 * Abstract base class for style renderers
 *
 * Provides a common base for all renderer implementations.
 * Subclasses must implement the render() method.
 *
 * @template T - The type of data this renderer processes
 */
export abstract class BaseStyleRenderer<T = any> implements StyleRenderer<T> {
  /**
   * Render the given data according to this style
   *
   * @param data - The data to render
   * @returns Formatted string for display
   */
  abstract render(data: T): string;
}

/**
 * Type for render data used by widgets
 *
 * Each widget defines its own RenderData interface with the
 * specific fields needed for rendering (e.g., model name,
 * token counts, cost values, etc.)
 */
export type RenderData = any;
```

---

### Step 4: Run test to verify it passes

```bash
npm test -- tests/unit/core/style-renderer.test.ts
```

Expected: PASS (all 6 tests pass)

---

### Step 5: Format code with Biome

```bash
npx @biomejs/biome format --write ./src/core/style-renderer.ts ./tests/unit/core/style-renderer.test.ts
```

Expected: "Formatted 2 files in Xms"

---

### Step 6: Commit

```bash
git add src/core/style-renderer.ts tests/unit/core/style-renderer.test.ts
git commit -m "feat: add StyleRenderer strategy interface"
```

---

## Task 3: Extend IWidget interface with setStyle method

**Files:**
- Modify: `src/core/types.ts` (add import and method)
- Test: `tests/unit/core/types.test.ts` (verify interface extension)

### Step 1: Write test for setStyle method on a widget

Create `tests/unit/core/widget-style-extension.test.ts`:

```typescript
import { describe, it } from "node:test";
import assert from "node:assert";
import type { IWidget } from "../../../src/core/types.js";
import type { WidgetStyle } from "../../../src/core/style-types.js";

describe("IWidget setStyle extension", () => {
  it("should allow optional setStyle method on widget", () => {
    // Create a mock widget that implements setStyle
    const mockWidget: IWidget = {
      id: "test-widget",
      metadata: {
        name: "Test Widget",
        description: "A test widget",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "test output",
      update: async () => {},
      isEnabled: () => true,
      setStyle: (style: WidgetStyle) => {
        // Store style for testing
        (mockWidget as any).currentStyle = style;
      },
    };

    // Should not throw - setStyle is optional but present
    mockWidget.setStyle!("compact");
    assert.equal((mockWidget as any).currentStyle, "compact");
  });

  it("should work without setStyle method", () => {
    // Widget without setStyle should still be valid
    const minimalWidget: IWidget = {
      id: "minimal-widget",
      metadata: {
        name: "Minimal Widget",
        description: "A minimal test widget",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "minimal output",
      update: async () => {},
      isEnabled: () => true,
    };

    // Should not throw - setStyle is optional
    assert.equal(minimalWidget.isEnabled(), true);
  });

  it("should accept all WidgetStyle values", () => {
    const styles: WidgetStyle[] = [
      "balanced",
      "compact",
      "playful",
      "verbose",
      "technical",
      "symbolic",
      "monochrome",
      "compact-verbose",
      "labeled",
      "indicator",
      "fancy",
    ];

    const widget: IWidget = {
      id: "style-test-widget",
      metadata: {
        name: "Style Test Widget",
        description: "Tests all styles",
        version: "1.0.0",
        author: "test",
      },
      initialize: async () => {},
      render: async () => "output",
      update: async () => {},
      isEnabled: () => true,
      setStyle: (style: WidgetStyle) => {
        (widget as any).lastStyle = style;
      },
    };

    for (const style of styles) {
      widget.setStyle!(style);
      assert.equal((widget as any).lastStyle, style);
    }
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test -- tests/unit/core/widget-style-extension.test.ts
```

Expected: FAIL (or tests may pass if interface already has setStyle - check current state)

---

### Step 3: Modify IWidget interface

Read current `src/core/types.ts` and check if `setStyle` exists. If not, add it:

```typescript
/**
 * Core types for the widget system
 */

import type { StdinData, RenderContext } from "../types.js";
import type { WidgetStyle } from "./style-types.js";
// ... rest of file
```

Add to `IWidget` interface before closing brace:

```typescript
  /**
   * Set the display style for this widget
   * Optional - widgets that support multiple styles implement this
   *
   * @param style - The style to apply for rendering
   */
  setStyle?(style: WidgetStyle): void;
}
```

Full modified section should be:

```typescript
  /**
   * Cleanup resources
   * Optional - called when widget is unregistered
   */
  cleanup?(): Promise<void>;

  /**
   * Set the display style for this widget
   * Optional - widgets that support multiple styles implement this
   *
   * @param style - The style to apply for rendering
   */
  setStyle?(style: WidgetStyle): void;
}
```

---

### Step 4: Run test to verify it passes

```bash
npm test -- tests/unit/core/widget-style-extension.test.ts
```

Expected: PASS (all 3 tests pass)

---

### Step 5: Run all tests to ensure no breakage

```bash
npm test
```

Expected: All existing tests still pass (298+ tests)

---

### Step 6: Format code with Biome

```bash
npx @biomejs/biome format --write ./src/core/types.ts ./tests/unit/core/widget-style-extension.test.ts
```

Expected: "Formatted 2 files in Xms"

---

### Step 7: Commit

```bash
git add src/core/types.ts tests/unit/core/widget-style-extension.test.ts
git commit -m "feat: extend IWidget interface with setStyle method"
```

---

## Phase 1 Completion Checklist

After completing Tasks 1-3:

- [ ] All new tests pass
- [ ] All existing tests still pass
- [ ] Code is formatted with Biome
- [ ] 3 atomic commits made
- [ ] Files created:
  - [ ] `src/core/style-types.ts`
  - [ ] `src/core/style-renderer.ts`
  - [ ] `tests/unit/core/style-types.test.ts`
  - [ ] `tests/unit/core/style-renderer.test.ts`
  - [ ] `tests/unit/core/widget-style-extension.test.ts`
- [ ] Files modified:
  - [ ] `src/core/types.ts`

**Total commits for Phase 1:** 3

---

## Next Phase Preview

Phase 2 will create style utility functions in `src/ui/utils/style-utils.ts`:
- `withLabel(prefix, value)`
- `withIndicator(value)`
- `withFancy(value)`
- `withBrackets(value)`
- `withAngleBrackets(value)`
- `formatTokens(n)`
- `progressBar(percent, width)`
