/**
 * Core types for the widget display style system
 */
/**
 * Every display style a widget may be configured with
 *
 * Single source of truth: both the `WidgetStyle` type and the runtime check
 * derive from this list, so a new style cannot be added to one and forgotten
 * in the other.
 */
export const WIDGET_STYLES = [
  "minimal",
  "balanced",
  "compact",
  "playful",
  "verbose",
  "technical",
  "symbolic",
  "monochrome",
  "compact-verbose",
  "labeled",
  "indicator",
  "emoji",
  "breakdown",
] as const;

export type WidgetStyle = (typeof WIDGET_STYLES)[number];

export const DEFAULT_WIDGET_STYLE: WidgetStyle = "balanced";

export interface WidgetStyleConfig {
  style: WidgetStyle;
}

export interface StyleConfig {
  [widgetId: string]: WidgetStyleConfig;
}

export function isValidWidgetStyle(value: string): value is WidgetStyle {
  return (WIDGET_STYLES as readonly string[]).includes(value);
}

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
