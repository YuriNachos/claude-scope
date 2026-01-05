/**
 * Git Changes Widget
 *
 * Displays git diff statistics
 */

import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
import type { IGit } from '../providers/git-provider.js';
import type { RenderContext } from '../core/types.js';

export class GitChangesWidget extends StdinDataWidget {
  readonly id = 'git-changes';
  readonly metadata = createWidgetMetadata(
    'Git Changes',
    'Displays git diff statistics'
  );

  constructor(private gitProvider: IGit) {
    super();
  }

  async render(context: RenderContext): Promise<string | null> {
    let changes;
    try {
      changes = await this.gitProvider.diffStats();
    } catch {
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
