#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ui/utils/colors.ts
function colorize(text, color) {
  return `${color}${text}${reset}`;
}
var reset, red, gray, lightGray, bold;
var init_colors = __esm({
  "src/ui/utils/colors.ts"() {
    "use strict";
    reset = "\x1B[0m";
    red = "\x1B[31m";
    gray = "\x1B[90m";
    lightGray = "\x1B[37m";
    bold = "\x1B[1m";
  }
});

// src/ui/theme/helpers.ts
function rgb(r, g, b) {
  return `\x1B[38;2;${r};${g};${b}m`;
}
function createBaseColors(params) {
  return {
    text: params.modelColor,
    muted: params.durationColor,
    accent: params.accentColor,
    border: params.durationColor
  };
}
function createSemanticColors(params) {
  return {
    success: params.contextLow,
    warning: params.contextMedium,
    error: params.contextHigh,
    info: params.branchColor
  };
}
function createThemeColors(params) {
  const base = createBaseColors({
    modelColor: params.model,
    durationColor: params.duration,
    accentColor: params.accent
  });
  const semantic = createSemanticColors({
    contextLow: params.contextLow,
    contextMedium: params.contextMedium,
    contextHigh: params.contextHigh,
    branchColor: params.branch
  });
  return {
    base,
    semantic,
    git: {
      branch: params.branch,
      changes: params.changes
    },
    context: {
      low: params.contextLow,
      medium: params.contextMedium,
      high: params.contextHigh,
      bar: params.contextLow
    },
    lines: {
      added: params.linesAdded,
      removed: params.linesRemoved
    },
    cost: {
      amount: params.cost,
      currency: params.cost
    },
    duration: {
      value: params.duration,
      unit: params.duration
    },
    model: {
      name: params.model,
      version: params.model
    },
    poker: {
      participating: params.model,
      nonParticipating: params.duration,
      result: params.accent
    },
    cache: {
      high: params.cacheHigh,
      medium: params.cacheMedium,
      low: params.cacheLow,
      read: params.cacheRead,
      write: params.cacheWrite
    },
    tools: {
      running: params.toolsRunning,
      completed: params.toolsCompleted,
      error: params.toolsError,
      name: params.toolsName,
      target: params.toolsTarget,
      count: params.toolsCount
    }
  };
}
var init_helpers = __esm({
  "src/ui/theme/helpers.ts"() {
    "use strict";
  }
});

// src/ui/theme/gray-theme.ts
var GRAY_THEME;
var init_gray_theme = __esm({
  "src/ui/theme/gray-theme.ts"() {
    "use strict";
    init_colors();
    init_helpers();
    GRAY_THEME = {
      name: "gray",
      description: "Neutral gray theme for minimal color distraction",
      colors: createThemeColors({
        branch: gray,
        changes: gray,
        contextLow: gray,
        contextMedium: gray,
        contextHigh: gray,
        linesAdded: gray,
        linesRemoved: gray,
        cost: gray,
        model: gray,
        duration: gray,
        accent: gray,
        cacheHigh: gray,
        cacheMedium: gray,
        cacheLow: gray,
        cacheRead: gray,
        cacheWrite: gray,
        toolsRunning: gray,
        toolsCompleted: gray,
        toolsError: gray,
        toolsName: gray,
        toolsTarget: gray,
        toolsCount: gray
      })
    };
  }
});

// src/ui/theme/themes/catppuccin-mocha-theme.ts
var CATPPUCCIN_MOCHA_THEME;
var init_catppuccin_mocha_theme = __esm({
  "src/ui/theme/themes/catppuccin-mocha-theme.ts"() {
    "use strict";
    init_helpers();
    CATPPUCCIN_MOCHA_THEME = {
      name: "catppuccin-mocha",
      description: "Soothing pastel theme",
      colors: createThemeColors({
        branch: rgb(137, 180, 250),
        // Blue
        changes: rgb(166, 227, 161),
        // Green
        contextLow: rgb(166, 227, 161),
        // Green
        contextMedium: rgb(238, 212, 159),
        // Yellow
        contextHigh: rgb(243, 139, 168),
        // Red
        linesAdded: rgb(166, 227, 161),
        // Green
        linesRemoved: rgb(243, 139, 168),
        // Red
        cost: rgb(245, 224, 220),
        // Rosewater
        model: rgb(203, 166, 247),
        // Mauve
        duration: rgb(147, 153, 178),
        // Text gray
        accent: rgb(243, 139, 168),
        // Pink
        cacheHigh: rgb(166, 227, 161),
        // Green
        cacheMedium: rgb(238, 212, 159),
        // Yellow
        cacheLow: rgb(243, 139, 168),
        // Red
        cacheRead: rgb(137, 180, 250),
        // Blue
        cacheWrite: rgb(203, 166, 247),
        // Mauve
        toolsRunning: rgb(238, 212, 159),
        // Yellow
        toolsCompleted: rgb(166, 227, 161),
        // Green
        toolsError: rgb(243, 139, 168),
        // Red
        toolsName: rgb(137, 180, 250),
        // Blue
        toolsTarget: rgb(147, 153, 178),
        // Gray
        toolsCount: rgb(203, 166, 247)
        // Mauve
      })
    };
  }
});

// src/ui/theme/themes/cyberpunk-neon-theme.ts
var CYBERPUNK_NEON_THEME;
var init_cyberpunk_neon_theme = __esm({
  "src/ui/theme/themes/cyberpunk-neon-theme.ts"() {
    "use strict";
    init_helpers();
    CYBERPUNK_NEON_THEME = {
      name: "cyberpunk-neon",
      description: "High-contrast neon cyberpunk aesthetic",
      colors: createThemeColors({
        branch: rgb(0, 191, 255),
        // Cyan neon
        changes: rgb(255, 0, 122),
        // Magenta neon
        contextLow: rgb(0, 255, 122),
        // Green neon
        contextMedium: rgb(255, 214, 0),
        // Yellow neon
        contextHigh: rgb(255, 0, 122),
        // Magenta neon
        linesAdded: rgb(0, 255, 122),
        // Green neon
        linesRemoved: rgb(255, 0, 122),
        // Magenta neon
        cost: rgb(255, 111, 97),
        // Orange neon
        model: rgb(140, 27, 255),
        // Purple neon
        duration: rgb(0, 191, 255),
        // Cyan neon
        accent: rgb(255, 0, 122),
        // Magenta neon
        cacheHigh: rgb(0, 255, 122),
        // Green neon
        cacheMedium: rgb(255, 214, 0),
        // Yellow neon
        cacheLow: rgb(255, 0, 122),
        // Magenta neon
        cacheRead: rgb(0, 191, 255),
        // Cyan neon
        cacheWrite: rgb(140, 27, 255),
        // Purple neon
        toolsRunning: rgb(255, 214, 0),
        // Yellow neon
        toolsCompleted: rgb(0, 255, 122),
        // Green neon
        toolsError: rgb(255, 0, 122),
        // Magenta neon
        toolsName: rgb(0, 191, 255),
        // Cyan neon
        toolsTarget: rgb(140, 27, 255),
        // Purple neon
        toolsCount: rgb(255, 111, 97)
        // Orange neon
      })
    };
  }
});

// src/ui/theme/themes/dracula-theme.ts
var DRACULA_THEME;
var init_dracula_theme = __esm({
  "src/ui/theme/themes/dracula-theme.ts"() {
    "use strict";
    init_helpers();
    DRACULA_THEME = {
      name: "dracula",
      description: "Purple/pink accent theme",
      colors: createThemeColors({
        branch: rgb(189, 147, 249),
        // Purple
        changes: rgb(139, 233, 253),
        // Cyan
        contextLow: rgb(80, 250, 123),
        // Green
        contextMedium: rgb(241, 250, 140),
        // Yellow
        contextHigh: rgb(255, 85, 85),
        // Red
        linesAdded: rgb(80, 250, 123),
        // Green
        linesRemoved: rgb(255, 85, 85),
        // Red
        cost: rgb(255, 184, 108),
        // Orange
        model: rgb(98, 114, 164),
        // Comment gray
        duration: rgb(68, 71, 90),
        // Selection gray
        accent: rgb(189, 147, 249),
        // Purple
        cacheHigh: rgb(80, 250, 123),
        // Green
        cacheMedium: rgb(241, 250, 140),
        // Yellow
        cacheLow: rgb(255, 85, 85),
        // Red
        cacheRead: rgb(139, 233, 253),
        // Cyan
        cacheWrite: rgb(189, 147, 249),
        // Purple
        toolsRunning: rgb(241, 250, 140),
        // Yellow
        toolsCompleted: rgb(80, 250, 123),
        // Green
        toolsError: rgb(255, 85, 85),
        // Red
        toolsName: rgb(139, 233, 253),
        // Cyan
        toolsTarget: rgb(98, 114, 164),
        // Gray
        toolsCount: rgb(189, 147, 249)
        // Purple
      })
    };
  }
});

// src/ui/theme/themes/dusty-sage-theme.ts
var DUSTY_SAGE_THEME;
var init_dusty_sage_theme = __esm({
  "src/ui/theme/themes/dusty-sage-theme.ts"() {
    "use strict";
    init_helpers();
    DUSTY_SAGE_THEME = {
      name: "dusty-sage",
      description: "Earthy muted greens with peaceful forest fog aesthetic",
      colors: createThemeColors({
        branch: rgb(120, 140, 130),
        // Dusty green
        changes: rgb(135, 145, 140),
        // Sage gray
        contextLow: rgb(135, 145, 140),
        // Subtle sage (low)
        contextMedium: rgb(150, 160, 145),
        // Medium sage
        contextHigh: rgb(165, 175, 160),
        // Light sage (high)
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
        toolsRunning: rgb(150, 160, 145),
        // Medium sage
        toolsCompleted: rgb(135, 145, 140),
        // Subtle sage
        toolsError: rgb(165, 175, 160),
        // Light sage
        toolsName: rgb(120, 140, 130),
        // Dusty green
        toolsTarget: rgb(148, 163, 184),
        // Gray
        toolsCount: rgb(156, 163, 175)
        // Light gray
      })
    };
  }
});

// src/ui/theme/themes/github-dark-dimmed-theme.ts
var GITHUB_DARK_DIMMED_THEME;
var init_github_dark_dimmed_theme = __esm({
  "src/ui/theme/themes/github-dark-dimmed-theme.ts"() {
    "use strict";
    init_helpers();
    GITHUB_DARK_DIMMED_THEME = {
      name: "github-dark-dimmed",
      description: "GitHub's official dark theme (dimmed)",
      colors: createThemeColors({
        branch: rgb(88, 166, 255),
        // GitHub blue
        changes: rgb(156, 220, 254),
        // Light blue
        contextLow: rgb(35, 134, 54),
        // GitHub green
        contextMedium: rgb(210, 153, 34),
        // GitHub orange
        contextHigh: rgb(248, 81, 73),
        // GitHub red
        linesAdded: rgb(35, 134, 54),
        // GitHub green
        linesRemoved: rgb(248, 81, 73),
        // GitHub red
        cost: rgb(163, 113, 247),
        // Purple
        model: rgb(201, 209, 217),
        // Gray
        duration: rgb(110, 118, 129),
        // Dark gray
        accent: rgb(88, 166, 255),
        // GitHub blue
        cacheHigh: rgb(35, 134, 54),
        // GitHub green
        cacheMedium: rgb(210, 153, 34),
        // GitHub orange
        cacheLow: rgb(248, 81, 73),
        // GitHub red
        cacheRead: rgb(88, 166, 255),
        // GitHub blue
        cacheWrite: rgb(163, 113, 247),
        // Purple
        toolsRunning: rgb(210, 153, 34),
        // GitHub orange
        toolsCompleted: rgb(35, 134, 54),
        // GitHub green
        toolsError: rgb(248, 81, 73),
        // GitHub red
        toolsName: rgb(88, 166, 255),
        // GitHub blue
        toolsTarget: rgb(201, 209, 217),
        // Gray
        toolsCount: rgb(163, 113, 247)
        // Purple
      })
    };
  }
});

// src/ui/theme/themes/monokai-theme.ts
var MONOKAI_THEME;
var init_monokai_theme = __esm({
  "src/ui/theme/themes/monokai-theme.ts"() {
    "use strict";
    init_helpers();
    MONOKAI_THEME = {
      name: "monokai",
      description: "Vibrant, high-contrast",
      colors: createThemeColors({
        branch: rgb(102, 217, 239),
        // Cyan
        changes: rgb(249, 26, 114),
        // Pink
        contextLow: rgb(166, 226, 46),
        // Green
        contextMedium: rgb(253, 151, 31),
        // Orange
        contextHigh: rgb(249, 26, 114),
        // Pink
        linesAdded: rgb(166, 226, 46),
        // Green
        linesRemoved: rgb(249, 26, 114),
        // Pink
        cost: rgb(254, 128, 25),
        // Bright orange
        model: rgb(174, 129, 255),
        // Purple
        duration: rgb(102, 217, 239),
        // Cyan
        accent: rgb(249, 26, 114),
        // Pink
        cacheHigh: rgb(166, 226, 46),
        // Green
        cacheMedium: rgb(253, 151, 31),
        // Orange
        cacheLow: rgb(249, 26, 114),
        // Pink
        cacheRead: rgb(102, 217, 239),
        // Cyan
        cacheWrite: rgb(174, 129, 255),
        // Purple
        toolsRunning: rgb(253, 151, 31),
        // Orange
        toolsCompleted: rgb(166, 226, 46),
        // Green
        toolsError: rgb(249, 26, 114),
        // Pink
        toolsName: rgb(102, 217, 239),
        // Cyan
        toolsTarget: rgb(174, 129, 255),
        // Purple
        toolsCount: rgb(254, 128, 25)
        // Bright orange
      })
    };
  }
});

// src/ui/theme/themes/muted-gray-theme.ts
var MUTED_GRAY_THEME;
var init_muted_gray_theme = __esm({
  "src/ui/theme/themes/muted-gray-theme.ts"() {
    "use strict";
    init_helpers();
    MUTED_GRAY_THEME = {
      name: "muted-gray",
      description: "Very subtle grays with almost invisible progress bar",
      colors: createThemeColors({
        branch: rgb(156, 163, 175),
        // Slate gray
        changes: rgb(148, 163, 184),
        // Lighter slate
        contextLow: rgb(148, 163, 184),
        // Subtle gray (low)
        contextMedium: rgb(160, 174, 192),
        // Medium gray
        contextHigh: rgb(175, 188, 201),
        // Light gray (high)
        linesAdded: rgb(148, 163, 184),
        linesRemoved: rgb(148, 163, 184),
        cost: rgb(156, 163, 175),
        model: rgb(148, 163, 184),
        duration: rgb(107, 114, 128),
        accent: rgb(156, 163, 175),
        cacheHigh: rgb(148, 163, 184),
        cacheMedium: rgb(160, 174, 192),
        cacheLow: rgb(175, 188, 201),
        cacheRead: rgb(156, 163, 175),
        cacheWrite: rgb(148, 163, 184),
        toolsRunning: rgb(160, 174, 192),
        // Medium gray
        toolsCompleted: rgb(148, 163, 184),
        // Subtle gray
        toolsError: rgb(175, 188, 201),
        // Light gray
        toolsName: rgb(156, 163, 175),
        // Slate gray
        toolsTarget: rgb(148, 163, 184),
        // Lighter slate
        toolsCount: rgb(156, 163, 175)
        // Slate gray
      })
    };
  }
});

// src/ui/theme/themes/nord-theme.ts
var NORD_THEME;
var init_nord_theme = __esm({
  "src/ui/theme/themes/nord-theme.ts"() {
    "use strict";
    init_helpers();
    NORD_THEME = {
      name: "nord",
      description: "Arctic, north-bluish color palette",
      colors: createThemeColors({
        branch: rgb(136, 192, 208),
        // Nordic cyan
        changes: rgb(143, 188, 187),
        // Nordic blue-gray
        contextLow: rgb(163, 190, 140),
        // Nordic green
        contextMedium: rgb(235, 203, 139),
        // Nordic yellow
        contextHigh: rgb(191, 97, 106),
        // Nordic red
        linesAdded: rgb(163, 190, 140),
        // Nordic green
        linesRemoved: rgb(191, 97, 106),
        // Nordic red
        cost: rgb(216, 222, 233),
        // Nordic white
        model: rgb(129, 161, 193),
        // Nordic blue
        duration: rgb(94, 129, 172),
        // Nordic dark blue
        accent: rgb(136, 192, 208),
        // Nordic cyan
        cacheHigh: rgb(163, 190, 140),
        // Nordic green
        cacheMedium: rgb(235, 203, 139),
        // Nordic yellow
        cacheLow: rgb(191, 97, 106),
        // Nordic red
        cacheRead: rgb(136, 192, 208),
        // Nordic cyan
        cacheWrite: rgb(129, 161, 193),
        // Nordic blue
        toolsRunning: rgb(235, 203, 139),
        // Nordic yellow
        toolsCompleted: rgb(163, 190, 140),
        // Nordic green
        toolsError: rgb(191, 97, 106),
        // Nordic red
        toolsName: rgb(136, 192, 208),
        // Nordic cyan
        toolsTarget: rgb(129, 161, 193),
        // Nordic blue
        toolsCount: rgb(216, 222, 233)
        // Nordic white
      })
    };
  }
});

// src/ui/theme/themes/one-dark-pro-theme.ts
var ONE_DARK_PRO_THEME;
var init_one_dark_pro_theme = __esm({
  "src/ui/theme/themes/one-dark-pro-theme.ts"() {
    "use strict";
    init_helpers();
    ONE_DARK_PRO_THEME = {
      name: "one-dark-pro",
      description: "Atom's iconic theme",
      colors: createThemeColors({
        branch: rgb(97, 175, 239),
        // Blue
        changes: rgb(152, 195, 121),
        // Green
        contextLow: rgb(152, 195, 121),
        // Green
        contextMedium: rgb(229, 192, 123),
        // Yellow
        contextHigh: rgb(224, 108, 117),
        // Red
        linesAdded: rgb(152, 195, 121),
        // Green
        linesRemoved: rgb(224, 108, 117),
        // Red
        cost: rgb(209, 154, 102),
        // Orange
        model: rgb(171, 178, 191),
        // Gray
        duration: rgb(125, 148, 173),
        // Dark gray
        accent: rgb(97, 175, 239),
        // Blue
        cacheHigh: rgb(152, 195, 121),
        // Green
        cacheMedium: rgb(229, 192, 123),
        // Yellow
        cacheLow: rgb(224, 108, 117),
        // Red
        cacheRead: rgb(97, 175, 239),
        // Blue
        cacheWrite: rgb(171, 178, 191),
        // Gray
        toolsRunning: rgb(229, 192, 123),
        // Yellow
        toolsCompleted: rgb(152, 195, 121),
        // Green
        toolsError: rgb(224, 108, 117),
        // Red
        toolsName: rgb(97, 175, 239),
        // Blue
        toolsTarget: rgb(171, 178, 191),
        // Gray
        toolsCount: rgb(209, 154, 102)
        // Orange
      })
    };
  }
});

// src/ui/theme/themes/professional-blue-theme.ts
var PROFESSIONAL_BLUE_THEME;
var init_professional_blue_theme = __esm({
  "src/ui/theme/themes/professional-blue-theme.ts"() {
    "use strict";
    init_helpers();
    PROFESSIONAL_BLUE_THEME = {
      name: "professional-blue",
      description: "Clean, business-oriented blue color scheme",
      colors: createThemeColors({
        branch: rgb(37, 99, 235),
        // Royal blue
        changes: rgb(148, 163, 184),
        // Slate gray
        contextLow: rgb(96, 165, 250),
        // Light blue
        contextMedium: rgb(251, 191, 36),
        // Amber
        contextHigh: rgb(248, 113, 113),
        // Red
        linesAdded: rgb(74, 222, 128),
        // Green
        linesRemoved: rgb(248, 113, 113),
        // Red
        cost: rgb(251, 146, 60),
        // Orange
        model: rgb(167, 139, 250),
        // Purple
        duration: rgb(203, 213, 225),
        // Light gray
        accent: rgb(37, 99, 235),
        // Royal blue
        cacheHigh: rgb(74, 222, 128),
        // Green
        cacheMedium: rgb(251, 191, 36),
        // Amber
        cacheLow: rgb(248, 113, 113),
        // Red
        cacheRead: rgb(96, 165, 250),
        // Light blue
        cacheWrite: rgb(167, 139, 250),
        // Purple
        toolsRunning: rgb(251, 191, 36),
        // Amber
        toolsCompleted: rgb(74, 222, 128),
        // Green
        toolsError: rgb(248, 113, 113),
        // Red
        toolsName: rgb(37, 99, 235),
        // Royal blue
        toolsTarget: rgb(148, 163, 184),
        // Slate gray
        toolsCount: rgb(167, 139, 250)
        // Purple
      })
    };
  }
});

// src/ui/theme/themes/rose-pine-theme.ts
var ROSE_PINE_THEME;
var init_rose_pine_theme = __esm({
  "src/ui/theme/themes/rose-pine-theme.ts"() {
    "use strict";
    init_helpers();
    ROSE_PINE_THEME = {
      name: "rose-pine",
      description: "Rose/violet themed",
      colors: createThemeColors({
        branch: rgb(156, 207, 216),
        // Pine cyan
        changes: rgb(235, 188, 186),
        // Rose
        contextLow: rgb(156, 207, 216),
        // Pine cyan
        contextMedium: rgb(233, 201, 176),
        // Pine beige
        contextHigh: rgb(235, 111, 146),
        // Pine red
        linesAdded: rgb(156, 207, 216),
        // Pine cyan
        linesRemoved: rgb(235, 111, 146),
        // Pine red
        cost: rgb(226, 185, 218),
        // Pine pink
        model: rgb(224, 208, 245),
        // Pine violet
        duration: rgb(148, 137, 176),
        // Pine mute
        accent: rgb(235, 111, 146),
        // Pine red
        cacheHigh: rgb(156, 207, 216),
        // Pine cyan
        cacheMedium: rgb(233, 201, 176),
        // Pine beige
        cacheLow: rgb(235, 111, 146),
        // Pine red
        cacheRead: rgb(156, 207, 216),
        // Pine cyan
        cacheWrite: rgb(224, 208, 245),
        // Pine violet
        toolsRunning: rgb(233, 201, 176),
        // Pine beige
        toolsCompleted: rgb(156, 207, 216),
        // Pine cyan
        toolsError: rgb(235, 111, 146),
        // Pine red
        toolsName: rgb(156, 207, 216),
        // Pine cyan
        toolsTarget: rgb(224, 208, 245),
        // Pine violet
        toolsCount: rgb(226, 185, 218)
        // Pine pink
      })
    };
  }
});

// src/ui/theme/themes/semantic-classic-theme.ts
var SEMANTIC_CLASSIC_THEME;
var init_semantic_classic_theme = __esm({
  "src/ui/theme/themes/semantic-classic-theme.ts"() {
    "use strict";
    init_helpers();
    SEMANTIC_CLASSIC_THEME = {
      name: "semantic-classic",
      description: "Industry-standard semantic colors for maximum clarity",
      colors: createThemeColors({
        branch: rgb(59, 130, 246),
        // Blue
        changes: rgb(107, 114, 128),
        // Gray
        contextLow: rgb(34, 197, 94),
        // Green
        contextMedium: rgb(234, 179, 8),
        // Yellow
        contextHigh: rgb(239, 68, 68),
        // Red
        linesAdded: rgb(34, 197, 94),
        // Green
        linesRemoved: rgb(239, 68, 68),
        // Red
        cost: rgb(249, 115, 22),
        // Orange
        model: rgb(99, 102, 241),
        // Indigo
        duration: rgb(107, 114, 128),
        // Gray
        accent: rgb(59, 130, 246),
        // Blue
        cacheHigh: rgb(34, 197, 94),
        // Green
        cacheMedium: rgb(234, 179, 8),
        // Yellow
        cacheLow: rgb(239, 68, 68),
        // Red
        cacheRead: rgb(59, 130, 246),
        // Blue
        cacheWrite: rgb(99, 102, 241),
        // Indigo
        toolsRunning: rgb(234, 179, 8),
        // Yellow
        toolsCompleted: rgb(34, 197, 94),
        // Green
        toolsError: rgb(239, 68, 68),
        // Red
        toolsName: rgb(59, 130, 246),
        // Blue
        toolsTarget: rgb(107, 114, 128),
        // Gray
        toolsCount: rgb(99, 102, 241)
        // Indigo
      })
    };
  }
});

// src/ui/theme/themes/slate-blue-theme.ts
var SLATE_BLUE_THEME;
var init_slate_blue_theme = __esm({
  "src/ui/theme/themes/slate-blue-theme.ts"() {
    "use strict";
    init_helpers();
    SLATE_BLUE_THEME = {
      name: "slate-blue",
      description: "Calm blue-grays with gentle ocean tones",
      colors: createThemeColors({
        branch: rgb(100, 116, 139),
        // Cool slate
        changes: rgb(148, 163, 184),
        // Neutral slate
        contextLow: rgb(148, 163, 184),
        // Subtle slate-blue (low)
        contextMedium: rgb(160, 174, 192),
        // Medium slate
        contextHigh: rgb(175, 188, 201),
        // Light slate (high)
        linesAdded: rgb(148, 163, 184),
        linesRemoved: rgb(148, 163, 184),
        cost: rgb(156, 163, 175),
        model: rgb(148, 163, 184),
        duration: rgb(100, 116, 139),
        accent: rgb(100, 116, 139),
        cacheHigh: rgb(148, 163, 184),
        cacheMedium: rgb(160, 174, 192),
        cacheLow: rgb(175, 188, 201),
        cacheRead: rgb(100, 116, 139),
        cacheWrite: rgb(148, 163, 184),
        toolsRunning: rgb(160, 174, 192),
        // Medium slate
        toolsCompleted: rgb(148, 163, 184),
        // Subtle slate-blue
        toolsError: rgb(175, 188, 201),
        // Light slate
        toolsName: rgb(100, 116, 139),
        // Cool slate
        toolsTarget: rgb(148, 163, 184),
        // Neutral slate
        toolsCount: rgb(156, 163, 175)
        // Light slate
      })
    };
  }
});

// src/ui/theme/themes/solarized-dark-theme.ts
var SOLARIZED_DARK_THEME;
var init_solarized_dark_theme = __esm({
  "src/ui/theme/themes/solarized-dark-theme.ts"() {
    "use strict";
    init_helpers();
    SOLARIZED_DARK_THEME = {
      name: "solarized-dark",
      description: "Precise CIELAB lightness",
      colors: createThemeColors({
        branch: rgb(38, 139, 210),
        // Blue
        changes: rgb(133, 153, 0),
        // Olive
        contextLow: rgb(133, 153, 0),
        // Olive
        contextMedium: rgb(181, 137, 0),
        // Yellow
        contextHigh: rgb(220, 50, 47),
        // Red
        linesAdded: rgb(133, 153, 0),
        // Olive
        linesRemoved: rgb(220, 50, 47),
        // Red
        cost: rgb(203, 75, 22),
        // Orange
        model: rgb(131, 148, 150),
        // Base0
        duration: rgb(88, 110, 117),
        // Base01
        accent: rgb(38, 139, 210),
        // Blue
        cacheHigh: rgb(133, 153, 0),
        // Olive
        cacheMedium: rgb(181, 137, 0),
        // Yellow
        cacheLow: rgb(220, 50, 47),
        // Red
        cacheRead: rgb(38, 139, 210),
        // Blue
        cacheWrite: rgb(147, 161, 161),
        // Base1
        toolsRunning: rgb(181, 137, 0),
        // Yellow
        toolsCompleted: rgb(133, 153, 0),
        // Olive
        toolsError: rgb(220, 50, 47),
        // Red
        toolsName: rgb(38, 139, 210),
        // Blue
        toolsTarget: rgb(131, 148, 150),
        // Base0
        toolsCount: rgb(203, 75, 22)
        // Orange
      })
    };
  }
});

