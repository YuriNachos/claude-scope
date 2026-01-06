/**
 * Git status widget
 * Displays current git branch
 *
 * NOTE: This widget implements IWidget directly (not extending StdinDataWidget)
 * because it has different lifecycle requirements:
 * - Uses GitProvider instead of transforming StdinData directly
 * - Maintains internal state (currentCwd) for change detection
 * - Needs to reinitialize GitProvider when cwd changes
 */

import type { IWidget, WidgetContext, RenderContext, StdinData } from '../core/types.js';
import type { GitProviderDeps } from '../providers/git-provider.js';
import { GitProvider } from '../providers/git-provider.js';
import { createWidgetMetadata } from '../core/widget-types.js';

/**
 * Git widget dependencies
 */
export interface GitWidgetDeps {
  git: GitProviderDeps['git'];
}

/**
 * Widget displaying git branch information
 */
export class GitWidget implements IWidget {
  readonly id = 'git';
  readonly metadata = createWidgetMetadata(
    'Git Widget',
    'Displays current git branch'
  );

  private gitProvider: GitProvider;
  private enabled = true;
  private currentCwd = '';

  constructor(deps: GitWidgetDeps) {
    this.gitProvider = new GitProvider({ git: deps.git });
  }

  async initialize(context: WidgetContext): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.gitProvider.isRepo()) {
      return null;
    }

    const branch = await this.gitProvider.getBranch();
    if (!branch) {
      return null;
    }

    return ` ${branch}`;
  }

  async update(data: StdinData): Promise<void> {
    if (data.cwd !== this.currentCwd) {
      this.currentCwd = data.cwd;
      await this.gitProvider.init(data.cwd);
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // No resources to clean up
  }
}
