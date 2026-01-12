/**
 * Theme system
 * Provides color theme for all widgets
 *
 * Available themes:
 * - Community Favorites: Nord, Dracula, Catppuccin Mocha, Tokyo Night,
 *   One Dark Pro, Solarized Dark, Monokai, Rose Pine
 * - Universal Standards: GitHub Dark Dimmed, VSCode Dark+, Cyberpunk Neon
 * - Intuitive: Semantic Classic, Professional Blue
 * - Muted: Muted Gray, Slate Blue, Dusty Sage
 *
 * Default: Monokai
 */

import { GRAY_THEME } from "./gray-theme.js";
// Import all themes
import { CATPPUCCIN_MOCHA_THEME } from "./themes/catppuccin-mocha-theme.js";
import { CYBERPUNK_NEON_THEME } from "./themes/cyberpunk-neon-theme.js";
import { DRACULA_THEME } from "./themes/dracula-theme.js";
import { DUSTY_SAGE_THEME } from "./themes/dusty-sage-theme.js";
import { GITHUB_DARK_DIMMED_THEME } from "./themes/github-dark-dimmed-theme.js";
import { MONOKAI_THEME } from "./themes/monokai-theme.js";
import { MUTED_GRAY_THEME } from "./themes/muted-gray-theme.js";
import { NORD_THEME } from "./themes/nord-theme.js";
import { ONE_DARK_PRO_THEME } from "./themes/one-dark-pro-theme.js";
import { PROFESSIONAL_BLUE_THEME } from "./themes/professional-blue-theme.js";
import { ROSE_PINE_THEME } from "./themes/rose-pine-theme.js";
import { SEMANTIC_CLASSIC_THEME } from "./themes/semantic-classic-theme.js";
import { SLATE_BLUE_THEME } from "./themes/slate-blue-theme.js";
import { SOLARIZED_DARK_THEME } from "./themes/solarized-dark-theme.js";
import { TOKYO_NIGHT_THEME } from "./themes/tokyo-night-theme.js";
import { VSCODE_DARK_PLUS_THEME } from "./themes/vscode-dark-plus-theme.js";

// Export helpers
export { createBaseColors, createSemanticColors, createThemeColors } from "./helpers.js";
// Export all theme types
export type {
  IBaseColors,
  ICacheColors,
  IContextColors,
  ICostColors,
  IDevServerColors,
  IDockerColors,
  IDurationColors,
  IGitColors,
  ILinesColors,
  IModelColors,
  IPokerColors,
  ISemanticColors,
  ITheme,
  IThemeColors,
  IToolsColors,
} from "./types.js";

// Export all themes
export {
  CATPPUCCIN_MOCHA_THEME,
  CYBERPUNK_NEON_THEME,
  DRACULA_THEME,
  DUSTY_SAGE_THEME,
  GITHUB_DARK_DIMMED_THEME,
  MONOKAI_THEME,
  MUTED_GRAY_THEME,
  NORD_THEME,
  ONE_DARK_PRO_THEME,
  PROFESSIONAL_BLUE_THEME,
  ROSE_PINE_THEME,
  SEMANTIC_CLASSIC_THEME,
  SLATE_BLUE_THEME,
  SOLARIZED_DARK_THEME,
  TOKYO_NIGHT_THEME,
  VSCODE_DARK_PLUS_THEME,
  GRAY_THEME,
};

/**
 * All available themes in alphabetical order
 * Default theme is Monokai
 */
export const AVAILABLE_THEMES = [
  CATPPUCCIN_MOCHA_THEME,
  CYBERPUNK_NEON_THEME,
  DRACULA_THEME,
  DUSTY_SAGE_THEME,
  GITHUB_DARK_DIMMED_THEME,
  GRAY_THEME,
  MONOKAI_THEME,
  MUTED_GRAY_THEME,
  NORD_THEME,
  ONE_DARK_PRO_THEME,
  PROFESSIONAL_BLUE_THEME,
  ROSE_PINE_THEME,
  SEMANTIC_CLASSIC_THEME,
  SLATE_BLUE_THEME,
  SOLARIZED_DARK_THEME,
  TOKYO_NIGHT_THEME,
  VSCODE_DARK_PLUS_THEME,
] as const;

/**
 * Default theme colors for all widgets
 * Uses Monokai as the default theme
 */
export const DEFAULT_THEME = MONOKAI_THEME.colors;

/**
 * Default theme object (Monokai)
 */
export const DEFAULT_THEME_OBJECT = MONOKAI_THEME;

/**
 * Get theme by name
 * @param name - Theme name (e.g., "monokai", "nord", "dracula")
 * @returns Theme object or Monokai as default
 *
 * @example
 * const theme = getThemeByName("nord");
 * const defaultTheme = getThemeByName("unknown"); // Returns Monokai
 */
export function getThemeByName(name: string): typeof MONOKAI_THEME {
  const theme = AVAILABLE_THEMES.find((t) => t.name === name);
  return theme ?? MONOKAI_THEME;
}
