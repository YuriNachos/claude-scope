/**
 * Functional style renderers for ModelWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { IModelColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import { withIndicator, withLabel } from "../../ui/utils/style-utils.js";
import type { ModelRenderData } from "./types.js";

function getShortName(displayName: string): string {
  return displayName.replace(/^Claude\s+/, "");
}

export const modelStyles: StyleMap<ModelRenderData, IModelColors> = {
  balanced: (data: ModelRenderData, colors?: IModelColors) => {
    if (!colors) return data.displayName;
    return colorize(data.displayName, colors.name);
  },

  compact: (data: ModelRenderData, colors?: IModelColors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return shortName;
    return colorize(shortName, colors.name);
  },

  playful: (data: ModelRenderData, colors?: IModelColors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return `🤖 ${shortName}`;
    return `🤖 ${colorize(shortName, colors.name)}`;
  },

  technical: (data: ModelRenderData, colors?: IModelColors) => {
    if (!colors) return data.id;
    // Colorize name part, keep version muted
    const match = data.id.match(/^(.+?)-(\d[\d.]*)$/);
    if (match) {
      return colorize(match[1], colors.name) + colorize(`-${match[2]}`, colors.version);
    }
    return colorize(data.id, colors.name);
  },

  symbolic: (data: ModelRenderData, colors?: IModelColors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return `◆ ${shortName}`;
    return `◆ ${colorize(shortName, colors.name)}`;
  },

  labeled: (data: ModelRenderData, colors?: IModelColors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return withLabel("Model", shortName);
    return withLabel("Model", colorize(shortName, colors.name));
  },

  indicator: (data: ModelRenderData, colors?: IModelColors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return withIndicator(shortName);
    return withIndicator(colorize(shortName, colors.name));
  },
};
