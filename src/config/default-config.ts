/**
 * Default configuration for claude-scope
 * Represents current behavior (without Poker widget)
 */

import type { QuickConfigStyle, ScopeConfig } from "../cli/commands/quick-config/config-schema.js";
import { getThemeByName } from "../ui/theme/index.js";

/**
 * Generate default config using Dusty Sage theme
 * @deprecated Use generateConfigWithStyleAndTheme instead
 */
export function generateDefaultConfig(): ScopeConfig {
  return generateConfigWithStyleAndTheme("balanced", "dusty-sage");
}

/**
 * Generate config with specified style and theme
 * @param style - Display style (balanced, playful, compact)
 * @param themeName - Theme name (e.g., "monokai", "nord", "dracula")
 * @returns Config object
 */
export function generateConfigWithStyleAndTheme(
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
          colors: {
            name: theme.model.name,
            version: theme.model.version,
          },
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
          id: "cost",
          style: style,
          colors: {
            amount: theme.cost.amount,
            currency: theme.cost.currency,
          },
        },
        {
          id: "lines",
          style: style,
          colors: {
            added: theme.lines.added,
            removed: theme.lines.removed,
          },
        },
        {
          id: "duration",
          style: style,
          colors: {
            value: theme.duration.value,
            unit: theme.duration.unit,
          },
        },
        {
          id: "git",
          style: style,
          colors: {
            branch: theme.git.branch,
            changes: theme.git.changes,
          },
        },
      ],
      "1": [
        {
          id: "git-tag",
          style: style,
          colors: {
            base: theme.base.text,
          },
        },
        {
          id: "config-count",
          style: style,
          colors: {
            base: theme.base.muted,
          },
        },
      ],
      "2": [
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
      ],
    },
  };
}

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

/**
 * Generate Compact layout configuration (1 line)
 * Line 0: model, context, cost, git, duration
 */
export function generateCompactLayout(style: QuickConfigStyle, themeName: string): ScopeConfig {
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

/**
 * Generate Rich layout configuration (3 lines)
 * Line 0: model, context, cost, lines, duration
 * Line 1: git, git-tag, active-tools
 * Line 2: cache-metrics, config-count
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
          id: "cost",
          style: style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency },
        },
        {
          id: "lines",
          style: style,
          colors: { added: theme.lines.added, removed: theme.lines.removed },
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
      "2": [
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
