/**
 * Custom select prompt with live preview panel
 * Built on @inquirer/core hooks for navigation and rendering
 */
import type { QuickConfigStyle, ScopeConfig } from "./config-schema.js";
/**
 * Choice with preview generation capability
 */
export interface PreviewChoice<T> {
    name: string;
    description?: string;
    value: T;
    getConfig: (style: QuickConfigStyle, themeName: string) => ScopeConfig;
}
/**
 * Config for selectWithPreview prompt
 * previews: Array of pre-rendered preview strings (must be generated before prompt is shown)
 */
export interface SelectWithPreviewConfig<T> {
    message: string;
    choices: PreviewChoice<T>[];
    pageSize?: number;
    style: QuickConfigStyle;
    themeName: string;
    previews: string[];
}
/**
 * Helper: Generate all previews upfront before showing the prompt
 * Call this before passing config to selectWithPreview
 */
export declare function generatePreviews<T>(choices: PreviewChoice<T>[], style: QuickConfigStyle, themeName: string): Promise<string[]>;
export declare const selectWithPreview: <T>(config: {
    message: string;
    choices: PreviewChoice<T>[];
    pageSize?: number | undefined;
    style: QuickConfigStyle;
    themeName: string;
    previews: string[];
}, context?: import("@inquirer/type").Context) => Promise<T> & {
    cancel: () => void;
};
//# sourceMappingURL=select-with-preview.d.ts.map