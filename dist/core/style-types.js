export const DEFAULT_WIDGET_STYLE = "balanced";
export function getDefaultStyleConfig(style = DEFAULT_WIDGET_STYLE) {
    return { style };
}
export function isValidWidgetStyle(value) {
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
//# sourceMappingURL=style-types.js.map