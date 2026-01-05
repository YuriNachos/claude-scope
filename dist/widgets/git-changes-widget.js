/**
 * Git Changes Widget
 *
 * Displays git diff statistics
 */
import { StdinDataWidget } from '../core/stdin-data-widget.js';
import { createWidgetMetadata } from '../core/widget-types.js';
export class GitChangesWidget extends StdinDataWidget {
    gitProvider;
    id = 'git-changes';
    metadata = createWidgetMetadata('Git Changes', 'Displays git diff statistics');
    constructor(gitProvider) {
        super();
        this.gitProvider = gitProvider;
    }
    async render(context) {
        let changes;
        try {
            changes = await this.gitProvider.diffStats();
        }
        catch {
            return null;
        }
        if (!changes)
            return null;
        if (changes.insertions === 0 && changes.deletions === 0) {
            return null;
        }
        const parts = [];
        if (changes.insertions > 0)
            parts.push(`+${changes.insertions}`);
        if (changes.deletions > 0)
            parts.push(`-${changes.deletions}`);
        return parts.join(',');
    }
}
//# sourceMappingURL=git-changes-widget.js.map