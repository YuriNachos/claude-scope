/**
 * Balanced style renderer for LinesWidget
 * Output: "+142/-27" (with colors: + in green, - in red)
 */
import { colorize } from "../../../ui/utils/formatters.js";
import { BaseStyleRenderer } from "../../../core/style-renderer.js";
export class LinesBalancedRenderer extends BaseStyleRenderer {
    colors;
    constructor(colors) {
        super();
        this.colors = colors;
    }
    render(data) {
        const addedStr = colorize(`+${data.added}`, this.colors.added);
        const removedStr = colorize(`-${data.removed}`, this.colors.removed);
        return `${addedStr}/${removedStr}`;
    }
}
//# sourceMappingURL=balanced.js.map