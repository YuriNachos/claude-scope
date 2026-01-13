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

/**
 * System provider implementation using systeminformation
 */

let si: any = null;
let siLoadAttempted = false;

/**
 * Lazy load systeminformation module
 * Works in both bundled and non-bundled environments
 */
async function loadSystemInformation(): Promise<void> {
  if (siLoadAttempted) {
    return;
  }
  siLoadAttempted = true;

  try {
    // Try dynamic import first (works in bundled code)
    si = await import("systeminformation");
  } catch {
    try {
      // Fallback to require if import fails (non-bundled)
      const module = await import("node:module");
      const require = module.createRequire(import.meta.url);
      si = require("systeminformation");
    } catch {
      // systeminformation not installed - si remains null
    }
  }
}

export class SystemProvider implements ISystemProvider {
  private intervalId?: NodeJS.Timeout;
  private lastNetworkStats = new Map<string, { rx: number; tx: number }>();
  private lastErrorTime = 0;
  private readonly ERROR_LOG_INTERVAL = 60000; // 1 minute
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await loadSystemInformation();
      this.initialized = true;
    }
  }

  async getMetrics(): Promise<SysmonRenderData | null> {
    await this.ensureInitialized();

    if (!si) {
      return null;
    }

    try {
      const [cpuLoad, mem, fs, net] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
      ]);

      // CPU - current load
      const cpuPercent = Math.round(cpuLoad.currentLoad ?? 0);

      // Memory
      const memUsedGB = mem.active / 1024 / 1024 / 1024;
      const memTotalGB = mem.total / 1024 / 1024 / 1024;
      const memPercent = Math.round((mem.active / mem.total) * 100);

      // Disk - use first mounted filesystem
      const mainFs = Array.isArray(fs) ? fs[0] : fs;
      const diskUsedGB = mainFs.used / 1024 / 1024 / 1024;
      const diskTotalGB = mainFs.size / 1024 / 1024 / 1024;
      const diskPercent = Math.round(mainFs.use);

      // Network - calculate speed from difference
      const iface = Array.isArray(net) && net.length > 0 ? net[0] : net;
      const networkSpeed = this.calculateNetworkSpeed(iface);

      return {
        cpu: { percent: cpuPercent },
        memory: {
          used: Number(memUsedGB.toFixed(1)),
          total: Number(memTotalGB.toFixed(1)),
          percent: memPercent,
        },
        disk: {
          used: Number(diskUsedGB.toFixed(1)),
          total: Number(diskTotalGB.toFixed(1)),
          percent: diskPercent,
        },
        network: networkSpeed,
      };
    } catch (error) {
      this.logError(error);
      return null;
    }
  }

  startUpdate(intervalMs: number, callback: (metrics: SysmonRenderData) => void): void {
    this.intervalId = setInterval(() => {
      this.getMetrics()
        .then((metrics) => {
          if (metrics) {
            callback(metrics);
          }
        })
        .catch((error) => {
          this.logError(error);
        });
    }, intervalMs);
  }

  stopUpdate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private calculateNetworkSpeed(iface: any): { rxSec: number; txSec: number } {
    if (!iface || iface.iface === undefined) {
      return { rxSec: 0, txSec: 0 };
    }

    const ifaceKey = iface.iface;
    const last = this.lastNetworkStats.get(ifaceKey);

    if (!last) {
      // First poll - store current values, return 0
      this.lastNetworkStats.set(ifaceKey, { rx: iface.rx_bytes, tx: iface.tx_bytes });
      return { rxSec: 0, txSec: 0 };
    }

    // Calculate speed assuming ~2 second interval
    const timeDiff = 2;
    const rxDiff = iface.rx_bytes - last.rx;
    const txDiff = iface.tx_bytes - last.tx;

    const rx_sec = rxDiff / timeDiff / 1024 / 1024; // MB/s
    const tx_sec = txDiff / timeDiff / 1024 / 1024; // MB/s

    this.lastNetworkStats.set(ifaceKey, { rx: iface.rx_bytes, tx: iface.tx_bytes });

    return {
      rxSec: Math.max(0, Number(rx_sec.toFixed(2))),
      txSec: Math.max(0, Number(tx_sec.toFixed(2))),
    };
  }

  private logError(error: unknown): void {
    const now = Date.now();
    if (now - this.lastErrorTime > this.ERROR_LOG_INTERVAL) {
      console.error("SystemProvider error:", error);
      this.lastErrorTime = now;
    }
  }
}
