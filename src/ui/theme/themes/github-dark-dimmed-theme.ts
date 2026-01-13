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
    cacheHigh: rgb(35, 134, 54), // GitHub green
    cacheMedium: rgb(210, 153, 34), // GitHub orange
    cacheLow: rgb(248, 81, 73), // GitHub red
    cacheRead: rgb(88, 166, 255), // GitHub blue
    cacheWrite: rgb(163, 113, 247), // Purple
    toolsRunning: rgb(210, 153, 34), // GitHub orange
    toolsCompleted: rgb(35, 134, 54), // GitHub green
    toolsError: rgb(248, 81, 73), // GitHub red
    toolsName: rgb(88, 166, 255), // GitHub blue
    toolsTarget: rgb(201, 209, 217), // Gray
    toolsCount: rgb(163, 113, 247), // Purple
    devServerName: rgb(35, 134, 54), // GitHub green
    devServerStatus: rgb(210, 153, 34), // GitHub orange
    devServerLabel: rgb(88, 166, 255), // GitHub blue
    dockerLabel: rgb(88, 166, 255), // GitHub blue
    dockerCount: rgb(163, 113, 247), // Purple
    dockerRunning: rgb(35, 134, 54), // GitHub green
    dockerStopped: rgb(248, 81, 73), // GitHub red
    sysmonCpu: rgb(248, 81, 73), // GitHub red (alert)
    sysmonRam: rgb(88, 166, 255), // GitHub blue (info)
    sysmonDisk: rgb(210, 153, 34), // GitHub orange (warning)
    sysmonNetwork: rgb(35, 134, 54), // GitHub green (success)
    sysmonSeparator: rgb(73, 79, 91), // Dark gray
  }),
};
