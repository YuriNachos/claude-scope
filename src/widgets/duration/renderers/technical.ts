/**
 * Technical style renderer for DurationWidget
 * Output: "3665000ms"
 */

import { BaseStyleRenderer } from "../../../core/style-renderer.js";
import type { DurationRenderData } from "./types.js";

export class DurationTechnicalRenderer extends BaseStyleRenderer<DurationRenderData> {
  render(data: DurationRenderData): string {
    return `${Math.floor(data.durationMs)}ms`;
  }
}
