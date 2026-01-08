/**
 * StyleRenderer Strategy Interface
 */
export interface StyleRenderer<T = any> {
    render(data: T): string;
}
export declare abstract class BaseStyleRenderer<T = any> implements StyleRenderer<T> {
    abstract render(data: T): string;
}
export type RenderData = unknown;
//# sourceMappingURL=style-renderer.d.ts.map