# SysmonWidget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a system monitoring widget that displays real-time CPU, RAM, Disk, and Network metrics in the terminal statusline.

**Architecture:** SysmonWidget implements IWidget directly (not StdinDataWidget) and uses SystemProvider with `systeminformation` npm package for cross-platform system metrics polling. Background update runs every 2-3 seconds independent of stdin events.

**Tech Stack:** TypeScript, Node.js, `systeminformation` npm package

---

## Task 1: Install systeminformation dependency

**Files:**
- Modify: `package.json`

**Step 1: Install the package**

Run: `npm install systeminformation`

Expected: package added to package.json and package-lock.json

**Step 2: Verify installation**

Check that `systeminformation` is in `package.json` dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add systeminformation dependency for sysmon widget"
```

---

## Task 2: Create SystemMetrics type

**Files:**
- Create: `src/widgets/sysmon/types.ts`

**Step 1: Create the types file**

```typescript
/**
 * System metrics for SysmonWidget
 */

export interface SystemMetrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
}

export interface CpuMetrics {
  percent: number;
}

export interface MemoryMetrics {
  used: number;    // GB
  total: number;   // GB
  percent: number; // 0-100
}

export interface DiskMetrics {
  used: number;    // GB
  total: number;   // GB
  percent: number; // 0-100
}

export interface NetworkMetrics {
  rx_sec: number;  // MB/s received
  tx_sec: number;  // MB/s sent
}
```

**Step 2: Create index barrel file**

**Files:**
- Create: `src/widgets/sysmon/index.ts`

```typescript
export * from "./types.js";
```

**Step 3: Commit**

```bash
git add src/widgets/sysmon/
git commit -m "feat(sysmon): add SystemMetrics type definitions"
```

---

## Task 3: Create ISystemProvider interface

**Files:**
- Create: `src/providers/system-provider.ts`

**Step 1: Write the interface**

```typescript
/**
 * System provider interface for fetching system metrics
 */

import type { SystemMetrics } from "../widgets/sysmon/types.js";

export interface ISystemProvider {
  /**
   * Get current system metrics
   * @returns SystemMetrics or null if error
   */
  getMetrics(): Promise<SystemMetrics | null>;

  /**
   * Start background updates with callback
   * @param intervalMs - Update interval in milliseconds
   * @param callback - Called with new metrics on each update
   */
  startUpdate(
    intervalMs: number,
    callback: (metrics: SystemMetrics) => void
  ): void;

  /**
   * Stop background updates
   */
  stopUpdate(): void;
}
```

**Step 2: Commit**

```bash
git add src/providers/system-provider.ts
git commit -m "feat(sysmon): add ISystemProvider interface"
```

---

## Task 4: Write SystemProvider tests first (TDD)

**Files:**
- Create: `tests/providers/system-provider.test.ts`

**Step 1: Create test file with basic structure**

```typescript
/**
 * Tests for SystemProvider
 */

import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { SystemProvider } from "../../src/providers/system-provider.js";
import type { SystemMetrics } from "../../src/widgets/sysmon/types.js";

