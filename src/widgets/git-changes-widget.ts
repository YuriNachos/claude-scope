/**
 * Git Changes Widget
 *
 * Displays git diff statistics (insertions/deletions)
 *
 * Uses simple-git directly for git operations.
 */

import { simpleGit, type SimpleGit } from 'simple-git';
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { RenderContext } from '../core/types.js';

export class GitChangesWidget extends StdinDataWidget {
  readonly id = 'git-changes';
  readonly metadata = createWidgetMetadata(
    'Git Changes',
    'Displays git diff statistics'
  );

  private git: SimpleGit;
  private cwd: string | null = null;

  constructor() {
    super();
    this.git = simpleGit();
  }

  override async update(data: import('../types.js').StdinData): Promise<void> {
    // Re-initialize git if cwd changed
    if (data.cwd !== this.cwd) {
      this.cwd = data.cwd;
      this.git = simpleGit(data.cwd);
    }
    // Update parent with data
    await super.update(data);
  }

  async render(context: RenderContext): Promise<string | null> {
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
}
