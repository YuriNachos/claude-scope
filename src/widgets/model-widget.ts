/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { modelStyles } from "./model/styles.js";
import type { ModelRenderData } from "./model/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";

export class ModelWidget extends StdinDataWidget {
  readonly id = "model";
  readonly metadata = createWidgetMetadata(
    "Model",
    "Displays the current Claude model name",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private styleFn: StyleRendererFn<ModelRenderData> = modelStyles.balanced!;

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = modelStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const renderData: ModelRenderData = {
      displayName: data.model.display_name,
      id: data.model.id,
    };
    return this.styleFn(renderData);
  }
}
