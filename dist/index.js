#!/usr/bin/env node
/**
 * Claude Scope - Claude Code statusline plugin
 * Entry point
 */
import { WidgetRegistry } from './core/widget-registry.js';
import { Renderer } from './core/renderer.js';
import { GitWidget } from './widgets/git/git-widget.js';
import { ModelWidget } from './widgets/model-widget.js';
import { ContextWidget } from './widgets/context-widget.js';
import { CostWidget } from './widgets/cost-widget.js';
import { DurationWidget } from './widgets/duration-widget.js';
import { GitChangesWidget } from './widgets/git/git-changes-widget.js';
import { StdinProvider } from './data/stdin-provider.js';
/**
 * Read stdin as string
 */
async function readStdin() {
    const chunks = [];
    for await (const chunk of process.stdin) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}
/**
 * Main entry point
 */
export async function main() {
    try {
        // Read JSON from stdin
        const stdin = await readStdin();
        // Debug: log stdin to file for troubleshooting
        if (stdin && stdin.trim().length > 0) {
            const fs = await import('node:fs');
            fs.appendFileSync('/tmp/claude-scope-debug.log', `[${new Date().toISOString()}] Full stdin:\n${stdin}\n\n`);
        }
        // If stdin is empty, still try to show git info
        if (!stdin || stdin.trim().length === 0) {
            const fallback = await tryGitFallback();
            return fallback;
        }
        // Parse and validate with StdinProvider
        const provider = new StdinProvider();
        const stdinData = await provider.parse(stdin);
        // Create registry
        const registry = new WidgetRegistry();
        // Register all widgets (no constructor args needed)
        await registry.register(new ModelWidget());
        await registry.register(new ContextWidget());
        await registry.register(new CostWidget());
        await registry.register(new DurationWidget());
        await registry.register(new GitWidget());
        await registry.register(new GitChangesWidget());
        // Create renderer with error handling configuration
        const renderer = new Renderer({
            separator: ' │ ',
            onError: (error, widget) => {
                // Silently ignore widget errors - they return null
            },
            showErrors: false
        });
        // Update all widgets with data
        for (const widget of registry.getAll()) {
            await widget.update(stdinData);
        }
        // Render
        const output = await renderer.render(registry.getEnabledWidgets(), { width: 80, timestamp: Date.now() });
        return output || '';
    }
    catch (error) {
        // Try to show at least git info on error
        const fallback = await tryGitFallback();
        return fallback;
    }
}
/**
 * Fallback: try to show at least git info when stdin parsing fails
 */
async function tryGitFallback() {
    try {
        const cwd = process.cwd();
        const widget = new GitWidget();
        await widget.initialize({ config: {} });
        await widget.update({ cwd, session_id: 'fallback' });
        const result = await widget.render({ width: 80, timestamp: Date.now() });
        return result || '';
    }
    catch {
        return '';
    }
}
// Run when executed (works with both direct node and npx)
main().then((output) => {
    if (output) {
        console.log(output);
    }
}).catch(() => {
    // Silently fail - return empty status line
    process.exit(0);
});
//# sourceMappingURL=index.js.map