// src/ui/theme/themes/tokyo-night-theme.ts
var TOKYO_NIGHT_THEME;
var init_tokyo_night_theme = __esm({
  "src/ui/theme/themes/tokyo-night-theme.ts"() {
    "use strict";
    init_helpers();
    TOKYO_NIGHT_THEME = {
      name: "tokyo-night",
      description: "Clean, dark Tokyo-inspired",
      colors: createThemeColors({
        branch: rgb(122, 132, 173),
        // Blue
        changes: rgb(122, 162, 247),
        // Dark blue
        contextLow: rgb(146, 180, 203),
        // Cyan
        contextMedium: rgb(232, 166, 162),
        // Pink-red
        contextHigh: rgb(249, 86, 119),
        // Red
        linesAdded: rgb(146, 180, 203),
        // Cyan
        linesRemoved: rgb(249, 86, 119),
        // Red
        cost: rgb(158, 206, 209),
        // Teal
        model: rgb(169, 177, 214),
        // White-ish
        duration: rgb(113, 119, 161),
        // Dark blue-gray
        accent: rgb(122, 132, 173),
        // Blue
        cacheHigh: rgb(146, 180, 203),
        // Cyan
        cacheMedium: rgb(232, 166, 162),
        // Pink-red
        cacheLow: rgb(249, 86, 119),
        // Red
        cacheRead: rgb(122, 132, 173),
        // Blue
        cacheWrite: rgb(169, 177, 214),
        // White-ish
        toolsRunning: rgb(232, 166, 162),
        // Pink-red
        toolsCompleted: rgb(146, 180, 203),
        // Cyan
        toolsError: rgb(249, 86, 119),
        // Red
        toolsName: rgb(122, 132, 173),
        // Blue
        toolsTarget: rgb(169, 177, 214),
        // White-ish
        toolsCount: rgb(158, 206, 209)
        // Teal
      })
    };
  }
});

// src/ui/theme/themes/vscode-dark-plus-theme.ts
var VSCODE_DARK_PLUS_THEME;
var init_vscode_dark_plus_theme = __esm({
  "src/ui/theme/themes/vscode-dark-plus-theme.ts"() {
    "use strict";
    init_helpers();
    VSCODE_DARK_PLUS_THEME = {
      name: "vscode-dark-plus",
      description: "Visual Studio Code's default dark theme (claude-scope default)",
      colors: createThemeColors({
        branch: rgb(0, 122, 204),
        // VSCode blue
        changes: rgb(78, 201, 176),
        // Teal
        contextLow: rgb(78, 201, 176),
        // Teal
        contextMedium: rgb(220, 220, 170),
        // Yellow
        contextHigh: rgb(244, 71, 71),
        // Red
        linesAdded: rgb(78, 201, 176),
        // Teal
        linesRemoved: rgb(244, 71, 71),
        // Red
        cost: rgb(206, 145, 120),
        // Orange
        model: rgb(171, 178, 191),
        // Gray
        duration: rgb(125, 148, 173),
        // Dark gray
        accent: rgb(0, 122, 204),
        // VSCode blue
        cacheHigh: rgb(78, 201, 176),
        // Teal
        cacheMedium: rgb(220, 220, 170),
        // Yellow
        cacheLow: rgb(244, 71, 71),
        // Red
        cacheRead: rgb(0, 122, 204),
        // VSCode blue
        cacheWrite: rgb(171, 178, 191),
        // Gray
        toolsRunning: rgb(251, 191, 36),
        // Yellow
        toolsCompleted: rgb(74, 222, 128),
        // Green
        toolsError: rgb(248, 113, 113),
        // Red
        toolsName: rgb(96, 165, 250),
        // Blue
        toolsTarget: rgb(156, 163, 175),
        // Gray
        toolsCount: rgb(167, 139, 250)
        // Purple
      })
    };
  }
});

// src/ui/theme/index.ts
function getThemeByName(name) {
  const theme = AVAILABLE_THEMES.find((t) => t.name === name);
  return theme ?? MONOKAI_THEME;
}
var AVAILABLE_THEMES, DEFAULT_THEME;
var init_theme = __esm({
  "src/ui/theme/index.ts"() {
    "use strict";
    init_gray_theme();
    init_catppuccin_mocha_theme();
    init_cyberpunk_neon_theme();
    init_dracula_theme();
    init_dusty_sage_theme();
    init_github_dark_dimmed_theme();
    init_monokai_theme();
    init_muted_gray_theme();
    init_nord_theme();
    init_one_dark_pro_theme();
    init_professional_blue_theme();
    init_rose_pine_theme();
    init_semantic_classic_theme();
    init_slate_blue_theme();
    init_solarized_dark_theme();
    init_tokyo_night_theme();
    init_vscode_dark_plus_theme();
    init_helpers();
    AVAILABLE_THEMES = [
      CATPPUCCIN_MOCHA_THEME,
      CYBERPUNK_NEON_THEME,
      DRACULA_THEME,
      DUSTY_SAGE_THEME,
      GITHUB_DARK_DIMMED_THEME,
      GRAY_THEME,
      MONOKAI_THEME,
      MUTED_GRAY_THEME,
      NORD_THEME,
      ONE_DARK_PRO_THEME,
      PROFESSIONAL_BLUE_THEME,
      ROSE_PINE_THEME,
      SEMANTIC_CLASSIC_THEME,
      SLATE_BLUE_THEME,
      SOLARIZED_DARK_THEME,
      TOKYO_NIGHT_THEME,
      VSCODE_DARK_PLUS_THEME
    ];
    DEFAULT_THEME = MONOKAI_THEME.colors;
  }
});

// src/constants.ts
var TIME, DEFAULTS, ANSI_COLORS, DEMO_DATA, DEFAULT_PROGRESS_BAR_WIDTH;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    TIME = {
      /** Milliseconds per second */
      MS_PER_SECOND: 1e3,
      /** Seconds per minute */
      SECONDS_PER_MINUTE: 60,
      /** Seconds per hour */
      SECONDS_PER_HOUR: 3600
    };
    DEFAULTS = {
      /** Default separator between widgets */
      SEPARATOR: " ",
      /** Default width for progress bars in characters */
      PROGRESS_BAR_WIDTH: 20
    };
    ANSI_COLORS = {
      /** Green color */
      GREEN: "\x1B[32m",
      /** Yellow color */
      YELLOW: "\x1B[33m",
      /** Red color */
      RED: "\x1B[31m",
      /** Reset color */
      RESET: "\x1B[0m"
    };
    DEMO_DATA = {
      /** Demo session cost in USD */
      COST_USD: 0.42,
      /** Demo session duration in milliseconds (~1h 1m 5s) */
      DURATION_MS: 3665e3,
      /** Demo API duration in milliseconds (~50m) */
      API_DURATION_MS: 3e6,
      /** Demo lines added */
      LINES_ADDED: 142,
      /** Demo lines removed */
      LINES_REMOVED: 27,
      /** Demo context window size in tokens */
      CONTEXT_WINDOW_SIZE: 2e5,
      /** Demo total input tokens */
      TOTAL_INPUT_TOKENS: 185e3,
      /** Demo total output tokens */
      TOTAL_OUTPUT_TOKENS: 5e4,
      /** Demo current input tokens */
      CURRENT_INPUT_TOKENS: 8e4,
      /** Demo current output tokens */
      CURRENT_OUTPUT_TOKENS: 3e4,
      /** Demo cache creation tokens */
      CACHE_CREATION_TOKENS: 1e3,
      /** Demo cache read tokens */
      CACHE_READ_TOKENS: 15e3
    };
    DEFAULT_PROGRESS_BAR_WIDTH = DEFAULTS.PROGRESS_BAR_WIDTH;
  }
});

// src/core/renderer.ts
var Renderer;
var init_renderer = __esm({
  "src/core/renderer.ts"() {
    "use strict";
    init_constants();
    Renderer = class {
      separator;
      onError;
      showErrors;
      constructor(options = {}) {
        this.separator = options.separator ?? DEFAULTS.SEPARATOR;
        this.onError = options.onError;
        this.showErrors = options.showErrors ?? false;
      }
      /**
       * Render widgets into multiple lines with error boundaries
       *
       * Widgets are grouped by their metadata.line property and rendered
       * on separate lines. Widgets that throw errors are logged (via onError
       * callback) and skipped, allowing other widgets to continue rendering.
       *
       * @param widgets - Array of widgets to render
       * @param context - Render context with width and timestamp
       * @returns Array of rendered lines (one per line number)
       */
      async render(widgets, context) {
        const lineMap = /* @__PURE__ */ new Map();
        for (const widget of widgets) {
          if (!widget.isEnabled()) {
            continue;
          }
          const line = widget.metadata.line ?? 0;
          if (!lineMap.has(line)) {
            lineMap.set(line, []);
          }
          lineMap.get(line)?.push(widget);
        }
        const lines = [];
        const sortedLines = Array.from(lineMap.entries()).sort((a, b) => a[0] - b[0]);
        for (const [, widgetsForLine] of sortedLines) {
          const outputs = [];
          for (const widget of widgetsForLine) {
            try {
              const output = await widget.render(context);
              if (output !== null) {
                outputs.push(output);
              }
            } catch (error) {
              this.handleError(error, widget);
              if (this.showErrors) {
                outputs.push(`${widget.id}:<err>`);
              }
            }
          }
          const line = outputs.join(this.separator);
          if (outputs.length > 0) {
            lines.push(line);
          }
        }
        return lines;
      }
      /**
       * Set custom separator
       */
      setSeparator(separator) {
        this.separator = separator;
      }
      /**
       * Handle widget render errors
       *
       * Calls the onError callback if provided, otherwise logs to console.warn
       */
      handleError(error, widget) {
        if (this.onError) {
          this.onError(error, widget);
        } else {
          console.warn(`[Widget ${widget.id}] ${error.message}`);
        }
      }
    };
  }
});

// src/core/widget-registry.ts
var WidgetRegistry;
var init_widget_registry = __esm({
  "src/core/widget-registry.ts"() {
    "use strict";
    WidgetRegistry = class {
      widgets = /* @__PURE__ */ new Map();
      /**
       * Register a widget
       */
      async register(widget, context) {
        if (this.widgets.has(widget.id)) {
          throw new Error(`Widget with id '${widget.id}' already registered`);
        }
        if (context) {
          await widget.initialize(context);
        }
        this.widgets.set(widget.id, widget);
      }
      /**
       * Unregister a widget
       */
      async unregister(id) {
        const widget = this.widgets.get(id);
        if (!widget) {
          return;
        }
        try {
          if (widget.cleanup) {
            await widget.cleanup();
          }
        } finally {
          this.widgets.delete(id);
        }
      }
      /**
       * Get a widget by id
       */
      get(id) {
        return this.widgets.get(id);
      }
      /**
       * Check if widget is registered
       */
      has(id) {
        return this.widgets.has(id);
      }
      /**
       * Get all registered widgets
       */
      getAll() {
        return Array.from(this.widgets.values());
      }
      /**
       * Get only enabled widgets
       */
      getEnabledWidgets() {
        return this.getAll().filter((w) => w.isEnabled());
      }
      /**
       * Clear all widgets
       */
      async clear() {
        for (const widget of this.widgets.values()) {
          if (widget.cleanup) {
            await widget.cleanup();
          }
        }
        this.widgets.clear();
      }
    };
  }
});

// src/providers/mock-config-provider.ts
var MockConfigProvider;
var init_mock_config_provider = __esm({
  "src/providers/mock-config-provider.ts"() {
    "use strict";
    MockConfigProvider = class {
      /**
       * Return demo config counts
       * @returns Demo counts for CLAUDE.md, rules, MCPs, hooks
       */
      async getConfigs() {
        return {
          claudeMdCount: 1,
          rulesCount: 3,
          mcpCount: 2,
          hooksCount: 4
        };
      }
    };
  }
});

// src/providers/mock-git.ts
var MockGit;
var init_mock_git = __esm({
  "src/providers/mock-git.ts"() {
    "use strict";
    MockGit = class {
      // biome-ignore lint/correctness/noUnusedPrivateClassMembers: kept for API consistency with NativeGit
      cwd;
      constructor(cwd) {
        this.cwd = cwd;
      }
      /**
       * Return demo git status
       * @returns Status with "main" branch
       */
      async status() {
        return { current: "main" };
      }
      /**
       * Return demo diff summary
       * @returns Diff with 3 files, 142 insertions, 27 deletions
       */
      async diffSummary(_options) {
        return {
          fileCount: 3,
          files: [
            { file: "src/widget.ts", insertions: 85, deletions: 12 },
            { file: "src/config.ts", insertions: 42, deletions: 8 },
            { file: "tests/widget.test.ts", insertions: 15, deletions: 7 }
          ]
        };
      }
      /**
       * Return demo latest tag
       * @returns Current version tag
       */
      async latestTag() {
        return "v0.8.3";
      }
    };
  }
});

// src/providers/mock-transcript-provider.ts
var MockTranscriptProvider;
var init_mock_transcript_provider = __esm({
  "src/providers/mock-transcript-provider.ts"() {
    "use strict";
    MockTranscriptProvider = class {
      /**
       * Return demo tool entries
       * @param path - Transcript path (ignored in mock)
       * @returns Array of demo tool entries
       */
      async parseTools(_path) {
        const now = /* @__PURE__ */ new Date();
        const minuteAgo = new Date(now.getTime() - 60 * 1e3);
        return [
          {
            id: "tool_1",
            name: "Read",
            target: "src/config.ts",
            status: "completed",
            startTime: minuteAgo,
            endTime: minuteAgo
          },
          {
            id: "tool_2",
            name: "Edit",
            target: "src/config.ts",
            status: "completed",
            startTime: minuteAgo,
            endTime: minuteAgo
          },
          {
            id: "tool_3",
            name: "Read",
            target: "src/widget.ts",
            status: "completed",
            startTime: minuteAgo,
            endTime: minuteAgo
          },
          {
            id: "tool_4",
            name: "Bash",
            target: "npm test",
            status: "running",
            startTime: now
          },
          {
            id: "tool_5",
            name: "Edit",
            target: "src/styles.ts",
            status: "completed",
            startTime: minuteAgo,
            endTime: minuteAgo
          }
        ];
      }
    };
  }
});

// src/widgets/core/stdin-data-widget.ts
var StdinDataWidget;
var init_stdin_data_widget = __esm({
  "src/widgets/core/stdin-data-widget.ts"() {
    "use strict";
    StdinDataWidget = class {
      /**
       * Stored stdin data from last update
       */
      data = null;
      /**
       * Widget enabled state
       */
      enabled = true;
      /**
       * Initialize widget with context
       * @param context - Widget initialization context
       */
      async initialize(context) {
        this.enabled = context.config?.enabled !== false;
      }
      /**
       * Update widget with new stdin data
       * @param data - Stdin data from Claude Code
       */
      async update(data) {
        this.data = data;
      }
      /**
       * Get stored stdin data
       * @returns Stored stdin data
       * @throws Error if data has not been initialized (update not called)
       */
      getData() {
        if (!this.data) {
          throw new Error(`Widget ${this.id} data not initialized. Call update() first.`);
        }
        return this.data;
      }
      /**
       * Check if widget is enabled
       * @returns true if widget should render
       */
      isEnabled() {
        return this.enabled;
      }
      /**
       * Template method - final, subclasses implement renderWithData()
       *
       * Handles null data checks and calls renderWithData() hook.
       *
       * @param context - Render context
       * @returns Rendered string, or null if widget should not display
       */
      async render(context) {
        if (!this.data || !this.enabled) {
          return null;
        }
        return this.renderWithData(this.data, context);
      }
    };
  }
});

// src/widgets/active-tools/styles.ts
function truncatePath(path2) {
  if (path2.length <= 30) {
    return path2;
  }
  const parts = path2.split("/");
  return `.../${parts[parts.length - 1]}`;
}
function formatTool(name, target, colors2) {
  const nameStr = colorize(name, colors2.tools.name);
  if (target) {
    const targetStr = colorize(`: ${truncatePath(target)}`, colors2.tools.target);
    return `${nameStr}${targetStr}`;
  }
  return nameStr;
}
function pluralizeTool(name) {
  const irregular = {
    Task: "Tasks",
    Bash: "Bash",
    Edit: "Edits",
    Read: "Reads",
    Write: "Writes",
    Grep: "Greps",
    Glob: "Globs"
  };
  return irregular[name] || `${name}s`;
}
function getDefaultColors() {
  return {
    base: {
      text: "\x1B[37m",
      muted: "\x1B[90m",
      accent: "\x1B[36m",
      border: "\x1B[90m"
    },
    semantic: {
      success: "\x1B[32m",
      warning: "\x1B[33m",
      error: "\x1B[31m",
      info: "\x1B[36m"
    },
    git: {
      branch: "\x1B[36m",
      changes: "\x1B[33m"
    },
    context: {
      low: "\x1B[32m",
      medium: "\x1B[33m",
      high: "\x1B[31m",
      bar: "\x1B[37m"
    },
    lines: {
      added: "\x1B[32m",
      removed: "\x1B[31m"
    },
    cost: {
      amount: "\x1B[37m",
      currency: "\x1B[90m"
    },
    duration: {
      value: "\x1B[37m",
      unit: "\x1B[90m"
    },
    model: {
      name: "\x1B[36m",
      version: "\x1B[90m"
    },
    poker: {
      participating: "\x1B[37m",
      nonParticipating: "\x1B[90m",
      result: "\x1B[36m"
    },
    cache: {
      high: "\x1B[32m",
      medium: "\x1B[33m",
      low: "\x1B[31m",
      read: "\x1B[34m",
      write: "\x1B[35m"
    },
    tools: {
      running: "\x1B[33m",
      completed: "\x1B[32m",
      error: "\x1B[31m",
      name: "\x1B[34m",
      target: "\x1B[90m",
      count: "\x1B[35m"
    }
  };
}
var activeToolsStyles;
var init_styles = __esm({
  "src/widgets/active-tools/styles.ts"() {
    "use strict";
    init_colors();
    activeToolsStyles = {
      /**
       * balanced: Group tools by name, showing running and completed counts together
       * - Running + completed: "ToolName (1 running, 6 done)"
       * - Only completed: "Tools: 6"
       * - No symbols, just text format
       */
      balanced: (data, colors2) => {
        const parts = [];
        const c = colors2 ?? getDefaultColors();
        const allToolNames = /* @__PURE__ */ new Set();
        for (const tool of data.running) {
          allToolNames.add(tool.name);
        }
        for (const [name] of data.completed.slice(0, 3)) {
          allToolNames.add(name);
        }
        const completedMap = new Map(data.completed);
        const runningCounts = /* @__PURE__ */ new Map();
        for (const tool of data.running) {
          runningCounts.set(tool.name, (runningCounts.get(tool.name) ?? 0) + 1);
        }
        for (const name of allToolNames) {
          const runningCount = runningCounts.get(name) ?? 0;
          const completedCount = completedMap.get(name) ?? 0;
          if (runningCount > 0 && completedCount > 0) {
            const nameStr = colorize(name, c.tools.name);
            const runningStr = colorize(`${runningCount} running`, c.tools.running);
            const doneStr = colorize(`${completedCount} done`, c.tools.completed);
            parts.push(`${nameStr} (${runningStr}, ${doneStr})`);
          } else if (completedCount > 0) {
            const pluralName = pluralizeTool(name);
            const nameStr = colorize(pluralName, c.tools.name);
            const countStr = colorize(`${completedCount}`, c.tools.count);
            parts.push(`${nameStr}: ${countStr}`);
          } else if (runningCount > 0) {
            const nameStr = colorize(name, c.tools.name);
            const runningStr = colorize(`${runningCount} running`, c.tools.running);
            const doneStr = colorize("0 done", c.tools.completed);
            parts.push(`${nameStr} (${runningStr}, ${doneStr})`);
          }
        }
        if (parts.length === 0) {
          return "";
        }
        return parts.join(" | ");
      },
      /**
       * compact: [ToolName] format for all tools
       */
      compact: (data, colors2) => {
        const parts = [];
        const c = colors2 ?? getDefaultColors();
        for (const tool of data.running) {
          parts.push(`[${colorize(tool.name, c.tools.name)}]`);
        }
        for (const [name] of data.completed.slice(0, 3)) {
          parts.push(`[${colorize(name, c.tools.completed)}]`);
        }
        if (parts.length === 0) {
          return "";
        }
        return parts.join(" ");
      },
      /**
       * minimal: Same as compact
       */
      minimal: (data, colors2) => {
        const compactStyle = activeToolsStyles.compact;
        if (!compactStyle) return "";
        return compactStyle(data, colors2);
      },
      /**
       * playful: Emojis (📖✏️✨🔄🔍📁) with tool names
       */
      playful: (data, colors2) => {
        const parts = [];
        const emojis = {
          Read: "\u{1F4D6}",
          Write: "\u270F\uFE0F",
          Edit: "\u2728",
          Bash: "\u{1F504}",
          Grep: "\u{1F50D}",
          Glob: "\u{1F4C1}"
        };
        for (const tool of data.running.slice(-3)) {
          const emoji = emojis[tool.name] ?? "\u{1F527}";
          const nameStr = colors2 ? colorize(tool.name, colors2.tools.name) : tool.name;
          parts.push(`${emoji} ${nameStr}`);
        }
        if (parts.length === 0) {
          return "";
        }
        return parts.join(", ");
      },
      /**
       * verbose: Full text labels "Running:" and "Completed:"
       */
      verbose: (data, colors2) => {
        const parts = [];
        const c = colors2 ?? getDefaultColors();
        for (const tool of data.running) {
          const label = colorize("Running:", c.tools.running);
          parts.push(`${label} ${formatTool(tool.name, tool.target, c)}`);
        }
        const sorted = data.completed.slice(0, 3);
        for (const [name, count] of sorted) {
          const label = colorize("Completed:", c.tools.completed);
          const countStr = colorize(`(${count}x)`, c.tools.count);
          parts.push(`${label} ${name} ${countStr}`);
        }
        if (parts.length === 0) {
          return "";
        }
        return parts.join(" | ");
      },
      /**
       * labeled: "Tools:" prefix with all tools
       */
      labeled: (data, colors2) => {
        const c = colors2 ?? getDefaultColors();
        const allTools = [
          ...data.running.map((t) => {
            const indicator = colorize("\u25D0", c.tools.running);
            return `${indicator} ${formatTool(t.name, t.target, c)}`;
          }),
          ...data.completed.slice(0, 3).map(([name, count]) => {
            const indicator = colorize("\u2713", c.tools.completed);
            const countStr = colorize(`\xD7${count}`, c.tools.count);
            return `${indicator} ${name} ${countStr}`;
          })
        ];
        if (allTools.length === 0) {
          return "";
        }
        const prefix = colors2 ? colorize("Tools:", c.semantic.info) : "Tools:";
        return `${prefix}: ${allTools.join(" | ")}`;
      },
      /**
       * indicator: ● bullet indicators
       */
      indicator: (data, colors2) => {
        const parts = [];
        const c = colors2 ?? getDefaultColors();
        for (const tool of data.running) {
          const bullet = colorize("\u25CF", c.semantic.info);
          parts.push(`${bullet} ${formatTool(tool.name, tool.target, c)}`);
        }
        for (const [name] of data.completed.slice(0, 3)) {
          const bullet = colorize("\u25CF", c.tools.completed);
          parts.push(`${bullet} ${name}`);
        }
        if (parts.length === 0) {
          return "";
        }
        return parts.join(" | ");
      }
    };
  }
});

// src/widgets/active-tools/active-tools-widget.ts
var ActiveToolsWidget;
var init_active_tools_widget = __esm({
  "src/widgets/active-tools/active-tools-widget.ts"() {
    "use strict";
    init_stdin_data_widget();
    init_styles();
    ActiveToolsWidget = class extends StdinDataWidget {
      constructor(theme, transcriptProvider) {
        super();
        this.theme = theme;
        this.transcriptProvider = transcriptProvider;
      }
      id = "active-tools";
      metadata = {
        name: "Active Tools",
        description: "Active tools display from transcript",
        version: "1.0.0",
        author: "claude-scope",
        line: 2
        // Display on third line (0-indexed)
      };
      style = "balanced";
      tools = [];
      renderData;
      /**
       * Set display style
       * @param style - Style to use for rendering
       */
      setStyle(style) {
        this.style = style;
      }
      /**
       * Aggregate completed tools by name and sort by count (descending)
       * @param tools - Array of tool entries
       * @returns Array of [name, count] tuples sorted by count descending
       */
      aggregateCompleted(tools) {
        const counts = /* @__PURE__ */ new Map();
        for (const tool of tools) {
          if (tool.status === "completed" || tool.status === "error") {
            const current = counts.get(tool.name) ?? 0;
            counts.set(tool.name, current + 1);
          }
        }
        return Array.from(counts.entries()).sort((a, b) => {
          if (b[1] !== a[1]) {
            return b[1] - a[1];
          }
          return a[0].localeCompare(b[0]);
        });
      }
      /**
       * Prepare render data from tools
       * @returns Render data with running, completed, and error tools
       */
      prepareRenderData() {
        const running = this.tools.filter((t) => t.status === "running");
        const completed = this.aggregateCompleted(this.tools);
        const errors = this.tools.filter((t) => t.status === "error");
        return { running, completed, errors };
      }
      /**
       * Update widget with new stdin data
       * @param data - Stdin data from Claude Code
       */
      async update(data) {
        await super.update(data);
        if (data.transcript_path) {
          this.tools = await this.transcriptProvider.parseTools(data.transcript_path);
          this.renderData = this.prepareRenderData();
        } else {
          this.tools = [];
          this.renderData = void 0;
        }
      }
      /**
       * Render widget output
       * @param context - Render context
       * @returns Rendered string or null if no tools
       */
      renderWithData(_data, _context) {
        if (!this.renderData || this.tools.length === 0) {
          return null;
        }
        const styleFn = activeToolsStyles[this.style] ?? activeToolsStyles.balanced;
        if (!styleFn) {
          return null;
        }
        return styleFn(this.renderData, this.theme);
      }
      /**
       * Check if widget should render
       * @returns true if there are tools to display
       */
      isEnabled() {
        return super.isEnabled() && this.tools.length > 0;
      }
    };
  }
});

// src/widgets/active-tools/types.ts
var init_types = __esm({
  "src/widgets/active-tools/types.ts"() {
    "use strict";
  }
});

// src/widgets/active-tools/index.ts
var init_active_tools = __esm({
  "src/widgets/active-tools/index.ts"() {
    "use strict";
    init_active_tools_widget();
    init_styles();
    init_types();
  }
});

// src/core/widget-types.ts
function createWidgetMetadata(name, description, version = "1.0.0", author = "claude-scope", line = 0) {
  return {
    name,
    description,
    version,
    author,
    line
  };
}
var init_widget_types = __esm({
  "src/core/widget-types.ts"() {
    "use strict";
  }
});

