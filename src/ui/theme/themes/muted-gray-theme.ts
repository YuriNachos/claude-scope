/**
 * Muted Gray theme
 * Very subtle grays - progress bar almost invisible
 * For minimal visual distraction
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const MUTED_GRAY_THEME: ITheme = {
  name: "muted-gray",
  description: "Very subtle grays with almost invisible progress bar",

  colors: createThemeColors({
    branch: rgb(156, 163, 175), // Slate gray
    changes: rgb(148, 163, 184), // Lighter slate
    contextLow: rgb(148, 163, 184), // Subtle gray (low)
    contextMedium: rgb(160, 174, 192), // Medium gray
    contextHigh: rgb(175, 188, 201), // Light gray (high)
    linesAdded: rgb(148, 163, 184),
    linesRemoved: rgb(148, 163, 184),
    cost: rgb(156, 163, 175),
    model: rgb(148, 163, 184),
    duration: rgb(107, 114, 128),
    accent: rgb(156, 163, 175),
  }),
};
