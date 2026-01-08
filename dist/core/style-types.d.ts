/**
 * Core types for the widget display style system
 */
export type WidgetStyle = "balanced" | "compact" | "playful" | "verbose" | "technical" | "symbolic" | "monochrome" | "compact-verbose" | "labeled" | "indicator" | "fancy";
export declare const DEFAULT_WIDGET_STYLE: WidgetStyle;
export interface WidgetStyleConfig {
    style: WidgetStyle;
}
export interface StyleConfig {
    [widgetId: string]: WidgetStyleConfig;
}
export declare function getDefaultStyleConfig(style?: WidgetStyle): WidgetStyleConfig;
export declare function isValidWidgetStyle(value: string): value is WidgetStyle;
//# sourceMappingURL=style-types.d.ts.map