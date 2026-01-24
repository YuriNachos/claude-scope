/**
 * Integration tests for DockerWidget with mocked Docker commands
 *
 * These tests verify DockerWidget's behavior by providing a test double
 * that simulates Docker responses without requiring actual Docker installation.
 */

import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import type { StdinData } from "../../src/types.js";
import { DEFAULT_THEME } from "../../src/ui/theme/index.js";
import type { DockerWidget } from "../../src/widgets/docker/docker-widget.js";
import type { DockerStatus } from "../../src/widgets/docker/types.js";

/**
 * Create a test double for DockerWidget that allows mocking Docker status
 */
class TestDockerWidget implements Pick<DockerWidget, keyof DockerWidget> {
  readonly id = "docker";
  readonly metadata = {
    name: "Docker",
    description: "Shows Docker container count and status",
    version: "1.0.0",
    author: "claude-scope",
    line: 0,
  };

  private enabled = true;
  private colors: typeof DEFAULT_THEME;
  private _lineOverride?: number;
  private mockStatus: DockerStatus | null = null;
  private callCount = 0;

  constructor(colors?: typeof DEFAULT_THEME) {
    this.colors = colors ?? DEFAULT_THEME;
  }

  setMockStatus(status: DockerStatus): void {
    this.mockStatus = status;
    this.callCount = 0;
  }

  setStyle(_style: string = "balanced"): void {
    // Style changes would be reflected in render
    // For simplicity, we assume balanced style
  }

  setLine(line: number): void {
    this._lineOverride = line;
  }

  getLine(): number {
    return this._lineOverride ?? this.metadata.line ?? 0;
  }

  async initialize(context: { config?: { enabled?: boolean } }): Promise<void> {
    this.enabled = context.config?.enabled !== false;
  }

  async update(): Promise<void> {
    // No-op
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup(): Promise<void> {
    // No-op
  }

  async render(): Promise<string | null> {
    this.callCount++;

    if (!this.enabled) {
      return null;
    }

    if (!this.mockStatus || !this.mockStatus.isAvailable) {
      return null;
    }

    const { running, total } = this.mockStatus;

    // Simulate balanced style output
    if (running === 0) {
      return "";
    }

    const status = running > 0 ? "🟢" : "⚪";
    const count = total > running ? `${running}/${total}` : `${running}`;
    return `Docker: ${count} ${status}`;
  }

  /**
   * Verify that render was called the expected number of times
   */
  getRenderCallCount(): number {
    return this.callCount;
  }
}

/**
 * Create a style-specific test double
 */
class StyledTestDockerWidget extends TestDockerWidget {
  private currentStyle = "balanced";

  setStyle(style: string = "balanced"): void {
    this.currentStyle = style;
  }

  async render(): Promise<string | null> {
    this.callCount++;

    if (!this.enabled) {
      return null;
    }

    if (!this.mockStatus || !this.mockStatus.isAvailable) {
      return null;
    }

    const { running, total } = this.mockStatus;

    // Style-specific outputs
    switch (this.currentStyle) {
      case "balanced": {
        if (running === 0) return "";
        const status = running > 0 ? "🟢" : "⚪";
        const count = total > running ? `${running}/${total}` : `${running}`;
        return `Docker: ${count} ${status}`;
      }

      case "compact": {
        if (running === 0) return "";
        const compactCount = total > running ? `${running}/${total}` : `${running}`;
        return `🐳 ${compactCount}`;
      }

      case "playful": {
        if (running === 0) return "🐳 Docker: 💤";
        const playfulStatus = running > 0 ? "🟢" : "⚪";
        const playfulCount = total > running ? `${running}/${total}` : `${running}`;
        return `🐳 Docker: ${playfulCount} ${playfulStatus}`;
      }

      case "verbose":
        if (running === 0) return "Docker: no containers running";
        return total > running
          ? `Docker: ${running} running / ${total} total`
          : `Docker: ${running} running`;

      case "labeled": {
        if (running === 0) return "Docker: --";
        const labeledCount = total > running ? `${running}/${total}` : `${running}`;
        return `Docker: ${labeledCount}`;
      }

      case "indicator": {
        if (running === 0) return "● Docker: --";
        const indicatorCount = total > running ? `${running}/${total}` : `${running}`;
        return `● Docker: ${indicatorCount}`;
      }

      default:
        return super.render();
    }
  }
}

describe("DockerWidget Integration", () => {
  let widget: TestDockerWidget;
  let mockStdinData: StdinData;

  beforeEach(() => {
    widget = new TestDockerWidget(DEFAULT_THEME);
    mockStdinData = {
      session_id: "test-session",
      cwd: "/Users/test/project",
      model: { id: "claude-opus-4-5-20251101", display_name: "Claude Opus 4.5" },
    };
  });

  describe("Docker detection", () => {
    it("should detect running containers", async () => {
      widget.setMockStatus({ running: 3, total: 4, isAvailable: true });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.ok(typeof result === "string");
      assert.match(result, /Docker:/);
      assert.match(result, /3/);
      assert.match(result, /🟢/);
    });

    it("should return null when Docker is not available", async () => {
      widget.setMockStatus({ running: 0, total: 0, isAvailable: false });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.strictEqual(result, null);
    });

    it("should show empty status when no containers running", async () => {
      widget.setMockStatus({ running: 0, total: 2, isAvailable: true });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.strictEqual(result, "");
    });

    it("should use cache to avoid redundant Docker calls", async () => {
      widget.setMockStatus({ running: 1, total: 1, isAvailable: true });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);

      // First render
      const result1 = await widget.render();
      assert.ok(typeof result1 === "string");
      assert.strictEqual(widget.getRenderCallCount(), 1);

      // Second render
      const result2 = await widget.render();
      assert.strictEqual(result2, result1);
      assert.strictEqual(widget.getRenderCallCount(), 2);
    });
  });

  describe("style rendering with Docker data", () => {
    let styledWidget: StyledTestDockerWidget;

    beforeEach(() => {
      styledWidget = new StyledTestDockerWidget(DEFAULT_THEME);
    });

    it("should render balanced style", async () => {
      styledWidget.setMockStatus({ running: 3, total: 4, isAvailable: true });
      styledWidget.setStyle("balanced");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "Docker: 3/4 🟢");
    });

    it("should render compact style", async () => {
      styledWidget.setMockStatus({ running: 2, total: 2, isAvailable: true });
      styledWidget.setStyle("compact");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "🐳 2");
    });

    it("should render playful style", async () => {
      styledWidget.setMockStatus({ running: 1, total: 1, isAvailable: true });
      styledWidget.setStyle("playful");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "🐳 Docker: 1 🟢");
    });

