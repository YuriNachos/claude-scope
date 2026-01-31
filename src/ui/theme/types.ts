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
 * Cache metrics widget colors
 */
export interface ICacheColors {
  /** Color for high cache hit rate (>70%) */
  high: string;
  /** Color for medium cache hit rate (40-70%) */
  medium: string;
  /** Color for low cache hit rate (<40%) */
  low: string;
  /** Color for cache read amount */
  read: string;
  /** Color for cache write amount */
  write: string;
}

/**
 * Active tools widget colors
 */
export interface IToolsColors {
  /** Color for running tool indicator */
  running: string;
  /** Color for completed tool indicator */
  completed: string;
  /** Color for error tool indicator */
  error: string;
  /** Color for tool name */
  name: string;
  /** Color for tool target/path */
  target: string;
  /** Color for tool count multiplier */
  count: string;
}

/**
 * Dev server widget colors
 */
export interface IDevServerColors {
  /** Color for server name (e.g., "Nuxt", "Vite") */
  name: string;
  /** Color for status text (e.g., "running", "building") */
  status: string;
  /** Color for label "Server:" or "Dev Server:" */
  label: string;
}

/**
 * Docker widget colors
 */
export interface IDockerColors {
  /** Color for "Docker:" label */
  label: string;
  /** Color for container count */
  count: string;
  /** Color for running indicator */
  running: string;
  /** Color for stopped indicator */
  stopped: string;
}

/**
 * Sysmon widget colors
 */
export interface ISysmonColors {
  /** Color for CPU usage */
  cpu: string;
  /** Color for RAM usage */
  ram: string;
  /** Color for disk usage */
  disk: string;
  /** Color for network usage */
  network: string;
  /** Color for separator between metrics */
  separator: string;
}

/**
 * Config count widget colors
 */
export interface IConfigCountColors {
  /** Color for labels (CLAUDE.md, rules, MCPs, hooks) */
  label: string;
  /** Color for separator between items */
  separator: string;
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
  cache: ICacheColors;
  tools: IToolsColors;
  devServer: IDevServerColors;
  docker: IDockerColors;
  sysmon: ISysmonColors;
  configCount: IConfigCountColors;
}

/**
 * Theme interface with metadata
 */
export interface ITheme {
  name: string;
  description: string;
  colors: IThemeColors;
}
