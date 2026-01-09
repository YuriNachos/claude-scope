/**
 * Active Tools Widget
 *
 * Displays currently running and recently completed tools
 * by parsing Claude Code's transcript file
 */
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { activeToolsStyles } from "./styles.js";
/**
 * Active Tools Widget
 *
 * Parses Claude Code's JSONL transcript file to track tool lifecycle
 * and displays running/completed tools with aggregation
 */
export class ActiveToolsWidget extends StdinDataWidget {
    theme;
    transcriptProvider;
    id = "active-tools";
    metadata = {
        name: "Active Tools",
        description: "Active tools display from transcript",
        version: "1.0.0",
        author: "claude-scope",
        line: 2, // Display on third line (0-indexed)
    };
    style = "balanced";
    tools = [];
    renderData;
    constructor(theme, transcriptProvider) {
        super();
        this.theme = theme;
        this.transcriptProvider = transcriptProvider;
    }
    /**
     * Set display style
     * @param style - Style to use for rendering
     */
    setStyle(style) {
        this.style = style;
    }
    /**
     * Aggregate completed tools by name
     * @param tools - Array of tool entries
     * @returns Map of tool name to count
     */
    aggregateCompleted(tools) {
        const counts = new Map();
        for (const tool of tools) {
            if (tool.status === "completed" || tool.status === "error") {
                const current = counts.get(tool.name) ?? 0;
                counts.set(tool.name, current + 1);
            }
        }
        return counts;
    }
    /**
     * Prepare render data from tools
     * @returns Render data with running, completed, and error tools
     */
    prepareRenderData() {
        const running = this.tools.filter((t) => t.status === "running");
        const completed = this.aggregateCompleted(this.tools);
        const errors = this.tools.filter((t) => t.status === "error");
        return { running, completed, errors };
    }
    /**
     * Update widget with new stdin data
     * @param data - Stdin data from Claude Code
     */
    async update(data) {
        await super.update(data);
        if (data.transcript_path) {
            this.tools = await this.transcriptProvider.parseTools(data.transcript_path);
            this.renderData = this.prepareRenderData();
        }
        else {
            this.tools = [];
            this.renderData = undefined;
        }
    }
    /**
     * Render widget output
     * @param context - Render context
     * @returns Rendered string or null if no tools
     */
    renderWithData(_data, _context) {
        if (!this.renderData || this.tools.length === 0) {
            return null;
        }
        const styleFn = activeToolsStyles[this.style] ?? activeToolsStyles.balanced;
        if (!styleFn) {
            return null;
        }
        return styleFn(this.renderData, this.theme);
    }
    /**
     * Check if widget should render
     * @returns true if there are tools to display
     */
    isEnabled() {
        return super.isEnabled() && this.tools.length > 0;
    }
}
//# sourceMappingURL=active-tools-widget.js.map