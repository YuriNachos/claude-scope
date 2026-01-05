/**
 * Git status widget
 * Displays current git branch
 */

import type { IWidget, IWidgetMetadata, WidgetContext, RenderContext, StdinData } from '../core/types.js';
import type { GitProviderDeps } from '../providers/git-provider.js';
import { GitProvider } from '../providers/git-provider.js';

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

  readonly metadata: IWidgetMetadata = {
    name: 'Git Widget',
    description: 'Displays current git branch',
    version: '1.0.0',
    author: 'claude-scope'
  };

  private gitProvider: GitProvider;
  private enabled = true;
  private currentCwd = '';

  constructor(deps: GitWidgetDeps) {
    this.gitProvider = new GitProvider({ git: deps.git });
  }

  async initialize(context: WidgetContext): Promise<void> {
    // Initialize with config if needed
    this.enabled = (context.config.enabled as boolean | undefined) !== false;
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.enabled || !this.gitProvider.isRepo()) {
      return null;
    }

    const branch = await this.gitProvider.getBranch();
    if (!branch) {
      return null;
    }

    // Simple format:  branch-name
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
