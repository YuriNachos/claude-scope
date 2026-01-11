/**
 * Default configuration for claude-scope
 * Represents current behavior (without Poker widget)
 */
import type { QuickConfigStyle, ScopeConfig } from "../cli/commands/quick-config/config-schema.js";
/**
 * Generate default config using Dusty Sage theme
 * @deprecated Use generateConfigWithStyleAndTheme instead
 */
export declare function generateDefaultConfig(): ScopeConfig;
/**
 * Generate config with specified style and theme
 * @param style - Display style (balanced, playful, compact)
 * @param themeName - Theme name (e.g., "monokai", "nord", "dracula")
 * @returns Config object
 */
export declare function generateConfigWithStyleAndTheme(style: QuickConfigStyle, themeName: string): ScopeConfig;
//# sourceMappingURL=default-config.d.ts.map