# Widget Display Styles System — Design Document

**Date:** 2026-01-08
**Author:** Claude Scope Team
**Status:** Approved

## Overview

This document defines the display style system for all widgets in claude-scope. Each widget supports multiple display styles using the Strategy Pattern, allowing users to customize how information is presented.

## Architecture

### Pattern: Strategy Pattern

Each widget has a `WidgetRenderer` strategy interface with multiple implementations:

```typescript
interface WidgetRenderer {
  render(data: RenderData): string;
}

class ModelWidget {
  private renderer: WidgetRenderer;

  setRenderer(renderer: WidgetRenderer): void {
    this.renderer = renderer;
  }
}
```

### Available Styles

| Style | Description |
|-------|-------------|
| **balanced** | Balance between minimalism and informativeness, no emojis |
| **compact** | Maximally compact, minimal text |
| **playful** | With informative emojis |
| **verbose** | Maximum information, detailed format |
| **technical** | Raw data, technical format |
| **symbolic** | Unicode symbols instead of emojis |
| **monochrome** | No color codes (same output as balanced, no colors) |
| **compact-verbose** | Hybrid: compact format with additional info in parentheses |
| **labeled** | With text prefix/label |
| **indicator** | With status indicator (●) |
| **fancy** | Decorative elements: frames, brackets, separators |

### Configuration

Styles are configured per-widget in config:

```json
{
  "widgets": {
    "model": { "style": "balanced" },
    "context": { "style": "playful" },
    "cost": { "style": "compact" }
  }
}
```

---

## Widget Style Specifications

### 1. ModelWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `Claude Opus 4.5` |
| **compact** | `Opus 4.5` |
| **playful** | `🤖 Opus 4.5` |
| **technical** | `claude-opus-4-5-20251101` |
| **symbolic** | `◆ Opus 4.5` |
| **labeled** | `Model: Opus 4.5` |
| **indicator** | `● Opus 4.5` |
| **fancy** | `[Opus 4.5]` |

**Total: 8 styles**

---

### 2. ContextWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `[████░░░] 71%` |
| **compact** | `71%` |
| **playful** | `🧠 [████░░░] 71%` |
| **verbose** | `142,847 / 200,000 tokens (71%)` |
| **symbolic** | `▮▮▮▮▯ 71%` |
| **compact-verbose** | `71% (142K/200K)` |
| **indicator** | `● 71%` |
| **fancy** | `⟨71%⟩` |

**Total: 8 styles**

---

### 3. CostWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `$0.00` (always 2 decimal places) |
| **compact** | `$0.00` |
| **playful** | `💰 $0.00` |
| **labeled** | `Cost: $0.00` |
| **indicator** | `● $0.00` |
| **fancy** | `«$0.00»` |

**Total: 6 styles**

**Note:** `formatCostUSD()` must be refactored to always use 2 decimal places.

---

### 4. DurationWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `1h 1m 5s` |
| **compact** | `1h1m` |
| **playful** | `⌛ 1h 1m` |
| **technical** | `3665000ms` |
| **labeled** | `Time: 1h 1m 5s` |
| **indicator** | `● 1h 1m 5s` |
| **fancy** | `⟨1h 1m 5s⟩` |

**Total: 7 styles**

---

### 5. GitWidget (branch)

| Style | Output Example |
|-------|----------------|
| **balanced** | `main` |
| **compact** | `main` |
| **playful** | `🔀 main` |
| **verbose** | `branch: main (HEAD)` |
| **indicator** | `● main` |
| **labeled** | `Git: main` |
| **fancy** | `[main]` |

**Total: 7 styles**

---

### 6. GitChangesWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `+142 -27` |
| **compact** | `+142/-27` |
| **playful** | `⬆142 ⬇27` |
| **verbose** | `+142 insertions, -27 deletions` |
| **technical** | `142/27` |
| **symbolic** | `▲142 ▼27` |
| **labeled** | `Diff: +142 -27` |
| **indicator** | `● +142 -27` |
| **fancy** | `⟨+142|-27⟩` |

**Total: 9 styles**

---

### 7. GitTagWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `v0.5.4` |
| **compact** | `0.5.4` |
| **playful** | `🏷️ v0.5.4` |
| **verbose** | `version v0.5.4` |
| **labeled** | `Tag: v0.5.4` |
| **indicator** | `● v0.5.4` |
| **fancy** | `⟨v0.5.4⟩` |

**Total: 7 styles**

---

### 8. LinesWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `+142/-27` |
| **compact** | `+142-27` |
| **playful** | `➕142 ➖27` |
| **verbose** | `+142 added, -27 removed` |
| **labeled** | `Lines: +142/-27` |
| **indicator** | `● +142/-27` |
| **fancy** | `⟨+142|-27⟩` |

**Total: 7 styles**

---

### 9. ConfigCountWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `CLAUDE.md:2 │ rules:5 │ MCPs:3 │ hooks:1` |
| **compact** | `2 docs │ 5 rules │ 3 MCPs │ 1 hook` |
| **playful** | `📄 CLAUDE.md:2 │ 📜 rules:5 │ 🔌 MCPs:3 │ 🪝 hooks:1` |
| **verbose** | `2 CLAUDE.md │ 5 rules │ 3 MCP servers │ 1 hook` |

**Total: 4 styles**

---

### 10. PokerWidget

| Style | Output Example |
|-------|----------------|
| **balanced** | `Hand: (K♠) A♠ \| Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏` |
| **compact** | `Hand: (K♠) A♠ \| Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏` (same as balanced) |
| **playful** | `Hand: (K♠) A♠ \| Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏` (same as balanced) |
| **compact-verbose** | `(K♠)A♠ \| 2♠3♠4♠5♠6♠ → SF (Straight Flush)` |

**Total: 4 styles** (3 mandatory are identical)

**Note:** `(K♠)` indicates participating cards (bold + brackets), non-participating cards shown without brackets.

---

### 11. EmptyLineWidget

| Style | Output Example |
|-------|----------------|
| **All styles** | `⠀` (Braille Pattern Blank - visible empty separator) |

**Total: 1 unique style** (same for all)

---

## Implementation Notes

### Default Styles

All widgets default to `balanced` style unless configured otherwise.

### Color Handling

- **monochrome** style disables color codes (uses colors from theme but resets them)
- Other styles use existing theme colors
- Color logic remains in widget classes, renderers only format text

### Special Cases

1. **EmptyLineWidget**: All styles are identical (empty separator)
2. **PokerWidget**: All 3 mandatory styles are identical (current implementation)
3. **CostWidget**: Requires `formatCostUSD()` refactor to always use 2 decimal places
4. **GitChangesWidget**: Uses custom colors (added=green, removed=red) from theme

---

## Summary Table

| Widget | Total Styles | Unique Styles |
|--------|--------------|---------------|
| ModelWidget | 8 | 8 |
| ContextWidget | 8 | 8 |
| CostWidget | 6 | 6 |
| DurationWidget | 7 | 7 |
| GitWidget | 7 | 7 |
| GitChangesWidget | 9 | 9 |
| GitTagWidget | 7 | 7 |
| LinesWidget | 7 | 7 |
| ConfigCountWidget | 4 | 4 |
| PokerWidget | 4 | 2 (3 identical) |
| EmptyLineWidget | 11 | 1 (all identical) |
| **TOTAL** | **78** | **66** |
