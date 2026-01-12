/**
 * Gray theme - neutral gray colors for all widgets
 * Minimal color distraction
 */

import { gray } from "../utils/colors.js";
import { createThemeColors } from "./helpers.js";
import type { ITheme } from "./types.js";

export const GRAY_THEME: ITheme = {
  name: "gray",
  description: "Neutral gray theme for minimal color distraction",

  colors: createThemeColors({
    branch: gray,
    changes: gray,
    contextLow: gray,
    contextMedium: gray,
    contextHigh: gray,
    linesAdded: gray,
    linesRemoved: gray,
    cost: gray,
    model: gray,
    duration: gray,
    accent: gray,
    cacheHigh: gray,
    cacheMedium: gray,
    cacheLow: gray,
    cacheRead: gray,
    cacheWrite: gray,
    toolsRunning: gray,
    toolsCompleted: gray,
    toolsError: gray,
    toolsName: gray,
    toolsTarget: gray,
    toolsCount: gray,
    devServerName: gray,
    devServerStatus: gray,
    devServerLabel: gray,
    dockerLabel: gray,
    dockerCount: gray,
    dockerRunning: gray,
    dockerStopped: gray,
  }),
};
