/**
 * Types for ConfigCountWidget
 */
import type { IThemeColors } from "../../ui/theme/types.js";
export interface ConfigCountRenderData {
    claudeMdCount: number;
    rulesCount: number;
    mcpCount: number;
    hooksCount: number;
}
export interface ConfigCountStyleRenderData extends ConfigCountRenderData {
    colors?: IThemeColors;
}
//# sourceMappingURL=types.d.ts.map