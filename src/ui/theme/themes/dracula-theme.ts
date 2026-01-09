/**
 * Dracula theme
 * Purple/pink accent theme
 * https://draculatheme.com/
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const DRACULA_THEME: ITheme = {
  name: "dracula",
  description: "Purple/pink accent theme",

  colors: createThemeColors({
    branch: rgb(189, 147, 249), // Purple
    changes: rgb(139, 233, 253), // Cyan
    contextLow: rgb(80, 250, 123), // Green
    contextMedium: rgb(241, 250, 140), // Yellow
    contextHigh: rgb(255, 85, 85), // Red
    linesAdded: rgb(80, 250, 123), // Green
    linesRemoved: rgb(255, 85, 85), // Red
    cost: rgb(255, 184, 108), // Orange
    model: rgb(98, 114, 164), // Comment gray
    duration: rgb(68, 71, 90), // Selection gray
    accent: rgb(189, 147, 249), // Purple
    cacheHigh: rgb(80, 250, 123), // Green
    cacheMedium: rgb(241, 250, 140), // Yellow
    cacheLow: rgb(255, 85, 85), // Red
    cacheRead: rgb(139, 233, 253), // Cyan
    cacheWrite: rgb(189, 147, 249), // Purple
    toolsRunning: rgb(241, 250, 140), // Yellow
    toolsCompleted: rgb(80, 250, 123), // Green
    toolsError: rgb(255, 85, 85), // Red
    toolsName: rgb(139, 233, 253), // Cyan
    toolsTarget: rgb(98, 114, 164), // Gray
    toolsCount: rgb(189, 147, 249), // Purple
  }),
};
