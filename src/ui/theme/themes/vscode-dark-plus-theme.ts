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
    toolsRunning: rgb(251, 191, 36), // Yellow
    toolsCompleted: rgb(74, 222, 128), // Green
    toolsError: rgb(248, 113, 113), // Red
    toolsName: rgb(96, 165, 250), // Blue
    toolsTarget: rgb(156, 163, 175), // Gray
    toolsCount: rgb(167, 139, 250), // Purple
    devServerName: rgb(74, 222, 128), // Green
    devServerStatus: rgb(251, 191, 36), // Yellow
    devServerLabel: rgb(125, 148, 173), // Dark gray
    dockerLabel: rgb(125, 148, 173), // Dark gray
    dockerCount: rgb(96, 165, 250), // Blue
    dockerRunning: rgb(74, 222, 128), // Green
    dockerStopped: rgb(171, 178, 191), // Gray
    sysmonCpu: rgb(248, 113, 113), // Red (alert)
    sysmonRam: rgb(96, 165, 250), // Blue (info)
    sysmonDisk: rgb(251, 191, 36), // Yellow (warning)
    sysmonNetwork: rgb(74, 222, 128), // Green (success)
    sysmonSeparator: rgb(86, 92, 104), // Dark gray
  }),
};
