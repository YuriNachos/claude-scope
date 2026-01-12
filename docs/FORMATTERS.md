# FORMATTERS.md - UI Utilities Reference

## Overview

This document provides a comprehensive reference for all UI utilities and formatters in the Claude Scope project.

**Location**: `src/ui/utils/`

```
src/ui/utils/
├── formatters.ts     # Main data formatting utilities
└── colors.ts         # ANSI color system
```

---

## Formatters (`src/ui/utils/formatters.ts`)

### formatDuration(ms: number): string

Formats milliseconds into human-readable duration.

**Examples:**
```typescript
formatDuration(0)        // "0s"
formatDuration(45000)     // "45s"
formatDuration(60000)     // "1m 0s"
formatDuration(90000)     // "1m 30s"
formatDuration(3600000)   // "1h 0m 0s"
formatDuration(3665000)   // "1h 1m 5s"
```

**Behavior:**
- Returns "0s" for values ≤ 0
- Shows minutes and seconds for < 1 hour
- Shows hours, minutes, and seconds for ≥ 1 hour
- Space-separated format

---

### formatCostUSD(usd: number): string

Formats cost with 2 decimal places USD format.

**Examples:**
```typescript
formatCostUSD(0)           // "$0.00"
formatCostUSD(0.00999)     // "$0.01"
formatCostUSD(1.234)       // "$1.23"
formatCostUSD(12.5)        // "$12.50"
formatCostUSD(99.99)       // "$99.99"
```

**Always formats with exactly 2 decimal places.**

---

### formatK(n: number): string

Formats numbers with K suffix for thousands.

**Examples:**
```typescript
formatK(0)        // "0"
formatK(999)      // "999"
formatK(1000)     // "1.0k"
formatK(1500)     // "1.5k"
formatK(10000)    // "10k"
formatK(140000)   // "140k"
formatK(-1000)    // "-1.0k"
```

**Behavior:**
- Values < 1000: returned as string
- Values 1k-10k: shown with 1 decimal place
- Values ≥ 10k: rounded to whole number
- Handles negative numbers

---

### progressBar(percent: number, width?: number): string

Creates visual progress bars using Unicode block characters.

**Parameters:**
- `percent`: Percentage (0-100, automatically clamped)
- `width`: Bar width in characters (default: 20)

**Examples:**
```typescript
progressBar(0, 20)    // "░░░░░░░░░░░░░░░░░░░░"
progressBar(50, 20)   // "██████████░░░░░░░░░░"
progressBar(100, 20)  // "████████████████████"
progressBar(25, 10)   // "█████░░░░░"
```

Uses `█` (filled) and `░` (empty) Unicode characters.

---

### getContextColor(percent: number): string

Returns ANSI color code based on context usage percentage.

**Thresholds:**
- < 50%: Green (`\x1b[32m`) - low usage
- 50-79%: Yellow (`\x1b[33m`) - medium usage
- ≥ 80%: Red (`\x1b[31m`) - high usage

**Examples:**
```typescript
getContextColor(25)  // "\x1b[32m" (green)
getContextColor(50)  // "\x1b[33m" (yellow)
getContextColor(80)  // "\x1b[31m" (red)
getContextColor(100) // "\x1b[31m" (red)
```

---

### colorize(text: string, color: string): string

Wraps text with ANSI color codes.

**Examples:**
```typescript
colorize("Hello", "\x1b[32m")  // "\x1b[32mHello\x1b[0m"
colorize("Error", "\x1b[31m")  // "\x1b[31mError\x1b[0m"
```

Appends reset code (`\x1b[0m`) to restore default colors.

---

## ANSI Color System (`src/ui/utils/colors.ts`)

### Basic Colors

```typescript
export const red = "\x1b[31m";
export const green = "\x1b[32m";
export const yellow = "\x1b[33m";
export const blue = "\x1b[34m";
export const magenta = "\x1b[35m";
export const cyan = "\x1b[36m";
export const white = "\x1b[37m";
export const gray = "\x1b[90m";

// Reset
export const reset = "\x1b[0m";
```

### Context Colors

```typescript
export const contextColors = {
  low: green,     // <50% usage
  medium: yellow, // 50-79% usage
  high: red,      // >=80% usage
} as const;
```

---

## Widget Base Class

### StdinDataWidget

Abstract base class for widgets that receive `StdinData`.

**Methods:**
```typescript
abstract class StdinDataWidget implements IWidget {
  protected data: StdinData | null = null;
  protected enabled = true;

  // Abstract - must be implemented by subclasses
  protected abstract renderWithData(data: StdinData, context: RenderContext): string | null;

  // Provided by base class
  async initialize(context: WidgetContext): Promise<void>
  async update(data: StdinData): Promise<void>
  isEnabled(): boolean
  async render(context: RenderContext): Promise<string | null>
}
```

**Template Method Pattern:**
1. `render()` handles null checks
2. Subclasses implement `renderWithData()` with guaranteed non-null data

---

## Usage Patterns

### Import Patterns

```typescript
// Import from main formatters
import {
  formatDuration,
  formatCostUSD,
  formatK,
  progressBar,
  getContextColor,
  colorize
} from "../../ui/utils/formatters.js";

// Import from colors
import { colorize, red, green, yellow } from "../../ui/utils/colors.js";
```

### Consistent Formatting

```typescript
// Duration - always use formatDuration()
const formatted = formatDuration(data.durationMs);

// Cost - always use formatCostUSD()
const cost = formatCostUSD(data.costUsd);

// Large numbers - use formatK()
const tokens = formatK(cacheReadTokens);

// Progress bars - use progressBar()
const bar = progressBar(data.percent, 15);

// Dynamic coloring - use getContextColor()
const color = getContextColor(data.percent);
const coloredText = colorize(text, color);
```

---

## Code Examples from the Codebase

### Context Widget

```typescript
import { colorize } from "../../ui/utils/colors.js";
import { progressBar, getContextColor } from "../../ui/utils/formatters.js";

const bar = progressBar(data.percent, 10);
const color = getContextColor(data.percent);
const coloredBar = colorize(`[${bar}] ${data.percent}%`, color);
```

### Duration Widget

```typescript
import { colorize } from "../../ui/utils/colors.js";
import { formatDuration } from "../../ui/utils/formatters.js";

const formatted = formatDuration(data.durationMs);
return colorize(formatted, colors.value);
```

### Cost Widget

```typescript
import { colorize } from "../../ui/utils/colors.js";
import { formatCostUSD } from "../../ui/utils/formatters.js";

const formatted = formatCostUSD(data.costUsd);
return colorize("$", colors.currency) + colorize(formatted, colors.amount);
```

### Cache Metrics Widget

```typescript
import { formatK } from "../../ui/utils/formatters.js";

const amount = formatK(cacheRead);
return `${amount} cache`;
```
