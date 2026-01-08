/**
 * Core types for the widget display style system
 */
export type WidgetStyle =
  | "balanced"
  | "compact"
  | "playful"
  | "verbose"
  | "technical"
  | "symbolic"
  | "monochrome"
  | "compact-verbose"
  | "labeled"
  | "indicator"
  | "fancy";

export const DEFAULT_WIDGET_STYLE: WidgetStyle = "balanced";

export interface WidgetStyleConfig {
  style: WidgetStyle;
}

export interface StyleConfig {
  [widgetId: string]: WidgetStyleConfig;
}

export function getDefaultStyleConfig(
  style: WidgetStyle = DEFAULT_WIDGET_STYLE
): WidgetStyleConfig {
  return { style };
}

export function isValidWidgetStyle(value: string): value is WidgetStyle {
  return [
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
    "fancy",
  ].includes(value);
}
