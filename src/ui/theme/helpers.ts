/**
 * Theme creation helpers
 *
 * Utility functions to help create theme color objects from raw RGB values.
 * These helpers derive semantic and base colors from widget-specific colors.
 */

import type { IBaseColors, ISemanticColors, IThemeColors } from "./types.js";

/**
 * Create ANSI RGB color code (24-bit true color)
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape code for RGB color
 * @example rgb(136, 192, 208) // "\x1b[38;2;136;192;208m"
 */
export function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Create base colors from widget colors
 * Derives text, muted, border, and accent from existing widget colors
 */
export function createBaseColors(params: {
  modelColor: string;
  durationColor: string;
  accentColor: string;
}): IBaseColors {
  return {
    text: params.modelColor,
    muted: params.durationColor,
    accent: params.accentColor,
    border: params.durationColor,
  };
}

/**
 * Create semantic colors from widget colors
 * Derives success, warning, error, info from context and branch colors
 */
export function createSemanticColors(params: {
  contextLow: string;
  contextMedium: string;
  contextHigh: string;
  branchColor: string;
}): ISemanticColors {
  return {
    success: params.contextLow,
    warning: params.contextMedium,
    error: params.contextHigh,
    info: params.branchColor,
  };
}

/**
 * Create theme colors from raw RGB values
 * This is the main helper for creating complete theme color objects
 */
export function createThemeColors(params: {
  // Widget-specific colors (from theme definition)
  branch: string;
  changes: string;
  contextLow: string;
  contextMedium: string;
  contextHigh: string;
  linesAdded: string;
  linesRemoved: string;
  cost: string;
  model: string;
  duration: string;
  accent: string;
  cacheHigh: string;
  cacheMedium: string;
  cacheLow: string;
  cacheRead: string;
  cacheWrite: string;
  toolsRunning: string;
  toolsCompleted: string;
  toolsError: string;
  toolsName: string;
  toolsTarget: string;
  toolsCount: string;
  devServerName?: string;
  devServerStatus?: string;
  devServerLabel?: string;
  dockerLabel?: string;
  dockerCount?: string;
  dockerRunning?: string;
  dockerStopped?: string;
  // Sysmon widget colors
  sysmonCpu: string;
  sysmonRam: string;
  sysmonDisk: string;
  sysmonNetwork: string;
  sysmonSeparator: string;
  // Config count widget colors (optional - defaults from semantic)
  configCountLabel?: string;
  configCountSeparator?: string;
}): IThemeColors {
  const base = createBaseColors({
    modelColor: params.model,
    durationColor: params.duration,
    accentColor: params.accent,
  });

  const semantic = createSemanticColors({
    contextLow: params.contextLow,
    contextMedium: params.contextMedium,
    contextHigh: params.contextHigh,
    branchColor: params.branch,
  });

  return {
    base,
    semantic,
    git: {
      branch: params.branch,
      changes: params.changes,
    },
    context: {
      low: params.contextLow,
      medium: params.contextMedium,
      high: params.contextHigh,
      bar: params.contextLow,
    },
    lines: {
      added: params.linesAdded,
      removed: params.linesRemoved,
    },
    cost: {
      amount: params.cost,
      currency: params.cost,
    },
    duration: {
      value: params.duration,
      unit: params.duration,
    },
    model: {
      name: params.model,
      version: params.model,
    },
    poker: {
      participating: params.model,
      nonParticipating: params.duration,
      result: params.accent,
    },
    cache: {
      high: params.cacheHigh,
      medium: params.cacheMedium,
      low: params.cacheLow,
      read: params.cacheRead,
      write: params.cacheWrite,
    },
    tools: {
      running: params.toolsRunning,
      completed: params.toolsCompleted,
      error: params.toolsError,
      name: params.toolsName,
      target: params.toolsTarget,
      count: params.toolsCount,
    },
    devServer: {
      name: params.devServerName ?? params.model,
      status: params.devServerStatus ?? params.contextLow,
      label: params.devServerLabel ?? params.duration,
    },
    docker: {
      label: params.dockerLabel ?? params.duration,
      count: params.dockerCount ?? params.model,
      running: params.dockerRunning ?? params.contextLow,
      stopped: params.dockerStopped ?? params.contextHigh,
    },
    sysmon: {
      cpu: params.sysmonCpu,
      ram: params.sysmonRam,
      disk: params.sysmonDisk,
      network: params.sysmonNetwork,
      separator: params.sysmonSeparator,
    },
    configCount: {
      label: params.configCountLabel ?? semantic.info,
      separator: params.configCountSeparator ?? base.muted,
    },
  };
}
