/**
 * Functional style renderers for ConfigCountWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { ConfigCountRenderData } from "./types.js";

export const configCountStyles: StyleMap<ConfigCountRenderData> = {
  balanced: (data: ConfigCountRenderData) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      parts.push(`CLAUDE.md:${claudeMdCount}`);
    }

    if (rulesCount > 0) {
      parts.push(`rules:${rulesCount}`);
    }

    if (mcpCount > 0) {
      parts.push(`MCPs:${mcpCount}`);
    }

    if (hooksCount > 0) {
      parts.push(`hooks:${hooksCount}`);
    }

    return parts.join(" │ ");
  },

  compact: (data: ConfigCountRenderData) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      parts.push(`${claudeMdCount} docs`);
    }

    if (rulesCount > 0) {
      parts.push(`${rulesCount} rules`);
    }

    if (mcpCount > 0) {
      parts.push(`${mcpCount} MCPs`);
    }

    if (hooksCount > 0) {
      const hookLabel = hooksCount === 1 ? "hook" : "hooks";
      parts.push(`${hooksCount} ${hookLabel}`);
    }

    return parts.join(" │ ");
  },

  playful: (data: ConfigCountRenderData) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      parts.push(`📄 CLAUDE.md:${claudeMdCount}`);
    }

    if (rulesCount > 0) {
      parts.push(`📜 rules:${rulesCount}`);
    }

    if (mcpCount > 0) {
      parts.push(`🔌 MCPs:${mcpCount}`);
    }

    if (hooksCount > 0) {
      parts.push(`🪝 hooks:${hooksCount}`);
    }

    return parts.join(" │ ");
  },

  verbose: (data: ConfigCountRenderData) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts: string[] = [];

    if (claudeMdCount > 0) {
      parts.push(`${claudeMdCount} CLAUDE.md`);
    }

    if (rulesCount > 0) {
      parts.push(`${rulesCount} rules`);
    }

    if (mcpCount > 0) {
      parts.push(`${mcpCount} MCP servers`);
    }

    if (hooksCount > 0) {
      parts.push(`${hooksCount} hook`);
    }

    return parts.join(" │ ");
  },
};
