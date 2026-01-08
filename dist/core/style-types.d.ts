/**
 * Core types for the widget display style system
 */
export type WidgetStyle = "minimal" | "balanced" | "compact" | "playful" | "verbose" | "technical" | "symbolic" | "monochrome" | "compact-verbose" | "labeled" | "indicator";
export declare const DEFAULT_WIDGET_STYLE: WidgetStyle;
export interface WidgetStyleConfig {
    style: WidgetStyle;
}
export interface StyleConfig {
    [widgetId: string]: WidgetStyleConfig;
}
export declare function getDefaultStyleConfig(style?: WidgetStyle): WidgetStyleConfig;
export declare function isValidWidgetStyle(value: string): value is WidgetStyle;
/**
 * Functional renderer type - a pure function that renders data to string
 * This is the functional alternative to BaseStyleRenderer class
 */
export type StyleRendererFn<T = unknown> = (data: T) => string;
/**
 * Map of widget styles to their renderer functions
 */
export type StyleMap<T> = Partial<Record<WidgetStyle, StyleRendererFn<T>>>;
//# sourceMappingURL=style-types.d.ts.map