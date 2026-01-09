/**
 * Active tools widget styles
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { ActiveToolsRenderData, ActiveToolsStyle } from "./types.js";

/**
 * Truncate path to show only filename with ... prefix
 * @param path - File path to truncate
 * @returns Truncated path with .../filename format
 */
function truncatePath(path: string): string {
  if (path.length <= 30) {
    return path;
  }
  const parts = path.split("/");
  return `.../${parts[parts.length - 1]}`;
}

/**
 * Format tool name with optional target
 * @param name - Tool name (Read, Edit, etc.)
 * @param target - Optional target (file path, pattern, command)
 * @param colors - Theme colors
 * @returns Formatted tool string
 */
function formatTool(name: string, target: string | undefined, colors: IThemeColors): string {
  const nameStr = colorize(name, colors.tools.name);
  if (target) {
    const targetStr = colorize(`: ${truncatePath(target)}`, colors.tools.target);
    return `${nameStr}${targetStr}`;
  }
  return nameStr;
}

/**
 * Style implementations for active tools display
 */
export const activeToolsStyles: StyleMap<ActiveToolsRenderData, IThemeColors> = {
  /**
   * balanced: Running tools with ◐ spinner, completed aggregated with ✓ ×count
   */
  balanced: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const parts: string[] = [];

    // Show running tools with spinner (last 2)
    for (const tool of data.running.slice(-2)) {
      const indicator = colors ? colorize("◐", colors.tools.running) : "◐";
      parts.push(
        `${indicator} ${formatTool(tool.name, tool.target, colors ?? getDefaultColors())}`
      );
    }

    // Show completed tools aggregated (top 4 by count)
    const sorted = Array.from(data.completed.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    for (const [name, count] of sorted) {
      const check = colors ? colorize("✓", colors.tools.completed) : "✓";
      const countStr = colors ? colorize(`×${count}`, colors.tools.count) : `×${count}`;
      parts.push(`${check} ${name} ${countStr}`);
    }

    if (parts.length === 0) {
      return "";
    }
    return parts.join(" | ");
  },

  /**
   * compact: [ToolName] format for all tools
   */
  compact: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const parts: string[] = [];
    const c = colors ?? getDefaultColors();

    for (const tool of data.running) {
      parts.push(`[${colorize(tool.name, c.tools.name)}]`);
    }

    for (const [name] of Array.from(data.completed.entries()).slice(0, 3)) {
      parts.push(`[${colorize(name, c.tools.completed)}]`);
    }

    if (parts.length === 0) {
      return "";
    }
    return parts.join(" ");
  },

  /**
   * minimal: Same as compact
   */
  minimal: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const compactStyle = activeToolsStyles.compact;
    if (!compactStyle) return "";
    return compactStyle(data, colors);
  },

  /**
   * playful: Emojis (📖✏️✨🔄🔍📁) with tool names
   */
  playful: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const parts: string[] = [];
    const emojis: Record<string, string> = {
      Read: "📖",
      Write: "✏️",
      Edit: "✨",
      Bash: "🔄",
      Grep: "🔍",
      Glob: "📁",
    };

    for (const tool of data.running.slice(-3)) {
      const emoji = emojis[tool.name] ?? "🔧";
      const nameStr = colors ? colorize(tool.name, colors.tools.name) : tool.name;
      parts.push(`${emoji} ${nameStr}`);
    }

    if (parts.length === 0) {
      return "";
    }
    return parts.join(", ");
  },

  /**
   * verbose: Full text labels "Running:" and "Completed:"
   */
  verbose: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const parts: string[] = [];
    const c = colors ?? getDefaultColors();

    for (const tool of data.running) {
      const label = colorize("Running:", c.tools.running);
      parts.push(`${label} ${formatTool(tool.name, tool.target, c)}`);
    }

    const sorted = Array.from(data.completed.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    for (const [name, count] of sorted) {
      const label = colorize("Completed:", c.tools.completed);
      const countStr = colorize(`(${count}x)`, c.tools.count);
      parts.push(`${label} ${name} ${countStr}`);
    }

    if (parts.length === 0) {
      return "";
    }
    return parts.join(" | ");
  },

  /**
   * labeled: "Tools:" prefix with all tools
   */
  labeled: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const c = colors ?? getDefaultColors();

    const allTools = [
      ...data.running.map((t) => {
        const indicator = colorize("◐", c.tools.running);
        return `${indicator} ${formatTool(t.name, t.target, c)}`;
      }),
      ...Array.from(data.completed.entries())
        .slice(0, 3)
        .map(([name, count]) => {
          const indicator = colorize("✓", c.tools.completed);
          const countStr = colorize(`×${count}`, c.tools.count);
          return `${indicator} ${name} ${countStr}`;
        }),
    ];

    if (allTools.length === 0) {
      return "";
    }

    const prefix = colors ? colorize("Tools:", c.semantic.info) : "Tools:";
    return `${prefix}: ${allTools.join(" | ")}`;
  },

  /**
   * indicator: ● bullet indicators
   */
  indicator: (data: ActiveToolsRenderData, colors?: IThemeColors) => {
    const parts: string[] = [];
    const c = colors ?? getDefaultColors();

    for (const tool of data.running) {
      const bullet = colorize("●", c.semantic.info);
      parts.push(`${bullet} ${formatTool(tool.name, tool.target, c)}`);
    }

    for (const [name] of Array.from(data.completed.entries()).slice(0, 3)) {
      const bullet = colorize("●", c.tools.completed);
      parts.push(`${bullet} ${name}`);
    }

    if (parts.length === 0) {
      return "";
    }
    return parts.join(" | ");
  },
};

