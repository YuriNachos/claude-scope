/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */

import type { IWidget, WidgetContext, RenderContext, StdinData } from '../../core/types.js';
import { createWidgetMetadata } from '../../core/widget-types.js';
import type { IGit } from '../../providers/git-provider.js';
import { createGit } from '../../providers/git-provider.js';

/**
 * Widget displaying git branch information
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitWidget implements IWidget {
  readonly id = 'git';
  readonly metadata = createWidgetMetadata(
    'Git Widget',
    'Displays current git branch'
  );

  private gitFactory: (cwd: string) => IGit;
  private git: IGit | null = null;
  private enabled = true;
  private cwd: string | null = null;

  /**
   * @param gitFactory - Optional factory function for creating IGit instances
   *                     If not provided, uses default createGit (production)
   *                     Tests can inject MockGit factory here
   */
  constructor(gitFactory?: (cwd: string) => IGit) {
    this.gitFactory = gitFactory || createGit;
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async render(context: RenderContext): Promise<string | null> {
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
