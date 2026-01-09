/**
 * Rosé Pine theme
 * Rose/violet themed
 * https://rosepinetheme.com/
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const ROSE_PINE_THEME: ITheme = {
  name: "rose-pine",
  description: "Rose/violet themed",

  colors: createThemeColors({
    branch: rgb(156, 207, 216), // Pine cyan
    changes: rgb(235, 188, 186), // Rose
    contextLow: rgb(156, 207, 216), // Pine cyan
    contextMedium: rgb(233, 201, 176), // Pine beige
    contextHigh: rgb(235, 111, 146), // Pine red
    linesAdded: rgb(156, 207, 216), // Pine cyan
    linesRemoved: rgb(235, 111, 146), // Pine red
    cost: rgb(226, 185, 218), // Pine pink
    model: rgb(224, 208, 245), // Pine violet
    duration: rgb(148, 137, 176), // Pine mute
    accent: rgb(235, 111, 146), // Pine red
    cacheHigh: rgb(156, 207, 216), // Pine cyan
    cacheMedium: rgb(233, 201, 176), // Pine beige
    cacheLow: rgb(235, 111, 146), // Pine red
    cacheRead: rgb(156, 207, 216), // Pine cyan
    cacheWrite: rgb(224, 208, 245), // Pine violet
    toolsRunning: rgb(233, 201, 176), // Pine beige
    toolsCompleted: rgb(156, 207, 216), // Pine cyan
    toolsError: rgb(235, 111, 146), // Pine red
    toolsName: rgb(156, 207, 216), // Pine cyan
    toolsTarget: rgb(224, 208, 245), // Pine violet
    toolsCount: rgb(226, 185, 218), // Pine pink
  }),
};
