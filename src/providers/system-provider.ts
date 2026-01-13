/**
 * System provider interface for fetching system metrics
 */

import type { SysmonRenderData } from "../widgets/sysmon/types.js";

export interface ISystemProvider {
  /**
   * Get current system metrics
   * @returns SysmonRenderData or null if error
   */
  getMetrics(): Promise<SysmonRenderData | null>;

  /**
   * Start background updates with callback
   * @param intervalMs - Update interval in milliseconds
   * @param callback - Called with new metrics on each update
   */
  startUpdate(intervalMs: number, callback: (metrics: SysmonRenderData) => void): void;

  /**
   * Stop background updates
   */
  stopUpdate(): void;
}
