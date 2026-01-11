/**
 * Layout-specific preview renderer
 * Renders widgets based on layout configuration
 */
import { Renderer } from "../../../core/renderer.js";
import { WidgetRegistry } from "../../../core/widget-registry.js";
import { TranscriptProvider } from "../../../providers/transcript-provider.js";
import { getThemeByName } from "../../../ui/theme/index.js";
// Widget constructors
import { ActiveToolsWidget } from "../../../widgets/active-tools/index.js";
import { CacheMetricsWidget } from "../../../widgets/cache-metrics/index.js";
import { ConfigCountWidget } from "../../../widgets/config-count-widget.js";
import { ContextWidget } from "../../../widgets/context-widget.js";
import { CostWidget } from "../../../widgets/cost-widget.js";
import { DurationWidget } from "../../../widgets/duration-widget.js";
import { GitTagWidget } from "../../../widgets/git/git-tag-widget.js";
import { GitWidget } from "../../../widgets/git/git-widget.js";
import { LinesWidget } from "../../../widgets/lines-widget.js";
import { ModelWidget } from "../../../widgets/model-widget.js";
import { createDemoData } from "./demo-data.js";
/**
 * Register widgets from config into registry
 */
async function registerWidgetsFromConfig(registry, config, style, themeName) {
    const themeColors = getThemeByName(themeName).colors;
    const transcriptProvider = new TranscriptProvider();
    // Widget factory map with proper IWidget typing
    const widgetFactory = {
        model: (s) => {
            const w = new ModelWidget(themeColors);
            w.setStyle(s);
            return w;
        },
        context: (s) => {
            const w = new ContextWidget(themeColors);
            w.setStyle(s);
            return w;
        },
        cost: (s) => {
            const w = new CostWidget(themeColors);
            w.setStyle(s);
            return w;
        },
        duration: (s) => {
            const w = new DurationWidget(themeColors);
            w.setStyle(s);
            return w;
        },
        lines: (s) => {
            const w = new LinesWidget(themeColors);
            w.setStyle(s);
            return w;
        },
        git: (s) => {
            const w = new GitWidget(undefined, themeColors);
            w.setStyle(s);
            return w;
        },
        "git-tag": (s) => {
            const w = new GitTagWidget(undefined, themeColors);
            w.setStyle(s);
            return w;
        },
        "config-count": (s) => {
            const w = new ConfigCountWidget();
            w.setStyle(s);
            return w;
        },
        "active-tools": (s) => {
            const w = new ActiveToolsWidget(themeColors, transcriptProvider);
            w.setStyle(s);
            return w;
        },
        "cache-metrics": (s) => {
            const w = new CacheMetricsWidget(themeColors);
            w.setStyle(s);
            return w;
        },
    };
    // Register widgets from config lines
    for (const [lineNum, widgets] of Object.entries(config.lines)) {
        const line = parseInt(lineNum, 10);
        for (const widgetConfig of widgets) {
            const factory = widgetFactory[widgetConfig.id];
            if (factory) {
                const widget = factory(style);
                // Set line number from config
                widget.metadata.line = line;
                await registry.register(widget);
            }
        }
    }
}
/**
 * Render preview from config
 */
export async function renderPreviewFromConfig(config, style, themeName) {
    // Create registry and register widgets
    const registry = new WidgetRegistry();
    await registerWidgetsFromConfig(registry, config, style, themeName);
    // Create renderer
    const renderer = new Renderer({
        separator: " │ ",
        onError: () => { },
        showErrors: false,
    });
    // Update all widgets with demo data
    const demoData = createDemoData();
    for (const widget of registry.getAll()) {
        await widget.update(demoData);
    }
    // Render
    const lines = await renderer.render(registry.getEnabledWidgets(), {
        width: 80,
        timestamp: Date.now(),
    });
    return lines.join("\n");
}
//# sourceMappingURL=layout-preview.js.map