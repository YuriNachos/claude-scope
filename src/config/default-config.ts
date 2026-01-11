/**
 * Default configuration for claude-scope
 * Represents current behavior (without Poker widget)
 */

import type { ScopeConfig } from "../cli/commands/quick-config/config-schema.js";
import { DUSTY_SAGE_THEME } from "../ui/theme/index.js";

/**
 * Convert RGB color object to ANSI escape sequence
 */
function rgbToAnsi(r: number, g: number, b: number): string {
  return `\u001b[38;2;${r};${g};${b}m`;
}

/**
 * Extract RGB values from ANSI escape sequence
 * ANSI format: \x1b[38;2;R;G;Bm or \u001b[38;2;R;G;Bm
 */
function extractRgbFromAnsi(ansiColor: string): { r: number; g: number; b: number } {
  // Match both \x1b and \u001b escape sequences
  const match = ansiColor.match(/\x1b\[38;2;(\d+);(\d+);(\d+)m/);
  if (!match) {
    // Return default gray if parsing fails
    return { r: 148, g: 163, b: 184 };
  }
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

/**
 * Generate default config using Dusty Sage theme
 */
export function generateDefaultConfig(): ScopeConfig {
  const theme = DUSTY_SAGE_THEME.colors;

  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style: "balanced",
          colors: {
            name: theme.model.name,
            version: theme.model.version,
          },
        },
        {
          id: "context",
          style: "balanced",
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar,
          },
        },
        {
          id: "cost",
          style: "balanced",
          colors: {
            amount: theme.cost.amount,
            currency: theme.cost.currency,
          },
        },
        {
          id: "lines",
          style: "balanced",
          colors: {
            added: theme.lines.added,
            removed: theme.lines.removed,
          },
        },
        {
          id: "duration",
          style: "balanced",
          colors: {
            value: theme.duration.value,
            unit: theme.duration.unit,
          },
        },
        {
          id: "git",
          style: "balanced",
          colors: {
            branch: theme.git.branch,
            changes: theme.git.changes,
          },
        },
      ],
      "1": [
        {
          id: "git-tag",
          style: "balanced",
          colors: {
            base: theme.base.text,
          },
        },
        {
          id: "config-count",
          style: "balanced",
          colors: {
            base: theme.base.muted,
          },
        },
      ],
      "2": [
        {
          id: "active-tools",
          style: "balanced",
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
          style: "balanced",
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
