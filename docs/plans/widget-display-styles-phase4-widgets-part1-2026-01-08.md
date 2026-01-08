# Widget Display Styles System — Phase 4.1: ModelWidget & ContextWidget (Detailed)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement style renderers for ModelWidget and ContextWidget

**Architecture:**
- Each widget gets its own `renderers/` subdirectory
- Style classes extend `BaseStyleRenderer<RenderDataType>`
- Widget's `setStyle()` method switches between renderers
- Default style is "balanced"

**Reference:**
- Style outputs: `docs/plans/widget-styles-reference-2026-01-08.md`
- Design: `docs/plans/widget-display-styles-design-2026-01-08.md`

---

## Widget 1: ModelWidget

**Styles to implement (8 total):**
1. balanced → `Claude Opus 4.5`
2. compact → `Opus 4.5`
3. playful → `🤖 Opus 4.5`
4. technical → `claude-opus-4-5-20251101`
5. symbolic → `◆ Opus 4.5`
6. labeled → `Model: Opus 4.5`
7. indicator → `● Opus 4.5`
8. fancy → `[Opus 4.5]`

### Task 1.1: Add renderer infrastructure to ModelWidget

**Files:**
- Modify: `src/widgets/model-widget.ts`
- Create: `src/widgets/model/renderers/`

**Implementation:**

1. Create `src/widgets/model/renderers/` directory

2. Create `src/widgets/model/renderers/types.ts`:
```typescript
import type { BaseStyleRenderer } from "../../../core/style-renderer.js";

export interface ModelRenderData {
  displayName: string;
  id: string;
}

export type ModelRenderer = BaseStyleRenderer<ModelRenderData>;
```

3. Modify `src/widgets/model-widget.ts`:
```typescript
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import type { WidgetStyle } from "../core/style-types.js";
import { ModelBalancedRenderer } from "./model/renderers/balanced.js";
import { ModelCompactRenderer } from "./model/renderers/compact.js";
import { ModelPlayfulRenderer } from "./model/renderers/playful.js";
// ... other renderers

export class ModelWidget extends StdinDataWidget {
  readonly id = "model";
  readonly metadata = createWidgetMetadata(
    "Model",
    "Displays the current Claude model name",
    "1.0.0",
    "claude-scope",
    0
  );

  private renderer = new ModelBalancedRenderer();

  setStyle(style: WidgetStyle): void {
    switch (style) {
      case "balanced":
        this.renderer = new ModelBalancedRenderer();
        break;
      case "compact":
        this.renderer = new ModelCompactRenderer();
        break;
      case "playful":
        this.renderer = new ModelPlayfulRenderer();
        break;
      case "technical":
        this.renderer = new ModelTechnicalRenderer();
        break;
      case "symbolic":
        this.renderer = new ModelSymbolicRenderer();
        break;
      case "labeled":
        this.renderer = new ModelLabeledRenderer();
        break;
      case "indicator":
        this.renderer = new ModelIndicatorRenderer();
        break;
      case "fancy":
        this.renderer = new ModelFancyRenderer();
        break;
      default:
        this.renderer = new ModelBalancedRenderer();
    }
  }

  protected renderWithData(data: StdinData, context: RenderContext): string | null {
    const renderData = {
      displayName: data.model.display_name,
      id: data.model.id,
    };
    return this.renderer.render(renderData);
  }
}
```

**Commit:** `feat(model): add style renderer infrastructure`

### Task 1.2: Implement balanced renderer

**File:** `src/widgets/model/renderers/balanced.ts`

```typescript
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ModelRenderData } from "./types.js";

export class ModelBalancedRenderer extends BaseStyleRenderer<ModelRenderData> {
  render(data: ModelRenderData): string {
    return data.displayName;
  }
}
```

**Test:** Add test for balanced renderer output

**Commit:** `feat(model): implement balanced style renderer`

### Task 1.3 - 1.8: Implement remaining renderers

Same pattern for:
- compact, playful, technical, symbolic, labeled, indicator, fancy

Each gets its own file and commit.

### Task 1.9: Add comprehensive tests

**File:** `tests/unit/widgets/model/model-styles.test.ts`

Test all 8 renderers with expected outputs from reference doc.

**Commit:** `test(model): add tests for all style renderers`

---

## Widget 2: ContextWidget

**Styles to implement (8 total):**
1. balanced → `[████░░░] 71%`
2. compact → `71%`
3. playful → `🧠 [████░░░] 71%`
4. verbose → `142,847 / 200,000 tokens (71%)`
5. symbolic → `▮▮▮▮▯ 71%`
6. compact-verbose → `71% (142K/200K)`
7. indicator → `● 71%`
8. fancy → `⟨71%⟩`

**Helper needed:** `progressBar()` from style-utils

Same structure as ModelWidget:
- Infrastructure commit
- 8 renderer commits (one per style)
- Test commit

---

## Implementation Notes

1. **Import paths** must use `.js` extension for ES modules
2. **Default style** is "balanced" — set in constructor
3. **Reusability** — utility functions from `style-utils.ts` where applicable
4. **Test isolation** — each renderer gets focused tests

---

## Progress Tracking

After completing ModelWidget and ContextWidget:
- 2 widgets fully implemented with styles
- ~18 commits
- Ready to continue with remaining widgets
