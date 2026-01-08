/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */

import type { IWidget, WidgetContext, RenderContext, StdinData } from "../../core/types.js";
import type { StyleRendererFn } from "../../core/style-types.js";
import { createWidgetMetadata } from "../../core/widget-types.js";
import type { IGit } from "../../providers/git-provider.js";
import { createGit } from "../../providers/git-provider.js";
import { createStyleSetter } from "../../utils/create-style-setter.js";
import { gitChangesStyles } from "../git-changes/styles.js";
import type { GitChangesRenderData } from "../git-changes/types.js";

/**
 * Widget displaying git diff statistics
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitChangesWidget implements IWidget {
  readonly id = "git-changes";
  readonly metadata = createWidgetMetadata(
    "Git Changes",
    "Displays git diff statistics",
    "1.0.0",
    "claude-scope",
    0 // First line
  );

  private gitFactory: (cwd: string) => IGit;
  private git: IGit | null = null;
  private enabled = true;
  private cwd: string | null = null;
  private styleFn: StyleRendererFn<GitChangesRenderData> = gitChangesStyles.balanced!;

  /**
   * @param gitFactory - Optional factory function for creating IGit instances
   *                     If not provided, uses default createGit (production)
   *                     Tests can inject MockGit factory here
   */
  constructor(gitFactory?: (cwd: string) => IGit) {
    this.gitFactory = gitFactory || createGit;
  }

  setStyle = createStyleSetter(gitChangesStyles, { value: this.styleFn });

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async update(data: StdinData): Promise<void> {
    // Re-initialize git if cwd changed
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = this.gitFactory(data.cwd);
    }
  }

  async render(context: RenderContext): Promise<string | null> {
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
      // Log specific error for debugging but return null (graceful degradation)
      return null;
    }

    if (!changes) return null;

    if (changes.insertions === 0 && changes.deletions === 0) {
      return null;
    }

    const renderData: GitChangesRenderData = changes;
    return this.styleFn(renderData);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // No cleanup needed for native git implementation
  }
}
