/**
 * Types for ConfigCountWidget style renderers
 */
import type { BaseStyleRenderer } from "../../../core/style-renderer.js";
export interface ConfigCountRenderData {
    claudeMdCount: number;
    rulesCount: number;
    mcpCount: number;
    hooksCount: number;
}
export type ConfigCountRenderer = BaseStyleRenderer<ConfigCountRenderData>;
//# sourceMappingURL=types.d.ts.map