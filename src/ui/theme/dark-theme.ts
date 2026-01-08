import { blue, bold, cyan, gray, green, red, white, yellow } from "../utils/colors.js";
import type { ITheme } from "./types.js";

/**
 * Dark theme - vibrant colors on dark background
 * Optimized for terminals with dark backgrounds
 */
export const DARK_THEME: ITheme = {
  name: "dark",
  description: "Dark theme with vibrant colors for dark backgrounds",

  colors: {
    base: {
      text: white,
      muted: gray,
      accent: cyan,
      border: gray,
    },

    semantic: {
      success: green,
      warning: yellow,
      error: red,
      info: blue,
    },

    git: {
      branch: cyan,
      changes: gray,
    },

    context: {
      low: green,
      medium: yellow,
      high: red,
      bar: cyan,
    },

    lines: {
      added: green,
      removed: red,
    },

    cost: {
      amount: yellow,
      currency: gray,
    },

    duration: {
      value: white,
      unit: gray,
    },

    model: {
      name: cyan,
      version: gray,
    },

    poker: {
      participating: bold,
      nonParticipating: gray,
      result: green,
    },
  },
};
