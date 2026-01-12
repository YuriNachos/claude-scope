/**
 * Docker Widget
 *
 * Displays Docker container count and status
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

import type { StyleRendererFn, WidgetStyle } from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IThemeColors } from "../../ui/theme/types.js";
import { dockerStyles } from "./styles.js";
import type { DockerRenderData, DockerStatus } from "./types.js";

export class DockerWidget implements IWidget {
  readonly id = "docker";
  readonly metadata = createWidgetMetadata(
    "Docker",
    "Shows Docker container count and status",
    "1.0.0",
    "claude-scope",
    0
  );

  private enabled = true;
  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<DockerRenderData, unknown> = dockerStyles.balanced!;
  private cachedStatus: DockerStatus | null = null;
  private lastCheck = 0;
  private readonly CACHE_TTL = 5000;

  constructor(colors?: IThemeColors) {
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = dockerStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async update(_data: StdinData): Promise<void> {
    // DockerWidget does not use stdin data
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // No resources to clean up
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }

    const now = Date.now();
    if (this.cachedStatus && now - this.lastCheck < this.CACHE_TTL) {
      return this.styleFn({ status: this.cachedStatus }, this.colors);
    }

    const status = await this.getDockerStatus();
    this.cachedStatus = status;
    this.lastCheck = now;

    if (!status.isAvailable) {
      return null;
    }

    return this.styleFn({ status }, this.colors);
  }

  protected async getDockerStatus(): Promise<DockerStatus> {
    try {
      // Check if Docker daemon is available
      await execFileAsync("docker", ["info"], { timeout: 2000 });

      // Get running container count
      const { stdout: runningOutput } = await execFileAsync("docker", ["ps", "-q"], {
        timeout: 1000,
      });
      const running = runningOutput
        .trim()
        .split("\n")
        .filter((line) => line).length;

      // Get total container count
      const { stdout: allOutput } = await execFileAsync("docker", ["ps", "-aq"], {
        timeout: 1000,
      });
      const total = allOutput
        .trim()
        .split("\n")
        .filter((line) => line).length;

      return { running, total, isAvailable: true };
    } catch {
      return { running: 0, total: 0, isAvailable: false };
    }
  }
}
