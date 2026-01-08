/**
 * Theme system
 * Provides color theme for all widgets
 */
import { GRAY_THEME } from "./gray-theme.js";
export type { IBaseColors, IContextColors, ICostColors, IDurationColors, IGitColors, ILinesColors, IModelColors, IPokerColors, ISemanticColors, ITheme, IThemeColors, } from "./types.js";
export { GRAY_THEME };
/**
 * Available themes
 */
export declare const AVAILABLE_THEMES: readonly [import("./types.js").ITheme];
/**
 * Default theme colors
 * @deprecated Use AVAILABLE_THEMES and select theme by name instead
 */
export declare const DEFAULT_THEME: import("./types.js").IThemeColors;
/**
 * Get theme by name
 * @param name - Theme name (gray)
 * @returns Theme object or gray theme as default
 */
export declare function getThemeByName(name: string): typeof GRAY_THEME;
//# sourceMappingURL=index.d.ts.map