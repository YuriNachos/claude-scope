/**
 * Types for DevServerWidget
 */

/**
 * Process detection patterns for dev servers
 */
export interface ProcessPattern {
  /** Regex pattern to match process command line */
  regex: RegExp;
  /** Display name for this server type */
  name: string;
  /** Icon for this server type */
  icon: string;
}

/**
 * Detected dev server status
 */
export interface DevServerStatus {
  /** Name of detected server (e.g., "Nuxt", "Vite") */
  name: string;
  /** Icon for the server */
  icon: string;
  /** Whether dev server is running */
  isRunning: boolean;
  /** Whether build process is running */
  isBuilding: boolean;
}

/**
 * Render data for DevServerWidget
 */
export interface DevServerRenderData {
  /** Detected dev server status */
  server: DevServerStatus | null;
}
