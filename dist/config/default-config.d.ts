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
/**
 * Generate Balanced layout configuration
 * Line 0: model, context, cost, duration, lines
 * Line 1: git, cache-metrics, active-tools
 */
export declare function generateBalancedLayout(style: QuickConfigStyle, themeName: string): ScopeConfig;
/**
 * Generate Compact layout configuration (1 line)
 * Line 0: model, context, cost, git, duration
 */
export declare function generateCompactLayout(style: QuickConfigStyle, themeName: string): ScopeConfig;
/**
 * Generate Rich layout configuration (3 lines)
 * Line 0: model, context, cost, duration
 * Line 1: git, git-tag, lines, active-tools
 * Line 2: cache-metrics, config-count
 */
export declare function generateRichLayout(style: QuickConfigStyle, themeName: string): ScopeConfig;
//# sourceMappingURL=default-config.d.ts.map