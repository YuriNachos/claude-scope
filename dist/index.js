#!/usr/bin/env node
/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */
import { WidgetRegistry } from './core/widget-registry.js';
import { Renderer } from './core/renderer.js';
import { GitWidget } from './widgets/git-widget.js';
import { simpleGit } from 'simple-git';
/**
 * Main entry point
 */
export async function main() {
    // Initialize git
    const git = simpleGit();
    // Create registry
    const registry = new WidgetRegistry();
    // Create and register git widget
    const gitWidget = new GitWidget({ git });
    await registry.register(gitWidget);
    // Create renderer
    const renderer = new Renderer();
    // Render output
    const cwd = process.cwd();
    await gitWidget.update({
        session_id: 'dev-session',
        cwd,
        model: { id: 'dev', display_name: 'Development' }
    });
    const output = await renderer.render(registry.getEnabledWidgets(), { width: 80, timestamp: Date.now() });
    return output;
}
// Run when executed (works with both direct node and npx)
main().then(console.log).catch(console.error);
//# sourceMappingURL=index.js.map