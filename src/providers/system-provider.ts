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
   * @deprecated SysmonWidget now uses on-demand fetching via getMetrics()
   * @param intervalMs - Update interval in milliseconds
   * @param callback - Called with new metrics on each update
   */
  startUpdate(intervalMs: number, callback: (metrics: SysmonRenderData) => void): void;

  /**
   * Stop background updates
   * @deprecated SysmonWidget now uses on-demand fetching via getMetrics()
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

// Persistent storage for network stats between process restarts
const NETWORK_STATS_FILE = "/tmp/claude-scope-network-stats.json";

interface NetworkStatsEntry {
  rx: number;
  tx: number;
  time: number;
}

interface NetworkStatsData {
  stats: Record<string, NetworkStatsEntry>;
  lastUpdate: number;
}

/**
 * Load network stats from persistent storage (async)
 */
async function loadNetworkStats(): Promise<Map<string, { rx: number; tx: number; time: number }>> {
  try {
    const fs = await import("node:fs/promises");
    const text = await fs.readFile(NETWORK_STATS_FILE, "utf-8");
    const data = JSON.parse(text) as NetworkStatsData;

    // Clear stats if older than 5 minutes (process was restarted long ago)
    if (Date.now() - data.lastUpdate > 5 * 60 * 1000) {
      return new Map();
    }

    return new Map(
      Object.entries(data.stats).map(([key, value]) => [
        key,
        { rx: value.rx, tx: value.tx, time: value.time },
      ])
    );
  } catch {
    return new Map();
  }
}

/**
 * Save network stats to persistent storage (async with debouncing)
 */
let pendingSave: Promise<void> | null = null;
let pendingSaveData: Map<string, { rx: number; tx: number; time: number }> | null = null;

async function saveNetworkStats(
  stats: Map<string, { rx: number; tx: number; time: number }>
): Promise<void> {
  // Store the latest data to save
  pendingSaveData = stats;

  // If a save is already pending, it will use the latest data
  if (pendingSave) {
    return;
  }

  // Debounce: wait a tick before saving
  pendingSave = (async () => {
    // Use setImmediate to batch multiple saves
    await new Promise((resolve) => setImmediate(resolve));

    if (!pendingSaveData) {
      pendingSave = null;
      return;
    }

    try {
      const fs = await import("node:fs/promises");
      const data: NetworkStatsData = {
        stats: Object.fromEntries(pendingSaveData),
        lastUpdate: Date.now(),
      };
      await fs.writeFile(NETWORK_STATS_FILE, JSON.stringify(data), "utf-8");
    } catch {
      // Silently fail - we'll just start fresh next time
    } finally {
      pendingSave = null;
      pendingSaveData = null;
    }
  })();
}

export class SystemProvider implements ISystemProvider {
  private intervalId?: NodeJS.Timeout;
  private lastNetworkStats: Map<string, { rx: number; tx: number; time: number }> = new Map();
  private lastErrorTime = 0;
  private readonly ERROR_LOG_INTERVAL = 60000; // 1 minute
  private initialized = false;
  private networkStatsLoaded = false;

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await loadSystemInformation();
      this.initialized = true;
    }
    // Load network stats lazily on first use
    if (!this.networkStatsLoaded) {
      this.lastNetworkStats = await loadNetworkStats();
      this.networkStatsLoaded = true;
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

      // CPU - use max core load (matches 'top' behavior better on macOS)
      // 'top' shows peak load, not average, which is more useful for monitoring
      const cpuPercent = Math.round(
        cpuLoad.cpus && cpuLoad.cpus.length > 0
          ? Math.max(...cpuLoad.cpus.map((cpu: any) => cpu.load))
          : (cpuLoad.currentLoad ?? 0)
      );

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
      const networkSpeed = await this.calculateNetworkSpeed(iface);

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
    // Allow process to exit even if interval is active
    if (this.intervalId && typeof this.intervalId.unref === "function") {
      this.intervalId.unref();
    }
  }

  stopUpdate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async calculateNetworkSpeed(iface: any): Promise<{ rxSec: number; txSec: number }> {
    if (!iface || iface.iface === undefined) {
      return { rxSec: 0, txSec: 0 };
    }

    const ifaceKey = iface.iface;
    const last = this.lastNetworkStats.get(ifaceKey);
    const now = Date.now();

    if (!last) {
      // First poll - store current values with timestamp, return 0
      this.lastNetworkStats.set(ifaceKey, {
        rx: iface.rx_bytes,
        tx: iface.tx_bytes,
        time: now,
      });
      // Save to persistent storage (async, non-blocking)
      saveNetworkStats(this.lastNetworkStats);
      return { rxSec: 0, txSec: 0 };
    }

    // Calculate actual time difference in seconds
    const timeDiff = Math.max(0.1, (now - last.time) / 1000); // Minimum 100ms to avoid division issues
    const rxDiff = iface.rx_bytes - last.rx;
    const txDiff = iface.tx_bytes - last.tx;

    const rx_sec = rxDiff / timeDiff / 1024 / 1024; // MB/s
    const tx_sec = txDiff / timeDiff / 1024 / 1024; // MB/s

    this.lastNetworkStats.set(ifaceKey, {
      rx: iface.rx_bytes,
      tx: iface.tx_bytes,
      time: now,
    });

    // Save to persistent storage for next process (async, non-blocking)
    saveNetworkStats(this.lastNetworkStats);

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
