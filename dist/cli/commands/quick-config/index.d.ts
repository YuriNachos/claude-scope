/**
 * Quick Config Command Entry Point
 */
export { generateDefaultConfig } from "../../../config/default-config.js";
export { getUserConfigPath, loadConfig } from "./config-loader.js";
export type { QuickConfigStyle, ScopeConfig, WidgetConfig } from "./config-schema.js";
export { saveConfig } from "./config-writer.js";
export { runQuickConfigMenu } from "./menu.js";
export { renderPreview } from "./preview.js";
export { renderPreviewFromConfig } from "./layout-preview.js";
export declare function handleQuickConfigCommand(): Promise<void>;
//# sourceMappingURL=index.d.ts.map