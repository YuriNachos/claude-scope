# Color Theme System Architecture

## Overview

Design document for the unified color theme system that works with the widget style system.

**Status**: Approved
**Date**: 2025-01-08
**Version**: 1.0

## Requirements

1. **Style = Format, Theme = Colors**: Widget styles determine output format, themes determine colors
2. **Unified Interface**: All widgets use `IThemeColors` interface
3. **Semantic Colors**: State-based colors (low/medium/high, etc.) are part of each theme
4. **Widget Exceptions**: Some widgets (Poker) have semantic coloring independent of theme
5. **No Backward Compatibility**: Clean migration, no legacy support

## Architecture

### IThemeColors Interface

```typescript
interface IThemeColors {
  // Base colors (reused everywhere)
  base: {
    text: string;        // Primary text
    muted: string;       // Secondary text
    accent: string;      // Accent color
    border: string;      // Separators
  };

  // Semantic colors (states)
  semantic: {
    success: string;     // Success, low usage
    warning: string;     // Warning, medium usage
    error: string;       // Error, high usage
    info: string;        // Information
  };

  // Per-widget sections
  git: {
    branch: string;
    changes: string;
  };

  context: {
    low: string;
    medium: string;
    high: string;
    bar: string;
  };

  lines: {
    added: string;
    removed: string;
  };

  cost: {
    amount: string;
    currency: string;
  };

  duration: {
    value: string;
    unit: string;
  };

  model: {
    name: string;
    version: string;
  };

  poker: {
    participating: string;
    nonParticipating: string;
    result: string;
  };
  // Note: Card suit colors (red/gray) are semantic, not theme-controlled
}
```

### Updated StyleRendererFn Signature

```typescript
// Before:
type StyleRendererFn<T> = (data: T) => string;

// After:
type StyleRendererFn<T, C = any> = (data: T, colors: C) => string;
```

### Widget Constructor Pattern

```typescript
class Widget extends StdinDataWidget {
  private colors: IThemeColors;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  async render(context: RenderContext): Promise<string | null> {
    const renderData = { /* ... */ };
    const styleFn = this.styleFn as (data: RenderData, colors: WidgetColors) => string;
    return styleFn(renderData, this.colors.widget);
  }
}
```

### Theme Structure

```typescript
interface ITheme {
  name: string;
  description: string;
  colors: IThemeColors;
}

const AVAILABLE_THEMES: ITheme[] = [
  GRAY_THEME,
  DARK_THEME,
  LIGHT_THEME,
];
```

### Semantic vs Theme Colors

**Theme-controlled**:
- Widget-level display colors
- State colors (low/medium/high, added/removed)
- UI accents

**Semantic (not theme-controlled)**:
- Poker card suit colors (red ♥♦ / gray ♠♣) - game logic, not decoration

## Migration Strategy

1. Create new `IThemeColors` type and theme structure
2. Create theme files (gray, dark, light)
3. Migrate widgets one by one
4. Update all tests
5. Update entry point

No backward compatibility - clean break.
