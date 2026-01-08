/**
 * Theme types for widget color configuration
 */

/**
 * Base colors used across multiple widgets
 */
export interface IBaseColors {
  text: string;
  muted: string;
  accent: string;
  border: string;
}

/**
 * Semantic colors for states (warning, error, success, etc.)
 */
export interface ISemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * Git widget colors
 */
export interface IGitColors {
  branch: string;
  changes: string;
}

/**
 * Context widget colors
 */
export interface IContextColors {
  low: string;
  medium: string;
  high: string;
  bar: string;
}

/**
 * Lines widget colors
 */
export interface ILinesColors {
  added: string;
  removed: string;
}

/**
 * Cost widget colors
 */
export interface ICostColors {
  amount: string;
  currency: string;
}

/**
 * Duration widget colors
 */
export interface IDurationColors {
  value: string;
  unit: string;
}

/**
 * Model widget colors
 */
export interface IModelColors {
  name: string;
  version: string;
}

/**
 * Poker widget colors
 * Note: Card suit colors (red/gray) are semantic, not theme-controlled
 */
export interface IPokerColors {
  participating: string;
  nonParticipating: string;
  result: string;
}

/**
 * Unified theme colors interface
 * All widget colors in one place for consistent theming
 */
export interface IThemeColors {
  base: IBaseColors;
  semantic: ISemanticColors;
  git: IGitColors;
  context: IContextColors;
  lines: ILinesColors;
  cost: ICostColors;
  duration: IDurationColors;
  model: IModelColors;
  poker: IPokerColors;
}

/**
 * Theme interface with metadata
 */
export interface ITheme {
  name: string;
  description: string;
  colors: IThemeColors;
}
