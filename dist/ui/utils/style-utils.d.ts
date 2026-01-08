/**
 * Style utility functions for common display patterns
 *
 * These functions provide reusable formatting patterns used across
 * different widget style renderers. They help avoid code duplication
 * and ensure consistent formatting.
 */
/**
 * Add a label prefix to a value
 *
 * @param prefix - The label prefix (e.g., "Model", "Cost")
 * @param value - The value to label
 * @returns Formatted string with label prefix
 *
 * @example
 * withLabel("Model", "Opus 4.5") // "Model: Opus 4.5"
 */
export declare function withLabel(prefix: string, value: string): string;
/**
 * Add a status indicator to a value
 *
 * @param value - The value to indicate
 * @returns Formatted string with bullet indicator
 *
 * @example
 * withIndicator("Opus 4.5") // "● Opus 4.5"
 */
export declare function withIndicator(value: string): string;
/**
 * Wrap a value in fancy french quotes
 *
 * @param value - The value to wrap
 * @returns Formatted string with french quotes
 *
 * @example
 * withFancy("$0.42") // "«$0.42»"
 */
export declare function withFancy(value: string): string;
/**
 * Wrap a value in square brackets
 *
 * @param value - The value to wrap
 * @returns Formatted string with brackets
 *
 * @example
 * withBrackets("main") // "[main]"
 */
export declare function withBrackets(value: string): string;
/**
 * Wrap a value in angle brackets
 *
 * @param value - The value to wrap
 * @returns Formatted string with angle brackets
 *
 * @example
 * withAngleBrackets("71%") // "⟨71%⟩"
 */
export declare function withAngleBrackets(value: string): string;
/**
 * Format a number as token count with K suffix
 *
 * @param n - The number to format
 * @returns Formatted string with K suffix for thousands
 *
 * @example
 * formatTokens(142847) // "142K"
 * formatTokens(999) // "999"
 */
export declare function formatTokens(n: number): string;
/**
 * Create a progress bar string
 *
 * @param percent - Percentage (0-100), will be clamped
 * @param width - Width of the bar in characters (default 10)
 * @returns Progress bar string with █ (filled) and ░ (empty)
 *
 * @example
 * progressBar(71, 10) // "███████░░░"
 * progressBar(50) // "█████░░░░░" (default width 10)
 */
export declare function progressBar(percent: number, width?: number): string;
//# sourceMappingURL=style-utils.d.ts.map