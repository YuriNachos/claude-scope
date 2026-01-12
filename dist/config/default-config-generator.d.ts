/**
 * Default config generator
 * Ensures default config exists on first install
 */
/**
 * Get the default config file path
 * @returns Path to ~/.claude-scope/config.json
 */
export declare function getDefaultConfigPath(): string;
/**
 * Ensure default config exists
 * Creates default config if it doesn't exist
 * Does NOT overwrite existing config
 */
export declare function ensureDefaultConfig(): Promise<void>;
//# sourceMappingURL=default-config-generator.d.ts.map