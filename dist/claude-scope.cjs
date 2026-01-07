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
      lineMap.get(line).push(widget);
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
  async latestTag() {
    try {
      const { stdout } = await execFileAsync(
        "git",
        ["describe", "--tags", "--abbrev=0"],
        {
          cwd: this.cwd
        }
      );
      return stdout.trim();
    } catch {
      return null;
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

// src/ui/utils/colors.ts
var reset = "\x1B[0m";
var red = "\x1B[31m";
var green = "\x1B[32m";
var gray = "\x1B[90m";
var lightGray = "\x1B[37m";
var bold = "\x1B[1m";

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
  latestTag = null;
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
      this.latestTag = await (this.git.latestTag?.() ?? Promise.resolve(null));
      if (!this.latestTag) {
        return `${gray}Tag:${reset} no tag`;
      }
      const tagValue = `${green}${this.latestTag}${reset}`;
      return `${gray}Tag:${reset} ${tagValue}`;
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
    "Displays the current Claude model name",
    "1.0.0",
    "claude-scope",
    0
    // First line
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
function colorize(text, color) {
  return `${color}${text}${ANSI_COLORS.RESET}`;
}

// src/ui/theme/default-theme.ts
var DEFAULT_THEME = {
  context: {
    low: gray,
    medium: gray,
    high: gray
  },
  lines: {
    added: gray,
    removed: gray
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.context;
  }
  renderWithData(data, context) {
    const { current_usage, context_window_size } = data.context_window;
    if (!current_usage) return null;
    const used = current_usage.input_tokens + current_usage.cache_creation_input_tokens + current_usage.cache_read_input_tokens + current_usage.output_tokens;
    const percent = Math.round(used / context_window_size * 100);
    const bar = progressBar(percent, DEFAULTS.PROGRESS_BAR_WIDTH);
    const color = this.getContextColor(percent);
    return colorize(`[${bar}] ${percent}%`, color);
  }
  getContextColor(percent) {
    const clampedPercent = Math.max(0, Math.min(100, percent));
    if (clampedPercent < 50) {
      return this.colors.low;
    } else if (clampedPercent < 80) {
      return this.colors.medium;
    } else {
      return this.colors.high;
    }
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
  renderWithData(data, context) {
    if (!data.cost || data.cost.total_cost_usd === void 0) return null;
    return formatCostUSD(data.cost.total_cost_usd);
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
  constructor(colors) {
    super();
    this.colors = colors ?? DEFAULT_THEME.lines;
  }
  renderWithData(data, context) {
    const added = data.cost?.total_lines_added ?? 0;
    const removed = data.cost?.total_lines_removed ?? 0;
    const addedStr = colorize(`+${added}`, this.colors.added);
    const removedStr = colorize(`-${removed}`, this.colors.removed);
    return `${addedStr}/${removedStr}`;
  }
};

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
    "Displays git diff statistics",
    "1.0.0",
    "claude-scope",
    0
    // First line
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

// src/providers/config-provider.ts
var fs = __toESM(require("fs/promises"), 1);
var path = __toESM(require("path"), 1);
var os = __toESM(require("os"), 1);
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
  async render(context) {
    if (!this.configs) {
      return null;
    }
    const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
    const parts = [];
    if (claudeMdCount > 0) {
      parts.push(`\u{1F4C4} ${claudeMdCount} CLAUDE.md`);
    }
    if (rulesCount > 0) {
      parts.push(`\u{1F4DC} ${rulesCount} rules`);
    }
    if (mcpCount > 0) {
      parts.push(`\u{1F50C} ${mcpCount} MCPs`);
    }
    if (hooksCount > 0) {
      parts.push(`\u{1FA9D} ${hooksCount} hooks`);
    }
    return parts.join(" \u2502 ") || null;
  }
  async cleanup() {
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
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
  };
  return values[rank];
}
function formatCard(card) {
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
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
    cardIndicesByRank.get(value).push(i);
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
        indices.push(cardIndicesByRank.get(next4)[0]);
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
  const suitCards = cards.filter((c) => c.suit === suit);
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
      return { rank: 10 /* RoyalFlush */, ...HAND_DISPLAY[10 /* RoyalFlush */], participatingCards };
    }
  }
  if (flush) {
    const flushSuit = findFlushSuit(allCards);
    const sfHighCard = getStraightFlushHighCard(allCards, flushSuit);
    if (sfHighCard !== null) {
      const participatingCards = getStraightFlushIndices(allCards, sfHighCard, flushSuit);
      return { rank: 9 /* StraightFlush */, ...HAND_DISPLAY[9 /* StraightFlush */], participatingCards };
    }
  }
  if (maxCount === 4) {
    const rank = getMostCommonRank(allCards);
    const participatingCards = findCardsOfRank(allCards, rank);
    return { rank: 8 /* FourOfAKind */, ...HAND_DISPLAY[8 /* FourOfAKind */], participatingCards };
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
    return { rank: 4 /* ThreeOfAKind */, ...HAND_DISPLAY[4 /* ThreeOfAKind */], participatingCards };
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
  return { rank: 1 /* HighCard */, ...HAND_DISPLAY[1 /* HighCard */], participatingCards: [highestIdx] };
}

// src/widgets/poker-widget.ts
var PokerWidget = class extends StdinDataWidget {
  id = "poker";
  metadata = createWidgetMetadata(
    "Poker",
    "Displays random Texas Hold'em hands for entertainment",
    "1.0.0",
    "claude-scope",
    2
    // Third line (0-indexed)
  );
  holeCards = [];
  boardCards = [];
  handResult = null;
  lastUpdateTimestamp = 0;
  THROTTLE_MS = 5e3;
  // 5 seconds
  constructor() {
    super();
  }
  /**
   * Generate new poker hand on each update
   */
  async update(data) {
    await super.update(data);
    const now = Date.now();
    if (now - this.lastUpdateTimestamp < this.THROTTLE_MS) {
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
    const color = isRedSuit(card.suit) ? red : gray;
    return colorize(`[${formatCard(card)}]`, color);
  }
  /**
   * Format card based on participation in best hand
   * Participating cards: (K♠) with color + BOLD
   * Non-participating cards: K♠ with color, no brackets
   */
  formatCardByParticipation(cardData, isParticipating) {
    const color = isRedSuit(cardData.card.suit) ? red : gray;
    const cardText = formatCard(cardData.card);
    if (isParticipating) {
      return `${color}${bold}(${cardText})${reset} `;
    } else {
      return `${color}${cardText}${reset} `;
    }
  }
  renderWithData(_data, _context) {
    const participatingSet = new Set(this.handResult?.participatingIndices || []);
    const handStr = this.holeCards.map((hc, idx) => this.formatCardByParticipation(hc, participatingSet.has(idx))).join("");
    const boardStr = this.boardCards.map((bc, idx) => this.formatCardByParticipation(bc, participatingSet.has(idx + 2))).join("");
    const handLabel = colorize("Hand:", lightGray);
    const boardLabel = colorize("Board:", lightGray);
    return `${handLabel} ${handStr} | ${boardLabel} ${boardStr} \u2192 ${this.handResult?.text}`;
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
    3
    // Fourth line (0-indexed)
  );
  /**
   * Return Braille Pattern Blank to create a visible empty separator line.
   * U+2800 occupies cell width but appears blank, ensuring the line renders.
   */
  renderWithData(_data, _context) {
    return "\u2800";
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
    await registry.register(new LinesWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitWidget());
    await registry.register(new GitTagWidget());
    await registry.register(new GitChangesWidget());
    await registry.register(new ConfigCountWidget());
    await registry.register(new PokerWidget());
    await registry.register(new EmptyLineWidget());
    const renderer = new Renderer({
      separator: " \u2502 ",
      onError: (error, widget) => {
      },
      showErrors: false
    });
    for (const widget of registry.getAll()) {
      await widget.update(stdinData);
    }
    const lines = await renderer.render(
      registry.getEnabledWidgets(),
      { width: 80, timestamp: Date.now() }
    );
    return lines.join("\n");
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
