/**
 * Demo data for live preview
 * Realistic StdinData for rendering widget previews
 */
/**
 * Generate demo StdinData with realistic values
 */
export function createDemoData() {
    return {
        hook_event_name: "Status",
        session_id: "demo_session_20250111",
        transcript_path: "/Users/demo/.claude/projects/-Users-demo-claude-scope/session.jsonl",
        cwd: "/Users/demo/claude-scope",
        model: {
            id: "claude-opus-4-5-20251101",
            display_name: "Claude Opus 4.5",
        },
        workspace: {
            current_dir: "/Users/demo/claude-scope",
            project_dir: "/Users/demo/claude-scope",
        },
        version: "1.0.0",
        output_style: {
            name: "default",
        },
        cost: {
            total_cost_usd: 0.42,
            total_duration_ms: 3665000,
            total_api_duration_ms: 3000000,
            total_lines_added: 142,
            total_lines_removed: 27,
        },
        context_window: {
            total_input_tokens: 185000,
            total_output_tokens: 50000,
            context_window_size: 200000,
            current_usage: {
                input_tokens: 150000,
                output_tokens: 50000,
                cache_creation_input_tokens: 5000,
                cache_read_input_tokens: 35000,
            },
        },
    };
}
//# sourceMappingURL=demo-data.js.map