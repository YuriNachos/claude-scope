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

// src/constants.ts
var TIME = {
  /** Milliseconds per second */
  MS_PER_SECOND: 1e3,
  /** Seconds per minute */
  SECONDS_PER_MINUTE: 60,
  /** Seconds per hour */
  SECONDS_PER_HOUR: 3600
};
var COST_THRESHOLDS = {
  /** Below this value, show 4 decimal places ($0.0012) */
  SMALL: 0.01,
  /** Above this value, show no decimal places ($123) */
  LARGE: 100
};
var CONTEXT_THRESHOLDS = {
  /** Below this: green (low usage) */
  LOW_MEDIUM: 50,
  /** Below this: yellow (medium usage), above: red (high usage) */
  MEDIUM_HIGH: 80
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
   * Render widgets into a single line with error boundaries
   *
   * Widgets that throw errors are logged (via onError callback) and skipped,
   * allowing other widgets to continue rendering.
   *
   * @param widgets - Array of widgets to render
   * @param context - Render context with width and timestamp
   * @returns Combined widget outputs separated by separator
   */
  async render(widgets, context) {
    const outputs = [];
    for (const widget of widgets) {
      if (!widget.isEnabled()) {
        continue;
      }
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
    return outputs.join(this.separator);
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

// src/core/widget-types.ts
function createWidgetMetadata(name, description, version = "1.0.0", author = "claude-scope") {
  return {
    name,
    description,
    version,
    author
  };
}

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
      const insertionMatch = stdout.match(/(\d+)\s+insertion/);
      const deletionMatch = stdout.match(/(\d+)\s+deletion/);
      const insertions = insertionMatch ? parseInt(insertionMatch[1], 10) : 0;
      const deletions = deletionMatch ? parseInt(deletionMatch[1], 10) : 0;
      const files = insertions > 0 || deletions > 0 ? [{ file: "(total)", insertions, deletions }] : [];
      return { files };
    } catch {
      return { files: [] };
    }
  }
};
function createGit(cwd) {
  return new NativeGit(cwd);
}

