/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */

import type { StyleRendererFn, WidgetStyle } from "../../core/style-types.js";
import type { IWidget, RenderContext, StdinData, WidgetContext } from "../../core/types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import type { IGit } from "../../providers/git-provider.js";
import { createGit } from "../../providers/git-provider.js";
import { DEFAULT_THEME } from "../../ui/theme/index.js";
import type { IGitColors, IThemeColors } from "../../ui/theme/types.js";
import { gitTagStyles } from "../git-tag/styles.js";
import type { GitTagRenderData } from "../git-tag/types.js";

/**
 * Widget displaying the latest git tag
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitTagWidget implements IWidget {
  readonly id = "git-tag";
  readonly metadata = createWidgetMetadata(
    "Git Tag Widget",
    "Displays the latest git tag",
    "1.0.0",
    "claude-scope",
    1 // Second line
  );

  private gitFactory: (cwd: string) => IGit;
  private git: IGit | null = null;
  private enabled = true;
  private cwd: string | null = null;
  private colors: IThemeColors;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<GitTagRenderData, IGitColors> = gitTagStyles.balanced!;

  /**
   * @param gitFactory - Optional factory function for creating IGit instances
   *                     If not provided, uses default createGit (production)
   *                     Tests can inject MockGit factory here
   * @param colors - Optional theme colors
   */
  constructor(gitFactory?: (cwd: string) => IGit, colors?: IThemeColors) {
    this.gitFactory = gitFactory || createGit;
    this.colors = colors ?? DEFAULT_THEME;
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = gitTagStyles[style];
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

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.git || !this.cwd) {
      return null;
    }

    try {
      // Fetch the latest tag
      const latestTag = await (this.git.latestTag?.() ?? Promise.resolve(null));

      const renderData: GitTagRenderData = { tag: latestTag };
      return this.styleFn(renderData, this.colors.git);
    } catch {
      // Log specific error for debugging but return null (graceful degradation)
      return null;
    }
  }

  async update(data: StdinData): Promise<void> {
    // Re-initialize git if cwd changed
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = this.gitFactory(data.cwd);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // No cleanup needed for native git implementation
  }
}
