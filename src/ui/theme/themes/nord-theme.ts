/**
 * Nord theme
 * Arctic, north-bluish color palette
 * https://www.nordtheme.com/
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const NORD_THEME: ITheme = {
  name: "nord",
  description: "Arctic, north-bluish color palette",

  colors: createThemeColors({
    branch: rgb(136, 192, 208), // Nordic cyan
    changes: rgb(143, 188, 187), // Nordic blue-gray
    contextLow: rgb(163, 190, 140), // Nordic green
    contextMedium: rgb(235, 203, 139), // Nordic yellow
    contextHigh: rgb(191, 97, 106), // Nordic red
    linesAdded: rgb(163, 190, 140), // Nordic green
    linesRemoved: rgb(191, 97, 106), // Nordic red
    cost: rgb(216, 222, 233), // Nordic white
    model: rgb(129, 161, 193), // Nordic blue
    duration: rgb(94, 129, 172), // Nordic dark blue
    accent: rgb(136, 192, 208), // Nordic cyan
    cacheHigh: rgb(163, 190, 140), // Nordic green
    cacheMedium: rgb(235, 203, 139), // Nordic yellow
    cacheLow: rgb(191, 97, 106), // Nordic red
    cacheRead: rgb(136, 192, 208), // Nordic cyan
    cacheWrite: rgb(129, 161, 193), // Nordic blue
    toolsRunning: rgb(235, 203, 139), // Nordic yellow
    toolsCompleted: rgb(163, 190, 140), // Nordic green
    toolsError: rgb(191, 97, 106), // Nordic red
    toolsName: rgb(136, 192, 208), // Nordic cyan
    toolsTarget: rgb(129, 161, 193), // Nordic blue
    toolsCount: rgb(216, 222, 233), // Nordic white
    devServerName: rgb(163, 190, 140), // Nordic green
    devServerStatus: rgb(235, 203, 139), // Nordic yellow
    devServerLabel: rgb(136, 192, 208), // Nordic cyan
    dockerLabel: rgb(136, 192, 208), // Nordic cyan
    dockerCount: rgb(216, 222, 233), // Nordic white
    dockerRunning: rgb(163, 190, 140), // Nordic green
    dockerStopped: rgb(191, 97, 106), // Nordic red
    sysmonCpu: rgb(191, 97, 106), // Nordic red (alert)
    sysmonRam: rgb(136, 192, 208), // Nordic cyan (info)
    sysmonDisk: rgb(235, 203, 139), // Nordic yellow (warning)
    sysmonNetwork: rgb(163, 190, 140), // Nordic green (success)
    sysmonSeparator: rgb(76, 86, 106), // Nordic dark gray
  }),
};
