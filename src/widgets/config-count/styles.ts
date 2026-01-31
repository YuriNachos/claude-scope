/**
 * Functional style renderers for ConfigCountWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IConfigCountColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { ConfigCountStyleRenderData } from "./types.js";

export const configCountStyles: StyleMap<ConfigCountStyleRenderData, IConfigCountColors> = {
  balanced: (data: ConfigCountStyleRenderData, colors?: IConfigCountColors) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      const label = colors ? colorize("CLAUDE.md", colors.label) : "CLAUDE.md";
      parts.push(`${label}:${claudeMdCount}`);
    }

    if (rulesCount > 0) {
      const label = colors ? colorize("rules", colors.label) : "rules";
      parts.push(`${label}:${rulesCount}`);
    }

    if (mcpCount > 0) {
      const label = colors ? colorize("MCPs", colors.label) : "MCPs";
      parts.push(`${label}:${mcpCount}`);
    }

    if (hooksCount > 0) {
      const label = colors ? colorize("hooks", colors.label) : "hooks";
      parts.push(`${label}:${hooksCount}`);
    }

    const sep = colors ? colorize(" │ ", colors.separator) : " │ ";
    return parts.join(sep);
  },

  compact: (data: ConfigCountStyleRenderData, colors?: IConfigCountColors) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      const text = colors
        ? colorize(`${claudeMdCount} docs`, colors.label)
        : `${claudeMdCount} docs`;
      parts.push(text);
    }

    if (rulesCount > 0) {
      const text = colors ? colorize(`${rulesCount} rules`, colors.label) : `${rulesCount} rules`;
      parts.push(text);
    }

    if (mcpCount > 0) {
      const text = colors ? colorize(`${mcpCount} MCPs`, colors.label) : `${mcpCount} MCPs`;
      parts.push(text);
    }

    if (hooksCount > 0) {
      const hookLabel = hooksCount === 1 ? "hook" : "hooks";
      const text = colors
        ? colorize(`${hooksCount} ${hookLabel}`, colors.label)
        : `${hooksCount} ${hookLabel}`;
      parts.push(text);
    }

    const sep = colors ? colorize(" │ ", colors.separator) : " │ ";
    return parts.join(sep);
  },

  playful: (data: ConfigCountStyleRenderData, colors?: IConfigCountColors) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      const text = colors
        ? colorize(`CLAUDE.md:${claudeMdCount}`, colors.label)
        : `CLAUDE.md:${claudeMdCount}`;
      parts.push(`📄 ${text}`);
    }

    if (rulesCount > 0) {
      const text = colors ? colorize(`rules:${rulesCount}`, colors.label) : `rules:${rulesCount}`;
      parts.push(`📜 ${text}`);
    }

    if (mcpCount > 0) {
      const text = colors ? colorize(`MCPs:${mcpCount}`, colors.label) : `MCPs:${mcpCount}`;
      parts.push(`🔌 ${text}`);
    }

    if (hooksCount > 0) {
      const text = colors ? colorize(`hooks:${hooksCount}`, colors.label) : `hooks:${hooksCount}`;
      parts.push(`🪝 ${text}`);
    }

    const sep = colors ? colorize(" │ ", colors.separator) : " │ ";
    return parts.join(sep);
  },

  verbose: (data: ConfigCountStyleRenderData, colors?: IConfigCountColors) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      const text = colors
        ? colorize(`${claudeMdCount} CLAUDE.md`, colors.label)
        : `${claudeMdCount} CLAUDE.md`;
      parts.push(text);
    }

    if (rulesCount > 0) {
      const text = colors ? colorize(`${rulesCount} rules`, colors.label) : `${rulesCount} rules`;
      parts.push(text);
    }

    if (mcpCount > 0) {
      const text = colors
        ? colorize(`${mcpCount} MCP servers`, colors.label)
        : `${mcpCount} MCP servers`;
      parts.push(text);
    }

    if (hooksCount > 0) {
      const text = colors ? colorize(`${hooksCount} hooks`, colors.label) : `${hooksCount} hooks`;
      parts.push(text);
    }

    const sep = colors ? colorize(" │ ", colors.separator) : " │ ";
    return parts.join(sep);
  },
};
