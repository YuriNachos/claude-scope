/**
 * Active tools widget styles
 */
import { colorize } from "../../ui/utils/colors.js";
/**
 * Truncate path to show only filename with ... prefix
 * @param path - File path to truncate
 * @returns Truncated path with .../filename format
 */
function truncatePath(path) {
    if (path.length <= 30) {
        return path;
    }
    const parts = path.split("/");
    return `.../${parts[parts.length - 1]}`;
}
/**
 * Format tool name with optional target
 * @param name - Tool name (Read, Edit, etc.)
 * @param target - Optional target (file path, pattern, command)
 * @param colors - Theme colors
 * @returns Formatted tool string
 */
function formatTool(name, target, colors) {
    const nameStr = colorize(name, colors.tools.name);
    if (target) {
        const targetStr = colorize(`: ${truncatePath(target)}`, colors.tools.target);
        return `${nameStr}${targetStr}`;
    }
    return nameStr;
}
/**
 * Pluralize a tool name
 * @param name - Tool name to pluralize
 * @returns Pluralized tool name
 */
function pluralizeTool(name) {
    // Common irregular plurals
    const irregular = {
        Task: "Tasks",
        Bash: "Bash",
        Edit: "Edits",
        Read: "Reads",
        Write: "Writes",
        Grep: "Greps",
        Glob: "Globs",
    };
    return irregular[name] || `${name}s`;
}
/**
 * Style implementations for active tools display
 */
export const activeToolsStyles = {
    /**
     * balanced: Group tools by name, showing running and completed counts together
     * - Running + completed: "ToolName (1 running, 6 done)"
     * - Only completed: "Tools: 6"
     * - No symbols, just text format
     */
    balanced: (data, colors) => {
        const parts = [];
        const c = colors ?? getDefaultColors();
        // Get all unique tool names (running + top-3 completed)
        const allToolNames = new Set();
        for (const tool of data.running) {
            allToolNames.add(tool.name);
        }
        // Only include top-3 completed tools (already sorted by count)
        for (const [name] of data.completed.slice(0, 3)) {
            allToolNames.add(name);
        }
        // Create a Map from completed array for O(1) lookup
        const completedMap = new Map(data.completed);
        // Count running tools by name
        const runningCounts = new Map();
        for (const tool of data.running) {
            runningCounts.set(tool.name, (runningCounts.get(tool.name) ?? 0) + 1);
        }
        // Build display for each tool
        for (const name of allToolNames) {
            const runningCount = runningCounts.get(name) ?? 0;
            const completedCount = completedMap.get(name) ?? 0;
            if (runningCount > 0 && completedCount > 0) {
                // Both running and completed: "ToolName (1 running, 6 done)"
                const nameStr = colorize(name, c.tools.name);
                const runningStr = colorize(`${runningCount} running`, c.tools.running);
                const doneStr = colorize(`${completedCount} done`, c.tools.completed);
                parts.push(`${nameStr} (${runningStr}, ${doneStr})`);
            }
            else if (completedCount > 0) {
                // Only completed: "Tools: 6" (pluralized)
                const pluralName = pluralizeTool(name);
                const nameStr = colorize(pluralName, c.tools.name);
                const countStr = colorize(`${completedCount}`, c.tools.count);
                parts.push(`${nameStr}: ${countStr}`);
            }
            else if (runningCount > 0) {
                // Only running: "ToolName (1 running, 0 done)"
                const nameStr = colorize(name, c.tools.name);
                const runningStr = colorize(`${runningCount} running`, c.tools.running);
                const doneStr = colorize("0 done", c.tools.completed);
                parts.push(`${nameStr} (${runningStr}, ${doneStr})`);
            }
        }
        if (parts.length === 0) {
            return "";
        }
        return parts.join(" | ");
    },
    /**
     * compact: [ToolName] format for all tools
     */
    compact: (data, colors) => {
        const parts = [];
        const c = colors ?? getDefaultColors();
        for (const tool of data.running) {
            parts.push(`[${colorize(tool.name, c.tools.name)}]`);
        }
        for (const [name] of data.completed.slice(0, 3)) {
            parts.push(`[${colorize(name, c.tools.completed)}]`);
        }
        if (parts.length === 0) {
            return "";
        }
        return parts.join(" ");
    },
    /**
     * minimal: Same as compact
     */
    minimal: (data, colors) => {
        const compactStyle = activeToolsStyles.compact;
        if (!compactStyle)
            return "";
        return compactStyle(data, colors);
    },
    /**
     * playful: Emojis (📖✏️✨🔄🔍📁) with tool names
     */
    playful: (data, colors) => {
        const parts = [];
        const emojis = {
            Read: "📖",
            Write: "✏️",
            Edit: "✨",
            Bash: "🔄",
            Grep: "🔍",
            Glob: "📁",
        };
        for (const tool of data.running.slice(-3)) {
            const emoji = emojis[tool.name] ?? "🔧";
            const nameStr = colors ? colorize(tool.name, colors.tools.name) : tool.name;
            parts.push(`${emoji} ${nameStr}`);
        }
        if (parts.length === 0) {
            return "";
        }
        return parts.join(", ");
    },
    /**
     * verbose: Full text labels "Running:" and "Completed:"
     */
    verbose: (data, colors) => {
        const parts = [];
        const c = colors ?? getDefaultColors();
        for (const tool of data.running) {
            const label = colorize("Running:", c.tools.running);
            parts.push(`${label} ${formatTool(tool.name, tool.target, c)}`);
        }
        const sorted = data.completed.slice(0, 3);
        for (const [name, count] of sorted) {
            const label = colorize("Completed:", c.tools.completed);
            const countStr = colorize(`(${count}x)`, c.tools.count);
            parts.push(`${label} ${name} ${countStr}`);
        }
        if (parts.length === 0) {
            return "";
        }
        return parts.join(" | ");
    },
    /**
     * labeled: "Tools:" prefix with all tools
     */
    labeled: (data, colors) => {
        const c = colors ?? getDefaultColors();
        const allTools = [
            ...data.running.map((t) => {
                const indicator = colorize("◐", c.tools.running);
                return `${indicator} ${formatTool(t.name, t.target, c)}`;
            }),
            ...data.completed.slice(0, 3).map(([name, count]) => {
                const indicator = colorize("✓", c.tools.completed);
                const countStr = colorize(`×${count}`, c.tools.count);
                return `${indicator} ${name} ${countStr}`;
            }),
        ];
        if (allTools.length === 0) {
            return "";
        }
        const prefix = colors ? colorize("Tools:", c.semantic.info) : "Tools:";
        return `${prefix}: ${allTools.join(" | ")}`;
    },
    /**
     * indicator: ● bullet indicators
     */
    indicator: (data, colors) => {
        const parts = [];
        const c = colors ?? getDefaultColors();
        for (const tool of data.running) {
            const bullet = colorize("●", c.semantic.info);
            parts.push(`${bullet} ${formatTool(tool.name, tool.target, c)}`);
        }
        for (const [name] of data.completed.slice(0, 3)) {
            const bullet = colorize("●", c.tools.completed);
            parts.push(`${bullet} ${name}`);
        }
        if (parts.length === 0) {
            return "";
        }
        return parts.join(" | ");
    },
};
/**
 * Get default colors (fallback when colors not provided)
 * Uses basic ANSI colors
 */
