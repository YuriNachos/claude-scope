/**
 * Theme system
 * Provides color themes for all widgets
 */

import { DARK_THEME } from "./dark-theme.js";
import { GRAY_THEME } from "./gray-theme.js";
import { LIGHT_THEME } from "./light-theme.js";

// Export all theme types
export type {
  IBaseColors,
  IContextColors,
  ICostColors,
  IDurationColors,
  IGitColors,
  ILinesColors,
  IModelColors,
  IPokerColors,
  ISemanticColors,
  ITheme,
  IThemeColors,
} from "./types.js";

// Export all themes
export { GRAY_THEME, DARK_THEME, LIGHT_THEME };

/**
 * Available themes
 */
export const AVAILABLE_THEMES = [GRAY_THEME, DARK_THEME, LIGHT_THEME] as const;

/**
 * Default theme colors
 * @deprecated Use AVAILABLE_THEMES and select theme by name instead
 */
export const DEFAULT_THEME = GRAY_THEME.colors;

/**
 * Get theme by name
 * @param name - Theme name (gray, dark, light)
 * @returns Theme object or gray theme as default
 */
export function getThemeByName(name: string): typeof GRAY_THEME {
  const theme = AVAILABLE_THEMES.find((t) => t.name === name);
  return theme ?? GRAY_THEME;
}
