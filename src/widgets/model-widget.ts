/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import type { StyleRendererFn, WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { DEFAULT_THEME } from "../ui/theme/index.js";
import type { IModelColors, IThemeColors } from "../ui/theme/types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { modelStyles } from "./model/styles.js";
import type { ModelRenderData } from "./model/types.js";

export class ModelWidget extends StdinDataWidget {
  readonly id = "model";
  readonly metadata = createWidgetMetadata(
    "Model",
    "Displays the current Claude model name",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<ModelRenderData, IModelColors> = modelStyles.balanced!;

  constructor(colors?: IThemeColors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = modelStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    if (!data.model) {
      return null;
    }

    const renderData: ModelRenderData = {
      displayName: data.model.display_name,
      id: data.model.id,
    };
    return this.styleFn(renderData, this.colors.model);
  }
}
