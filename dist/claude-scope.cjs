#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  main: () => main
});
module.exports = __toCommonJS(index_exports);

// src/config/widget-flags.ts
var WIDGET_FLAGS = {
  activeTools: true,
  cacheMetrics: true
};
function isWidgetEnabled(name) {
  return WIDGET_FLAGS[name] ?? true;
}

// src/constants.ts
var TIME = {
  /** Milliseconds per second */
  MS_PER_SECOND: 1e3,
  /** Seconds per minute */
  SECONDS_PER_MINUTE: 60,
  /** Seconds per hour */
  SECONDS_PER_HOUR: 3600
};
var DEFAULTS = {
  /** Default separator between widgets */
  SEPARATOR: " ",
  /** Default width for progress bars in characters */
  PROGRESS_BAR_WIDTH: 20
};
var ANSI_COLORS = {
  /** Green color */
  GREEN: "\x1B[32m",
  /** Yellow color */
  YELLOW: "\x1B[33m",
  /** Red color */
  RED: "\x1B[31m",
  /** Reset color */
  RESET: "\x1B[0m"
};
var DEFAULT_PROGRESS_BAR_WIDTH = DEFAULTS.PROGRESS_BAR_WIDTH;

// src/core/renderer.ts
var Renderer = class {
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

// src/core/widget-registry.ts
var WidgetRegistry = class {
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

// src/providers/transcript-provider.ts
var import_node_fs = require("node:fs");
var import_node_readline = require("node:readline");
var TranscriptProvider = class {
  MAX_TOOLS = 20;
  /**
   * Parse tools from a JSONL transcript file
   * @param transcriptPath Path to the transcript file
   * @returns Array of tool entries, limited to last 20
   */
  async parseTools(transcriptPath) {
    if (!(0, import_node_fs.existsSync)(transcriptPath)) {
      return [];
    }
    const toolMap = /* @__PURE__ */ new Map();
    try {
      const fileStream = (0, import_node_fs.createReadStream)(transcriptPath, { encoding: "utf-8" });
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

// src/ui/utils/colors.ts
var reset = "\x1B[0m";
var red = "\x1B[31m";
var gray = "\x1B[90m";
var lightGray = "\x1B[37m";
var bold = "\x1B[1m";
function colorize(text, color) {
  return `${color}${text}${reset}`;
}

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

// src/ui/theme/gray-theme.ts
var GRAY_THEME = {
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

// src/ui/theme/themes/catppuccin-mocha-theme.ts
var CATPPUCCIN_MOCHA_THEME = {
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

// src/ui/theme/themes/cyberpunk-neon-theme.ts
var CYBERPUNK_NEON_THEME = {
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

// src/ui/theme/themes/dracula-theme.ts
var DRACULA_THEME = {
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

// src/ui/theme/themes/dusty-sage-theme.ts
var DUSTY_SAGE_THEME = {
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

// src/ui/theme/themes/github-dark-dimmed-theme.ts
var GITHUB_DARK_DIMMED_THEME = {
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

// src/ui/theme/themes/monokai-theme.ts
var MONOKAI_THEME = {
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

// src/ui/theme/themes/muted-gray-theme.ts
var MUTED_GRAY_THEME = {
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

// src/ui/theme/themes/nord-theme.ts
var NORD_THEME = {
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

// src/ui/theme/themes/one-dark-pro-theme.ts
var ONE_DARK_PRO_THEME = {
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

// src/ui/theme/themes/professional-blue-theme.ts
var PROFESSIONAL_BLUE_THEME = {
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

// src/ui/theme/themes/rose-pine-theme.ts
var ROSE_PINE_THEME = {
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

// src/ui/theme/themes/semantic-classic-theme.ts
var SEMANTIC_CLASSIC_THEME = {
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

// src/ui/theme/themes/slate-blue-theme.ts
var SLATE_BLUE_THEME = {
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

// src/ui/theme/themes/solarized-dark-theme.ts
var SOLARIZED_DARK_THEME = {
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

// src/ui/theme/themes/tokyo-night-theme.ts
var TOKYO_NIGHT_THEME = {
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

// src/ui/theme/themes/vscode-dark-plus-theme.ts
var VSCODE_DARK_PLUS_THEME = {
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

// src/ui/theme/index.ts
var DEFAULT_THEME = MONOKAI_THEME.colors;

// src/widgets/core/stdin-data-widget.ts
var StdinDataWidget = class {
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

// src/widgets/active-tools/styles.ts
function truncatePath(path2) {
  if (path2.length <= 30) {
    return path2;
  }
  const parts = path2.split("/");
  return `.../${parts[parts.length - 1]}`;
}
function formatTool(name, target, colors) {
  const nameStr = colorize(name, colors.tools.name);
  if (target) {
    const targetStr = colorize(`: ${truncatePath(target)}`, colors.tools.target);
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
var activeToolsStyles = {
  /**
   * balanced: Group tools by name, showing running and completed counts together
   * - Running + completed: "ToolName (1 running, 6 done)"
   * - Only completed: "Tools: 6"
   * - No symbols, just text format
   */
  balanced: (data, colors) => {
    const parts = [];
    const c = colors ?? getDefaultColors();
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
  compact: (data, colors) => {
    const parts = [];
    const c = colors ?? getDefaultColors();
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
  minimal: (data, colors) => {
    const compactStyle = activeToolsStyles.compact;
    if (!compactStyle) return "";
    return compactStyle(data, colors);
  },
  /**
   * playful: Emojis (📖✏️✨🔄🔍📁) with tool names
   */
  playful: (data, colors) => {
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
      const nameStr = colors ? colorize(tool.name, colors.tools.name) : tool.name;
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
  verbose: (data, colors) => {
    const parts = [];
    const c = colors ?? getDefaultColors();
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
  labeled: (data, colors) => {
    const c = colors ?? getDefaultColors();
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
    const prefix = colors ? colorize("Tools:", c.semantic.info) : "Tools:";
    return `${prefix}: ${allTools.join(" | ")}`;
  },
  /**
   * indicator: ● bullet indicators
   */
  indicator: (data, colors) => {
    const parts = [];
    const c = colors ?? getDefaultColors();
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

// src/widgets/active-tools/active-tools-widget.ts
var ActiveToolsWidget = class extends StdinDataWidget {
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

// src/storage/cache-manager.ts
var import_node_fs2 = require("node:fs");
var import_node_os = require("node:os");
var import_node_path = require("node:path");
var DEFAULT_CACHE_PATH = `${(0, import_node_os.homedir)()}/.config/claude-scope/cache.json`;
var DEFAULT_EXPIRY_MS = 5 * 60 * 1e3;
var CacheManager = class {
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
    if (!(0, import_node_fs2.existsSync)(this.cachePath)) {
      return { sessions: {}, version: 1 };
    }
    try {
      const content = (0, import_node_fs2.readFileSync)(this.cachePath, "utf-8");
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
      (0, import_node_fs2.writeFileSync)(this.cachePath, JSON.stringify(cache, null, 2), "utf-8");
    } catch {
    }
  }
  /**
   * Ensure cache directory exists
   */
  ensureCacheDir() {
    try {
      const dir = (0, import_node_path.dirname)(this.cachePath);
      if (!(0, import_node_fs2.existsSync)(dir)) {
        (0, import_node_fs2.mkdirSync)(dir, { recursive: true });
      }
    } catch {
    }
  }
};

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

// src/widgets/cache-metrics/styles.ts
function formatCurrency(usd) {
  if (usd < 5e-3 && usd > 0) {
    return "<$0.01";
  }
  return `$${usd.toFixed(2)}`;
}
function getCacheColor(hitRate, colors) {
  if (hitRate > 70) {
    return colors.cache.high;
  } else if (hitRate >= 40) {
    return colors.cache.medium;
  } else {
    return colors.cache.low;
  }
}
var cacheMetricsStyles = {
  /**
   * balanced: 💾 35.0k cache with color coding
   */
  balanced: (data, colors) => {
    const { cacheRead, hitRate } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
    return `\u{1F4BE} ${amount}`;
  },
  /**
   * compact: Cache: 35.0k
   */
  compact: (data, colors) => {
    const { cacheRead } = data;
    const amount = formatK(cacheRead);
    if (colors) {
      return `${colors.cache.read}Cache: ${amount}`;
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
  verbose: (data, colors) => {
    const { cacheRead, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors ? `${colors.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
    return `Cache: ${amount} | ${saved}`;
  },
  /**
   * labeled: Cache: 35.0k | $0.03 saved
   */
  labeled: (data, colors) => {
    const { cacheRead, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors ? `${colors.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
    return `Cache: ${amount} | ${saved}`;
  },
  /**
   * indicator: ● 35.0k cache with color coding
   */
  indicator: (data, colors) => {
    const { cacheRead, hitRate } = data;
    const color = colors ? getCacheColor(hitRate, colors) : "";
    const amount = color ? `${color}${formatK(cacheRead)} cache` : `${formatK(cacheRead)} cache`;
    return `\u25CF ${amount}`;
  },
  /**
   * breakdown: Single-line with Hit: and Write: breakdown
   */
  breakdown: (data, colors) => {
    const { cacheRead, cacheWrite, savings } = data;
    const amount = formatK(cacheRead);
    const saved = colors ? `${colors.cache.write}${formatCurrency(savings)} saved` : `${formatCurrency(savings)} saved`;
    const read = formatK(cacheRead);
    const write = formatK(cacheWrite);
    return `\u{1F4BE} ${amount} cache | Hit: ${read}, Write: ${write} | ${saved}`;
  }
};

// src/widgets/cache-metrics/cache-metrics-widget.ts
var CacheMetricsWidget = class extends StdinDataWidget {
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
    const usage = data.context_window?.current_usage;
    if (usage) {
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

// src/core/style-types.ts
var DEFAULT_WIDGET_STYLE = "balanced";

// src/providers/config-provider.ts
var fs = __toESM(require("node:fs/promises"), 1);
var os = __toESM(require("node:os"), 1);
var path = __toESM(require("node:path"), 1);
var ConfigProvider = class {
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

// src/widgets/config-count/styles.ts
var configCountStyles = {
  balanced: (data) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts = [];
    if (claudeMdCount > 0) {
      parts.push(`CLAUDE.md:${claudeMdCount}`);
    }
    if (rulesCount > 0) {
      parts.push(`rules:${rulesCount}`);
    }
    if (mcpCount > 0) {
      parts.push(`MCPs:${mcpCount}`);
    }
    if (hooksCount > 0) {
      parts.push(`hooks:${hooksCount}`);
    }
    return parts.join(" \u2502 ");
  },
  compact: (data) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts = [];
    if (claudeMdCount > 0) {
      parts.push(`${claudeMdCount} docs`);
    }
    if (rulesCount > 0) {
      parts.push(`${rulesCount} rules`);
    }
    if (mcpCount > 0) {
      parts.push(`${mcpCount} MCPs`);
    }
    if (hooksCount > 0) {
      const hookLabel = hooksCount === 1 ? "hook" : "hooks";
      parts.push(`${hooksCount} ${hookLabel}`);
    }
    return parts.join(" \u2502 ");
  },
  playful: (data) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts = [];
    if (claudeMdCount > 0) {
      parts.push(`\u{1F4C4} CLAUDE.md:${claudeMdCount}`);
    }
    if (rulesCount > 0) {
      parts.push(`\u{1F4DC} rules:${rulesCount}`);
    }
    if (mcpCount > 0) {
      parts.push(`\u{1F50C} MCPs:${mcpCount}`);
    }
    if (hooksCount > 0) {
      parts.push(`\u{1FA9D} hooks:${hooksCount}`);
    }
    return parts.join(" \u2502 ");
  },
  verbose: (data) => {
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = data;
    const parts = [];
    if (claudeMdCount > 0) {
      parts.push(`${claudeMdCount} CLAUDE.md`);
    }
    if (rulesCount > 0) {
      parts.push(`${rulesCount} rules`);
    }
    if (mcpCount > 0) {
      parts.push(`${mcpCount} MCP servers`);
    }
    if (hooksCount > 0) {
      parts.push(`${hooksCount} hook`);
    }
    return parts.join(" \u2502 ");
  }
};

// src/widgets/config-count-widget.ts
var ConfigCountWidget = class {
  id = "config-count";
  metadata = createWidgetMetadata(
    "Config Count",
    "Displays Claude Code configuration counts",
    "1.0.0",
    "claude-scope",
    1
    // Second line
  );
  configProvider = new ConfigProvider();
  configs;
  cwd;
  styleFn = configCountStyles.balanced;
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
      hooksCount
    };
    return this.styleFn(renderData);
  }
  async cleanup() {
  }
};

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

// src/widgets/context/styles.ts
function getContextColor(percent, colors) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  if (clampedPercent < 50) {
    return colors.low;
  } else if (clampedPercent < 80) {
    return colors.medium;
  } else {
    return colors.high;
  }
}
var contextStyles = {
  balanced: (data, colors) => {
    const bar = progressBar(data.percent, 10);
    const output = `[${bar}] ${data.percent}%`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  },
  compact: (data, colors) => {
    const output = `${data.percent}%`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  },
  playful: (data, colors) => {
    const bar = progressBar(data.percent, 10);
    const output = `\u{1F9E0} [${bar}] ${data.percent}%`;
    if (!colors) return output;
    return `\u{1F9E0} ${colorize(`[${bar}] ${data.percent}%`, getContextColor(data.percent, colors))}`;
  },
  verbose: (data, colors) => {
    const usedFormatted = data.used.toLocaleString();
    const maxFormatted = data.contextWindowSize.toLocaleString();
    const output = `${usedFormatted} / ${maxFormatted} tokens (${data.percent}%)`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  },
  symbolic: (data, colors) => {
    const filled = Math.round(data.percent / 100 * 5);
    const empty = 5 - filled;
    const output = `${"\u25AE".repeat(filled)}${"\u25AF".repeat(empty)} ${data.percent}%`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  },
  "compact-verbose": (data, colors) => {
    const usedK = data.used >= 1e3 ? `${Math.floor(data.used / 1e3)}K` : data.used.toString();
    const maxK = data.contextWindowSize >= 1e3 ? `${Math.floor(data.contextWindowSize / 1e3)}K` : data.contextWindowSize.toString();
    const output = `${data.percent}% (${usedK}/${maxK})`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  },
  indicator: (data, colors) => {
    const output = `\u25CF ${data.percent}%`;
    if (!colors) return output;
    return colorize(output, getContextColor(data.percent, colors));
  }
};

// src/widgets/context-widget.ts
var ContextWidget = class extends StdinDataWidget {
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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
    const { current_usage } = data.context_window;
    if (current_usage) {
      this.cacheManager.setCachedUsage(data.session_id, {
        input_tokens: current_usage.input_tokens,
        output_tokens: current_usage.output_tokens,
        cache_creation_input_tokens: current_usage.cache_creation_input_tokens,
        cache_read_input_tokens: current_usage.cache_read_input_tokens
      });
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

// src/widgets/cost/styles.ts
function balancedStyle(data, colors) {
  const formatted = formatCostUSD(data.costUsd);
  if (!colors) return formatted;
  const amountStr = data.costUsd.toFixed(2);
  return colorize("$", colors.currency) + colorize(amountStr, colors.amount);
}
var costStyles = {
  balanced: balancedStyle,
  compact: balancedStyle,
  playful: (data, colors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return `\u{1F4B0} ${formatted}`;
    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return `\u{1F4B0} ${colored}`;
  },
  labeled: (data, colors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return withLabel("Cost", formatted);
    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return withLabel("Cost", colored);
  },
  indicator: (data, colors) => {
    const formatted = formatCostUSD(data.costUsd);
    if (!colors) return withIndicator(formatted);
    const amountStr = data.costUsd.toFixed(2);
    const colored = colorize("$", colors.currency) + colorize(amountStr, colors.amount);
    return withIndicator(colored);
  }
};

// src/widgets/cost-widget.ts
var CostWidget = class extends StdinDataWidget {
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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

// src/widgets/duration/styles.ts
var durationStyles = {
  balanced: (data, colors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return formatted;
    return formatDurationWithColors(data.durationMs, colors);
  },
  compact: (data, colors) => {
    const totalSeconds = Math.floor(data.durationMs / 1e3);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    if (!colors) {
      if (hours > 0) {
        return `${hours}h${minutes}m`;
      }
      return `${minutes}m`;
    }
    if (hours > 0) {
      return colorize(`${hours}`, colors.value) + colorize("h", colors.unit) + colorize(`${minutes}`, colors.value) + colorize("m", colors.unit);
    }
    return colorize(`${minutes}`, colors.value) + colorize("m", colors.unit);
  },
  playful: (data, colors) => {
    const totalSeconds = Math.floor(data.durationMs / 1e3);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    if (!colors) {
      if (hours > 0) {
        return `\u231B ${hours}h ${minutes}m`;
      }
      return `\u231B ${minutes}m`;
    }
    if (hours > 0) {
      const colored = colorize(`${hours}`, colors.value) + colorize("h", colors.unit) + colorize(` ${minutes}`, colors.value) + colorize("m", colors.unit);
      return `\u231B ${colored}`;
    }
    return `\u231B ${colorize(`${minutes}`, colors.value)}${colorize("m", colors.unit)}`;
  },
  technical: (data, colors) => {
    const value = `${Math.floor(data.durationMs)}ms`;
    if (!colors) return value;
    return colorize(`${Math.floor(data.durationMs)}`, colors.value) + colorize("ms", colors.unit);
  },
  labeled: (data, colors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return withLabel("Time", formatted);
    const colored = formatDurationWithColors(data.durationMs, colors);
    return withLabel("Time", colored);
  },
  indicator: (data, colors) => {
    const formatted = formatDuration(data.durationMs);
    if (!colors) return withIndicator(formatted);
    const colored = formatDurationWithColors(data.durationMs, colors);
    return withIndicator(colored);
  }
};
function formatDurationWithColors(ms, colors) {
  if (ms <= 0) return colorize("0s", colors.value);
  const totalSeconds = Math.floor(ms / 1e3);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(
      colorize(`${hours}`, colors.value) + colorize("h", colors.unit),
      colorize(`${minutes}`, colors.value) + colorize("m", colors.unit),
      colorize(`${seconds}`, colors.value) + colorize("s", colors.unit)
    );
  } else if (minutes > 0) {
    parts.push(
      colorize(`${minutes}`, colors.value) + colorize("m", colors.unit),
      colorize(`${seconds}`, colors.value) + colorize("s", colors.unit)
    );
  } else {
    parts.push(colorize(`${seconds}`, colors.value) + colorize("s", colors.unit));
  }
  return parts.join(" ");
}

// src/widgets/duration-widget.ts
var DurationWidget = class extends StdinDataWidget {
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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

// src/widgets/empty-line-widget.ts
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

// src/providers/git-provider.ts
var import_node_child_process = require("node:child_process");
var import_node_util = require("node:util");
var execFileAsync = (0, import_node_util.promisify)(import_node_child_process.execFile);
var NativeGit = class {
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
function createGit(cwd) {
  return new NativeGit(cwd);
}

// src/widgets/git-tag/styles.ts
var gitTagStyles = {
  balanced: (data, colors) => {
    const tag = data.tag || "\u2014";
    if (!colors) return tag;
    return colorize(tag, colors.branch);
  },
  compact: (data, colors) => {
    if (!data.tag) return "\u2014";
    const tag = data.tag.replace(/^v/, "");
    if (!colors) return tag;
    return colorize(tag, colors.branch);
  },
  playful: (data, colors) => {
    const tag = data.tag || "\u2014";
    if (!colors) return `\u{1F3F7}\uFE0F ${tag}`;
    return `\u{1F3F7}\uFE0F ${colorize(tag, colors.branch)}`;
  },
  verbose: (data, colors) => {
    if (!data.tag) return "version: none";
    const tag = `version ${data.tag}`;
    if (!colors) return tag;
    return `version ${colorize(data.tag, colors.branch)}`;
  },
  labeled: (data, colors) => {
    const tag = data.tag || "none";
    if (!colors) return withLabel("Tag", tag);
    return withLabel("Tag", colorize(tag, colors.branch));
  },
  indicator: (data, colors) => {
    const tag = data.tag || "\u2014";
    if (!colors) return withIndicator(tag);
    return withIndicator(colorize(tag, colors.branch));
  }
};

// src/widgets/git/git-tag-widget.ts
var GitTagWidget = class {
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
  constructor(gitFactory, colors) {
    this.gitFactory = gitFactory || createGit;
    this.colors = colors ?? DEFAULT_THEME;
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

// src/widgets/git/styles.ts
var gitStyles = {
  minimal: (data, colors) => {
    if (!colors) return data.branch;
    return colorize(data.branch, colors.branch);
  },
  balanced: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        const changes = colors ? colorize(`[${parts.join(" ")}]`, colors.changes) : `[${parts.join(" ")}]`;
        return `${branch} ${changes}`;
      }
    }
    return colors ? colorize(data.branch, colors.branch) : data.branch;
  },
  compact: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        const changesStr = parts.join("/");
        return `${branch} ${changesStr}`;
      }
    }
    return colors ? colorize(data.branch, colors.branch) : data.branch;
  },
  playful: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`\u2B06${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`\u2B07${data.changes.deletions}`);
      if (parts.length > 0) {
        const branch2 = colors ? colorize(data.branch, colors.branch) : data.branch;
        return `\u{1F500} ${branch2} ${parts.join(" ")}`;
      }
    }
    const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
    return `\u{1F500} ${branch}`;
  },
  verbose: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions} insertions`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions} deletions`);
      if (parts.length > 0) {
        const branch2 = colors ? colorize(data.branch, colors.branch) : data.branch;
        const changes = colors ? colorize(`[${parts.join(", ")}]`, colors.changes) : `[${parts.join(", ")}]`;
        return `branch: ${branch2} ${changes}`;
      }
    }
    const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
    return `branch: ${branch} (HEAD)`;
  },
  labeled: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        const branch2 = colors ? colorize(data.branch, colors.branch) : data.branch;
        const changes = `${data.changes.files} files: ${parts.join("/")}`;
        return `Git: ${branch2} [${changes}]`;
      }
    }
    const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
    return `Git: ${branch}`;
  },
  indicator: (data, colors) => {
    if (data.changes && data.changes.files > 0) {
      const parts = [];
      if (data.changes.insertions > 0) parts.push(`+${data.changes.insertions}`);
      if (data.changes.deletions > 0) parts.push(`-${data.changes.deletions}`);
      if (parts.length > 0) {
        const branch = colors ? colorize(data.branch, colors.branch) : data.branch;
        const changes = colors ? colorize(`[${parts.join(" ")}]`, colors.changes) : `[${parts.join(" ")}]`;
        return `\u25CF ${branch} ${changes}`;
      }
    }
    return withIndicator(colors ? colorize(data.branch, colors.branch) : data.branch);
  }
};

// src/widgets/git/git-widget.ts
var GitWidget = class {
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
  constructor(gitFactory, colors) {
    this.gitFactory = gitFactory || createGit;
    this.colors = colors ?? DEFAULT_THEME;
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

// src/widgets/lines/styles.ts
var linesStyles = {
  balanced: (data, colors) => {
    if (!colors) return `+${data.added}/-${data.removed}`;
    const addedStr = colorize(`+${data.added}`, colors.added);
    const removedStr = colorize(`-${data.removed}`, colors.removed);
    return `${addedStr}/${removedStr}`;
  },
  compact: (data, colors) => {
    if (!colors) return `+${data.added}-${data.removed}`;
    const addedStr = colorize(`+${data.added}`, colors.added);
    const removedStr = colorize(`-${data.removed}`, colors.removed);
    return `${addedStr}${removedStr}`;
  },
  playful: (data, colors) => {
    if (!colors) return `\u2795${data.added} \u2796${data.removed}`;
    const addedStr = colorize(`\u2795${data.added}`, colors.added);
    const removedStr = colorize(`\u2796${data.removed}`, colors.removed);
    return `${addedStr} ${removedStr}`;
  },
  verbose: (data, colors) => {
    const parts = [];
    if (data.added > 0) {
      const text = `+${data.added} added`;
      parts.push(colors ? colorize(text, colors.added) : text);
    }
    if (data.removed > 0) {
      const text = `-${data.removed} removed`;
      parts.push(colors ? colorize(text, colors.removed) : text);
    }
    return parts.join(", ");
  },
  labeled: (data, colors) => {
    const addedStr = colors ? colorize(`+${data.added}`, colors.added) : `+${data.added}`;
    const removedStr = colors ? colorize(`-${data.removed}`, colors.removed) : `-${data.removed}`;
    const lines = `${addedStr}/${removedStr}`;
    return withLabel("Lines", lines);
  },
  indicator: (data, colors) => {
    const addedStr = colors ? colorize(`+${data.added}`, colors.added) : `+${data.added}`;
    const removedStr = colors ? colorize(`-${data.removed}`, colors.removed) : `-${data.removed}`;
    const lines = `${addedStr}/${removedStr}`;
    return withIndicator(lines);
  }
};

// src/widgets/lines-widget.ts
var LinesWidget = class extends StdinDataWidget {
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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

// src/widgets/model/styles.ts
function getShortName(displayName) {
  return displayName.replace(/^Claude\s+/, "");
}
var modelStyles = {
  balanced: (data, colors) => {
    if (!colors) return data.displayName;
    return colorize(data.displayName, colors.name);
  },
  compact: (data, colors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return shortName;
    return colorize(shortName, colors.name);
  },
  playful: (data, colors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return `\u{1F916} ${shortName}`;
    return `\u{1F916} ${colorize(shortName, colors.name)}`;
  },
  technical: (data, colors) => {
    if (!colors) return data.id;
    const match = data.id.match(/^(.+?)-(\d[\d.]*)$/);
    if (match) {
      return colorize(match[1], colors.name) + colorize(`-${match[2]}`, colors.version);
    }
    return colorize(data.id, colors.name);
  },
  symbolic: (data, colors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return `\u25C6 ${shortName}`;
    return `\u25C6 ${colorize(shortName, colors.name)}`;
  },
  labeled: (data, colors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return withLabel("Model", shortName);
    return withLabel("Model", colorize(shortName, colors.name));
  },
  indicator: (data, colors) => {
    const shortName = getShortName(data.displayName);
    if (!colors) return withIndicator(shortName);
    return withIndicator(colorize(shortName, colors.name));
  }
};

// src/widgets/model-widget.ts
var ModelWidget = class extends StdinDataWidget {
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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
function formatHandResult(handResult, colors) {
  if (!handResult) {
    return "\u2014";
  }
  const playerParticipates = handResult.participatingIndices.some((idx) => idx < 2);
  const resultText = !playerParticipates ? `Nothing \u{1F0CF}` : `${handResult.name}! ${handResult.emoji}`;
  if (!colors) return resultText;
  return colorize2(resultText, colors.result);
}
function getHandAbbreviation(handResult) {
  if (!handResult) {
    return "\u2014 (\u2014)";
  }
  const abbreviation = HAND_ABBREVIATIONS[handResult.name] ?? "\u2014";
  return `${abbreviation} (${handResult.name})`;
}
function balancedStyle2(data, colors) {
  const { holeCards, boardCards, handResult } = data;
  const participatingSet = new Set(handResult?.participatingIndices || []);
  const handStr = holeCards.map((hc, idx) => formatCardByParticipation(hc, participatingSet.has(idx))).join("");
  const boardStr = boardCards.map((bc, idx) => formatCardByParticipation(bc, participatingSet.has(idx + 2))).join("");
  const labelColor = colors?.participating ?? lightGray;
  const handLabel = colorize2("Hand:", labelColor);
  const boardLabel = colorize2("Board:", labelColor);
  return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}\u2192 ${formatHandResult(handResult, colors)}`;
}
var pokerStyles = {
  balanced: balancedStyle2,
  compact: balancedStyle2,
  playful: balancedStyle2,
  "compact-verbose": (data, colors) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);
    const handStr = holeCards.map((hc, idx) => formatCardCompact(hc, participatingSet.has(idx))).join("");
    const boardStr = boardCards.map((bc, idx) => formatCardCompact(bc, participatingSet.has(idx + 2))).join("");
    const abbreviation = getHandAbbreviation(handResult);
    const result = `${handStr}| ${boardStr}\u2192 ${abbreviation}`;
    if (!colors) return result;
    return colorize2(result, colors.result);
  },
  emoji: (data, colors) => {
    const { holeCards, boardCards, handResult } = data;
    const participatingSet = new Set(handResult?.participatingIndices || []);
    const handStr = holeCards.map((hc, idx) => formatCardEmojiByParticipation(hc, participatingSet.has(idx))).join("");
    const boardStr = boardCards.map((bc, idx) => formatCardEmojiByParticipation(bc, participatingSet.has(idx + 2))).join("");
    const labelColor = colors?.participating ?? lightGray;
    const handLabel = colorize2("Hand:", labelColor);
    const boardLabel = colorize2("Board:", labelColor);
    return `${handLabel} ${handStr}| ${boardLabel} ${boardStr}\u2192 ${formatHandResult(handResult, colors)}`;
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME;
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
async function main() {
  try {
    const stdin = await readStdin();
    if (!stdin || stdin.trim().length === 0) {
      const fallback = await tryGitFallback();
      return fallback;
    }
    const provider = new StdinProvider();
    const stdinData = await provider.parse(stdin);
    const registry = new WidgetRegistry();
    const transcriptProvider = new TranscriptProvider();
    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new LinesWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitWidget());
    await registry.register(new GitTagWidget());
    await registry.register(new ConfigCountWidget());
    if (isWidgetEnabled("cacheMetrics")) {
      await registry.register(new CacheMetricsWidget(DEFAULT_THEME));
    }
    if (isWidgetEnabled("activeTools")) {
      await registry.register(new ActiveToolsWidget(DEFAULT_THEME, transcriptProvider));
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
