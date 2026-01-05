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
 * @returns Widget metadata object
 */
export function createWidgetMetadata(name, description, version = '1.0.0', author = 'claude-scope') {
    return {
        name,
        description,
        version,
        author
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