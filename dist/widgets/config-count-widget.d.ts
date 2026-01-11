/**
 * Config Count Widget
 *
 * Displays Claude Code configuration counts on second statusline line.
 * Data source: ConfigProvider scans filesystem.
 */
import type { WidgetStyle } from "../core/style-types.js";
import type { IWidget, RenderContext, StdinData } from "../core/types.js";
import { type IConfigProvider } from "../providers/config-provider.js";
import type { IThemeColors } from "../ui/theme/types.js";
/**
 * Widget displaying configuration counts
 *
 * Shows: 📄 N CLAUDE.md │ 📜 N rules │ 🔌 N MCPs │ 🪝 N hooks
 * Only appears on line 1 (second line).
 * Hides if all counts are zero.
 */
export declare class ConfigCountWidget implements IWidget {
    readonly id = "config-count";
    readonly metadata: import("../core/types.js").IWidgetMetadata;
    private configProvider;
    private configs?;
    private cwd?;
    private themeColors;
    private styleFn;
    constructor(configProvider?: IConfigProvider, themeColors?: IThemeColors);
    setStyle(style?: WidgetStyle): void;
    initialize(): Promise<void>;
    update(data: StdinData): Promise<void>;
    isEnabled(): boolean;
    render(_context: RenderContext): Promise<string | null>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=config-count-widget.d.ts.map