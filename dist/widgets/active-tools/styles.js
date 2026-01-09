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
 * Style implementations for active tools display
 */
export const activeToolsStyles = {
    /**
     * balanced: Running tools with ◐ spinner, completed aggregated with ✓ ×count
     */
    balanced: (data, colors) => {
        const parts = [];
        // Show running tools with spinner (last 2)
        for (const tool of data.running.slice(-2)) {
            const indicator = colors ? colorize("◐", colors.tools.running) : "◐";
            parts.push(`${indicator} ${formatTool(tool.name, tool.target, colors ?? getDefaultColors())}`);
        }
        // Show completed tools aggregated (top 4 by count)
        const sorted = Array.from(data.completed.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
        for (const [name, count] of sorted) {
            const check = colors ? colorize("✓", colors.tools.completed) : "✓";
            const countStr = colors ? colorize(`×${count}`, colors.tools.count) : `×${count}`;
            parts.push(`${check} ${name} ${countStr}`);
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
        for (const [name] of Array.from(data.completed.entries()).slice(0, 3)) {
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
        const sorted = Array.from(data.completed.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
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
            ...Array.from(data.completed.entries())
                .slice(0, 3)
                .map(([name, count]) => {
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
        for (const [name] of Array.from(data.completed.entries()).slice(0, 3)) {
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