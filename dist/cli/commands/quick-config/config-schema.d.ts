/**
 * Configuration schema for ~/.claude-scope/config.json
 */
/**
 * Individual color configuration as ANSI escape sequence
 * Example: "\u001b[38;2;148;163;184m" for RGB(148, 163, 184)
 */
export type ColorCode = string;
/**
 * Base colors - shared across widgets
 */
export interface BaseColors {
    text?: ColorCode;
    muted?: ColorCode;
    accent?: ColorCode;
    border?: ColorCode;
}
/**
 * Semantic colors for states
 */
export interface SemanticColors {
    success?: ColorCode;
    warning?: ColorCode;
    error?: ColorCode;
    info?: ColorCode;
}
/**
 * Git widget colors
 */
export interface GitColors {
    branch: ColorCode;
    changes: ColorCode;
}
/**
 * Context widget colors
 */
export interface ContextColors {
    low: ColorCode;
    medium: ColorCode;
    high: ColorCode;
    bar: ColorCode;
}
/**
 * Lines widget colors
 */
export interface LinesColors {
    added: ColorCode;
    removed: ColorCode;
}
/**
 * Cost widget colors
 */
export interface CostColors {
    amount: ColorCode;
    currency: ColorCode;
}
/**
 * Duration widget colors
 */
export interface DurationColors {
    value: ColorCode;
    unit: ColorCode;
}
/**
 * Model widget colors
 */
export interface ModelColors {
    name: ColorCode;
    version: ColorCode;
}
/**
 * Poker widget colors
 */
export interface PokerColors {
    participating?: ColorCode;
    nonParticipating?: ColorCode;
    result?: ColorCode;
}
/**
 * Cache metrics widget colors
 */
export interface CacheColors {
    high: ColorCode;
    medium: ColorCode;
    low: ColorCode;
    read: ColorCode;
    write: ColorCode;
}
/**
 * Active tools widget colors
 */
export interface ToolsColors {
    running: ColorCode;
    completed: ColorCode;
    error: ColorCode;
    name: ColorCode;
    target: ColorCode;
    count: ColorCode;
}
/**
 * Widget-specific color configuration
 * Different widgets have different color requirements
 */
export type WidgetColors = ModelColors | ContextColors | CostColors | LinesColors | DurationColors | GitColors | CacheColors | ToolsColors | PokerColors | BaseColors | SemanticColors | {
    base: ColorCode;
};
/**
 * Widget configuration
 */
export interface WidgetConfig {
    /** Widget identifier (e.g., "model", "git", "context") */
    id: string;
    /** Display style (balanced, playful, compact, etc.) */
    style: string;
    /** Widget-specific colors (ANSI escape sequences) */
    colors: WidgetColors;
}
/**
 * Line configuration - maps line number to array of widgets
 */
export interface LinesConfig {
    [lineNumber: string]: WidgetConfig[];
}
/**
 * Main configuration structure
 */
export interface ScopeConfig {
    /** Config version for future migration */
    version: string;
    /** Line-based widget configuration */
    lines: LinesConfig;
}
/**
 * Default config version
 */
export declare const CONFIG_VERSION = "1.0.0";
/**
 * Supported display styles for quick config
 */
export declare const QUICK_CONFIG_STYLES: readonly ["balanced", "playful", "compact"];
export type QuickConfigStyle = (typeof QUICK_CONFIG_STYLES)[number];
//# sourceMappingURL=config-schema.d.ts.map