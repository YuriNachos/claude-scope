/**
 * Git Tag Widget
 * Displays the latest git tag
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations with custom lifecycle management.
 */

import type { IWidget, WidgetContext, RenderContext, StdinData } from '../../core/types.js';
import { createWidgetMetadata } from '../../core/widget-types.js';
import type { IGit } from '../../providers/git-provider.js';
import { createGit } from '../../providers/git-provider.js';
import { green, gray, reset } from '../../ui/utils/colors.js';

/**
 * Widget displaying the latest git tag
 *
 * Uses Dependency Injection for IGit to enable:
 * - Easy testing with MockGit
 * - No tight coupling to git implementation
 * - Clean separation of concerns
 */
export class GitTagWidget implements IWidget {
  readonly id = 'git-tag';
  readonly metadata = createWidgetMetadata(
    'Git Tag Widget',
    'Displays the latest git tag',
    '1.0.0',
    'claude-scope',
    1  // Second line
  );

  private gitFactory: (cwd: string) => IGit;
  private git: IGit | null = null;
  private enabled = true;
  private cwd: string | null = null;
  private latestTag: string | null = null;

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
      // Fetch the latest tag
      this.latestTag = await (this.git.latestTag?.() ?? Promise.resolve(null));

      if (!this.latestTag) {
        return `${gray}Tag:${reset} no tag`;
      }

      const tagValue = `${green}${this.latestTag}${reset}`;
      return `${gray}Tag:${reset} ${tagValue}`;
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
