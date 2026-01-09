/**
 * Professional Blue theme
 * Clean, business-oriented blue color scheme
 * Professional and polished appearance
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const PROFESSIONAL_BLUE_THEME: ITheme = {
  name: "professional-blue",
  description: "Clean, business-oriented blue color scheme",

  colors: createThemeColors({
    branch: rgb(37, 99, 235), // Royal blue
    changes: rgb(148, 163, 184), // Slate gray
    contextLow: rgb(96, 165, 250), // Light blue
    contextMedium: rgb(251, 191, 36), // Amber
    contextHigh: rgb(248, 113, 113), // Red
    linesAdded: rgb(74, 222, 128), // Green
    linesRemoved: rgb(248, 113, 113), // Red
    cost: rgb(251, 146, 60), // Orange
    model: rgb(167, 139, 250), // Purple
    duration: rgb(203, 213, 225), // Light gray
    accent: rgb(37, 99, 235), // Royal blue
  }),
};
