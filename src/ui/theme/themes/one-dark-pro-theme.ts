/**
 * One Dark Pro theme
 * Atom's iconic theme
 * https://github.com/one-dark-pro/vim-one-dark-pro
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const ONE_DARK_PRO_THEME: ITheme = {
  name: "one-dark-pro",
  description: "Atom's iconic theme",

  colors: createThemeColors({
    branch: rgb(97, 175, 239), // Blue
    changes: rgb(152, 195, 121), // Green
    contextLow: rgb(152, 195, 121), // Green
    contextMedium: rgb(229, 192, 123), // Yellow
    contextHigh: rgb(224, 108, 117), // Red
    linesAdded: rgb(152, 195, 121), // Green
    linesRemoved: rgb(224, 108, 117), // Red
    cost: rgb(209, 154, 102), // Orange
    model: rgb(171, 178, 191), // Gray
    duration: rgb(125, 148, 173), // Dark gray
    accent: rgb(97, 175, 239), // Blue
  }),
};