// src/storage/cache-manager.ts
var import_node_fs, import_node_os2, import_node_path2, DEFAULT_CACHE_PATH, DEFAULT_EXPIRY_MS, CacheManager;
var init_cache_manager = __esm({
  "src/storage/cache-manager.ts"() {
    "use strict";
    import_node_fs = require("node:fs");
    import_node_os2 = require("node:os");
    import_node_path2 = require("node:path");
    DEFAULT_CACHE_PATH = `${(0, import_node_os2.homedir)()}/.config/claude-scope/cache.json`;
    DEFAULT_EXPIRY_MS = 5 * 60 * 1e3;
    CacheManager = class {
      cachePath;
      expiryMs;
      constructor(options) {
        this.cachePath = options?.cachePath ?? DEFAULT_CACHE_PATH;
        this.expiryMs = options?.expiryMs ?? DEFAULT_EXPIRY_MS;
        this.ensureCacheDir();
      }
      /**
       * Get cached usage data for a session
       * @param sessionId - Session identifier
       * @returns Cached usage if valid and not expired, null otherwise
       */
      getCachedUsage(sessionId) {
        const cache = this.loadCache();
        const cached = cache.sessions[sessionId];
        if (!cached) {
          return null;
        }
        const age = Date.now() - cached.timestamp;
        if (age > this.expiryMs) {
          delete cache.sessions[sessionId];
          this.saveCache(cache);
          return null;
        }
        return cached;
      }
      /**
       * Store usage data for a session
       * @param sessionId - Session identifier
       * @param usage - Context usage data to cache
       */
      setCachedUsage(sessionId, usage) {
        const cache = this.loadCache();
        cache.sessions[sessionId] = {
          timestamp: Date.now(),
          usage
        };
        this.saveCache(cache);
      }
      /**
       * Clear all cached data (useful for testing)
       */
      clearCache() {
        const emptyCache = {
          sessions: {},
          version: 1
        };
        this.saveCache(emptyCache);
      }
      /**
       * Clean up expired sessions
       */
      cleanupExpired() {
        const cache = this.loadCache();
        const now = Date.now();
        for (const [sessionId, cached] of Object.entries(cache.sessions)) {
          const age = now - cached.timestamp;
          if (age > this.expiryMs) {
            delete cache.sessions[sessionId];
          }
        }
        this.saveCache(cache);
      }
      /**
       * Load cache from file
       */
      loadCache() {
        if (!(0, import_node_fs.existsSync)(this.cachePath)) {
          return { sessions: {}, version: 1 };
        }
        try {
          const content = (0, import_node_fs.readFileSync)(this.cachePath, "utf-8");
          return JSON.parse(content);
        } catch {
          return { sessions: {}, version: 1 };
        }
      }
      /**
       * Save cache to file
       */
      saveCache(cache) {
        try {
          (0, import_node_fs.writeFileSync)(this.cachePath, JSON.stringify(cache, null, 2), "utf-8");
        } catch {
        }
      }
      /**
       * Ensure cache directory exists
       */
      ensureCacheDir() {
        try {
          const dir = (0, import_node_path2.dirname)(this.cachePath);
          if (!(0, import_node_fs.existsSync)(dir)) {
            (0, import_node_fs.mkdirSync)(dir, { recursive: true });
          }
        } catch {
        }
      }
    };
  }
});

// src/ui/utils/formatters.ts
function formatDuration(ms) {
  if (ms <= 0) return "0s";
  const seconds = Math.floor(ms / TIME.MS_PER_SECOND);
  const hours = Math.floor(seconds / TIME.SECONDS_PER_HOUR);
  const minutes = Math.floor(seconds % TIME.SECONDS_PER_HOUR / TIME.SECONDS_PER_MINUTE);
  const secs = seconds % TIME.SECONDS_PER_MINUTE;
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
  } else if (minutes > 0) {
    parts.push(`${minutes}m`);
    parts.push(`${secs}s`);
  } else {
    parts.push(`${secs}s`);
  }
  return parts.join(" ");
}
function formatCostUSD(usd) {
  return `$${usd.toFixed(2)}`;
}
function colorize2(text, color) {
  return `${color}${text}${ANSI_COLORS.RESET}`;
}
function formatK(n) {
  const absN = Math.abs(n);
  if (absN < 1e3) {
    return n.toString();
  }
  const k = n / 1e3;
  return Math.abs(k) < 10 ? `${k.toFixed(1)}k` : `${Math.round(k)}k`;
}
var init_formatters = __esm({
  "src/ui/utils/formatters.ts"() {
    "use strict";
    init_constants();
  }
});

