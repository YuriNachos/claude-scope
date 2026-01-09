/**
 * Active Tools Widget
 *
 * Displays currently running and recently completed tools
 * by parsing Claude Code's transcript file
 */

import type { IWidgetMetadata, RenderContext } from "../../core/types.js";
import type { ITranscriptProvider } from "../../providers/transcript-provider.js";
import type { ToolEntry } from "../../providers/transcript-types.js";
import type { StdinData } from "../../types.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { StdinDataWidget } from "../core/stdin-data-widget.js";
import { activeToolsStyles } from "./styles.js";
import type { ActiveToolsRenderData, ActiveToolsStyle } from "./types.js";

/**
 * Active Tools Widget
 *
 * Parses Claude Code's JSONL transcript file to track tool lifecycle
 * and displays running/completed tools with aggregation
 */
export class ActiveToolsWidget extends StdinDataWidget {
  readonly id = "active-tools";
  readonly metadata: IWidgetMetadata = {
    name: "Active Tools",
    description: "Active tools display from transcript",
    version: "1.0.0",
    author: "claude-scope",
    line: 2, // Display on third line (0-indexed)
  };

  private style: ActiveToolsStyle = "balanced";
  private tools: ToolEntry[] = [];
  private renderData?: ActiveToolsRenderData;

  constructor(
    private theme: IThemeColors,
    private transcriptProvider: ITranscriptProvider
  ) {
    super();
  }

  /**
   * Set display style
   * @param style - Style to use for rendering
   */
  setStyle(style: ActiveToolsStyle): void {
    this.style = style;
  }

  /**
   * Aggregate completed tools by name and sort by count (descending)
   * @param tools - Array of tool entries
   * @returns Array of [name, count] tuples sorted by count descending
   */
  private aggregateCompleted(tools: ToolEntry[]): Array<[string, number]> {
    const counts = new Map<string, number>();
    for (const tool of tools) {
      if (tool.status === "completed" || tool.status === "error") {
        const current = counts.get(tool.name) ?? 0;
        counts.set(tool.name, current + 1);
      }
    }
    // Convert to array and sort by count descending
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }

  /**
   * Prepare render data from tools
   * @returns Render data with running, completed, and error tools
   */
  private prepareRenderData(): ActiveToolsRenderData {
    const running = this.tools.filter((t) => t.status === "running");
    const completed = this.aggregateCompleted(this.tools);
    const errors = this.tools.filter((t) => t.status === "error");

    return { running, completed, errors };
  }

  /**
   * Update widget with new stdin data
   * @param data - Stdin data from Claude Code
   */
  override async update(data: StdinData): Promise<void> {
    await super.update(data);

    if (data.transcript_path) {
      this.tools = await this.transcriptProvider.parseTools(data.transcript_path);
      this.renderData = this.prepareRenderData();
    } else {
      this.tools = [];
      this.renderData = undefined;
    }
  }

  /**
   * Render widget output
   * @param context - Render context
   * @returns Rendered string or null if no tools
   */
  protected renderWithData(_data: StdinData, _context: RenderContext): string | null {
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
  override isEnabled(): boolean {
    return super.isEnabled() && this.tools.length > 0;
  }
}
