/**
 * Model Widget
 *
 * Displays the current Claude model name
 */

import type { WidgetStyle } from "../core/style-types.js";
import { createWidgetMetadata } from "../core/widget-types.js";
import type { RenderContext, StdinData } from "../types.js";
import { StdinDataWidget } from "./core/stdin-data-widget.js";
import { ModelBalancedRenderer } from "./model/renderers/balanced.js";
import { ModelCompactRenderer } from "./model/renderers/compact.js";
import { ModelFancyRenderer } from "./model/renderers/fancy.js";
import { ModelIndicatorRenderer } from "./model/renderers/indicator.js";
import { ModelLabeledRenderer } from "./model/renderers/labeled.js";
import { ModelPlayfulRenderer } from "./model/renderers/playful.js";
import { ModelSymbolicRenderer } from "./model/renderers/symbolic.js";
import { ModelTechnicalRenderer } from "./model/renderers/technical.js";
import type { ModelRenderer } from "./model/renderers/types.js";

export class ModelWidget extends StdinDataWidget {
  readonly id = "model";
  readonly metadata = createWidgetMetadata(
    "Model",
    "Displays the current Claude model name",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private renderer: ModelRenderer = new ModelBalancedRenderer();

  setStyle(style: WidgetStyle): void {
    switch (style) {
      case "balanced":
        this.renderer = new ModelBalancedRenderer();
        break;
      case "compact":
        this.renderer = new ModelCompactRenderer();
        break;
      case "playful":
        this.renderer = new ModelPlayfulRenderer();
        break;
      case "technical":
        this.renderer = new ModelTechnicalRenderer();
        break;
      case "symbolic":
        this.renderer = new ModelSymbolicRenderer();
        break;
      case "labeled":
        this.renderer = new ModelLabeledRenderer();
        break;
      case "indicator":
        this.renderer = new ModelIndicatorRenderer();
        break;
      case "fancy":
        this.renderer = new ModelFancyRenderer();
        break;
      default:
        this.renderer = new ModelBalancedRenderer();
    }
  }

  protected renderWithData(data: StdinData, _context: RenderContext): string | null {
    const renderData = {
      displayName: data.model.display_name,
      id: data.model.id,
    };
    return this.renderer.render(renderData);
  }
}
