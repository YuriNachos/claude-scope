/**
 * Feature flags for widget visibility
 * Allows disabling widgets without code changes
 *
 * Example: To disable the activeTools widget, set it to false:
 * export const WIDGET_FLAGS = {
 *   activeTools: false,  // Disabled
 *   cacheMetrics: true,   // Enabled
 * } as const;
 */
export const WIDGET_FLAGS = {
  activeTools: true,
  cacheMetrics: true,
} as const;

export type WidgetFlagName = keyof typeof WIDGET_FLAGS;

/**
 * Check if a widget is enabled via feature flag
 */
export function isWidgetEnabled(name: WidgetFlagName): boolean {
  return WIDGET_FLAGS[name] ?? true;
}
