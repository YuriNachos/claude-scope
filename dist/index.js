#!/usr/bin/env node
/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */
import { WidgetRegistry } from './core/widget-registry.js';
import { Renderer } from './core/renderer.js';
import { GitWidget } from './widgets/git-widget.js';
import { ModelWidget } from './widgets/model-widget.js';
import { ContextWidget } from './widgets/context-widget.js';
import { CostWidget } from './widgets/cost-widget.js';
import { DurationWidget } from './widgets/duration-widget.js';
import { GitChangesWidget } from './widgets/git-changes-widget.js';
import { simpleGit } from 'simple-git';
/**
 * Adapter to wrap simple-git with our IGit interface
 */
class SimpleGitAdapter {
    git;
    constructor(git) {
        this.git = git;
    }
    async checkIsRepo() {
        try {
            await this.git.status();
            return true;
        }
        catch {
            return false;
        }
    }
    async branch() {
        const branches = await this.git.branch();
        return {
            current: branches.current || null,
            all: branches.all
        };
    }
    async diffStats() {
        try {
            const summary = await this.git.diffSummary(['--shortstat']);
            // Parse the summary object
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
            return { insertions, deletions };
        }
        catch {
            return null;
        }
    }
}
/**
 * Create mock StdinData for development/testing
 */
function createMockStdinData() {
    return {
        hook_event_name: 'Status',
        session_id: 'dev-session',
        transcript_path: '/tmp/transcript.json',
        cwd: process.cwd(),
        model: {
            id: 'claude-opus-4-1',
            display_name: 'Opus 4.5'
        },
        workspace: {
            current_dir: process.cwd(),
            project_dir: process.cwd()
        },
        version: '1.0.80',
        output_style: {
            name: 'default'
        },
        cost: {
            total_cost_usd: 0.0123,
            total_duration_ms: 330000,
            total_api_duration_ms: 15000,
            total_lines_added: 42,
            total_lines_removed: 10
        },
        context_window: {
            total_input_tokens: 15234,
            total_output_tokens: 4521,
            context_window_size: 200000,
            current_usage: {
                input_tokens: 8500,
                output_tokens: 1200,
                cache_creation_input_tokens: 5000,
                cache_read_input_tokens: 2000
            }
        }
    };
}
/**
 * Main entry point
 */
export async function main() {
    // Initialize git adapter
    const git = simpleGit();
    const gitAdapter = new SimpleGitAdapter(git);
    // Create registry
    const registry = new WidgetRegistry();
    // Register all widgets
    await registry.register(new ModelWidget());
    await registry.register(new ContextWidget());
    await registry.register(new CostWidget());
    await registry.register(new DurationWidget());
    await registry.register(new GitWidget({ git: gitAdapter }));
    await registry.register(new GitChangesWidget(gitAdapter));
    // Create renderer with pipe separator
    const renderer = new Renderer();
    renderer.setSeparator(' │ ');
    // Create mock data for dev (in real usage, comes from stdin)
    const mockData = createMockStdinData();
    // Update all widgets with data
    for (const widget of registry.getAll()) {
        await widget.update(mockData);
    }
    // Render
    const output = await renderer.render(registry.getEnabledWidgets(), { width: 80, timestamp: Date.now() });
    return output;
}
// Run when executed (works with both direct node and npx)
main().then(console.log).catch(console.error);
//# sourceMappingURL=index.js.map