function getDefaultColors() {
    return {
        base: {
            text: "\x1b[37m",
            muted: "\x1b[90m",
            accent: "\x1b[36m",
            border: "\x1b[90m",
        },
        semantic: {
            success: "\x1b[32m",
            warning: "\x1b[33m",
            error: "\x1b[31m",
            info: "\x1b[36m",
        },
        git: {
            branch: "\x1b[36m",
            changes: "\x1b[33m",
        },
        context: {
            low: "\x1b[32m",
            medium: "\x1b[33m",
            high: "\x1b[31m",
            bar: "\x1b[37m",
        },
        lines: {
            added: "\x1b[32m",
            removed: "\x1b[31m",
        },
        cost: {
            amount: "\x1b[37m",
            currency: "\x1b[90m",
        },
        duration: {
            value: "\x1b[37m",
            unit: "\x1b[90m",
        },
        model: {
            name: "\x1b[36m",
            version: "\x1b[90m",
        },
        poker: {
            participating: "\x1b[37m",
            nonParticipating: "\x1b[90m",
            result: "\x1b[36m",
        },
        cache: {
            high: "\x1b[32m",
            medium: "\x1b[33m",
            low: "\x1b[31m",
            read: "\x1b[34m",
            write: "\x1b[35m",
        },
        tools: {
            running: "\x1b[33m",
            completed: "\x1b[32m",
            error: "\x1b[31m",
            name: "\x1b[34m",
            target: "\x1b[90m",
            count: "\x1b[35m",
        },
    };
}
/**
 * Get the default style for active tools
 */
export function getDefaultActiveToolsStyle() {
    return "balanced";
}
/**
 * Get all available active tools styles
 */
export function getActiveToolsStyles() {
    return ["balanced", "compact", "minimal", "playful", "verbose", "labeled", "indicator"];
}
/**
 * Validate if a string is a valid active tools style
 */
export function isValidActiveToolsStyle(style) {
    return getActiveToolsStyles().includes(style);
}
//# sourceMappingURL=styles.js.map