/**
 * Custom select prompt with live preview panel
 * Built on @inquirer/core hooks for navigation and rendering
 */
import { createPrompt, isDownKey, isEnterKey, isUpKey, useEffect, useKeypress, usePagination, useState, } from "@inquirer/core";
import { renderPreviewFromConfig } from "./layout-preview.js";
/**
 * Helper: Generate all previews upfront before showing the prompt
 * Call this before passing config to selectWithPreview
 */
export async function generatePreviews(choices, style, themeName) {
    const previews = [];
    // Detect if this is a style selection stage (all choices are styles)
    // Stage 2 always has exactly 3 style choices (balanced, playful, compact)
    const isStyleSelection = choices.length >= 3 && choices.every((c) => isQuickConfigStyle(c.value));
    // Detect if this is a theme selection stage (choices have theme names as values)
    // IMPORTANT: This must match the first 8 themes in AVAILABLE_THEMES from src/ui/theme/index.ts
    const availableThemes = [
        "catppuccin-mocha", // AVAILABLE_THEMES[0]
        "cyberpunk-neon", // AVAILABLE_THEMES[1]
        "dracula", // AVAILABLE_THEMES[2]
        "dusty-sage", // AVAILABLE_THEMES[3]
        "github-dark-dimmed", // AVAILABLE_THEMES[4]
        "gray", // AVAILABLE_THEMES[5] - was missing!
        "monokai", // AVAILABLE_THEMES[6]
        "muted-gray", // AVAILABLE_THEMES[7] - was missing!
    ];
    const isThemeSelection = choices.some((c) => isThemeName(c.value, availableThemes));
    for (const choice of choices) {
        try {
            // Determine preview style: use choice value for style selection, otherwise use provided style
            let previewStyle = style;
            if (isStyleSelection) {
                previewStyle = choice.value;
            }
            // Determine preview theme: use choice value for theme selection, otherwise use provided theme
            let previewTheme = themeName;
            if (isThemeSelection && isThemeName(choice.value, availableThemes)) {
                previewTheme = choice.value;
            }
            const preview = await renderPreviewFromConfig(choice.getConfig(previewStyle, previewTheme), previewStyle, previewTheme);
            previews.push(preview);
        }
        catch (error) {
            const errorMsg = `⚠ Preview error: ${error instanceof Error ? error.message : "Unknown error"}`;
            previews.push(errorMsg);
        }
    }
    return previews;
}
/**
 * Helper: Check if a value is a valid QuickConfigStyle
 * Used to detect style choices in generatePreviews
 */
function isQuickConfigStyle(value) {
    return typeof value === "string" && ["balanced", "playful", "compact"].includes(value);
}
/**
 * Helper: Check if a value is a valid theme name
 * Used to detect theme choices in generatePreviews
 */
function isThemeName(value, availableThemes) {
    return typeof value === "string" && availableThemes.includes(value);
}
/**
 * Custom select prompt with live preview panel.
 *
 * Features:
 * - Arrow key navigation (↑↓) with vim/emacs bindings
 * - Live preview of selected option using actual widget rendering
 * - Preview caching for smooth navigation (previews are pre-generated)
 * - Error handling for render failures
 *
 * Returns tuple: [selectUI, previewUI]
 * Second element renders under the prompt with live widget output
 *
 * Note: Previews must be pre-generated using generatePreviews() before
 * passing the config to this prompt.
 */
function selectWithPreviewImpl(config, done) {
    const [active, setActive] = useState(0);
    const [status, setStatus] = useState("idle");
    // Validation: ensure choices exist
    useEffect(() => {
        if (config.choices.length === 0) {
            throw new Error("selectWithPreview requires at least one choice");
        }
    }, []);
    // Handle keyboard navigation
    useKeypress((key) => {
        if (isEnterKey(key)) {
            setStatus("done");
            done(config.choices[active].value);
        }
        else if (isUpKey(key)) {
            const newIndex = active > 0 ? active - 1 : config.choices.length - 1;
            setActive(newIndex);
        }
        else if (isDownKey(key)) {
            const newIndex = active < config.choices.length - 1 ? active + 1 : 0;
            setActive(newIndex);
        }
    });
    // Render select options with pagination
    const choices = config.choices.map((c) => c.name);
    const page = usePagination({
        items: choices,
        active,
        pageSize: config.pageSize ?? 7,
        loop: true,
        renderItem: ({ item, index, isActive }) => {
            const prefix = isActive ? "❯" : " ";
            const choice = config.choices[index];
            const desc = choice.description ? `\x1b[90m - ${choice.description}\x1b[0m` : "";
            return `${prefix} ${item}${desc}`;
        },
    });
    // Get pre-rendered preview for currently active choice
    const preview = config.previews[active];
    const activeChoice = config.choices[active];
    if (status === "done") {
        // Show only selected answer (no preview)
        return [`${config.message} ${activeChoice.name}`, ""];
    }
    // Return tuple: [select UI, preview UI]
    const line = `\x1b[1;37m${"─".repeat(60)}\x1b[0m`;
    const previewBox = `${line}\n\x1b[1;37mLive Preview\x1b[0m\n\n${preview}\n\n${line}`;
    return [config.message, `${page}\n\n${previewBox}`];
}
export const selectWithPreview = createPrompt(selectWithPreviewImpl);
//# sourceMappingURL=select-with-preview.js.map