// src/widgets/git/git-widget.ts
var GitWidget = class {
  id = "git";
  metadata = createWidgetMetadata(
    "Git Widget",
    "Displays current git branch"
  );
  gitFactory;
  git = null;
  enabled = true;
  cwd = null;
  /**
   * @param gitFactory - Optional factory function for creating IGit instances
   *                     If not provided, uses default createGit (production)
   *                     Tests can inject MockGit factory here
   */
  constructor(gitFactory) {
    this.gitFactory = gitFactory || createGit;
  }
  async initialize(context) {
    this.enabled = context.config?.enabled !== false;
  }
  async render(context) {
    if (!this.enabled || !this.git || !this.cwd) {
      return null;
    }
    try {
      const status = await this.git.status();
      const branch = status.current || null;
      if (!branch) {
        return null;
      }
      return branch;
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

// src/widgets/model-widget.ts
var ModelWidget = class extends StdinDataWidget {
  id = "model";
  metadata = createWidgetMetadata(
    "Model",
    "Displays the current Claude model name"
  );
  renderWithData(data, context) {
    return data.model.display_name;
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
  const absUsd = Math.abs(usd);
  if (usd < 0) {
    return `$${usd.toFixed(2)}`;
  } else if (absUsd < COST_THRESHOLDS.SMALL) {
    return `$${usd.toFixed(4)}`;
  } else if (absUsd < COST_THRESHOLDS.LARGE) {
    return `$${usd.toFixed(2)}`;
  } else {
    return `$${Math.floor(usd).toFixed(0)}`;
  }
}
function progressBar(percent, width = DEFAULTS.PROGRESS_BAR_WIDTH) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const filled = Math.round(clampedPercent / 100 * width);
  const empty = width - filled;
  return "\u2588".repeat(filled) + "\u2591".repeat(empty);
}
function getContextColor(percent) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  if (clampedPercent < CONTEXT_THRESHOLDS.LOW_MEDIUM) {
    return ANSI_COLORS.GREEN;
  } else if (clampedPercent < CONTEXT_THRESHOLDS.MEDIUM_HIGH) {
    return ANSI_COLORS.YELLOW;
  } else {
    return ANSI_COLORS.RED;
  }
}
function colorize(text, color) {
  return `${color}${text}${ANSI_COLORS.RESET}`;
}

// src/widgets/context-widget.ts
var ContextWidget = class extends StdinDataWidget {
  id = "context";
  metadata = createWidgetMetadata(
    "Context",
    "Displays context window usage with progress bar"
  );
  renderWithData(data, context) {
    const { current_usage, context_window_size } = data.context_window;
    if (!current_usage) return null;
    const used = current_usage.input_tokens + current_usage.cache_creation_input_tokens + current_usage.output_tokens;
    const percent = Math.round(used / context_window_size * 100);
    const bar = progressBar(percent, DEFAULTS.PROGRESS_BAR_WIDTH);
    const color = getContextColor(percent);
    return colorize(`[${bar}] ${percent}%`, color);
  }
};

// src/widgets/cost-widget.ts
var CostWidget = class extends StdinDataWidget {
  id = "cost";
  metadata = createWidgetMetadata(
    "Cost",
    "Displays session cost in USD"
  );
  renderWithData(data, context) {
    if (!data.cost || data.cost.total_cost_usd === void 0) return null;
    return formatCostUSD(data.cost.total_cost_usd);
  }
};

// src/widgets/duration-widget.ts
var DurationWidget = class extends StdinDataWidget {
  id = "duration";
  metadata = createWidgetMetadata(
    "Duration",
    "Displays elapsed session time"
  );
  renderWithData(data, context) {
    if (!data.cost || data.cost.total_duration_ms === void 0) return null;
    return formatDuration(data.cost.total_duration_ms);
  }
};

// src/widgets/git/git-changes-widget.ts
var GitChangesWidget = class {
  id = "git-changes";
  metadata = createWidgetMetadata(
    "Git Changes",
    "Displays git diff statistics"
  );
  gitFactory;
  git = null;
  enabled = true;
  cwd = null;
  /**
   * @param gitFactory - Optional factory function for creating IGit instances
   *                     If not provided, uses default createGit (production)
   *                     Tests can inject MockGit factory here
   */
  constructor(gitFactory) {
    this.gitFactory = gitFactory || createGit;
  }
  async initialize(context) {
    this.enabled = context.config?.enabled !== false;
  }
  async update(data) {
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = this.gitFactory(data.cwd);
    }
  }
  async render(context) {
    if (!this.enabled || !this.git || !this.cwd) {
      return null;
    }
    let changes;
    try {
      const summary = await this.git.diffSummary(["--shortstat"]);
      let insertions = 0;
      let deletions = 0;
      if (summary.files && summary.files.length > 0) {
        for (const file of summary.files) {
          if (typeof file.insertions === "number") {
            insertions += file.insertions;
          }
          if (typeof file.deletions === "number") {
            deletions += file.deletions;
          }
        }
      }
      if (insertions === 0 && deletions === 0) {
        return null;
      }
      changes = { insertions, deletions };
    } catch {
      return null;
    }
    if (!changes) return null;
    if (changes.insertions === 0 && changes.deletions === 0) {
      return null;
    }
    const parts = [];
    if (changes.insertions > 0) parts.push(`+${changes.insertions}`);
    if (changes.deletions > 0) parts.push(`-${changes.deletions}`);
    return parts.join(",");
  }
  isEnabled() {
    return this.enabled;
  }
  async cleanup() {
  }
};

// src/validation/result.ts
function success(data) {
  return { success: true, data };
}
function failure(path, message, value) {
  return { success: false, error: { path, message, value } };
}
function formatError(error) {
  const path = error.path.length > 0 ? error.path.join(".") : "root";
  return `${path}: ${error.message}`;
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
      throw new StdinValidationError(
        `Validation failed: ${formatError(result.error)}`
      );
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
    if (stdin && stdin.trim().length > 0) {
      const fs = await import("node:fs");
      fs.appendFileSync("/tmp/claude-scope-debug.log", `[${(/* @__PURE__ */ new Date()).toISOString()}] Full stdin:
${stdin}

`);
    }
    if (!stdin || stdin.trim().length === 0) {
      const fallback = await tryGitFallback();
      return fallback;
    }
    const provider = new StdinProvider();
    const stdinData = await provider.parse(stdin);
    const registry = new WidgetRegistry();
    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitWidget());
    await registry.register(new GitChangesWidget());
    const renderer = new Renderer({
      separator: " \u2502 ",
      onError: (error, widget) => {
      },
      showErrors: false
    });
    for (const widget of registry.getAll()) {
      await widget.update(stdinData);
    }
    const output = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );
    return output || "";
  } catch (error) {
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
