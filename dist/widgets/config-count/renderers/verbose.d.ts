/**
 * Verbose style renderer for ConfigCountWidget
 * Output: "2 CLAUDE.md │ 5 rules │ 3 MCP servers │ 1 hook"
 */
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { ConfigCountRenderData } from "./types.js";
export declare class ConfigCountVerboseRenderer extends BaseStyleRenderer<ConfigCountRenderData> {
    render(data: ConfigCountRenderData): string;
}
//# sourceMappingURL=verbose.d.ts.map