/**
 * StyleRenderer Strategy Interface
 */
export interface StyleRenderer<T = any> {
  render(data: T): string;
}

export abstract class BaseStyleRenderer<T = any> implements StyleRenderer<T> {
  abstract render(data: T): string;
}

export type RenderData = unknown;
