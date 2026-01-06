/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it has different lifecycle requirements:
 * - Uses simple-git directly for git operations
 * - Maintains internal state (currentCwd) for change detection
 * - Needs to reinitialize git instance when cwd changes
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { IWidget, WidgetContext, RenderContext, StdinData } from '#core/types.js';
import { createWidgetMetadata } from '#core/widget-types.js';

/**
 * Widget displaying git branch information
 */
export class GitWidget implements IWidget {
  readonly id = 'git';
  readonly metadata = createWidgetMetadata(
    'Git Widget',
    'Displays current git branch'
  );

  private git: SimpleGit;
  private enabled = true;
  private cwd: string | null = null;

  constructor() {
    this.git = simpleGit();
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.cwd) {
      return null;
    }

    try {
      const status = await this.git.status();
      const branch = status.current || null;

      if (!branch) {
        return null;
      }

      return ` ${branch}`;
    } catch (error) {
      // Log specific error for debugging but return null (graceful degradation)
      console.debug(`[GitWidget] Failed to get status: ${(error as Error).message}`);
      return null;
    }
  }

  async update(data: StdinData): Promise<void> {
    // Re-initialize git if cwd changed
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = simpleGit(data.cwd);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // simple-git doesn't need cleanup
  }
}
