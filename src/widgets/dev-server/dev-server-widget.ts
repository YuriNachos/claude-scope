/**
 * Dev Server Widget
 *
 * Detects running development server processes (Vite, Nuxt, Next.js, etc.)
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

import type { StyleRendererFn, WidgetStyle } from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IDevServerColors, IThemeColors } from "../../ui/theme/types.js";
import { devServerStyles } from "./styles.js";
import type { DevServerRenderData, ProcessPattern } from "./types.js";

/**
 * Dev Server Widget
 *
 * Detects running development server processes by parsing system process list.
 * Supports Vite, Nuxt, Next.js, Svelte, Astro, Remix, and generic npm/yarn/pnpm/bun dev/build commands.
 */
export class DevServerWidget implements IWidget {
  readonly id = "dev-server";
  readonly metadata = createWidgetMetadata(
    "Dev Server",
    "Detects running dev server processes",
    "1.0.0",
    "claude-scope",
    0
  );

  private enabled = true;
  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<DevServerRenderData, IDevServerColors> =
    devServerStyles.balanced!;
  private cwd: string | null = null;

  private readonly processPatterns: ProcessPattern[] = [
    // Generic server patterns - more specific to avoid shell history false positives
    { regex: /^[\w\s]+\/npm\s+(exec|run)\s+serve/i, name: "Server", icon: "🌐" },
    { regex: /^[\w\s]+\/npx\s+serve\s+-/i, name: "Server", icon: "🌐" },
    { regex: /^[\w\s]+\/(python|python3)\s+-m\s+http\.server/i, name: "HTTP", icon: "🌐" },
    // Generic dev/build patterns - require full command path
    { regex: /^[\w\s]+\/(npm|yarn|pnpm|bun)\s+run\s+dev\s*$/i, name: "Dev", icon: "🚀" },
    { regex: /^[\w\s]+\/(npm|yarn|pnpm|bun)\s+run\s+build\s*$/i, name: "Build", icon: "🔨" },
    // Framework-specific patterns - require executable path
    { regex: /\/(nuxt|next|astro|remix|svelte)\s+dev/i, name: "Framework", icon: "⚡" },
    { regex: /\/node.*\/vite\s*$/i, name: "Vite", icon: "⚡" },
    // Fallback: simpler patterns but checked last
    { regex: /\s(nuxt|next|vite)\s+dev\s/i, name: "DevServer", icon: "⚡" },
  ];

  constructor(colors?: IThemeColors) {
    this.colors = colors ?? DEFAULT_THEME;
  }

  /**
   * Set display style
   * @param style - Style to use for rendering
   */
  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = devServerStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  /**
   * Set display line override
   * @param line - Line number (0-indexed)
   */
  setLine(line: number): void {
    this._lineOverride = line;
  }

  /**
   * Get display line
   * @returns Line number (0-indexed)
   */
  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  /**
   * Initialize widget with context
   * @param context - Widget initialization context
   */
  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  /**
   * Update widget with new stdin data
   * @param data - Stdin data from Claude Code
   */
  async update(data: StdinData): Promise<void> {
    this.cwd = data.cwd;
  }

  /**
   * Check if widget is enabled
   * @returns true if widget should render
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // No resources to clean up
  }

  /**
   * Render widget output
   * @param context - Render context
   * @returns Rendered string, or null if no dev server detected
   */
  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.cwd) {
      return null;
    }

    const server = await this.detectDevServer();
    if (!server) {
      return null;
    }

    const renderData: DevServerRenderData = { server };
    return this.styleFn(renderData, this.colors.devServer);
  }

  /**
   * Detect running dev server by parsing system process list
   * @returns Detected server status or null
   */
  private async detectDevServer(): Promise<{
    name: string;
    icon: string;
    isRunning: boolean;
    isBuilding: boolean;
  } | null> {
    try {
      const { stdout } = await execFileAsync("ps", ["aux"], {
        timeout: 1000,
      });

      for (const pattern of this.processPatterns) {
        if (pattern.regex.test(stdout)) {
          // Determine status based on pattern name
          const isBuilding = pattern.name.toLowerCase().includes("build");
          const isRunning = !isBuilding; // If not building, it's running

          return {
            name: pattern.name,
            icon: pattern.icon,
            isRunning,
            isBuilding,
          };
        }
      }
    } catch {
      // Process detection failed, return null
    }
    return null;
  }
}
