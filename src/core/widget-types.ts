/**
 * Widget type utilities and helpers
 */

import type { IWidgetMetadata } from "./types.js";

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
