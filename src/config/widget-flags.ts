/**
 * Feature flags for widget visibility
 * Allows disabling widgets without code changes
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
