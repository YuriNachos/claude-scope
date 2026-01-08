/**
 * Helper function to create a setStyle method for widgets
 *
 * This eliminates the need to duplicate switch-case statements across widgets.
 * Instead of manually writing switch statements, use this helper.
 *
 * @example
 * ```typescript
 * private styleFn: StyleRendererFn<MyData> = myStyles.balanced;
 * private setStyle = createStyleSetter(myStyles, { value: this.styleFn });
 * ```
 */
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";
/**
 * Creates a setStyle function that updates the renderer function reference
 *
 * @param styleMap - Map of styles to renderer functions
 * @param styleFnRef - Mutable reference to current style function
 * @param fallbackStyle - Style to use when requested style is not found (default: "balanced")
 * @returns A setStyle function compatible with IWidget.setStyle
 */
export function createStyleSetter(styleMap, styleFnRef, fallbackStyle = DEFAULT_WIDGET_STYLE) {
    return (style = fallbackStyle) => {
        const fn = styleMap[style];
        if (fn) {
            styleFnRef.value = fn;
        }
        else {
            // Fall back to default style or balanced if requested style not found
            const fallbackFn = styleMap[fallbackStyle] || styleMap.balanced;
            if (fallbackFn) {
                styleFnRef.value = fallbackFn;
            }
        }
    };
}
//# sourceMappingURL=create-style-setter.js.map