/**
 * Shared types for Dev Server Detectors
 *
 * This file provides unified interfaces for PortDetector and ProcessDetector
 * to enable polymorphic usage in the hybrid detection system.
 */

/**
 * Detected dev server status
 *
 * Used by both PortDetector and ProcessDetector for consistent return types.
 * The `port` property is optional since only PortDetector provides port information.
 */
export interface DetectedServer {
  /** Name of detected server (e.g., "Nuxt", "Vite") */
  name: string;
  /** Icon for the server */
  icon: string;
  /** Whether dev server is running */
  isRunning: boolean;
  /** Whether build process is running */
  isBuilding: boolean;
  /** Port number (only provided by PortDetector, undefined for ProcessDetector) */
  port?: number;
}

/**
 * Exec types shared with every other external command in the project
 *
 * Re-exported here so detector consumers keep a single import site.
 */
export type { ExecFileFn, ExecFileResult } from "../../utils/exec.js";

/**
 * Process detection patterns for dev servers
 *
 * Used by ProcessDetector to define command-line patterns for process detection.
 */
export interface ProcessPattern {
  /** Regex pattern to match process command line */
  regex: RegExp;
  /** Display name for this server type */
  name: string;
  /** Icon for this server type */
  icon: string;
}
