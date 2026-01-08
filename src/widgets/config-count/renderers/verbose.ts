/**
 * Verbose style renderer for ConfigCountWidget
 * Output: "2 CLAUDE.md │ 5 rules │ 3 MCP servers │ 1 hook"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ConfigCountRenderData } from "./types.js";

export class ConfigCountVerboseRenderer extends BaseStyleRenderer<ConfigCountRenderData> {
  render(data: ConfigCountRenderData): string {
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
  }
}
