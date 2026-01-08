/**
 * Indicator style renderer for LinesWidget
 * Output: "● +142/-27" (with colors)
 */
import { colorize } from "../../../ui/utils/formatters.js";
import { withIndicator } from "../../../ui/utils/style-utils.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class LinesIndicatorRenderer extends BaseStyleRenderer {
    colors;
    constructor(colors) {
        super();
        this.colors = colors;
    }
    render(data) {
        const addedStr = colorize(`+${data.added}`, this.colors.added);
        const removedStr = colorize(`-${data.removed}`, this.colors.removed);
        const lines = `${addedStr}/${removedStr}`;
        return withIndicator(lines);
    }
}
//# sourceMappingURL=indicator.js.map