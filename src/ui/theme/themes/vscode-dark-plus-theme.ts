/**
 * VSCode Dark+ theme
 * Visual Studio Code's default dark theme
 * This will be the DEFAULT theme for claude-scope
 * https://code.visualstudio.com/docs/getstarted/theme-color-reference
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const VSCODE_DARK_PLUS_THEME: ITheme = {
  name: "vscode-dark-plus",
  description: "Visual Studio Code's default dark theme (claude-scope default)",

  colors: createThemeColors({
    branch: rgb(0, 122, 204), // VSCode blue
    changes: rgb(78, 201, 176), // Teal
    contextLow: rgb(78, 201, 176), // Teal
    contextMedium: rgb(220, 220, 170), // Yellow
    contextHigh: rgb(244, 71, 71), // Red
    linesAdded: rgb(78, 201, 176), // Teal
    linesRemoved: rgb(244, 71, 71), // Red
    cost: rgb(206, 145, 120), // Orange
    model: rgb(171, 178, 191), // Gray
    duration: rgb(125, 148, 173), // Dark gray
    accent: rgb(0, 122, 204), // VSCode blue
    cacheHigh: rgb(78, 201, 176), // Teal
    cacheMedium: rgb(220, 220, 170), // Yellow
    cacheLow: rgb(244, 71, 71), // Red
    cacheRead: rgb(0, 122, 204), // VSCode blue
    cacheWrite: rgb(171, 178, 191), // Gray
  }),
};
