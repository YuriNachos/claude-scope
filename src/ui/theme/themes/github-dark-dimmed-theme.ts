/**
 * GitHub Dark Dimmed theme
 * GitHub's official dark theme (dimmed variant)
 * https://github.com/primer/github-dark-dimmed
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const GITHUB_DARK_DIMMED_THEME: ITheme = {
  name: "github-dark-dimmed",
  description: "GitHub's official dark theme (dimmed)",

  colors: createThemeColors({
    branch: rgb(88, 166, 255), // GitHub blue
    changes: rgb(156, 220, 254), // Light blue
    contextLow: rgb(35, 134, 54), // GitHub green
    contextMedium: rgb(210, 153, 34), // GitHub orange
    contextHigh: rgb(248, 81, 73), // GitHub red
    linesAdded: rgb(35, 134, 54), // GitHub green
    linesRemoved: rgb(248, 81, 73), // GitHub red
    cost: rgb(163, 113, 247), // Purple
    model: rgb(201, 209, 217), // Gray
    duration: rgb(110, 118, 129), // Dark gray
    accent: rgb(88, 166, 255), // GitHub blue
  }),
};
