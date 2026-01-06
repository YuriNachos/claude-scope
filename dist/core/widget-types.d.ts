/**
 * Widget type utilities and helpers
 */
import type { IWidgetMetadata, IWidget } from '#core/types.js';
/**
 * Create widget metadata with defaults
 *
 * @param name - Widget name
 * @param description - Widget description
 * @param version - Widget version (default: '1.0.0')
 * @param author - Widget author (default: 'claude-scope')
 * @returns Widget metadata object
 */
export declare function createWidgetMetadata(name: string, description: string, version?: string, author?: string): IWidgetMetadata;
/**
 * Type for widget constructor
 * Can be used with dependency injection
 */
export type WidgetConstructor = new (...args: unknown[]) => IWidget;
/**
 * Widget configuration options
 */
export interface WidgetConfig {
    enabled?: boolean;
}
/**
 * Create widget config with defaults
 */
export declare function createWidgetConfig(config?: WidgetConfig): WidgetConfig;
//# sourceMappingURL=widget-types.d.ts.map