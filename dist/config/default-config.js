/**
 * Default configuration for claude-scope
 * Represents current behavior (without Poker widget)
 */
import { getThemeByName } from "../ui/theme/index.js";
/**
 * Convert RGB color object to ANSI escape sequence
 */
function _rgbToAnsi(r, g, b) {
    return `\u001b[38;2;${r};${g};${b}m`;
}
/**
 * Extract RGB values from ANSI escape sequence
 * ANSI format: \x1b[38;2;R;G;Bm or \u001b[38;2;R;G;Bm
 */
function _extractRgbFromAnsi(ansiColor) {
    // Match both \x1b and \u001b escape sequences
    const match = ansiColor.match(/\x1b\[38;2;(\d+);(\d+);(\d+)m/);
    if (!match) {
        // Return default gray if parsing fails
        return { r: 148, g: 163, b: 184 };
    }
    return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
    };
}
/**
 * Generate default config using Dusty Sage theme
 * @deprecated Use generateConfigWithStyleAndTheme instead
 */
export function generateDefaultConfig() {
    return generateConfigWithStyleAndTheme("balanced", "dusty-sage");
}
/**
 * Generate config with specified style and theme
 * @param style - Display style (balanced, playful, compact)
 * @param themeName - Theme name (e.g., "monokai", "nord", "dracula")
 * @returns Config object
 */
export function generateConfigWithStyleAndTheme(style, themeName) {
    const theme = getThemeByName(themeName).colors;
    return {
        version: "1.0.0",
        lines: {
            "0": [
                {
                    id: "model",
                    style: style,
                    colors: {
                        name: theme.model.name,
                        version: theme.model.version,
                    },
                },
                {
                    id: "context",
                    style: style,
                    colors: {
                        low: theme.context.low,
                        medium: theme.context.medium,
                        high: theme.context.high,
                        bar: theme.context.bar,
                    },
                },
                {
                    id: "cost",
                    style: style,
                    colors: {
                        amount: theme.cost.amount,
                        currency: theme.cost.currency,
                    },
                },
                {
                    id: "lines",
                    style: style,
                    colors: {
                        added: theme.lines.added,
                        removed: theme.lines.removed,
                    },
                },
                {
                    id: "duration",
                    style: style,
                    colors: {
                        value: theme.duration.value,
                        unit: theme.duration.unit,
                    },
                },
                {
                    id: "git",
                    style: style,
                    colors: {
                        branch: theme.git.branch,
                        changes: theme.git.changes,
                    },
                },
            ],
            "1": [
                {
                    id: "git-tag",
                    style: style,
                    colors: {
                        base: theme.base.text,
                    },
                },
                {
                    id: "config-count",
                    style: style,
                    colors: {
                        base: theme.base.muted,
                    },
                },
            ],
            "2": [
                {
                    id: "active-tools",
                    style: style,
                    colors: {
                        running: theme.tools.running,
                        completed: theme.tools.completed,
                        error: theme.tools.error,
                        name: theme.tools.name,
                        target: theme.tools.target,
                        count: theme.tools.count,
                    },
                },
                {
                    id: "cache-metrics",
                    style: style,
                    colors: {
                        high: theme.cache.high,
                        medium: theme.cache.medium,
                        low: theme.cache.low,
                        read: theme.cache.read,
                        write: theme.cache.write,
                    },
                },
            ],
        },
    };
}
//# sourceMappingURL=default-config.js.map