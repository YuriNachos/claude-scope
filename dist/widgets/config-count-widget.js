/**
 * Config Count Widget
 *
 * Displays Claude Code configuration counts on second statusline line.
 * Data source: ConfigProvider scans filesystem.
 */
import { createWidgetMetadata } from "../core/widget-types.js";
import { ConfigProvider } from "../providers/config-provider.js";
import { ConfigCountBalancedRenderer } from "./config-count/renderers/balanced.js";
import { ConfigCountCompactRenderer } from "./config-count/renderers/compact.js";
import { ConfigCountPlayfulRenderer } from "./config-count/renderers/playful.js";
import { ConfigCountVerboseRenderer } from "./config-count/renderers/verbose.js";
import { DEFAULT_WIDGET_STYLE } from "../core/style-types.js";
/**
 * Widget displaying configuration counts
 *
 * Shows: 📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks
 * Only appears on line 1 (second line).
 * Hides if all counts are zero.
 */
export class ConfigCountWidget {
    id = "config-count";
    metadata = createWidgetMetadata("Config Count", "Displays Claude Code configuration counts", "1.0.0", "claude-scope", 1 // Second line
    );
    configProvider = new ConfigProvider();
    configs;
    cwd;
    renderer = new ConfigCountBalancedRenderer();
    async initialize() {
        // No initialization needed
    }
    async update(data) {
        this.cwd = data.cwd;
        this.configs = await this.configProvider.getConfigs({ cwd: data.cwd });
    }
    isEnabled() {
        // Only show if we have configs AND at least one count > 0
        if (!this.configs) {
            return false;
        }
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
        return claudeMdCount > 0 || rulesCount > 0 || mcpCount > 0 || hooksCount > 0;
    }
    setStyle(style = DEFAULT_WIDGET_STYLE) {
        switch (style) {
            case "balanced":
                this.renderer = new ConfigCountBalancedRenderer();
                break;
            case "compact":
                this.renderer = new ConfigCountCompactRenderer();
                break;
            case "playful":
                this.renderer = new ConfigCountPlayfulRenderer();
                break;
            case "verbose":
                this.renderer = new ConfigCountVerboseRenderer();
                break;
            default:
                this.renderer = new ConfigCountBalancedRenderer();
                break;
        }
    }
    async render(context) {
        if (!this.configs) {
            return null;
        }
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
        const renderData = {
            claudeMdCount,
            rulesCount,
            mcpCount,
            hooksCount
        };
        return this.renderer.render(renderData);
    }
    async cleanup() {
        // No cleanup needed
    }
}
//# sourceMappingURL=config-count-widget.js.map