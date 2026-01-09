/**
 * Cyberpunk Neon theme
 * High-contrast neon cyberpunk aesthetic
 * Inspired by cyberpunk 2077 and synthwave visuals
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const CYBERPUNK_NEON_THEME: ITheme = {
  name: "cyberpunk-neon",
  description: "High-contrast neon cyberpunk aesthetic",

  colors: createThemeColors({
    branch: rgb(0, 191, 255), // Cyan neon
    changes: rgb(255, 0, 122), // Magenta neon
    contextLow: rgb(0, 255, 122), // Green neon
    contextMedium: rgb(255, 214, 0), // Yellow neon
    contextHigh: rgb(255, 0, 122), // Magenta neon
    linesAdded: rgb(0, 255, 122), // Green neon
    linesRemoved: rgb(255, 0, 122), // Magenta neon
    cost: rgb(255, 111, 97), // Orange neon
    model: rgb(140, 27, 255), // Purple neon
    duration: rgb(0, 191, 255), // Cyan neon
    accent: rgb(255, 0, 122), // Magenta neon
    cacheHigh: rgb(0, 255, 122), // Green neon
    cacheMedium: rgb(255, 214, 0), // Yellow neon
    cacheLow: rgb(255, 0, 122), // Magenta neon
    cacheRead: rgb(0, 191, 255), // Cyan neon
    cacheWrite: rgb(140, 27, 255), // Purple neon
    toolsRunning: rgb(255, 214, 0), // Yellow neon
    toolsCompleted: rgb(0, 255, 122), // Green neon
    toolsError: rgb(255, 0, 122), // Magenta neon
    toolsName: rgb(0, 191, 255), // Cyan neon
    toolsTarget: rgb(140, 27, 255), // Purple neon
    toolsCount: rgb(255, 111, 97), // Orange neon
  }),
};
