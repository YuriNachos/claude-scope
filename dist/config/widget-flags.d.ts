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
export declare const WIDGET_FLAGS: {
    readonly activeTools: true;
    readonly cacheMetrics: true;
};
export type WidgetFlagName = keyof typeof WIDGET_FLAGS;
/**
 * Check if a widget is enabled via feature flag
 */
export declare function isWidgetEnabled(name: WidgetFlagName): boolean;
//# sourceMappingURL=widget-flags.d.ts.map