/**
 * Monokai theme
 * Vibrant, high-contrast
 * https://monokai.pro/
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const MONOKAI_THEME: ITheme = {
  name: "monokai",
  description: "Vibrant, high-contrast",

  colors: createThemeColors({
    branch: rgb(102, 217, 239), // Cyan
    changes: rgb(249, 26, 114), // Pink
    contextLow: rgb(166, 226, 46), // Green
    contextMedium: rgb(253, 151, 31), // Orange
    contextHigh: rgb(249, 26, 114), // Pink
    linesAdded: rgb(166, 226, 46), // Green
    linesRemoved: rgb(249, 26, 114), // Pink
    cost: rgb(254, 128, 25), // Bright orange
    model: rgb(174, 129, 255), // Purple
    duration: rgb(102, 217, 239), // Cyan
    accent: rgb(249, 26, 114), // Pink
  }),
};
