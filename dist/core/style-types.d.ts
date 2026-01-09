/**
 * Core types for the widget display style system
 */
export type WidgetStyle = "minimal" | "balanced" | "compact" | "playful" | "verbose" | "technical" | "symbolic" | "monochrome" | "compact-verbose" | "labeled" | "indicator" | "emoji" | "breakdown";
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
 * @param data - The data to render
 * @param colors - Optional colors for theming (widget-specific color interface)
 */
export type StyleRendererFn<T = unknown, C = unknown> = (data: T, colors?: C) => string;
/**
 * Map of widget styles to their renderer functions
 */
export type StyleMap<T, C = unknown> = Partial<Record<WidgetStyle, StyleRendererFn<T, C>>>;
//# sourceMappingURL=style-types.d.ts.map