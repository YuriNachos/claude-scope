/**
 * Functional style renderers for ModelWidget
 */

import { withLabel, withIndicator } from "../../ui/utils/style-utils.js";
import type { ModelRenderData } from "./types.js";
import type { StyleMap } from "../../core/style-types.js";

function getShortName(displayName: string): string {
  return displayName.replace(/^Claude\s+/, "");
}

export const modelStyles: StyleMap<ModelRenderData> = {
  balanced: (data: ModelRenderData) => {
    return data.displayName;
  },

  compact: (data: ModelRenderData) => {
    return getShortName(data.displayName);
  },

  playful: (data: ModelRenderData) => {
    return `🤖 ${getShortName(data.displayName)}`;
  },

  technical: (data: ModelRenderData) => {
    return data.id;
  },

  symbolic: (data: ModelRenderData) => {
    return `◆ ${getShortName(data.displayName)}`;
  },

  labeled: (data: ModelRenderData) => {
    return withLabel("Model", getShortName(data.displayName));
  },

  indicator: (data: ModelRenderData) => {
    return withIndicator(getShortName(data.displayName));
  },
};
