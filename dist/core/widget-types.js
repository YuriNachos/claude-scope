/**
 * Widget type utilities and helpers
 */
/**
 * Create widget metadata with defaults
 *
 * @param name - Widget name
 * @param description - Widget description
 * @param version - Widget version (default: '1.0.0')
 * @param author - Widget author (default: 'claude-scope')
 * @param line - Which statusline line this widget appears on (default: 0)
 * @returns Widget metadata object
 */
export function createWidgetMetadata(name, description, version = '1.0.0', author = 'claude-scope', line = 0) {
    return {
        name,
        description,
        version,
        author,
        line
    };
}
/**
 * Create widget config with defaults
 */
export function createWidgetConfig(config = {}) {
    return {
        enabled: true,
        ...config
    };
}
//# sourceMappingURL=widget-types.js.map