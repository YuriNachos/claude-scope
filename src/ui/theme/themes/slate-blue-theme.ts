/**
 * Slate Blue theme
 * Calm blue-grays with gentle ocean tones
 * For minimal distraction with cool colors
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const SLATE_BLUE_THEME: ITheme = {
  name: "slate-blue",
  description: "Calm blue-grays with gentle ocean tones",

  colors: createThemeColors({
    branch: rgb(100, 116, 139), // Cool slate
    changes: rgb(148, 163, 184), // Neutral slate
    contextLow: rgb(148, 163, 184), // Subtle slate-blue (low)
    contextMedium: rgb(160, 174, 192), // Medium slate
    contextHigh: rgb(175, 188, 201), // Light slate (high)
    linesAdded: rgb(148, 163, 184),
    linesRemoved: rgb(148, 163, 184),
    cost: rgb(156, 163, 175),
    model: rgb(148, 163, 184),
    duration: rgb(100, 116, 139),
    accent: rgb(100, 116, 139),
    cacheHigh: rgb(148, 163, 184),
    cacheMedium: rgb(160, 174, 192),
    cacheLow: rgb(175, 188, 201),
    cacheRead: rgb(100, 116, 139),
    cacheWrite: rgb(148, 163, 184),
  }),
};