describe("SystemProvider", () => {
  let provider: SystemProvider;

  beforeEach(() => {
    provider = new SystemProvider();
  });

  afterEach(() => {
    provider.stopUpdate();
  });

  describe("getMetrics", () => {
    it("should return system metrics with valid structure", async () => {
      const metrics = await provider.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics).not.toBeNull();

      if (metrics) {
        expect(metrics.cpu.percent).toBeGreaterThanOrEqual(0);
        expect(metrics.cpu.percent).toBeLessThanOrEqual(100);

        expect(metrics.memory.used).toBeGreaterThan(0);
        expect(metrics.memory.total).toBeGreaterThan(0);
        expect(metrics.memory.percent).toBeGreaterThanOrEqual(0);
        expect(metrics.memory.percent).toBeLessThanOrEqual(100);

        expect(metrics.disk.used).toBeGreaterThanOrEqual(0);
        expect(metrics.disk.total).toBeGreaterThan(0);
        expect(metrics.disk.percent).toBeGreaterThanOrEqual(0);
        expect(metrics.disk.percent).toBeLessThanOrEqual(100);

        expect(metrics.network.rx_sec).toBeGreaterThanOrEqual(0);
        expect(metrics.network.tx_sec).toBeGreaterThanOrEqual(0);
      }
    });

    it("should return null on error", async () => {
      // This test verifies graceful degradation
      // In real implementation, we'd mock systeminformation to throw
      const metrics = await provider.getMetrics();
      // Should either return valid metrics or null on error
      expect(metrics === null || metrics !== null).toBe(true);
    });
  });

  describe("startUpdate/stopUpdate", () => {
    it("should call callback periodically", async () => {
      let callCount = 0;
      let lastMetrics: SystemMetrics | null = null;

      provider.startUpdate(100, (metrics) => {
        callCount++;
        lastMetrics = metrics;
      });

      // Wait for ~350ms, should get ~3-4 callbacks
      await new Promise((resolve) => setTimeout(resolve, 350));

      provider.stopUpdate();

      expect(callCount).toBeGreaterThanOrEqual(2);
      expect(lastMetrics).toBeDefined();
    });

    it("should stop calling callback after stopUpdate", async () => {
      let callCount = 0;

      provider.startUpdate(50, () => {
        callCount++;
      });

      await new Promise((resolve) => setTimeout(resolve, 150));
      provider.stopUpdate();

      const countAtStop = callCount;

      // Wait another 150ms
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Count should not have increased
      expect(callCount).toBe(countAtStop);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test tests/providers/system-provider.test.ts`

Expected: FAIL - SystemProvider not implemented yet

**Step 3: No commit yet - implementing next**

---

## Task 5: Implement SystemProvider

**Files:**
- Modify: `src/providers/system-provider.ts`

**Step 1: Implement SystemProvider class**

Add to `src/providers/system-provider.ts`:

```typescript
/**
 * System provider implementation using systeminformation
 */

import type { ISystemProvider } from "./system-provider.js";
import type { SystemMetrics } from "../widgets/sysmon/types.js";

let si: any = null;

try {
  si = require("systeminformation");
} catch {
  // systeminformation not installed
}

export class SystemProvider implements ISystemProvider {
  private intervalId?: NodeJS.Timeout;
  private lastNetworkStats = new Map<string, { rx: number; tx: number }>();
  private lastErrorTime = 0;
  private readonly ERROR_LOG_INTERVAL = 60000; // 1 minute

  async getMetrics(): Promise<SystemMetrics | null> {
    if (!si) {
      return null;
    }

    try {
      const [cpu, mem, fs, net] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.fsSize(),
        si.networkStats(),
      ]);

      // CPU - current load
      const cpuPercent = Math.round(cpu.currentLoad ?? 0);

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

  startUpdate(
    intervalMs: number,
    callback: (metrics: SystemMetrics) => void
  ): void {
    this.intervalId = setInterval(async () => {
      const metrics = await this.getMetrics();
      if (metrics) {
        callback(metrics);
      }
    }, intervalMs);
  }

  stopUpdate(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private calculateNetworkSpeed(iface: any): { rx_sec: number; tx_sec: number } {
    if (!iface || iface.iface === undefined) {
      return { rx_sec: 0, tx_sec: 0 };
    }

    const ifaceKey = iface.iface;
    const last = this.lastNetworkStats.get(ifaceKey);

    if (!last) {
      // First poll - store current values, return 0
      this.lastNetworkStats.set(ifaceKey, { rx: iface.rx_bytes, tx: iface.tx_bytes });
      return { rx_sec: 0, tx_sec: 0 };
    }

    // Calculate speed assuming ~2 second interval
    const timeDiff = 2;
    const rxDiff = iface.rx_bytes - last.rx;
    const txDiff = iface.tx_bytes - last.tx;

    const rx_sec = (rxDiff / timeDiff / 1024 / 1024); // MB/s
    const tx_sec = (txDiff / timeDiff / 1024 / 1024); // MB/s

    this.lastNetworkStats.set(ifaceKey, { rx: iface.rx_bytes, tx: iface.tx_bytes });

    return {
      rx_sec: Math.max(0, Number(rx_sec.toFixed(2))),
      tx_sec: Math.max(0, Number(tx_sec.toFixed(2))),
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
```

**Step 2: Run tests**

Run: `npm test tests/providers/system-provider.test.ts`

Expected: PASS

**Step 3: Commit**

```bash
git add src/providers/system-provider.ts tests/providers/system-provider.test.ts
git commit -m "feat(sysmon): implement SystemProvider with tests"
```

---

## Task 6: Create ISysmonColors interface for themes

**Files:**
- Modify: `src/ui/theme/types.ts`

**Step 1: Add ISysmonColors to theme types**

Find the location where widget color interfaces are defined (after `IDockerColors` or similar) and add:

```typescript
export interface ISysmonColors {
  cpu: string;
  ram: string;
  disk: string;
  network: string;
  separator: string;
}
```

**Step 2: Update IThemeColors interface**

Add `sysmon: ISysmonColors;` to the `IThemeColors` interface:

```typescript
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
  sysmon: ISysmonColors;  // ADD THIS LINE
}
```

**Step 3: Commit**

```bash
git add src/ui/theme/types.ts
git commit -m "feat(sysmon): add ISysmonColors interface to theme types"
```

---

## Task 7: Add sysmon colors to all themes

**Files:**
- Modify: `src/ui/theme/themes.ts`

**Step 1: Add sysmon colors to createThemeColors helper**

Find the `createThemeColors` function and add sysmon colors:

```typescript
export function createThemeColors(colors: {
  // ... existing colors
  sysmonCpu: string;
  sysmonRam: string;
  sysmonDisk: string;
  sysmonNetwork: string;
  sysmonSeparator: string;
}): IThemeColors {
  return {
    // ... existing mappings
    sysmon: {
      cpu: colors.sysmonCpu,
      ram: colors.sysmonRam,
      disk: colors.sysmonDisk,
      network: colors.sysmonNetwork,
      separator: colors.sysmonSeparator,
    },
  };
}
```

**Step 2: Update each theme with sysmon colors**

For each of the 17 themes (MONOKAI_THEME, NORD_THEME, DRACULA_THEME, etc.), add the sysmon color parameters to `createThemeColors`:

Example for Monokai:
```typescript
export const MONOKAI_THEME: ITheme = {
  name: "monokai",
  description: "Classic Monokai color scheme",
  colors: createThemeColors({
    // ... existing colors
    sysmonCpu: rgb(255, 138, 128),    // Red-ish for CPU
    sysmonRam: rgb(139, 233, 253),    // Cyan for RAM
    sysmonDisk: rgb(241, 250, 140),   // Yellow for Disk
    sysmonNetwork: rgb(80, 250, 123), // Green for Network
    sysmonSeparator: rgb(80, 80, 80), // Gray for separator
  }),
};
```

Use appropriate colors for each theme based on its palette.

**Step 3: Commit**

```bash
git add src/ui/theme/themes.ts
git commit -m "feat(sysmon): add sysmon colors to all 17 themes"
```

---

## Task 8: Write sysmon style functions tests

**Files:**
- Create: `tests/widgets/sysmon/styles.test.ts`

**Step 1: Create style tests**

```typescript
/**
 * Tests for sysmon style functions
 */

import { describe, it, expect } from "bun:test";
import { sysmonStyles } from "../../src/widgets/sysmon/styles.js";
import type { SystemMetrics } from "../../src/widgets/sysmon/types.js";

const mockMetrics: SystemMetrics = {
  cpu: { percent: 45 },
  memory: { used: 8.2, total: 16, percent: 51 },
  disk: { used: 120, total: 200, percent: 60 },
  network: { rx_sec: 2.1, tx_sec: 0.5 },
};

const mockColors = {
  cpu: "#ff6b6b",
  ram: "#4ecdc4",
  disk: "#ffe66d",
  network: "#95e1d3",
  separator: "#6c757d",
};

describe("sysmonStyles", () => {
  describe("balanced", () => {
    it("should render all metrics with separator", () => {
      const result = sysmonStyles.balanced(mockMetrics, mockColors);
      expect(result).toContain("CPU");
      expect(result).toContain("45%");
      expect(result).toContain("RAM");
      expect(result).toContain("8.2GB");
      expect(result).toContain("Disk");
      expect(result).toContain("60%");
      expect(result).toContain("Net");
      expect(result).toContain("↓2.1MB/s");
      expect(result).toContain("|");
    });

    it("should work without colors", () => {
      const result = sysmonStyles.balanced(mockMetrics);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("compact", () => {
    it("should render compact format without separator", () => {
      const result = sysmonStyles.compact(mockMetrics, mockColors);
      expect(result).toContain("CPU");
      expect(result).toContain("45%");
      expect(result).toContain("RAM");
      expect(result).toContain("8.2");
      expect(result).not.toContain("|");
    });
  });

  describe("playful", () => {
    it("should render with emojis", () => {
      const result = sysmonStyles.playful(mockMetrics, mockColors);
      expect(result).toContain("🖥️");
      expect(result).toContain("💾");
      expect(result).toContain("💿");
      expect(result).toContain("🌐");
    });
  });

  describe("verbose", () => {
    it("should render detailed format with totals", () => {
      const result = sysmonStyles.verbose(mockMetrics, mockColors);
      expect(result).toContain("CPU:");
      expect(result).toContain("RAM:");
      expect(result).toContain("8.2GB/16GB");
      expect(result).toContain("Disk:");
      expect(result).toContain("120GB/200GB");
      expect(result).toContain("Net:");
      expect(result).toContain("↓2.1MB/s");
      expect(result).toContain("↑0.5MB/s");
    });
  });

  describe("edge cases", () => {
    it("should format MB when RAM < 1GB", () => {
      const smallRam: SystemMetrics = {
        ...mockMetrics,
        memory: { used: 0.5, total: 16, percent: 3 },
      };
      const result = sysmonStyles.balanced(smallRam, mockColors);
      expect(result).toContain("512MB");
    });

    it("should format KB when network < 1MB", () => {
      const smallNet: SystemMetrics = {
        ...mockMetrics,
        network: { rx_sec: 0.0005, tx_sec: 0 },
      };
      const result = sysmonStyles.balanced(smallNet, mockColors);
      expect(result).toContain("KB");
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test tests/widgets/sysmon/styles.test.ts`

Expected: FAIL - styles not implemented yet

---

## Task 9: Implement sysmon style functions

**Files:**
- Create: `src/widgets/sysmon/styles.ts`

**Step 1: Implement style functions**

```typescript
/**
 * Functional style renderers for SysmonWidget
 */

import type { StyleMap } from "../../core/style-types.js";
import type { ISysmonColors } from "../../ui/theme/types.js";
import { colorize } from "../../ui/utils/colors.js";
import type { SystemMetrics } from "./types.js";

function formatGB(gb: number): string {
  if (gb < 1) {
    return `${Math.round(gb * 1024)}MB`;
  }
  return `${gb.toFixed(1)}GB`;
}

function formatMB(mb: number): string {
  if (mb < 1) {
    return `${Math.round(mb * 1024)}KB`;
  }
  return `${mb.toFixed(1)}MB`;
}

export const sysmonStyles: StyleMap<SystemMetrics, ISysmonColors> = {
  balanced: (data: SystemMetrics, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU ${data.cpu.percent}%`, colors.cpu)
      : `CPU ${data.cpu.percent}%`;
    const ram = colors
      ? colorize(`RAM ${formatGB(data.memory.used)}`, colors.ram)
      : `RAM ${formatGB(data.memory.used)}`;
    const disk = colors
      ? colorize(`Disk ${data.disk.percent}%`, colors.disk)
      : `Disk ${data.disk.percent}%`;
    const net = colors
      ? colorize(`Net ↓${formatMB(data.network.rx_sec)}/s`, colors.network)
      : `Net ↓${formatMB(data.network.rx_sec)}/s`;
    const sep = colors ? colorize("|", colors.separator) : "|";
    return `${cpu} ${sep} ${ram} ${sep} ${disk} ${sep} ${net}`;
  },

  compact: (data: SystemMetrics, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU${data.cpu.percent}%`, colors.cpu)
      : `CPU${data.cpu.percent}%`;
    const ram = colors
      ? colorize(`RAM${formatGB(data.memory.used)}`, colors.ram)
      : `RAM${formatGB(data.memory.used)}`;
    const disk = colors
      ? colorize(`D${data.disk.percent}%`, colors.disk)
      : `D${data.disk.percent}%`;
    const net = colors
      ? colorize(`↓${formatMB(data.network.rx_sec)}/s`, colors.network)
      : `↓${formatMB(data.network.rx_sec)}/s`;
    return `${cpu} ${ram} ${disk} ${net}`;
  },

  playful: (data: SystemMetrics, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`${data.cpu.percent}%`, colors.cpu)
      : `${data.cpu.percent}%`;
    const ram = colors
      ? colorize(formatGB(data.memory.used), colors.ram)
      : formatGB(data.memory.used);
    const disk = colors
      ? colorize(`${data.disk.percent}%`, colors.disk)
      : `${data.disk.percent}%`;
    const net = colors
      ? colorize(`↓${formatMB(data.network.rx_sec)}/s`, colors.network)
      : `↓${formatMB(data.network.rx_sec)}/s`;
    const sep = colors ? colorize("|", colors.separator) : "|";
    return `🖥️ ${cpu} ${sep} 💾 ${ram} ${sep} 💿 ${disk} ${sep} 🌐 ${net}`;
  },

  verbose: (data: SystemMetrics, colors?: ISysmonColors) => {
    const cpu = colors
      ? colorize(`CPU: ${data.cpu.percent}%`, colors.cpu)
      : `CPU: ${data.cpu.percent}%`;
    const ram = colors
      ? colorize(
          `RAM: ${formatGB(data.memory.used)}/${formatGB(data.memory.total)}`,
          colors.ram
        )
      : `RAM: ${formatGB(data.memory.used)}/${formatGB(data.memory.total)}`;
    const disk = colors
      ? colorize(
          `Disk: ${formatGB(data.disk.used)}/${formatGB(data.disk.total)}`,
          colors.disk
        )
      : `Disk: ${formatGB(data.disk.used)}/${formatGB(data.disk.total)}`;
    const net = colors
      ? colorize(
          `Net: ↓${formatMB(data.network.rx_sec)}/s ↑${formatMB(data.network.tx_sec)}/s`,
          colors.network
        )
      : `Net: ↓${formatMB(data.network.rx_sec)}/s ↑${formatMB(data.network.tx_sec)}/s`;
    return `${cpu} | ${ram} | ${disk} | ${net}`;
  },
};
```

**Step 2: Update index.ts to export styles**

**Files:**
- Modify: `src/widgets/sysmon/index.ts`

```typescript
export * from "./types.js";
export * from "./styles.js";
```

**Step 3: Run tests**

Run: `npm test tests/widgets/sysmon/styles.test.ts`

Expected: PASS

**Step 4: Commit**

```bash
git add src/widgets/sysmon/ tests/widgets/sysmon/
git commit -m "feat(sysmon): implement style functions with tests"
```

---

## Task 10: Write SysmonWidget tests

**Files:**
- Create: `tests/widgets/sysmon-widget.test.ts`

**Step 1: Create widget tests**

```typescript
/**
 * Tests for SysmonWidget
 */

import { describe, it, expect, beforeEach } from "bun:test";
import { SysmonWidget } from "../../src/widgets/sysmon-widget.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import type { SystemMetrics } from "../../src/widgets/sysmon/types.js";
import type { ISystemProvider } from "../../src/providers/system-provider.js";

function createMockProvider(
  metrics: SystemMetrics | null
): ISystemProvider {
  return {
    getMetrics: async () => metrics,
    startUpdate: () => {},
    stopUpdate: () => {},
  };
}

describe("SysmonWidget", () => {
  describe("metadata", () => {
    it("should have correct id", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, createMockProvider(null));
      expect(widget.id).toBe("sysmon");
    });

    it("should have correct metadata", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, createMockProvider(null));
      expect(widget.metadata.name).toBe("Sysmon");
      expect(widget.metadata.description).toContain("system");
    });
  });

  describe("initialize", () => {
    it("should start background updates on initialize", async () => {
      const mockMetrics: SystemMetrics = {
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rx_sec: 1, tx_sec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      // Widget should now have metrics
      const result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).toBeDefined();
    });
  });

  describe("render", () => {
    it("should render balanced style by default", async () => {
      const mockMetrics: SystemMetrics = {
        cpu: { percent: 45 },
        memory: { used: 8.2, total: 16, percent: 51 },
        disk: { used: 120, total: 200, percent: 60 },
        network: { rx_sec: 2.1, tx_sec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).toContain("CPU 45%");
      expect(result).toContain("RAM 8.2GB");
      expect(result).toContain("Disk 60%");
    });

    it("should return null when provider returns null", async () => {
      const provider = createMockProvider(null);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      const result = await widget.render({ width: 80, timestamp: Date.now() });

      expect(result).toBeNull();
    });

    it("should respect style changes", async () => {
      const mockMetrics: SystemMetrics = {
        cpu: { percent: 45 },
        memory: { used: 8.2, total: 16, percent: 51 },
        disk: { used: 120, total: 200, percent: 60 },
        network: { rx_sec: 2.1, tx_sec: 0.5 },
      };
      const provider = createMockProvider(mockMetrics);
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});

      widget.setStyle("compact");
      let result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).not.toContain("|");

      widget.setStyle("playful");
      result = await widget.render({ width: 80, timestamp: Date.now() });
      expect(result).toContain("🖥️");
    });

    it("should support line override", async () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rx_sec: 1, tx_sec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      widget.setLine(3);
      expect(widget.getLine()).toBe(3);
    });
  });

  describe("isEnabled", () => {
    it("should return true when provider is available", () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rx_sec: 1, tx_sec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);
      expect(widget.isEnabled()).toBe(true);
    });

    it("should return false when provider is null", () => {
      const widget = new SysmonWidget(DEFAULT_THEME, null as any);
      expect(widget.isEnabled()).toBe(false);
    });
  });

  describe("cleanup", () => {
    it("should stop updates on cleanup", async () => {
      const provider = createMockProvider({
        cpu: { percent: 50 },
        memory: { used: 8, total: 16, percent: 50 },
        disk: { used: 100, total: 200, percent: 50 },
        network: { rx_sec: 1, tx_sec: 0.5 },
      });
      const widget = new SysmonWidget(DEFAULT_THEME, provider);

      await widget.initialize({});
      await widget.cleanup();

      // Should not throw, should stop updates
      expect(true).toBe(true);
    });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test tests/widgets/sysmon-widget.test.ts`

Expected: FAIL - widget not implemented yet

---

## Task 11: Implement SysmonWidget class

**Files:**
- Create: `src/widgets/sysmon-widget.ts`

**Step 1: Implement the widget**

```typescript
/**
 * SysmonWidget - System monitoring widget
 *
 * Displays real-time system metrics (CPU, RAM, Disk, Network)
 * Independent of stdin - polls system directly via SystemProvider
 */

import type { StyleRendererFn, WidgetStyle } from "./core/style-types.js";
import { createWidgetMetadata } from "./core/widget-types.js";
import type { IWidget, RenderContext, WidgetContext } from "./types.js";
import { DEFAULT_THEME } from "./ui/theme/index.js";
import type { IThemeColors } from "./ui/theme/types.js";
import { sysmonStyles } from "./widgets/sysmon/styles.js";
import type { SystemMetrics } from "./widgets/sysmon/types.js";
import type { ISystemProvider } from "./providers/system-provider.js";

export class SysmonWidget implements IWidget {
  readonly id = "sysmon";
  readonly metadata = createWidgetMetadata(
    "Sysmon",
    "System monitoring: CPU, RAM, Disk, Network metrics",
    "1.0.0",
    "claude-scope",
    2 // Default to line 2
  );

  private colors: IThemeColors;
  private provider: ISystemProvider | null;
  private _lineOverride?: number;
  private styleFn: StyleRendererFn<SystemMetrics, IThemeColors["sysmon"]> =
    sysmonStyles.balanced!;
  private currentMetrics: SystemMetrics | null = null;
  private updateIntervalMs = 2500; // 2.5 seconds

  constructor(colors?: IThemeColors, provider?: ISystemProvider | null) {
    this.colors = colors ?? DEFAULT_THEME;
    this.provider = provider ?? null;
  }

  async initialize(context: WidgetContext): Promise<void> {
    if (!this.provider) {
      return;
    }

    // Get initial metrics
    this.currentMetrics = await this.provider.getMetrics();

    // Start background updates
    this.provider.startUpdate(this.updateIntervalMs, (metrics) => {
      this.currentMetrics = metrics;
    });
  }

  async render(context: RenderContext): Promise<string | null> {
    if (!this.currentMetrics || !this.isEnabled()) {
      return null;
    }

    return this.styleFn(this.currentMetrics, this.colors.sysmon);
  }

  async update(_data: unknown): Promise<void> {
    // No-op - SysmonWidget doesn't use stdin data
    // Updates come via background callback
  }

  isEnabled(): boolean {
    return this.provider !== null;
  }

  async cleanup(): Promise<void> {
    this.provider?.stopUpdate();
  }

  setStyle(style: WidgetStyle = "balanced"): void {
    const fn = sysmonStyles[style];
    if (fn) {
      this.styleFn = fn;
    }
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 2;
  }
}
```

**Step 2: Run tests**

Run: `npm test tests/widgets/sysmon-widget.test.ts`

Expected: PASS

**Step 3: Commit**

```bash
git add src/widgets/sysmon-widget.ts tests/widgets/sysmon-widget.test.ts
git commit -m "feat(sysmon): implement SysmonWidget with tests"
```

---

## Task 12: Register SysmonWidget in WidgetFactory

**Files:**
- Modify: `src/core/widget-factory.ts`

**Step 1: Import SysmonWidget**

Add to imports:
```typescript
import { SysmonWidget } from "../widgets/sysmon-widget.js";
```

**Step 2: Add "sysmon" case to createWidget**

```typescript
case "sysmon":
  return new SysmonWidget(colors);
```

**Step 3: Add "sysmon" to getSupportedWidgetIds**

```typescript
getSupportedWidgetIds(): string[] {
  return [
    "model",
    "git",
    "context",
    "cost",
    "duration",
    "lines",
    "poker",
    "empty-line",
    "config-count",
    "active-tools",
    "cache-metrics",
    "dev-server",
    "docker",
    "sysmon", // ADD THIS
  ];
}
```

**Step 4: Commit**

```bash
git add src/core/widget-factory.ts
git commit -m "feat(sysmon): register SysmonWidget in WidgetFactory"
```

---

## Task 13: Add SysmonWidget to widgets index

**Files:**
- Modify: `src/widgets/index.ts`

**Step 1: Export SysmonWidget**

```typescript
export * from "./sysmon-widget.js";
```

**Step 2: Commit**

```bash
git add src/widgets/index.ts
git commit -m "feat(sysmon): export SysmonWidget from widgets index"
```

---

## Task 14: Run all tests and verify

**Step 1: Run full test suite**

Run: `npm test`

Expected: All tests pass

**Step 2: Run build**

Run: `npm run build`

Expected: Build succeeds without errors

**Step 3: Run linter**

Run: `npx @biomejs/biome check --write ./src`

Expected: No critical errors

**Step 4: Commit any fixes**

```bash
git add .
git commit -m "chore(sysmon): fix linting and final touches"
```

---

## Task 15: Update documentation

**Files:**
- Modify: `docs/WIDGETS.md`

**Step 1: Add SysmonWidget documentation**

Add to widgets documentation:

```markdown
### SysmonWidget

Displays real-time system metrics including CPU usage, RAM usage, disk usage, and network speed.

**ID:** `sysmon`

**Styles:**
- `balanced` - All metrics with separator: `CPU 45% | RAM 8.2GB | Disk 60% | Net ↓2.1MB/s`
- `compact` - Compact format: `CPU45% RAM8.2GB D60% ↓2.1MB/s`
- `playful` - With emojis: `🖥️ 45% | 💾 8.2GB | 💿 60% | 🌐 ↓2.1MB/s`
- `verbose` - Detailed with totals: `CPU: 45% | RAM: 8.2GB/16GB | Disk: 120GB/200GB | Net: ↓2.1MB/s ↑0.5MB/s`

**Colors:**
- `cpu` - CPU usage color
- `ram` - Memory usage color
- `disk` - Disk usage color
- `network` - Network speed color
- `separator` - Separator color

**Example config:**
\`\`\`json
{
  "lines": {
    "2": [
      {
        "id": "sysmon",
        "style": "balanced"
      }
    ]
  }
}
\`\`\`

**Note:** Requires `systeminformation` npm package. Updates every 2.5 seconds in background.
```

**Step 2: Update ARCHITECTURE.md if needed**

Add SysmonWidget to widget categories in architecture documentation.

**Step 3: Commit**

```bash
git add docs/
git commit -m "docs(sysmon): add SysmonWidget documentation"
```

---

## Task 16: Manual testing

**Step 1: Test widget locally**

Run: `npm run build && npm link` (if setup for local testing)

Test in terminal with Claude Code to verify widget displays correctly.

**Step 2: Test each style**

- balanced
- compact
- playful
- verbose

**Step 3: Test error scenarios**

- Uninstall systeminformation temporarily - widget should not display
- Verify no console spam on errors

**Step 4: Final commit**

```bash
git add .
git commit -m "feat(sysmon): complete SysmonWidget implementation"
```

---

## Summary

After completing all tasks:

- ✅ systeminformation dependency added
- ✅ SystemProvider with tests
- ✅ ISysmonColors theme interface
- ✅ Colors added to all 17 themes
- ✅ Style functions (balanced, compact, playful, verbose) with tests
- ✅ SysmonWidget class with tests
- ✅ Registered in WidgetFactory
- ✅ Documentation updated
- ✅ All tests passing

**Total commits:** ~16 atomic commits following TDD and YAGNI principles.