/**
 * Get default colors (fallback when colors not provided)
 * Uses basic ANSI colors
 */
function getDefaultColors(): IThemeColors {
  return {
    base: {
      text: "\x1b[37m",
      muted: "\x1b[90m",
      accent: "\x1b[36m",
      border: "\x1b[90m",
    },
    semantic: {
      success: "\x1b[32m",
      warning: "\x1b[33m",
      error: "\x1b[31m",
      info: "\x1b[36m",
    },
    git: {
      branch: "\x1b[36m",
      changes: "\x1b[33m",
    },
    context: {
      low: "\x1b[32m",
      medium: "\x1b[33m",
      high: "\x1b[31m",
      bar: "\x1b[37m",
    },
    lines: {
      added: "\x1b[32m",
      removed: "\x1b[31m",
    },
    cost: {
      amount: "\x1b[37m",
      currency: "\x1b[90m",
    },
    duration: {
      value: "\x1b[37m",
      unit: "\x1b[90m",
    },
    model: {
      name: "\x1b[36m",
      version: "\x1b[90m",
    },
    poker: {
      participating: "\x1b[37m",
      nonParticipating: "\x1b[90m",
      result: "\x1b[36m",
    },
    cache: {
      high: "\x1b[32m",
      medium: "\x1b[33m",
      low: "\x1b[31m",
      read: "\x1b[34m",
      write: "\x1b[35m",
    },
    tools: {
      running: "\x1b[33m",
      completed: "\x1b[32m",
      error: "\x1b[31m",
      name: "\x1b[34m",
      target: "\x1b[90m",
      count: "\x1b[35m",
    },
  };
}

/**
 * Get the default style for active tools
 */
export function getDefaultActiveToolsStyle(): ActiveToolsStyle {
  return "balanced";
}

/**
 * Get all available active tools styles
 */
export function getActiveToolsStyles(): ActiveToolsStyle[] {
  return ["balanced", "compact", "minimal", "playful", "verbose", "labeled", "indicator"];
}

/**
 * Validate if a string is a valid active tools style
 */
export function isValidActiveToolsStyle(style: string): style is ActiveToolsStyle {
  return getActiveToolsStyles().includes(style as ActiveToolsStyle);
}
