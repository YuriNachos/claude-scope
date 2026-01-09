/**
 * Active tools widget styles
 */
import type { StyleMap } from "../../core/style-types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import type { ActiveToolsRenderData, ActiveToolsStyle } from "./types.js";
/**
 * Style implementations for active tools display
 */
export declare const activeToolsStyles: StyleMap<ActiveToolsRenderData, IThemeColors>;
/**
 * Get the default style for active tools
 */
export declare function getDefaultActiveToolsStyle(): ActiveToolsStyle;
/**
 * Get all available active tools styles
 */
export declare function getActiveToolsStyles(): ActiveToolsStyle[];
/**
 * Validate if a string is a valid active tools style
 */
export declare function isValidActiveToolsStyle(style: string): style is ActiveToolsStyle;
//# sourceMappingURL=styles.d.ts.map