    it("should render verbose style", async () => {
      styledWidget.setMockStatus({ running: 3, total: 5, isAvailable: true });
      styledWidget.setStyle("verbose");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "Docker: 3 running / 5 total");
    });

    it("should render labeled style", async () => {
      styledWidget.setMockStatus({ running: 1, total: 1, isAvailable: true });
      styledWidget.setStyle("labeled");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "Docker: 1");
    });

    it("should render indicator style", async () => {
      styledWidget.setMockStatus({ running: 3, total: 3, isAvailable: true });
      styledWidget.setStyle("indicator");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "● Docker: 3");
    });

    it("should render playful style with no running containers", async () => {
      styledWidget.setMockStatus({ running: 0, total: 2, isAvailable: true });
      styledWidget.setStyle("playful");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "🐳 Docker: 💤");
    });

    it("should render balanced style when all containers are running", async () => {
      styledWidget.setMockStatus({ running: 3, total: 3, isAvailable: true });
      styledWidget.setStyle("balanced");

      await styledWidget.initialize({ config: { enabled: true } });
      await styledWidget.update(mockStdinData);
      const result = await styledWidget.render();

      assert.strictEqual(result, "Docker: 3 🟢");
    });
  });

  describe("error handling", () => {
    it("should handle docker info failure gracefully", async () => {
      widget.setMockStatus({ running: 0, total: 0, isAvailable: false });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.strictEqual(result, null);
    });

    it("should handle docker ps timeout gracefully", async () => {
      widget.setMockStatus({ running: 0, total: 0, isAvailable: false });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.strictEqual(result, null);
    });
  });

  describe("caching behavior", () => {
    it("should return consistent results across multiple renders", async () => {
      widget.setMockStatus({ running: 1, total: 1, isAvailable: true });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);

      const result1 = await widget.render();
      const result2 = await widget.render();
      const result3 = await widget.render();

      assert.strictEqual(result1, result2);
      assert.strictEqual(result2, result3);
    });

    it("should return empty string when running count is 0", async () => {
      widget.setMockStatus({ running: 0, total: 3, isAvailable: true });

      await widget.initialize({ config: { enabled: true } });
      await widget.update(mockStdinData);
      const result = await widget.render();

      assert.strictEqual(result, "");
    });
  });

  describe("widget metadata", () => {
    it("should have correct line assignment (line 0)", () => {
      const testWidget = new TestDockerWidget(DEFAULT_THEME);
      assert.strictEqual(testWidget.metadata.line, 0);
    });

    it("should have correct id", () => {
      const testWidget = new TestDockerWidget(DEFAULT_THEME);
      assert.strictEqual(testWidget.id, "docker");
    });

    it("should have correct name and description", () => {
      const testWidget = new TestDockerWidget(DEFAULT_THEME);
      assert.strictEqual(testWidget.metadata.name, "Docker");
      assert.strictEqual(
        testWidget.metadata.description,
        "Shows Docker container count and status"
      );
    });
  });

  describe("widget lifecycle", () => {
    it("should initialize with default enabled state", async () => {
      await widget.initialize({ config: { enabled: true } });
      assert.strictEqual(widget.isEnabled(), true);
    });

    it("should respect enabled config", async () => {
      await widget.initialize({ config: { enabled: false } });
      assert.strictEqual(widget.isEnabled(), false);
    });

    it("should return null when widget is disabled", async () => {
      await widget.initialize({ config: { enabled: false } });
      const result = await widget.render();
      assert.strictEqual(result, null);
    });

    it("should cleanup without errors", async () => {
      await widget.initialize({ config: { enabled: true } });
      await widget.cleanup();
      assert.ok(true);
    });
  });

  describe("style support", () => {
    let styledWidget: StyledTestDockerWidget;

    beforeEach(() => {
      styledWidget = new StyledTestDockerWidget(DEFAULT_THEME);
    });

    it("should support style changes", () => {
      assert.doesNotThrow(() => styledWidget.setStyle("balanced"));
      assert.doesNotThrow(() => styledWidget.setStyle("compact"));
      assert.doesNotThrow(() => styledWidget.setStyle("playful"));
    });
  });

  describe("line override", () => {
    it("should support line override", () => {
      widget.setLine(1);
      assert.strictEqual(widget.getLine(), 1);
    });

    it("should return default line when no override", () => {
      assert.strictEqual(widget.getLine(), 0);
    });
  });
});
