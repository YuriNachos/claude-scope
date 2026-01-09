/**
 * Dusty Sage theme
 * Earthy muted greens with peaceful forest fog aesthetic
 * For minimal distraction with warm nature tones
 */

import { createThemeColors, rgb } from "../helpers.js";
import type { ITheme } from "../types.js";

export const DUSTY_SAGE_THEME: ITheme = {
  name: "dusty-sage",
  description: "Earthy muted greens with peaceful forest fog aesthetic",

  colors: createThemeColors({
    branch: rgb(120, 140, 130), // Dusty green
    changes: rgb(135, 145, 140), // Sage gray
    contextLow: rgb(135, 145, 140), // Subtle sage (low)
    contextMedium: rgb(150, 160, 145), // Medium sage
    contextHigh: rgb(165, 175, 160), // Light sage (high)
    linesAdded: rgb(135, 145, 140),
    linesRemoved: rgb(135, 145, 140),
    cost: rgb(156, 163, 175),
    model: rgb(148, 163, 184),
    duration: rgb(120, 130, 140),
    accent: rgb(120, 140, 130),
    cacheHigh: rgb(135, 145, 140),
    cacheMedium: rgb(150, 160, 145),
    cacheLow: rgb(165, 175, 160),
    cacheRead: rgb(120, 140, 130),
    cacheWrite: rgb(148, 163, 184),
  }),
};
