/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it requires async git operations that don't fit the Template Method Pattern.
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import type { IWidget, WidgetContext, RenderContext, StdinData } from '#core/types.js';
import { createWidgetMetadata } from '#core/widget-types.js';

export class GitChangesWidget implements IWidget {
  readonly id = 'git-changes';
  readonly metadata = createWidgetMetadata(
    'Git Changes',
    'Displays git diff statistics'
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

  async update(data: StdinData): Promise<void> {
    // Re-initialize git if cwd changed
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = simpleGit(data.cwd);
    }
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.cwd) {
      return null;
    }

    let changes;
    try {
      const summary = await this.git.diffSummary(['--shortstat']);

      let insertions = 0;
      let deletions = 0;

      if (summary.files && summary.files.length > 0) {
        for (const file of summary.files) {
          if ('insertions' in file && typeof file.insertions === 'number') {
            insertions += file.insertions;
          }
          if ('deletions' in file && typeof file.deletions === 'number') {
            deletions += file.deletions;
          }
        }
      }

      if (insertions === 0 && deletions === 0) {
        return null;
      }

      changes = { insertions, deletions };
    } catch (error) {
      // Log specific error for debugging but return null (graceful degradation)
      console.debug(`[GitChangesWidget] Failed to get diff stats: ${(error as Error).message}`);
      return null;
    }

    if (!changes) return null;

    if (changes.insertions === 0 && changes.deletions === 0) {
      return null;
    }

    const parts: string[] = [];
    if (changes.insertions > 0) parts.push(`+${changes.insertions}`);
    if (changes.deletions > 0) parts.push(`-${changes.deletions}`);

    return parts.join(',');
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // simple-git doesn't need cleanup
  }
}