// src/widgets/cache-metrics/styles.ts
function formatCurrency(usd) {
  if (usd < 5e-3 && usd > 0) {
    return "<$0.01";
  }
  return `$${usd.toFixed(2)}`;
}
function getCacheColor(hitRate, colors2) {
  if (hitRate > 70) {
    return colors2.cache.high;
  } else if (hitRate >= 40) {
    return colors2.cache.medium;
  } else {
    return colors2.cache.low;
  }
}
var cacheMetricsStyles;
var init_styles2 = __esm({
  "src/widgets/cache-metrics/styles.ts"() {
    "use strict";
    init_formatters();
    cacheMetricsStyles = {
      /**
       * balanced: 35.0k cache with color coding
       */
      balanced: (data, colors2) => {
        const { cacheRead, hitRate } = data;
        const color = colors2 ? getCacheColor(hitRate, colors2) : "";
        const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
        return amount;
      },
      /**
       * compact: Cache: 35.0k
       */
      compact: (data, colors2) => {
        const { cacheRead } = data;
        const amount = formatK(cacheRead);
        if (colors2) {
          return `${colors2.cache.read}Cache: ${amount}`;
        }
        return `Cache: ${amount}`;
      },
      /**
       * playful: 💾 35.0k cache
       */
      playful: (data, _colors) => {
        const { cacheRead } = data;
        const amount = formatK(cacheRead);
        return `\u{1F4BE} ${amount} cache`;
      },
      /**
       * verbose: Cache: 35.0k | $0.03 saved
       */
      verbose: (data, colors2) => {
        const { cacheRead, savings } = data;
        const amount = formatK(cacheRead);
        const saved = colors2 ? `${colors2.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
        return `Cache: ${amount} | ${saved}`;
      },
      /**
       * labeled: Cache: 35.0k | $0.03 saved
       */
      labeled: (data, colors2) => {
        const { cacheRead, savings } = data;
        const amount = formatK(cacheRead);
        const saved = colors2 ? `${colors2.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
        return `Cache: ${amount} | ${saved}`;
      },
      /**
       * indicator: ● 35.0k cache with color coding
       */
      indicator: (data, colors2) => {
        const { cacheRead, hitRate } = data;
        const color = colors2 ? getCacheColor(hitRate, colors2) : "";
        const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
        return `\u25CF ${amount}`;
      },
      /**
       * breakdown: Single-line with Hit: and Write: breakdown
       */
      breakdown: (data, colors2) => {
        const { cacheRead, cacheWrite, savings } = data;
        const amount = formatK(cacheRead);
        const saved = colors2 ? `${colors2.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
        const read = formatK(cacheRead);
        const write = formatK(cacheWrite);
        return `\u{1F4BE} ${amount} cache | Hit: ${read}, Write: ${write} | ${saved}`;
      }
    };
  }
});

// src/widgets/cache-metrics/cache-metrics-widget.ts
var CacheMetricsWidget;
var init_cache_metrics_widget = __esm({
  "src/widgets/cache-metrics/cache-metrics-widget.ts"() {
    "use strict";
    init_widget_types();
    init_cache_manager();
    init_theme();
    init_stdin_data_widget();
    init_styles2();
    CacheMetricsWidget = class extends StdinDataWidget {
      id = "cache-metrics";
      metadata = createWidgetMetadata(
        "Cache Metrics",
        "Cache hit rate and savings display",
        "1.0.0",
        "claude-scope",
        2
        // Third line
      );
      theme;
      style = "balanced";
      renderData;
      cacheManager;
      lastSessionId;
      constructor(theme) {
        super();
        this.theme = theme ?? DEFAULT_THEME;
        this.cacheManager = new CacheManager();
      }
      /**
       * Set display style
       */
      setStyle(style) {
        this.style = style;
      }
      /**
       * Calculate cache metrics from context usage data
       * Returns null if no usage data is available (current or cached)
       */
      calculateMetrics(data) {
        let usage = data.context_window?.current_usage;
        if (!usage) {
          const cached = this.cacheManager.getCachedUsage(data.session_id);
          if (cached) {
            usage = cached.usage;
          }
        }
        if (!usage) {
          return null;
        }
        const cacheRead = usage.cache_read_input_tokens ?? 0;
        const cacheWrite = usage.cache_creation_input_tokens ?? 0;
        const inputTokens = usage.input_tokens ?? 0;
        const outputTokens = usage.output_tokens ?? 0;
        const totalInputTokens = cacheRead + cacheWrite + inputTokens;
        const totalTokens = totalInputTokens + outputTokens;
        const hitRate = totalInputTokens > 0 ? Math.min(100, Math.round(cacheRead / totalInputTokens * 100)) : 0;
        const costPerToken = 3e-6;
        const savings = cacheRead * 0.9 * costPerToken;
        return {
          cacheRead,
          cacheWrite,
          totalTokens,
          hitRate,
          savings
        };
      }
      /**
       * Update widget with new data and calculate metrics
       * Stores valid usage data in cache for future use
       */
      async update(data) {
        await super.update(data);
        const sessionChanged = this.lastSessionId && this.lastSessionId !== data.session_id;
        if (sessionChanged) {
          this.renderData = void 0;
        }
        this.lastSessionId = data.session_id;
        const usage = data.context_window?.current_usage;
        if (usage && usage.input_tokens > 0 && !sessionChanged) {
          this.cacheManager.setCachedUsage(data.session_id, {
            input_tokens: usage.input_tokens,
            output_tokens: usage.output_tokens,
            cache_creation_input_tokens: usage.cache_creation_input_tokens,
            cache_read_input_tokens: usage.cache_read_input_tokens
          });
        }
        const metrics = this.calculateMetrics(data);
        this.renderData = metrics ?? void 0;
      }
      /**
       * Render the cache metrics display
       */
      renderWithData(_data, _context) {
        if (!this.renderData) {
          return null;
        }
        const styleFn = cacheMetricsStyles[this.style] ?? cacheMetricsStyles.balanced;
        if (!styleFn) {
          return null;
        }
        return styleFn(this.renderData, this.theme);
      }
      /**
       * Widget is enabled when we have cache metrics data
       */
      isEnabled() {
        return this.renderData !== void 0;
      }
    };
  }
});

// src/widgets/cache-metrics/types.ts
var init_types2 = __esm({
  "src/widgets/cache-metrics/types.ts"() {
    "use strict";
  }
});

// src/widgets/cache-metrics/index.ts
var init_cache_metrics = __esm({
  "src/widgets/cache-metrics/index.ts"() {
    "use strict";
    init_cache_metrics_widget();
    init_styles2();
    init_types2();
  }
});

// src/core/style-types.ts
function isValidWidgetStyle(value) {
  return [
    "minimal",
    "balanced",
    "compact",
    "playful",
    "verbose",
    "technical",
    "symbolic",
    "monochrome",
    "compact-verbose",
    "labeled",
    "indicator",
    "emoji",
    "breakdown"
  ].includes(value);
}
var DEFAULT_WIDGET_STYLE;
var init_style_types = __esm({
  "src/core/style-types.ts"() {
    "use strict";
    DEFAULT_WIDGET_STYLE = "balanced";
  }
});

// src/providers/config-provider.ts
var fs, os, path, ConfigProvider;
var init_config_provider = __esm({
  "src/providers/config-provider.ts"() {
    "use strict";
    fs = __toESM(require("node:fs/promises"), 1);
    os = __toESM(require("node:os"), 1);
    path = __toESM(require("node:path"), 1);
    ConfigProvider = class {
      cachedCounts;
      lastScan = 0;
      cacheInterval = 5e3;
      // 5 seconds
      /**
       * Get config counts with hybrid caching
       * Scans filesystem if cache is stale (>5 seconds)
       */
      async getConfigs(options = {}) {
        const now = Date.now();
        if (this.cachedCounts && now - this.lastScan < this.cacheInterval) {
          return this.cachedCounts;
        }
        this.cachedCounts = await this.scanConfigs(options);
        this.lastScan = now;
        return this.cachedCounts;
      }
      /**
       * Scan filesystem for Claude Code configurations
       */
      async scanConfigs(options) {
        let claudeMdCount = 0;
        let rulesCount = 0;
        let mcpCount = 0;
        let hooksCount = 0;
        const homeDir = os.homedir();
        const claudeDir = path.join(homeDir, ".claude");
        const cwd = options.cwd;
        if (await this.fileExists(path.join(claudeDir, "CLAUDE.md"))) {
          claudeMdCount++;
        }
        rulesCount += await this.countRulesInDir(path.join(claudeDir, "rules"));
        const userSettings = path.join(claudeDir, "settings.json");
        const userSettingsData = await this.readJsonFile(userSettings);
        if (userSettingsData) {
          mcpCount += this.countMcpServers(userSettingsData);
          hooksCount += this.countHooks(userSettingsData);
        }
        const userClaudeJson = path.join(homeDir, ".claude.json");
        const userClaudeData = await this.readJsonFile(userClaudeJson);
        if (userClaudeData) {
          const userMcpCount = this.countMcpServers(userClaudeData);
          mcpCount += Math.max(0, userMcpCount - this.countMcpServers(userSettingsData || {}));
        }
        if (cwd) {
          if (await this.fileExists(path.join(cwd, "CLAUDE.md"))) {
            claudeMdCount++;
          }
          if (await this.fileExists(path.join(cwd, "CLAUDE.local.md"))) {
            claudeMdCount++;
          }
          if (await this.fileExists(path.join(cwd, ".claude", "CLAUDE.md"))) {
            claudeMdCount++;
          }
          if (await this.fileExists(path.join(cwd, ".claude", "CLAUDE.local.md"))) {
            claudeMdCount++;
          }
          rulesCount += await this.countRulesInDir(path.join(cwd, ".claude", "rules"));
          const mcpJson = path.join(cwd, ".mcp.json");
          const mcpData = await this.readJsonFile(mcpJson);
          if (mcpData) {
            mcpCount += this.countMcpServers(mcpData);
          }
          const projectSettings = path.join(cwd, ".claude", "settings.json");
          const projectSettingsData = await this.readJsonFile(projectSettings);
          if (projectSettingsData) {
            mcpCount += this.countMcpServers(projectSettingsData);
            hooksCount += this.countHooks(projectSettingsData);
          }
          const localSettings = path.join(cwd, ".claude", "settings.local.json");
          const localSettingsData = await this.readJsonFile(localSettings);
          if (localSettingsData) {
            mcpCount += this.countMcpServers(localSettingsData);
            hooksCount += this.countHooks(localSettingsData);
          }
        }
        return { claudeMdCount, rulesCount, mcpCount, hooksCount };
      }
      /**
       * Check if file exists
       */
      async fileExists(filePath) {
        try {
          await fs.access(filePath);
          return true;
        } catch {
          return false;
        }
      }
      /**
       * Read and parse JSON file
       */
      async readJsonFile(filePath) {
        try {
          const content = await fs.readFile(filePath, "utf8");
          return JSON.parse(content);
        } catch {
          return null;
        }
      }
      /**
       * Count MCP servers in config object
       */
      countMcpServers(config) {
        if (!config || !config.mcpServers || typeof config.mcpServers !== "object") {
          return 0;
        }
        return Object.keys(config.mcpServers).length;
      }
      /**
       * Count hooks in config object
       */
      countHooks(config) {
        if (!config || !config.hooks || typeof config.hooks !== "object") {
          return 0;
        }
        return Object.keys(config.hooks).length;
      }
      /**
       * Recursively count .md files in directory
       */
      async countRulesInDir(rulesDir) {
        const exists = await this.fileExists(rulesDir);
        if (!exists) return 0;
        try {
          let count = 0;
          const entries = await fs.readdir(rulesDir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(rulesDir, entry.name);
            if (entry.isDirectory()) {
              count += await this.countRulesInDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith(".md")) {
              count++;
            }
          }
          return count;
        } catch {
          return 0;
        }
      }
    };
  }
});

// src/widgets/config-count/styles.ts
var configCountStyles;
var init_styles3 = __esm({
  "src/widgets/config-count/styles.ts"() {
    "use strict";
    init_colors();
    configCountStyles = {
      balanced: (data, colors2) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors2?.semantic.info ?? "";
        const muted = colors2?.base.muted ?? "";
        if (claudeMdCount > 0) {
          const label = info ? colorize("CLAUDE.md", info) : "CLAUDE.md";
          parts.push(`${label}:${claudeMdCount}`);
        }
        if (rulesCount > 0) {
          const label = info ? colorize("rules", info) : "rules";
          parts.push(`${label}:${rulesCount}`);
        }
        if (mcpCount > 0) {
          const label = info ? colorize("MCPs", info) : "MCPs";
          parts.push(`${label}:${mcpCount}`);
        }
        if (hooksCount > 0) {
          const label = info ? colorize("hooks", info) : "hooks";
          parts.push(`${label}:${hooksCount}`);
        }
        const sep = muted ? colorize(" \u2502 ", muted) : " \u2502 ";
        return parts.join(sep);
      },
      compact: (data, colors2) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors2?.semantic.info ?? "";
        const muted = colors2?.base.muted ?? "";
        if (claudeMdCount > 0) {
          const text = info ? colorize(`${claudeMdCount} docs`, info) : `${claudeMdCount} docs`;
          parts.push(text);
        }
        if (rulesCount > 0) {
          const text = info ? colorize(`${rulesCount} rules`, info) : `${rulesCount} rules`;
          parts.push(text);
        }
        if (mcpCount > 0) {
          const text = info ? colorize(`${mcpCount} MCPs`, info) : `${mcpCount} MCPs`;
          parts.push(text);
        }
        if (hooksCount > 0) {
          const hookLabel = hooksCount === 1 ? "hook" : "hooks";
          const text = info ? colorize(`${hooksCount} ${hookLabel}`, info) : `${hooksCount} ${hookLabel}`;
          parts.push(text);
        }
        const sep = muted ? colorize(" \u2502 ", muted) : " \u2502 ";
        return parts.join(sep);
      },
      playful: (data, colors2) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors2?.semantic.info ?? "";
        const muted = colors2?.base.muted ?? "";
        if (claudeMdCount > 0) {
          const text = info ? colorize(`CLAUDE.md:${claudeMdCount}`, info) : `CLAUDE.md:${claudeMdCount}`;
          parts.push(`\u{1F4C4} ${text}`);
        }
        if (rulesCount > 0) {
          const text = info ? colorize(`rules:${rulesCount}`, info) : `rules:${rulesCount}`;
          parts.push(`\u{1F4DC} ${text}`);
        }
        if (mcpCount > 0) {
          const text = info ? colorize(`MCPs:${mcpCount}`, info) : `MCPs:${mcpCount}`;
          parts.push(`\u{1F50C} ${text}`);
        }
        if (hooksCount > 0) {
          const text = info ? colorize(`hooks:${hooksCount}`, info) : `hooks:${hooksCount}`;
          parts.push(`\u{1FA9D} ${text}`);
        }
        const sep = muted ? colorize(" \u2502 ", muted) : " \u2502 ";
        return parts.join(sep);
      },
      verbose: (data, colors2) => {
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
        const parts = [];
        const info = colors2?.semantic.info ?? "";
        const muted = colors2?.base.muted ?? "";
        if (claudeMdCount > 0) {
          const text = info ? colorize(`${claudeMdCount} CLAUDE.md`, info) : `${claudeMdCount} CLAUDE.md`;
          parts.push(text);
        }
        if (rulesCount > 0) {
          const text = info ? colorize(`${rulesCount} rules`, info) : `${rulesCount} rules`;
          parts.push(text);
        }
        if (mcpCount > 0) {
          const text = info ? colorize(`${mcpCount} MCP servers`, info) : `${mcpCount} MCP servers`;
          parts.push(text);
        }
        if (hooksCount > 0) {
          const text = info ? colorize(`${hooksCount} hooks`, info) : `${hooksCount} hooks`;
          parts.push(text);
        }
        const sep = muted ? colorize(" \u2502 ", muted) : " \u2502 ";
        return parts.join(sep);
      }
    };
  }
});

// src/widgets/config-count-widget.ts
var ConfigCountWidget;
var init_config_count_widget = __esm({
  "src/widgets/config-count-widget.ts"() {
    "use strict";
    init_style_types();
    init_widget_types();
    init_config_provider();
    init_theme();
    init_styles3();
    ConfigCountWidget = class {
      id = "config-count";
      metadata = createWidgetMetadata(
        "Config Count",
        "Displays Claude Code configuration counts",
        "1.0.0",
        "claude-scope",
        1
        // Second line
      );
      configProvider;
      configs;
      cwd;
      themeColors;
      styleFn = configCountStyles.balanced;
      constructor(configProvider, themeColors) {
        this.configProvider = configProvider ?? new ConfigProvider();
        this.themeColors = themeColors ?? DEFAULT_THEME;
      }
      setStyle(style = DEFAULT_WIDGET_STYLE) {
        const fn = configCountStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      async initialize() {
      }
      async update(data) {
        this.cwd = data.cwd;
        this.configs = await this.configProvider.getConfigs({ cwd: data.cwd });
      }
      isEnabled() {
        if (!this.configs) {
          return false;
        }
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
        return claudeMdCount > 0 || rulesCount > 0 || mcpCount > 0 || hooksCount > 0;
      }
      async render(_context) {
        if (!this.configs) {
          return null;
        }
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
        const renderData = {
          claudeMdCount,
          rulesCount,
          mcpCount,
          hooksCount,
          colors: this.themeColors
        };
        return this.styleFn(renderData, this.themeColors);
      }
      async cleanup() {
      }
    };
  }
});

// src/ui/utils/style-utils.ts
function withLabel(prefix, value) {
  if (prefix === "") return value;
  return `${prefix}: ${value}`;
}
function withIndicator(value) {
  return `\u25CF ${value}`;
}
function progressBar(percent, width = 10) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round(clamped / 100 * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}
var init_style_utils = __esm({
  "src/ui/utils/style-utils.ts"() {
    "use strict";
  }
});

// src/widgets/context/styles.ts
function getContextColor(percent, colors2) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  if (clampedPercent < 50) {
    return colors2.low;
  } else if (clampedPercent < 80) {
    return colors2.medium;
  } else {
    return colors2.high;
  }
}
var contextStyles;
var init_styles4 = __esm({
  "src/widgets/context/styles.ts"() {
    "use strict";
    init_colors();
    init_style_utils();
    contextStyles = {
      balanced: (data, colors2) => {
        const bar = progressBar(data.percent, 10);
        const output = `[${bar}] ${data.percent}%`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      },
      compact: (data, colors2) => {
        const output = `${data.percent}%`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      },
      playful: (data, colors2) => {
        const bar = progressBar(data.percent, 10);
        const output = `\u{1F9E0} [${bar}] ${data.percent}%`;
        if (!colors2) return output;
        return `\u{1F9E0} ${colorize(`[${bar}] ${data.percent}%`, getContextColor(data.percent, colors2))}`;
      },
      verbose: (data, colors2) => {
        const usedFormatted = data.used.toLocaleString();
        const maxFormatted = data.contextWindowSize.toLocaleString();
        const output = `${usedFormatted} / ${maxFormatted} tokens (${data.percent}%)`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      },
      symbolic: (data, colors2) => {
        const filled = Math.round(data.percent / 100 * 5);
        const empty = 5 - filled;
        const output = `${"\u25AE".repeat(filled)}${"\u25AF".repeat(empty)} ${data.percent}%`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      },
      "compact-verbose": (data, colors2) => {
        const usedK = data.used >= 1e3 ? `${Math.floor(data.used / 1e3)}K` : data.used.toString();
        const maxK = data.contextWindowSize >= 1e3 ? `${Math.floor(data.contextWindowSize / 1e3)}K` : data.contextWindowSize.toString();
        const output = `${data.percent}% (${usedK}/${maxK})`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      },
      indicator: (data, colors2) => {
        const output = `\u25CF ${data.percent}%`;
        if (!colors2) return output;
        return colorize(output, getContextColor(data.percent, colors2));
      }
    };
  }
});

// src/widgets/context-widget.ts
var ContextWidget;
var init_context_widget = __esm({
  "src/widgets/context-widget.ts"() {
    "use strict";
    init_widget_types();
    init_cache_manager();
    init_theme();
    init_styles4();
    init_stdin_data_widget();
    ContextWidget = class extends StdinDataWidget {
      id = "context";
      metadata = createWidgetMetadata(
        "Context",
        "Displays context window usage with progress bar",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      colors;
      styleFn = contextStyles.balanced;
      cacheManager;
      lastSessionId;
      constructor(colors2) {
        super();
        this.colors = colors2 ?? DEFAULT_THEME;
        this.cacheManager = new CacheManager();
      }
      setStyle(style = "balanced") {
        const fn = contextStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      /**
       * Update widget with new data, storing valid values in cache
       */
      async update(data) {
        await super.update(data);
        const sessionChanged = this.lastSessionId && this.lastSessionId !== data.session_id;
        this.lastSessionId = data.session_id;
        const { current_usage } = data.context_window;
        if (current_usage && !sessionChanged) {
          const hasAnyTokens = (current_usage.input_tokens ?? 0) > 0 || (current_usage.output_tokens ?? 0) > 0 || (current_usage.cache_creation_input_tokens ?? 0) > 0 || (current_usage.cache_read_input_tokens ?? 0) > 0;
          if (hasAnyTokens) {
            this.cacheManager.setCachedUsage(data.session_id, {
              input_tokens: current_usage.input_tokens,
              output_tokens: current_usage.output_tokens,
              cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
              cache_read_input_tokens: current_usage.cache_read_input_tokens
            });
          }
        }
      }
      renderWithData(data, _context) {
        const { current_usage, context_window_size } = data.context_window;
        let usage = current_usage;
        if (!usage) {
          const cached = this.cacheManager.getCachedUsage(data.session_id);
          if (cached) {
            usage = cached.usage;
          }
        }
        if (!usage) return null;
        const used = usage.input_tokens + usage.cache_creation_input_tokens + usage.cache_read_input_tokens + usage.output_tokens;
        const percent = Math.round(used / context_window_size * 100);
        const renderData = {
          used,
          contextWindowSize: context_window_size,
          percent
        };
        return this.styleFn(renderData, this.colors.context);
      }
      isEnabled() {
        return true;
      }
    };
  }
});

// src/widgets/cost/styles.ts
function balancedStyle(data, colors2) {
  const formatted = formatCostUSD(data.costUsd);
  if (!colors2) return formatted;
  const amountStr = data.costUsd.toFixed(2);
  return colorize("$", colors2.currency) + colorize(amountStr, colors2.amount);
}
var costStyles;
var init_styles5 = __esm({
  "src/widgets/cost/styles.ts"() {
    "use strict";
    init_colors();
    init_formatters();
    init_style_utils();
    costStyles = {
      balanced: balancedStyle,
      compact: balancedStyle,
      playful: (data, colors2) => {
        const formatted = formatCostUSD(data.costUsd);
        if (!colors2) return `\u{1F4B0} ${formatted}`;
        const amountStr = data.costUsd.toFixed(2);
        const colored = colorize("$", colors2.currency) + colorize(amountStr, colors2.amount);
        return `\u{1F4B0} ${colored}`;
      },
      labeled: (data, colors2) => {
        const formatted = formatCostUSD(data.costUsd);
        if (!colors2) return withLabel("Cost", formatted);
        const amountStr = data.costUsd.toFixed(2);
        const colored = colorize("$", colors2.currency) + colorize(amountStr, colors2.amount);
        return withLabel("Cost", colored);
      },
      indicator: (data, colors2) => {
        const formatted = formatCostUSD(data.costUsd);
        if (!colors2) return withIndicator(formatted);
        const amountStr = data.costUsd.toFixed(2);
        const colored = colorize("$", colors2.currency) + colorize(amountStr, colors2.amount);
        return withIndicator(colored);
      }
    };
  }
});

// src/widgets/cost-widget.ts
var CostWidget;
var init_cost_widget = __esm({
  "src/widgets/cost-widget.ts"() {
    "use strict";
    init_widget_types();
    init_theme();
    init_stdin_data_widget();
    init_styles5();
    CostWidget = class extends StdinDataWidget {
      id = "cost";
      metadata = createWidgetMetadata(
        "Cost",
        "Displays session cost in USD",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      colors;
      styleFn = costStyles.balanced;
      constructor(colors2) {
        super();
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = costStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      renderWithData(data, _context) {
        if (!data.cost || data.cost.total_cost_usd === void 0) return null;
        const renderData = {
          costUsd: data.cost.total_cost_usd
        };
        return this.styleFn(renderData, this.colors.cost);
      }
    };
  }
});

// src/widgets/duration/styles.ts
function formatDurationWithColors(ms, colors2) {
  if (ms <= 0) return colorize("0s", colors2.value);
  const totalSeconds = Math.floor(ms / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(
      colorize(`${hours}`, colors2.value) + colorize("h", colors2.unit),
      colorize(`${minutes}`, colors2.value) + colorize("m", colors2.unit),
      colorize(`${seconds}`, colors2.value) + colorize("s", colors2.unit)
    );
  } else if (minutes > 0) {
    parts.push(
      colorize(`${minutes}`, colors2.value) + colorize("m", colors2.unit),
      colorize(`${seconds}`, colors2.value) + colorize("s", colors2.unit)
    );
  } else {
    parts.push(colorize(`${seconds}`, colors2.value) + colorize("s", colors2.unit));
  }
  return parts.join(" ");
}
var durationStyles;
var init_styles6 = __esm({
  "src/widgets/duration/styles.ts"() {
    "use strict";
    init_colors();
    init_formatters();
    init_style_utils();
    durationStyles = {
      balanced: (data, colors2) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors2) return formatted;
        return formatDurationWithColors(data.durationMs, colors2);
      },
      compact: (data, colors2) => {
        const totalSeconds = Math.floor(data.durationMs / 1e3);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        if (!colors2) {
          if (hours > 0) {
            return `${hours}h${minutes}m`;
          }
          return `${minutes}m`;
        }
        if (hours > 0) {
          return colorize(`${hours}`, colors2.value) + colorize("h", colors2.unit) + colorize(`${minutes}`, colors2.value) + colorize("m", colors2.unit);
        }
        return colorize(`${minutes}`, colors2.value) + colorize("m", colors2.unit);
      },
      playful: (data, colors2) => {
        const totalSeconds = Math.floor(data.durationMs / 1e3);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds % 3600 / 60);
        if (!colors2) {
          if (hours > 0) {
            return `\u231B ${hours}h ${minutes}m`;
          }
          return `\u231B ${minutes}m`;
        }
        if (hours > 0) {
          const colored = colorize(`${hours}`, colors2.value) + colorize("h", colors2.unit) + colorize(` ${minutes}`, colors2.value) + colorize("m", colors2.unit);
          return `\u231B ${colored}`;
        }
        return `\u231B ${colorize(`${minutes}`, colors2.value)}${colorize("m", colors2.unit)}`;
      },
      technical: (data, colors2) => {
        const value = `${Math.floor(data.durationMs)}ms`;
        if (!colors2) return value;
        return colorize(`${Math.floor(data.durationMs)}`, colors2.value) + colorize("ms", colors2.unit);
      },
      labeled: (data, colors2) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors2) return withLabel("Time", formatted);
        const colored = formatDurationWithColors(data.durationMs, colors2);
        return withLabel("Time", colored);
      },
      indicator: (data, colors2) => {
        const formatted = formatDuration(data.durationMs);
        if (!colors2) return withIndicator(formatted);
        const colored = formatDurationWithColors(data.durationMs, colors2);
        return withIndicator(colored);
      }
    };
  }
});

// src/widgets/duration-widget.ts
var DurationWidget;
var init_duration_widget = __esm({
  "src/widgets/duration-widget.ts"() {
    "use strict";
    init_widget_types();
    init_theme();
    init_stdin_data_widget();
    init_styles6();
    DurationWidget = class extends StdinDataWidget {
      id = "duration";
      metadata = createWidgetMetadata(
        "Duration",
        "Displays elapsed session time",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      colors;
      styleFn = durationStyles.balanced;
      constructor(colors2) {
        super();
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = durationStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      renderWithData(data, _context) {
        if (!data.cost || data.cost.total_duration_ms === void 0) return null;
        const renderData = {
          durationMs: data.cost.total_duration_ms
        };
        return this.styleFn(renderData, this.colors.duration);
      }
    };
  }
});

// src/providers/git-provider.ts
function createGit(cwd) {
  return new NativeGit(cwd);
}
var import_node_child_process, import_node_util, execFileAsync, NativeGit;
var init_git_provider = __esm({
  "src/providers/git-provider.ts"() {
    "use strict";
    import_node_child_process = require("node:child_process");
    import_node_util = require("node:util");
    execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
    NativeGit = class {
      cwd;
      constructor(cwd) {
        this.cwd = cwd;
      }
      async status() {
        try {
          const { stdout } = await execFileAsync("git", ["status", "--branch", "--short"], {
            cwd: this.cwd
          });
          const match = stdout.match(/^##\s+(\S+)/m);
          const current = match ? match[1] : null;
          return { current };
        } catch {
          return { current: null };
        }
      }
      async diffSummary(options) {
        const args = ["diff", "--shortstat"];
        if (options) {
          args.push(...options);
        }
        try {
          const { stdout } = await execFileAsync("git", args, {
            cwd: this.cwd
          });
          const fileMatch = stdout.match(/(\d+)\s+file(s?)\s+changed/);
          const insertionMatch = stdout.match(/(\d+)\s+insertion/);
          const deletionMatch = stdout.match(/(\d+)\s+deletion/);
          const fileCount = fileMatch ? parseInt(fileMatch[1], 10) : 0;
          const insertions = insertionMatch ? parseInt(insertionMatch[1], 10) : 0;
          const deletions = deletionMatch ? parseInt(deletionMatch[1], 10) : 0;
          const files = insertions > 0 || deletions > 0 ? [{ file: "(total)", insertions, deletions }] : [];
          return { fileCount, files };
        } catch {
          return { fileCount: 0, files: [] };
        }
      }
      async latestTag() {
        try {
          const { stdout } = await execFileAsync("git", ["describe", "--tags", "--abbrev=0"], {
            cwd: this.cwd
          });
          return stdout.trim();
        } catch {
          return null;
        }
      }
    };
  }
});

// src/widgets/git-tag/styles.ts
var gitTagStyles;
var init_styles7 = __esm({
  "src/widgets/git-tag/styles.ts"() {
    "use strict";
    init_colors();
    init_style_utils();
    gitTagStyles = {
      balanced: (data, colors2) => {
        const tag = data.tag || "\u2014";
        if (!colors2) return tag;
        return colorize(tag, colors2.branch);
      },
      compact: (data, colors2) => {
        if (!data.tag) return "\u2014";
        const tag = data.tag.replace(/^v/, "");
        if (!colors2) return tag;
        return colorize(tag, colors2.branch);
      },
      playful: (data, colors2) => {
        const tag = data.tag || "\u2014";
        if (!colors2) return `\u{1F3F7}\uFE0F ${tag}`;
        return `\u{1F3F7}\uFE0F ${colorize(tag, colors2.branch)}`;
      },
      verbose: (data, colors2) => {
        if (!data.tag) return "version: none";
        const tag = `version ${data.tag}`;
        if (!colors2) return tag;
        return `version ${colorize(data.tag, colors2.branch)}`;
      },
      labeled: (data, colors2) => {
        const tag = data.tag || "none";
        if (!colors2) return withLabel("Tag", tag);
        return withLabel("Tag", colorize(tag, colors2.branch));
      },
      indicator: (data, colors2) => {
        const tag = data.tag || "\u2014";
        if (!colors2) return withIndicator(tag);
        return withIndicator(colorize(tag, colors2.branch));
      }
    };
  }
});

// src/widgets/git/git-tag-widget.ts
var GitTagWidget;
var init_git_tag_widget = __esm({
  "src/widgets/git/git-tag-widget.ts"() {
    "use strict";
    init_widget_types();
    init_git_provider();
    init_theme();
    init_styles7();
    GitTagWidget = class {
      id = "git-tag";
      metadata = createWidgetMetadata(
        "Git Tag Widget",
        "Displays the latest git tag",
        "1.0.0",
        "claude-scope",
        1
        // Second line
      );
      gitFactory;
      git = null;
      enabled = true;
      cwd = null;
      colors;
      styleFn = gitTagStyles.balanced;
      /**
       * @param gitFactory - Optional factory function for creating IGit instances
       *                     If not provided, uses default createGit (production)
       *                     Tests can inject MockGit factory here
       * @param colors - Optional theme colors
       */
      constructor(gitFactory, colors2) {
        this.gitFactory = gitFactory || createGit;
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = gitTagStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      async initialize(context) {
        this.enabled = context.config?.enabled !== false;
      }
      async render(_context) {
        if (!this.enabled || !this.git || !this.cwd) {
          return null;
        }
        try {
          const latestTag = await (this.git.latestTag?.() ?? Promise.resolve(null));
          const renderData = { tag: latestTag };
          return this.styleFn(renderData, this.colors.git);
        } catch {
          return null;
        }
      }
      async update(data) {
        if (data.cwd !== this.cwd) {
          this.cwd = data.cwd;
          this.git = this.gitFactory(data.cwd);
        }
      }
      isEnabled() {
        return this.enabled;
      }
      async cleanup() {
      }
    };
  }
});

// src/widgets/git/styles.ts
var gitStyles;
var init_styles8 = __esm({
  "src/widgets/git/styles.ts"() {
    "use strict";
    init_colors();
    init_style_utils();
    gitStyles = {
      minimal: (data, colors2) => {
        if (!colors2) return data.branch;
        return colorize(data.branch, colors2.branch);
      },
      balanced: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
          if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
          if (parts.length > 0) {
            const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            const changes = colors2 ? colorize(`[${parts.join(" ")}]`, colors2.changes) : `[${parts.join(" ")}]`;
            return `${branch} ${changes}`;
          }
        }
        return colors2 ? colorize(data.branch, colors2.branch) : data.branch;
      },
      compact: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
          if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
          if (parts.length > 0) {
            const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            const changesStr = parts.join("/");
            return `${branch} ${changesStr}`;
          }
        }
        return colors2 ? colorize(data.branch, colors2.branch) : data.branch;
      },
      playful: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`\u2B06${data.changes.insertions}`);
          if (data.changes.deletions > 0) parts.push(`\u2B07${data.changes.deletions}`);
          if (parts.length > 0) {
            const branch2 = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            return `\u{1F500} ${branch2} ${parts.join(" ")}`;
          }
        }
        const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
        return `\u{1F500} ${branch}`;
      },
      verbose: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions} insertions`);
          if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions} deletions`);
          if (parts.length > 0) {
            const branch2 = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            const changes = colors2 ? colorize(`[${parts.join(", ")}]`, colors2.changes) : `[${parts.join(", ")}]`;
            return `branch: ${branch2} ${changes}`;
          }
        }
        const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
        return `branch: ${branch} (HEAD)`;
      },
      labeled: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
          if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
          if (parts.length > 0) {
            const branch2 = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            const changes = `${data.changes.files} files: ${parts.join("/")}`;
            return `Git: ${branch2} [${changes}]`;
          }
        }
        const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
        return `Git: ${branch}`;
      },
      indicator: (data, colors2) => {
        if (data.changes && data.changes.files > 0) {
          const parts = [];
          if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
          if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
          if (parts.length > 0) {
            const branch = colors2 ? colorize(data.branch, colors2.branch) : data.branch;
            const changes = colors2 ? colorize(`[${parts.join(" ")}]`, colors2.changes) : `[${parts.join(" ")}]`;
            return `\u25CF ${branch} ${changes}`;
          }
        }
        return withIndicator(colors2 ? colorize(data.branch, colors2.branch) : data.branch);
      }
    };
  }
});

// src/widgets/git/git-widget.ts
var GitWidget;
var init_git_widget = __esm({
  "src/widgets/git/git-widget.ts"() {
    "use strict";
    init_widget_types();
    init_git_provider();
    init_theme();
    init_styles8();
    GitWidget = class {
      id = "git";
      metadata = createWidgetMetadata(
        "Git Widget",
        "Displays current git branch",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      gitFactory;
      git = null;
      enabled = true;
      cwd = null;
      colors;
      styleFn = gitStyles.balanced;
      /**
       * @param gitFactory - Optional factory function for creating IGit instances
       *                     If not provided, uses default createGit (production)
       *                     Tests can inject MockGit factory here
       * @param colors - Optional theme colors
       */
      constructor(gitFactory, colors2) {
        this.gitFactory = gitFactory || createGit;
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = gitStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      async initialize(context) {
        this.enabled = context.config?.enabled !== false;
      }
      async render(_context) {
        if (!this.enabled || !this.git || !this.cwd) {
          return null;
        }
        try {
          const status = await this.git.status();
          const branch = status.current || null;
          if (!branch) {
            return null;
          }
          let changes;
          try {
            const diffSummary = await this.git.diffSummary();
            if (diffSummary.fileCount > 0) {
              let insertions = 0;
              let deletions = 0;
              for (const file of diffSummary.files) {
                insertions += file.insertions || 0;
                deletions += file.deletions || 0;
              }
              if (insertions > 0 || deletions > 0) {
                changes = { files: diffSummary.fileCount, insertions, deletions };
              }
            }
          } catch {
          }
          const renderData = { branch, changes };
          return this.styleFn(renderData, this.colors.git);
        } catch {
          return null;
        }
      }
      async update(data) {
        if (data.cwd !== this.cwd) {
          this.cwd = data.cwd;
          this.git = this.gitFactory(data.cwd);
        }
      }
      isEnabled() {
        return this.enabled;
      }
      async cleanup() {
      }
    };
  }
});

// src/widgets/lines/styles.ts
var linesStyles;
var init_styles9 = __esm({
  "src/widgets/lines/styles.ts"() {
    "use strict";
    init_colors();
    init_style_utils();
    linesStyles = {
      balanced: (data, colors2) => {
        if (!colors2) return `+${data.added}/-${data.removed}`;
        const addedStr = colorize(`+${data.added}`, colors2.added);
        const removedStr = colorize(`-${data.removed}`, colors2.removed);
        return `${addedStr}/${removedStr}`;
      },
      compact: (data, colors2) => {
        if (!colors2) return `+${data.added}-${data.removed}`;
        const addedStr = colorize(`+${data.added}`, colors2.added);
        const removedStr = colorize(`-${data.removed}`, colors2.removed);
        return `${addedStr}${removedStr}`;
      },
      playful: (data, colors2) => {
        if (!colors2) return `\u2795${data.added} \u2796${data.removed}`;
        const addedStr = colorize(`\u2795${data.added}`, colors2.added);
        const removedStr = colorize(`\u2796${data.removed}`, colors2.removed);
        return `${addedStr} ${removedStr}`;
      },
      verbose: (data, colors2) => {
        const parts = [];
        if (data.added > 0) {
          const text = `+${data.added} added`;
          parts.push(colors2 ? colorize(text, colors2.added) : text);
        }
        if (data.removed > 0) {
          const text = `-${data.removed} removed`;
          parts.push(colors2 ? colorize(text, colors2.removed) : text);
        }
        return parts.join(", ");
      },
      labeled: (data, colors2) => {
        const addedStr = colors2 ? colorize(`+${data.added}`, colors2.added) : `+${data.added}`;
        const removedStr = colors2 ? colorize(`-${data.removed}`, colors2.removed) : `-${data.removed}`;
        const lines = `${addedStr}/${removedStr}`;
        return withLabel("Lines", lines);
      },
      indicator: (data, colors2) => {
        const addedStr = colors2 ? colorize(`+${data.added}`, colors2.added) : `+${data.added}`;
        const removedStr = colors2 ? colorize(`-${data.removed}`, colors2.removed) : `-${data.removed}`;
        const lines = `${addedStr}/${removedStr}`;
        return withIndicator(lines);
      }
    };
  }
});

// src/widgets/lines-widget.ts
var LinesWidget;
var init_lines_widget = __esm({
  "src/widgets/lines-widget.ts"() {
    "use strict";
    init_widget_types();
    init_theme();
    init_stdin_data_widget();
    init_styles9();
    LinesWidget = class extends StdinDataWidget {
      id = "lines";
      metadata = createWidgetMetadata(
        "Lines",
        "Displays lines added/removed in session",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      colors;
      styleFn = linesStyles.balanced;
      constructor(colors2) {
        super();
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = linesStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      renderWithData(data, _context) {
        const added = data.cost?.total_lines_added ?? 0;
        const removed = data.cost?.total_lines_removed ?? 0;
        const renderData = { added, removed };
        return this.styleFn(renderData, this.colors.lines);
      }
    };
  }
});

// src/widgets/model/styles.ts
function getShortName(displayName) {
  return displayName.replace(/^Claude\s+/, "");
}
var modelStyles;
var init_styles10 = __esm({
  "src/widgets/model/styles.ts"() {
    "use strict";
    init_colors();
    init_style_utils();
    modelStyles = {
      balanced: (data, colors2) => {
        if (!colors2) return data.displayName;
        return colorize(data.displayName, colors2.name);
      },
      compact: (data, colors2) => {
        const shortName = getShortName(data.displayName);
        if (!colors2) return shortName;
        return colorize(shortName, colors2.name);
      },
      playful: (data, colors2) => {
        const shortName = getShortName(data.displayName);
        if (!colors2) return `\u{1F916} ${shortName}`;
        return `\u{1F916} ${colorize(shortName, colors2.name)}`;
      },
      technical: (data, colors2) => {
        if (!colors2) return data.id;
        const match = data.id.match(/^(.+?)-(\d[\d.]*)$/);
        if (match) {
          return colorize(match[1], colors2.name) + colorize(`-${match[2]}`, colors2.version);
        }
        return colorize(data.id, colors2.name);
      },
      symbolic: (data, colors2) => {
        const shortName = getShortName(data.displayName);
        if (!colors2) return `\u25C6 ${shortName}`;
        return `\u25C6 ${colorize(shortName, colors2.name)}`;
      },
      labeled: (data, colors2) => {
        const shortName = getShortName(data.displayName);
        if (!colors2) return withLabel("Model", shortName);
        return withLabel("Model", colorize(shortName, colors2.name));
      },
      indicator: (data, colors2) => {
        const shortName = getShortName(data.displayName);
        if (!colors2) return withIndicator(shortName);
        return withIndicator(colorize(shortName, colors2.name));
      }
    };
  }
});

// src/widgets/model-widget.ts
var ModelWidget;
var init_model_widget = __esm({
  "src/widgets/model-widget.ts"() {
    "use strict";
    init_widget_types();
    init_theme();
    init_stdin_data_widget();
    init_styles10();
    ModelWidget = class extends StdinDataWidget {
      id = "model";
      metadata = createWidgetMetadata(
        "Model",
        "Displays the current Claude model name",
        "1.0.0",
        "claude-scope",
        0
        // First line
      );
      colors;
      styleFn = modelStyles.balanced;
      constructor(colors2) {
        super();
        this.colors = colors2 ?? DEFAULT_THEME;
      }
      setStyle(style = "balanced") {
        const fn = modelStyles[style];
        if (fn) {
          this.styleFn = fn;
        }
      }
      renderWithData(data, _context) {
        const renderData = {
          displayName: data.model.display_name,
          id: data.model.id
        };
        return this.styleFn(renderData, this.colors.model);
      }
    };
  }
});

// src/cli/commands/quick-config/demo-data.ts
function createDemoData() {
  return {
    hook_event_name: "Status",
    session_id: "demo_session_20250111",
    transcript_path: "/Users/demo/.claude/projects/-Users-demo-claude-scope/session.jsonl",
    cwd: "/Users/demo/claude-scope",
    model: {
      id: "claude-opus-4-5-20251101",
      display_name: "Claude Opus 4.5"
    },
    workspace: {
      current_dir: "/Users/demo/claude-scope",
      project_dir: "/Users/demo/claude-scope"
    },
    version: "1.0.0",
    output_style: {
      name: "default"
    },
    cost: {
      total_cost_usd: DEMO_DATA.COST_USD,
      total_duration_ms: DEMO_DATA.DURATION_MS,
      total_api_duration_ms: DEMO_DATA.API_DURATION_MS,
      total_lines_added: DEMO_DATA.LINES_ADDED,
      total_lines_removed: DEMO_DATA.LINES_REMOVED
    },
    context_window: {
      total_input_tokens: DEMO_DATA.TOTAL_INPUT_TOKENS,
      total_output_tokens: DEMO_DATA.TOTAL_OUTPUT_TOKENS,
      context_window_size: DEMO_DATA.CONTEXT_WINDOW_SIZE,
      current_usage: {
        input_tokens: DEMO_DATA.CURRENT_INPUT_TOKENS,
        output_tokens: DEMO_DATA.CURRENT_OUTPUT_TOKENS,
        cache_creation_input_tokens: DEMO_DATA.CACHE_CREATION_TOKENS,
        cache_read_input_tokens: DEMO_DATA.CACHE_READ_TOKENS
      }
    }
  };
}
var init_demo_data = __esm({
  "src/cli/commands/quick-config/demo-data.ts"() {
    "use strict";
    init_constants();
  }
});

// src/cli/commands/quick-config/layout-preview.ts
async function registerWidgetsFromConfig(registry, config, style, themeName) {
  const themeColors = getThemeByName(themeName).colors;
  const transcriptProvider = new MockTranscriptProvider();
  const widgetFactory = {
    model: (s) => {
      const w = new ModelWidget(themeColors);
      w.setStyle(s);
      return w;
    },
    context: (s) => {
      const w = new ContextWidget(themeColors);
      w.setStyle(s);
      return w;
    },
    cost: (s) => {
      const w = new CostWidget(themeColors);
      w.setStyle(s);
      return w;
    },
    duration: (s) => {
      const w = new DurationWidget(themeColors);
      w.setStyle(s);
      return w;
    },
    lines: (s) => {
      const w = new LinesWidget(themeColors);
      w.setStyle(s);
      return w;
    },
    git: (s) => {
      const w = new GitWidget((cwd) => new MockGit(cwd), themeColors);
      w.setStyle(s);
      return w;
    },
    "git-tag": (s) => {
      const w = new GitTagWidget((cwd) => new MockGit(cwd), themeColors);
      w.setStyle(s);
      return w;
    },
    "config-count": (s) => {
      const mockConfig = new MockConfigProvider();
      const w = new ConfigCountWidget(mockConfig, themeColors);
      w.setStyle(s);
      return w;
    },
    "active-tools": (s) => {
      const w = new ActiveToolsWidget(themeColors, transcriptProvider);
      w.setStyle(s);
      return w;
    },
    "cache-metrics": (s) => {
      const w = new CacheMetricsWidget(themeColors);
      w.setStyle(s);
      return w;
    }
  };
  for (const [lineNum, widgets] of Object.entries(config.lines)) {
    const line = parseInt(lineNum, 10);
    for (const widgetConfig of widgets) {
      const factory = widgetFactory[widgetConfig.id];
      if (factory) {
        const widget = factory(style);
        widget.metadata.line = line;
        await registry.register(widget);
      }
    }
  }
}
async function renderPreviewFromConfig(config, style, themeName) {
  const registry = new WidgetRegistry();
  await registerWidgetsFromConfig(registry, config, style, themeName);
  const renderer = new Renderer({
    separator: " \u2502 ",
    onError: () => {
    },
    showErrors: false
  });
  const demoData = createDemoData();
  for (const widget of registry.getAll()) {
    await widget.update(demoData);
  }
  const lines = await renderer.render(registry.getEnabledWidgets(), {
    width: 80,
    timestamp: Date.now()
  });
  return lines.join("\n");
}
var init_layout_preview = __esm({
  "src/cli/commands/quick-config/layout-preview.ts"() {
    "use strict";
    init_renderer();
    init_widget_registry();
    init_mock_config_provider();
    init_mock_git();
    init_mock_transcript_provider();
    init_theme();
    init_active_tools();
    init_cache_metrics();
    init_config_count_widget();
    init_context_widget();
    init_cost_widget();
    init_duration_widget();
    init_git_tag_widget();
    init_git_widget();
    init_lines_widget();
    init_model_widget();
    init_demo_data();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/key.js
var isUpKey, isDownKey, isEnterKey;
var init_key = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/key.js"() {
    isUpKey = (key, keybindings = []) => (
      // The up key
      key.name === "up" || // Vim keybinding: hjkl keys map to left/down/up/right
      keybindings.includes("vim") && key.name === "k" || // Emacs keybinding: Ctrl+P means "previous" in Emacs navigation conventions
      keybindings.includes("emacs") && key.ctrl && key.name === "p"
    );
    isDownKey = (key, keybindings = []) => (
      // The down key
      key.name === "down" || // Vim keybinding: hjkl keys map to left/down/up/right
      keybindings.includes("vim") && key.name === "j" || // Emacs keybinding: Ctrl+N means "next" in Emacs navigation conventions
      keybindings.includes("emacs") && key.ctrl && key.name === "n"
    );
    isEnterKey = (key) => key.name === "enter" || key.name === "return";
  }
});

// node_modules/@inquirer/core/dist/esm/lib/errors.js
var AbortPromptError, CancelPromptError, ExitPromptError, HookError, ValidationError;
var init_errors = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/errors.js"() {
    AbortPromptError = class extends Error {
      name = "AbortPromptError";
      message = "Prompt was aborted";
      constructor(options) {
        super();
        this.cause = options?.cause;
      }
    };
    CancelPromptError = class extends Error {
      name = "CancelPromptError";
      message = "Prompt was canceled";
    };
    ExitPromptError = class extends Error {
      name = "ExitPromptError";
    };
    HookError = class extends Error {
      name = "HookError";
    };
    ValidationError = class extends Error {
      name = "ValidationError";
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/hook-engine.js
function createStore(rl) {
  const store = {
    rl,
    hooks: [],
    hooksCleanup: [],
    hooksEffect: [],
    index: 0,
    handleChange() {
    }
  };
  return store;
}
function withHooks(rl, cb) {
  const store = createStore(rl);
  return hookStorage.run(store, () => {
    function cycle(render) {
      store.handleChange = () => {
        store.index = 0;
        render();
      };
      store.handleChange();
    }
    return cb(cycle);
  });
}
function getStore() {
  const store = hookStorage.getStore();
  if (!store) {
    throw new HookError("[Inquirer] Hook functions can only be called from within a prompt");
  }
  return store;
}
function readline() {
  return getStore().rl;
}
function withUpdates(fn) {
  const wrapped = (...args) => {
    const store = getStore();
    let shouldUpdate = false;
    const oldHandleChange = store.handleChange;
    store.handleChange = () => {
      shouldUpdate = true;
    };
    const returnValue = fn(...args);
    if (shouldUpdate) {
      oldHandleChange();
    }
    store.handleChange = oldHandleChange;
    return returnValue;
  };
  return import_node_async_hooks.AsyncResource.bind(wrapped);
}
function withPointer(cb) {
  const store = getStore();
  const { index } = store;
  const pointer = {
    get() {
      return store.hooks[index];
    },
    set(value) {
      store.hooks[index] = value;
    },
    initialized: index in store.hooks
  };
  const returnValue = cb(pointer);
  store.index++;
  return returnValue;
}
function handleChange() {
  getStore().handleChange();
}
var import_node_async_hooks, hookStorage, effectScheduler;
var init_hook_engine = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/hook-engine.js"() {
    import_node_async_hooks = require("node:async_hooks");
    init_errors();
    hookStorage = new import_node_async_hooks.AsyncLocalStorage();
    effectScheduler = {
      queue(cb) {
        const store = getStore();
        const { index } = store;
        store.hooksEffect.push(() => {
          store.hooksCleanup[index]?.();
          const cleanFn = cb(readline());
          if (cleanFn != null && typeof cleanFn !== "function") {
            throw new ValidationError("useEffect return value must be a cleanup function or nothing.");
          }
          store.hooksCleanup[index] = cleanFn;
        });
      },
      run() {
        const store = getStore();
        withUpdates(() => {
          store.hooksEffect.forEach((effect) => {
            effect();
          });
          store.hooksEffect.length = 0;
        })();
      },
      clearAll() {
        const store = getStore();
        store.hooksCleanup.forEach((cleanFn) => {
          cleanFn?.();
        });
        store.hooksEffect.length = 0;
        store.hooksCleanup.length = 0;
      }
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-state.js
function useState(defaultValue) {
  return withPointer((pointer) => {
    const setState = import_node_async_hooks2.AsyncResource.bind(function setState2(newValue) {
      if (pointer.get() !== newValue) {
        pointer.set(newValue);
        handleChange();
      }
    });
    if (pointer.initialized) {
      return [pointer.get(), setState];
    }
    const value = typeof defaultValue === "function" ? defaultValue() : defaultValue;
    pointer.set(value);
    return [value, setState];
  });
}
var import_node_async_hooks2;
var init_use_state = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-state.js"() {
    import_node_async_hooks2 = require("node:async_hooks");
    init_hook_engine();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-effect.js
function useEffect(cb, depArray) {
  withPointer((pointer) => {
    const oldDeps = pointer.get();
    const hasChanged = !Array.isArray(oldDeps) || depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    if (hasChanged) {
      effectScheduler.queue(cb);
    }
    pointer.set(depArray);
  });
}
var init_use_effect = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-effect.js"() {
    init_hook_engine();
  }
});

// node_modules/yoctocolors-cjs/index.js
var require_yoctocolors_cjs = __commonJS({
  "node_modules/yoctocolors-cjs/index.js"(exports2, module2) {
    var tty = require("node:tty");
    var hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;
    var format = (open, close) => {
      if (!hasColors) {
        return (input) => input;
      }
      const openCode = `\x1B[${open}m`;
      const closeCode = `\x1B[${close}m`;
      return (input) => {
        const string2 = input + "";
        let index = string2.indexOf(closeCode);
        if (index === -1) {
          return openCode + string2 + closeCode;
        }
        let result = openCode;
        let lastIndex = 0;
        const reopenOnNestedClose = close === 22;
        const replaceCode = (reopenOnNestedClose ? closeCode : "") + openCode;
        while (index !== -1) {
          result += string2.slice(lastIndex, index) + replaceCode;
          lastIndex = index + closeCode.length;
          index = string2.indexOf(closeCode, lastIndex);
        }
        result += string2.slice(lastIndex) + closeCode;
        return result;
      };
    };
    var colors2 = {};
    colors2.reset = format(0, 0);
    colors2.bold = format(1, 22);
    colors2.dim = format(2, 22);
    colors2.italic = format(3, 23);
    colors2.underline = format(4, 24);
    colors2.overline = format(53, 55);
    colors2.inverse = format(7, 27);
    colors2.hidden = format(8, 28);
    colors2.strikethrough = format(9, 29);
    colors2.black = format(30, 39);
    colors2.red = format(31, 39);
    colors2.green = format(32, 39);
    colors2.yellow = format(33, 39);
    colors2.blue = format(34, 39);
    colors2.magenta = format(35, 39);
    colors2.cyan = format(36, 39);
    colors2.white = format(37, 39);
    colors2.gray = format(90, 39);
    colors2.bgBlack = format(40, 49);
    colors2.bgRed = format(41, 49);
    colors2.bgGreen = format(42, 49);
    colors2.bgYellow = format(43, 49);
    colors2.bgBlue = format(44, 49);
    colors2.bgMagenta = format(45, 49);
    colors2.bgCyan = format(46, 49);
    colors2.bgWhite = format(47, 49);
    colors2.bgGray = format(100, 49);
    colors2.redBright = format(91, 39);
    colors2.greenBright = format(92, 39);
    colors2.yellowBright = format(93, 39);
    colors2.blueBright = format(94, 39);
    colors2.magentaBright = format(95, 39);
    colors2.cyanBright = format(96, 39);
    colors2.whiteBright = format(97, 39);
    colors2.bgRedBright = format(101, 49);
    colors2.bgGreenBright = format(102, 49);
    colors2.bgYellowBright = format(103, 49);
    colors2.bgBlueBright = format(104, 49);
    colors2.bgMagentaBright = format(105, 49);
    colors2.bgCyanBright = format(106, 49);
    colors2.bgWhiteBright = format(107, 49);
    module2.exports = colors2;
  }
});

// node_modules/@inquirer/figures/dist/esm/index.js
function isUnicodeSupported() {
  if (import_node_process.default.platform !== "win32") {
    return import_node_process.default.env["TERM"] !== "linux";
  }
  return Boolean(import_node_process.default.env["WT_SESSION"]) || // Windows Terminal
  Boolean(import_node_process.default.env["TERMINUS_SUBLIME"]) || // Terminus (<0.2.27)
  import_node_process.default.env["ConEmuTask"] === "{cmd::Cmder}" || // ConEmu and cmder
  import_node_process.default.env["TERM_PROGRAM"] === "Terminus-Sublime" || import_node_process.default.env["TERM_PROGRAM"] === "vscode" || import_node_process.default.env["TERM"] === "xterm-256color" || import_node_process.default.env["TERM"] === "alacritty" || import_node_process.default.env["TERMINAL_EMULATOR"] === "JetBrains-JediTerm";
}
var import_node_process, common, specialMainSymbols, specialFallbackSymbols, mainSymbols, fallbackSymbols, shouldUseMain, figures, esm_default, replacements;
var init_esm = __esm({
  "node_modules/@inquirer/figures/dist/esm/index.js"() {
    import_node_process = __toESM(require("node:process"), 1);
    common = {
      circleQuestionMark: "(?)",
      questionMarkPrefix: "(?)",
      square: "\u2588",
      squareDarkShade: "\u2593",
      squareMediumShade: "\u2592",
      squareLightShade: "\u2591",
      squareTop: "\u2580",
      squareBottom: "\u2584",
      squareLeft: "\u258C",
      squareRight: "\u2590",
      squareCenter: "\u25A0",
      bullet: "\u25CF",
      dot: "\u2024",
      ellipsis: "\u2026",
      pointerSmall: "\u203A",
      triangleUp: "\u25B2",
      triangleUpSmall: "\u25B4",
      triangleDown: "\u25BC",
      triangleDownSmall: "\u25BE",
      triangleLeftSmall: "\u25C2",
      triangleRightSmall: "\u25B8",
      home: "\u2302",
      heart: "\u2665",
      musicNote: "\u266A",
      musicNoteBeamed: "\u266B",
      arrowUp: "\u2191",
      arrowDown: "\u2193",
      arrowLeft: "\u2190",
      arrowRight: "\u2192",
      arrowLeftRight: "\u2194",
      arrowUpDown: "\u2195",
      almostEqual: "\u2248",
      notEqual: "\u2260",
      lessOrEqual: "\u2264",
      greaterOrEqual: "\u2265",
      identical: "\u2261",
      infinity: "\u221E",
      subscriptZero: "\u2080",
      subscriptOne: "\u2081",
      subscriptTwo: "\u2082",
      subscriptThree: "\u2083",
      subscriptFour: "\u2084",
      subscriptFive: "\u2085",
      subscriptSix: "\u2086",
      subscriptSeven: "\u2087",
      subscriptEight: "\u2088",
      subscriptNine: "\u2089",
      oneHalf: "\xBD",
      oneThird: "\u2153",
      oneQuarter: "\xBC",
      oneFifth: "\u2155",
      oneSixth: "\u2159",
      oneEighth: "\u215B",
      twoThirds: "\u2154",
      twoFifths: "\u2156",
      threeQuarters: "\xBE",
      threeFifths: "\u2157",
      threeEighths: "\u215C",
      fourFifths: "\u2158",
      fiveSixths: "\u215A",
      fiveEighths: "\u215D",
      sevenEighths: "\u215E",
      line: "\u2500",
      lineBold: "\u2501",
      lineDouble: "\u2550",
      lineDashed0: "\u2504",
      lineDashed1: "\u2505",
      lineDashed2: "\u2508",
      lineDashed3: "\u2509",
      lineDashed4: "\u254C",
      lineDashed5: "\u254D",
      lineDashed6: "\u2574",
      lineDashed7: "\u2576",
      lineDashed8: "\u2578",
      lineDashed9: "\u257A",
      lineDashed10: "\u257C",
      lineDashed11: "\u257E",
      lineDashed12: "\u2212",
      lineDashed13: "\u2013",
      lineDashed14: "\u2010",
      lineDashed15: "\u2043",
      lineVertical: "\u2502",
      lineVerticalBold: "\u2503",
      lineVerticalDouble: "\u2551",
      lineVerticalDashed0: "\u2506",
      lineVerticalDashed1: "\u2507",
      lineVerticalDashed2: "\u250A",
      lineVerticalDashed3: "\u250B",
      lineVerticalDashed4: "\u254E",
      lineVerticalDashed5: "\u254F",
      lineVerticalDashed6: "\u2575",
      lineVerticalDashed7: "\u2577",
      lineVerticalDashed8: "\u2579",
      lineVerticalDashed9: "\u257B",
      lineVerticalDashed10: "\u257D",
      lineVerticalDashed11: "\u257F",
      lineDownLeft: "\u2510",
      lineDownLeftArc: "\u256E",
      lineDownBoldLeftBold: "\u2513",
      lineDownBoldLeft: "\u2512",
      lineDownLeftBold: "\u2511",
      lineDownDoubleLeftDouble: "\u2557",
      lineDownDoubleLeft: "\u2556",
      lineDownLeftDouble: "\u2555",
      lineDownRight: "\u250C",
      lineDownRightArc: "\u256D",
      lineDownBoldRightBold: "\u250F",
      lineDownBoldRight: "\u250E",
      lineDownRightBold: "\u250D",
      lineDownDoubleRightDouble: "\u2554",
      lineDownDoubleRight: "\u2553",
      lineDownRightDouble: "\u2552",
      lineUpLeft: "\u2518",
      lineUpLeftArc: "\u256F",
      lineUpBoldLeftBold: "\u251B",
      lineUpBoldLeft: "\u251A",
      lineUpLeftBold: "\u2519",
      lineUpDoubleLeftDouble: "\u255D",
      lineUpDoubleLeft: "\u255C",
      lineUpLeftDouble: "\u255B",
      lineUpRight: "\u2514",
      lineUpRightArc: "\u2570",
      lineUpBoldRightBold: "\u2517",
      lineUpBoldRight: "\u2516",
      lineUpRightBold: "\u2515",
      lineUpDoubleRightDouble: "\u255A",
      lineUpDoubleRight: "\u2559",
      lineUpRightDouble: "\u2558",
      lineUpDownLeft: "\u2524",
      lineUpBoldDownBoldLeftBold: "\u252B",
      lineUpBoldDownBoldLeft: "\u2528",
      lineUpDownLeftBold: "\u2525",
      lineUpBoldDownLeftBold: "\u2529",
      lineUpDownBoldLeftBold: "\u252A",
      lineUpDownBoldLeft: "\u2527",
      lineUpBoldDownLeft: "\u2526",
      lineUpDoubleDownDoubleLeftDouble: "\u2563",
      lineUpDoubleDownDoubleLeft: "\u2562",
      lineUpDownLeftDouble: "\u2561",
      lineUpDownRight: "\u251C",
      lineUpBoldDownBoldRightBold: "\u2523",
      lineUpBoldDownBoldRight: "\u2520",
      lineUpDownRightBold: "\u251D",
      lineUpBoldDownRightBold: "\u2521",
      lineUpDownBoldRightBold: "\u2522",
      lineUpDownBoldRight: "\u251F",
      lineUpBoldDownRight: "\u251E",
      lineUpDoubleDownDoubleRightDouble: "\u2560",
      lineUpDoubleDownDoubleRight: "\u255F",
      lineUpDownRightDouble: "\u255E",
      lineDownLeftRight: "\u252C",
      lineDownBoldLeftBoldRightBold: "\u2533",
      lineDownLeftBoldRightBold: "\u252F",
      lineDownBoldLeftRight: "\u2530",
      lineDownBoldLeftBoldRight: "\u2531",
      lineDownBoldLeftRightBold: "\u2532",
      lineDownLeftRightBold: "\u252E",
      lineDownLeftBoldRight: "\u252D",
      lineDownDoubleLeftDoubleRightDouble: "\u2566",
      lineDownDoubleLeftRight: "\u2565",
      lineDownLeftDoubleRightDouble: "\u2564",
      lineUpLeftRight: "\u2534",
      lineUpBoldLeftBoldRightBold: "\u253B",
      lineUpLeftBoldRightBold: "\u2537",
      lineUpBoldLeftRight: "\u2538",
      lineUpBoldLeftBoldRight: "\u2539",
      lineUpBoldLeftRightBold: "\u253A",
      lineUpLeftRightBold: "\u2536",
      lineUpLeftBoldRight: "\u2535",
      lineUpDoubleLeftDoubleRightDouble: "\u2569",
      lineUpDoubleLeftRight: "\u2568",
      lineUpLeftDoubleRightDouble: "\u2567",
      lineUpDownLeftRight: "\u253C",
      lineUpBoldDownBoldLeftBoldRightBold: "\u254B",
      lineUpDownBoldLeftBoldRightBold: "\u2548",
      lineUpBoldDownLeftBoldRightBold: "\u2547",
      lineUpBoldDownBoldLeftRightBold: "\u254A",
      lineUpBoldDownBoldLeftBoldRight: "\u2549",
      lineUpBoldDownLeftRight: "\u2540",
      lineUpDownBoldLeftRight: "\u2541",
      lineUpDownLeftBoldRight: "\u253D",
      lineUpDownLeftRightBold: "\u253E",
      lineUpBoldDownBoldLeftRight: "\u2542",
      lineUpDownLeftBoldRightBold: "\u253F",
      lineUpBoldDownLeftBoldRight: "\u2543",
      lineUpBoldDownLeftRightBold: "\u2544",
      lineUpDownBoldLeftBoldRight: "\u2545",
      lineUpDownBoldLeftRightBold: "\u2546",
      lineUpDoubleDownDoubleLeftDoubleRightDouble: "\u256C",
      lineUpDoubleDownDoubleLeftRight: "\u256B",
      lineUpDownLeftDoubleRightDouble: "\u256A",
      lineCross: "\u2573",
      lineBackslash: "\u2572",
      lineSlash: "\u2571"
    };
    specialMainSymbols = {
      tick: "\u2714",
      info: "\u2139",
      warning: "\u26A0",
      cross: "\u2718",
      squareSmall: "\u25FB",
      squareSmallFilled: "\u25FC",
      circle: "\u25EF",
      circleFilled: "\u25C9",
      circleDotted: "\u25CC",
      circleDouble: "\u25CE",
      circleCircle: "\u24DE",
      circleCross: "\u24E7",
      circlePipe: "\u24BE",
      radioOn: "\u25C9",
      radioOff: "\u25EF",
      checkboxOn: "\u2612",
      checkboxOff: "\u2610",
      checkboxCircleOn: "\u24E7",
      checkboxCircleOff: "\u24BE",
      pointer: "\u276F",
      triangleUpOutline: "\u25B3",
      triangleLeft: "\u25C0",
      triangleRight: "\u25B6",
      lozenge: "\u25C6",
      lozengeOutline: "\u25C7",
      hamburger: "\u2630",
      smiley: "\u32E1",
      mustache: "\u0DF4",
      star: "\u2605",
      play: "\u25B6",
      nodejs: "\u2B22",
      oneSeventh: "\u2150",
      oneNinth: "\u2151",
      oneTenth: "\u2152"
    };
    specialFallbackSymbols = {
      tick: "\u221A",
      info: "i",
      warning: "\u203C",
      cross: "\xD7",
      squareSmall: "\u25A1",
      squareSmallFilled: "\u25A0",
      circle: "( )",
      circleFilled: "(*)",
      circleDotted: "( )",
      circleDouble: "( )",
      circleCircle: "(\u25CB)",
      circleCross: "(\xD7)",
      circlePipe: "(\u2502)",
      radioOn: "(*)",
      radioOff: "( )",
      checkboxOn: "[\xD7]",
      checkboxOff: "[ ]",
      checkboxCircleOn: "(\xD7)",
      checkboxCircleOff: "( )",
      pointer: ">",
      triangleUpOutline: "\u2206",
      triangleLeft: "\u25C4",
      triangleRight: "\u25BA",
      lozenge: "\u2666",
      lozengeOutline: "\u25CA",
      hamburger: "\u2261",
      smiley: "\u263A",
      mustache: "\u250C\u2500\u2510",
      star: "\u2736",
      play: "\u25BA",
      nodejs: "\u2666",
      oneSeventh: "1/7",
      oneNinth: "1/9",
      oneTenth: "1/10"
    };
    mainSymbols = {
      ...common,
      ...specialMainSymbols
    };
    fallbackSymbols = {
      ...common,
      ...specialFallbackSymbols
    };
    shouldUseMain = isUnicodeSupported();
    figures = shouldUseMain ? mainSymbols : fallbackSymbols;
    esm_default = figures;
    replacements = Object.entries(specialMainSymbols);
  }
});

// node_modules/@inquirer/core/dist/esm/lib/theme.js
var import_yoctocolors_cjs, defaultTheme;
var init_theme2 = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/theme.js"() {
    import_yoctocolors_cjs = __toESM(require_yoctocolors_cjs(), 1);
    init_esm();
    defaultTheme = {
      prefix: {
        idle: import_yoctocolors_cjs.default.blue("?"),
        done: import_yoctocolors_cjs.default.green(esm_default.tick)
      },
      spinner: {
        interval: 80,
        frames: ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"].map((frame) => import_yoctocolors_cjs.default.yellow(frame))
      },
      style: {
        answer: import_yoctocolors_cjs.default.cyan,
        message: import_yoctocolors_cjs.default.bold,
        error: (text) => import_yoctocolors_cjs.default.red(`> ${text}`),
        defaultAnswer: (text) => import_yoctocolors_cjs.default.dim(`(${text})`),
        help: import_yoctocolors_cjs.default.dim,
        highlight: import_yoctocolors_cjs.default.cyan,
        key: (text) => import_yoctocolors_cjs.default.cyan(import_yoctocolors_cjs.default.bold(`<${text}>`))
      }
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/make-theme.js
var init_make_theme = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/make-theme.js"() {
    init_theme2();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-prefix.js
var init_use_prefix = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-prefix.js"() {
    init_use_state();
    init_use_effect();
    init_make_theme();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-memo.js
var init_use_memo = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-memo.js"() {
    init_hook_engine();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-ref.js
function useRef(val) {
  return useState({ current: val })[0];
}
var init_use_ref = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-ref.js"() {
    init_use_state();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/use-keypress.js
function useKeypress(userHandler) {
  const signal = useRef(userHandler);
  signal.current = userHandler;
  useEffect((rl) => {
    let ignore = false;
    const handler = withUpdates((_input, event) => {
      if (ignore)
        return;
      void signal.current(event, rl);
    });
    rl.input.on("keypress", handler);
    return () => {
      ignore = true;
      rl.input.removeListener("keypress", handler);
    };
  }, []);
}
var init_use_keypress = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/use-keypress.js"() {
    init_use_ref();
    init_use_effect();
    init_hook_engine();
  }
});

// node_modules/cli-width/index.js
var require_cli_width = __commonJS({
  "node_modules/cli-width/index.js"(exports2, module2) {
    "use strict";
    module2.exports = cliWidth2;
    function normalizeOpts(options) {
      const defaultOpts = {
        defaultWidth: 0,
        output: process.stdout,
        tty: require("tty")
      };
      if (!options) {
        return defaultOpts;
      }
      Object.keys(defaultOpts).forEach(function(key) {
        if (!options[key]) {
          options[key] = defaultOpts[key];
        }
      });
      return options;
    }
    function cliWidth2(options) {
      const opts = normalizeOpts(options);
      if (opts.output.getWindowSize) {
        return opts.output.getWindowSize()[0] || opts.defaultWidth;
      }
      if (opts.tty.getWindowSize) {
        return opts.tty.getWindowSize()[1] || opts.defaultWidth;
      }
      if (opts.output.columns) {
        return opts.output.columns;
      }
      if (process.env.CLI_WIDTH) {
        const width = parseInt(process.env.CLI_WIDTH, 10);
        if (!isNaN(width) && width !== 0) {
          return width;
        }
      }
      return opts.defaultWidth;
    }
  }
});

// node_modules/@inquirer/core/node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/@inquirer/core/node_modules/ansi-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = ({ onlyFirst = false } = {}) => {
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/@inquirer/core/node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/@inquirer/core/node_modules/strip-ansi/index.js"(exports2, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    module2.exports = (string2) => typeof string2 === "string" ? string2.replace(ansiRegex(), "") : string2;
  }
});

// node_modules/is-fullwidth-code-point/index.js
var require_is_fullwidth_code_point = __commonJS({
  "node_modules/is-fullwidth-code-point/index.js"(exports2, module2) {
    "use strict";
    var isFullwidthCodePoint = (codePoint) => {
      if (Number.isNaN(codePoint)) {
        return false;
      }
      if (codePoint >= 4352 && (codePoint <= 4447 || // Hangul Jamo
      codePoint === 9001 || // LEFT-POINTING ANGLE BRACKET
      codePoint === 9002 || // RIGHT-POINTING ANGLE BRACKET
      // CJK Radicals Supplement .. Enclosed CJK Letters and Months
      11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
      12880 <= codePoint && codePoint <= 19903 || // CJK Unified Ideographs .. Yi Radicals
      19968 <= codePoint && codePoint <= 42182 || // Hangul Jamo Extended-A
      43360 <= codePoint && codePoint <= 43388 || // Hangul Syllables
      44032 <= codePoint && codePoint <= 55203 || // CJK Compatibility Ideographs
      63744 <= codePoint && codePoint <= 64255 || // Vertical Forms
      65040 <= codePoint && codePoint <= 65049 || // CJK Compatibility Forms .. Small Form Variants
      65072 <= codePoint && codePoint <= 65131 || // Halfwidth and Fullwidth Forms
      65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || // Kana Supplement
      110592 <= codePoint && codePoint <= 110593 || // Enclosed Ideographic Supplement
      127488 <= codePoint && codePoint <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
      131072 <= codePoint && codePoint <= 262141)) {
        return true;
      }
      return false;
    };
    module2.exports = isFullwidthCodePoint;
    module2.exports.default = isFullwidthCodePoint;
  }
});

// node_modules/@inquirer/core/node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS({
  "node_modules/@inquirer/core/node_modules/emoji-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = function() {
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };
  }
});

// node_modules/@inquirer/core/node_modules/string-width/index.js
var require_string_width = __commonJS({
  "node_modules/@inquirer/core/node_modules/string-width/index.js"(exports2, module2) {
    "use strict";
    var stripAnsi = require_strip_ansi();
    var isFullwidthCodePoint = require_is_fullwidth_code_point();
    var emojiRegex = require_emoji_regex();
    var stringWidth = (string2) => {
      if (typeof string2 !== "string" || string2.length === 0) {
        return 0;
      }
      string2 = stripAnsi(string2);
      if (string2.length === 0) {
        return 0;
      }
      string2 = string2.replace(emojiRegex(), "  ");
      let width = 0;
      for (let i = 0; i < string2.length; i++) {
        const code = string2.codePointAt(i);
        if (code <= 31 || code >= 127 && code <= 159) {
          continue;
        }
        if (code >= 768 && code <= 879) {
          continue;
        }
        if (code > 65535) {
          i++;
        }
        width += isFullwidthCodePoint(code) ? 2 : 1;
      }
      return width;
    };
    module2.exports = stringWidth;
    module2.exports.default = stringWidth;
  }
});

// node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.js"(exports2, module2) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (const key of Object.keys(cssKeywords)) {
      reverseKeywords[cssKeywords[key]] = key;
    }
    var convert = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    module2.exports = convert;
    for (const model of Object.keys(convert)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model);
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model);
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model);
      }
      const { channels, labels } = convert[model];
      delete convert[model].channels;
      delete convert[model].labels;
      Object.defineProperty(convert[model], "channels", { value: channels });
      Object.defineProperty(convert[model], "labels", { value: labels });
    }
    convert.rgb.hsl = function(rgb2) {
      const r = rgb2[0] / 255;
      const g = rgb2[1] / 255;
      const b = rgb2[2] / 255;
      const min = Math.min(r, g, b);
      const max = Math.max(r, g, b);
      const delta = max - min;
      let h;
      let s;
      if (max === min) {
        h = 0;
      } else if (r === max) {
        h = (g - b) / delta;
      } else if (g === max) {
        h = 2 + (b - r) / delta;
      } else if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h = Math.min(h * 60, 360);
      if (h < 0) {
        h += 360;
      }
      const l = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h, s * 100, l * 100];
    };
    convert.rgb.hsv = function(rgb2) {
      let rdif;
      let gdif;
      let bdif;
      let h;
      let s;
      const r = rgb2[0] / 255;
      const g = rgb2[1] / 255;
      const b = rgb2[2] / 255;
      const v = Math.max(r, g, b);
      const diff = v - Math.min(r, g, b);
      const diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h = 0;
        s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r === v) {
          h = bdif - gdif;
        } else if (g === v) {
          h = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h = 2 / 3 + gdif - rdif;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }
      return [
        h * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb2) {
      const r = rgb2[0];
      const g = rgb2[1];
      let b = rgb2[2];
      const h = convert.rgb.hsl(rgb2)[0];
      const w = 1 / 255 * Math.min(r, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
      return [h, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb2) {
      const r = rgb2[0] / 255;
      const g = rgb2[1] / 255;
      const b = rgb2[2] / 255;
      const k = Math.min(1 - r, 1 - g, 1 - b);
      const c = (1 - r - k) / (1 - k) || 0;
      const m = (1 - g - k) / (1 - k) || 0;
      const y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
    }
    convert.rgb.keyword = function(rgb2) {
      const reversed = reverseKeywords[rgb2];
      if (reversed) {
        return reversed;
      }
      let currentClosestDistance = Infinity;
      let currentClosestKeyword;
      for (const keyword of Object.keys(cssKeywords)) {
        const value = cssKeywords[keyword];
        const distance = comparativeDistance(rgb2, value);
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb2) {
      let r = rgb2[0] / 255;
      let g = rgb2[1] / 255;
      let b = rgb2[2] / 255;
      r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
      b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
      const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
      const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
      const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb2) {
      const xyz = convert.rgb.xyz(rgb2);
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      const h = hsl[0] / 360;
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      let t2;
      let t3;
      let val;
      if (s === 0) {
        val = l * 255;
        return [val, val, val];
      }
      if (l < 0.5) {
        t2 = l * (1 + s);
      } else {
        t2 = l + s - l * s;
      }
      const t1 = 2 * l - t2;
      const rgb2 = [0, 0, 0];
      for (let i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb2[i] = val * 255;
      }
      return rgb2;
    };
    convert.hsl.hsv = function(hsl) {
      const h = hsl[0];
      let s = hsl[1] / 100;
      let l = hsl[2] / 100;
      let smin = s;
      const lmin = Math.max(l, 0.01);
      l *= 2;
      s *= l <= 1 ? l : 2 - l;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      const v = (l + s) / 2;
      const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
      return [h, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      const h = hsv[0] / 60;
      const s = hsv[1] / 100;
      let v = hsv[2] / 100;
      const hi = Math.floor(h) % 6;
      const f = h - Math.floor(h);
      const p = 255 * v * (1 - s);
      const q = 255 * v * (1 - s * f);
      const t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      const h = hsv[0];
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const vmin = Math.max(v, 0.01);
      let sl;
      let l;
      l = (2 - s) * v;
      const lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l /= 2;
      return [h, sl * 100, l * 100];
    };
    convert.hwb.rgb = function(hwb) {
      const h = hwb[0] / 360;
      let wh = hwb[1] / 100;
      let bl = hwb[2] / 100;
      const ratio = wh + bl;
      let f;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      const i = Math.floor(6 * h);
      const v = 1 - bl;
      f = 6 * h - i;
      if ((i & 1) !== 0) {
        f = 1 - f;
      }
      const n = wh + f * (v - wh);
      let r;
      let g;
      let b;
      switch (i) {
        default:
        case 6:
        case 0:
          r = v;
          g = n;
          b = wh;
          break;
        case 1:
          r = n;
          g = v;
          b = wh;
          break;
        case 2:
          r = wh;
          g = v;
          b = n;
          break;
        case 3:
          r = wh;
          g = n;
          b = v;
          break;
        case 4:
          r = n;
          g = wh;
          b = v;
          break;
        case 5:
          r = v;
          g = wh;
          b = n;
          break;
      }
      return [r * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      const c = cmyk[0] / 100;
      const m = cmyk[1] / 100;
      const y = cmyk[2] / 100;
      const k = cmyk[3] / 100;
      const r = 1 - Math.min(1, c * (1 - k) + k);
      const g = 1 - Math.min(1, m * (1 - k) + k);
      const b = 1 - Math.min(1, y * (1 - k) + k);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      const x = xyz[0] / 100;
      const y = xyz[1] / 100;
      const z = xyz[2] / 100;
      let r;
      let g;
      let b;
      r = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
      g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
      r = Math.min(Math.max(0, r), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      let x = xyz[0];
      let y = xyz[1];
      let z = xyz[2];
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
      const l = 116 * y - 16;
      const a = 500 * (x - y);
      const b = 200 * (y - z);
      return [l, a, b];
    };
    convert.lab.xyz = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let x;
      let y;
      let z;
      y = (l + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      const y2 = y ** 3;
      const x2 = x ** 3;
      const z2 = z ** 3;
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      const l = lab[0];
      const a = lab[1];
      const b = lab[2];
      let h;
      const hr = Math.atan2(b, a);
      h = hr * 360 / 2 / Math.PI;
      if (h < 0) {
        h += 360;
      }
      const c = Math.sqrt(a * a + b * b);
      return [l, c, h];
    };
    convert.lch.lab = function(lch) {
      const l = lch[0];
      const c = lch[1];
      const h = lch[2];
      const hr = h / 360 * 2 * Math.PI;
      const a = c * Math.cos(hr);
      const b = c * Math.sin(hr);
      return [l, a, b];
    };
    convert.rgb.ansi16 = function(args, saturation = null) {
      const [r, g, b] = args;
      let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      const r = args[0];
      const g = args[1];
      const b = args[2];
      if (r === g && g === b) {
        if (r < 8) {
          return 16;
        }
        if (r > 248) {
          return 231;
        }
        return Math.round((r - 8) / 247 * 24) + 232;
      }
      const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      let color = args % 10;
      if (color === 0 || color === 7) {
        if (args > 50) {
          color += 3.5;
        }
        color = color / 10.5 * 255;
        return [color, color, color];
      }
      const mult = (~~(args > 50) + 1) * 0.5;
      const r = (color & 1) * mult * 255;
      const g = (color >> 1 & 1) * mult * 255;
      const b = (color >> 2 & 1) * mult * 255;
      return [r, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        const c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      let rem;
      const r = Math.floor(args / 36) / 5 * 255;
      const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      const b = rem % 6 / 5 * 255;
      return [r, g, b];
    };
    convert.rgb.hex = function(args) {
      const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      const string2 = integer.toString(16).toUpperCase();
      return "000000".substring(string2.length) + string2;
    };
    convert.hex.rgb = function(args) {
      const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      let colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map((char) => {
          return char + char;
        }).join("");
      }
      const integer = parseInt(colorString, 16);
      const r = integer >> 16 & 255;
      const g = integer >> 8 & 255;
      const b = integer & 255;
      return [r, g, b];
    };
    convert.rgb.hcg = function(rgb2) {
      const r = rgb2[0] / 255;
      const g = rgb2[1] / 255;
      const b = rgb2[2] / 255;
      const max = Math.max(Math.max(r, g), b);
      const min = Math.min(Math.min(r, g), b);
      const chroma = max - min;
      let grayscale;
      let hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r) / chroma;
      } else {
        hue = 4 + (r - g) / chroma;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      const s = hsl[1] / 100;
      const l = hsl[2] / 100;
      const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
      let f = 0;
      if (c < 1) {
        f = (l - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      const s = hsv[1] / 100;
      const v = hsv[2] / 100;
      const c = s * v;
      let f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      const h = hcg[0] / 360;
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      const pure = [0, 0, 0];
      const hi = h % 1 * 6;
      const v = hi % 1;
      const w = 1 - v;
      let mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      let f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const l = g * (1 - c) + 0.5 * c;
      let s = 0;
      if (l > 0 && l < 0.5) {
        s = c / (2 * l);
      } else if (l >= 0.5 && l < 1) {
        s = c / (2 * (1 - l));
      }
      return [hcg[0], s * 100, l * 100];
    };
    convert.hcg.hwb = function(hcg) {
      const c = hcg[1] / 100;
      const g = hcg[2] / 100;
      const v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      const w = hwb[1] / 100;
      const b = hwb[2] / 100;
      const v = 1 - b;
      const c = v - w;
      let g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb2) {
      return [rgb2[0] / 255 * 65535, rgb2[1] / 255 * 65535, rgb2[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hsv = convert.gray.hsl;
    convert.gray.hwb = function(gray2) {
      return [0, 100, gray2[0]];
    };
    convert.gray.cmyk = function(gray2) {
      return [0, 0, 0, gray2[0]];
    };
    convert.gray.lab = function(gray2) {
      return [gray2[0], 0, 0];
    };
    convert.gray.hex = function(gray2) {
      const val = Math.round(gray2[0] / 100 * 255) & 255;
      const integer = (val << 16) + (val << 8) + val;
      const string2 = integer.toString(16).toUpperCase();
      return "000000".substring(string2.length) + string2;
    };
    convert.rgb.gray = function(rgb2) {
      const val = (rgb2[0] + rgb2[1] + rgb2[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/color-convert/route.js"(exports2, module2) {
    var conversions = require_conversions();
    function buildGraph() {
      const graph = {};
      const models = Object.keys(conversions);
      for (let len = models.length, i = 0; i < len; i++) {
        graph[models[i]] = {
          // http://jsperf.com/1-vs-infinity
          // micro-opt, but this is simple.
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      const graph = buildGraph();
      const queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        const current = queue.pop();
        const adjacents = Object.keys(conversions[current]);
        for (let len = adjacents.length, i = 0; i < len; i++) {
          const adjacent = adjacents[i];
          const node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      const path2 = [graph[toModel].parent, toModel];
      let fn = conversions[graph[toModel].parent][toModel];
      let cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path2.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path2;
      return fn;
    }
    module2.exports = function(fromModel) {
      const graph = deriveBFS(fromModel);
      const conversion = {};
      const models = Object.keys(graph);
      for (let len = models.length, i = 0; i < len; i++) {
        const toModel = models[i];
        const node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.js"(exports2, module2) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      const wrappedFn = function(...args) {
        const arg0 = args[0];
        if (arg0 === void 0 || arg0 === null) {
          return arg0;
        }
        if (arg0.length > 1) {
          args = arg0;
        }
        const result = fn(args);
        if (typeof result === "object") {
          for (let len = result.length, i = 0; i < len; i++) {
            result[i] = Math.round(result[i]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach((fromModel) => {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      const routes = route(fromModel);
      const routeModels = Object.keys(routes);
      routeModels.forEach((toModel) => {
        const fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module2.exports = convert;
  }
});

// node_modules/@inquirer/core/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS({
  "node_modules/@inquirer/core/node_modules/ansi-styles/index.js"(exports2, module2) {
    "use strict";
    var wrapAnsi16 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${code + offset}m`;
    };
    var wrapAnsi256 = (fn, offset) => (...args) => {
      const code = fn(...args);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    var wrapAnsi16m = (fn, offset) => (...args) => {
      const rgb2 = fn(...args);
      return `\x1B[${38 + offset};2;${rgb2[0]};${rgb2[1]};${rgb2[2]}m`;
    };
    var ansi2ansi = (n) => n;
    var rgb2rgb = (r, g, b) => [r, g, b];
    var setLazyProperty = (object2, property, get) => {
      Object.defineProperty(object2, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object2, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    var colorConvert;
    var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
      if (colorConvert === void 0) {
        colorConvert = require_color_convert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity, offset);
        } else if (typeof suite === "object") {
          styles[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  }
});

// node_modules/@inquirer/core/node_modules/wrap-ansi/index.js
var require_wrap_ansi = __commonJS({
  "node_modules/@inquirer/core/node_modules/wrap-ansi/index.js"(exports2, module2) {
    "use strict";
    var stringWidth = require_string_width();
    var stripAnsi = require_strip_ansi();
    var ansiStyles = require_ansi_styles();
    var ESCAPES = /* @__PURE__ */ new Set([
      "\x1B",
      "\x9B"
    ]);
    var END_CODE = 39;
    var wrapAnsi2 = (code) => `${ESCAPES.values().next().value}[${code}m`;
    var wordLengths = (string2) => string2.split(" ").map((character) => stringWidth(character));
    var wrapWord = (rows, word, columns) => {
      const characters = [...word];
      let isInsideEscape = false;
      let visible = stringWidth(stripAnsi(rows[rows.length - 1]));
      for (const [index, character] of characters.entries()) {
        const characterLength = stringWidth(character);
        if (visible + characterLength <= columns) {
          rows[rows.length - 1] += character;
        } else {
          rows.push(character);
          visible = 0;
        }
        if (ESCAPES.has(character)) {
          isInsideEscape = true;
        } else if (isInsideEscape && character === "m") {
          isInsideEscape = false;
          continue;
        }
        if (isInsideEscape) {
          continue;
        }
        visible += characterLength;
        if (visible === columns && index < characters.length - 1) {
          rows.push("");
          visible = 0;
        }
      }
      if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
        rows[rows.length - 2] += rows.pop();
      }
    };
    var stringVisibleTrimSpacesRight = (str) => {
      const words = str.split(" ");
      let last = words.length;
      while (last > 0) {
        if (stringWidth(words[last - 1]) > 0) {
          break;
        }
        last--;
      }
      if (last === words.length) {
        return str;
      }
      return words.slice(0, last).join(" ") + words.slice(last).join("");
    };
    var exec = (string2, columns, options = {}) => {
      if (options.trim !== false && string2.trim() === "") {
        return "";
      }
      let pre = "";
      let ret = "";
      let escapeCode;
      const lengths = wordLengths(string2);
      let rows = [""];
      for (const [index, word] of string2.split(" ").entries()) {
        if (options.trim !== false) {
          rows[rows.length - 1] = rows[rows.length - 1].trimLeft();
        }
        let rowLength = stringWidth(rows[rows.length - 1]);
        if (index !== 0) {
          if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
            rows.push("");
            rowLength = 0;
          }
          if (rowLength > 0 || options.trim === false) {
            rows[rows.length - 1] += " ";
            rowLength++;
          }
        }
        if (options.hard && lengths[index] > columns) {
          const remainingColumns = columns - rowLength;
          const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
          const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
          if (breaksStartingNextLine < breaksStartingThisLine) {
            rows.push("");
          }
          wrapWord(rows, word, columns);
          continue;
        }
        if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
          if (options.wordWrap === false && rowLength < columns) {
            wrapWord(rows, word, columns);
            continue;
          }
          rows.push("");
        }
        if (rowLength + lengths[index] > columns && options.wordWrap === false) {
          wrapWord(rows, word, columns);
          continue;
        }
        rows[rows.length - 1] += word;
      }
      if (options.trim !== false) {
        rows = rows.map(stringVisibleTrimSpacesRight);
      }
      pre = rows.join("\n");
      for (const [index, character] of [...pre].entries()) {
        ret += character;
        if (ESCAPES.has(character)) {
          const code2 = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
          escapeCode = code2 === END_CODE ? null : code2;
        }
        const code = ansiStyles.codes.get(Number(escapeCode));
        if (escapeCode && code) {
          if (pre[index + 1] === "\n") {
            ret += wrapAnsi2(code);
          } else if (character === "\n") {
            ret += wrapAnsi2(escapeCode);
          }
        }
      }
      return ret;
    };
    module2.exports = (string2, columns, options) => {
      return String(string2).normalize().replace(/\r\n/g, "\n").split("\n").map((line) => exec(line, columns, options)).join("\n");
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/utils.js
function breakLines(content, width) {
  return content.split("\n").flatMap((line) => (0, import_wrap_ansi.default)(line, width, { trim: false, hard: true }).split("\n").map((str) => str.trimEnd())).join("\n");
}
function readlineWidth() {
  return (0, import_cli_width.default)({ defaultWidth: 80, output: readline().output });
}
var import_cli_width, import_wrap_ansi;
var init_utils = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/utils.js"() {
    import_cli_width = __toESM(require_cli_width(), 1);
    import_wrap_ansi = __toESM(require_wrap_ansi(), 1);
    init_hook_engine();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/pagination/use-pagination.js
function usePointerPosition({ active, renderedItems, pageSize, loop }) {
  const state = useRef({
    lastPointer: active,
    lastActive: void 0
  });
  const { lastPointer, lastActive } = state.current;
  const middle = Math.floor(pageSize / 2);
  const renderedLength = renderedItems.reduce((acc, item) => acc + item.length, 0);
  const defaultPointerPosition = renderedItems.slice(0, active).reduce((acc, item) => acc + item.length, 0);
  let pointer = defaultPointerPosition;
  if (renderedLength > pageSize) {
    if (loop) {
      pointer = lastPointer;
      if (
        // First render, skip this logic.
        lastActive != null && // Only move the pointer down when the user moves down.
        lastActive < active && // Check user didn't move up across page boundary.
        active - lastActive < pageSize
      ) {
        pointer = Math.min(
          // Furthest allowed position for the pointer is the middle of the list
          middle,
          Math.abs(active - lastActive) === 1 ? Math.min(
            // Move the pointer at most the height of the last active item.
            lastPointer + (renderedItems[lastActive]?.length ?? 0),
            // If the user moved by one item, move the pointer to the natural position of the active item as
            // long as it doesn't move the cursor up.
            Math.max(defaultPointerPosition, lastPointer)
          ) : (
            // Otherwise, move the pointer down by the difference between the active and last active item.
            lastPointer + active - lastActive
          )
        );
      }
    } else {
      const spaceUnderActive = renderedItems.slice(active).reduce((acc, item) => acc + item.length, 0);
      pointer = spaceUnderActive < pageSize - middle ? (
        // If the active item is near the end of the list, progressively move the cursor towards the end.
        pageSize - spaceUnderActive
      ) : (
        // Otherwise, progressively move the pointer to the middle of the list.
        Math.min(defaultPointerPosition, middle)
      );
    }
  }
  state.current.lastPointer = pointer;
  state.current.lastActive = active;
  return pointer;
}
function usePagination({ items, active, renderItem, pageSize, loop = true }) {
  const width = readlineWidth();
  const bound = (num) => (num % items.length + items.length) % items.length;
  const renderedItems = items.map((item, index) => {
    if (item == null)
      return [];
    return breakLines(renderItem({ item, index, isActive: index === active }), width).split("\n");
  });
  const renderedLength = renderedItems.reduce((acc, item) => acc + item.length, 0);
  const renderItemAtIndex = (index) => renderedItems[index] ?? [];
  const pointer = usePointerPosition({ active, renderedItems, pageSize, loop });
  const activeItem = renderItemAtIndex(active).slice(0, pageSize);
  const activeItemPosition = pointer + activeItem.length <= pageSize ? pointer : pageSize - activeItem.length;
  const pageBuffer = Array.from({ length: pageSize });
  pageBuffer.splice(activeItemPosition, activeItem.length, ...activeItem);
  const itemVisited = /* @__PURE__ */ new Set([active]);
  let bufferPointer = activeItemPosition + activeItem.length;
  let itemPointer = bound(active + 1);
  while (bufferPointer < pageSize && !itemVisited.has(itemPointer) && (loop && renderedLength > pageSize ? itemPointer !== active : itemPointer > active)) {
    const lines = renderItemAtIndex(itemPointer);
    const linesToAdd = lines.slice(0, pageSize - bufferPointer);
    pageBuffer.splice(bufferPointer, linesToAdd.length, ...linesToAdd);
    itemVisited.add(itemPointer);
    bufferPointer += linesToAdd.length;
    itemPointer = bound(itemPointer + 1);
  }
  bufferPointer = activeItemPosition - 1;
  itemPointer = bound(active - 1);
  while (bufferPointer >= 0 && !itemVisited.has(itemPointer) && (loop && renderedLength > pageSize ? itemPointer !== active : itemPointer < active)) {
    const lines = renderItemAtIndex(itemPointer);
    const linesToAdd = lines.slice(Math.max(0, lines.length - bufferPointer - 1));
    pageBuffer.splice(bufferPointer - linesToAdd.length + 1, linesToAdd.length, ...linesToAdd);
    itemVisited.add(itemPointer);
    bufferPointer -= linesToAdd.length;
    itemPointer = bound(itemPointer - 1);
  }
  return pageBuffer.filter((line) => typeof line === "string").join("\n");
}
var init_use_pagination = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/pagination/use-pagination.js"() {
    init_use_ref();
    init_utils();
  }
});

// node_modules/mute-stream/lib/index.js
var require_lib = __commonJS({
  "node_modules/mute-stream/lib/index.js"(exports2, module2) {
    var Stream = require("stream");
    var MuteStream2 = class extends Stream {
      #isTTY = null;
      constructor(opts = {}) {
        super(opts);
        this.writable = this.readable = true;
        this.muted = false;
        this.on("pipe", this._onpipe);
        this.replace = opts.replace;
        this._prompt = opts.prompt || null;
        this._hadControl = false;
      }
      #destSrc(key, def) {
        if (this._dest) {
          return this._dest[key];
        }
        if (this._src) {
          return this._src[key];
        }
        return def;
      }
      #proxy(method, ...args) {
        if (typeof this._dest?.[method] === "function") {
          this._dest[method](...args);
        }
        if (typeof this._src?.[method] === "function") {
          this._src[method](...args);
        }
      }
      get isTTY() {
        if (this.#isTTY !== null) {
          return this.#isTTY;
        }
        return this.#destSrc("isTTY", false);
      }
      // basically just get replace the getter/setter with a regular value
      set isTTY(val) {
        this.#isTTY = val;
      }
      get rows() {
        return this.#destSrc("rows");
      }
      get columns() {
        return this.#destSrc("columns");
      }
      mute() {
        this.muted = true;
      }
      unmute() {
        this.muted = false;
      }
      _onpipe(src) {
        this._src = src;
      }
      pipe(dest, options) {
        this._dest = dest;
        return super.pipe(dest, options);
      }
      pause() {
        if (this._src) {
          return this._src.pause();
        }
      }
      resume() {
        if (this._src) {
          return this._src.resume();
        }
      }
      write(c) {
        if (this.muted) {
          if (!this.replace) {
            return true;
          }
          if (c.match(/^\u001b/)) {
            if (c.indexOf(this._prompt) === 0) {
              c = c.slice(this._prompt.length);
              c = c.replace(/./g, this.replace);
              c = this._prompt + c;
            }
            this._hadControl = true;
            return this.emit("data", c);
          } else {
            if (this._prompt && this._hadControl && c.indexOf(this._prompt) === 0) {
              this._hadControl = false;
              this.emit("data", this._prompt);
              c = c.slice(this._prompt.length);
            }
            c = c.toString().replace(/./g, this.replace);
          }
        }
        this.emit("data", c);
      }
      end(c) {
        if (this.muted) {
          if (c && this.replace) {
            c = c.toString().replace(/./g, this.replace);
          } else {
            c = null;
          }
        }
        if (c) {
          this.emit("data", c);
        }
        this.emit("end");
      }
      destroy(...args) {
        return this.#proxy("destroy", ...args);
      }
      destroySoon(...args) {
        return this.#proxy("destroySoon", ...args);
      }
      close(...args) {
        return this.#proxy("close", ...args);
      }
    };
    module2.exports = MuteStream2;
  }
});

// node_modules/signal-exit/dist/mjs/signals.js
var signals;
var init_signals = __esm({
  "node_modules/signal-exit/dist/mjs/signals.js"() {
    signals = [];
    signals.push("SIGHUP", "SIGINT", "SIGTERM");
    if (process.platform !== "win32") {
      signals.push(
        "SIGALRM",
        "SIGABRT",
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
    }
  }
});

// node_modules/signal-exit/dist/mjs/index.js
var processOk, kExitEmitter, global, ObjectDefineProperty, Emitter, SignalExitBase, signalExitWrap, SignalExitFallback, SignalExit, process3, onExit, load, unload;
var init_mjs = __esm({
  "node_modules/signal-exit/dist/mjs/index.js"() {
    init_signals();
    processOk = (process4) => !!process4 && typeof process4 === "object" && typeof process4.removeListener === "function" && typeof process4.emit === "function" && typeof process4.reallyExit === "function" && typeof process4.listeners === "function" && typeof process4.kill === "function" && typeof process4.pid === "number" && typeof process4.on === "function";
    kExitEmitter = Symbol.for("signal-exit emitter");
    global = globalThis;
    ObjectDefineProperty = Object.defineProperty.bind(Object);
    Emitter = class {
      emitted = {
        afterExit: false,
        exit: false
      };
      listeners = {
        afterExit: [],
        exit: []
      };
      count = 0;
      id = Math.random();
      constructor() {
        if (global[kExitEmitter]) {
          return global[kExitEmitter];
        }
        ObjectDefineProperty(global, kExitEmitter, {
          value: this,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
      on(ev, fn) {
        this.listeners[ev].push(fn);
      }
      removeListener(ev, fn) {
        const list = this.listeners[ev];
        const i = list.indexOf(fn);
        if (i === -1) {
          return;
        }
        if (i === 0 && list.length === 1) {
          list.length = 0;
        } else {
          list.splice(i, 1);
        }
      }
      emit(ev, code, signal) {
        if (this.emitted[ev]) {
          return false;
        }
        this.emitted[ev] = true;
        let ret = false;
        for (const fn of this.listeners[ev]) {
          ret = fn(code, signal) === true || ret;
        }
        if (ev === "exit") {
          ret = this.emit("afterExit", code, signal) || ret;
        }
        return ret;
      }
    };
    SignalExitBase = class {
    };
    signalExitWrap = (handler) => {
      return {
        onExit(cb, opts) {
          return handler.onExit(cb, opts);
        },
        load() {
          return handler.load();
        },
        unload() {
          return handler.unload();
        }
      };
    };
    SignalExitFallback = class extends SignalExitBase {
      onExit() {
        return () => {
        };
      }
      load() {
      }
      unload() {
      }
    };
    SignalExit = class extends SignalExitBase {
      // "SIGHUP" throws an `ENOSYS` error on Windows,
      // so use a supported signal instead
      /* c8 ignore start */
      #hupSig = process3.platform === "win32" ? "SIGINT" : "SIGHUP";
      /* c8 ignore stop */
      #emitter = new Emitter();
      #process;
      #originalProcessEmit;
      #originalProcessReallyExit;
      #sigListeners = {};
      #loaded = false;
      constructor(process4) {
        super();
        this.#process = process4;
        this.#sigListeners = {};
        for (const sig of signals) {
          this.#sigListeners[sig] = () => {
            const listeners = this.#process.listeners(sig);
            let { count } = this.#emitter;
            const p = process4;
            if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
              count += p.__signal_exit_emitter__.count;
            }
            if (listeners.length === count) {
              this.unload();
              const ret = this.#emitter.emit("exit", null, sig);
              const s = sig === "SIGHUP" ? this.#hupSig : sig;
              if (!ret)
                process4.kill(process4.pid, s);
            }
          };
        }
        this.#originalProcessReallyExit = process4.reallyExit;
        this.#originalProcessEmit = process4.emit;
      }
      onExit(cb, opts) {
        if (!processOk(this.#process)) {
          return () => {
          };
        }
        if (this.#loaded === false) {
          this.load();
        }
        const ev = opts?.alwaysLast ? "afterExit" : "exit";
        this.#emitter.on(ev, cb);
        return () => {
          this.#emitter.removeListener(ev, cb);
          if (this.#emitter.listeners["exit"].length === 0 && this.#emitter.listeners["afterExit"].length === 0) {
            this.unload();
          }
        };
      }
      load() {
        if (this.#loaded) {
          return;
        }
        this.#loaded = true;
        this.#emitter.count += 1;
        for (const sig of signals) {
          try {
            const fn = this.#sigListeners[sig];
            if (fn)
              this.#process.on(sig, fn);
          } catch (_) {
          }
        }
        this.#process.emit = (ev, ...a) => {
          return this.#processEmit(ev, ...a);
        };
        this.#process.reallyExit = (code) => {
          return this.#processReallyExit(code);
        };
      }
      unload() {
        if (!this.#loaded) {
          return;
        }
        this.#loaded = false;
        signals.forEach((sig) => {
          const listener = this.#sigListeners[sig];
          if (!listener) {
            throw new Error("Listener not defined for signal: " + sig);
          }
          try {
            this.#process.removeListener(sig, listener);
          } catch (_) {
          }
        });
        this.#process.emit = this.#originalProcessEmit;
        this.#process.reallyExit = this.#originalProcessReallyExit;
        this.#emitter.count -= 1;
      }
      #processReallyExit(code) {
        if (!processOk(this.#process)) {
          return 0;
        }
        this.#process.exitCode = code || 0;
        this.#emitter.emit("exit", this.#process.exitCode, null);
        return this.#originalProcessReallyExit.call(this.#process, this.#process.exitCode);
      }
      #processEmit(ev, ...args) {
        const og = this.#originalProcessEmit;
        if (ev === "exit" && processOk(this.#process)) {
          if (typeof args[0] === "number") {
            this.#process.exitCode = args[0];
          }
          const ret = og.call(this.#process, ev, ...args);
          this.#emitter.emit("exit", this.#process.exitCode, null);
          return ret;
        } else {
          return og.call(this.#process, ev, ...args);
        }
      }
    };
    process3 = globalThis.process;
    ({
      onExit: (
        /**
         * Called when the process is exiting, whether via signal, explicit
         * exit, or running out of stuff to do.
         *
         * If the global process object is not suitable for instrumentation,
         * then this will be a no-op.
         *
         * Returns a function that may be used to unload signal-exit.
         */
        onExit
      ),
      load: (
        /**
         * Load the listeners.  Likely you never need to call this, unless
         * doing a rather deep integration with signal-exit functionality.
         * Mostly exposed for the benefit of testing.
         *
         * @internal
         */
        load
      ),
      unload: (
        /**
         * Unload the listeners.  Likely you never need to call this, unless
         * doing a rather deep integration with signal-exit functionality.
         * Mostly exposed for the benefit of testing.
         *
         * @internal
         */
        unload
      )
    } = signalExitWrap(processOk(process3) ? new SignalExit(process3) : new SignalExitFallback()));
  }
});

// node_modules/@inquirer/ansi/dist/esm/index.js
var ESC, cursorLeft, cursorHide, cursorShow, cursorUp, cursorDown, cursorTo, eraseLine, eraseLines;
var init_esm2 = __esm({
  "node_modules/@inquirer/ansi/dist/esm/index.js"() {
    ESC = "\x1B[";
    cursorLeft = ESC + "G";
    cursorHide = ESC + "?25l";
    cursorShow = ESC + "?25h";
    cursorUp = (rows = 1) => rows > 0 ? `${ESC}${rows}A` : "";
    cursorDown = (rows = 1) => rows > 0 ? `${ESC}${rows}B` : "";
    cursorTo = (x, y) => {
      if (typeof y === "number" && !Number.isNaN(y)) {
        return `${ESC}${y + 1};${x + 1}H`;
      }
      return `${ESC}${x + 1}G`;
    };
    eraseLine = ESC + "2K";
    eraseLines = (lines) => lines > 0 ? (eraseLine + cursorUp(1)).repeat(lines - 1) + eraseLine + cursorLeft : "";
  }
});

// node_modules/@inquirer/core/dist/esm/lib/screen-manager.js
var import_node_util2, height, lastLine, ScreenManager;
var init_screen_manager = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/screen-manager.js"() {
    import_node_util2 = require("node:util");
    init_utils();
    init_esm2();
    height = (content) => content.split("\n").length;
    lastLine = (content) => content.split("\n").pop() ?? "";
    ScreenManager = class {
      // These variables are keeping information to allow correct prompt re-rendering
      height = 0;
      extraLinesUnderPrompt = 0;
      cursorPos;
      rl;
      constructor(rl) {
        this.rl = rl;
        this.cursorPos = rl.getCursorPos();
      }
      write(content) {
        this.rl.output.unmute();
        this.rl.output.write(content);
        this.rl.output.mute();
      }
      render(content, bottomContent = "") {
        const promptLine = lastLine(content);
        const rawPromptLine = (0, import_node_util2.stripVTControlCharacters)(promptLine);
        let prompt = rawPromptLine;
        if (this.rl.line.length > 0) {
          prompt = prompt.slice(0, -this.rl.line.length);
        }
        this.rl.setPrompt(prompt);
        this.cursorPos = this.rl.getCursorPos();
        const width = readlineWidth();
        content = breakLines(content, width);
        bottomContent = breakLines(bottomContent, width);
        if (rawPromptLine.length % width === 0) {
          content += "\n";
        }
        let output = content + (bottomContent ? "\n" + bottomContent : "");
        const promptLineUpDiff = Math.floor(rawPromptLine.length / width) - this.cursorPos.rows;
        const bottomContentHeight = promptLineUpDiff + (bottomContent ? height(bottomContent) : 0);
        if (bottomContentHeight > 0)
          output += cursorUp(bottomContentHeight);
        output += cursorTo(this.cursorPos.cols);
        this.write(cursorDown(this.extraLinesUnderPrompt) + eraseLines(this.height) + output);
        this.extraLinesUnderPrompt = bottomContentHeight;
        this.height = height(output);
      }
      checkCursorPos() {
        const cursorPos = this.rl.getCursorPos();
        if (cursorPos.cols !== this.cursorPos.cols) {
          this.write(cursorTo(cursorPos.cols));
          this.cursorPos = cursorPos;
        }
      }
      done({ clearContent }) {
        this.rl.setPrompt("");
        let output = cursorDown(this.extraLinesUnderPrompt);
        output += clearContent ? eraseLines(this.height) : "\n";
        output += cursorShow;
        this.write(output);
        this.rl.close();
      }
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/promise-polyfill.js
var PromisePolyfill;
var init_promise_polyfill = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/promise-polyfill.js"() {
    PromisePolyfill = class extends Promise {
      // Available starting from Node 22
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
      static withResolver() {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      }
    };
  }
});

// node_modules/@inquirer/core/dist/esm/lib/create-prompt.js
function getCallSites() {
  const _prepareStackTrace = Error.prepareStackTrace;
  let result = [];
  try {
    Error.prepareStackTrace = (_, callSites) => {
      const callSitesWithoutCurrent = callSites.slice(1);
      result = callSitesWithoutCurrent;
      return callSitesWithoutCurrent;
    };
    new Error().stack;
  } catch {
    return result;
  }
  Error.prepareStackTrace = _prepareStackTrace;
  return result;
}
function createPrompt(view) {
  const callSites = getCallSites();
  const prompt = (config, context = {}) => {
    const { input = process.stdin, signal } = context;
    const cleanups = /* @__PURE__ */ new Set();
    const output = new import_mute_stream.default();
    output.pipe(context.output ?? process.stdout);
    const rl = readline2.createInterface({
      terminal: true,
      input,
      output
    });
    const screen = new ScreenManager(rl);
    const { promise, resolve, reject } = PromisePolyfill.withResolver();
    const cancel = () => reject(new CancelPromptError());
    if (signal) {
      const abort = () => reject(new AbortPromptError({ cause: signal.reason }));
      if (signal.aborted) {
        abort();
        return Object.assign(promise, { cancel });
      }
      signal.addEventListener("abort", abort);
      cleanups.add(() => signal.removeEventListener("abort", abort));
    }
    cleanups.add(onExit((code, signal2) => {
      reject(new ExitPromptError(`User force closed the prompt with ${code} ${signal2}`));
    }));
    const sigint = () => reject(new ExitPromptError(`User force closed the prompt with SIGINT`));
    rl.on("SIGINT", sigint);
    cleanups.add(() => rl.removeListener("SIGINT", sigint));
    const checkCursorPos = () => screen.checkCursorPos();
    rl.input.on("keypress", checkCursorPos);
    cleanups.add(() => rl.input.removeListener("keypress", checkCursorPos));
    return withHooks(rl, (cycle) => {
      const hooksCleanup = import_node_async_hooks3.AsyncResource.bind(() => effectScheduler.clearAll());
      rl.on("close", hooksCleanup);
      cleanups.add(() => rl.removeListener("close", hooksCleanup));
      cycle(() => {
        try {
          const nextView = view(config, (value) => {
            setImmediate(() => resolve(value));
          });
          if (nextView === void 0) {
            const callerFilename = callSites[1]?.getFileName();
            throw new Error(`Prompt functions must return a string.
    at ${callerFilename}`);
          }
          const [content, bottomContent] = typeof nextView === "string" ? [nextView] : nextView;
          screen.render(content, bottomContent);
          effectScheduler.run();
        } catch (error) {
          reject(error);
        }
      });
      return Object.assign(promise.then((answer) => {
        effectScheduler.clearAll();
        return answer;
      }, (error) => {
        effectScheduler.clearAll();
        throw error;
      }).finally(() => {
        cleanups.forEach((cleanup) => cleanup());
        screen.done({ clearContent: Boolean(context.clearPromptOnDone) });
        output.end();
      }).then(() => promise), { cancel });
    });
  };
  return prompt;
}
var readline2, import_node_async_hooks3, import_mute_stream;
var init_create_prompt = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/create-prompt.js"() {
    readline2 = __toESM(require("node:readline"), 1);
    import_node_async_hooks3 = require("node:async_hooks");
    import_mute_stream = __toESM(require_lib(), 1);
    init_mjs();
    init_screen_manager();
    init_promise_polyfill();
    init_hook_engine();
    init_errors();
  }
});

