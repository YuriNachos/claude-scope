/**
 * Git status widget
 * Displays current git branch
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
import { gitStyles } from "./styles.js";
import type { GitRenderData } from "./types.js";

/**
 * Widget displaying git branch information
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitWidget implements IWidget {
  readonly id = "git";
  readonly metadata = createWidgetMetadata(
    "Git Widget",
    "Displays current git branch",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private gitFactory: (cwd: string) => IGit;
  private git: IGit | null = null;
  private enabled = true;
  private cwd: string | null = null;
  private colors: IThemeColors;
  private styleFn: StyleRendererFn<GitRenderData, IGitColors> = gitStyles.balanced!;

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
    const fn = gitStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async render(_context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.git || !this.cwd) {
      return null;
    }

    try {
      const status = await this.git.status();
      const branch = status.current || null;

      if (!branch) {
        return null;
      }

      // Get git changes if available
      let changes: { files: number; insertions: number; deletions: number } | undefined;
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
        // Diff may fail, continue without changes
      }

      const renderData: GitRenderData = { branch, changes };
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
