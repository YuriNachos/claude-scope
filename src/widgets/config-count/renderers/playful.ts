/**
 * Playful style renderer for ConfigCountWidget
 * Output: "📄 CLAUDE.md:2 │ 📜 rules:5 │ 🔌 MCPs:3 │ 🪝 hooks:1"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ConfigCountRenderData } from "./types.js";

export class ConfigCountPlayfulRenderer extends BaseStyleRenderer<ConfigCountRenderData> {
  render(data: ConfigCountRenderData): string {
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
  }
}
