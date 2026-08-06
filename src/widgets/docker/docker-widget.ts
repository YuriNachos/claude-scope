/**
 * Docker Widget
 *
 * Displays Docker container count and status
 */

import { EXEC_CACHE_TTL, EXEC_TIMEOUTS } from "../../constants.js";
import {
  DEFAULT_WIDGET_STYLE,
  type StyleRendererFn,
  type WidgetStyle,
} from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IDockerColors, IThemeColors } from "../../ui/theme/types.js";
import { type ExecFileFn, runCommand } from "../../utils/exec.js";
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
  private styleFn: StyleRendererFn<DockerRenderData, IDockerColors> = dockerStyles.balanced!;
  private cachedStatus: DockerStatus | null = null;
  private lastCheck = 0;
  private execFn?: ExecFileFn;

  /**
   * @param colors - Theme colors, defaults to Monokai
   * @param execFn - Optional exec function for testing (dependency injection)
   */
  constructor(colors?: IThemeColors, execFn?: ExecFileFn) {
    this.colors = colors ?? DEFAULT_THEME;
    this.execFn = execFn;
  }

  setStyle(style: WidgetStyle = DEFAULT_WIDGET_STYLE): void {
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

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled) {
      return null;
    }

    const now = Date.now();
    if (this.cachedStatus && now - this.lastCheck < this.getCacheTtl(this.cachedStatus)) {
      return this.cachedStatus.isAvailable
        ? this.styleFn({ status: this.cachedStatus }, this.colors.docker)
        : null;
    }

    const status = await this.getDockerStatus();
    this.cachedStatus = status;
    this.lastCheck = now;

    if (!status.isAvailable) {
      return null;
    }

    return this.styleFn({ status }, this.colors.docker);
  }

  /**
   * How long the current status may be reused
   *
   * A missing or stopped daemon is cached far longer: without Docker installed
   * every render would otherwise spawn a process that is guaranteed to fail.
   */
  private getCacheTtl(status: DockerStatus): number {
    return status.isAvailable ? EXEC_CACHE_TTL.DOCKER_MS : EXEC_CACHE_TTL.DOCKER_UNAVAILABLE_MS;
  }

  /**
   * Query container counts with a single `docker ps` call
   *
   * Listing all containers with their state covers daemon availability, the
   * running count and the total count at once - a failure to reach the daemon
   * surfaces as a failed command.
   */
  protected async getDockerStatus(): Promise<DockerStatus> {
    const stdout = await runCommand(
      "docker",
      ["ps", "-a", "--format", "{{.State}}"],
      { timeout: EXEC_TIMEOUTS.DOCKER_MS },
      this.execFn
    );

    if (stdout === null) {
      // Docker missing, daemon unreachable, or the command timed out
      return { running: 0, total: 0, isAvailable: false };
    }

    const states = stdout.split("\n").filter((line) => line.trim());
    const running = states.filter((state) => state.trim() === "running").length;

    return { running, total: states.length, isAvailable: true };
  }
}
