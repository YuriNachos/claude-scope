/**
 * Config loader for main CLI
 * Loads widget configuration from ~/.claude-scope/config.json
 */
/**
 * Individual widget configuration from loaded config
 */
export interface LoadedWidgetConfig {
    /** Widget identifier (e.g., "model", "git", "context") */
    id: string;
    /** Display style (balanced, playful, compact, etc.) */
    style: string;
    /** Widget-specific colors (ANSI escape sequences or color names) */
    colors: Record<string, string>;
}
/**
 * Loaded configuration structure
 * Contains only the lines object, not the full ScopeConfig
 */
export interface LoadedConfig {
    /** Line-based widget configuration */
    lines: Record<string, LoadedWidgetConfig[]>;
}
/**
 * Load widget configuration from file system
 * Extracts only the `lines` object for main CLI use
 * @returns Config object with lines, or null if not exists/invalid
 */
export declare function loadWidgetConfig(): Promise<LoadedConfig | null>;
//# sourceMappingURL=config-loader.d.ts.map