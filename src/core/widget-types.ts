/**
 * Widget type utilities and helpers
 */

import type { IWidget, IWidgetMetadata } from "./types.js";

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
export function createWidgetMetadata(
  name: string,
  description: string,
  version = "1.0.0",
  author = "claude-scope",
  line: number = 0
): IWidgetMetadata {
  return {
    name,
    description,
    version,
    author,
    line,
  };
}

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
export function createWidgetConfig(config: WidgetConfig = {}): WidgetConfig {
  return {
    enabled: true,
    ...config,
  };
}
