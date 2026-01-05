/**
 * Unified rendering engine
 * Combines widget outputs into statusline
 */
import type { IWidget } from './types.js';
import type { RenderContext } from '../types.js';
/**
 * Renderer for combining widget outputs
 */
export declare class Renderer {
    private separator;
    /**
     * Render widgets into a single line
     */
    render(widgets: IWidget[], context: RenderContext): Promise<string>;
    /**
     * Set custom separator
     */
    setSeparator(separator: string): void;
}
//# sourceMappingURL=renderer.d.ts.map