// node_modules/@inquirer/core/dist/esm/lib/Separator.js
var init_Separator = __esm({
  "node_modules/@inquirer/core/dist/esm/lib/Separator.js"() {
    init_esm();
  }
});

// node_modules/@inquirer/core/dist/esm/index.js
var init_esm3 = __esm({
  "node_modules/@inquirer/core/dist/esm/index.js"() {
    init_key();
    init_errors();
    init_use_prefix();
    init_use_state();
    init_use_effect();
    init_use_memo();
    init_use_ref();
    init_use_keypress();
    init_make_theme();
    init_use_pagination();
    init_create_prompt();
    init_Separator();
  }
});

// src/cli/commands/quick-config/select-with-preview.ts
var select_with_preview_exports = {};
__export(select_with_preview_exports, {
  generatePreviews: () => generatePreviews,
  selectWithPreview: () => selectWithPreview
});
async function generatePreviews(choices, style, themeName) {
  const previews = [];
  const isStyleSelection = choices.length >= 3 && choices.every((c) => isQuickConfigStyle(c.value));
  const availableThemes = [
    "monokai",
    "nord",
    "dracula",
    "catppuccin-mocha",
    "tokyo-night",
    "vscode-dark-plus",
    "github-dark-dimmed",
    "dusty-sage"
  ];
  const isThemeSelection = choices.some((c) => isThemeName(c.value, availableThemes));
  for (const choice of choices) {
    try {
      let previewStyle = style;
      if (isStyleSelection) {
        previewStyle = choice.value;
      }
      let previewTheme = themeName;
      if (isThemeSelection && isThemeName(choice.value, availableThemes)) {
        previewTheme = choice.value;
      }
      const preview = await renderPreviewFromConfig(
        choice.getConfig(previewStyle, previewTheme),
        previewStyle,
        previewTheme
      );
      previews.push(preview);
    } catch (error) {
      const errorMsg = `\u26A0 Preview error: ${error instanceof Error ? error.message : "Unknown error"}`;
      previews.push(errorMsg);
    }
  }
  return previews;
}
function isQuickConfigStyle(value) {
  return typeof value === "string" && ["balanced", "playful", "compact"].includes(value);
}
function isThemeName(value, availableThemes) {
  return typeof value === "string" && availableThemes.includes(value);
}
function selectWithPreviewImpl(config, done) {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("idle");
  useEffect(() => {
    if (config.choices.length === 0) {
      throw new Error("selectWithPreview requires at least one choice");
    }
  }, []);
  useKeypress((key) => {
    if (isEnterKey(key)) {
      setStatus("done");
      done(config.choices[active].value);
    } else if (isUpKey(key)) {
      const newIndex = active > 0 ? active - 1 : config.choices.length - 1;
      setActive(newIndex);
    } else if (isDownKey(key)) {
      const newIndex = active < config.choices.length - 1 ? active + 1 : 0;
      setActive(newIndex);
    }
  });
  const choices = config.choices.map((c) => c.name);
  const page = usePagination({
    items: choices,
    active,
    pageSize: config.pageSize ?? 7,
    loop: true,
    renderItem: ({ item, index, isActive }) => {
      const prefix = isActive ? "\u276F" : " ";
      const choice = config.choices[index];
      const desc = choice.description ? `\x1B[90m - ${choice.description}\x1B[0m` : "";
      return `${prefix} ${item}${desc}`;
    }
  });
  const preview = config.previews[active];
  const activeChoice = config.choices[active];
  if (status === "done") {
    return [`${config.message} ${activeChoice.name}`, ""];
  }
  const line = "\x1B[1;37m" + "\u2500".repeat(60) + "\x1B[0m";
  const previewBox = `${line}
\x1B[1;37mLive Preview\x1B[0m

${preview}

${line}`;
  return [config.message, `${page}

${previewBox}`];
}
var selectWithPreview;
var init_select_with_preview = __esm({
  "src/cli/commands/quick-config/select-with-preview.ts"() {
    "use strict";
    init_esm3();
    init_layout_preview();
    selectWithPreview = createPrompt(selectWithPreviewImpl);
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  main: () => main
});
module.exports = __toCommonJS(index_exports);

// src/config/default-config.ts
init_theme();
function generateBalancedLayout(style, themeName) {
  const theme = getThemeByName(themeName).colors;
  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style,
          colors: { name: theme.model.name, version: theme.model.version }
        },
        {
          id: "context",
          style,
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar
          }
        },
        {
          id: "cost",
          style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency }
        },
        {
          id: "duration",
          style,
          colors: { value: theme.duration.value, unit: theme.duration.unit }
        },
        {
          id: "lines",
          style,
          colors: { added: theme.lines.added, removed: theme.lines.removed }
        }
      ],
      "1": [
        {
          id: "git",
          style,
          colors: { branch: theme.git.branch, changes: theme.git.changes }
        },
        {
          id: "cache-metrics",
          style,
          colors: {
            high: theme.cache.high,
            medium: theme.cache.medium,
            low: theme.cache.low,
            read: theme.cache.read,
            write: theme.cache.write
          }
        },
        {
          id: "config-count",
          style,
          colors: {
            base: theme.base.muted
          }
        },
        {
          id: "active-tools",
          style,
          colors: {
            running: theme.tools.running,
            completed: theme.tools.completed,
            error: theme.tools.error,
            name: theme.tools.name,
            target: theme.tools.target,
            count: theme.tools.count
          }
        }
      ]
    }
  };
}
function generateCompactLayout(style, themeName) {
  const theme = getThemeByName(themeName).colors;
  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style,
          colors: { name: theme.model.name, version: theme.model.version }
        },
        {
          id: "context",
          style,
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar
          }
        },
        {
          id: "cost",
          style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency }
        },
        {
          id: "git",
          style,
          colors: { branch: theme.git.branch, changes: theme.git.changes }
        },
        {
          id: "duration",
          style,
          colors: { value: theme.duration.value, unit: theme.duration.unit }
        }
      ]
    }
  };
}
function generateRichLayout(style, themeName) {
  const theme = getThemeByName(themeName).colors;
  return {
    version: "1.0.0",
    lines: {
      "0": [
        {
          id: "model",
          style,
          colors: { name: theme.model.name, version: theme.model.version }
        },
        {
          id: "context",
          style,
          colors: {
            low: theme.context.low,
            medium: theme.context.medium,
            high: theme.context.high,
            bar: theme.context.bar
          }
        },
        {
          id: "cost",
          style,
          colors: { amount: theme.cost.amount, currency: theme.cost.currency }
        },
        {
          id: "duration",
          style,
          colors: { value: theme.duration.value, unit: theme.duration.unit }
        }
      ],
      "1": [
        {
          id: "git",
          style,
          colors: { branch: theme.git.branch, changes: theme.git.changes }
        },
        {
          id: "git-tag",
          style,
          colors: { base: theme.base.text }
        },
        {
          id: "lines",
          style,
          colors: { added: theme.lines.added, removed: theme.lines.removed }
        },
        {
          id: "active-tools",
          style,
          colors: {
            running: theme.tools.running,
            completed: theme.tools.completed,
            error: theme.tools.error,
            name: theme.tools.name,
            target: theme.tools.target,
            count: theme.tools.count
          }
        }
      ],
      "2": [
        {
          id: "cache-metrics",
          style,
          colors: {
            high: theme.cache.high,
            medium: theme.cache.medium,
            low: theme.cache.low,
            read: theme.cache.read,
            write: theme.cache.write
          }
        },
        {
          id: "config-count",
          style,
          colors: { base: theme.base.muted }
        }
      ]
    }
  };
}

