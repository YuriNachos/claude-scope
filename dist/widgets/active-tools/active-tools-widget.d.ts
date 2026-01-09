/**
 * Active Tools Widget
 *
 * Displays currently running and recently completed tools
 * by parsing Claude Code's transcript file
 */
import type { IWidgetMetadata, RenderContext } from "../../core/types.js";
import type { ITranscriptProvider } from "../../providers/transcript-provider.js";
import type { StdinData } from "../../types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import type { ActiveToolsStyle } from "./types.js";
/**
 * Active Tools Widget
 *
 * Parses Claude Code's JSONL transcript file to track tool lifecycle
 * and displays running/completed tools with aggregation
 */
export declare class ActiveToolsWidget extends StdinDataWidget {
    private theme;
    private transcriptProvider;
    readonly id = "active-tools";
    readonly metadata: IWidgetMetadata;
    private style;
    private tools;
    private renderData?;
    constructor(theme: IThemeColors, transcriptProvider: ITranscriptProvider);
    /**
     * Set display style
     * @param style - Style to use for rendering
     */
    setStyle(style: ActiveToolsStyle): void;
    /**
     * Aggregate completed tools by name and sort by count (descending)
     * @param tools - Array of tool entries
     * @returns Array of [name, count] tuples sorted by count descending
     */
    private aggregateCompleted;
    /**
     * Prepare render data from tools
     * @returns Render data with running, completed, and error tools
     */
    private prepareRenderData;
    /**
     * Update widget with new stdin data
     * @param data - Stdin data from Claude Code
     */
    update(data: StdinData): Promise<void>;
    /**
     * Render widget output
     * @param context - Render context
     * @returns Rendered string or null if no tools
     */
    protected renderWithData(_data: StdinData, _context: RenderContext): string | null;
    /**
     * Check if widget should render
     * @returns true if there are tools to display
     */
    isEnabled(): boolean;
}
//# sourceMappingURL=active-tools-widget.d.ts.map