/**
 * Config Count Widget
 *
 * Displays Claude Code configuration counts on second statusline line.
 * Data source: ConfigProvider scans filesystem.
 */
import { createWidgetMetadata } from '../core/widget-types.js';
import { ConfigProvider } from '../providers/config-provider.js';
/**
 * Widget displaying configuration counts
 *
 * Shows: 📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks
 * Only appears on line 1 (second line).
 * Hides if all counts are zero.
 */
export class ConfigCountWidget {
    id = 'config-count';
    metadata = createWidgetMetadata('Config Count', 'Displays Claude Code configuration counts', '1.0.0', 'claude-scope', 1 // Second line
    );
    configProvider = new ConfigProvider();
    configs;
    cwd;
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
    async render(context) {
        if (!this.configs) {
            return null;
        }
        const { claudeMdCount, rulesCount, mcpCount, hooksCount } = this.configs;
        const parts = [];
        if (claudeMdCount > 0) {
            parts.push(`📄 ${claudeMdCount} CLAUDE.md`);
        }
        if (rulesCount > 0) {
            parts.push(`📜 ${rulesCount} rules`);
        }
        if (mcpCount > 0) {
            parts.push(`🔌 ${mcpCount} MCPs`);
        }
        if (hooksCount > 0) {
            parts.push(`🪝 ${hooksCount} hooks`);
        }
        return parts.join(' │ ') || null;
    }
    async cleanup() {
        // No cleanup needed
    }
}
//# sourceMappingURL=config-count-widget.js.map