// src/cli/commands/quick-config/config-loader.ts
var import_node_os = require("node:os");
var import_node_path = require("node:path");
function getUserConfigDir() {
  return (0, import_node_path.join)((0, import_node_os.homedir)(), ".claude-scope");
}
function getUserConfigPath() {
  return (0, import_node_path.join)(getUserConfigDir(), "config.json");
}

// src/cli/commands/quick-config/config-writer.ts
var import_promises = require("node:fs/promises");
async function saveConfig(config) {
  const configDir = getUserConfigDir();
  const configPath = getUserConfigPath();
  try {
    await (0, import_promises.mkdir)(configDir, { recursive: true });
    const json = JSON.stringify(config, null, 2);
    await (0, import_promises.writeFile)(configPath, json, "utf-8");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to save config to ${configPath}: ${errorMsg}`);
  }
}

// src/cli/commands/quick-config/index.ts
init_layout_preview();

// src/cli/commands/quick-config/menu.ts
init_theme();
init_layout_preview();
init_select_with_preview();
function getLayoutGenerator(layout) {
  switch (layout) {
    case "balanced":
      return generateBalancedLayout;
    case "compact":
      return generateCompactLayout;
    case "rich":
      return generateRichLayout;
  }
}
async function selectLayout() {
  const layoutChoices = [
    {
      name: "Balanced",
      description: "2 lines: AI metrics + Git, Cache, Tools, MCP, Hooks",
      value: "balanced",
      getConfig: (s, t) => generateBalancedLayout(s, t)
    },
    {
      name: "Compact",
      description: "1 line: Model, Context, Cost, Git, Duration",
      value: "compact",
      getConfig: (s, t) => generateCompactLayout(s, t)
    },
    {
      name: "Rich",
      description: "3 lines: Full details with Git Tag, Config Count",
      value: "rich",
      getConfig: (s, t) => generateRichLayout(s, t)
    }
  ];
  console.log("\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  Stage 1/3: Choose Widget Layout                                  \u2502");
  console.log("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524");
  console.log("\u2502  Select how widgets are arranged across statusline lines.        \u2502");
  console.log("\u2502  Preview updates as you navigate options.                       \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n");
  const defaultStyle = "balanced";
  const defaultTheme2 = "monokai";
  const { generatePreviews: generatePreviews2 } = await Promise.resolve().then(() => (init_select_with_preview(), select_with_preview_exports));
  const previews = await generatePreviews2(layoutChoices, defaultStyle, defaultTheme2);
  const layout = await selectWithPreview({
    message: "Choose a layout preset:",
    choices: layoutChoices,
    pageSize: 3,
    style: defaultStyle,
    themeName: defaultTheme2,
    previews
  });
  return layout;
}
async function selectStyle(layout) {
  const styleChoices = [
    {
      name: "Balanced",
      description: "Clean, balanced display with labels",
      value: "balanced",
      getConfig: (s, t) => getLayoutGenerator(layout)(s, t)
    },
    {
      name: "Playful",
      description: "Fun display with emojis",
      value: "playful",
      getConfig: (s, t) => getLayoutGenerator(layout)(s, t)
    },
    {
      name: "Compact",
      description: "Minimal, condensed display",
      value: "compact",
      getConfig: (s, t) => getLayoutGenerator(layout)(s, t)
    }
  ];
  console.log("\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  Stage 2/3: Choose Display Style                                 \u2502");
  console.log("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524");
  console.log("\u2502  Select how widgets are rendered (labels, emojis, etc.).        \u2502");
  console.log("\u2502  Preview shows your selected layout with each style.           \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n");
  const { generatePreviews: generatePreviews2 } = await Promise.resolve().then(() => (init_select_with_preview(), select_with_preview_exports));
  const previews = await generatePreviews2(styleChoices, "balanced", "monokai");
  const style = await selectWithPreview({
    message: "Choose a display style:",
    choices: styleChoices,
    pageSize: 3,
    style: "balanced",
    themeName: "monokai",
    previews
  });
  return style;
}
async function selectTheme(layout, style) {
  const themeChoices = AVAILABLE_THEMES.slice(0, 8).map((theme2) => ({
    name: theme2.name,
    description: theme2.description,
    value: theme2.name,
    getConfig: () => getLayoutGenerator(layout)(style, theme2.name)
  }));
  console.log("\n\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510");
  console.log("\u2502  Stage 3/3: Choose Color Theme                                   \u2502");
  console.log("\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524");
  console.log("\u2502  Select color theme for your statusline.                        \u2502");
  console.log("\u2502  Preview shows final config with live theme colors.             \u2502");
  console.log("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n");
  const { generatePreviews: generatePreviews2 } = await Promise.resolve().then(() => (init_select_with_preview(), select_with_preview_exports));
  const previews = await generatePreviews2(themeChoices, style, "monokai");
  const theme = await selectWithPreview({
    message: "Choose a theme:",
    choices: themeChoices,
    pageSize: 8,
    style,
    themeName: "monokai",
    // Will be overridden by getConfig
    previews
  });
  return theme;
}
function showNavigationHints() {
  console.log(
    "\n  Navigation: \u2191\u2193 arrows to move \u2022 Enter to select \u2022 Esc to exit"
  );
  console.log(
    "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n"
  );
}
async function runQuickConfigMenu() {
  try {
    showNavigationHints();
    const selectedLayout = await selectLayout();
    showNavigationHints();
    const selectedStyle = await selectStyle(selectedLayout);
    showNavigationHints();
    const selectedTheme = await selectTheme(selectedLayout, selectedStyle);
    console.log("\nGenerating configuration...");
    const config = getLayoutGenerator(selectedLayout)(selectedStyle, selectedTheme);
    await saveConfig(config);
    console.log(`\u2713 Configuration saved to ~/.claude-scope/config.json`);
    console.log(`  Layout: ${selectedLayout}`);
    console.log(`  Style: ${selectedStyle}`);
    console.log(`  Theme: ${selectedTheme}`);
    console.log("\nPreview of your configuration:");
    console.log(
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"
    );
    const finalPreview = await renderPreviewFromConfig(config, selectedStyle, selectedTheme);
    console.log(finalPreview);
    console.log(
      "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501"
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log("\n\u2713 Configuration cancelled. No changes saved.");
      process.exit(0);
    }
    if (error instanceof Error && error.code === "EACCES") {
      console.error("\u2717 Permission denied. Cannot write to ~/.claude-scope/config.json");
      process.exit(1);
    }
    console.error("\u2717 Error:", error instanceof Error ? error.message : "Unknown error");
    process.exit(1);
  }
}

// src/cli/commands/quick-config/preview.ts
init_renderer();
init_widget_registry();

// src/providers/transcript-provider.ts
var import_node_fs2 = require("node:fs");
var import_node_readline = require("node:readline");
var TranscriptProvider = class {
  MAX_TOOLS = 20;
  /**
   * Parse tools from a JSONL transcript file
   * @param transcriptPath Path to the transcript file
   * @returns Array of tool entries, limited to last 20
   */
  async parseTools(transcriptPath) {
    if (!(0, import_node_fs2.existsSync)(transcriptPath)) {
      return [];
    }
    const toolMap = /* @__PURE__ */ new Map();
    try {
      const fileStream = (0, import_node_fs2.createReadStream)(transcriptPath, { encoding: "utf-8" });
      const rl = (0, import_node_readline.createInterface)({
        input: fileStream,
        crlfDelay: Infinity
      });
      for await (const line of rl) {
        if (!line.trim()) continue;
        try {
          const entry = JSON.parse(line);
          this.processLine(entry, toolMap);
        } catch {
        }
      }
      const tools = Array.from(toolMap.values());
      return tools.slice(-this.MAX_TOOLS);
    } catch {
      return [];
    }
  }
  /**
   * Process a single transcript line and update tool map
   */
  processLine(line, toolMap) {
    const blocks = line.message?.content ?? [];
    const timestamp = /* @__PURE__ */ new Date();
    for (const block of blocks) {
      if (block.type === "tool_use" && block.id && block.name) {
        const tool = {
          id: block.id,
          name: block.name,
          target: this.extractTarget(block.name, block.input),
          status: "running",
          startTime: timestamp
        };
        toolMap.set(block.id, tool);
      }
      if (block.type === "tool_result" && block.tool_use_id) {
        const existing = toolMap.get(block.tool_use_id);
        if (existing) {
          existing.status = block.is_error ? "error" : "completed";
          existing.endTime = timestamp;
        }
      }
    }
  }
  /**
   * Extract target from tool input based on tool type
   */
  extractTarget(toolName, input) {
    if (!input) return void 0;
    switch (toolName) {
      case "Read":
      case "Write":
      case "Edit":
        return this.asString(input.file_path ?? input.path);
      case "Glob":
        return this.asString(input.pattern);
      case "Grep":
        return this.asString(input.pattern);
      case "Bash": {
        const cmd = this.asString(input.command);
        return cmd ? this.truncateCommand(cmd) : void 0;
      }
      default:
        return void 0;
    }
  }
  /**
   * Safely convert value to string
   */
  asString(value) {
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return void 0;
  }
  /**
   * Truncate long commands to 30 chars
   */
  truncateCommand(cmd) {
    if (cmd.length <= 30) return cmd;
    return `${cmd.slice(0, 30)}...`;
  }
};

// src/cli/commands/quick-config/preview.ts
init_theme();
init_active_tools();
init_cache_metrics();
init_config_count_widget();
init_context_widget();
init_cost_widget();
init_duration_widget();
init_git_tag_widget();
init_git_widget();
init_lines_widget();
init_model_widget();
init_demo_data();

// src/cli/commands/quick-config/index.ts
init_select_with_preview();
async function handleQuickConfigCommand() {
  await runQuickConfigMenu();
}

// src/cli/index.ts
function parseCommand() {
  const args = process.argv.slice(2);
  if (args[0] === "quick-config") {
    return "quick-config";
  }
  return "stdin";
}
async function routeCommand(command) {
  switch (command) {
    case "quick-config":
      await handleQuickConfigCommand();
      break;
    case "stdin":
      throw new Error("stdin mode should be handled by main()");
    default: {
      const _exhaustive = command;
      return _exhaustive;
    }
  }
}

// src/config/config-loader.ts
var import_node_fs3 = require("node:fs");
var import_promises2 = require("node:fs/promises");
var import_node_os3 = require("node:os");
var import_node_path3 = require("node:path");
function getConfigPath() {
  return (0, import_node_path3.join)((0, import_node_os3.homedir)(), ".claude-scope", "config.json");
}
async function loadWidgetConfig() {
  const configPath = getConfigPath();
  if (!(0, import_node_fs3.existsSync)(configPath)) {
    return null;
  }
  try {
    const content = await (0, import_promises2.readFile)(configPath, "utf-8");
    const config = JSON.parse(content);
    if (!config || typeof config !== "object" || !config.lines) {
      return null;
    }
    return {
      lines: config.lines
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.warn(`Config error loading ${configPath}: ${errorMsg}`);
    return null;
  }
}

// src/config/widget-flags.ts
var WIDGET_FLAGS = {
  activeTools: true,
  cacheMetrics: true
};
function isWidgetEnabled(name) {
  return WIDGET_FLAGS[name] ?? true;
}

// src/index.ts
init_renderer();
init_style_types();
init_widget_registry();

// src/validation/result.ts
function success(data) {
  return { success: true, data };
}
function failure(path2, message, value) {
  return { success: false, error: { path: path2, message, value } };
}
function formatError(error) {
  const path2 = error.path.length > 0 ? error.path.join(".") : "root";
  return `${path2}: ${error.message}`;
}

// src/validation/combinators.ts
function object(shape) {
  return {
    validate(value) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return failure([], "Expected object", value);
      }
      const result = {};
      for (const [key, validator] of Object.entries(shape)) {
        const fieldValue = value[key];
        const validationResult = validator.validate(fieldValue);
        if (!validationResult.success) {
          return {
            success: false,
            error: { ...validationResult.error, path: [key, ...validationResult.error.path] }
          };
        }
        result[key] = validationResult.data;
      }
      return success(result);
    }
  };
}
function optional(validator) {
  return {
    validate(value) {
      if (value === void 0) return success(void 0);
      return validator.validate(value);
    }
  };
}
function nullable(validator) {
  return {
    validate(value) {
      if (value === null) return success(null);
      return validator.validate(value);
    }
  };
}

// src/validation/validators.ts
function string() {
  return {
    validate(value) {
      if (typeof value === "string") return success(value);
      return failure([], "Expected string", value);
    }
  };
}
function number() {
  return {
    validate(value) {
      if (typeof value === "number" && !Number.isNaN(value)) return success(value);
      return failure([], "Expected number", value);
    }
  };
}
function literal(expected) {
  return {
    validate(value) {
      if (value === expected) return success(expected);
      return failure([], `Expected '${expected}'`, value);
    }
  };
}

// src/schemas/stdin-schema.ts
var ContextUsageSchema = object({
  input_tokens: number(),
  output_tokens: number(),
  cache_creation_input_tokens: number(),
  cache_read_input_tokens: number()
});
var CostInfoSchema = object({
  total_cost_usd: optional(number()),
  total_duration_ms: optional(number()),
  total_api_duration_ms: optional(number()),
  total_lines_added: optional(number()),
  total_lines_removed: optional(number())
});
var ContextWindowSchema = object({
  total_input_tokens: number(),
  total_output_tokens: number(),
  context_window_size: number(),
  current_usage: nullable(ContextUsageSchema)
});
var ModelInfoSchema = object({
  id: string(),
  display_name: string()
});
var WorkspaceSchema = object({
  current_dir: string(),
  project_dir: string()
});
var OutputStyleSchema = object({
  name: string()
});
var StdinDataSchema = object({
  hook_event_name: optional(literal("Status")),
  session_id: string(),
  transcript_path: string(),
  cwd: string(),
  model: ModelInfoSchema,
  workspace: WorkspaceSchema,
  version: string(),
  output_style: OutputStyleSchema,
  cost: optional(CostInfoSchema),
  context_window: ContextWindowSchema
});

// src/data/stdin-provider.ts
var StdinParseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "StdinParseError";
  }
};
var StdinValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "StdinValidationError";
  }
};
var StdinProvider = class {
  /**
   * Parse and validate JSON string from stdin
   * @param input JSON string to parse
   * @returns Validated StdinData object
   * @throws StdinParseError if JSON is malformed
   * @throws StdinValidationError if data doesn't match schema
   */
  async parse(input) {
    if (!input || input.trim().length === 0) {
      throw new StdinParseError("stdin data is empty");
    }
    let data;
    try {
      data = JSON.parse(input);
    } catch (error) {
      throw new StdinParseError(`Invalid JSON: ${error.message}`);
    }
    const result = StdinDataSchema.validate(data);
    if (!result.success) {
      throw new StdinValidationError(`Validation failed: ${formatError(result.error)}`);
    }
    return result.data;
  }
  /**
   * Safe parse that returns result instead of throwing
   * Useful for testing and optional validation
   * @param input JSON string to parse
   * @returns Result object with success flag
   */
  async safeParse(input) {
    try {
      const data = await this.parse(input);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// src/index.ts
init_theme();
init_active_tools();
init_cache_metrics();
init_config_count_widget();
init_context_widget();
init_cost_widget();
init_duration_widget();

// src/widgets/empty-line-widget.ts
init_widget_types();
init_stdin_data_widget();
var EmptyLineWidget = class extends StdinDataWidget {
  id = "empty-line";
  metadata = createWidgetMetadata(
    "Empty Line",
    "Empty line separator",
    "1.0.0",
    "claude-scope",
    5
    // Sixth line (0-indexed)
  );
  /**
   * All styles return the same value (Braille Pattern Blank).
   * This method exists for API consistency with other widgets.
   */
  setStyle(_style) {
  }
  /**
   * Return Braille Pattern Blank to create a visible empty separator line.
   * U+2800 occupies cell width but appears blank, ensuring the line renders.
   */
  renderWithData(_data, _context) {
    return "\u2800";
  }
};

// src/index.ts
init_git_tag_widget();
init_git_widget();
init_lines_widget();
init_model_widget();

// src/widgets/poker-widget.ts
init_style_types();
init_widget_types();
init_theme();
init_stdin_data_widget();

// src/widgets/poker/deck.ts
var import_node_crypto = require("node:crypto");

// src/widgets/poker/types.ts
var Suit = {
  Spades: "spades",
  Hearts: "hearts",
  Diamonds: "diamonds",
  Clubs: "clubs"
};
var SUIT_SYMBOLS = {
  spades: "\u2660",
  hearts: "\u2665",
  diamonds: "\u2666",
  clubs: "\u2663"
};
var EMOJI_SYMBOLS = {
  spades: "\u2660\uFE0F",
  // ♠️
  hearts: "\u2665\uFE0F",
  // ♥️
  diamonds: "\u2666\uFE0F",
  // ♦️
  clubs: "\u2663\uFE0F"
  // ♣️
};
function isRedSuit(suit) {
  return suit === "hearts" || suit === "diamonds";
}
var Rank = {
  Two: "2",
  Three: "3",
  Four: "4",
  Five: "5",
  Six: "6",
  Seven: "7",
  Eight: "8",
  Nine: "9",
  Ten: "10",
  Jack: "J",
  Queen: "Q",
  King: "K",
  Ace: "A"
};
function getRankValue(rank) {
  const values = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14
  };
  return values[rank];
}
function formatCard(card) {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}
function formatCardEmoji(card) {
  return `${card.rank}${EMOJI_SYMBOLS[card.suit]}`;
}

// src/widgets/poker/deck.ts
var ALL_SUITS = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];
var ALL_RANKS = [
  Rank.Two,
  Rank.Three,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Jack,
  Rank.Queen,
  Rank.King,
  Rank.Ace
];
var Deck = class {
  cards = [];
  constructor() {
    this.initialize();
    this.shuffle();
  }
  /**
   * Create a standard 52-card deck
   */
  initialize() {
    this.cards = [];
    for (const suit of ALL_SUITS) {
      for (const rank of ALL_RANKS) {
        this.cards.push({ rank, suit });
      }
    }
  }
  /**
   * Shuffle deck using Fisher-Yates algorithm with crypto.random
   */
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = (0, import_node_crypto.randomInt)(0, i + 1);
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  /**
   * Deal one card from the top of the deck
   * @throws Error if deck is empty
   */
  deal() {
    if (this.cards.length === 0) {
      throw new Error("Deck is empty");
    }
    return this.cards.pop();
  }
  /**
   * Get number of remaining cards in deck
   */
  remaining() {
    return this.cards.length;
  }
};

// src/widgets/poker/hand-evaluator.ts
var HAND_DISPLAY = {
  [10 /* RoyalFlush */]: { name: "Royal Flush", emoji: "\u{1F3C6}" },
  [9 /* StraightFlush */]: { name: "Straight Flush", emoji: "\u{1F525}" },
  [8 /* FourOfAKind */]: { name: "Four of a Kind", emoji: "\u{1F48E}" },
  [7 /* FullHouse */]: { name: "Full House", emoji: "\u{1F3E0}" },
  [6 /* Flush */]: { name: "Flush", emoji: "\u{1F4A7}" },
  [5 /* Straight */]: { name: "Straight", emoji: "\u{1F4C8}" },
  [4 /* ThreeOfAKind */]: { name: "Three of a Kind", emoji: "\u{1F3AF}" },
  [3 /* TwoPair */]: { name: "Two Pair", emoji: "\u270C\uFE0F" },
  [2 /* OnePair */]: { name: "One Pair", emoji: "\u{1F44D}" },
  [1 /* HighCard */]: { name: "High Card", emoji: "\u{1F0CF}" }
};
function countRanks(cards) {
  const counts = /* @__PURE__ */ new Map();
  for (const card of cards) {
    const value = getRankValue(card.rank);
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}
function countSuits(cards) {
  const counts = /* @__PURE__ */ new Map();
  for (const card of cards) {
    counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
  }
  return counts;
}
function findCardsOfRank(cards, targetRank) {
  const indices = [];
  for (let i = 0; i < cards.length; i++) {
    if (getRankValue(cards[i].rank) === targetRank) {
      indices.push(i);
    }
  }
  return indices;
}
function findCardsOfSuit(cards, targetSuit) {
  const indices = [];
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === targetSuit) {
      indices.push(i);
    }
  }
  return indices;
}
function findFlushSuit(cards) {
  const suitCounts = countSuits(cards);
  for (const [suit, count] of suitCounts.entries()) {
    if (count >= 5) return suit;
  }
  return null;
}
function getStraightIndices(cards, highCard) {
  const uniqueValues = /* @__PURE__ */ new Set();
  const cardIndicesByRank = /* @__PURE__ */ new Map();
  for (let i = 0; i < cards.length; i++) {
    const value = getRankValue(cards[i].rank);
    if (!cardIndicesByRank.has(value)) {
      cardIndicesByRank.set(value, []);
      uniqueValues.add(value);
    }
    cardIndicesByRank.get(value)?.push(i);
  }
  const sortedValues = Array.from(uniqueValues).sort((a, b) => b - a);
  if (sortedValues.includes(14)) {
    sortedValues.push(1);
  }
  for (let i = 0; i <= sortedValues.length - 5; i++) {
    const current = sortedValues[i];
    const next1 = sortedValues[i + 1];
    const next2 = sortedValues[i + 2];
    const next3 = sortedValues[i + 3];
    const next4 = sortedValues[i + 4];
    if (current - next1 === 1 && current - next2 === 2 && current - next3 === 3 && current - next4 === 4) {
      if (current === highCard) {
        const indices = [];
        indices.push(cardIndicesByRank.get(current)[0]);
        indices.push(cardIndicesByRank.get(next1)[0]);
        indices.push(cardIndicesByRank.get(next2)[0]);
        indices.push(cardIndicesByRank.get(next3)[0]);
        const rank4 = next4 === 1 ? 14 : next4;
        indices.push(cardIndicesByRank.get(rank4)[0]);
        return indices;
      }
    }
  }
  return [];
}
function getStraightFlushHighCard(cards, suit) {
  const suitCards = cards.filter((c) => c.suit === suit);
  return getStraightHighCard(suitCards);
}
function getStraightFlushIndices(cards, highCard, suit) {
  const _suitCards = cards.filter((c) => c.suit === suit);
  const suitCardIndices = [];
  const indexMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].suit === suit) {
      indexMap.set(suitCardIndices.length, i);
      suitCardIndices.push(cards[i]);
    }
  }
  const indices = getStraightIndices(suitCardIndices, highCard);
  return indices.map((idx) => indexMap.get(idx));
}
function getFullHouseIndices(cards) {
  const rankCounts = countRanks(cards);
  let tripsRank = 0;
  for (const [rank, count] of rankCounts.entries()) {
    if (count === 3) {
      tripsRank = rank;
      break;
    }
  }
  let pairRank = 0;
  for (const [rank, count] of rankCounts.entries()) {
    if (count >= 2 && rank !== tripsRank) {
      pairRank = rank;
      break;
    }
  }
  if (pairRank === 0) {
    const tripsRanks = [];
    for (const [rank, count] of rankCounts.entries()) {
      if (count === 3) {
        tripsRanks.push(rank);
      }
    }
    if (tripsRanks.length >= 2) {
      tripsRanks.sort((a, b) => b - a);
      tripsRank = tripsRanks[0];
      pairRank = tripsRanks[1];
    }
  }
  const tripsIndices = findCardsOfRank(cards, tripsRank);
  const pairIndices = findCardsOfRank(cards, pairRank);
  return [...tripsIndices.slice(0, 3), ...pairIndices.slice(0, 2)];
}
function isFlush(cards) {
  const suitCounts = countSuits(cards);
  for (const count of suitCounts.values()) {
    if (count >= 5) return true;
  }
  return false;
}
function getStraightHighCard(cards) {
  const uniqueValues = /* @__PURE__ */ new Set();
  for (const card of cards) {
    uniqueValues.add(getRankValue(card.rank));
  }
  const sortedValues = Array.from(uniqueValues).sort((a, b) => b - a);
  if (sortedValues.includes(14)) {
    sortedValues.push(1);
  }
  for (let i = 0; i <= sortedValues.length - 5; i++) {
    const current = sortedValues[i];
    const next1 = sortedValues[i + 1];
    const next2 = sortedValues[i + 2];
    const next3 = sortedValues[i + 3];
    const next4 = sortedValues[i + 4];
    if (current - next1 === 1 && current - next2 === 2 && current - next3 === 3 && current - next4 === 4) {
      return current;
    }
  }
  return null;
}
function getMaxCount(cards) {
  const rankCounts = countRanks(cards);
  let maxCount = 0;
  for (const count of rankCounts.values()) {
    if (count > maxCount) {
      maxCount = count;
    }
  }
  return maxCount;
}
function getPairCount(cards) {
  const rankCounts = countRanks(cards);
  let pairCount = 0;
  for (const count of rankCounts.values()) {
    if (count === 2) {
      pairCount++;
    }
  }
  return pairCount;
}
function getMostCommonRank(cards) {
  const rankCounts = countRanks(cards);
  let bestRank = 0;
  let bestCount = 0;
  for (const [rank, count] of rankCounts.entries()) {
    if (count > bestCount) {
      bestCount = count;
      bestRank = rank;
    }
  }
  return bestRank > 0 ? bestRank : null;
}
function getTwoPairRanks(cards) {
  const rankCounts = countRanks(cards);
  const pairRanks = [];
  for (const [rank, count] of rankCounts.entries()) {
    if (count >= 2) {
      pairRanks.push(rank);
    }
  }
  pairRanks.sort((a, b) => b - a);
  return pairRanks.slice(0, 2);
}
function getHighestCardIndex(cards) {
  let highestIdx = 0;
  let highestValue = 0;
  for (let i = 0; i < cards.length; i++) {
    const value = getRankValue(cards[i].rank);
    if (value > highestValue) {
      highestValue = value;
      highestIdx = i;
    }
  }
  return highestIdx;
}
function evaluateHand(hole, board) {
  const allCards = [...hole, ...board];
  const flush = isFlush(allCards);
  const straightHighCard = getStraightHighCard(allCards);
  const maxCount = getMaxCount(allCards);
  const pairCount = getPairCount(allCards);
  if (flush && straightHighCard === 14) {
    const flushSuit = findFlushSuit(allCards);
    const sfHighCard = getStraightFlushHighCard(allCards, flushSuit);
    if (sfHighCard === 14) {
      const participatingCards = getStraightFlushIndices(allCards, 14, flushSuit);
      return {
        rank: 10 /* RoyalFlush */,
        ...HAND_DISPLAY[10 /* RoyalFlush */],
        participatingCards
      };
    }
  }
  if (flush) {
    const flushSuit = findFlushSuit(allCards);
    const sfHighCard = getStraightFlushHighCard(allCards, flushSuit);
    if (sfHighCard !== null) {
      const participatingCards = getStraightFlushIndices(allCards, sfHighCard, flushSuit);
      return {
        rank: 9 /* StraightFlush */,
        ...HAND_DISPLAY[9 /* StraightFlush */],
        participatingCards
      };
    }
  }
  if (maxCount === 4) {
    const rank = getMostCommonRank(allCards);
    const participatingCards = findCardsOfRank(allCards, rank);
    return {
      rank: 8 /* FourOfAKind */,
      ...HAND_DISPLAY[8 /* FourOfAKind */],
      participatingCards
    };
  }
  if (maxCount === 3 && pairCount >= 1) {
    const participatingCards = getFullHouseIndices(allCards);
    return { rank: 7 /* FullHouse */, ...HAND_DISPLAY[7 /* FullHouse */], participatingCards };
  }
  if (flush) {
    const flushSuit = findFlushSuit(allCards);
    const suitIndices = findCardsOfSuit(allCards, flushSuit);
    const participatingCards = suitIndices.slice(0, 5);
    return { rank: 6 /* Flush */, ...HAND_DISPLAY[6 /* Flush */], participatingCards };
  }
  if (straightHighCard !== null) {
    const participatingCards = getStraightIndices(allCards, straightHighCard);
    return { rank: 5 /* Straight */, ...HAND_DISPLAY[5 /* Straight */], participatingCards };
  }
  if (maxCount === 3) {
    const rank = getMostCommonRank(allCards);
    const participatingCards = findCardsOfRank(allCards, rank);
    return {
      rank: 4 /* ThreeOfAKind */,
      ...HAND_DISPLAY[4 /* ThreeOfAKind */],
      participatingCards
    };
  }
  if (pairCount >= 2) {
    const [rank1, rank2] = getTwoPairRanks(allCards);
    const pair1Indices = findCardsOfRank(allCards, rank1);
    const pair2Indices = findCardsOfRank(allCards, rank2);
    const participatingCards = [...pair1Indices, ...pair2Indices];
    return { rank: 3 /* TwoPair */, ...HAND_DISPLAY[3 /* TwoPair */], participatingCards };
  }
  if (pairCount === 1) {
    const rank = getMostCommonRank(allCards);
    const participatingCards = findCardsOfRank(allCards, rank);
    return { rank: 2 /* OnePair */, ...HAND_DISPLAY[2 /* OnePair */], participatingCards };
  }
  const highestIdx = getHighestCardIndex(allCards);
  return {
    rank: 1 /* HighCard */,
    ...HAND_DISPLAY[1 /* HighCard */],
    participatingCards: [highestIdx]
  };
}

// src/widgets/poker/styles.ts
init_colors();
init_formatters();
var HAND_ABBREVIATIONS = {
  "Royal Flush": "RF",
  "Straight Flush": "SF",
  "Four of a Kind": "4K",
  "Full House": "FH",
  Flush: "FL",
  Straight: "ST",
  "Three of a Kind": "3K",
  "Two Pair": "2P",
  "One Pair": "1P",
  "High Card": "HC",
  Nothing: "\u2014"
};
function formatCardByParticipation(cardData, isParticipating) {
  const color = isRedSuit(cardData.card.suit) ? red : gray;
  const cardText = formatCard(cardData.card);
  if (isParticipating) {
    return `${color}${bold}(${cardText})${reset} `;
  } else {
    return `${color}${cardText}${reset} `;
  }
}
function formatCardCompact(cardData, isParticipating) {
  const color = isRedSuit(cardData.card.suit) ? red : gray;
  const cardText = formatCardTextCompact(cardData.card);
  if (isParticipating) {
    return `${color}${bold}(${cardText})${reset}`;
  } else {
    return `${color}${cardText}${reset}`;
  }
}
function formatCardTextCompact(card) {
  const rankSymbols = {
    "10": "T",
    "11": "J",
    "12": "Q",
    "13": "K",
    "14": "A"
  };
  const rank = String(card.rank);
  const rankSymbol = rankSymbols[rank] ?? rank;
  return `${rankSymbol}${card.suit}`;
}
function formatCardEmojiByParticipation(cardData, isParticipating) {
  const cardText = formatCardEmoji(cardData.card);
  if (isParticipating) {
    return `${bold}(${cardText})${reset} `;
  } else {
    return `${cardText} `;
  }
}
function formatHandResult(handResult, colors2) {
  if (!handResult) {
    return "\u2014";
  }
  const playerParticipates = handResult.participatingIndices.some((idx) => idx < 2);
  const resultText = !playerParticipates ? `Nothing \u{1F0CF}` : `${handResult.name}! ${handResult.emoji}`;
  if (!colors2) return resultText;
  return colorize2(resultText, colors2.result);
}
function getHandAbbreviation(handResult) {
  if (!handResult) {
    return "\u2014 (\u2014)";
  }
  const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "\u2014";
  return `${abbreviation} (${handResult.name})`;
}
function balancedStyle2(data, colors2) {
  const { holeCards, boardCards, handResult } = data;
  const participatingSet = new Set(handResult?.participatingIndices || []);
  const handStr = holeCards.map((hc, idx) => formatCardByParticipation(hc, participatingSet.has(idx))).join("");
  const boardStr = boardCards.map((bc, idx) => formatCardByParticipation(bc, participatingSet.has(idx + 2))).join("");
  const labelColor = colors2?.participating ?? lightGray;
  const handLabel = colorize2("Hand:", labelColor);
  const boardLabel = colorize2("Board:", labelColor);
  return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}\u2192 ${formatHandResult(handResult, colors2)}`;
}
var pokerStyles = {
  balanced: balancedStyle2,
  compact: balancedStyle2,
  playful: balancedStyle2,
  "compact-verbose": (data, colors2) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);
    const handStr = holeCards.map((hc, idx) => formatCardCompact(hc, participatingSet.has(idx))).join("");
    const boardStr = boardCards.map((bc, idx) => formatCardCompact(bc, participatingSet.has(idx + 2))).join("");
    const abbreviation = getHandAbbreviation(handResult);
    const result = `${handStr}| ${boardStr}\u2192 ${abbreviation}`;
    if (!colors2) return result;
    return colorize2(result, colors2.result);
  },
  emoji: (data, colors2) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);
    const handStr = holeCards.map((hc, idx) => formatCardEmojiByParticipation(hc, participatingSet.has(idx))).join("");
    const boardStr = boardCards.map((bc, idx) => formatCardEmojiByParticipation(bc, participatingSet.has(idx + 2))).join("");
    const labelColor = colors2?.participating ?? lightGray;
    const handLabel = colorize2("Hand:", labelColor);
    const boardLabel = colorize2("Board:", labelColor);
    return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}\u2192 ${formatHandResult(handResult, colors2)}`;
  }
};

// src/widgets/poker-widget.ts
var PokerWidget = class extends StdinDataWidget {
  id = "poker";
  metadata = createWidgetMetadata(
    "Poker",
    "Displays random Texas Hold'em hands for entertainment",
    "1.0.0",
    "claude-scope",
    4
    // Fifth line (0-indexed)
  );
  holeCards = [];
  boardCards = [];
  handResult = null;
  lastUpdateTimestamp = 0;
  THROTTLE_MS = 5e3;
  // 5 seconds
  colors;
  styleFn = pokerStyles.balanced;
  setStyle(style = DEFAULT_WIDGET_STYLE) {
    const fn = pokerStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }
  constructor(colors2) {
    super();
    this.colors = colors2 ?? DEFAULT_THEME;
  }
  /**
   * Generate new poker hand on each update
   */
  async update(data) {
    await super.update(data);
    const now = Date.now();
    if (this.lastUpdateTimestamp > 0 && now - this.lastUpdateTimestamp < this.THROTTLE_MS) {
      return;
    }
    const deck = new Deck();
    const hole = [deck.deal(), deck.deal()];
    const board = [deck.deal(), deck.deal(), deck.deal(), deck.deal(), deck.deal()];
    const result = evaluateHand(hole, board);
    this.holeCards = hole.map((card) => ({
      card,
      formatted: this.formatCardColor(card)
    }));
    this.boardCards = board.map((card) => ({
      card,
      formatted: this.formatCardColor(card)
    }));
    const playerParticipates = result.participatingCards.some((idx) => idx < 2);
    if (!playerParticipates) {
      this.handResult = {
        text: `Nothing \u{1F0CF}`,
        participatingIndices: result.participatingCards
      };
    } else {
      this.handResult = {
        text: `${result.name}! ${result.emoji}`,
        participatingIndices: result.participatingCards
      };
    }
    this.lastUpdateTimestamp = now;
  }
  /**
   * Format card with appropriate color (red for ♥♦, gray for ♠♣)
   */
  formatCardColor(card) {
    const _color = isRedSuit(card.suit) ? "red" : "gray";
    return formatCard(card);
  }
  renderWithData(_data, _context) {
    const holeCardsData = this.holeCards.map((hc, idx) => ({
      card: hc.card,
      isParticipating: (this.handResult?.participatingIndices || []).includes(idx)
    }));
    const boardCardsData = this.boardCards.map((bc, idx) => ({
      card: bc.card,
      isParticipating: (this.handResult?.participatingIndices || []).includes(idx + 2)
    }));
    const handResult = this.handResult ? {
      name: this.getHandName(this.handResult.text),
      emoji: this.getHandEmoji(this.handResult.text),
      participatingIndices: this.handResult.participatingIndices
    } : null;
    const renderData = {
      holeCards: holeCardsData,
      boardCards: boardCardsData,
      handResult
    };
    return this.styleFn(renderData, this.colors.poker);
  }
  getHandName(text) {
    const match = text.match(/^([^!]+)/);
    return match ? match[1].trim() : "Nothing";
  }
  getHandEmoji(text) {
    const match = text.match(/([🃏♠️♥️♦️♣️🎉✨🌟])/u);
    return match ? match[1] : "\u{1F0CF}";
  }
};

// src/index.ts
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}
function applyWidgetConfig(widget, widgetId, config) {
  for (const line of Object.values(config.lines)) {
    const widgetConfig = line.find((w) => w.id === widgetId);
    if (widgetConfig && typeof widget.setStyle === "function" && isValidWidgetStyle(widgetConfig.style)) {
      widget.setStyle(widgetConfig.style);
      break;
    }
  }
}
async function registerWidgetWithConfig(registry, widget, widgetId, config) {
  if (config) {
    applyWidgetConfig(widget, widgetId, config);
  }
  await registry.register(widget);
}
async function main() {
  try {
    const command = parseCommand();
    if (command === "quick-config") {
      await routeCommand(command);
      return "";
    }
    const stdin = await readStdin();
    if (!stdin || stdin.trim().length === 0) {
      const fallback = await tryGitFallback();
      return fallback;
    }
    const provider = new StdinProvider();
    const stdinData = await provider.parse(stdin);
    const registry = new WidgetRegistry();
    const transcriptProvider = new TranscriptProvider();
    const widgetConfig = await loadWidgetConfig();
    await registerWidgetWithConfig(registry, new ModelWidget(), "model", widgetConfig);
    await registerWidgetWithConfig(registry, new ContextWidget(), "context", widgetConfig);
    await registerWidgetWithConfig(registry, new CostWidget(), "cost", widgetConfig);
    await registerWidgetWithConfig(registry, new LinesWidget(), "lines", widgetConfig);
    await registerWidgetWithConfig(registry, new DurationWidget(), "duration", widgetConfig);
    await registerWidgetWithConfig(registry, new GitWidget(), "git", widgetConfig);
    await registerWidgetWithConfig(registry, new GitTagWidget(), "git-tag", widgetConfig);
    await registerWidgetWithConfig(registry, new ConfigCountWidget(), "config-count", widgetConfig);
    if (isWidgetEnabled("cacheMetrics")) {
      await registerWidgetWithConfig(
        registry,
        new CacheMetricsWidget(DEFAULT_THEME),
        "cache-metrics",
        widgetConfig
      );
    }
    if (isWidgetEnabled("activeTools")) {
      await registerWidgetWithConfig(
        registry,
        new ActiveToolsWidget(DEFAULT_THEME, transcriptProvider),
        "active-tools",
        widgetConfig
      );
    }
    await registry.register(new PokerWidget());
    await registry.register(new EmptyLineWidget());
    const renderer = new Renderer({
      separator: " \u2502 ",
      onError: (_error, _widget) => {
      },
      showErrors: false
    });
    for (const widget of registry.getAll()) {
      await widget.update(stdinData);
    }
    const lines = await renderer.render(registry.getEnabledWidgets(), {
      width: 80,
      timestamp: Date.now()
    });
    return lines.join("\n");
  } catch (_error) {
    const fallback = await tryGitFallback();
    return fallback;
  }
}
async function tryGitFallback() {
  try {
    const cwd = process.cwd();
    const widget = new GitWidget();
    await widget.initialize({ config: {} });
    await widget.update({ cwd, session_id: "fallback" });
    const result = await widget.render({ width: 80, timestamp: Date.now() });
    return result || "";
  } catch {
    return "";
  }
}
main().then((output) => {
  if (output) {
    console.log(output);
  }
}).catch(() => {
  process.exit(0);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
